import React from "react";

const Overview = () => (
  <div style={{
    backgroundColor: '#fff',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: '24px'
  }}>
    <h2 style={{
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '12px'
    }}>Course Overview</h2>
    <div style={{
      display: 'flex',
      gap: '16px'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '24px', fontWeight: '600' }}>120</div>
        <div style={{ fontSize: '14px', color: '#4b5563' }}>Students</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '24px', fontWeight: '600' }}>4</div>
        <div style={{ fontSize: '14px', color: '#4b5563' }}>Lessons</div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '24px', fontWeight: '600' }}>1</div>
        <div style={{ fontSize: '14px', color: '#4b5563' }}>Quiz</div>
      </div>
    </div>
  </div>
);

export default Overview;