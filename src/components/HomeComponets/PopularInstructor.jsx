"use client";
import React from "react";
import InstructorCard from "../HomeComponets/InstructorCard ";
import {STATIC_URL} from "../../Redux/api";
import { useSelector } from "react-redux";

function PopularInstructor() {
  // Get instructors from Redux store
  const { instructors } = useSelector((state) => state.instructors);
  
  // Styles
  const containerStyles = {
    borderRadius: 0,
    display: "flex",
    flexDirection: "column",
    maxWidth: "98%",
    marginLeft: "20px",
    alignItems: "flex-start",
  };

  const titleStyles = {
    color: "#000",
    fontFamily: "Gilroy, -apple-system, Roboto, Helvetica, sans-serif",
    fontSize: "20px",
    fontWeight: 700,
    lineHeight: 1.3,
  };

  const subtitleStyles = {
    color: "#1b1b1b",
    marginTop: "4px",
    fontFamily: "Gilroy, -apple-system, Roboto, Helvetica, sans-serif",
    fontSize: "16px",
    fontWeight: 400,
  };

  const instructorsContainerStyles = {
    alignSelf: "stretch",
    width: "100%",
    marginTop: "24px",
  };

  const instructorsGridStyles = {
    gap: "20px",
    display: "flex",
  };

  const columnStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    width: "25%",
    marginLeft: "0",
    lineHeight: "normal",
  };

  const columnVariationStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    width: "25%",
    marginLeft: "20px",
    lineHeight: "normal",
  };

  // Default image URL
  const DEFAULT_INSTRUCTOR_IMAGE = "https://cdn.builder.io/api/v1/image/assets/TEMP/4ad9e76d9fb7cedbff2b5786f427bf7b0070fac6?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c";

  // Fallback data in case Redux store is empty
  const fallbackInstructors = [
    {
      id: 1,
      name: "Alexander Bastian",
      title: "Expert Mobile Engineer",
      imageSrc: DEFAULT_INSTRUCTOR_IMAGE,
      columnStyle: columnStyles,
    },
    {
      id: 2,
      name: "Labie Carthaline",
      title: "Marketing Specialist",
      imageSrc: DEFAULT_INSTRUCTOR_IMAGE,
      columnStyle: {...columnVariationStyles},
    },
    {
      id: 3,
      name: "Jonathan Doe",
      title: "Financial Strategist",
      imageSrc: DEFAULT_INSTRUCTOR_IMAGE,
      columnStyle: {...columnVariationStyles},
    },
    {
      id: 4,
      name: "Kitani Sarasvati",
      title: "Film Maker & Director",
      imageSrc: DEFAULT_INSTRUCTOR_IMAGE,
      columnStyle: {...columnVariationStyles},
    },
  ];

  // Process instructors data
  const processInstructors = (instructors) => {
    if (!instructors || !instructors.length) return fallbackInstructors;
    
    // Create full URL for profile pictures and handle null cases
    const processed = instructors.map(instructor => ({
      ...instructor,
      imageSrc: instructor.profile_picture 
        ? `${STATIC_URL}${instructor.profile_picture}`
        : DEFAULT_INSTRUCTOR_IMAGE,
      title: instructor.experience || "Expert Instructor"
    }));

    // If we have less than 4 instructors, fill with fallback data
    if (processed.length < 4) {
      const needed = 4 - processed.length;
      return [...processed, ...fallbackInstructors.slice(0, needed)];
    }

    // Return first 4 instructors
    return processed.slice(0, 4);
  };

  const displayInstructors = processInstructors(instructors);

  return (
    <section style={containerStyles}>
      <h2 style={titleStyles}>Popular Instructor</h2>
      <p style={subtitleStyles}>
        We know the best things for You. Top picks for You.
      </p>
      <div style={instructorsContainerStyles}>
        <div style={instructorsGridStyles}>
          {displayInstructors.map((instructor, index) => (
            <InstructorCard
              key={instructor.id}
              imageSrc={instructor.imageSrc}
              name={instructor.name}
              title={instructor.title}
              columnStyle={index === 0 ? columnStyles : {...columnVariationStyles}}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default PopularInstructor;
