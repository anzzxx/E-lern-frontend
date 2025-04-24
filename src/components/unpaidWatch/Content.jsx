"use client";
import React, { useEffect } from "react";
import CourseHeader from "./CourseHeader";
import CourseDetails from "./CourseDetails";
import CourseDescription from "./CourseDescription";
import PromoCard from "./PromoCard";
import NewsletterSection from "./NewsletterSection";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchAllCourses } from "../../Redux/Slices/CoursesSlice";
import { fetchReviews } from "../../Redux/Slices/reviewSlice";
import { fetchEnrolledCourses } from "../../Redux/Slices/enrollmentSlice";
function Content() {

  
    const dispatch = useDispatch();
    const { id } = useParams();
    const { allCourses } = useSelector((state) => state.courses);
  
    useEffect(() => {
      dispatch(fetchAllCourses());
      dispatch(fetchReviews());
      if(isAuthenticated){
        dispatch(fetchEnrolledCourses());
      }
    }, [dispatch]);
  
    const selectedCourse = allCourses?.find((course) => course.id.toString() === id);
    const isAuthenticated=useSelector((state)=>state.auth.isAuthenticated)  
    // Process URLs
    const videoUrl = selectedCourse?.preview_video?.replace("video/upload/", "") || "";
    const thumbnailUrl = selectedCourse?.thumbnail?.replace("image/upload/", "") || "";
  const styles = {
    content: {
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      maxWidth: "98%",
      marginLeft:"20px",
    },
    courseContentSection: {
      marginTop: "21px",
      width: "100%",
      "@media (max-width: 991px)": {
        maxWidth: "100%"
      }
    },
    contentColumns: {
      gap: "20px",
      display: "flex",
      "@media (max-width: 991px)": {
        flexDirection: "column",
        alignItems: "stretch",
        gap: "0px"
      }
    },
    mainColumn: {
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      width: "67%",
      "@media (max-width: 991px)": {
        width: "100%",
        marginTop: "19px"
      }
    },
    sideColumn: {
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      width: "33%",
      marginLeft: "20px",
      "@media (max-width: 991px)": {
        width: "100%",
        marginLeft: "0"
      }
    }
  };

  // Helper function to handle media queries
  const applyMediaQueries = (styleObj) => {
    const result = { ...styleObj };
    Object.keys(styleObj).forEach(key => {
      if (key.startsWith("@media")) {
        const mediaStyle = styleObj[key];
        delete result[key];
        if (window.matchMedia(key.replace("@media", "").trim()).matches) {
          Object.assign(result, mediaStyle);
        }
      }
    });
    return result;
  };
 console.log(selectedCourse,'selected course');
 
  return (
    <main style={applyMediaQueries(styles.content)}>
      <CourseHeader  selectedCourse={selectedCourse} />
      <CourseDetails selectedCourse={selectedCourse}/>

      <section style={applyMediaQueries(styles.courseContentSection)}>
        <div style={applyMediaQueries(styles.contentColumns)}>
          <div style={applyMediaQueries(styles.mainColumn)}>
            <CourseDescription selectedCourse={selectedCourse}/>
          </div>
          <div style={applyMediaQueries(styles.sideColumn)}>
            <PromoCard />
          </div>
        </div>
      </section>
    </main>
  );
}

export default Content;