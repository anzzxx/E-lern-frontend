"use client";
import React, { useEffect } from 'react';
import styles from '../styles/InstructorHome.module.css';
import Reusablesidebar from "../components/Reusablesidebar";
import MainContent from "../Features/instructers/DashboardComponents/MainContent";
import ProfileSidebar from "../Features/instructers/DashboardComponents/ProfileSidebar";
import { handleLogout } from '../components/Logout';
import { useDispatch,useSelector } from 'react-redux';
import {fetchInstructorAverageRating,fetchInstructorTotalEarnings,fetchInstructorStudents}from "../Redux/Slices/instructorDashboardSlice";
import { fetchInstructorByUserId } from '../Redux/Slices/InstructorsSlice';
import { fetchInstructorCourses } from '../Redux/Slices/CoursesSlice';
const InstructorHome = () => {
  const dispatch=useDispatch()
  const user = useSelector((state) => state.auth.user);
  const menuItems = [
    { label: "Dashboard", path: "/instructor/" },  
    { label: "Courses", path: "/instructor/course" },    
    { label: "lessons", path: "/instructor/lessons" },    
    { label: "notification", path: "/instructor/notification" },    
    { label: "Logout", onClick: handleLogout },  
  ];

  
  useEffect(()=>{
    dispatch(fetchInstructorAverageRating())
    dispatch(fetchInstructorStudents())
    dispatch(fetchInstructorTotalEarnings())
    dispatch(fetchInstructorByUserId(user.id));
    dispatch(fetchInstructorCourses({ instructorId: user.id }));

  },[dispatch,user.id])

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