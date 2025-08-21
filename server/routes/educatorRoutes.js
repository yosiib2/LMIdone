import express from 'express';
import { 
  addCourse, 
  educatorDashboardData, 
  getEducatorCourses, 
  getEnrolledStudentsData, 
  updateRoleToEducator 
} from '../controllers/educatorController.js';
import upload from '../configs/multer.js';
import { protectEducator } from '../middlewares/authMiddleware.js';
// import { requireAuth } from '@clerk/express'; // Removed for testing

const educatorRouter = express.Router();

// Add Educator Role
// Removed requireAuth() so we can test without authentication
educatorRouter.get('/update-role', updateRoleToEducator);

// Add New Course (with image upload and educator protection)
educatorRouter.post('/add-course', protectEducator, upload.single('image'), addCourse);

// Get Educator Courses
educatorRouter.get('/courses', protectEducator, getEducatorCourses);

// Get Educator Dashboard Data
educatorRouter.get('/dashboard', protectEducator, educatorDashboardData);

// Get Enrolled Students Data
educatorRouter.get('/enrolled-students', protectEducator, getEnrolledStudentsData);

export default educatorRouter;
