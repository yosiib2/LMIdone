// src/components/student/CoursesSection.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import CourseCard from './CourseCard';
import { AppContext } from '../../context/AppContext'; // ✅ Import AppContext

const CoursesSection = () => {
  const { allCourses } = useContext(AppContext);

  return (
    <div className="py-20 px-6 md:px-40 bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <h2 className="text-4xl font-bold text-gray-800 mb-4">Learn from Top Experts</h2>

      <p className="text-base md:text-lg text-gray-600 mb-8 max-w-2xl">
        Explore our most-loved courses in categories like programming, design, business, and wellness —
        each crafted to empower you with real-world skills and results.
      </p>

      <div className="grid grid-cols-4 md:my-16 my-10 gap-4 ">
        {allCourses.slice(0, 4).map((course, index) => (
          <CourseCard key={index} course={course} /> // ✅ Pass course prop
        ))}
      </div>

      <Link
        to="/course-list"
        onClick={() => scrollTo(0, 0)}
        className="inline-block bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 px-8 py-3 rounded-lg shadow-md"
      >
        View All Courses
      </Link>
    </div>
  );
};

export default CoursesSection;
