// src/components/student/CourseCard.jsx
import React, { useContext } from 'react';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
  const { currency, calculateRating } = useContext(AppContext);

  // Calculate discounted price
  const discountedPrice = (
    course.coursePrice - 
    (course.discount * course.coursePrice) / 100
  ).toFixed(2);

  const rating = calculateRating(course);

  return (
    <Link
      to={`/course/${course._id}`}
      onClick={() => scrollTo(0, 0)}
      className="border border-gray-500/30 pb-6 overflow-hidden rounded-lg shadow-sm hover:shadow-md transition"
    >
      <img
        src={course.courseThumbnail}
        alt={course.courseTitle}
        className="w-full h-48 object-cover"
      />
      <div className="p-3 text-left">
        <h3 className="text-lg font-semibold text-gray-800">
          {course.courseTitle}
        </h3>
        <p className="text-sm text-gray-500 mb-2">jungleStack</p>

        <div className="flex items-center space-x-2 mb-2">
          <p>{rating.toFixed(1)}</p>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={i < Math.floor(rating) ? assets.star : assets.star_blank}
                alt="star"
                className="w-3.5 h-3.5"
              />
            ))}
          </div>
          <p className="text-gray-500">{course.courseRatings.length}</p>
        </div>

        <p className="text-base font-semibold text-gray-800">
          {currency}{discountedPrice}
        </p>
      </div>
    </Link>
  );
};

export default CourseCard;

