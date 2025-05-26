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
        {/* Main Content Area */}
        <section className="main-content">
          {/* <DashboardHeader /> */}
          <br />
          <WelcomeCard/>
          
          <div className="content-wrapper">
            {/* <StatisticsSection /> */}
            <br />
            <ElearningStatisticsCard/>
            <br />
            <CoursesTable />
          </div>
        </section>

        {/* Right Sidebar */}
        <aside className="right-sidebar">
          <TopCoursesSection />
        </aside>
      </div>

      <style jsx>{`
        .dashboard-container {
          background-color: #fff;
          padding: 20px;
          overflow: hidden;
        }
        
        .dashboard-layout {
          display: flex;
          gap: 20px;
          width: 100%;
        }
        
        .main-content {
          flex: 1;
          min-width: 0; /* Prevent flex item from overflowing */
        }
        
        .right-sidebar {
          gap:30px;
          width: 350px; /* Fixed width for sidebar */
          flex-shrink: 0; /* Prevent sidebar from shrinking */
        }
        
        .content-wrapper {
          margin-top: 20px;
        }
        
        @media (max-width: 991px) {
          .dashboard-layout {
            flex-direction: column;
          }
          
          .right-sidebar {
            width: 100%;
            margin-top: 30px;
          }
          
          .dashboard-container {
            padding: 15px;
          }
        }
        
        @media (min-width: 992px) {
          .dashboard-container {
            padding-right: 77px;
          }
        }
      `}</style>
    </main>
  );
}