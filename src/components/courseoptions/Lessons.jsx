import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLesson } from "../../Redux/Slices/lessonsSlice";
import { FiEdit } from "react-icons/fi"; // Importing edit icon from react-icons

const Lessons = ({
  courseId,
  addButton,
  setSelectedLesson,
  selectedLessonId,
  handleCreateLessons,
  showModal,
  isLoading,
  setShowModal,
}) => {
  const dispatch = useDispatch();
  const { lessons, loading, error } = useSelector((state) => state.lesson);
  const [visibleLessons, setVisibleLessons] = useState(3); // State to control number of visible lessons

  useEffect(() => {
    if (courseId) {
      dispatch(fetchLesson(courseId));
    }
  }, [courseId, dispatch, isLoading]);

  if (loading) return <div>Loading lessons...</div>;
  if (error) return <div>Error loading lessons: {error}</div>;

  const onEditLesson = (lesson) => {
    setSelectedLesson(lesson);
    setShowModal(true);
  };

  // Handle View All button click
  const handleViewAll = () => {
    setVisibleLessons(lessons.length);
  };

  // Handle View Less button click
  const handleViewLess = () => {
    setVisibleLessons(3);
  };

  return (
    <div
      style={{
        backgroundColor: "#fff",
        padding: "16px",
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        marginBottom: "24px",
        width: "100%",
      }}
    >
      <h2
        style={{
          fontSize: "20px",
          fontWeight: "600",
          marginBottom: "16px",
        }}
      >
        Lessons
      </h2>

      <div style={{ marginBottom: "16px" }}>
        {lessons?.slice(0, visibleLessons).map((lesson, index) => (
          <div
            key={lesson._id || index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px",
              borderBottom:
                index < Math.min(visibleLessons, lessons.length) - 1
                  ? "1px solid #e5e7eb"
                  : "none",
              backgroundColor:
                selectedLessonId === lesson._id ? "#f0f7ff" : "transparent",
              borderRadius: "4px",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
            }}
          >
            <div
              style={{
                flex: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              onClick={() => setSelectedLesson(lesson)}
            >
              <span
                style={{
                  fontWeight: selectedLessonId === lesson._id ? "600" : "400",
                  color: selectedLessonId === lesson._id ? "#1a73e8" : "#111827",
                }}
              >
                {index + 1}. {lesson.title}
              </span>
              <span
                style={{
                  color: selectedLessonId === lesson._id ? "#1a73e8" : "#4b5563",
                  marginRight: "8px",
                }}
              >
                {lesson.duration || "0:00"}
              </span>
            </div>

            {/* Edit icon button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditLesson(lesson);
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#6b7280",
                padding: "4px",
                borderRadius: "4px",
              }}
              aria-label="Edit lesson"
            >
              <FiEdit size={16} className="delete-icon" />
            </button>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        {addButton && (
          <button
            style={{
              color: "#2563eb",
              fontWeight: "500",
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
            onClick={() => handleCreateLessons()}
          >
            + Add Lesson
          </button>
        )}

        {lessons.length > 3 && visibleLessons < lessons.length && (
          <button
            style={{
              color: "#2563eb",
              fontWeight: "500",
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
            onClick={handleViewAll}
          >
            View All
          </button>
        )}

        {visibleLessons === lessons.length && lessons.length > 3 && (
          <button
            style={{
              color: "#2563eb",
              fontWeight: "500",
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
            onClick={handleViewLess}
          >
            View Less
          </button>
        )}
      </div>
    </div>
  );
};

export default Lessons;