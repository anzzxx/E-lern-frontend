"use client";
import React, { useState, useEffect } from "react";
import StarRating from "../../components/HomeComponets/StarRating";

const CourseCard = ({ course, onCourseClick }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    // Set initial value
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const {
    image,
    title,
    instructor,
    description,
    rating,
    reviewCount,
    currentPrice,
    originalPrice,
    isBestSeller,
    discount,
    lessonCount
  } = course;

  // Format rating to show one decimal place if needed (e.g., 4.0 → 4, 4.5 → 4.5)
  const formattedRating = Number.isInteger(rating) ? rating : rating.toFixed(1);

  // Styles object
  const styles = {
    card: {
      display: "flex",
      flexDirection: "column",
      gap: "4px",
      width: isMobile ? "100%" : "285px",
      cursor: "pointer",
      marginBottom: isMobile ? "20px" : "0"
    },
    imageContainer: {
      width: isMobile ? "100%" : "285px",
      height: "161px",
      position: "relative"
    },
    image: {
      borderRadius: "23px",
      width: "100%",
      height: "100%",
      objectFit: "cover"
    },
    bestSellerBadge: {
      color: "#fff",
      backgroundColor: "#3dcbb1",
      borderRadius: "23px",
      padding: "4px 10px",
      fontSize: "8px",
      fontWeight: "700",
      position: "absolute",
      top: "8px",
      left: "11px"
    },
    discountBadge: {
      color: "#fff",
      backgroundColor: "#a04ae3",
      borderRadius: "23px",
      padding: "4px 10px",
      fontSize: "8px",
      fontWeight: "700",
      position: "absolute",
      top: "8px",
      left: isMobile ? "80px" : "66px"
    },
    courseTitle: {
      color: "#000",
      fontSize: "16px",
      fontWeight: "700",
      marginTop: "8px"
    },
    instructor: {
      color: "#3dcbb1",
      display: "flex",
      alignItems: "center",
      fontSize: "14px",
      margin: "4px 0"
    },
    description: {
      color: "#1b1b1be6",
      fontSize: "14px",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
      textOverflow: "ellipsis",
      margin: "4px 0"
    },
    ratingContainer: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
      margin: "4px 0"
    },
    ratingText: {
      color: "#1b1b1b99",
      fontSize: "14px",
      marginLeft: "4px"
    },
    priceContainer: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      margin: "8px 0"
    },
    currentPrice: {
      color: "#1b1b1be6",
      fontSize: "20px",
      fontWeight: "700"
    },
    originalPrice: {
      color: "#1b1b1b99",
      fontSize: "16px",
      textDecoration: "line-through"
    },
    lessonCount: {
      color: "#1b1b1b99",
      fontSize: "12px",
      marginTop: "4px"
    }
  };

  return (
    <article style={styles.card} onClick={() => onCourseClick(course.id)}>
      <div style={styles.imageContainer}>
        <img src={image} alt={title} style={styles.image} />
        {isBestSeller && (
          <span style={styles.bestSellerBadge}>Best Seller</span>
        )}
        {discount && <span style={styles.discountBadge}>{discount}</span>}
      </div>
      <h3 style={styles.courseTitle}>{title}</h3>
      <div style={styles.instructor}>
        <i className="ti ti-user" style={{ marginRight: "8px" }} />
        <span>{instructor}</span>
      </div>
      <p style={styles.description}>{description}</p>
      <div style={styles.ratingContainer}>
        <StarRating rating={rating} />
        <span style={styles.ratingText}>
          {formattedRating} ({reviewCount} {reviewCount === "1" ? "review" : "reviews"})
        </span>
      </div>
      <div style={styles.priceContainer}>
        <span style={styles.currentPrice}>{currentPrice}</span>
        <span style={styles.originalPrice}>{originalPrice}</span>
      </div>
      {lessonCount > 0 && (
        <div style={styles.lessonCount}>{lessonCount} lessons</div>
      )}
    </article>
  );
};

export default CourseCard;