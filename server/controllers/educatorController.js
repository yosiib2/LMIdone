import { clerkClient } from '@clerk/express';
import Course from '../models/Course.js';
import { v2 as cloudinary } from 'cloudinary';
import Purchase from '../models/Purchase.js';
import User from '../models/User.js';

// Update role to educator
export const updateRoleToEducator = async (req, res) => {
  try {
    const userId = req.auth.userId;
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { role: 'educator' }
    });
    res.json({ success: true, message: 'You can publish a course now' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add New Course
export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file;
    const educatorId = req.auth.userId;

    if (!imageFile) {
      return res.status(400).json({ success: false, message: 'Thumbnail Not Attached' });
    }

    // Parse JSON string from form-data
    let parsedCourseData;
    try {
      parsedCourseData = JSON.parse(courseData);
    } catch {
      return res.status(400).json({ success: false, message: 'Invalid courseData JSON' });
    }

    parsedCourseData.educator = educatorId;

    // Upload image to Cloudinary first
    const imageUpload = await cloudinary.uploader.upload(imageFile.path);

    parsedCourseData.courseThumbnail = imageUpload.secure_url;

    const newCourse = await Course.create(parsedCourseData);

    res.json({ success: true, message: 'Course Added', course: newCourse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Educator Courses
export const getEducatorCourses = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });
    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Educator Dashboard Data
export const educatorDashboardData = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });
    const totalCourses = courses.length;

    const courseIds = courses.map(course => course._id);

    // Calculate total earnings from purchases
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: 'completed'
    });

    const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

    // Collect enrolled student data
    const enrolledStudentsData = [];
    for (const course of courses) {
      const students = await User.find(
        { _id: { $in: course.enrolledStudents } },
        'name imageUrl'
      );
      students.forEach(student => {
        enrolledStudentsData.push({
          courseTitle: course.courseTitle,
          student
        });
      });
    }

    res.json({
      success: true,
      dashboardData: {
        totalEarnings,
        enrolledStudentsData,
        totalCourses
      }
    });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Enrolled Students Data with Purchase Data (fixed for string userId)
export const getEnrolledStudentsData = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });
    const courseIds = courses.map(course => course._id);

    // Get purchases (completed)
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: 'completed'
    });

    // Manually fetch user and course info
    const enrolledStudents = [];
    for (const purchase of purchases) {
      const student = await User.findById(purchase.userId, 'name imageUrl');
      const course = await Course.findById(purchase.courseId, 'courseTitle');

      if (student && course) {
        enrolledStudents.push({
          student,
          courseTitle: course.courseTitle,
          purchaseData: purchase.createdAt
        });
      }
    }

    res.json({
      success: true,
      enrolledStudents
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
