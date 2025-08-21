// src/components/student/SearchBar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ data }) => {
  const [searchInput, setSearchInput] = useState(data || '');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    if (trimmed) {
      navigate(`/course-list/${trimmed}`);
    } else {
      navigate('/course-list');
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-md">
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search courses"
        className="flex-grow px-4 py-2 border border-gray-300 rounded-l"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
