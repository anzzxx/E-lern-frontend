
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
      setCurrentPage(1);
    } catch (error) {
      console.error('Failed to fetch course analytics:', error);
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                setCurrentPage(1);
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

      <div className="table-outer-container">
        <div className="table-inner-container">
          {loading ? (
            <div className="loading-indicator">Loading courses...</div>
          ) : (
            <>
              <table className="courses-table">
                <thead>
                  <tr>
                    <th className="course-header">Course</th>
                    <th className="status-header">Status</th>
                    <th className="rating-header">Ratings</th>
                    <th className="students-header">Students</th>
                    <th className="revenue-header">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCourses.length > 0 ? (
                    paginatedCourses.map((course, index) => (
                      <tr key={index}>
                        <td className="course-cell">
                          <div className="course-info">
                            
                            <span className="course-name">{course.title}</span>
                          </div>
                        </td>
                        <td className="status-cell">
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
                        <td className="rating-cell">
                          <span
                            className="rating-value"
                            style={{
                              backgroundColor: getRatingStyle(course.avg_review).bg,
                              color: getRatingStyle(course.avg_review).color,
                            }}
                          >
                            {course.avg_review > 0 ? course.avg_review.toFixed(1) : 'N/A'}
                          </span>
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
      </div>

      <style jsx>{`
        .courses-section {
          background-color: #ffffff;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          width: 120%;
          margin-left: 290px;
          transition: all 0.3s ease;
        }
        
        .table-outer-container {
          border: 1px solid #f0f0f0;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .table-inner-container {
          width: 100%;
          overflow-x: auto;
          position: relative;
          min-height: 200px;
        }
        
        .courses-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          min-width: 800px;
        }
        
        .courses-table th {
          text-align: left;
          padding: 16px;
          color: #666;
          font-weight: 500;
          font-size: 14px;
          background-color: #f9f9f9;
          border-bottom: 1px solid #f0f0f0;
          position: sticky;
          top: 0;
        }
        
        .courses-table td {
          padding: 16px;
          border-bottom: 1px solid #f5f5f5;
          font-size: 14px;
          vertical-align: middle;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .course-header, .course-cell {
          width: 40%;
          min-width: 250px;
        }
        
        .status-header, .status-cell {
          width: 15%;
          min-width: 100px;
        }
        
        .rating-header, .rating-cell {
          width: 15%;
          min-width: 100px;
        }
        
        .students-header, .students-cell {
          width: 15%;
          min-width: 100px;
        }
        
        .revenue-header, .revenue-cell {
          width: 15%;
          min-width: 100px;
        }
        
        .course-info {
          display: flex;
          align-items: center;
          gap: 12px;
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
          font-weight: 300;
          // overflow: hidden;
          // text-overflow: ellipsis;
        }
        
        .status-badge {
          border-radius: 12px;
          padding: 6px 12px;
          font-size: 12px;
          font-weight: 500;
          display: inline-block;
        }
        
        .rating-value {
          border-radius: 12px;
          padding: 6px 12px;
          font-weight: 500;
          display: inline-block;
          font-size: 12px;
        }
        
        .students-cell {
          color: #666;
          font-weight: 500;
        }
        
        .revenue-cell {
          color: #1a1a1a;
          font-weight: 600;
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
          font-size: 14px;
        }
        
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
          min-width: 36px;
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
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }
        
        .header-left {
          flex: 1;
          min-width: 200px;
        }
        
        .section-title {
          color: #1a1a1a;
          font-size: 22px;
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
        
        @media (max-width: 1200px) {
          .courses-section {
            width: calc(100% - 320px);
            margin-left: 300px;
          }
        }
        
        @media (max-width: 992px) {
          .courses-section {
            width: 100%;
            margin-left: 0;
            padding: 16px;
          }
        }
        
        @media (max-width: 768px) {
          .section-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .search-controls {
            width: 100%;
          }
          
          .course-search {
            width: 100%;
          }
          
          .courses-table th, 
          .courses-table td {
            padding: 12px 8px;
            font-size: 13px;
          }
          
          .course-avatar {
            width: 32px;
            height: 32px;
          }
          
          .status-badge,
          .rating-value {
            padding: 4px 8px;
            font-size: 11px;
          }
        }
      `}</style>
    </section>
  );
}