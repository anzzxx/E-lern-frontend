"use client";
import React from "react";
import DashboardHeader from "./DashboardHeader";
import StatisticsSection from "./StatisticsSection";
import CoursesTable from "./CoursesTable";
import TopCoursesSection from "./TopCoursesSection";
import WelcomeCard from "./WelcomeCard";
import ElearningStatisticsCard from "./ElearningStatisticsCard";

export default function ElearningAdminDashboard() {
  return (
    <main className="dashboard-container">
      <div className="dashboard-layout">
        <section className="main-content">
          <DashboardHeader />
          <br />
          <WelcomeCard/>
          <br />
          <div className="content-wrapper">
            <div className="content-grid">
              <div className="content-main">
                <StatisticsSection />
                <br />
                <ElearningStatisticsCard/>
                <br />
                <CoursesTable />
              </div>
              <br />
              <aside className="content-sidebar">
                <TopCoursesSection />
              </aside>
            </div>
          </div>
          
        </section>
      </div>
      <style jsx>{`
        .dashboard-container {
          background-color: #fff;
          padding-right: 77px;
          overflow: hidden;
        }
        .dashboard-layout {
          display: flex;
          gap: 20px;
        }
        .main-content {
          flex: 1;
        }
        .content-wrapper {
          margin-top: 80px;
        }
        .content-grid {
          display: flex;
          gap: 20px;
        }
        .content-main {
          width: 68%;
        }
        .content-sidebar {
          width: 32%;
        }
        @media (max-width: 991px) {
          .dashboard-container {
            padding-right: 20px;
          }
          .dashboard-layout {
            flex-direction: column;
          }
          .content-grid {
            flex-direction: column;
          }
          .content-main,
          .content-sidebar {
            width: 100%;
          }
          .content-wrapper {
            margin-top: 40px;
          }
        }
      `}</style>
    </main>
  );
}