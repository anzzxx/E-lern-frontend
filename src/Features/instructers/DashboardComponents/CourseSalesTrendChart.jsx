import React, { useState, useEffect, useRef } from "react";
import api from "../../../Redux/api";
import "../../../styles/CourseSalesTrendChart.css"; // We'll create this CSS file


const CourseSalesTrendChart = () => {
  const currentDate = new Date(2025, 3, 30);
  const currentYear = currentDate.getFullYear();
  const currentMonthIndex = currentDate.getMonth();
  
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [tooltip, setTooltip] = useState({ 
    visible: false, 
    x: 0, 
    y: 0, 
    month: "",
    purchases: 0,
    earnings: 0
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [saledata, setSaleData] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const chartContainerRef = useRef(null);

  // Calculate year options from available data
  const yearOptions = Array.from(
    new Set(saledata.map((item) => item.year))
  ).sort((a, b) => b - a);

  useEffect(() => {
    fetchInstructorSalesData();
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const getFilteredData = () => {
    const isCurrentYear = parseInt(selectedYear) === currentYear;
    const monthsToShow = isCurrentYear
      ? Array.from({ length: currentMonthIndex + 2 }, (_, i) =>
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
  const earnings = filteredData.map((item) => item.earnings);
  const labels = filteredData.map((item) => item.month);
  const maxValue = Math.max(...purchases, ...earnings);

  const handleMouseOver = (e, index) => {
    if (!chartContainerRef.current) return;
    
    const item = filteredData[index];
    const containerRect = chartContainerRef.current.getBoundingClientRect();
    const dotRect = e.target.getBoundingClientRect();
    
    const x = dotRect.left - containerRect.left + dotRect.width / 2;
    const y = dotRect.top - containerRect.top;
    
    setHoveredIndex(index);
    setTooltip({
      visible: true,
      x: x,
      y: y,
      month: item.month,
      purchases: item.purchases,
      earnings: item.earnings
    });
  };

  const handleMouseOut = () => {
    setHoveredIndex(null);
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
    <div className="sales-trend-card">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">Course Sales Trend</h3>
          <p className="chart-subtitle">Monthly purchase and revenue data</p>
        </div>
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-color purchase-color"></div>
            <span className="legend-label">Purchases</span>
          </div>
          <div className="legend-item">
            <div className="legend-color earnings-color"></div>
            <span className="legend-label">Earnings</span>
          </div>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="year-selector"
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div ref={chartContainerRef} className="chart-container">
        <div className="chart-grid">
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
            <div key={i} className="grid-line-container">
              <div className="grid-line"></div>
              <span className="grid-label">
                {Math.round(maxValue * ratio).toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        <div className="chart-bars-container">
          {purchases.length > 0 && (
            <div className="chart-bars">
              {purchases.map((purchaseVal, i) => {
                const purchaseHeight = `${(purchaseVal / maxValue) * 100}%`;
                const earningsHeight = `${(earnings[i] / maxValue) * 100}%`;
                const isHovered = hoveredIndex === i;
                
                return (
                  <div 
                    key={i} 
                    className={`bar-group ${isHovered ? 'hovered' : ''}`}
                    onMouseEnter={(e) => handleMouseOver(e, i)}
                    onMouseLeave={handleMouseOut}
                  >
                    <div 
                      className={`earnings-bar ${isHovered ? 'hovered' : ''}`}
                      style={{ height: earningsHeight }}
                    >
                      <div 
                        className={`purchase-bar ${isHovered ? 'hovered' : ''}`}
                        style={{ height: purchaseHeight }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="month-labels">
          {labels.map((label, i) => (
            <span
              key={i}
              className={`month-label ${hoveredIndex === i ? 'highlighted' : ''}`}
            >
              {label}
            </span>
          ))}
        </div>

        {tooltip.visible && (
          <div 
            className="chart-tooltip"
            style={{
              left: `${tooltip.x}px`,
              top: `${tooltip.y}px`,
            }}
          >
            <div className="tooltip-title">
              {tooltip.month} {selectedYear}
            </div>
            <div className="tooltip-row">
              <div className="tooltip-label">
                <div className="tooltip-dot purchase-dot"></div>
                <span>Purchases:</span>
              </div>
              <span className="tooltip-value">{tooltip.purchases.toLocaleString()}</span>
            </div>
            <div className="tooltip-row">
              <div className="tooltip-label">
                <div className="tooltip-dot earnings-dot"></div>
                <span>Earnings:</span>
              </div>
              <span className="tooltip-value">₹{tooltip.earnings.toLocaleString()}</span>
            </div>
            <div className="tooltip-arrow"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseSalesTrendChart;