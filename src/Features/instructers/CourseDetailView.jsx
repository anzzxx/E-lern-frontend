import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/courseoptions/Header";
import CoursePreview from "../../components/courseoptions/CoursePreview";
import Quizzes from "../../components/courseoptions/Quizzes";
import Assignments from "../../components/courseoptions/Assignments";
import Reviews from "../../components/courseoptions/Reviews";
import EditCourse from "../../Features/instructers/EditCourse";
import * as yup from "yup";
import ReusableForm from "../../components/ReusableForm";
import { Modal, Button, Form } from "react-bootstrap";
import { fetchInstructorCourses } from "../../Redux/Slices/CoursesSlice";
import { fetchReviews } from "../../Redux/Slices/reviewSlice";
import { createLesson } from "../../Redux/Slices/lessonsSlice";
import { useDispatch, useSelector } from "react-redux";
import UploadProgressModal from "../../components/UploadProgressModal";

function CourseDetailView() {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const courseId = parseInt(id, 10);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [showProgressModal, setShowProgressModal] = useState(false);

  const [editcourse, setEditCourse] = useState(false);
  const course = useSelector((state) =>
    state.courses.instructorCourses.find((course) => String(course.id) === id)
  );

  const handleCreateLessons = () => {
    setShowModal(true);
  };

  useEffect(() => {
    dispatch(fetchInstructorCourses());
    dispatch(fetchReviews())
  }, [dispatch, editcourse, showModal]);

  const onClose = () => {
    setEditCourse(false);
  };

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
    },
  ];

  const lessonSchema = yup.object().shape({
    title: yup.string().required("Title is required"),
    description: yup.string().required("Description is required"),
    video_file: yup.mixed().nullable(),
  });

  const handleCreateLesson = (formData) => {
    setIsLoading(true);
    setShowModal(false);
    setShowProgressModal(true);
    setUploadProgress(0);
    
    if (!formData.title || !formData.description) {
      console.error("Form Data Missing Required Fields:", formData);
      setIsLoading(false);
      return;
    }

    const lessonData = new FormData();
    lessonData.append("title", formData.title);
    lessonData.append("description", formData.description);
    lessonData.append("course", courseId);

    if (formData.video_file) {
      const videoFile = formData.video_file[0] || formData.video_file;
      if (videoFile) {
        lessonData.append("video_file", videoFile);
      }
    }

    dispatch(
      createLesson({
        formData: lessonData,
        setProgress: (progress) => {
          setUploadProgress(progress);
        },
      })
    )
      .then((resultAction) => {
        if (createLesson.fulfilled.match(resultAction)) {
          console.log("Lesson created successfully");
        } else {
          console.error("Lesson creation failed", resultAction.payload);
        }
      })
      .finally(() => {
        setIsLoading(false);
        setTimeout(() => {
          setShowProgressModal(false);
          setShowModal(false);
        }, 1000);
      });
  };

  return (
    <div
      style={{
        backgroundColor: "#f3f4f6",
        minHeight: "100vh",
        padding: "10px",
        width: "100%",
      }}
    >
      <div
        style={{
          maxWidth: "1330px",
          margin: "0 auto",
          marginLeft: "10px",
        }}
      >
        <Header setEditCourse={setEditCourse} editcourse={editcourse} />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "24px",
            marginTop: "24px",
          }}
        >
          {/* Main Content Column */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            {/* First Row with CoursePreview and PieChart side by side */}
            <div
              style={{
                display: "flex",
                gap: "24px",
                alignItems: "flex-start",
              }}
            >
              {/* CoursePreview takes 50% width */}
              <div className="w-full" style={{ flex: "0 0 50%" }}>
                <CoursePreview
                  course={course}
                  handleCreateLessons={handleCreateLessons}
                  setShowModal={setShowModal}
                  showModal={showModal}
                  isLoading={isLoading}
                />
              </div>

              {/* Quizzes and Reviews take 47% width */}
              <div style={{ flex: "0 0 47%" }}>
                <Quizzes courseId={courseId} />
                <br />
                <Reviews corseId={courseId} />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {editcourse && (
        <div
          style={{
            position: "fixed",
            paddingTop: "0px",
            top: "0px",
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <EditCourse course={course} onClose={() => onClose()} />
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Lesson</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Course</Form.Label>
            <Form.Control type="text" value={course?.title} readOnly />
          </Form.Group>

          <ReusableForm
            fields={lessonFields}
            validationSchema={lessonSchema}
            onSubmit={handleCreateLesson}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      
      <UploadProgressModal
        show={showProgressModal}
        progress={uploadProgress}
        onClose={() => setShowProgressModal(false)}
      />
    </div>
  );
}

export default CourseDetailView;