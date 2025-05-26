import React from "react";
import { useSelector } from "react-redux";

export default function StatisticsSection() {
  const { allCourses } = useSelector((state) => state.courses);
  const totalCourse = allCourses.length;
  
  const metrics = [
    {
      icon: "📚",
      value: totalCourse ?? 0,
      label: "Total Courses",
      color: "linear-gradient(135deg, #6e3aff 0%, #9b7aff 100%)",
    },
    {
      icon: "👨‍🎓",
      value: "10,000+",
      label: "Enrolled Students",
      color: "linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)",
    },
    {
      icon: "💰",
      value: "$500K+",
      label: "Revenue Generated",
      color: "linear-gradient(135deg, #2af598 0%, #009efd 100%)",
    },
  ];

  return (
    <section className="statistics-section">
      <div className="metrics-grid">
        {metrics.map((metric, index) => (
          <article key={index} className="metric-card" style={{ background: metric.color }}>
            <div className="card-content">
              <div className="metric-icon">{metric.icon}</div>
              <div className="metric-info">
                <p className="metric-value">{metric.value}</p>
                <p className="metric-label">{metric.label}</p>
              </div>
            </div>
            <div className="card-decoration"></div>
          </article>
        ))}
      </div>

      <style jsx>{`
        .statistics-section {
          width: 72%;
          margin-left: 300px;
          
          margin-bottom: 40px;
        }
        
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        
        .metric-card {
          border-radius: 16px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          aspect-ratio: 1/1;
        }
        
        .metric-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
        }
        
        .card-content {
          padding: 24px;
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          height: 100%;
          justify-content: space-between;
        }
        
        .metric-icon {
          font-size: 32px;
          opacity: 0.9;
        }
        
        .metric-info {
          color: white;
        }
        
        .metric-value {
          font-size: 28px;
          font-weight: 700;
          line-height: 1;
          margin: 0 0 8px 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .metric-label {
          font-size: 14px;
          font-weight: 500;
          margin: 0;
          opacity: 0.9;
        }
        
        .card-decoration {
          position: absolute;
          top: -20px;
          right: -20px;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          z-index: 1;
        }
        
        @media (max-width: 1200px) {
          .statistics-section {
            width: calc(100% - 350px);
            margin-left: 300px;
          }
        }
        
        @media (max-width: 992px) {
          .statistics-section {
            width: calc(100% - 60px);
            margin-left: 40px;
          }
          
          .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 768px) {
          .statistics-section {
            width: calc(100% - 40px);
            margin-left: 20px;
          }
          
          .metrics-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .metric-card {
            aspect-ratio: 2/1;
          }
        }
        
        @media (max-width: 576px) {
          .statistics-section {
            width: calc(100% - 30px);
            margin-left: 15px;
          }
          
          .card-content {
            padding: 20px;
          }
          
          .metric-value {
            font-size: 24px;
          }
        }
      `}</style>
    </section>
  );
}