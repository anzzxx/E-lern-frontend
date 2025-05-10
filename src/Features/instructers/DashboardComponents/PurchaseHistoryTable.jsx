import React, { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";
import api from "../../../Redux/api";

const PurchaseHistoryTable = () => {
  const [purchases, setPurchases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for pagination
  const [itemsPerPage] = useState(10); // Fixed at 10 items per page
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

  // Calculate total pages
  const totalPages = Math.ceil(purchases.length / itemsPerPage);

  // Get current page data
  const currentData = purchases.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: "10px",
          padding: "24px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          textAlign: "center",
          height: "400px",
          width: "1200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SyncLoader color="#6c63ff" size={10} />
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: "10px",
          padding: "24px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          textAlign: "center",
          height: "400px",
          width: "1200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ef4444",
        }}
      >
        Error loading purchase history: {error.message}
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "10px",
        padding: "24px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        height: "400px",
        width: "1220px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <h3
        style={{
          fontSize: "18px",
          marginBottom: "16px",
          color: "#374151",
          fontWeight: "600",
          flexShrink: 0,
        }}
      >
        Purchase History
      </h3>

      <div
        style={{
          flex: 1,
          overflowX: "auto",
          overflowY: "auto",
          scrollbarWidth: "auto",
          msOverflowStyle: "auto",
          position: "relative",
        }}
      >
        <table
          style={{
            width: "100%",
            minWidth: "800px",
            fontSize: "14px",
            borderCollapse: "collapse",
            tableLayout: "fixed",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#f8fafc",
                color: "#64748b",
                textAlign: "left",
                borderBottom: "1px solid #e2e8f0",
                position: "sticky",
                top: 0,
                zIndex: 1,
              }}
            >
              <th style={{ padding: "12px 16px", width: "25%" }}>Purchase Date</th>
              <th style={{ padding: "12px 16px", width: "50%" }}>Course</th>
              <th style={{ padding: "12px 16px", width: "25%" }}>Student</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length === 0 ? (
              <tr>
                <td
                  colSpan="3"
                  style={{
                    padding: "16px",
                    textAlign: "center",
                    color: "#64748b",
                  }}
                >
                  No purchases available.
                </td>
              </tr>
            ) : (
              currentData.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "12px 16px", color: "#334155" }}>
                    {new Date(item.enrolled_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td style={{ padding: "12px 16px", color: "#334155" }}>
                    {item.course_title}
                  </td>
                  <td style={{ padding: "12px 16px", color: "#334155" }}>
                    {item.username}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {purchases.length > 0 && (
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{
              padding: "6px 12px",
              backgroundColor: currentPage === 1 ? "#e2e8f0" : "#6c63ff",
              color: currentPage === 1 ? "#64748b" : "#fff",
              borderRadius: "4px",
              border: "none",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              fontSize: "14px",
            }}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              style={{
                padding: "6px 12px",
                backgroundColor: currentPage === index + 1 ? "#6c63ff" : "#f8fafc",
                color: currentPage === index + 1 ? "#fff" : "#374151",
                borderRadius: "4px",
                border: "1px solid #e2e8f0",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{
              padding: "6px 12px",
              backgroundColor: currentPage === totalPages ? "#e2e8f0" : "#6c63ff",
              color: currentPage === totalPages ? "#64748b" : "#fff",
              borderRadius: "4px",
              border: "none",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              fontSize: "14px",
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PurchaseHistoryTable;