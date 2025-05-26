"use client";
import React, { useEffect, useState } from "react";
import api from "../../../Redux/api";

const ElearningStatisticsCard = () => {
  const [monthlyData, setMonthlyData] = useState(null);
  const [activeMetric, setActiveMetric] = useState("revenue");
  const [loading, setLoading] = useState(true);
  const [totalMetrics, setTotalMetrics] = useState({
    revenue: 0,
    created_course_count: 0,
    enrollment_count: 0,
    completed_student_count: 0
  });

  useEffect(() => {
    MonthlyData();
  }, []);

  const MonthlyData = async () => {
    try {
      const response = await api.get('cadmin/monthly-revenue/');
      setMonthlyData(response.data);
      
      const totals = {
        revenue: 0,
        created_course_count: 0,
        enrollment_count: 0,
        completed_student_count: 0
      };
      
      Object.values(response.data).forEach(month => {
        totals.revenue += month.revenue || 0;
        totals.created_course_count += month.created_course_count || 0;
        totals.enrollment_count += month.enrollment_count || 0;
        totals.completed_student_count += month.completed_student_count || 0;
      });
      
      setTotalMetrics(totals);
      setLoading(false);
    } catch (error) {
      console.log("Some error occurred!", error);
      setLoading(false);
    }
  };

  const metrics = [
    {
      key: "revenue",
      title: "Revenue",
      icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 8c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="white"/></svg>`,
      color: "#F56565",
      format: (value) => `$${value.toLocaleString()}`,
      progress: 45
    },
    {
      key: "created_course_count",
      title: "Courses Created",
      icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 4H2c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-2 6c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1z" fill="white"/></svg>`,
      color: "#4299E1",
      format: (value) => value.toLocaleString(),
      progress: 58
    },
    {
      key: "enrollment_count",
      title: "Enrollments",
      icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 16A8 8 0 108 0a8 8 0 000 16zm-.5-4l5-5-1.5-1.5-3.5 3.5L6 7.5 4.5 9l3 3z" fill="white"/></svg>`,
      color: "#9F7AEA",
      format: (value) => value.toLocaleString(),
      progress: 72
    },
    {
      key: "completed_student_count",
      title: "Completions",
      icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 16A8 8 0 108 0a8 8 0 000 16zm-.5-4l5-5-1.5-1.5-3.5 3.5L6 7.5 4.5 9l3 3z" fill="white"/></svg>`,
      color: "#4FD1C5",
      format: (value) => value.toLocaleString(),
      progress: 82
    },
  ];

  const getChartData = () => {
    if (!monthlyData) return { xAxisLabels: [], barValues: [], maxValue: 0 };

    const months = Object.keys(monthlyData);
    const xAxisLabels = months.map(month => month.slice(0, 3));
    const barValues = months.map(month => monthlyData[month][activeMetric] || 0);
    const maxValue = Math.max(...barValues, 1);

    return { xAxisLabels, barValues, maxValue };
  };

  const { xAxisLabels, barValues, maxValue } = getChartData();

  const generateYAxisLabels = () => {
    if (maxValue <= 0) return ["0"];
    
    const steps = 5;
    const stepValue = Math.ceil(maxValue / steps);
    const labels = [];
    
    for (let i = steps; i >= 0; i--) {
      labels.push((i * stepValue).toString());
    }
    
    return labels;
  };

  const yAxisLabels = generateYAxisLabels();

  if (loading) {
    return (
      <div className="elearning-container" style={{ width: '60%', marginLeft: '300px' }}>
        <div className="loading-container">Loading data...</div>
      </div>
    );
  }

  if (!monthlyData) {
    return (
      <div className="elearning-container" style={{ width: '60%', marginLeft: '300px' }}>
        <div className="error-container">No data available</div>
      </div>
    );
  }

  return (
    <div className="elearning-container" style={{ width: '60%', marginLeft: '300px' }}>
      <article className="elearning-stats-card">
        <header className="elearning-stats-header">
          <h2 className="elearning-stats-title">Course Analytics</h2>
          <p className="elearning-stats-subtitle">
            <span className="elearning-stats-growth">+15%</span> growth in enrollments
          </p>
        </header>

        <div className="elearning-metric-selector">
          {metrics.map(metric => (
            <button
              key={metric.key}
              className={`elearning-metric-btn ${activeMetric === metric.key ? 'active' : ''}`}
              style={{ backgroundColor: activeMetric === metric.key ? metric.color : '#f7fafc' }}
              onClick={() => setActiveMetric(metric.key)}
            >
              <div 
                className="elearning-metric-icon" 
                style={{ backgroundColor: metric.color }}
                dangerouslySetInnerHTML={{ __html: metric.icon }}
              />
              <span style={{ color: activeMetric === metric.key ? 'white' : '#4a5568' }}>
                {metric.title}
              </span>
            </button>
          ))}
        </div>

        <section className="elearning-chart-container">
          <div className="elearning-chart">
            <div className="elearning-y-axis">
              {yAxisLabels.map((label, index) => (
                <span key={index} className="elearning-y-label">{label}</span>
              ))}
            </div>
            <div className="elearning-bars-container">
              <div className="elearning-bars">
                {barValues.map((value, index) => {
                  const heightPercentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
                  const minHeight = 5;
                  const height = Math.max(heightPercentage, minHeight);
                  const metricColor = metrics.find(m => m.key === activeMetric)?.color || '#4299E1';
                  const formattedValue = activeMetric === 'revenue' 
                    ? `$${value.toLocaleString()}` 
                    : value.toLocaleString();
                  
                  return (
                    <div key={index} className="elearning-bar-container">
                      <div className="elearning-bar-wrapper">
                        <div
                          className="elearning-bar"
                          style={{ 
                            height: `${height}%`,
                            backgroundColor: metricColor
                          }}
                        />
                        <div className="elearning-tooltip">
                          <div className="elearning-tooltip-content">
                            <span className="elearning-tooltip-value">{formattedValue}</span>
                            <span className="elearning-tooltip-month">{xAxisLabels[index]}</span>
                          </div>
                          <div className="elearning-tooltip-arrow" style={{ borderTopColor: metricColor }} />
                        </div>
                      </div>
                      <span className="elearning-x-label">{xAxisLabels[index]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="elearning-grid-lines">
              {yAxisLabels.map((_, index) => (
                <div
                  key={index}
                  className="elearning-grid-line"
                  style={{ bottom: `${(index * 100) / (yAxisLabels.length - 1)}%` }}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="elearning-metrics-grid">
          {metrics.map((metric) => (
            <MetricCard 
              key={metric.key}
              icon={metric.icon}
              title={metric.title}
              value={metric.format(totalMetrics[metric.key])}
              progress={metric.progress}
              color={metric.color}
              iconSvg={metric.icon}
            />
          ))}
        </section>

        <style jsx>{`
          .elearning-stats-card {
            background-color: #ffffff;
            border-radius: 16px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 24px;
            width: 125%;
            box-sizing: border-box;
          }

          .loading-container, .error-container {
            padding: 24px;
            text-align: center;
            background-color: #ffffff;
            border-radius: 16px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .elearning-stats-header {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .elearning-stats-title {
            font-family: 'Inter', sans-serif;
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
            margin: 0;
          }

          .elearning-stats-subtitle {
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            color: #6b7280;
            margin: 0;
          }

          .elearning-stats-growth {
            color: #10b981;
            font-weight: 500;
          }

          .elearning-metric-selector {
            display: flex;
            gap: 8px;
            margin-bottom: 12px;
            flex-wrap: wrap;
          }

          .elearning-metric-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
            cursor: pointer;
            transition: all 0.2s;
            font-weight: 500;
            font-size: 14px;
          }

          .elearning-metric-btn.active {
            color: white;
          }

          .elearning-metric-icon {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 4px;
          }

          .elearning-chart-container {
            background: linear-gradient(to right, #1e1b4b, #1e3a8a);
            border-radius: 12px;
            padding: 16px;
            height: 292px;
            position: relative;
          }

          .elearning-chart {
            position: relative;
            height: 100%;
            width: 100%;
            display: flex;
          }

          .elearning-y-axis {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 8px 0;
            width: 30px;
            flex-shrink: 0;
          }

          .elearning-y-label {
            font-family: 'Inter', sans-serif;
            font-size: 12px;
            color: #ffffff;
            font-weight: 500;
          }

          .elearning-bars-container {
            flex: 1;
            position: relative;
            height: 100%;
            overflow: hidden;
          }

          .elearning-bars {
            position: absolute;
            bottom: 20px;
            left: 0;
            right: 0;
            height: calc(100% - 20px);
            display: flex;
            justify-content: space-around;
            align-items: flex-end;
            padding: 0 10px;
          }

          .elearning-bar-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            height: 100%;
            justify-content: flex-end;
            flex: 1;
            max-width: 40px;
            position: relative;
          }

          .elearning-bar-wrapper {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            position: relative;
          }

          .elearning-bar {
            width: 100%;
            min-height: 5px;
            border-radius: 4px 4px 0 0;
            transition: height 0.5s ease-out, background-color 0.3s ease;
            position: relative;
            cursor: pointer;
          }

          .elearning-bar:hover {
            opacity: 0.9;
          }

          .elearning-x-label {
            font-family: 'Inter', sans-serif;
            font-size: 12px;
            color: #ffffff;
            margin-top: 8px;
          }

          .elearning-tooltip {
            position: absolute;
            bottom: calc(100% + 10px);
            left: 50%;
            transform: translateX(-50%);
            background-color: #ffffff;
            border-radius: 6px;
            padding: 6px 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            opacity: 0;
            visibility: hidden;
            transition: all 0.2s ease;
            z-index: 10;
            min-width: 60px;
            text-align: center;
          }

          .elearning-tooltip-content {
            display: flex;
            flex-direction: column;
            gap: 2px;
          }

          .elearning-tooltip-value {
            font-weight: 600;
            font-size: 14px;
            color: #1f2937;
          }

          .elearning-tooltip-month {
            font-size: 12px;
            color: #6b7280;
          }

          .elearning-tooltip-arrow {
            position: absolute;
            bottom: -6px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 6px solid;
          }

          .elearning-bar-container:hover .elearning-tooltip {
            opacity: 1;
            visibility: visible;
          }

          .elearning-grid-lines {
            position: absolute;
            top: 0;
            left: 30px;
            right: 0;
            height: calc(100% - 20px);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          .elearning-grid-line {
            width: 100%;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          }

          .elearning-metrics-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }

          @media (max-width: 1200px) {
            .elearning-container {
              width: calc(100% - 350px);
              margin-left: 300px;
            }
          }

          @media (max-width: 992px) {
            .elearning-container {
              width: calc(100% - 60px);
              margin-left: 40px;
            }
            
            .elearning-stats-card {
              padding: 16px;
              gap: 16px;
            }

            .elearning-chart-container {
              height: 240px;
            }
          }

          @media (max-width: 768px) {
            .elearning-container {
              width: calc(100% - 40px);
              margin-left: 20px;
            }
            
            .elearning-stats-card {
              padding: 12px;
              gap: 12px;
            }

            .elearning-chart-container {
              height: 200px;
            }

            .elearning-metrics-grid {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 576px) {
            .elearning-container {
              width: calc(100% - 30px);
              margin-left: 15px;
            }
            
            .elearning-chart-container {
              padding: 12px;
            }
            
            .card-content {
              padding: 20px;
            }
            
            .metric-value {
              font-size: 24px;
            }
          }
        `}</style>
      </article>
    </div>
  );
};

const MetricCard = ({ icon, title, value, progress, color, iconSvg }) => {
  return (
    <article className="elearning-metric-card">
      <div className="elearning-metric-content">
        <div 
          className="elearning-metric-icon" 
          style={{ backgroundColor: color }}
          dangerouslySetInnerHTML={{ __html: iconSvg }}
        />
        <div className="elearning-metric-text">
          <h3 className="elearning-metric-title">{title}</h3>
          <p className="elearning-metric-value">{value}</p>
        </div>
      </div>
      <div className="elearning-progress-container">
        <div
          className="elearning-progress-bar"
          style={{ width: `${progress}%`, backgroundColor: color }}
        />
      </div>
      <style jsx>{`
        .elearning-metric-card {
          background-color: #f9fafb;
          border-radius: 8px;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: box-shadow 0.3s ease;
        }

        .elearning-metric-card:hover {
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .elearning-metric-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .elearning-metric-icon {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .elearning-metric-text {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .elearning-metric-title {
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 500;
          color: #6b7280;
          margin: 0;
        }

        .elearning-metric-value {
          font-family: 'Inter', sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .elearning-progress-container {
          width: 100%;
          height: 4px;
          background-color: #e5e7eb;
          border-radius: 2px;
          overflow: hidden;
        }

        .elearning-progress-bar {
          height: 100%;
          border-radius: 2px;
          transition: width 0.5s ease-out;
        }

        @media (max-width: 991px) {
          .elearning-metric-card {
            padding: 10px;
          }
        }

        @media (max-width: 640px) {
          .elearning-metric-card {
            padding: 8px;
          }
        }
      `}</style>
    </article>
  );
};

export default ElearningStatisticsCard;