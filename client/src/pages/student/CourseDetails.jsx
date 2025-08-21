import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import Loading from '../../components/student/Loading';
import { assets } from '../../assets/assets';
import humanizeDuration from 'humanize-duration';
import Footer from '../../components/student/Footer';
import YouTube from 'react-youtube';

const CourseDetails = () => {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [openChapters, setOpenChapters] = useState([]);
  const { allCourses, calculateRating, currency, calculateCourseDuration, calculateNoOfLectures } = useContext(AppContext);
  const [isAlreadyEnrolled, setisAlreadyEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState(null);

  const calculateChapterTime = (chapter) => {
    let total = 0;
    chapter.chapterContent.forEach(content => {
      const duration = Number(content.lectureDuration);
      if (!isNaN(duration)) {
        total += duration;
      }
    });
    return `${total} min`;
  };

  const fetchCourseData = async () => {
    const findCourse = allCourses.find(course => course._id === id);
    setCourseData(findCourse);
  };

  useEffect(() => {
    fetchCourseData();
  }, [id, allCourses]);

  const toggleChapter = (index) => {
    setOpenChapters(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return courseData ? (
    <>
      <div className='flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-30 pt-20 text-left'>
        <div className='absolute top-0 left-0 w-full h-section-height -z-1 bg-gradient-to-b from-cyan-100/70'></div>

        {/* Left Column */}
        <div className='max-w-xl z-10 text-gray-500'>
          <h1 className='md:text-course-deatails-heading-large text-course-deatails-heading-samll font-semibold text-gray-800'>
            {courseData.courseTitle}
          </h1>

          <p
            className='pt-4 md:text-base text-sm'
            dangerouslySetInnerHTML={{ __html: courseData.courseDescription.slice(0, 200) }}
          ></p>

          {/* Ratings & Reviews */}
          <div className="flex items-center space-x-2 pt-3 pb-1 text-sm">
            <p>{calculateRating(courseData)}</p>
            <div className="flex">
              {[...Array(5)].map((_, i) => {
                const rating = calculateRating(courseData);
                return (
                  <img
                    key={i}
                    src={i < Math.floor(rating) ? assets.star : assets.star_blank}
                    alt="star"
                    className="w-3.5 h-3.5"
                  />
                );
              })}
            </div>
            <p className="text-blue-500">
              ({courseData.courseRatings.length} {courseData.courseRatings.length > 1 ? 'ratings' : 'rating'})
            </p>
            <p>
              {courseData.enrolledStudents.length} {courseData.enrolledStudents.length > 1 ? 'students' : 'student'}
            </p>
          </div>

          <p className='text-sm'>
            Course by <span className='text-blue-600 underline'>jungleStack</span>
          </p>

          {/* Course Structure */}
          <div className='pt-8 text-gray-800'>
            <h2 className='text-xl font-semibold'>Course Structure</h2>



        <div className='pt-5 space-y-4'>
              {courseData.courseContent.map((chapter, index) => {
                const isOpen = openChapters.includes(index);
                return (
                  <div key={index} className='border border-gray-300 bg-white mb-2 rounded overflow-hidden'>
                    <div
                      className='flex items-center justify-between px-4 py-3 cursor-pointer select-none'
                      onClick={() => toggleChapter(index)}
                    >
                      <img
                        src={assets.down_arrow_icon}
                        alt="arrow icon"
                        className={`w-4 h-4 transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                      />
                      <p className='font-medium md:text-base text-sm'>{chapter.chapterTitle}</p>
                      <p className='text-sm text-gray-500'>
                        {chapter.chapterContent.length} lectures - {calculateChapterTime(chapter)}
                      </p>
                    </div>

                    {isOpen && (
                      <div className='px-5 pb-4 text-sm text-gray-700'>
                        <ul className='space-y-3'>
                          {chapter.chapterContent.map((lecture, i) => (
                            <li key={i} className='flex gap-3 items-start'>
                              <img src={assets.play_icon} alt="play" className='w-4 h-4 mt-1' />
                              <div className='flex flex-col w-full'>
                                <div className='flex justify-between'>
                                  <p className='font-medium text-gray-800'>{lecture.lectureTitle}</p>
                                  <div className='flex items-center gap-2 text-xs text-gray-500'>
                                    {lecture.isPreviewFree && (
                                      <span
                                        className='text-green-600 font-semibold cursor-pointer'
                                        onClick={() => setPlayerData({ videoId: lecture.lectureUrl.split('/').pop() })}
                                      >
                                        Preview
                                      </span>
                                    )}
                                    <span>{humanizeDuration(lecture.lectureDuration * 60 * 1000, {
                                      units: ['h', 'm'],
                                      round: true
                                    })}</span>
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
          </div>

          <div className='py-20 text-sm md:text-default'>
            <h3 className='text-xl font-semibold text-gray-800'>Course Description</h3>
            <p
              className='pt-3 rich-text'
              dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}
            ></p>
          </div>
        </div>

        {/* Right Column */}
        <div className='max-w-course-card z-10 shadow-custom-card rounded-t md:rounded-none overflow-hidden bg-white min-w-[300px] sm:min-w-[420px]'>
          {playerData ? (
            <YouTube
              videoId={playerData.videoId}
              opts={{ playerVars: { autoplay: 1 } }}
              iframeClassName='w-full aspect-video'
            />
          ) : (
            <img src={courseData.courseThumbnail} alt="thumbnail" />
          )}

          <div className='p-5'>
            <div className='flex items-center gap-2'>
              <img className='w-3.5' src={assets.time_left_clock_icon} alt="time-left-clock_icon" />
              <p className='text-red-500'>
                <span className='font-medium'>5 days</span> left at this price!
              </p>
            </div>

            <div className='flex gap-3 items-center pt-2'>
              <p className='text-gray-800 md:text-4xl text-2xl font-semibold'>
                {currency}{(courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2)}
              </p>
              <p className='md:text-lg text-gray-500 line-through'>{currency}{courseData.coursePrice}</p>
              <p className='md:text-lg text-gray-500'>{courseData.discount}% off</p>
            </div>

            <div className='flex flex-wrap gap-4 pt-4 text-gray-500 text-sm md:text-default'>
              <div className='flex items-center gap-1'>
                <img src={assets.star} alt="star icon" />
                <p>{calculateRating(courseData)}</p>
              </div>
              <div className='h-4 w-px bg-gray-500/40'></div>
              <div className='flex items-center gap-1'>
                <img src={assets.time_clock_icon} alt="clock icon" />
                <p>{calculateCourseDuration(courseData)}</p>
              </div>
              <div className='h-4 w-px bg-gray-500/40'></div>
              <div className='flex items-center gap-1'>
                <img src={assets.lesson_icon} alt="clock icon" />
                <p>{calculateNoOfLectures(courseData)}</p>
              </div>
            </div>

            <button className='md:mt-6 mt-4 w-full py-3 rounded bg-blue-600 text-white font-medium'>
              {isAlreadyEnrolled ? 'Already Enrolled' : 'Enroll Now'}
            </button>

            <div className='pt-6'>
              <p className='md:text-xl text-lg font-medium text-gray-800'>What's in the course?</p>
              <ul className='ml-4 pt-2 text-sm md:text-default list-disc text-gray-500'>
                <li>Lifetime access with free updates.</li>
                <li>Step-by-step, hands-on project guidance</li>
                <li>Downloadable resources and source code.</li>
                <li>Quizzes to test your knowledge</li>
                <li>Certificate of completion.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default CourseDetails;
