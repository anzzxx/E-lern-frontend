import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

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
    <div
      style={{
        width: "100%",
        overflowX: "auto",
        whiteSpace: "nowrap",
        padding: "20px 0",
        backgroundColor: "#f5f6f8",
        borderRadius: "12px",
        margin: "0 auto",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      {loading ? (
        <p style={{ textAlign: "center", padding: "20px", color: "#333" }}>Loading progress data...</p>
      ) : error ? (
        <p style={{ textAlign: "center", padding: "20px", color: "#dc3545" }}>Error loading progress data</p>
      ) : enrolledCourses.length > 0 ? (
        <div style={{ display: "inline-flex", gap: "20px", padding: "0 15px" }}>
          {enrolledCourses.map((course, index) => {
            const fixedImageUrl = course.thumbnail?.replace("image/upload/", "");
            const courseProgress = progressMap?.[course.id] || {
              progress: 0,
              is_completed: false,
              lesson_count: 0,
              completed_lessons_count: 0,
            };

            return (
              <div
                key={index}
                style={{
                  display: "inline-block",
                  flexShrink: 0,
                  width: "20rem",
                }}
              >
                <div
                  style={{
                    width: "20rem",
                    height: "100%",
                    borderRadius: "10px",
                    overflow: "hidden",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                    backgroundColor: "#fff",
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <img
                    src={fixedImageUrl || "https://via.placeholder.com/150"}
                    alt={course?.title || "Course Image"}
                    style={{
                      width: "100%",
                      height: "180px",
                      objectFit: "cover",
                      borderBottom: "1px solid #e9ecef",
                    }}
                  />
                  <div
                    style={{
                      padding: "15px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <h5
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: "600",
                        color: "#333",
                        margin: "0",
                        lineHeight: "1.4",
                        whiteSpace: "normal",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {course?.title || "Unknown Course"}
                    </h5>
                    <div
                      style={{
                        fontSize: "0.9rem",
                        color: "#555",
                      }}
                    >
                      <p style={{ margin: "0" }}>
                        Progress: {courseProgress.progress.toFixed(0)}%
                        {courseProgress.is_completed && (
                          <span
                            style={{
                              backgroundColor: "#28a745",
                              color: "#fff",
                              padding: "2px 8px",
                              borderRadius: "10px",
                              fontSize: "0.8rem",
                              marginLeft: "8px",
                            }}
                          >
                            Completed
                          </span>
                        )}
                      </p>
                      <p style={{ margin: "5px 0 0" }}>
                        Lessons: {courseProgress.completed_lessons_count}/{courseProgress.lesson_count}
                      </p>
                    </div>
                    <div
                      style={{
                        height: "8px",
                        backgroundColor: "#e9ecef",
                        borderRadius: "4px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${courseProgress.progress}%`,
                          height: "100%",
                          backgroundColor: courseProgress.is_completed ? "#28a745" : "#007bff",
                          borderRadius: "4px",
                          transition: "width 0.3s ease-in-out",
                        }}
                      />
                    </div>
                    <button
                      style={{
                        marginTop: "auto",
                        padding: "8px 0",
                        backgroundColor: courseProgress.is_completed ? "#6c757d" : "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "0.95rem",
                        fontWeight: "500",
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                      }}
                      onClick={() => navigate(`/watch-course/${course.id}`)}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = courseProgress.is_completed ? "#5a6268" : "#0056b3")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = courseProgress.is_completed ? "#6c757d" : "#007bff")
                      }
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
        <p
          style={{
            textAlign: "center",
            padding: "20px",
            color: "#333",
            whiteSpace: "normal",
          }}
        >
          No enrolled courses found.
        </p>
      )}
    </div>
  );
}