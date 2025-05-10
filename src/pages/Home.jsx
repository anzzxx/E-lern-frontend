import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Banner from '../components/Banner';
import Feature from '../components/Feature';
import Message from '../components/Message';
import { fetchAllCourses } from "../Redux/Slices/CoursesSlice";
import { fetchReviews } from "../Redux/Slices/reviewSlice";
import TrendingCourse from "../components/HomeComponets/TrendingCourse"
import "../styles/home.css";
import PopularInstructor from "../components/HomeComponets/PopularInstructor";
import Footer from "../components/HomeComponets/Footer";
import Navbar from "../components/Navbar";
import {fetchInstructors} from "../Redux/Slices/InstructorsSlice";
import Meett from "../Features/Metting/Room/Meett";
import MeetingInterface from "../Features/Metting/Room/MeetingInterface";
import Certificate from "../components/Certificate";
import {  setName, setEmail, setImage } from "../Redux/Slices/EditProfileSlice";
import api from "../Redux/api";

const LandingPage = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { allCourses } = useSelector((state) => state.courses);

  useEffect(() => {
    dispatch(fetchAllCourses());       
    dispatch(fetchReviews());
    dispatch(fetchInstructors());
  }, [dispatch]);

    // Fetch Profile Data
    useEffect(() => {
  
      const fetchProfile = async () => {
        try {
          const response = await api.get("api/profile/update/");
          dispatch(setName(response.data.username));
          dispatch(setEmail(response.data.email));
          dispatch(setImage(response.data.profile_picture));
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      };
      if(isAuthenticated){
        fetchProfile();
      }
      
    }, [ dispatch]);

  // Filter only active courses (if needed)
  const activeCourses = allCourses; 
  const countOfCourse=activeCourses.length
  // Function to navigate to the course details page
  const handleCourseClick = (id) => {
    navigate(`/course/${id}`);
  };
  console.log(activeCourses);
  
  // In the filterCourses function:
const filterCourses = () => {
  if (!searchQuery.trim()) return [];
  
  const queries = searchQuery.toLowerCase().split(' ').filter(q => q);
  
  return allCourses.filter(course => {
    const searchText = `
      ${course.title.toLowerCase()}
      ${course.description?.toLowerCase() || ''}
      ${course.instructor?.name?.toLowerCase() || ''}
      ${course.tags?.join(' ')?.toLowerCase() || ''}
    `;
    
    return queries.every(query => searchText.includes(query));
  });
};

  return (
    <>
      <Navbar/>
       <Banner />
       <br />
      
      <Feature countOfCourse={countOfCourse}/>
      
      {/* <Course courses={activeCourses} onCourseClick={handleCourseClick} /> */}

      <br />
      <TrendingCourse apiCourses={activeCourses} onCourseClick={handleCourseClick} />
      <br />
      <PopularInstructor/>
      <br />
      <Footer/>
      {/* Conditionally render the message */}
      {isAuthenticated ? (
        <Message message="User Authenticated!" type="success" duration={5000} />
      ) : (
        <Message message="User Not Authenticated!" type="error" duration={5000} />
      )}

      
    </>
    // <>
    // {/* <Navbar/>
    // <Meett/> */}
    // <MeetingInterface/>
    
    // </>
   
      

  );
};

export default LandingPage;