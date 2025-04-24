import React, { useEffect } from 'react';
import '../styles/sidebar.css';
import Sidebar from '../components/Sidebar';
import LastWeekActivity from "../components/LastWeekActivity";
import { fetchStudentProgress } from '../Redux/Slices/studentProgressSlice';
import { useDispatch, useSelector } from "react-redux";
import { fetchEnrolledCourses } from "../Redux/Slices/enrollmentSlice";
function Mycourses() {
  const dispatch = useDispatch();
  
  
  useEffect(()=>{
    dispatch(fetchEnrolledCourses());
    dispatch(fetchStudentProgress());
  },[dispatch])
 
 

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "20px" }}>
        <h1>Dashboard</h1>
        <div style={{ marginBottom: "20px" }}>
          <h2>Anas</h2>
          <p>amu8148@gmail.com</p>
        </div>
        <LastWeekActivity />
        
      </div>
    </div>
  );
}

export default Mycourses;