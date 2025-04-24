import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/courseoptions/Header";
import CoursePreview from "../../components/courseoptions/CoursePreview";
import PieChart from "../../components/courseoptions/PieChart";
import Quizzes from "../../components/courseoptions/Quizzes";
import Assignments from "../../components/courseoptions/Assignments";
import Reviews from "../../components/courseoptions/Reviews";
import EditCourse from "../../Features/instructers/EditCourse";
import * as yup from "yup";
import ReusableForm from "../../components/ReusableForm";
import { Modal, Button, Form } from "react-bootstrap";
import { fetchInstructorCourses } from "../../Redux/Slices/CoursesSlice";
import { createLesson, updateLesson } from "../../Redux/Slices/lessonsSlice";
import { useDispatch, useSelector } from "react-redux";
import { SyncLoader } from "react-spinners";
function CourseDetailView() {
  const [showModal, setShowModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [Lesson, setLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const courseId = parseInt(id, 10);
  const [editcourse, setEditCourse] = useState(false);
  const course = useSelector((state) =>
    state.courses.instructorCourses.find((course) => String(course.id) === id)
  );

  const handleCreateLessons = () => {
    setShowModal(true);
    setLesson({});
    console.log(Lesson, "lessons");
  };
  useEffect(() => {
    dispatch(fetchInstructorCourses());
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
    if (!formData.title || !formData.description) {
      console.error("Form Data Missing Required Fields:", formData);
      setIsLoading(false);
      return;
    }

    const lessonData = new FormData();
    lessonData.append("title", formData.title || Lesson.title);
    lessonData.append(
      "description",
      formData.description || Lesson.description
    );
    lessonData.append("course", courseId || Lesson.course);

    if (formData.video_file) {
      const videoFile = formData.video_file[0] || formData.video_file;
      if (videoFile) {
        lessonData.append("video_file", videoFile);
      }
    }

    if (Lesson) {
      
      // Make sure to use the correct parameter names that match the thunk
      dispatch(updateLesson({ id: Lesson.id, data: lessonData }));
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } else {
      dispatch(createLesson(lessonData));
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }

    setShowModal(false);
    setSelectedLesson(null);
  };

  return (
    <div
      style={{
        backgroundColor: "#f3f4f6",
        minHeight: "100vh",
        padding: "10px",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          marginLeft: "110px",
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
              {/* CoursePreview takes 70% width */}
              <div className="w-full" style={{ flex: "0 0 70%" }}>  {/* Added w-full */}
                <CoursePreview
                  course={course}
                  handleCreateLessons={handleCreateLessons}
                  setShowModal={setShowModal}
                  showModal={showModal}
                  isLoading={isLoading}
                  setLesson={setLesson}
                />

                {/* Rest of the content */}
                <Quizzes courseId={courseId} />
              </div>

              {/* PieChart takes 30% width */}
              <div style={{ flex: "0 0 30%" }}>
                <PieChart />
                <br />
                <Assignments
                  items={[
                    {
                      name: "Project 1",
                      dueDate: "May 15, 2024",
                      status: "Open",
                    },
                    {
                      name: "Project 2",
                      dueDate: "Add Assignment",
                      status: "Open",
                    },
                    {
                      name: "Project 2",
                      dueDate: "Add Assignment",
                      status: "Open",
                    },
                    {
                      name: "Project 2",
                      dueDate: "Add Assignment",
                      status: "Open",
                    },
                    {
                      name: "Project 2",
                      dueDate: "Add Assignment",
                      status: "Open",
                    },
                  ]}
                />
              </div>
            </div>
            <Reviews corseId={courseId} />
          </div>

          {/* Sidebar Column - For Progress */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            {/* <Progress percentage={50} rating={4.5} label="UI/UX Progress" /> */}
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
          <Modal.Title>{Lesson ? "Edit Lesson" : "Add New Lesson"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Course</Form.Label>
            <Form.Control type="text" value={course.title} readOnly />
          </Form.Group>

          <ReusableForm
            fields={lessonFields}
            validationSchema={lessonSchema}
            onSubmit={handleCreateLesson}
            defaultValues={Lesson}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {isLoading ? (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent overlay
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000, // Ensure it's above other elements
            cursor: "not-allowed", // Optional: Show "busy" cursor
          }}
        >
          <SyncLoader
            color="#36d7b7" // Customize color
            loading={isLoading}
            size={15} // Adjust size
            speedMultiplier={0.8} // Control animation speed
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default CourseDetailView;
