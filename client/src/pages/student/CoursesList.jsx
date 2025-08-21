// src/pages/student/CoursesList.jsx
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SearchBar from '../../components/student/SearchBar';
import CourseCard from '../../components/student/CourseCard';
import { AppContext } from '../../context/AppContext'; // ✅ import context
import { assets } from '../../assets/assets';
import Footer from '../../components/student/Footer'; // ✅ FIX: import Footer component

const CoursesList = () => {
  const navigate = useNavigate(); // ✅ correct hook usage
  const { allCourses } = useContext(AppContext); // ✅ read from context
  const { input } = useParams(); // ✅ get input from route
  const [filteredCourse, setFilteredCourse] = useState([]);

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const tempCourses = allCourses.slice();
      input
        ? setFilteredCourse(
            tempCourses.filter(item =>
              item.courseTitle.toLowerCase().includes(input.toLowerCase())
            )
          )
        : setFilteredCourse(tempCourses);
    }
  }, [allCourses, input]);

  return (
    <>
      <div className='relative md:px-36 px-8 pt-20 text-left'>
        <div className='flex md:flex-row flex-col gap-6 items-start justify-between w-full'>
          {/* Title and Breadcrumb */}
          <div>
            <h1 className='text-4xl font-semibold text-gray-800'>Course List</h1>
            <p className='text-gray-500'>
              <span
                className='text-blue-600 cursor-pointer hover:underline'
                onClick={() => navigate('/')}
              >
                Home
              </span>{' '}
              / <span>Course List</span>
            </p>
          </div>

          {/* Search Bar */}
          <SearchBar data={input || ''} />
        </div>

        {
          input && (
            <div className='inline-flex items-center gap-4 px-4 py-2 border mt-8 -mb-8 text-gray-600'>
              <p>{input}</p>
              <img
                src={assets.cross_icon}
                alt=""
                className='cursor-pointer'
                onClick={() => navigate('/course-list')}
              />
            </div>
          )
        }

        {/* Course Cards */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10'>
          {allCourses && allCourses.length > 0 ? (
            filteredCourse.map((course, index) => (
              <CourseCard key={index} course={course} />
            ))
          ) : (
            <p className="text-gray-500 mt-10">No courses found.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CoursesList;
