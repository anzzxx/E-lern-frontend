import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCourses } from "../../Redux/Slices/CoursesSlice";
import ReusableTable from "../../components/ReusableTable";
import AddCourse from "../../Features/instructers/AddCourse";
import EditCourse from "../../Features/instructers/EditCourse"; // Import Edit Form
import { PiFolderPlusBold } from "react-icons/pi";
import { FaEdit, FaTrash } from "react-icons/fa";
import {handleLogout} from '../../components/Logout'
import { updateCourse } from "../../Redux/Slices/CoursesSlice";
import api from "../../Redux/api";
import "../../styles/addcourse.css";
import Reusablesidebar from "../../components/Reusablesidebar"
function Course() {

  const dispatch = useDispatch();
  const { courses } = useSelector((state) => state.courses);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch,updateCourse]);
  
  const handleEdit = (course) => {
    setSelectedCourse(course);
   
    setShowEditForm(true);
  };

  const handleDelete = async (courseId) => {
    try {
      await api.delete(`course/courses/${courseId}/`);
      dispatch(fetchCourses());
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const columns = [
    { label: "ID", field: "id" },
    { label: "Title", field: "title" },
    { label: "Description", field: "description" },
    { label: "Price", field: "price" },
    { label: "Status", field: "status" },
    {
      label: "Action",
      field: "action",
      render: (course) => (
        <div className="action-icons">
          <FaEdit className="edit-icon" onClick={() => handleEdit(course)} />
          <FaTrash className="delete-icon" onClick={() => handleDelete(course.id)} />
        </div>
      ),
    },
  ];

  const menuItems = [
      { label: "Dashboard", path: "/instructor/" },  
      { label: "Courses", path: "/instructor/course" },    
      { label: "Logout", onClick: handleLogout },  
    ];
  return (
    <>
      <Reusablesidebar  title="E-LERN" menuItems={menuItems}/>
      <div className="top-bar">
        <PiFolderPlusBold className="plus-icon" onClick={() => setShowAddForm(!showAddForm)} />
      </div>
      
      {showAddForm && <AddCourse />}
      {showEditForm && selectedCourse && (
        <EditCourse course={selectedCourse} onClose={() => setShowEditForm(false)} />
      )}

      {!showAddForm && !showEditForm && <ReusableTable columns={columns} data={courses} />}
    </>
  );
}

export default Course;
