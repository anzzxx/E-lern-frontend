import React from "react";
import { useNavigate } from "react-router-dom";
import { STATIC_URL } from "../../Redux/api";

const ReportedCoursePopup = ({ report, onClose }) => {
  const navigate=useNavigate()
  const handleVerify = () => {
    alert(`Verified report ID: ${report.id}`);
  };

  const handleDismiss = () => {
    alert(`Dismissed report ID: ${report.id}`);
  };
  console.log(report,'reportdata');
  

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button onClick={onClose} style={styles.closeBtn}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        
        <div style={styles.header}>
          <h2 style={styles.title}>Reported Course Details</h2>
          {/* <div style={styles.reportId}>Report ID: #{report.id}</div> */}
        </div>

        <div style={styles.content}>
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={styles.sectionIcon}>
                <path d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z" fill="#6366F1"/>
                <path d="M10 12C5 12 0 14.6863 0 20V22C0 23.1046 0.89543 24 2 24H18C19.1046 24 20 23.1046 20 22V20C20 14.6863 15 12 10 12Z" fill="#6366F1"/>
              </svg>
              <h3 style={styles.sectionTitle}>Reporter Information</h3>
            </div>
            <div style={styles.userInfo}>
              <img src={`${STATIC_URL}${report.user.avatar}`} alt="User Avatar" style={styles.avatar} />
              <div style={styles.userDetails}>
                <div style={styles.userName}>{report.user.username}</div>
                <div style={styles.userEmail}>{report.user.email}</div>
              </div>
            </div>
          </div>

          <div style={styles.divider}></div>

          <div style={styles.section} >
            <div style={styles.sectionHeader}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={styles.sectionIcon}>
                <path d="M1 5H19M4 5V5C2.89543 5 2 5.89543 2 7V15C2 16.1046 2.89543 17 4 17H16C17.1046 17 18 16.1046 18 15V7C18 5.89543 17.1046 5 16 5V5M14 5V3C14 1.89543 13.1046 1 12 1H8C6.89543 1 6 1.89543 6 3V5" stroke="#6366F1" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <h3 style={styles.sectionTitle}>Course Information</h3>
            </div>
            <div style={styles.courseCard}>
              <img src={report.course.image} alt="Course" style={styles.courseImage} />
              <div style={styles.courseDetails}>
                <div style={styles.courseTitle}>{report.course.title}</div>
                <div style={styles.courseInstructor}>Instructor: {report.course.instructor}</div>
                <div style={styles.courseDescription}>{report.course.description}</div>
              </div>
            </div>
          </div>

          <div style={styles.divider}></div>

          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={styles.sectionIcon}>
                <path d="M10 17C13.866 17 17 13.866 17 10C17 6.13401 13.866 3 10 3C6.13401 3 3 6.13401 3 10C3 13.866 6.13401 17 10 17Z" stroke="#6366F1" strokeWidth="2"/>
                <path d="M10 13V10M10 7H10.01" stroke="#6366F1" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <h3 style={styles.sectionTitle}>Report Details</h3>
            </div>
            <div style={styles.reportDetails}>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Reported On:</span>
                <span style={styles.detailValue}>{report.reportedAt}</span>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Reason:</span>
                <span style={styles.detailValue}>{report.reason}</span>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.actions}>
          <button style={styles.dismissBtn} onClick={handleDismiss}>
            Dismiss Report
          </button>
          <button style={styles.verifyBtn} onClick={handleVerify}>
            Verify Report
          </button>
        </div>
      </div>
    </div>
    
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(2px)",
  },
  modal: {
    backgroundColor: "#fff",
    padding: "32px",
    borderRadius: "16px",
    maxWidth: "640px",
    width: "90%",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    position: "relative",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    maxHeight: "90vh",
    overflowY: "auto",
    /* Hide scrollbar for Chrome, Safari and Opera */
    "::-webkit-scrollbar": {
      display: "none",
    },
    /* Hide scrollbar for IE, Edge and Firefox */
    msOverflowStyle: "none",  /* IE and Edge */
    scrollbarWidth: "none",  /* Firefox */
  },
  closeBtn: {
    position: "absolute",
    top: "24px",
    right: "24px",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    borderRadius: "4px",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#F3F4F6",
    },
  },
  header: {
    marginBottom: "24px",
    textAlign: "center",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#111827",
    margin: "0 0 4px 0",
  },
  reportId: {
    fontSize: "14px",
    color: "#6B7280",
    fontWeight: "500",
  },
  content: {
    marginBottom: "24px",
  },
  section: {
    marginBottom: "20px",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "16px",
  },
  sectionIcon: {
    marginRight: "12px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
    margin: 0,
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  avatar: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #E5E7EB",
  },
  userDetails: {
    display: "flex",
    flexDirection: "column",
  },
  userName: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827",
  },
  userEmail: {
    fontSize: "14px",
    color: "#6B7280",
    marginTop: "4px",
  },
  divider: {
    height: "1px",
    backgroundColor: "#E5E7EB",
    margin: "24px 0",
  },
  courseCard: {
    border: "1px solid #E5E7EB",
    borderRadius: "12px",
    overflow: "hidden",
  },
  courseImage: {
    width: "100%",
    height: "160px",
    objectFit: "cover",
  },
  courseDetails: {
    padding: "16px",
  },
  courseTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "8px",
  },
  courseInstructor: {
    fontSize: "14px",
    color: "#6B7280",
    marginBottom: "8px",
  },
  courseDescription: {
    fontSize: "14px",
    color: "#4B5563",
    lineHeight: "1.5",
  },
  reportDetails: {
    backgroundColor: "#F9FAFB",
    borderRadius: "8px",
    padding: "16px",
  },
  detailItem: {
    display: "flex",
    marginBottom: "12px",
    ":last-child": {
      marginBottom: 0,
    },
  },
  detailLabel: {
    fontWeight: "600",
    color: "#374151",
    minWidth: "100px",
  },
  detailValue: {
    color: "#4B5563",
    flex: 1,
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "16px",
    marginTop: "24px",
  },
  verifyBtn: {
    padding: "10px 20px",
    backgroundColor: "#4F46E5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#4338CA",
    },
  },
  dismissBtn: {
    padding: "10px 20px",
    backgroundColor: "#fff",
    color: "#4B5563",
    border: "1px solid #D1D5DB",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#F3F4F6",
    },
  },
};

export default ReportedCoursePopup;