import React, { useContext } from 'react';
import { assets } from '../../assets/assets';
import { Link, useLocation, useMatch, useNavigate } from 'react-router-dom';
import { useClerk, useUser, UserButton } from '@clerk/clerk-react';
import { AppContext } from '../../context/AppContext';

const Navbar = () => {
  const { isEducator, setIsEducator } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isEducatorRoute = useMatch('/educator/*');

  const { openSignIn } = useClerk();
  const { isLoaded, isSignedIn } = useUser();

  if (isEducatorRoute) return null;

  return (
    <div className="flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-yellow-400 bg-gradient-to-r from-amber-100 via-yellow-200 to-amber-300 backdrop-blur-md shadow-md py-4 sticky top-0 z-50">
      {/* Logo */}
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt="logo"
        className="w-28 lg:w-32 cursor-pointer hover:scale-105 transition-transform duration-200 rounded-full"
      />

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-6 text-yellow-800 font-semibold">
        <div className="flex items-center gap-5">
          {isSignedIn && (
            <>
              <button
                onClick={() => {
                  setIsEducator(true);
                  navigate('/educator');
                }}
                className="hover:text-yellow-600 transition-colors duration-200"
              >
                {isEducator ? 'Educator Dashboard' : 'Become Educator'}
              </button>
              <span className="text-yellow-500">|</span>
              <Link
                to="/my-enrollments"
                className="hover:text-yellow-600 transition-colors duration-200"
              >
                My Enrollments
              </Link>
            </>
          )}
        </div>

        {isLoaded ? (
          isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <button
              onClick={() => openSignIn()}
              className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-6 py-2 rounded-full shadow-lg hover:brightness-110 transition-all duration-200"
            >
              Create Account
            </button>
          )
        ) : null}
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex items-center gap-2 sm:gap-5 text-yellow-800">
        {isSignedIn && (
          <div className="flex items-center gap-2 max-sm:text-xs">
            <button
              onClick={() => {
                setIsEducator(true);
                navigate('/educator');
              }}
              className="hover:text-yellow-600 transition-colors duration-200"
            >
              {isEducator ? 'Dashboard' : 'Educator'}
            </button>
            <Link
              to="/my-enrollments"
              className="hover:text-yellow-600 transition-colors duration-200"
            >
              My Enrollments
            </Link>
          </div>
        )}

        {isLoaded ? (
          isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <button onClick={() => openSignIn()}>
              <img src={assets.user_icon} alt="user icon" />
            </button>
          )
        ) : null}
      </div>
    </div>
  );
};

export default Navbar;
