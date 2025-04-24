import React from "react";
import { useNavigate } from "react-router-dom";

const Header = ({ setEditCourse, editcourse }) => {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px'
    }}>
      <button 
        style={{
          display: 'flex',
          alignItems: 'center',
          color: '#2563eb',
          fontWeight: '500',
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer'
        }}
        onClick={() => navigate("/instructor/course")}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          style={{
            height: '20px',
            width: '20px',
            marginRight: '4px'
          }} 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to My Courses
      </button>
      <button 
        style={{
          backgroundColor: '#fff',
          color: '#2563eb',
          padding: '8px 16px',
          borderRadius: '6px',
          border: '1px solid #2563eb',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}
        onClick={() => setEditCourse(!editcourse)}
      >
        {editcourse ? "Cancel Editing" : "Edit Course"}
      </button>
    </div>
  );
};

export default Header;