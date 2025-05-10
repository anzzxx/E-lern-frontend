import React from "react";
import { useSelector } from "react-redux";


export default function StatisticsSection() {
  const {allCourses}=useSelector((state)=>state.courses)
  const totelCourse=allCourses.length
  const metrics = [
    {
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/1f8dd4be790e531a4f90e6ac306f29dd0044c98c?placeholderIfAbsent=true&apiKey=34d728b774e44ebe92ee1866d5dfa190",
      value: totelCourse ?? 0,
      label: "Total Courses",
    },
    {
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/cd6a912297f4a5f10f3b47cf03e7fa4acd494e44?placeholderIfAbsent=true&apiKey=34d728b774e44ebe92ee1866d5dfa190",
      value: "10,000",
      label: "Enrolled Students",
    },
    {
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/99672ace1bd49512fc9b0b2d679ebba49ac33fd6?placeholderIfAbsent=true&apiKey=34d728b774e44ebe92ee1866d5dfa190",
      value: "$500,000",
      label: "Revenue Generated",
    },
  ];

  return (
    
    <section className="statistics-section">
    
      <br />
      <div className="metrics-grid">
        {metrics.map((metric, index) => (
          <article key={index} className="metric-card">
            <div className="card-content">
              <img src={metric.image} alt={metric.label} className="metric-image" />
              <div className="metric-info">
                <p className="metric-value">{metric.value}</p>
                <p className="metric-label">{metric.label}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <style jsx>{`
        .statistics-section {
          margin-top: -47px;
        }
        .section-title {
          color: #4c4c4c;
          font-size: 18px;
          font-weight: 600;
          line-height: 32px;
          margin-left:"0px";

        }
        .metrics-grid {
          display: flex;
          gap: 32px;
          flex-wrap: wrap;
        }
        .metric-card {
          border-radius: 4px;
          width: 227px;
          overflow: hidden;
        }
        .card-content {
          position: relative;
          aspect-ratio: 2.837;
          width: 100%;
        }
        .metric-image {
          position: absolute;
          inset: 0;
          height: 100%;
          width: 100%;
          object-fit: cover;
        }
        .metric-info {
          position: relative;
          border-radius: 4px;
          background-color: rgba(33, 33, 33, 1);
          padding: 19px 11px 10px;
          color: white;
        }
        .metric-value {
          font-size: 24px;
          font-weight: 600;
          line-height: 1;
          margin: 0;
        }
        .metric-label {
          font-size: 12px;
          margin: 11px 0 0;
        }
        @media (max-width: 991px) {
          .statistics-section {
            margin-bottom: 40px;
          }
        }
      `}</style>
    </section>

  );
}