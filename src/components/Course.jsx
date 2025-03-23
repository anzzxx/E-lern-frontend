import React from "react";
import "../styles/home.css";

const Course = ({ courses, onCourseClick }) => {
 

  return (
    <div className="courses">
      {courses && courses.length > 0 ? (
        courses.map((course) => {
          const fixedImageUrl = course.thumbnail?.replace("image/upload/", "");
          const shortDescription =
            course.description.length > 100
              ? course.description.substring(0, 100) + "..."
              : course.description;

          return (
            <div 
              key={course.id} 
              className="course" 
              onClick={() => onCourseClick(course.id)} 
              style={{ cursor: "pointer" }}
            >
              <img src={fixedImageUrl} alt={course.title} />
              <h3>{course.title}</h3>
              <p>{shortDescription}</p>
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); // Prevent parent div click
                  onCourseClick(course.id); 
                }}
              >
                Enroll
              </button>
            </div>
          );
        })
      ) : (
        <p>No courses available</p>
      )}
    </div>
  );
};

export default Course;

