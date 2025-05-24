import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLesson, updateLesson } from "../../Redux/Slices/lessonsSlice";
import UploadProgressModal from "../../components/UploadProgressModal";
import { FiEdit } from "react-icons/fi";
import { Modal, Button, Spinner, Alert, ProgressBar } from "react-bootstrap";
import * as yup from "yup";
import ReusableForm from "../../components/ReusableForm";

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
  const [visibleLessons, setVisibleLessons] = useState(3);
  const [editModalShow, setEditModalShow] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showProgressModal, setShowProgressModal] = useState(false);

  useEffect(() => {
    if (courseId) {
      dispatch(fetchLesson(courseId));
    }
  }, [courseId, dispatch, isLoading]);

  const lessonFields = [
    {
      name: "title",
      label: "Title",
      type: "text",
      placeholder: "Enter lesson title",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Enter lesson description",
    },
    {
      name: "video_file",
      label: "Upload Video",
      type: "file",
      accept: "video/*",
      optional: true,
    },
  ];

  const lessonSchema = yup.object().shape({
    title: yup.string().required("Title is required"),
    description: yup.string().required("Description is required"),
    video_file: yup.mixed().nullable(),
  });

  const onEditLesson = (lesson) => {
    setCurrentLesson(lesson);
    setEditModalShow(true);
    setUpdateError(null);
  };

  const handleUpdateLesson = async (formData) => {
    try {
      setUpdateLoading(true);
      setUpdateError(null);
      setUploadProgress(0);
       setEditModalShow(false);
      
      setShowProgressModal(true); 
      
      const lessonData = new FormData();
      lessonData.append("title", formData.title || currentLesson.title);
      lessonData.append("description", formData.description || currentLesson.description);
      lessonData.append("course", courseId);

      if (formData.video_file && formData.video_file.length > 0) {
        lessonData.append("video_file", formData.video_file[0]);
      } else {
        lessonData.append("keep_existing_video", "true");
      }

      const resultAction = await dispatch(
        updateLesson({ 
          id: currentLesson.id, 
          data: lessonData,
          setProgress: (progress) => {
            setUploadProgress(progress);
            // Force immediate state update if available
            if (typeof flushSync === 'function') {
              flushSync(() => {});
            }
          }
        })
      );
      
      if (updateLesson.fulfilled.match(resultAction)) {
        // Ensure progress reaches 100% before hiding
        setUploadProgress(100);
        await new Promise(resolve => setTimeout(resolve, 500));
        setShowProgressModal(false);
        setEditModalShow(false);
        dispatch(fetchLesson(courseId));
      } else {
        throw new Error(resultAction.payload || "Failed to update lesson");
      }
    } catch (error) {
      console.error("Update lesson error:", error);
      setUpdateError(error.message || "An error occurred while updating the lesson");
      setShowProgressModal(false);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleViewAll = () => {
    setVisibleLessons(lessons.length);
  };

  const handleViewLess = () => {
    setVisibleLessons(3);
  };

  // if (loading) return <div className="text-center py-4">Loading lessons...</div>;
  if (error) return <div className="alert alert-danger">Error loading lessons: {error}</div>;

  return (
    <>
    <div className="bg-white p-4 rounded shadow-sm mb-4 w-100">
      <h2 className="h5 fw-semibold mb-3">Lessons</h2>

      <div className="mb-3">
        {lessons?.slice(0, visibleLessons).map((lesson, index) => (
          <div
            key={lesson.id || index}
            className={`d-flex justify-content-between align-items-center p-3 ${
              index < Math.min(visibleLessons, lessons.length) - 1 ? "border-bottom" : ""
            } ${selectedLessonId === lesson.id ? "bg-light-blue" : ""}`}
            style={{
              cursor: "pointer",
              transition: "background-color 0.2s ease",
              borderRadius: "4px",
            }}
          >
            <div
              className="d-flex justify-content-between align-items-center w-100"
              onClick={() => setSelectedLesson(lesson)}
            >
              <span
                className={selectedLessonId === lesson.id ? "fw-semibold text-primary" : ""}
              >
                {index + 1}. {lesson.title}
              </span>
              <span className={selectedLessonId === lesson.id ? "text-primary" : "text-muted"}>
                {lesson.duration || "0:00"}
              </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditLesson(lesson);
              }}
              className="btn btn-sm btn-link text-muted p-1 rounded"
              aria-label="Edit lesson"
            >
              <FiEdit size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="d-flex gap-3 align-items-center">
        {addButton && (
          <button
            className="btn btn-link text-primary p-0 fw-medium"
            onClick={() => handleCreateLessons()}
          >
            + Add Lesson
          </button>
        )}

        {lessons.length > 3 && visibleLessons < lessons.length && (
          <button
            className="btn btn-link text-primary p-0 fw-medium"
            onClick={handleViewAll}
          >
            View All
          </button>
        )}

        {visibleLessons === lessons.length && lessons.length > 3 && (
          <button
            className="btn btn-link text-primary p-0 fw-medium"
            onClick={handleViewLess}
          >
            View Less
          </button>
        )}
      </div>

      {/* Edit Lesson Modal */}
      <Modal show={editModalShow} onHide={() => setEditModalShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Lesson</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {updateError && (
            <Alert variant="danger" className="mb-3">
              {updateError}
            </Alert>
          )}
          
          {currentLesson && (
            <ReusableForm
              fields={lessonFields}
              validationSchema={lessonSchema}
              onSubmit={handleUpdateLesson}
              defaultValues={{
                title: currentLesson.title,
                description: currentLesson.description,
              }}
              footer={(
                <div className="d-flex justify-content-end mt-3">
                  <Button 
                    variant="secondary" 
                    onClick={() => setEditModalShow(false)}
                    className="me-2"
                    disabled={updateLoading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={updateLoading}
                  >
                    {updateLoading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Updating...
                      </>
                    ) : "Update Lesson"}
                  </Button>
                </div>
              )}
            />
          )}
        </Modal.Body>
      </Modal>

      {/* Upload Progress Modal */}
      
    </div>
    <UploadProgressModal
        show={showProgressModal}
        progress={uploadProgress}
        onClose={() => {
          // Only allow closing if upload is complete or hasn't started
          if (uploadProgress >= 100 || uploadProgress === 0) {
            setShowProgressModal(false);
          }
        }}
        isUploading={uploadProgress > 0 && uploadProgress < 100}
      />
    </>
  );
};

export default Lessons;