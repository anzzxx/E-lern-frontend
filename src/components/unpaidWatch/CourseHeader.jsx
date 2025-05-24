import React from "react";
import { useSelector } from "react-redux";

function CourseHeader({ selectedCourse }) {
  const { reviews } = useSelector((state) => state.reviews);

  if (!selectedCourse) {
    return <div style={styles.loading}>Loading course...</div>;
  }

  // Calculate average rating
  const courseReviews =
    reviews?
      reviews.filter((review) => review.course === selectedCourse.id)
      : [];

  // console.log("coursereview",courseReviews);
      

  const averageRating =
    courseReviews.length > 0
      ? courseReviews.reduce((sum, review) => sum + review.rating, 0) / courseReviews.length
      : 0;

  const reviewCount = courseReviews.length.toLocaleString();

  const instructorName = selectedCourse.instructor?.name || "Unknown Instructor";

  // Generate star rating display
  const renderStars = () => {
    const fullStars = Math.floor(averageRating);
    const hasHalfStar = averageRating % 1 >= 0.5;

    // Debugging: Log values to check if they're correct
    // console.log({ averageRating, fullStars, hasHalfStar, courseReviews });

    return (
      <div style={styles.ratingStars}>
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return <span key={`full-${i}`} style={styles.filledStar}>★</span>;
          }
          if (i === fullStars && hasHalfStar) {
            return <span key={`half-${i}`} style={styles.halfStar}>★</span>;
          }
          return <span key={`empty-${i}`} style={styles.emptyStar}>★</span>;
        })}
      </div>
    );
  };

  return (
    <header style={styles.courseHeader}>
      <h1 style={styles.courseTitle}>{selectedCourse.title}</h1>
      <div style={styles.instructorInfo}>
        <h2 style={styles.instructorName}>{instructorName}</h2>
        <div style={styles.ratingContainer}>
          {renderStars()}
          <span style={styles.ratingValue}>{averageRating.toFixed(1)}</span>
          <span style={styles.ratingCount}>({reviewCount} ratings)</span>
        </div>
      </div>
    </header>
  );
}

const styles = {
  courseHeader: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "20px",
  },
  loading: {
    padding: "20px",
    textAlign: "center",
  },
  courseTitle: {
    color: "rgba(0, 0, 0, 1)",
    fontSize: "32px",
    fontWeight: 700,
    lineHeight: 1,
    margin: "8px 0 0 0",
  },
  instructorInfo: {
    display: "flex",
    marginTop: "8px",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
  },
  instructorName: {
    color: "#c5322a",
    fontSize: "16px",
    margin: 0,
    fontWeight: 400,
  },
  ratingContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px", // Increased gap for better spacing
  },
  ratingStars: {
    display: "flex",
    alignItems: "center",
    fontSize: "16px",
    color: "rgba(0, 0, 0, 1)",
  },
  filledStar: {
    color: "#FFD700", // Gold color for filled stars
    fontSize: "20px", // Reduced size for better alignment
  },
  halfStar: {
    color: "#FFD700",
    fontSize: "20px",
    position: "relative",
    width: "10px", // Adjusted for better half-star display
    overflow: "hidden",
    display: "inline-block",
  },
  emptyStar: {
    color: "#D3D3D3", // Light gray for empty stars
    fontSize: "20px",
  },
  ratingValue: {
    marginLeft: "8px",
    fontSize: "16px",
    color: "#1b1b1b",
  },
  ratingCount: {
    color: "#1b1b1b",
    fontSize: "14px",
  },
};

export default CourseHeader;