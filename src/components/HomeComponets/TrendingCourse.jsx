"use client";
import React from "react";
import CourseCard from "./CourseCard";
import { useSelector } from "react-redux";

const TrendingCourses = ({ apiCourses, onCourseClick }) => {
  const { reviews } = useSelector((state) => state.reviews);

  const transformCourseData = (apiCourse) => {
    // Filter reviews for this specific course
    const courseReviews = reviews.filter(review => review.course === apiCourse.id);
    
    // Calculate average rating
    const averageRating = courseReviews.length > 0 
      ? courseReviews.reduce((sum, review) => sum + review.rating, 0) / courseReviews.length
      : 0;
    
    // Format review count (show actual count if < 1000, otherwise show "X.YK")
    const reviewCount = courseReviews.length >= 1000
      ? `${(courseReviews.length / 1000).toFixed(1)}K`
      : courseReviews.length.toString();

    return {
      id: apiCourse.id,
      image: apiCourse.thumbnail.replace("image/upload/", ""),
      title: apiCourse.title,
      instructor: apiCourse.instructor?.name || "Unknown Instructor",
      description: apiCourse.description.split("\r\n")[0] || "Course description",
      rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      reviewCount: reviewCount,
      currentPrice: `$${apiCourse.price}`,
      originalPrice: `$${(parseFloat(apiCourse.price) * 1.2).toFixed(2)}`,
      isBestSeller: apiCourse.status === "published",
      discount: "20% OFF",
      lessonCount: apiCourse.lessons?.length || 0,
    };
  };

  const courses = apiCourses.map(transformCourseData);
  const COURSES_PER_ROW = 5;

  // Split courses into chunks of 5
  const rows = [];
  for (let i = 0; i < courses.length; i += COURSES_PER_ROW) {
    rows.push(courses.slice(i, i + COURSES_PER_ROW));
  }

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"
      />
      <section style={{ width: "98%", marginLeft: "20px", fontFamily: "Gilroy, sans-serif" }}>
        <header style={{ marginBottom: "20px" }}>
          <h2 style={{ color: "#000", fontSize: "20px", fontWeight: 700 }}>Trending Course</h2>
          <p style={{ color: "#1b1b1b99", fontSize: "16px", fontWeight: 400 }}>
            We know the best things for You. Top picks for You.
          </p>
        </header>

        {/* Dynamically render rows */}
        {rows.map((rowCourses, rowIndex) => (
          <div
            key={rowIndex}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "25px",
              marginBottom: rowIndex < rows.length - 1 ? "20px" : "0", // No margin on last row
            }}
          >
            {rowCourses.map((course) => (
              <CourseCard key={course.id} course={course} onCourseClick={onCourseClick} />
            ))}
          </div>
        ))}
      </section>
    </>
  );
};

export default TrendingCourses;