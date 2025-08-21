import React from 'react';
import { assets } from '../../assets/assets'; // ✅ FIXED: Import assets

const CallToAction = () => {
  return (
    <div className="flex flex-col items-center gap-4 pt-10 pb-24 px-8 md:px-24">
      <h1 className="text-xl md:text-4xl text-gray-800 font-semibold">
        Learn anything, anytime, anywhere
      </h1>

      <p className="text-gray-500 text-center sm:text-sm max-w-2xl">
        Incididunt sint fugiat pariatur cupidatat consectetur sit
        cillum anim id veniam aliqua proident excepteur commodo do
        ea.
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
        <button className="px-6 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition">
          Get Started
        </button>

        <button className="flex items-center gap-2 border border-blue-600 text-blue-600 px-6 py-2 rounded-md hover:bg-blue-50 transition">
          Learn More
          <img src={assets.arrow_icon} alt="arrow_icon" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CallToAction;
