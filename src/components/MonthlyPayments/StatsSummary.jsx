import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SyncLoader } from "react-spinners";
import api from "../../Redux/api";

const StatsSummary = () => {
  const { payoutSummary } = useSelector((state) => state.instructorPayout);
  const { selectedInstructor } = useSelector((state) => state.instructors);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const instructorId = selectedInstructor?.data?.id;

  useEffect(() => {
    const timer = setTimeout(() => {
      handleFetch();
    }, 1500);
    return () => clearTimeout(timer);
  }, [payoutSummary?.month, instructorId]);

  const formatAmount = (amount) => {
    if (!amount) return "₹0.00";
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `₹${num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  const formatDateForBackend = (dateString) => {
    if (!dateString) return "";
    const inputMonth = dateString;
    const dateObj = new Date(inputMonth + " 1");
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}-01`;
  };

  const formatMonthDisplay = (dateString) => {
    return dateString || "N/A";
  };

  const handleFetch = async () => {
    if (!payoutSummary?.month || !instructorId) {
      setIsLoading(false);
      return;
    }

    try {
      const formattedDate = formatDateForBackend(payoutSummary.month);
      const response = await api.get(
        `payment/payout-status/${instructorId}/${formattedDate}/`
      );
      setPaymentStatus(response.data);
    } catch (error) {
      console.error('Error fetching payout status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    {
      label: "Total Earnings",
      value: formatAmount(payoutSummary?.total_amount),
      color: "#4f46e5",
    },
    {
      label: "Your Earnings",
      value: formatAmount(paymentStatus?.total_amount || payoutSummary?.instructor_share),
      color: "#10b981",
    },
    {
      label: "Platform Fee",
      value: formatAmount(
        paymentStatus?.total_amount 
          ? paymentStatus.total_amount - (payoutSummary?.instructor_share || 0)
          : payoutSummary?.platform_share
      ),
      color: "#ef4444",
    },
    { 
      label: "Month", 
      value: formatMonthDisplay(payoutSummary?.month), 
      color: "#f59e0b" 
    },
  ];

  return (
    <div style={cardStyle}>
      <h3 style={headerStyle}>
        Payment Summary
      </h3>
      {isLoading ? (
        <div style={loadingStyle}>
          <SyncLoader color="#6c63ff" size={8} />
        </div>
      ) : paymentStatus?.is_paid ? (
        <div style={paidMessageStyle}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#10b981"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <h3 style={paidHeadingStyle}>Payout Processed</h3>
          <div style={paidDetailsStyle}>
            <p style={paidTextStyle}>
              <span style={paidDetailLabel}>Date:</span> {new Date(paymentStatus.paid_on).toLocaleDateString()}
            </p>
            <p style={paidTextStyle}>
              <span style={paidDetailLabel}>Method:</span> {paymentStatus.payout_method} ({paymentStatus.payout_reference})
            </p>
            <p style={earnedAmountStyle}>
              {formatAmount(paymentStatus.total_amount)}
            </p>
            {paymentStatus.notes && (
              <p style={{ ...paidTextStyle, fontStyle: 'italic' }}>
                <span style={paidDetailLabel}>Notes:</span> {paymentStatus.notes}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div style={statsGridStyle}>
          {stats.map((item, i) => (
            <div key={i} style={statItemStyle(item.color)}>
              <p style={statLabelStyle}>{item.label}</p>
              <h3 style={item.label.includes("Earnings") ? earnedAmountStyle : statValueStyle}>
                {item.value}
              </h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Enhanced Styles with maxHeight: "330px"
const cardStyle = {
  background: "#fff",
  borderRadius: "10px",
  padding: "16px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  flex: 1,
  margin: "8px",
  maxHeight: "330px",
  minHeight: "330px",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
};

const headerStyle = {
  fontSize: "18px",
  marginBottom: "12px",
  color: "#1f2937",
  fontWeight: "700",
  letterSpacing: "0.2px",
  borderBottom: "1px solid #e5e7eb",
  paddingBottom: "6px",
};

const loadingStyle = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "200px",
  background: "rgba(249, 250, 251, 0.5)",
  borderRadius: "8px",
};

const paidMessageStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  color: "#10b981",
  gap: "10px",
  padding: "8px 0",
  background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)",
  borderRadius: "8px",
  transition: "all 0.3s ease",
};

const paidHeadingStyle = {
  fontSize: "20px",
  fontWeight: "700",
  margin: "6px 0 4px",
  color: "#059669",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const paidDetailsStyle = {
  marginTop: "6px",
  textAlign: "left",
  width: "100%",
  maxWidth: "300px",
  background: "#ffffff",
  padding: "10px",
  borderRadius: "6px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
};

const paidTextStyle = {
  color: "#4b5563",
  fontSize: "14px",
  margin: "6px 0",
  lineHeight: "1.4",
  display: "flex",
  justifyContent: "space-between",
};

const paidDetailLabel = {
  fontWeight: "600",
  color: "#1f2937",
  marginRight: "8px",
  flexShrink: 0,
};

const earnedAmountStyle = {
  fontSize: "24px",
  fontWeight: "800",
  color: "#059669",
  margin: "10px 0",
  letterSpacing: "0.8px",
  textShadow: "0 1px 2px rgba(0,0,0,0.1)",
};

const statsGridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr", // Two columns
  gap: "30px", // Gap between columns
  rowGap: "15px", // Specific gap between rows
  marginTop: "8px",
};

const statItemStyle = (color) => ({
  background: `${color}15`,
  borderLeft: `5px solid ${color}`,
  padding: "12px",
  borderRadius: "8px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  minHeight: "90px",
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
});

const statLabelStyle = {
  color: "#6b7280",
  fontSize: "13px",
  marginBottom: "8px",
  fontWeight: "600",
  textTransform: "uppercase",
  letterSpacing: "0.3px",
};

const statValueStyle = {
  fontSize: "18px",
  color: "#111827",
  fontWeight: "700",
  lineHeight: "1.2",
  wordBreak: "break-word",
};

export default StatsSummary;