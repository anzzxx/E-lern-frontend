import React, { useState, useEffect, useRef } from "react";
import api from "../../../Redux/api";

const cardStyle = {
  background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
  borderRadius: "16px",
  padding: "24px",
  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
  height: "450px",
  width: "680px",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.3s ease",
  position: "relative",
};

const tooltipStyle = {
  position: "absolute",
  background: "#1e293b",
  color: "#ffffff",
  padding: "12px 16px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "500",
  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  pointerEvents: "none",
  zIndex: 1000,
  opacity: 0,
  transition: "opacity 0.2s ease, transform 0.2s ease",
  whiteSpace: "nowrap",
  lineHeight: "1.5",
  minWidth: "180px",
};

const CourseSalesTrendChart = () => {
  const currentDate = new Date(2025, 3, 30);
  const currentYear = currentDate.getFullYear();
  const currentMonthIndex = currentDate.getMonth();
  
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [tooltip, setTooltip] = useState({ 
    visible: false, 
    x: 0, 
    y: 0, 
    content: "",
    month: "",
    purchases: 0,
    earnings: 0
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [saledata, setSaleData] = useState([]);
  const chartContainerRef = useRef(null);

  useEffect(() => {
    fetchInstructorSalesData();
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const yearOptions = Array.from(
    new Set(saledata.map((item) => item.year))
  ).sort((a, b) => b - a);

  const getFilteredData = () => {
    const isCurrentYear = parseInt(selectedYear) === currentYear;
    const monthsToShow = isCurrentYear
      ? Array.from({ length: currentMonthIndex + 1 }, (_, i) =>
          new Date(0, i).toLocaleString("en-US", { month: "short" })
        )
      : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return saledata
      .filter((item) => item.year === parseInt(selectedYear) && monthsToShow.includes(item.month))
      .sort((a, b) => {
        const dateA = new Date(`${a.month} 1, ${a.year}`);
        const dateB = new Date(`${b.month} 1, ${b.year}`);
        return dateA - dateB;
      });
  };

  const filteredData = getFilteredData();
  const purchases = filteredData.map((item) => item.purchases);
  const labels = filteredData.map((item) => item.month);

  const handleMouseOver = (e, index) => {
    if (!chartContainerRef.current) return;
    
    const item = filteredData[index];
    const containerRect = chartContainerRef.current.getBoundingClientRect();
    const dotRect = e.target.getBoundingClientRect();
    
    // Calculate tooltip position relative to container
    const x = dotRect.left - containerRect.left + dotRect.width / 2;
    const y = dotRect.top - containerRect.top;
    
    // Adjust position to prevent overflow
    const tooltipWidth = 180; // Approximate width
    const adjustedX = Math.max(
      tooltipWidth / 2,
      Math.min(x, containerRect.width - tooltipWidth / 2)
    );
    
    setTooltip({
      visible: true,
      x: adjustedX,
      y: y - 10, // Move slightly above the dot
      content: "",
      month: item.month,
      purchases: item.purchases,
      earnings: item.earnings
    });
  };

  const handleMouseOut = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  async function fetchInstructorSalesData() {
    try {
      const response = await api.get(`instructor/sales-data/`);
      setSaleData(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales data:', error);
      throw error;
    }
  }

  return (
    <div
      style={{
        ...cardStyle,
        transform: isLoaded ? "translateY(0)" : "translateY(20px)",
        opacity: isLoaded ? 1 : 0,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h3
          style={{
            fontSize: "22px",
            color: "#111827",
            fontWeight: "700",
            letterSpacing: "-0.025em",
          }}
        >
          Course Purchase Trend
        </h3>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          style={{
            padding: "10px 14px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            backgroundColor: "#ffffff",
            fontSize: "14px",
            color: "#1f2937",
            cursor: "pointer",
            outline: "none",
            width: "130px",
            transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          }}
        >
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      
      <div 
        ref={chartContainerRef}
        style={{ 
          flex: 1, 
          overflow: "hidden", 
          position: "relative",
          paddingBottom: "24px" // Space for labels
        }}
      >
        <svg 
          width="100%" 
          height="calc(100% - 24px)" 
          preserveAspectRatio="xMidYMid meet" 
          aria-label="Course purchase trend chart"
        >
          {/* Gradient for area */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d480" />
              <stop offset="100%" stopColor="#06b6d410" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[25, 50, 75].map((y, i) => (
            <line
              key={i}
              x1="0"
              y1={`${y}%`}
              x2="100%"
              y2={`${y}%`}
              stroke="#e5e7eb"
              strokeWidth="1"
              strokeDasharray="4,4"
            />
          ))}

          {/* Area chart */}
          {purchases.length > 0 && (
            <path
              d={`M 0 100% ${
                purchases
                  .map((val, i) => {
                    const x = (i / (purchases.length - 1)) * 100;
                    const y = 100 - (val / Math.max(...purchases)) * 80;
                    return `L ${x}% ${y}%`;
                  })
                  .join(" ")
              } L 100% 100% Z`}
              fill="url(#gradient)"
            />
          )}

          {/* Line */}
          {purchases.map((val, i, arr) => {
            if (i === arr.length - 1) return null;
            const x1 = (i / (arr.length - 1)) * 100;
            const y1 = 100 - (val / Math.max(...arr)) * 80;
            const x2 = ((i + 1) / (arr.length - 1)) * 100;
            const y2 = 100 - (arr[i + 1] / Math.max(...arr)) * 80;
            return (
              <line
                key={i}
                x1={`${x1}%`}
                y1={`${y1}%`}
                x2={`${x2}%`}
                y2={`${y2}%`}
                stroke="#06b6d4"
                strokeWidth="4"
                strokeLinecap="round"
              />
            );
          })}

          {/* Dots */}
          {purchases.map((val, i) => {
            const x = (i / (purchases.length - 1)) * 100;
            const y = 100 - (val / Math.max(...purchases)) * 80;
            return (
              <circle
                key={i}
                cx={`${x}%`}
                cy={`${y}%`}
                r="6"
                fill="#06b6d4"
                stroke="#ffffff"
                strokeWidth="2"
                onMouseOver={(e) => handleMouseOver(e, i)}
                onMouseOut={handleMouseOut}
                style={{ cursor: "pointer", transition: "r 0.2s ease" }}
                onMouseEnter={(e) => (e.target.setAttribute("r", "8"))}
                onMouseLeave={(e) => (e.target.setAttribute("r", "6"))}
              />
            );
          })}
        </svg>

        {/* Tooltip */}
        <div
          style={{
            ...tooltipStyle,
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            opacity: tooltip.visible ? 1 : 0,
            transform: `translate(-50%, -100%) ${tooltip.visible ? "scale(1)" : "scale(0.9)"}`,
          }}
        >
          <div style={{ fontWeight: "600", marginBottom: "6px" }}>
            {tooltip.month} {selectedYear}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Purchases:</span>
            <span style={{ fontWeight: "600" }}>{tooltip.purchases}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Earnings:</span>
            <span style={{ fontWeight: "600" }}>₹{tooltip.earnings?.toLocaleString()}</span>
          </div>
        </div>

        {/* Month labels */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            padding: "0 12px",
          }}
        >
          {labels.map((label, i) => (
            <span
              key={i}
              style={{
                fontSize: "12px",
                color: "#4b5563",
                fontWeight: "600",
                textAlign: "center",
                flex: 1,
              }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseSalesTrendChart;