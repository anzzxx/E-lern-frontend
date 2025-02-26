import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Banner from '../components/Banner';
import Navbar from '../components/Navbar';
import Feature from '../components/Feature';
import Course from '../components/Course';
import { fetchCourses } from "../Redux/Slices/CoursesSlice";
import "../styles/home.css"

const LandingPage = () => {
  const dispatch = useDispatch();
  const { courses } = useSelector((state) => state.courses);
  console.log(courses);
  
  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  // Filter only active courses
  const activeCourses = courses?.filter(course => course.is_active);

  return (
    <div>
      <Navbar />
      <Banner />
      <Feature />
      <h2 className="headline">Popular Courses</h2>
      <Course courses={activeCourses} />
    </div>
  );
};

export default LandingPage;

