import React, { useState } from "react";
import { useSelector } from "react-redux";

const StudentDashboard = () => {
  const name = useSelector((state) => state.profile.name);
  const { progressData, loading, error } = useSelector((state) => state.studentProgress);
  const { courses, stats } = useSelector((state) => state.enrollments);
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [showAllCertificates, setShowAllCertificates] = useState(false);

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Determine which courses to display (first 2 or all)
  const displayedCourses = showAllCourses ? courses : courses.slice(0, 2);

  // Filter completed courses for the Certificate section
  const completedCourses = progressData
    ?.filter((progress) => progress.is_completed)
    .map((progress) => ({
      ...progress,
      courseTitle: courses.find((course) => course.id === progress.course)?.title || "Unknown Course",
    })) || [];

  // Determine which certificates to display (first 2 or all)
  const displayedCertificates = showAllCertificates ? completedCourses : completedCourses.slice(0, 2);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>
        {getTimeBasedGreeting()}, {name}!
      </h1>

      {/* First Row */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Enrolled Courses</h2>
        {loading ? (
          <p style={{ textAlign: "center", color: "#333", padding: "10px" }}>
            Loading courses...
          </p>
        ) : error ? (
          <p style={{ textAlign: "center", color: "#dc3545", padding: "10px" }}>
            Error loading courses
          </p>
        ) : courses.length === 0 ? (
          <p style={{ textAlign: "center", color: "#333", padding: "10px" }}>
            No enrolled courses found
          </p>
        ) : (
          <ul style={styles.list}>
            {displayedCourses.map((course) => {
              // Find the corresponding progress data for this course
              const progress = progressData?.find((p) => p.course === course.id) || {
                progress: "0.00",
                is_completed: false,
                completed_lessons_count: 0,
                lesson_count: 0,
              };
              const progressPercentage = parseFloat(progress.progress).toFixed(0);

              return (
                <li
                  key={course.id}
                  style={{
                    ...styles.listItem,
                    transition: "background-color 0.2s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    <span style={{ fontSize: "1rem", fontWeight: "500", color: "#333" }}>
                      {course.title}
                    </span>
                    <span style={{ fontSize: "0.85rem", color: "#555" }}>
                      Lessons: {progress.completed_lessons_count}/{progress.lesson_count}
                    </span>
                  </div>
                  <div style={styles.progressContainer}>
                    {!progress.is_completed && (
                      <>
                        <div style={styles.progressBar}>
                          <div
                            style={{
                              ...styles.progressFill,
                              width: `${progressPercentage}%`,
                            }}
                          ></div>
                        </div>
                        <span style={styles.progressText}>{progressPercentage}%</span>
                      </>
                    )}
                    {progress.is_completed && (
                      <span
                        style={{
                          backgroundColor: "#28a745",
                          color: "#fff",
                          padding: "2px 8px",
                          borderRadius: "10px",
                          fontSize: "0.8rem",
                        }}
                      >
                        Completed
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
            {courses.length > 2 && (
              <li
                style={{
                  ...styles.listItem,
                  color: "#007bff",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
                onClick={() => setShowAllCourses(!showAllCourses)}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#0056b3")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#007bff")}
              >
                {showAllCourses ? "View less" : "View all courses"}
              </li>
            )}
          </ul>
        )}
      </div>
      <br />
      {/* Second Row */}
      <div style={styles.row}>
        {/* Upcoming Tasks Section */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Upcoming Tasks</h2>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              Assignment 2
              <span style={styles.dueTag}>Due today</span>
            </li>
            <li style={styles.listItem}>
              Project Proposal
              <span style={styles.dueDate}>Due Apr 28</span>
            </li>
          </ul>
        </div>

        {/* Certificate Section */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Certificates</h2>
          <ul style={styles.list}>
            {completedCourses.length > 0 ? (
              displayedCertificates.map((progress) => (
                <li
                  key={progress.id}
                  style={{
                    ...styles.listItem,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: "0.95rem", color: "#333" }}>
                    {progress.courseTitle}
                  </span>
                  <button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 12px",
                      backgroundColor: "#007bff",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "0.85rem",
                      fontWeight: "500",
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
                  >
                    <span style={{ fontSize: "1rem" }}>↓</span>
                    Download
                  </button>
                </li>
              ))
            ) : (
              <li style={styles.listItem}>No certificates earned yet</li>
            )}
            {completedCourses.length > 2 && (
              <li
                style={{
                  ...styles.listItem,
                  color: "#007bff",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
                onClick={() => setShowAllCertificates(!showAllCertificates)}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#0056b3")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#007bff")}
              >
                {showAllCertificates ? "View less" : "View more"}
              </li>
            )}
            <li
              style={{
                ...styles.listItem,
                color: "#007bff",
                cursor: "pointer",
                fontWeight: "500",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#0056b3")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#007bff")}
            >
              View
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "20px",
    paddingLeft: "170px",
    maxWidth: "1200px",
    minWidth: "80%",
    marginLeft: "170px",
  
    minHeight: "100vh",
  },
  header: {
    color: "#333",
    marginBottom: "30px",
    fontSize: "28px",
    fontWeight: "600",
  },
  row: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    marginBottom: "20px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    flex: "1",
    minWidth: "calc(50% - 10px)",
    boxSizing: "border-box",
    transition: "box-shadow 0.2s",
  },
  cardTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    marginBottom: "15px",
    color: "#333",
    borderBottom: "1px solid #e9ecef",
    paddingBottom: "10px",
  },
  list: {
    listStyle: "none",
    padding: "0",
    margin: "0",
  },
  listItem: {
    padding: "12px 0",
    borderBottom: "1px solid #e9ecef",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "0.95rem",
    color: "#333",
  },
  progressContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    minWidth: "120px",
    justifyContent: "flex-end",
  },
  progressBar: {
    height: "8px",
    width: "80px",
    backgroundColor: "#e9ecef",
    borderRadius: "4px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#007bff",
    display: "block",
    transition: "width 0.3s ease-in-out",
  },
  progressText: {
    fontSize: "0.85rem",
    color: "#555",
  },
  dueTag: {
    backgroundColor: "#dc3545",
    color: "#fff",
    fontSize: "0.75rem",
    padding: "3px 8px",
    borderRadius: "10px",
  },
  dueDate: {
    color: "#555",
    fontSize: "0.75rem",
  },
};

export default StudentDashboard;