import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Banner from '../components/Banner';
import Feature from '../components/Feature';
import Course from '../components/Course';
import Message from '../components/Message';
import { fetchCourses } from "../Redux/Slices/CoursesSlice";
import { fetchReviews } from "../Redux/Slices/reviewSlice";
import "../styles/home.css";

const LandingPage = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { courses } = useSelector((state) => state.courses);

  useEffect(() => {
    dispatch(fetchCourses());       
    dispatch(fetchReviews());
  }, [dispatch]);

  // Filter only active courses (if needed)
  const activeCourses = courses; // Uncomment filter logic if needed

  // Function to navigate to the course details page
  const handleCourseClick = (id) => {
    navigate(`/course/${id}`);
  };

  return (
    <div>
      <Banner />
      <Feature />
      <h2 className="headline">Popular Courses</h2>
      <Course courses={activeCourses} onCourseClick={handleCourseClick} />

      {/* Conditionally render the message */}
      {isAuthenticated ? (
        <Message message="User Authenticated!" type="success" duration={5000} />
      ) : (
        <Message message="User Not Authenticated!" type="error" duration={5000} />
      )}
    </div>
  );
};

export default LandingPage;