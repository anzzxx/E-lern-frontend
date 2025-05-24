"use client";
import React from "react";
import styles from "../../../styles/ProfileSidebar.module.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProfileSidebar = () => {
  const navigate=useNavigate()
  const { selectedInstructor } = useSelector((state) => state.instructors);
  const instructor = selectedInstructor?.data || {};
  const { totalEarnings, loading, studentsList } = useSelector(
    (state) => state.instructorDashboard
  );
  const { instructorCourses } = useSelector((state) => state.courses);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading profile data...</p>
      </div>
    );
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
        <div className={styles.scrollableContent}>
          {/* Profile Section */}
          <section className={styles.profileSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Instructor Profile</h2>
              <div className={styles.headerDivider}></div>
            </div>
            <div className={styles.profileContent}>
              <div className={styles.avatarContainer}>
                <img
                  className={styles.profileImage}
                  src={
                    instructor?.profile_picture
                      ? `https://api.elern.shop${instructor.profile_picture}`
                      : defaultPicture
                  }
                  alt="Profile"
                />
                <div className={styles.statusIndicator}></div>
              </div>
              <div className={styles.profileInfo}>
                <h3 className={styles.profileName}>
                  {instructor.name || "Instructor Name"}
                </h3>
                <p className={styles.profileRole}>
                  {instructor.experience || "Professional Instructor"}
                </p>
                <div className={styles.profileStats}>
                  <div className={styles.statItem}>
                    <span className={styles.statValue}>
                      {instructorCourses?.length || 0}
                    </span>
                    <span className={styles.statLabel}>Courses</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statValue}>
                      {studentsList?.length || 0}
                    </span>
                    <span className={styles.statLabel}>Students</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Earnings Card Content */}
          <section className={styles.earningsSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Earnings</h2>
              <div className={styles.headerDivider}></div>
            </div>
            <div className={styles.earningsCard}>
              <div className={styles.earningsHeader}>
                <div className={styles.earningsInfo}>
                  <div className={styles.earningsDetails}>
                    <h3 className={styles.earningsTitle}>Total Balance</h3>
                    <p className={styles.earningsSubtitle}>Available for withdrawal</p>
                  </div>
                </div>
                <div className={styles.chip}>
                  <svg
                    className={styles.chipIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 4H20V20H4V4Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4 8H20"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 4V8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16 4V8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4 12H20"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4 16H20"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 20V16"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16 20V16"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <div className={styles.earningsValues}>
                <span>${parseFloat(totalEarnings || 0).toFixed(2)}</span>
              </div>
              <button className={styles.withdrawButton}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 15V3M12 15L8 11M12 15L16 11M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Withdraw Earnings
              </button>
            </div>
          </section>

          {/* Popular Courses Content */}
          <section className={styles.coursesSection}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Top Courses</h2>
              <div className={styles.headerDivider}></div>
            </div>
            <div className={styles.coursesList}>
              {[...(instructorCourses || [])]
                .sort((a, b) => (b.enrollments || 0) - (a.enrollments || 0))
                .slice(0, 3)
                .map((course) => (
                  <article key={course.id} className={styles.courseItem}>
                    <div className={styles.courseContent}>
                      <div className={styles.courseImageContainer}>
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
                      </div>
                      <div className={styles.courseInfo}>
                        <h4 className={styles.courseName}>{course.title}</h4>
                        <div className={styles.courseMeta}>
                          <span className={styles.coursePrice}>
                            ${parseFloat(course.price || 0).toFixed(2)}
                          </span>
                          <span className={styles.courseStudents}>
                            {course.enrollments || 0} students
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      className={styles.courseButton}
                      
                      onClick={() => navigate(`/instructor/course/${course.id}`)}
                    >
                      View Details
                    </button>
                  </article>
                ))}
            </div>
          </section>
        </div>
      </div>
    </aside>
  );
};

export default ProfileSidebar;