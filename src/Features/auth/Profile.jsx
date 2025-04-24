import React, { useEffect } from 'react'
import Sidebar from '../../components/Sidebar'
import '../../styles/sidebar.css'
import StudentDashboard from '../../components/StudentDash';
import { fetchStudentProgress } from '../../Redux/Slices/studentProgressSlice';
import { fetchEnrolledCourses } from "../../Redux/Slices/enrollmentSlice";
import { useDispatch,useSelector } from 'react-redux';
function Profile() {

  const dispatch=useDispatch()
  useEffect(()=>{
    dispatch(fetchStudentProgress());
    dispatch(fetchEnrolledCourses());
  },[dispatch])


  return (
    <>
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "20px" }}>Main Content Area</div>
      
    </div>
    <StudentDashboard/>
    </>
  )
}

export default Profile
