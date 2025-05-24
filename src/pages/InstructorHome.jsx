"use client";
import React, { useEffect, useState } from 'react';
import styles from '../styles/InstructorHome.module.css';
import Reusablesidebar from "../components/Reusablesidebar";
import MainContent from "../Features/instructers/DashboardComponents/MainContent";
import ProfileSidebar from "../Features/instructers/DashboardComponents/ProfileSidebar";
import { handleLogout } from '../components/Logout';
import { useDispatch,useSelector } from 'react-redux';
import {fetchInstructorAverageRating,fetchInstructorTotalEarnings,fetchInstructorStudents}from "../Redux/Slices/instructorDashboardSlice";
import { fetchInstructorByUserId } from '../Redux/Slices/InstructorsSlice';
import { fetchInstructorCourses } from '../Redux/Slices/CoursesSlice';
import { SyncLoader } from "react-spinners";
const InstructorHome = () => {
  const dispatch=useDispatch()
  const user = useSelector((state) => state.auth.user);
  const [isLoading,setIsLoading]=useState(true)
  const menuItems = [
      { label: "Dashboard", path: "/instructor/" },
      { label: "Courses", path: "/instructor/course" },
      { label: "Notification", path: "/instructor/notification" },
      { label: "Payment History", path: "/instructor/payment/details" },
      { label: "Create Meeting", path: "/instructor/create-meenting" },
      { label: "Logout", onClick: handleLogout },
    ];
  
  useEffect(()=>{
    dispatch(fetchInstructorAverageRating())
    dispatch(fetchInstructorStudents())
    dispatch(fetchInstructorTotalEarnings())
    dispatch(fetchInstructorByUserId(user.id));
    dispatch(fetchInstructorCourses({ instructorId: user.id }));

  },[dispatch,user.id])
  
  useEffect(() => {
  const timer = setTimeout(() => {
    setIsLoading(false);
  }, 1500);

  return () => clearTimeout(timer);
  });
  if (isLoading) {
      return (
        <div className="fullscreen-loading">
          <SyncLoader color="#6c63ff" size={15} />
        </div>
      );
    }
  return (
    <main className={styles.dashboardContainer}>
      <div className={styles.dashboardLayout}>
        <Reusablesidebar title="E-LERN" menuItems={menuItems} />
        <MainContent />
        <ProfileSidebar />
      </div>
    </main>
  );
};

export default InstructorHome;