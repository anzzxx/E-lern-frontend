import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchLesson, createLesson, updateLesson } from "../../Redux/Slices/lessonsSlice";
import Reusablesidebar from "../../components/Reusablesidebar";
import ReusableTable from "../../components/ReusableTable";
import ReusableForm from "../../components/ReusableForm";
import { PiFolderPlusBold } from "react-icons/pi";
import * as yup from "yup";
import { Modal, Button, Form } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import { use } from "react";

function Lessons() {
  const dispatch = useDispatch();
  const { lessons, loading, error } = useSelector((state) => state.lesson);
  const courses = useSelector((state) => state.courses.courses);
  
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedLesson, setSelectedLesson] = useState(null);

  useEffect(() => {
    dispatch(fetchLesson());
  }, [dispatch]);

  //faind this user course
  
  const user_id = useSelector((state) => state.auth.user?.id);
  const userCourses = courses.filter((course) => course.instructor && course.instructor.user_id === user_id);
  const course_ids = userCourses.map((course) => course.id);
  
  const filteredLessons = lessons.filter(lesson => course_ids.includes(lesson.course_id));
  
  
  const lessonFields = [
    { name: "title", label: "Title", type: "text", placeholder: "Enter lesson title" },
    { name: "description", label: "Description", type: "textarea", placeholder: "Enter lesson description" },
    { name: "video_file", label: "Upload Video", type: "file", accept: "video/*" },
  ];

  const lessonSchema = yup.object().shape({
    title: yup.string().required("Title is required"),
    description: yup.string().required("Description is required"),
    video_file: yup.mixed().nullable(),
  });

  const handleCreateLesson = (formData) => {
    

    if (!selectedCourse) {
      alert("Please select a course.");
      return;
    }

    if (!formData.title || !formData.description) {
      console.error("Form Data Missing Required Fields:", formData);
      return;
    }

    const lessonData = new FormData();
    lessonData.append("title", formData.title);
    lessonData.append("description", formData.description);
    lessonData.append("course", selectedCourse);

    if (formData.video_file && formData.video_file[0]) {
      lessonData.append("video_file", formData.video_file[0]);
    }

    if (selectedLesson) {
      // If editing, update the lesson
      dispatch(updateLesson({ id: selectedLesson.id, data: lessonData }));
    } else {
      // Otherwise, create a new lesson
      dispatch(createLesson(lessonData));
    }

    setShowModal(false);
    setSelectedLesson(null);
  };

  const handleEdit = (lesson) => {
    
    
    setSelectedLesson(lesson);
    setSelectedCourse(lesson.course);
    setShowModal(true);
  };
  
  
  return (
    <>
      <div className="top-bar d-flex justify-content-end p-3">
        <PiFolderPlusBold
          className="plus-icon"
          size={30}
          onClick={() => {
            setShowModal(true);
            setSelectedLesson(null); // Reset on new lesson creation
          }}
          style={{ cursor: "pointer" }}
        />
      </div>

      <Reusablesidebar
        title="E-LEARN"
        menuItems={[
          { label: "Dashboard", path: "/instructor/" },
          { label: "Courses", path: "/instructor/course" },
          { label: "Lessons", path: "/instructor/lessons" },
          { label: "Notification", path: "/instructor/notification" },
          { label: "MCQ-Test", path: "/instructor/mcq-test" },
          { label: "Logout", onClick: () => console.log("Logout") },
        ]}
      />

      <div className="container mt-4">
        <h1>Lessons</h1>
        {loading && <p>Loading...</p>}
        {error && <p className="text-danger">Error: {error}</p>}
        {!loading && !error && lessons?.length > 0 ? (
          <ReusableTable
            columns={[
              { field: "id", label: "ID" },
              { field: "title", label: "Title" },
              { field: "description", label: "Description" },
              { field: "course_name", label: "Course" },
              {
                label: "Action",
                field: "action",
                render: (row) => (
                  <div className="action-icons">
                    <FaEdit className="delete-icon" onClick={() => handleEdit(row)} />
                    <FaTrash className="delete-icon" />
                  </div>
                ),
              },
            ]}
            data={filteredLessons}
          />
        ) : (
          <p>No lessons available</p>
        )}
      </div>
 
      
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedLesson ? "Edit Lesson" : "Add New Lesson"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Select Course</Form.Label>
            <Form.Select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
              <option value="">Select Course</option>
              {userCourses &&
                userCourses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
            </Form.Select>
          </Form.Group>

          <ReusableForm
            fields={lessonFields}
            validationSchema={lessonSchema}
            onSubmit={handleCreateLesson}
            defaultValues={selectedLesson} // Pass selected lesson data for pre-filling the form
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Lessons;

