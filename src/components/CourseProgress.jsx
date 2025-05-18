import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "../styles/CourseProgress.module.css";

export default function CourseProgress({ enrolledCourses }) {
  const navigate = useNavigate();
  const { progressData, loading, error } = useSelector((state) => state.studentProgress);

  // Create a map of courseId to progress and lesson data for easy lookup
  const progressMap = progressData?.reduce((map, progress) => {
    map[progress.course] = {
      progress: parseFloat(progress.progress),
      is_completed: progress.is_completed,
      lesson_count: progress.lesson_count,
      completed_lessons_count: progress.completed_lessons_count,
    };
    return map;
  }, {});

  return (
    <div className={styles.container}>
      {loading ? (
        <p className={styles.loadingMessage}>Loading progress data...</p>
      ) : error ? (
        <p className={styles.errorMessage}>Error loading progress data</p>
      ) : enrolledCourses.length > 0 ? (
        <div className={styles.coursesContainer}>
          {enrolledCourses.map((course, index) => {
            const fixedImageUrl = course.thumbnail?.replace("image/upload/", "");
            const courseProgress = progressMap?.[course.id] || {
              progress: 0,
              is_completed: false,
              lesson_count: 0,
              completed_lessons_count: 0,
            };

            return (
              <div key={index} className={styles.courseCard}>
                <div className={styles.card}>
                  <img
                    src={fixedImageUrl || "https://via.placeholder.com/150"}
                    alt={course?.title || "Course Image"}
                    className={styles.courseImage}
                  />
                  <div className={styles.cardBody}>
                    <h5 className={styles.courseTitle}>
                      {course?.title || "Unknown Course"}
                    </h5>
                    <div className={styles.courseDetails}>
                      <p className={styles.detailItem}>
                        Progress: {courseProgress.progress.toFixed(0)}%
                        {courseProgress.is_completed && (
                          <span className={styles.completedBadge}>
                            Completed
                          </span>
                        )}
                      </p>
                      <p className={styles.lessonCount}>
                        Lessons: {courseProgress.completed_lessons_count}/{courseProgress.lesson_count}
                      </p>
                    </div>
                    <div className={styles.progressBar}>
                      <div
                        className={`${styles.progressFill} ${
                          courseProgress.is_completed
                            ? styles.progressComplete
                            : styles.progressIncomplete
                        }`}
                        style={{ width: `${courseProgress.progress}%` }}
                      />
                    </div>
                    <button
                      className={`${styles.actionButton} ${
                        courseProgress.is_completed
                          ? styles.buttonComplete
                          : styles.buttonIncomplete
                      }`}
                      onClick={() => navigate(`/watch-course/${course.id}`)}
                    >
                      {courseProgress.is_completed ? "Review Course" : "Continue Learning"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className={styles.noCoursesMessage}>
          No enrolled courses found.
        </p>
      )}
    </div>
  );
}