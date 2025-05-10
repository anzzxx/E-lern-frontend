"use client";
import React from "react";
import styles from "../../../styles/ProfileSidebar.module.css";
import { useSelector } from "react-redux";

const ProfileSidebar = () => {
  const { selectedInstructor } = useSelector((state) => state.instructors);
  const instructor = selectedInstructor?.data || {};
  const { totalEarnings, loading, studentsList } = useSelector(
    (state) => state.instructorDashboard
  );
  const { instructorCourses } = useSelector((state) => state.courses);

  if (loading) {
    return <div className={styles.card}>Loading...</div>;
  }

  const defaultPicture =
    "https://cdn.builder.io/api/v1/image/assets/TEMP/99a81f094358e8383f998e571dfdb361fa82943d?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c";

  const handleViewCourse = (courseId) => {
    console.log(`Viewing course with ID: ${courseId}`);
    // Add navigation logic here
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.card}>
        {/* Profile Section */}
        <section className={styles.profileSection}>
          <h2 className={styles.profileTitle}>Profile</h2>
          <div className={styles.profileContent}>
            <img
              className={styles.profileImage}
              src={
                instructor?.profile_picture
                  ? `http://127.0.0.1:8000${instructor.profile_picture}`
                  : defaultPicture
              }
              alt="Profile"
            />
            <div className={styles.profileInfo}>
              <h3 className={styles.profileName}>{instructor.name || "N/A"}</h3>
              <p className={styles.profileRole}>
                {instructor.experience || "Instructor"}
              </p>
            </div>
          </div>
        </section>

        {/* Earnings Card Content */}
        <section className={styles.earningsSection}>
          <div className={styles.earningsCard}>
            <div className={styles.earningsHeader}>
              <div className={styles.earningsInfo}>
                <div className={styles.earningsDetails}>
                  <h3 className={styles.earningsTitle}>Total Earnings</h3>
                  
                </div>
              </div>
              <div className={styles.chip}>
                <img
                  className={styles.chipImage}
                  src="https://cdn.builder.io/api/v1/image/assets/TEMP/chip-icon-bank.png?placeholderIfAbsent=true"
                  alt="Card Chip"
                />
              </div>
            </div>
            <div className={styles.earningsValues}>
              <span>${parseFloat(totalEarnings || 0).toFixed(2)}</span>
            </div>
            <button className={styles.withdrawButton}>Withdraw Earnings</button>
          </div>
        </section>

        {/* Popular Courses Content */}
        <section className={styles.coursesSection}>
          <h3 className={styles.coursesTitle}>Popular Courses</h3>
          {[...(instructorCourses || [])]
            .sort((a, b) => (b.enrollments || 0) - (a.enrollments || 0))
            .slice(0, 3)
            .map((course) => (
              <article key={course.id} className={styles.courseItem}>
                <div className={styles.courseContent}>
                  <img
                    className={styles.courseImage}
                    src={
                      course.thumbnail
                        ? course.thumbnail.replace("image/upload/", "")
                        : "/fallback-course-image.jpg"
                    }
                    alt={course.title}
                    onError={(e) => {
                      e.target.src = "/fallback-course-image.jpg";
                    }}
                  />
                  <div className={styles.courseInfo}>
                    <h4 className={styles.courseName}>{course.title}</h4>
                    <p className={styles.coursePrice}>
                      ${parseFloat(course.price || 0).toFixed(2)}
                    </p>
                  </div>
                </div>
                <button
                  className={`${styles.courseButton} ${styles.courseButtonWebDev}`}
                  onClick={() => handleViewCourse(course.id)}
                >
                  View Course
                </button>
              </article>
            ))}
        </section>
      </div>
    </aside>
  );
};

export default ProfileSidebar;