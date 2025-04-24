import React from "react";

const monthlyEarnings = [4000, 4500, 3900, 4800, 5200, 5000];
const labels = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr"];

// Define cardStyle here for LineChart component
const cardStyle = {
  background: "#fff",
  borderRadius: "10px",
  padding: "24px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  flex: 1,
  margin: "8px",
  minHeight: "300px"
};

const LineChart = () => (
  <div style={{
    ...cardStyle,
    display: "flex",
    flexDirection: "column"
  }}>
    <h3 style={{ fontSize: "18px", marginBottom: "24px", color: "#374151" }}>Earnings Trend</h3>
    <svg width="100%" height="200">
      {/* Gradient background for the chart */}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6366f180" />
          <stop offset="100%" stopColor="#6366f110" />
        </linearGradient>
      </defs>
      
      {/* Area chart */}
      <path 
        d={`M 0% 100% ${
          monthlyEarnings.map((val, i) => {
            const x = (i / (monthlyEarnings.length - 1)) * 100;
            const y = 100 - (val / Math.max(...monthlyEarnings)) * 80;
            return `L ${x}% ${y}%`;
          }).join(" ")
        } L 100% 100% Z`}
        fill="url(#gradient)"
      />
      
      {/* Line */}
      {monthlyEarnings.map((val, i, arr) => {
        const x1 = (i / (arr.length - 1)) * 100;
        const y1 = 100 - (val / Math.max(...arr)) * 80;
        const x2 = ((i + 1) / (arr.length - 1)) * 100;
        const y2 = i < arr.length - 1 ? 100 - (arr[i + 1] / Math.max(...arr)) * 80 : y1;
        return (
          <line
            key={i}
            x1={`${x1}%`} y1={`${y1}%`}
            x2={`${x2}%`} y2={`${y2}%`}
            stroke="#4f46e5"
            strokeWidth="3"
            strokeLinecap="round"
          />
        );
      })}
      
      {/* Dots */}
      {monthlyEarnings.map((val, i) => {
        const x = (i / (monthlyEarnings.length - 1)) * 100;
        const y = 100 - (val / Math.max(...monthlyEarnings)) * 80;
        return (
          <circle
            key={i}
            cx={`${x}%`}
            cy={`${y}%`}
            r="5"
            fill="#4f46e5"
            stroke="#fff"
            strokeWidth="2"
          />
        );
      })}
    </svg>
    <div style={{ 
      display: "flex", 
      justifyContent: "space-between", 
      marginTop: "16px",
      padding: "0 8px"
    }}>
      {labels.map((label, i) => (
        <span key={i} style={{ 
          fontSize: "12px", 
          color: "#6b7280",
          fontWeight: "500"
        }}>
          {label}
        </span>
      ))}
    </div>
  </div>
);

export default LineChart;