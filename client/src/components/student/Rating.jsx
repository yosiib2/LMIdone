import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const Rating = ({ initialRating = 0, onRate }) => {
  const [rating, setRating] = useState(initialRating);

  const handleRating = (value) => {
    setRating(value);
    if (onRate) onRate(value);
  };

  useEffect(() => {
    if (initialRating !== undefined) {
      setRating(initialRating);
    }
  }, [initialRating]);

  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;
        return (
          <span
            key={index}
            onClick={() => handleRating(starValue)}
            className={`text-xl sm:text-2xl cursor-pointer transition-colors ${
              starValue <= rating ? 'text-yellow-500' : 'text-gray-400'
            }`}
          >
            &#9733;
          </span>
        );
      })}
    </div>
  );
};

// Optional: prop type checking
Rating.propTypes = {
  initialRating: PropTypes.number,
  onRate: PropTypes.func,
};

export default Rating;
