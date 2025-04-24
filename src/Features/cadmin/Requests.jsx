import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import api from "../../Redux/api"; // API instance
import ReusableTable from "../../components/ReusableTable";
import Reusablesidebar from "../../components/Reusablesidebar";
import { handleLogout } from "../../components/Logout";
import SearchFilter from "../../components/SearchFilter";
import ReactPaginate from "react-paginate"; 
const Requests = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const menuItems = [
    { label: "Dashboard", path: "/admin-panel" },
    { label: "Users", path: "/admin-panel/users" },
    { label: "Requests", path: "/admin-panel/requests" },
    { label: "Reported Courses", path: "/admin-panel/reportedcourse-list" },
    {label: "Payments", path: "/admin-panel/payments" },
    { label: "Instructors", path: "/admin-panel/instructors" },
    { label: "Logout", onClick: handleLogout }, // Handle Logout separately
  ];

  // Fetch inactive courses
  useEffect(() => {
    const fetchCourses = async () => {
      
      try {
        const response = await api.get("cadmin/inactive-courses/");
        const coursesData = response.data || []; // Ensure it's an array
        setCourses(coursesData);
        setFilteredCourses(coursesData);
      } catch (error) {
        console.error("Error fetching inactive courses:", error);
      } finally {
       
      }
    };

    fetchCourses();
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Approve course (Activate)
  const handleApprove = async (id) => {
    try {
      await api.patch(`cadmin/activate-course/${id}/`);
      setCourses((prev) =>
        prev.map((course) => (course.id === id ? { ...course, is_active: true } : course))
      );
      setFilteredCourses((prev) =>
        prev.map((course) => (course.id === id ? { ...course, is_active: true } : course))
      );
    } catch (error) {
      console.error(`Error approving course ${id}:`, error);
    }
  };

  // Remove course from list (Cancel Request)
  const handleCancel = (id) => {
    setCourses((prev) => prev.filter((course) => course.id !== id));
    setFilteredCourses((prev) => prev.filter((course) => course.id !== id));
  };

  // Define table columns
  const columns = [
    { field: "id", label: "ID" },
    { field: "instructor", label: "Instructor" },
    { field: "title", label: "Title" },
    { field: "price", label: "Price ($)" },
    { field: "description", label: "Description" },
    {
      field: "actions",
      label: "Actions",
      render: (row) => (
        <div style={{ display: "flex", gap: "10px" }}>
          {!row.is_active ? (
            <>
              <FaCheckCircle
                onClick={() => handleApprove(row.id)}
                style={{ color: "green", fontSize: "20px", cursor: "pointer" }}
                title="Approve"
              />
              <FaTimesCircle
                onClick={() => handleCancel(row.id)}
                style={{ color: "red", fontSize: "20px", cursor: "pointer" }}
                title="Cancel"
              />
            </>
          ) : (
            <span style={{ color: "green", fontWeight: "bold" }}>✔️ Approved</span>
          )}
        </div>
      ),
    },
  ];

  


  // **Pagination Logic**
    
  const itemsPerPage = 1;
  const pageCount = Math.ceil(filteredCourses.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
      setCurrentPage(selected);
  };
  const displayedRequests = filteredCourses.slice(
      currentPage * itemsPerPage,
      (currentPage + 1) * itemsPerPage
  );
  console.log(filteredCourses);
  
  return (
    <div className="requests-container">
      <Reusablesidebar title="E-LERN" menuItems={menuItems} />
      <h2>Search Courses</h2>
      
      {!loading && courses.length > 0 && (
        <SearchFilter
          data={courses}
          fields={["title", "instructor","description"]}
          onFilter={setFilteredCourses}
          showFilters={false}
        />
      )}

      <h2>Course Requests</h2>
      {loading ? (
         <div className="text-center py-4">
         <div className="spinner-border" role="status">
             <span className="visually-hidden">Loading...</span>
         </div>
     </div>
      ) : filteredCourses.length > 0 ? (
        <ReusableTable columns={columns} data={displayedRequests} />
      ) : (
        <p>No pending course requests.</p>
      )}
      <div>
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
      </div>
    </div>
  );
};

export default Requests;
