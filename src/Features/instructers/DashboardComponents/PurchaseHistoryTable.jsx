import React, { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";
import api from "../../../Redux/api";
import "../../../styles/PurchaseHistoryTable.css"; // Import the CSS file

const PurchaseHistoryTable = () => {
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itemsPerPage] = useState(10);
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
      <div className="loading-container">
        <SyncLoader color="#6c63ff" size={10} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        Error loading purchase history: {error.message}
      </div>
    );
  }

  return (
    <div className="table-container">
      <h3 className="table-title">Purchase History</h3>

      <div className="table-wrapper">
        <table className="styled-table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">Purchase Date</th>
              <th className="table-header-cell">Course</th>
              <th className="table-header-cell">Student</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length === 0 ? (
              <tr>
                <td className="empty-state" colSpan="3">
                  No purchases available.
                </td>
              </tr>
            ) : (
              currentData.map((item) => (
                <tr className="table-row" key={item.id}>
                  <td className="table-cell">
                    {new Date(item.enrolled_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="table-cell">{item.course_title}</td>
                  <td className="table-cell">{item.username}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {purchases.length > 0 && (
        <div className="pagination-container">
          <button
            className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className={`pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PurchaseHistoryTable;