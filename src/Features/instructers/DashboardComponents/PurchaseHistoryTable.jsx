import React, { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";
import api from "../../../Redux/api";
import "../../../styles/PurchaseHistoryTable.css";

const PurchaseHistoryTable = () => {
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itemsPerPage] = useState(15); // Increased items per page for full screen
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchInstructorCourseSalesData = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("instructor/course-sales/");
        setPurchases(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching sales data:', error);
        setError(error);
        setIsLoading(false);
      }
    };

    fetchInstructorCourseSalesData();
  }, []);

  const totalPages = Math.ceil(purchases.length / itemsPerPage);
  const currentData = purchases.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  if (isLoading) {
    return (
      <div className="fullscreen-loading">
        <SyncLoader color="#6c63ff" size={15} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="fullscreen-error">
        <p>Error loading purchase history: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="fullscreen-container">
      <div className="fullscreen-header">
        <h1>Purchase History</h1>
        <div className="header-info">
          <span>Total Purchases: {purchases.length}</span>
          <span>Page {currentPage} of {totalPages}</span>
        </div>
      </div>

      <div className="fullscreen-table-container">
        <table className="fullscreen-table">
          <thead>
            <tr>
              <th className="date-col">Purchase Date</th>
              <th className="course-col">Course</th>
              <th className="student-col">Student</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length === 0 ? (
              <tr>
                <td colSpan="3" className="no-data">
                  No purchases available
                </td>
              </tr>
            ) : (
              currentData.map((item) => (
                <tr key={item.id}>
                  <td className="date-col">
                    {new Date(item.enrolled_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="course-col">{item.course_title}</td>
                  <td className="student-col">{item.username}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {purchases.length > 0 && (
        <div className="fullscreen-pagination">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="pagination-btn first-last"
          >
            « First
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            ‹ Prev
          </button>
          
          <div className="page-numbers">
            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 7) {
                pageNum = i + 1;
              } else if (currentPage <= 4) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 3) {
                pageNum = totalPages - 6 + i;
              } else {
                pageNum = currentPage - 3 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next ›
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="pagination-btn first-last"
          >
            Last »
          </button>
        </div>
      )}
    </div>
  );
};

export default PurchaseHistoryTable;