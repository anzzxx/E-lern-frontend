import React from "react";
import "../styles/mycourse.css";
import { useDispatch, useSelector } from "react-redux";
import CourseProgress from '../components/CourseProgress';
export default function LastWeekActivity() {
  const { data, loading, error } = useSelector((state) => state.enrollments);
  const userId=useSelector((state)=>state.auth.user.id)

  
  const filteredEnrollments = data?.filter((enrollment) => enrollment.user.id === userId);
  console.log("Filtered Enrollments:", filteredEnrollments);
  return (
    <div className="activity-container">
      <h2 className="activity-title">Your Last Week Activity</h2>
      <h3 className="activity-subtitle">Cyber Security</h3>
      <div className="activity-table">
        <table>
          <thead>
            <tr>
              <th>Activity</th>
              <th>Python</th>
              <th>English</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Data</td>
              <td>Data</td>
              <td>Data</td>
            </tr>
          </tbody>
        </table>
      </div>
      <CourseProgress enrolledCourses={filteredEnrollments}/>
    </div>
  );
}