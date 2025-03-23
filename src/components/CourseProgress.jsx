import React from "react";
import "../styles/mycourse.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
export default function CourseProgress({ enrolledCourses = [] }) {
  console.log(enrolledCourses);
  const navigate = useNavigate()

  
  return (
    <div className="row">
      {enrolledCourses.length > 0 ? (
        enrolledCourses.map((course, index) => {
          const fixedImageUrl = course.course.thumbnail?.replace("image/upload/", "");



          return (
            <div key={index} className="col-md-4 mb-4">
              <div className="card" style={{ width: "18rem" }}>
                <img
                  src={fixedImageUrl || "https://via.placeholder.com/150"}
                  className="card-img-top"
                  alt={course?.course?.title || "Course Image"}
                />
                <div className="card-body">
                  <h5 className="card-title">{course?.course?.title || "Unknown Course"}</h5>
                  <p className="card-text">Progress: {course?.progress || 0}% completed</p>
                  <div className="progress mb-2">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: `${course?.progress || 0}%` }}
                      aria-valuenow={course?.progress || 0}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <button className="btn btn-primary" onClick={() => navigate(`/watch-course/${course.course.id}`)}>
                    View Course
                  </button>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p>No enrolled courses found.</p>
      )}
    </div>
  );
}
