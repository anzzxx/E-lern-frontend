import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "../styles/CourseProgress.module.css";

export default function CourseProgress({ enrolledCourses }) {
  const navigate = useNavigate();
  const { progressData, loading, error } = useSelector((state) => state.studentProgress);

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
      <h2 className={styles.sectionTitle}>My Learning Journey</h2>
      
      {loading ? (
        <div className={styles.loadingContainer}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className={styles.skeletonCard}>
              <div className={styles.skeletonImage}></div>
              <div className={styles.skeletonText}></div>
              <div className={styles.skeletonText}></div>
              <div className={styles.skeletonProgress}></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <p>Failed to load progress data</p>
          <button className={styles.retryButton}>Try Again</button>
        </div>
      ) : enrolledCourses.length > 0 ? (
        <div className={styles.coursesGrid}>
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
                  <div className={styles.imageContainer}>
                    <img
                      src={fixedImageUrl || "https://via.placeholder.com/300x200"}
                      alt={course?.title || "Course Image"}
                      className={styles.courseImage}
                    />
                    {courseProgress.is_completed && (
                      <div className={styles.completedRibbon}>COMPLETED</div>
                    )}
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.courseTitle}>
                      {course?.title || "Unknown Course"}
                    </h3>
                    <div className={styles.progressContainer}>
                      <div className={styles.progressInfo}>
                        <span>{courseProgress.progress.toFixed(0)}% complete</span>
                        <span>{courseProgress.completed_lessons_count}/{courseProgress.lesson_count} lessons</span>
                      </div>
                      <div className={styles.progressBar}>
                        <div
                          className={styles.progressFill}
                          style={{ width: `${courseProgress.progress}%` }}
                        />
                      </div>
                    </div>
                    <button
                      className={styles.actionButton}
                      onClick={() => navigate(`/watch-course/${course.id}`)}
                    >
                      {courseProgress.is_completed ? (
                        <>
                          <span>Review Course</span>
                          <span className={styles.buttonIcon}>↗</span>
                        </>
                      ) : (
                        <>
                          <span>Continue</span>
                          <span className={styles.buttonIcon}>→</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIllustration}></div>
          <h3>No courses enrolled yet</h3>
          <p>Explore our catalog to find courses that match your interests</p>
          <button className={styles.exploreButton} onClick={()=>navigate("/")}>Browse Courses</button>
        </div>
      )}
    </div>
  );
}