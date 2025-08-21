// src/pages/Player.jsx
import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { useParams } from 'react-router-dom';
import { assets } from '../../assets/assets';
import humanizeDuration from 'humanize-duration';
import YouTube from 'react-youtube';
import Footer from '../../components/student/Footer';
import Rating from '../../components/student/Rating';

const Player = () => {
  const { enrolledCourses, calculateChapterTime } = useContext(AppContext);
  const { courseId } = useParams();

  const [courseData, setCourseData] = useState(null);
  const [openChapters, setOpenChapters] = useState([]);
  const [playerData, setPlayerData] = useState(null);
  const [completedLectures, setCompletedLectures] = useState([]); // ✅ New state

  const getCourseData = () => {
    const course = enrolledCourses.find((course) => course._id === courseId);
    if (course) {
      setCourseData(course);
    }
  };

  const toggleChapter = (index) => {
    setOpenChapters((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  useEffect(() => {
    getCourseData();
  }, [enrolledCourses]);

  const markLectureComplete = (lectureUrl) => {
    if (!completedLectures.includes(lectureUrl)) {
      setCompletedLectures((prev) => [...prev, lectureUrl]);
    }
  };

  return (
    <div>
      <div className='p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-30'>
        {/* Left column - Course Structure */}
        <div className='text-gray-800'>
          <h2 className='text-xl font-semibold'>Course Structure</h2>
          <div className='pt-5 space-y-4'>
            {courseData &&
              courseData.courseContent.map((chapter, index) => {
                const isOpen = openChapters.includes(index);
                return (
                  <div
                    key={index}
                    className='border border-gray-300 bg-white mb-2 rounded overflow-hidden'
                  >
                    <div
                      className='flex items-center justify-between px-4 py-3 cursor-pointer select-none'
                      onClick={() => toggleChapter(index)}
                    >
                      <img
                        src={assets.down_arrow_icon}
                        alt='arrow icon'
                        className={`w-4 h-4 transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                      />
                      <p className='font-medium md:text-base text-sm'>
                        {chapter.chapterTitle}
                      </p>
                      <p className='text-sm text-gray-500'>
                        {chapter.chapterContent.length} lectures -{' '}
                        {calculateChapterTime(chapter)}
                      </p>
                    </div>

                    {isOpen && (
                      <div className='px-5 pb-4 text-sm text-gray-700'>
                        <ul className='space-y-3'>
                          {chapter.chapterContent.map((lecture, i) => (
                            <li key={i} className='flex gap-3 items-start'>
                              <img
                                src={
                                  completedLectures.includes(lecture.lectureUrl)
                                    ? assets.blue_tick_icon
                                    : assets.play_icon
                                }
                                alt='icon'
                                className='w-4 h-4 mt-1'
                              />
                              <div className='flex flex-col w-full'>
                                <div className='flex justify-between'>
                                  <p className='font-medium text-gray-800'>
                                    {lecture.lectureTitle}
                                  </p>
                                  <div className='flex items-center gap-2 text-xs text-gray-500'>
                                    {lecture.lectureUrl && (
                                      <span
                                        className='text-green-600 font-semibold cursor-pointer'
                                        onClick={() =>
                                          setPlayerData({
                                            ...lecture,
                                            chapter: index + 1,
                                            lecture: i + 1,
                                          })
                                        }
                                      >
                                        Preview
                                      </span>
                                    )}
                                    <span>
                                      {humanizeDuration(
                                        lecture.lectureDuration * 60 * 1000,
                                        { units: ['h', 'm'], round: true }
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
          <div className='flex items-center gap-2 py-3 mt-10'>
            <h1 className='text-xl font-bold'>
              Rate this Course:
            </h1>
            <Rating initialRating={0} />
          </div>
        </div>

        {/* Right column - Video Player */}
        <div className='md:mt-10'>
          {playerData ? (
            <div>
              {/* ✅ Big Lecture Title Above Video */}
              <h2 className='text-2xl font-bold mb-2'>
                {playerData.lectureTitle}
              </h2>

              <YouTube
                videoId={playerData.lectureUrl.split('/').pop()}
                opts={{ width: '100%', playerVars: { autoplay: 1 } }}
                className='w-full aspect-video'
              />

              <div className='mt-3'>
                <p className='text-lg font-semibold'>
                  {playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}
                </p>

                {/* ✅ Mark Complete Button / Status */}
                {completedLectures.includes(playerData.lectureUrl) ? (
                  <p className='mt-2 text-green-600 font-semibold'>
                    ✅ Marked as Complete
                  </p>
                ) : (
                  <button
                    className='mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700'
                    onClick={() => markLectureComplete(playerData.lectureUrl)}
                  >
                    Mark Complete
                  </button>
                )}
              </div>
            </div>
          ) : (
            <img
              src={courseData ? courseData.courseThumbnail : ''}
              alt='Course Thumbnail'
              className='w-full rounded'
            />
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Player;
