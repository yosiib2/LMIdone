// src/pages/MyEnrollments.jsx
import {Line} from 'rc-progress'
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Add this
import { AppContext } from '../../context/AppContext';
import Footer from '../../components/student/Footer';

const MyEnrollments = () => {
  const { enrolledCourses, calculateCourseDuration } = useContext(AppContext);
  const navigate = useNavigate(); // ✅ Local navigate setup

  const [progressArray, setProgressArray] = useState([
    { lectureCompleted: 2, totalLectures: 4 },
    { lectureCompleted: 1, totalLectures: 5 },
    { lectureCompleted: 3, totalLectures: 6 },
    { lectureCompleted: 4, totalLectures: 4 },
    { lectureCompleted: 0, totalLectures: 3 },
    { lectureCompleted: 5, totalLectures: 7 },
    { lectureCompleted: 6, totalLectures: 8 },
    { lectureCompleted: 2, totalLectures: 6 },
    { lectureCompleted: 4, totalLectures: 10 },
    { lectureCompleted: 4, totalLectures: 5 },
    { lectureCompleted: 7, totalLectures: 7 },
    { lectureCompleted: 1, totalLectures: 5 },
    { lectureCompleted: 0, totalLectures: 2 },
    { lectureCompleted: 5, totalLectures: 5 }
  ]);

  return (
    <>
      <div className='md:px-36 px-8 pt-10'>
        <h1 className='text-2xl font-semibold'>My Enrollment</h1>
        <table className='md:table-auo table-fixed w-full overflow-hidden border mt-10'>
          <thead className='text-gray-900 border-b border-gray-500/20 text-sm text-left max-sm:hidden'>
            <tr>
              <th className='px-4 py-3 font-semibold truncate'>Course</th>
              <th className='px-4 py-3 font-semibold truncate'>Duration</th>
              <th className='px-4 py-3 font-semibold truncate'>Completed</th>
              <th className='px-4 py-3 font-semibold truncate'>Status</th>
            </tr>
          </thead>
          <tbody>
            {enrolledCourses.map((course, index) => {
              const progress = progressArray[index];
              const isCompleted = progress?.lectureCompleted === progress?.totalLectures;

              return (
                <tr key={index}>
                  <td className='px-4 py-3'>
                    <img src={course.courseThumbnail} alt="" className='w-14 sm:w-24 md:w-28' />
                    <div>
                      <p>{course.courseTitle}</p>
                      <Line strokeWidth={2} percent={progressArray[index] ? (progressArray[index].lectureCompleted * 100)/ progressArray [index].totalLectures: 0} className='bg-gray-300 rounded-full' />
                    </div>
                  </td>
                  <td className='px-4 py-3'>{calculateCourseDuration(course)}</td>
                  <td className='px-4 py-3 max-sm:hidden'>
                    {progress && `${progress.lectureCompleted}/${progress.totalLectures}`}
                    <span> Lectures</span>
                  </td>
                  <td className='px-4 py-3'>
                    <button
                      onClick={() => navigate('/player/' + course._id)} // ✅ now works
                      className={`px-3 sm:px-5 py-1.5 sm:py-2 max-sm:text-xs text-white rounded transition-all duration-300 hover:scale-105 ${
                        isCompleted ? 'bg-green-600' : 'bg-red-600'
                      }`}
                    >
                      {isCompleted ? '✔️ Completed' : '⏳ On Going'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  );
};

export default MyEnrollments;
