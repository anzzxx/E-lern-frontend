import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CourseCard from "../components/HomeComponets/CourseCard";
import Navbar from "./Navbar";


const SearchPage = ({ allCourses }) => {
  const navigate=useNavigate()
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("q") || "";

  const [filteredCourses, setFilteredCourses] = useState([]);
  const onCourseClick = (id) => {
    navigate(`/course/${id}`);
  };
  
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = filterCourses(allCourses, searchQuery);
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses([]);
    }
  }, [searchQuery, allCourses]);

  const filterCourses = (courses, query) => {
    const searchTerms = query.toLowerCase().split(" ").filter(Boolean);

    return courses.filter((course) => {
      const searchText = `
        ${course.title?.toLowerCase() || ""}
        ${course.description?.toLowerCase() || ""}
        ${course.instructor?.name?.toLowerCase() || ""}
        ${course.tags?.join(" ")?.toLowerCase() || ""}
      `;

      return searchTerms.every((term) => searchText.includes(term));
    });
  };

  const transformCourseData = (apiCourse) => ({
    id: apiCourse.id,
    image: apiCourse.thumbnail.replace("image/upload/", ""),
    title: apiCourse.title,
    instructor: apiCourse.instructor?.name || "Unknown Instructor",
    description: apiCourse.description?.split("\r\n")[0] || "Course description",
    rating: 4.5,
    reviewCount: "1.2K",
    currentPrice: `$${apiCourse.price}`,
    originalPrice: `$${(parseFloat(apiCourse.price) * 1.2).toFixed(2)}`,
    isBestSeller: apiCourse.status === "published",
    discount: "20% OFF",
    lessonCount: apiCourse.lessons?.length || 0,
  });

  const transformedCourses = filteredCourses.map(transformCourseData);
  const COURSES_PER_ROW = 5;
  const rows = [];

  for (let i = 0; i < transformedCourses.length; i += COURSES_PER_ROW) {
    rows.push(transformedCourses.slice(i, i + COURSES_PER_ROW));
  }

  return (
    <>
    <Navbar/>
    <br />
    <div className="search-page-container">
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"
      />
      <section style={{ width: "98%", marginLeft: "20px", fontFamily: "Gilroy, sans-serif" }}>
        <header style={{ marginBottom: "20px" }}>
          <h2 style={{ color: "#000", fontSize: "20px", fontWeight: 700 }}>
            {searchQuery ? `Search Results for "${searchQuery}"` : "Search Courses"}
          </h2>
          <p style={{ color: "#1b1b1b99", fontSize: "16px", fontWeight: 400 }}>
            {transformedCourses.length} {transformedCourses.length === 1 ? "course" : "courses"} found
          </p>
        </header>

        {!searchQuery ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p style={{ color: "#1b1b1b99", fontSize: "16px" }}>
              Enter a search term to find courses
            </p>
          </div>
        ) : transformedCourses.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p style={{ color: "#1b1b1b99", fontSize: "16px" }}>
              No courses found matching your search. Try different keywords.
            </p>
          </div>
        ) : (
          rows.map((rowCourses, rowIndex) => (
            <div
              key={rowIndex}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "25px",
                marginBottom: rowIndex < rows.length - 1 ? "20px" : "0",
              }}
            >
              {rowCourses.map((course) => (
                <CourseCard key={course.id} course={course} onCourseClick={onCourseClick} />
              ))}
            </div>
          ))
        )}
      </section>
    </div>
    </>
  );
};

export default SearchPage;
