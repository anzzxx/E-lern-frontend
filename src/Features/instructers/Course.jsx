import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchInstructorCourses } from "../../Redux/Slices/CoursesSlice";
import ReusableTable from "../../components/ReusableTable";
import UploadProgressModal from "../../components/UploadProgressModal";
import AddCourse from "../../Features/instructers/AddCourse";
import { PiFolderPlusBold } from "react-icons/pi";
import { IoMdOpen } from "react-icons/io";
import { handleLogout } from "../../components/Logout";
import Reusablesidebar from "../../components/Reusablesidebar";
import SearchFilter from '../../components/SearchFilter';

import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import "../../styles/addcourse.css";

function Course() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { instructorCourses } = useSelector((state) => state.courses);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showfilter, setShowFilter] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // New state for forcing refresh

  const courses = instructorCourses || [];
  const user_id = useSelector((state) => state.auth.user?.id);
  const userCourses = courses.filter(
    (course) => course.instructor && course.instructor.user_id === user_id
  );

  // Fetch courses on initial load and when refreshKey changes
  useEffect(() => {
    dispatch(fetchInstructorCourses());
  }, [dispatch, refreshKey]);

  // Handle upload completion
  useEffect(() => {
    if (uploadProgress === 100) {
      const timer = setTimeout(() => {
        setRefreshKey(prev => prev + 1); // Force refresh
        setShowProgressModal(false);
        setShowAddForm(false);
        setShowFilter(true);
        setUploadProgress(0); // Reset progress
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [uploadProgress]);

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
          <IoMdOpen
            className="delete-icon"
            onClick={() => navigate(`/instructor/course/${course.id}`)}
          />
          <button>Publish the Course</button>
        </div>
      ),
    },
  ];

  const menuItems = [
    { label: "Dashboard", path: "/instructor/" },
    { label: "Courses", path: "/instructor/course" },
    { label: "Notification", path: "/instructor/notification" },
    { label: "Payment History", path: "/instructor/payment/details" },
    { label: "Create Meeting", path: "/instructor/create-meenting" },
    { label: "Logout", onClick: handleLogout },
  ];

  const itemsPerPage = 8;
  const pageCount = Math.ceil(filteredCourses.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const displayedCourses = filteredCourses.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <>
      <Reusablesidebar title="E-LEARN" menuItems={menuItems} />

      {showfilter && courses.length > 0 && (
        <SearchFilter
          data={userCourses}
          fields={["title", "description"]}
          onFilter={setFilteredCourses}
          showFilters={false}
        />
      )}

      <div className="top-bar">
        <PiFolderPlusBold
          className="plus-icon"
          onClick={() => {
            setShowAddForm(!showAddForm);
            setShowFilter(false);
          }}
        />
      </div>

      {showAddForm && (
        <AddCourse
          setShowAddForm={setShowAddForm}
          setUploadProgress={setUploadProgress}
          setShowProgressModal={setShowProgressModal}
        />
      )}

      {!showAddForm && (
        <>
          <ReusableTable columns={columns} data={displayedCourses} />

          <ReactPaginate
            previousLabel={"← Previous"}
            nextLabel={"Next →"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={1}
            pageRangeDisplayed={1}
            onPageChange={handlePageClick}
            containerClassName={"pagination"}
            pageClassName={"page-item"}
            activeClassName={"active"}
            previousClassName={"page-item"}
            nextClassName={"page-item"}
            breakClassName={"page-item"}
          />

          <UploadProgressModal
            show={showProgressModal}
            progress={uploadProgress}
            onClose={() => {
              setShowProgressModal(false);
              setRefreshKey(prev => prev + 1); 
            }}
          />
        </>
      )}
    </>
  );
}

export default Course;