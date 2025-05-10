"use client";
import React, { useEffect, useRef, useState } from "react";
import "../../styles/watch.css";
import ChatSection from "./ChatSection";
import NewsletterSection from "./NewsletterSection";
import Footer from "../../components/HomeComponets/Footer";
import Navbar from "../../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchLesson } from "../../Redux/Slices/lessonsSlice";
import { fetchEnrolledCourses } from "../../Redux/Slices/enrollmentSlice";
import api from "../../Redux/api";

// VideoSection Component
function VideoSection({ videoUrl, lessonId }) {
  const { id } = useParams();
  const courseId = id;
  const { courses } = useSelector((state) => state.enrollments);
  const course = courses.find((course) => course.id === parseInt(courseId, 10));
  const videoRef = useRef(null);

  // Fallback to course preview_video if no lesson video is provided
  const effectiveVideoUrl = videoUrl || course?.preview_video?.replace("video/upload/", "") || "";

  useEffect(() => {
    if (videoRef.current && lessonId && effectiveVideoUrl) {
      const handleVideoEnd = async () => {
        try {
          await api.post("lessons/lesson-progress/", {
            lesson: lessonId,
            completed: true,
          });
          console.log(`Lesson ${lessonId} marked as watched!`);
        } catch (error) {
          console.error("Failed to mark lesson as watched", error);
        }
      };

      const videoElement = videoRef.current;
      videoElement.addEventListener("ended", handleVideoEnd);

      return () => {
        videoElement.removeEventListener("ended", handleVideoEnd);
      };
    }
  }, [lessonId, effectiveVideoUrl]);

  return (
    <article className="video-container">
      <div className="video-wrapper">
        {effectiveVideoUrl ? (
          <video
            ref={videoRef}
            key={effectiveVideoUrl} // Force re-render when URL changes
            className="video-player"
            src={effectiveVideoUrl}
            autoPlay
            controls
            muted
            style={{ width: "100%", height: "auto" }}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/edfdb7342fce61e2ac6bac665b7695a49877f0ee?placeholderIfAbsent=true&apiKey=34d728b774e44ebe92ee1866d5dfa190"
            className="video-thumbnail"
            alt="Course video thumbnail"
          />
        )}
      </div>
    </article>
  );
}

// LessonItem Component
function LessonItem({ lessonId, number, title, duration, thumbnail, videoUrl, onLessonSelect }) {
  const handleClick = () => {
    onLessonSelect({ videoUrl, title, lessonId }); // Include lessonId
  };

  return (
    <div className="lesson-item" onClick={handleClick} style={{ cursor: "pointer" }}>
      <div className="lesson-info">
        {thumbnail ? (
          <img src={thumbnail} className="lesson-thumbnail" alt="Lesson thumbnail" style={{ width: "50px", height: "30px" }} />
        ) : (
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/6e93fac16a9332ccd80280eddf6326fb97413bfb?placeholderIfAbsent=true&apiKey=34d728b774e44ebe92ee1866d5dfa190"
            className="lesson-icon"
            alt="Lesson icon"
          />
        )}
        <div className="lesson-title">
          <span className="lesson-text">
            {number}. {title}
          </span>
        </div>
      </div>
      <time className="lesson-duration">{duration}</time>
    </div>
  );
}

// LessonList Component
function LessonList({ onLessonSelect }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const courseId = id;
  const playlist = useSelector((state) => state.lesson.lessons) || [];

  useEffect(() => {
    dispatch(fetchLesson(parseInt(courseId, 10)));
    dispatch(fetchEnrolledCourses());
  }, [dispatch, courseId]);

  const lessons = playlist.map((lesson, index) => ({
    id: lesson.id, // Ensure lesson ID is included
    number: index + 1,
    title: lesson.title,
    duration: lesson.duration || "Unknown",
    videoUrl: lesson.video_url,
    thumbnail: lesson.thumbnail, // Optional: from API if available
  }));

  return (
    <div className="lesson-list">
      <div className="lessons">
        {lessons.length > 0 ? (
          lessons.map((lesson) => (
            <LessonItem
              key={lesson.number}
              lessonId={lesson.id} // Pass lessonId
              number={lesson.number}
              title={lesson.title}
              duration={lesson.duration}
              videoUrl={lesson.videoUrl}
              thumbnail={lesson.thumbnail}
              onLessonSelect={onLessonSelect}
            />
          ))
        ) : (
          <p>No lessons available for this course.</p>
        )}
      </div>
    </div>
  );
}

// CourseInfo Component
function CourseInfo({ onLessonSelect, selectedLessonTitle }) {
  const { id: courseId } = useParams();
  const { courses } = useSelector((state) => state.enrollments);
  const course = courses.find((course) => course.id === parseInt(courseId, 10));

  return (
    <article className="course-info">
      <header className="course-header">
        <div className="title-row">
          <h1 className="course-title">{selectedLessonTitle || course?.title || "Course Title"}</h1>
          <button className="follow-button">Follow</button>
        </div>
        <div className="date-info">
          <time className="course-date">{course?.start_date || "Unknown Date"}</time>
          <time className="start-time">{course?.start_time || "Unknown Time"}</time>
        </div>
      </header>
      <hr className="divider" />
      <LessonList onLessonSelect={onLessonSelect} />
    </article>
  );
}

// Content Component
function Content() {
  const { id } = useParams();
  const courseId = id;
  const [selectedLesson, setSelectedLesson] = useState({ videoUrl: "", title: "", lessonId: null });
  const { courses } = useSelector((state) => state.enrollments);
  const course = courses.find((course) => course.id === parseInt(courseId, 10));

  const handleLessonSelect = ({ videoUrl, title, lessonId }) => {
    setSelectedLesson({ videoUrl, title, lessonId });
  };

  return (
    <main className="content">
      <Navbar />
      <br />
      <section className="content-section">
        <div className="content-grid">
          <VideoSection videoUrl={selectedLesson.videoUrl} lessonId={selectedLesson.lessonId} />
          <CourseInfo onLessonSelect={handleLessonSelect} selectedLessonTitle={selectedLesson.title} />
        </div>
      </section>
      <br />
      <div className="header-main">
        <h2 className="lesson-title">{selectedLesson.title || course?.title || "Course Title"}</h2>
      </div>
      <br />
      <ChatSection courseId={parseInt(courseId, 10)} description={course?.description} />
      <NewsletterSection />
      <br />
      <Footer/>
    </main>
  );
}

export default Content;