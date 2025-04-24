"use client";
import React from "react";
import InstructorCard from "../HomeComponets/InstructorCard ";

function PopularInstructor() {
  const containerStyles = {
    borderRadius: 0,
    display: "flex",
    flexDirection: "column",
    maxWidth:"98%",
    marginLeft:"20px",
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

  const instructors = [
    {
      id: 1,
      name: "Alexander Bastian",
      title: "Expert Mobile Engineer",
      imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/4ad9e76d9fb7cedbff2b5786f427bf7b0070fac6?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c",
      columnStyle: columnStyles,
    },
    {
      id: 2,
      name: "Labie Carthaline",
      title: "Marketing Specialist",
      imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/8e4bf372f40fda4a78d900065475888b96d3b697?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c",
      columnStyle: {...columnVariationStyles},
    },
    {
      id: 3,
      name: "Jonathan Doe",
      title: "Financial Strategiest",
      imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/065574123cee6d6e986b6b39530f8a3accfe32f2?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c",
      columnStyle: {...columnVariationStyles},
    },
    {
      id: 4,
      name: "Kitani Sarasvati",
      title: "Film Maker & Director",
      imageSrc: "https://cdn.builder.io/api/v1/image/assets/TEMP/913af33ab9fd35f3acbb7c0c395e706ca07dfbdc?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c",
      columnStyle: {...columnVariationStyles},
    },
  ];

  return (
    <section style={containerStyles}>
      <h2 style={titleStyles}>Popular Instructor</h2>
      <p style={subtitleStyles}>
        We know the best things for You. Top picks for You.
      </p>
      <div style={instructorsContainerStyles}>
        <div style={instructorsGridStyles}>
          {instructors.map((instructor) => (
            <InstructorCard
              key={instructor.id}
              imageSrc={instructor.imageSrc}
              name={instructor.name}
              title={instructor.title}
              columnStyle={instructor.columnStyle}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default PopularInstructor;