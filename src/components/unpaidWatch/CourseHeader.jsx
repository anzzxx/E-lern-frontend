import React from "react";
import { useSelector } from "react-redux";

function CourseHeader({ selectedCourse }) {
  const { reviews } = useSelector((state) => state.reviews);
  
  if (!selectedCourse) {
    return <div style={styles.loading}>Loading course...</div>;
  }

  // Calculate average rating
  const courseReviews = reviews?.filter(review => review.course === selectedCourse.id) || [];
  const averageRating = courseReviews.length > 0 
    ? (courseReviews.reduce((sum, review) => sum + review.rating, 0) / courseReviews.length)
    : 0;
  const reviewCount = courseReviews.length.toLocaleString();

  const instructorName = selectedCourse.instructor?.name || "Unknown Instructor";

  // Generate star rating display
  const renderStars = () => {
    const fullStars = Math.floor(averageRating);
    const hasHalfStar = averageRating % 1 >= 0.5;
    
    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} style={styles.filledStar}>★</span>
        ))}
        {hasHalfStar && <span style={styles.halfStar}>★</span>}
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <span key={`empty-${i}`} style={styles.emptyStar}>★</span>
        ))}
      </>
    );
  };

  return (
    <header style={styles.courseHeader}>
      <h1 style={styles.courseTitle}>{selectedCourse.title}</h1>
      <div style={styles.instructorInfo}>
        <h2 style={styles.instructorName}>{instructorName}</h2>
        <div style={styles.ratingContainer}>
          <div style={styles.ratingStars}>
            {renderStars()}
            <span style={styles.ratingValue}>{averageRating.toFixed(1)}</span>
          </div>
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
    marginBottom: "20px"
  },
  loading: {
    padding: "20px",
    textAlign: "center"
  },
  courseTitle: {
    color: "rgba(0, 0, 0, 1)",
    fontSize: "32px",
    fontWeight: 700,
    lineHeight: 1,
    margin: "8px 0 0 0"
  },
  instructorInfo: {
    display: "flex",
    marginTop: "8px",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap"
  },
  instructorName: {
    color: "#c5322a",
    fontSize: "16px",
    margin: 0,
    fontWeight: 400
  },
  ratingContainer: {
    display: "flex",
    alignItems: "center",
    gap: "4px"
  },
  ratingStars: {
    display: "flex",
    alignItems: "center",
    fontSize: "16px",
    color: "rgba(0, 0, 0, 1)"
  },
  filledStar: {
    color: "#FFD700",
    fontSize: "24px"
  },
  halfStar: {
    color: "#FFD700",
    fontSize: "24px",
    position: "relative",
    overflow: "hidden",
    width: "12px"
  },
  emptyStar: {
    color: "#D3D3D3",
    fontSize: "24px"
  },
  ratingValue: {
    marginLeft: "4px"
  },
  ratingCount: {
    color: "#1b1b1b",
    fontSize: "14px"
  }
};

export default CourseHeader;