import React from 'react';
import { assets } from '../../assets/assets';

const Footer = () => {
  return (
    <footer className="bg-gray-900 md:px-36 text-left w-full mt-10 text-white">
      <div className="flex flex-col md:flex-row items-start px-8 md:px-0 justify-center gap-10 md:gap-32 py-10 border-b border-white/30">
        
        {/* Logo and description */}
        <div className="flex flex-col md:items-start items-center w-full gap-4">
          <img src={assets.logo_dark} alt="logo" className="w-36" />
          <p className="mt-6 text-center md:text-left text-sm text-white/80">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            Lorem Ipsum has been the industry's standard dummy text.
          </p>
        </div>

        {/* Company links aligned to left */}
        <div className='flex flex-col items-start w-full'>
          <h2 className='font-semibold text-white mb-5'>Company</h2>
          <ul className='flex md:flex-col flex-wrap w-full text-sm text-white/80 md:space-y-2 gap-x-6'>
            <li><a href="#">Home</a></li>
            <li><a href="#">About us</a></li>
            <li><a href="#">Contact us</a></li>
            <li><a href="#">Privacy policy</a></li>
          </ul>
        </div>

        {/* Newsletter Section FIXED ✅ */}
        <div className='flex flex-col items-start w-full'>
          <h2 className='font-semibold text-white mb-5'>Subscribe to our newsletter</h2>
          <p className='text-sm text-white/80'>
            The latest news, articles, and resources, sent to your inbox weekly.
          </p>
          <div className='flex items-center gap-2 pt-4'>
            <input
              type="email"
              placeholder='Enter your email'
              className='border border-gray-500/30 bg-gray-800 text-gray-500
              placeholder-gray-500 outline-none w-64 h-9 rounded px-2 text-sm'
            />
            <button className='bg-blue-600 w-24 h-9 text-white rounded'>Subscribe</button>
          </div>
        </div>

        {/* Optional Placeholder for future content */}
        <div className="flex-1 hidden md:block"></div>
      </div>

      <p className="py-4 text-center text-xs md:text-sm text-white/60">
        © 2025 junglestack. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
