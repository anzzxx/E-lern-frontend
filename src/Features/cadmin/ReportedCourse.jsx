import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReusableTable from "../../components/ReusableTable";
import { handleLogout } from "../../components/Logout";
import Reusablesidebar from "../../components/Reusablesidebar";
import { fetchCourseReports } from "../../Redux/Slices/ReportedCourseSlice";
import { format } from "date-fns";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/button.css";
import SearchFilter from "../../components/SearchFilter";
import ReactPaginate from "react-paginate";
import ReportedCoursePopup from "../../Features/cadmin/ReportedCourseDetail";
import { fetchCourse } from "../../Redux/Slices/CoursesSlice";

function ReportedCourse() {
  const dispatch = useDispatch();
  const { reports, error } = useSelector((state) => state.courseReports);
  const {singleCourse}=useSelector((state)=>state.courses)
  console.log(singleCourse,'report from store');
  
  const { course } = useSelector((state) => state.courses);
  const [filteredReports, setFilteredReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // Fetch reports data
  useEffect(() => {
    dispatch(fetchCourseReports());
    
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [dispatch]);

  // Update filtered reports when reports data changes
  useEffect(() => {
    if (reports) {
      setFilteredReports(reports);
    }
  }, [reports]);

  const handleViewReport = (report) => {
    
    setSelectedReport(report);
    // If report.course is an object, it already contains course details
    if (typeof report.course === 'object') {
      setShowPopup(true);
    } else {
      // If report.course is just an ID, fetch the course details
      console.log(report,'reports');
      
      dispatch(fetchCourse({ courseId: report.course, reportId: report.id }))

        .unwrap()
        .then(() => {
          setShowPopup(true);
        })
        .catch(error => {
          console.error("Failed to fetch course:", error);
        });
    }
  };

  const menuItems = [
    { label: "Dashboard", path: "/admin-panel" },
    { label: "Users", path: "/admin-panel/users" },
    { label: "Requests", path: "/admin-panel/requests" },
    {
      label: "Reported Courses",
      path: "/admin-panel/reportedcourse-list",
      active: true,
    },
    { label: "Payments", path: "/admin-panel/payments" },
    { label: "Instructors", path: "/admin-panel/instructors" },
    { label: "Logout", onClick: handleLogout },
  ];

  // Process data before displaying
  const processedData = filteredReports?.map((report) => ({
    ...report,
    user:
      typeof report.user === "object"
        ? report.user?.name || "Anonymous"
        : report.user,
    course:
      typeof report.course === "object"
        ? report.course?.title || "Deleted Course"
        : `Course ID: ${report.course}`,
    created_at: format(new Date(report.created_at), "MMM dd, yyyy HH:mm"),
  })) || [];

  const columns = [
    { field: "id", label: "ID", width: 80 },
    { field: "user", label: "Student", width: 150 },
    { field: "course", label: "Course", width: 200 },
    { field: "reason", label: "Reason", width: 250 },
    {
      field: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`badge ${
            row.status === "pending" ? "bg-warning" : "bg-success"
          }`}
        >
          {row.status}
        </span>
      ),
      width: 120,
    },
    {
      field: "created_at",
      label: "Reported Date & Time",
      width: 180,
    },
    {
      field: "view",
      label: "View",
      render: (row) => (
        <button 
          className="btn btn-sm btn-primary"
          onClick={() => handleViewReport(row)}
        >
          View
        </button>
      ),
      width: 100,
    },
  ];

  // Pagination Logic
  const itemsPerPage = 5;
  const pageCount = Math.ceil(filteredReports.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const displayedCourses = filteredReports.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
// Prepare report data for the popup
const getReportDataForPopup = () => {
    if (!selectedReport) return null;
    
    return singleCourse
    
  };

  return (
    <div className="admin-container">
      <Reusablesidebar title="E-LERN" menuItems={menuItems} />

      <main className="content">
        <h2 clas sName="page-title">Reported Courses</h2>

        {!loading && reports?.length > 0 && (
          <SearchFilter
            data={reports}
            fields={["user", "course", "reason", "status"]}
            onFilter={setFilteredReports}
            showFilters={false}
          />
        )}

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">
            Error loading reports: {error.message}
          </div>
        ) : processedData.length > 0 ? (
          <div className="card">
            <div className="card-body">
              <ReusableTable
                columns={columns}
                data={displayedCourses}
                className="table-striped table-hover"
              />
            </div>
          </div>
        ) : (
          <div className="alert alert-info">No reported courses found</div>
        )}

        {showPopup && selectedReport && (
          <ReportedCoursePopup
            report={getReportDataForPopup()}
            onClose={() => {
              setShowPopup(false);
              setSelectedReport(null);
            }}
          />
        )}
      </main>
      
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
  );
}

export default ReportedCourse;