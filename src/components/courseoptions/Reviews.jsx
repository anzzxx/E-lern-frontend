import React from "react";
import { useSelector } from "react-redux";
import { STATIC_URL } from "../../Redux/api";
import styles from "../../styles/Reviews.module.css";

const Reviews = ({ corseId }) => {
  // Enhanced selector with default value
  const { reviews = [] } = useSelector((state) => state.reviews) || {};
  


  // Transform reviews with better error handling
  const transformedReviews = reviews
    ?.filter((review) => {
      const matchesCourse = review.course?.toString() === corseId?.toString();
      
      return matchesCourse;
    })
    ?.map((review) => {
      try {
        return {
          id: review.id,
          name: review.user_details?.username || "Anonymous",
          avatar: getAvatarUrl(review.user_details),
          rating: review.rating || 0,
          comment: review.comment || "No comment provided",
          date: formatReviewDate(review.created_at)
        };
      } catch (error) {
        console.error("Error processing review:", review, error);
        return null;
      }
    })
    ?.filter(Boolean); // Remove any null entries from mapping errors

  console.log("Transformed reviews:", transformedReviews);

  // Helper functions
  function getAvatarUrl(userDetails) {
    if (!userDetails) return "https://i.pravatar.cc/50?img=0";
    
    try {
      if (userDetails.profile) {
        return `${STATIC_URL}${userDetails.profile}`;
      }
      return `https://i.pravatar.cc/50?img=${userDetails.id || 0}`;
    } catch (error) {
      console.error("Error generating avatar URL:", error);
      return "https://i.pravatar.cc/50?img=0";
    }
  }

  function formatReviewDate(dateString) {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", dateString, error);
      return "Unknown date";
    }
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Student Reviews</h2>
      <div className={styles.mainContainer}>
        <div className={`${styles.scrollableContainer} ${styles.listContainer}`}>
          {transformedReviews?.length > 0 ? (
            transformedReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          ) : (
            <p className={styles.noReviews}>
              {reviews?.length ? 
                "No reviews for this course yet." : 
                "No reviews data available."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Extracted as separate component for better readability
const ReviewCard = ({ review }) => (
  <div className={styles.reviewCard}>
    <img
      src={review.avatar}
      alt={review.name}
      className={styles.reviewAvatar}
      onError={(e) => {
        e.target.src = "https://i.pravatar.cc/50?img=0";
      }}
    />
    <div className={styles.reviewContent}>
      <h3 className={styles.reviewName}>{review.name}</h3>
      <p className={styles.reviewDate}>{review.date}</p>
      <div className={styles.reviewRating}>
        {"⭐".repeat(Math.min(5, Math.max(0, review.rating)))}
      </div>
      <p className={styles.reviewComment}>{review.comment}</p>
    </div>
  </div>
);

export default Reviews;