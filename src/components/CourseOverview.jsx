import React, { useEffect, useState } from "react";
import '../styles/videoplyer.css';
import { useSelector, useDispatch } from "react-redux";
import { fetchCourses } from "../Redux/Slices/CoursesSlice";
import { useParams } from "react-router-dom";
import RazorpayButton from "../components/RazorpayButton";
import { Button } from "react-bootstrap"; // Import Bootstrap Button
const CourseOverview = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { courses, loading } = useSelector((state) => state.courses);


  const [selectedCourse, setSelectedCourse] = useState(null);

  const user = useSelector((state) => state.auth.user);
  const userId = user ? user.id : null;  // Fix: Avoid accessing id of null

  const { data } = useSelector((state) => state.enrollments);
  const filteredEnrollments = userId
    ? data?.filter((enrollment) => enrollment.user.id === userId)
    : [];

  const cs = filteredEnrollments?.map((enrollment) => enrollment.course);
  const Enrolled = cs.some(course => course.id === selectedCourse?.id);




  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  useEffect(() => {
    if (courses?.length > 0) {
      setSelectedCourse(courses.find(course => course.id.toString() === id));
    }
  }, [courses, id]);

  if (loading || !selectedCourse) {
    return <div className="loading">Loading course details...</div>;
  }

  

  return (
    <div className="container-wrapper">
      <div className="course-container">
        {/* Course Title & Rating */}
        <div className="course-header">
          <h2 className="course-title">{selectedCourse?.title}</h2>
          <span className="course-rating">⭐ 4.9</span>
        </div>

        {/* What You'll Learn */}
        <div className="course-details">
          <h3>What you'll learn</h3>
          <ul>
            {selectedCourse?.description?.split("\n")?.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>

        {/* Course Extras */}
        <div className="course-extras">
          <span className="extra-item">📂 Assignments</span>
          <span className="extra-item">⏳ 26.5 hours video</span>
          <span className="extra-item">📝 1 practice test</span>
          <span className="extra-item">📖 1 article</span>
        </div>
      </div>

      {/* Price & Payment Section */}
      <div className="price-container">
        <h2>Price</h2>
        <div className="enroll-section">
          <p>Price: ${Number(selectedCourse?.price || 0).toFixed(2)}</p>
          <p>Tax: $10.00</p>
          <p>Total: ${(Number(selectedCourse?.price || 0) + 10).toFixed(2)}</p>
          {user ? (
            !Enrolled ? (
              <RazorpayButton
                
                amount={(Number(selectedCourse?.price || 0) + 10)} // Convert to paise
                courseId={selectedCourse?.id}
                userId={user?.id}
              />
            ) : (
              <p className="enrolled-message">You are already enrolled in this course.</p>
            )
          ) : (
            <p className="login-message">Please login to enroll</p>
          )}

        </div>
      </div>
    </div>
  );
};

export default CourseOverview;
