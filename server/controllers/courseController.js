import Course from "../models/Course.js";

// ✅ Get All Courses
export const getAllCourse = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .select(["-courseContent", "-enrolledStudents"]) // exclude large fields
      .populate({ path: "educator" });

    res.json({ success: true, courses });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get Course by ID
export const getCourseId = async (req, res) => {
  const { id } = req.params;

  try {
    const courseData = await Course.findById(id).populate({ path: "educator" });

    if (!courseData) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    // ✅ Only modify courseContent if it exists
    if (Array.isArray(courseData.courseContent)) {
      courseData.courseContent.forEach((chapter) => {
        if (Array.isArray(chapter.chapterContent)) {
          chapter.chapterContent.forEach((lecture) => {
            if (!lecture.isPreviewFree) {
              lecture.lectureUrl = "";
            }
          });
        }
      });
    }

    res.json({ success: true, courseData });
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
