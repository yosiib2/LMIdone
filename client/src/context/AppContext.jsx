// src/context/AppContext.jsx
import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets"; // ✅ Make sure dummyCourses is an array
import humanizeDuration from "humanize-duration";
import { useAuth, useUser } from "@clerk/clerk-react";

// Create context
export const AppContext = createContext();

// Provider component
export const AppContextProvider = ({ children }) => {
  const { getToken } = useAuth();
  const { user } = useUser();

  const [allCourses, setAllCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]); // ✅ Moved here

  // ✅ Get isEducator from localStorage on first load
  const [isEducatorState, setIsEducatorState] = useState(() => {
    const stored = localStorage.getItem("isEducator");
    return stored === "true";
  });

  // Fetch user enrolled Courses
  const fetchUserEnrolledCourses = async () => {
    setEnrolledCourses(dummyCourses);
  };

  // ✅ Sync again on mount (with fix to always fetch)
  useEffect(() => {
    const stored = localStorage.getItem("isEducator");
    setIsEducatorState(stored === "true");
    fetchUserEnrolledCourses(); // ✅ Always fetch enrolled courses
  }, []);

  // ✅ Set isEducator in localStorage
  const setIsEducator = (value) => {
    localStorage.setItem("isEducator", value);
    setIsEducatorState(value);
  };

  // ✅ Rating calculator
  const calculateRating = (course) => {
    if (!course.courseRatings || course.courseRatings.length === 0) return 0;
    const total = course.courseRatings.reduce((sum, r) => sum + r.rating, 0);
    return total / course.courseRatings.length;
  };

  // ✅ Time for one chapter
  const calculateChapterTime = (chapter) => {
    let time = 0;
    chapter.chapterContent?.forEach((lecture) => {
      time += lecture.lectureDuration;
    });
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  // ✅ Total course duration
  const calculateCourseDuration = (course) => {
    let time = 0;
    course.courseContent?.forEach((chapter) =>
      chapter.chapterContent?.forEach((lecture) => {
        time += lecture.lectureDuration;
      })
    );
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  // ✅ Total lecture count
  const calculateNoOfLectures = (course) => {
    let totalLectures = 0;
    course.courseContent?.forEach((chapter) => {
      if (Array.isArray(chapter.chapterContent)) {
        totalLectures += chapter.chapterContent.length;
      }
    });
    return totalLectures;
  };

  // ✅ Currency from .env
  const currency = import.meta.env.VITE_CURRENCY;

  // ✅ Load dummy courses once
  useEffect(() => {
    setAllCourses(dummyCourses);
  }, []);

  const logToken = async () => {
    try {
      console.log(await getToken());
    } catch (error) {
      console.error("Failed to get token:", error);
    }
  };

  useEffect(() => {
    if (user) {
      logToken();
    }
  }, [user]);

  // ✅ Provide values
  const value = {
    currency,
    allCourses,
    calculateRating,
    calculateChapterTime,
    calculateCourseDuration,
    calculateNoOfLectures,
    isEducator: isEducatorState,
    setIsEducator,
    enrolledCourses,
    fetchUserEnrolledCourses,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
