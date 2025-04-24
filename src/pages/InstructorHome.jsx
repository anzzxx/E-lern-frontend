"use client";
import React from 'react'
import InstSidebar from '../components/InstSidebar'
import {handleLogout} from '../components/Logout';
import Reusablesidebar from "../components/Reusablesidebar";
import MainContent from "../Features/instructers/DashboardComponents/MainContent";
import ProfileSidebar from "../Features/instructers/DashboardComponents/ProfileSidebar";

const InstructorHome = () => {

  const menuItems = [
    { label: "Dashboard", path: "/instructor/" },  
    { label: "Courses", path: "/instructor/course" },    
    { label: "lessons", path: "/instructor/lessons" },    
    { label: "notification", path: "/instructor/notification" },    
    { label: "Logout", onClick: handleLogout },  
  ];
  return (
    <>
      <main className="dashboard-container">
        <div className="dashboard-layout">
          <Reusablesidebar  title="E-LERN" menuItems={menuItems}/>
          <MainContent />
          <ProfileSidebar />
        </div>
      </main>

      <style>{`
        .dashboard-container {
          border-radius: 30px;
          background-color: #ffffff;
          overflow: hidden;
          margin-left:300px;
        }

        .dashboard-layout {
          display: flex;
          gap: 30px;
        }

        @media (max-width: 991px) {
          .dashboard-layout {
            flex-direction: column;
            align-items: stretch;
            gap: 0px;
          }
        }
      `}</style>
    </>
  );
};

export default InstructorHome;
