import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SyncLoader } from "react-spinners";

const InstructorProfileCard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { selectedInstructor } = useSelector((state) => state.instructors);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // 1.5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #ffffff 0%, #f9f9ff 100%)",
        borderRadius: "8px",
        padding: "20px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        display: "flex",
        alignItems: "center",
        gap: "20px",
        width: "100%",
        border: "1px solid rgba(108, 99, 255, 0.1)",
        position: "relative",
        minHeight: "200px", // 💡 this sets a normal height during loading
      }}
    >
      {isLoading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          <SyncLoader color="#6c63ff" size={10} />
        </div>
      )}

      {!isLoading && (
        <>
          <div
            style={{
              width: "64px",
              height: "64px",
              background: "linear-gradient(135deg, #6c63ff 0%, #9a91ff 70%)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(108, 99, 255, 0.25)",
              border: "4px solid #ffffff",
              overflow: "hidden",
            }}
          >
            <img
              src={
                selectedInstructor?.profile_picture ||
                "https://robohash.org/mail@ashallendesign.co.uk"
              }
              alt="Instructor"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h2
              style={{
                margin: "0 0 12px 0",
                fontSize: "20px",
                color: "#1a1a3d",
                fontWeight: "700",
              }}
            >
              Instructor Profile
            </h2>

            <div style={{ marginBottom: "12px" }}>
              <p
                style={{
                  margin: "0 0 4px 0",
                  fontWeight: "600",
                  fontSize: "17px",
                  color: "#2c2c54",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {selectedInstructor.name || "John Doe"}
              </p>
              <p
                style={{
                  margin: "0 0 8px 0",
                  fontWeight: "400",
                  fontSize: "15px",
                  color: "#4a4a6a",
                }}
              >
                {selectedInstructor.bio ||
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
              </p>
              <p
                style={{
                  margin: "0 0 4px 0",
                  color: "#6c757d",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span style={{ color: "#6c63ff" }}>✉</span>
                {selectedInstructor.email || "john@gmail.com"}
              </p>
              <p
                style={{
                  margin: 0,
                  color: "#6c757d",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span style={{ color: "#6c63ff" }}>📞</span>
                +91 {selectedInstructor.phone || "1234567890"}
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "8px 16px",
                background: "rgba(108, 99, 255, 0.03)",
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid rgba(108, 99, 255, 0.08)",
              }}
            >
              <Stat label="Courses" value="5" color="#6c63ff" />
              <Stat label="Earnings" value="₹100,000" color="#28a745" />
              <Stat label="Paid" value="₹150,000" color="#007bff" />
              <Stat label="Pending" value="₹15,000" color="#dc3545" />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const Stat = ({ label, value, color }) => (
  <p
    style={{
      margin: 0,
      fontSize: "14px",
      color: "#333",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    }}
  >
    {label}
    <span
      style={{
        fontWeight: "600",
        color: color,
        background: `${color}1A`, // slight transparent background
        padding: "2px 8px",
        borderRadius: "10px",
        fontSize: "13px",
      }}
    >
      {value}
    </span>
  </p>
);

export default InstructorProfileCard;
