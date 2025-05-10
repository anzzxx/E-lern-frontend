"use client";
import React, { useEffect, useState } from "react";
import api from "../../../Redux/api";

const STATUS_STYLES = {
  active: { bg: "#deede5", color: "#427a5b" },
  inactive: { bg: "#fafafa", color: "#999999" },
};

const RATING_STYLES = {
  high: { bg: "#e6f7ee", color: "#00a651" },
  medium: { bg: "#fdf8ce", color: "#938406" },
  low: { bg: "#feeaea", color: "#ff4d4f" },
};

const ITEMS_PER_PAGE = 5;

export default function CoursesTable() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchCourseAnalytics();
  }, []);

  const fetchCourseAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get('cadmin/course-analytics/');
      setCourses(response.data);
      setLoading(false);
      setCurrentPage(1); // Reset to first page when data changes
    } catch (error) {
      console.error('Failed to fetch course analytics:', error);
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCourses = filteredCourses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getRatingStyle = (rating) => {
    if (rating >= 4) return RATING_STYLES.high;
    if (rating >= 2.5) return RATING_STYLES.medium;
    return RATING_STYLES.low;
  };

  const formatRevenue = (revenue) => {
    return `$${parseFloat(revenue).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <section className="courses-section">
      <header className="section-header">
        <div className="header-left">
          <h2 className="section-title">All Courses</h2>
          <p className="section-subtitle">Monitor course enrollment, ratings, etc.</p>
        </div>
        <div className="search-controls">
          <div className="search-wrapper">
            <svg className="search-icon" viewBox="0 0 24 24" width="18" height="18">
              <path fill="currentColor" d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 001.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 00-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 005.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <input
              type="search"
              placeholder="Search courses"
              className="course-search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page when searching
              }}
            />
          </div>
          <button className="filter-btn" onClick={fetchCourseAnalytics}>
            <svg className="refresh-icon" viewBox="0 0 24 24" width="18" height="18">
              <path fill="currentColor" d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
            </svg>
          </button>
        </div>
      </header>

      <div className="table-container">
        {loading ? (
          <div className="loading-indicator">Loading courses...</div>
        ) : (
          <>
            <table className="courses-table">
              <colgroup>
                <col className="course-col" />
                <col className="status-col" />
                <col className="rating-col" />
                <col className="students-col" />
                <col className="revenue-col" />
              </colgroup>
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Status</th>
                  <th>Ratings</th>
                  <th>Students</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCourses.length > 0 ? (
                  paginatedCourses.map((course, index) => (
                    <tr key={index}>
                      <td>
                        <div className="course-cell">
                          <img
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/a631eabe792ff5589b2d0d0632fd9487137a55f1?placeholderIfAbsent=true&apiKey=34d728b774e44ebe92ee1866d5dfa190"
                            alt={course.title}
                            className="course-avatar"
                          />
                          <span className="course-name">{course.title}</span>
                        </div>
                      </td>
                      <td>
                        <span
                          className="status-badge"
                          style={{
                            backgroundColor: course.is_active 
                              ? STATUS_STYLES.active.bg 
                              : STATUS_STYLES.inactive.bg,
                            color: course.is_active 
                              ? STATUS_STYLES.active.color 
                              : STATUS_STYLES.inactive.color,
                          }}
                        >
                          {course.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <div className="rating-cell">
                          <span
                            className="rating-value"
                            style={{
                              backgroundColor: getRatingStyle(course.avg_review).bg,
                              color: getRatingStyle(course.avg_review).color,
                              padding: '6px 12px',
                              borderRadius: '12px'
                            }}
                          >
                            {course.avg_review > 0 ? course.avg_review.toFixed(1) : 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="students-cell">{course.total_enrollment}</td>
                      <td className="revenue-cell">
                        {parseFloat(course.revenue) > 0 ? formatRevenue(course.revenue) : '$0.00'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-results">
                      No courses found matching your search
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            
            {/* Pagination controls */}
            {filteredCourses.length > ITEMS_PER_PAGE && (
              <div className="pagination-controls">
                <button
                  className="pagination-button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    className={`pagination-button ${currentPage === page ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  className="pagination-button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx>{`
        .courses-section {
          background-color: #ffffff;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          width: 100%;
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
          width: 100%;
        }
        
        .header-left {
          flex: 1;
          min-width: 200px;
        }
        
        .section-title {
          color: #1a1a1a;
          font-size: 20px;
          font-weight: 600;
          margin: 0;
        }
        
        .section-subtitle {
          color: #808080;
          font-size: 14px;
          margin: 4px 0 0;
        }
        
        .search-controls {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        
        .search-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .search-icon {
          position: absolute;
          left: 12px;
          color: #999;
        }
        
        .course-search {
          border-radius: 8px;
          background-color: #fafafa;
          border: 1px solid #e6e6e6;
          padding: 10px 16px 10px 40px;
          font-size: 14px;
          width: 240px;
          transition: all 0.2s;
        }
        
        .course-search:focus {
          outline: none;
          border-color: #4d90fe;
          box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.2);
        }
        
        .filter-btn {
          border-radius: 8px;
          border: 1px solid #e6e6e6;
          padding: 10px;
          background: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        
        .filter-btn:hover {
          background-color: #f5f5f5;
        }
        
        .table-container {
          overflow-x: auto;
          border-radius: 8px;
          border: 1px solid #f0f0f0;
          width: 100%;
          min-height: 200px;
          position: relative;
        }
        
        .loading-indicator {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #666;
          font-size: 14px;
        }
        
        .no-results {
          text-align: center;
          padding: 40px;
          color: #666;
        }
        
        .courses-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
        }
        
        /* Column width definitions */
        .course-col { width: 40%; }
        .status-col { width: 15%; }
        .rating-col { width: 15%; }
        .students-col { width: 15%; }
        .revenue-col { width: 15%; }
        
        .courses-table th {
          text-align: left;
          padding: 16px;
          color: #666;
          font-weight: 500;
          font-size: 14px;
          background-color: #f9f9f9;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .courses-table td {
          padding: 16px;
          border-bottom: 1px solid #f5f5f5;
          font-size: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .courses-table tr:last-child td {
          border-bottom: none;
        }
        
        .courses-table tr:hover td {
          background-color: #fafafa;
        }
        
        .course-cell {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }
        
        .course-avatar {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          object-fit: cover;
          background-color: #f5f5f5;
          flex-shrink: 0;
        }
        
        .course-name {
          color: #333;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .status-badge {
          border-radius: 12px;
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 500;
          display: inline-block;
          text-transform: capitalize;
          white-space: nowrap;
        }
        
        .rating-cell {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .rating-value {
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          white-space: nowrap;
          font-size: 12px;
        }
        
        .students-cell, .revenue-cell {
          color: #666;
          font-weight: 500;
          white-space: nowrap;
        }
        
        .revenue-cell {
          color: #1a1a1a;
          font-weight: 600;
        }
        
        /* Pagination styles */
        .pagination-controls {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          padding: 16px;
          border-top: 1px solid #f0f0f0;
        }
        
        .pagination-button {
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid #e6e6e6;
          background-color: white;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }
        
        .pagination-button:hover:not(:disabled) {
          background-color: #f5f5f5;
        }
        
        .pagination-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .pagination-button.active {
          background-color: #4d90fe;
          color: white;
          border-color: #4d90fe;
        }
        
        @media (max-width: 768px) {
          .courses-section {
            padding: 16px;
          }
          
          .course-search {
            width: 180px;
          }
          
          .courses-table th, 
          .courses-table td {
            padding: 12px;
          }
          
          /* Adjust column widths for mobile */
          .course-col { width: 35%; }
          .status-col { width: 20%; }
          .rating-col { width: 20%; }
          .students-col { width: 15%; }
          .revenue-col { width: 15%; }
          
          .pagination-controls {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </section>
  );
}