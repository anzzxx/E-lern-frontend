import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { SyncLoader } from "react-spinners";

const PaymentHistoryTable = () => {
  const [isLoading, setIsLoading] = useState(true);
  const paymentHistory = useSelector((state) => state.instructorStats.stats);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5 seconds delay

    return () => clearTimeout(timer);
  }, [paymentHistory]);

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #ffffff 0%, #f9f9ff 100%)",
        borderRadius: "8px",
        padding: "20px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        width: "100%",
        border: "1px solid rgba(108, 99, 255, 0.1)",
        height: "80%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: isLoading ? "center" : "stretch",
      }}
    >
      {isLoading ? (
        <SyncLoader color="#6c63ff" />
      ) : (
        <>
          <h3
            style={{
              margin: "0 0 15px 0",
              fontSize: "18px",
              color: "#2c2c54",
              fontWeight: "600",
              letterSpacing: "0.5px",
            }}
          >
            Payment History
          </h3>

          <div
            style={{
              background: "rgba(245, 245, 255, 0.6)",
              borderRadius: "8px",
              padding: "10px",
              overflowY: "auto",
              flex: "1 1 0",
              scrollbarWidth: "none", // For Firefox
              msOverflowStyle: "none", // For IE and Edge
              "&::-webkit-scrollbar": { // For Chrome, Safari, and Opera
                display: "none",
              },
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "separate",
                borderSpacing: "0",
                fontSize: "14px",
                color: "#444",
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid rgba(108, 99, 255, 0.2)",
                    background: "rgba(108, 99, 255, 0.05)",
                  }}
                >
                  <th style={thStyle}>No</th>
                  <th style={thStyle}>Month</th>
                  <th style={thStyle}>Course Title</th>
                  <th style={thStyle}>Enrollments</th>
                  <th style={thStyle}>Total Amount</th>
                  <th style={thStyle}>Instructor Share</th>
                  <th style={thStyle}>Platform Share</th>
                  <th style={thStyle}>Paid To Instructor</th>
                  <th style={thStyle}>Paid On</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((payment, index) => (
                  <tr key={index} style={trStyle}>
                    <td style={tdStyle}>{index + 1}</td>
                    <td style={tdStyle}>
                      {new Date(payment.month).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                    <td style={tdStyle}>{payment.course_title}</td>
                    <td style={tdStyle}>
                      <span style={pillStyle("#6c63ff", "#efeeff")}>
                        {payment.total_enrollments}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span style={pillStyle("#28a745", "#e6f4ea")}>
                        ₹{payment.total_amount}
                      </span>
                    </td>
                    <td style={tdStyle}>₹{payment.instructor_share}</td>
                    <td style={tdStyle}>₹{payment.platform_share}</td>
                    <td style={tdStyle}>
                      {payment.paid_to_instructor ? (
                        <span style={pillStyle("#28a745", "#e6f4ea")}>Yes</span>
                      ) : (
                        <span style={pillStyle("#dc3545", "#fdecea")}>No</span>
                      )}
                    </td>
                    <td style={tdStyle}>
                      {payment.paid_on
                        ? new Date(payment.paid_on).toLocaleDateString()
                        : "--"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

// Reusable styles
const thStyle = {
  textAlign: "left",
  padding: "12px 10px",
  fontWeight: "600",
  color: "#2c2c54",
  position: "sticky",
  top: 0,
  background: "#f3f3ff",
  zIndex: 1,
};

const tdStyle = {
  padding: "12px 10px",
  color: "#444",
};

const trStyle = {
  borderBottom: "1px solid rgba(108, 99, 255, 0.1)",
  transition: "background 0.2s ease",
};

const pillStyle = (color, bg) => ({
  fontWeight: "700",
  color: color,
  background: bg,
  padding: "2px 6px",
  borderRadius: "4px",
});

export default PaymentHistoryTable;