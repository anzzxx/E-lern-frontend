import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { SyncLoader } from "react-spinners";

const PaymentTable = ({ appliedFilters }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { stats } = useSelector((state) => state.instructorStats);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredPayments = useMemo(() => {
    if (!stats) return [];

    // If no filters are applied or all filters are empty, return all payments
    if (
      !appliedFilters ||
      Object.values(appliedFilters).every((val) => !val)
    ) {
      return stats;
    }

    return stats.filter((item) => {
      // Search filter - check if search term exists in course title
      const matchesSearch =
        !appliedFilters.search ||
        item.course_title
          .toLowerCase()
          .includes(appliedFilters.search.toLowerCase());

      // Course filter - exact match (case-insensitive)
      const matchesCourse =
        !appliedFilters.course ||
        item.course_title.toLowerCase() === appliedFilters.course.toLowerCase();

      // Month filter - compare month names (case-insensitive)
      const itemMonth = new Date(item.month).toLocaleString("en-US", {
        month: "long",
      });
      const matchesMonth =
        !appliedFilters.month ||
        itemMonth.toLowerCase() === appliedFilters.month.toLowerCase();

      // Payment status filter (case-insensitive)
      const matchesPaymentStatus =
        !appliedFilters.paymentStatus ||
        (appliedFilters.paymentStatus.toLowerCase() === "paid" &&
          item.paid_to_instructor) ||
        (appliedFilters.paymentStatus.toLowerCase() === "pending" &&
          !item.paid_to_instructor);

      return (
        matchesSearch && matchesCourse && matchesMonth && matchesPaymentStatus
      );
    });
  }, [stats, appliedFilters]);

  if (isLoading) {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: "10px",
          padding: "24px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          textAlign: "center",
          minHeight: "300px",
          maxWidth: "70%",
        }}
      >
        <SyncLoader color="#6c63ff" size={10} />
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
        height: "320px",
        display: "flex",
        flexDirection: "column",
        maxWidth: "70%",
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
        Payment History
      </h3>

      <div
        style={{
          flex: 1,
          overflow: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          position: "relative",
        }}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `::-webkit-scrollbar { display: none; }`,
          }}
        />

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
              <th style={{ padding: "12px 16px", width: "20%" }}>Month</th>
              <th style={{ padding: "12px 16px", width: "35%" }}>Course</th>
              <th style={{ padding: "12px 16px", width: "15%" }}>
                Enrollments
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  width: "15%",
                  textAlign: "right",
                }}
              >
                Total
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  width: "15%",
                  textAlign: "right",
                }}
              >
                Your Share
              </th>
              <th
                style={{
                  padding: "12px 16px",
                  width: "15%",
                  textAlign: "right",
                }}
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    padding: "16px",
                    textAlign: "center",
                    color: "#64748b",
                  }}
                >
                  No payments match the current filters.
                </td>
              </tr>
            ) : (
              filteredPayments.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "12px 16px", color: "#334155" }}>
                    {new Date(item.month).toLocaleString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                  <td style={{ padding: "12px 16px", color: "#334155" }}>
                    {item.course_title}
                  </td>
                  <td style={{ padding: "12px 16px", color: "#334155" }}>
                    {item.total_enrollments}
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      textAlign: "right",
                      color: "#334155",
                    }}
                  >
                    ₹{parseFloat(item.total_amount).toLocaleString()}
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      textAlign: "right",
                      color: "#10b981",
                      fontWeight: "500",
                    }}
                  >
                    ₹{parseFloat(item.instructor_share).toLocaleString()}
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      textAlign: "right",
                      color: item.paid_to_instructor ? "#10b981" : "#ef4444",
                    }}
                  >
                    {item.paid_to_instructor
                      ? `Paid on ${new Date(item.paid_on).toLocaleDateString()}`
                      : "Pending"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentTable;