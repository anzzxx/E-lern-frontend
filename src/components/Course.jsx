import React from 'react';
import "../styles/home.css";

const Course = ({ courses }) => {
  return (
    <div className="courses">
      {courses && courses.length > 0 ? (
        courses.map((course) => {
          const fixedImageUrl = course.thumbnail?.replace("image/upload/", "");
          const shortDescription = course.description.length > 100 
            ? course.description.substring(0, 100) + "..." 
            : course.description;

          return (
            <div key={course.id} className="course">
              <img src={fixedImageUrl} alt={course.title} />
              <h3>{course.title}</h3>
              <p>{shortDescription}</p>
              <button>Enroll</button>
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


