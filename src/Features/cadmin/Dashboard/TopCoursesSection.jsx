import React, { useEffect } from "react";
import { fetchInactiveCourseRequests } from "../../../Redux/Slices/courseRequestSlice";
import { fetchCourseReports } from "../../../Redux/Slices/ReportedCourseSlice";
import { fetchInstructors } from "../../../Redux/Slices/InstructorsSlice";
import { useDispatch, useSelector } from "react-redux";
import { STATIC_URL } from "../../../Redux/api";

// Create a separate component for the sidebar cards
const SidebarCard = ({ title, viewAllText, children }) => {
  return (
    <section className="vertical-card">
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        <button className="view-all">{viewAllText}</button>
      </div>
      <div className="items-list">{children}</div>
    </section>
  );
};

export default function CourseManagementSidebar() {
  const dispatch = useDispatch();
  const { requests, status, error } = useSelector(
    (state) => state.courseRequests
  );
  const { reports } = useSelector((state) => state.courseReports);
  const { instructors } = useSelector((state) => state.instructors);

  useEffect(() => {
    dispatch(fetchInactiveCourseRequests());
    dispatch(fetchCourseReports());
    dispatch(fetchInstructors());
  }, [dispatch]);

  // Group reports by course ID
  const groupedReports = reports.reduce((acc, report) => {
    if (!acc[report.course]) {
      acc[report.course] = {
        courseId: report.course,
        reports: [],
        latestDate: report.created_at,
      };
    }
    acc[report.course].reports.push(report);
    if (new Date(report.created_at) > new Date(acc[report.course].latestDate)) {
      acc[report.course].latestDate = report.created_at;
    }
    return acc;
  }, {});

  // Convert to array and sort by latest date (newest first)
  const sortedGroupedReports = Object.values(groupedReports).sort(
    (a, b) => new Date(b.latestDate) - new Date(a.latestDate)
  );

  // Determine the most critical reason for severity
  const getHighestSeverityReason = (reports) => {
    const reasons = reports.map((r) => r.reason);
    if (reasons.some((r) => r.includes("inappropriate_content")))
      return "inappropriate_content";
    if (reasons.some((r) => r.includes("technical problems")))
      return "technical problems";
    if (reasons.some((r) => r.includes("unclear explanations")))
      return "unclear explanations";
    return reasons[0];
  };

  const statusStyles = {
    Pending: { bg: "#FFF3CD", color: "#856404" },
    "Under Review": { bg: "#D1ECF1", color: "#0C5460" },
    Approved: { bg: "#D4EDDA", color: "#155724" },
    Rejected: { bg: "#F8D7DA", color: "#721C24" },
    Paid: { bg: "#D4EDDA", color: "#155724" },
  };

  const reportSeverityStyles = {
    high: { bg: "#FEE2E2", color: "#B91C1C" },
    medium: { bg: "#FEF3C7", color: "#92400E" },
    low: { bg: "#D1FAE5", color: "#065F46" },
  };

  return (
    <div className="sidebar-container">
      {/* Course Requests Card */}
      <SidebarCard title="Course Requests" viewAllText="View all requests">
        {requests.map((request, index) => {
          const formattedDate = new Date(request.created_at).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "short",
              day: "numeric",
            }
          );
          return (
            <div key={index} className="item-card">
              <div className="item-info">
                <img
                  src={request.thumbnail.replace("image/upload/", "")}
                  alt={request.title}
                  className="item-image"
                />
                <div className="item-details">
                  <h3 className="item-name">{request.title}</h3>
                  <div className="meta-info">
                    <span>Requested By: {request.instructor}</span>
                    <span>•</span>
                    <span>{formattedDate}</span>
                  </div>
                </div>
              </div>
              <span
                className="status-badge"
                style={{
                  backgroundColor: statusStyles[request.status]?.bg,
                  color: statusStyles[request.status]?.color,
                }}
              >
                {request.status}
              </span>
            </div>
          );
        })}
      </SidebarCard>

      {/* User Reported Courses Card */}
      <SidebarCard title="User Reported Courses" viewAllText="View all reports">
        {sortedGroupedReports.map((group) => {
          const reportCount = group.reports.length;
          const mainReason = getHighestSeverityReason(group.reports);

          let severity = "medium";
          if (
            mainReason.includes("inappropriate_content") ||
            mainReason.includes("technical problems")
          ) {
            severity = "high";
          } else if (mainReason === "no reason") {
            severity = "low";
          }

          const latestDate = new Date(group.latestDate);
          const formattedDate = latestDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });

          return (
            <div key={group.courseId} className="item-card">
              <div className="item-info">
                <div className="item-details">
                  <h3 className="item-name">Course ID: {group.courseId}</h3>
                  <div className="meta-info">
                    <span className="report-count">
                      {reportCount} {reportCount === 1 ? "report" : "reports"}
                    </span>
                    <span>•</span>
                    <span>{mainReason.replace(/_/g, " ")}</span>
                    <span>•</span>
                    <span>{formattedDate}</span>
                  </div>
                </div>
              </div>
              <span
                className="severity-badge"
                style={{
                  backgroundColor: reportSeverityStyles[severity].bg,
                  color: reportSeverityStyles[severity].color,
                }}
              >
                {severity === "high"
                  ? "High Priority"
                  : severity === "medium"
                  ? "Medium Priority"
                  : "Low Priority"}
              </span>
            </div>
          );
        })}
      </SidebarCard>

      {/* Instructors Card */}
      <SidebarCard title="Instructors" viewAllText="View all instructors">
        {instructors.slice(0, 5).map((instructor, index) => (
          <div key={index} className="item-card">
            <div className="item-info">
              <img
                src={
                  `${STATIC_URL}${instructor.profile_picture}` ||
                  "/default-profile.png"
                }
                alt={instructor.name}
                className="item-image"
              />
              <div className="item-details">
                <h3 className="item-name">{instructor.name}</h3>
                <div className="meta-info">
                  <span>{instructor.bio}</span>
                  <span>•</span>
                  <span>{instructor.organisation}</span>
                </div>
              </div>
            </div>
            <span
              className="status-badge"
              style={{
                backgroundColor: "#e3f5ff",
                color: "#0c66ff",
              }}
            >
              {instructor.experience}
            </span>
          </div>
        ))}
      </SidebarCard>

      <style jsx>{`
        .sidebar-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
          width: 350px;
          height: 130vh;
          overflow-y: auto;
          padding: 20px;

          position: sticky;
          margin-top: 185px;
          margin-left: 80px;

          &::-webkit-scrollbar {
            display: none;
          }
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }

        .vertical-card {
          background-color: #ffffff;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          width: 100%;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .section-title {
          color: #1a1a1a;
          font-size: 18px;
          font-weight: 600;
          margin: 0;
        }

        .view-all {
          background: none;
          border: none;
          color: #4a90e2;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
          transition: background-color 0.2s;
        }

        .view-all:hover {
          background-color: #f0f7ff;
        }

        .items-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .item-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          border-radius: 8px;
          transition: background-color 0.2s;
        }

        .item-card:hover {
          background-color: #f9f9f9;
        }

        .item-info {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .item-image {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          object-fit: cover;
          background-color: #f5f5f5;
        }

        .item-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }

        .item-name {
          color: #333;
          font-size: 15px;
          font-weight: 600;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .meta-info {
          display: flex;
          gap: 8px;
          font-size: 13px;
          color: #808080;
          align-items: center;
          flex-wrap: wrap;
        }

        .report-count {
          font-weight: 600;
          color: #dc2626;
        }

        .status-badge,
        .severity-badge {
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          text-transform: capitalize;
          white-space: nowrap;
        }

        @media (max-width: 768px) {
          .sidebar-container {
            width: 100%;
            height: auto;
            position: relative;
            border-left: none;
            border-top: 1px solid #e0e0e0;
          }
        }

        @media (max-width: 600px) {
          .section-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .view-all {
            align-self: flex-end;
          }

          .item-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .item-info {
            width: 100%;
          }

          .meta-info {
            gap: 6px;
          }
        }
      `}</style>
    </div>
  );
}
