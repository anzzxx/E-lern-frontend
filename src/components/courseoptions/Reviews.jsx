import React from "react";
import { useSelector } from "react-redux";
import "../../styles/reviewandchart.css";
const Reviews = ({ courseId }) => {
  const reviews = useSelector((state) => state.reviews.reviews);

  const transformedReviews = reviews
    ?.filter((review) => review.course === 33)
    ?.map((review) => ({
      id: review.id,
      name: review.user_details.username,
      avatar:
        review.user_details.profile ||
        `https://i.pravatar.cc/50?img=${review.user_details.id}`,
      rating: review.rating,
      comment: review.comment,
      date: new Date(review.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }));

  return (
    <div className="bg-white p-4 rounded shadow" >
      <h2 className="text-xl font-semibold mb-4">Student Reviews</h2>
      <div className="main-container">
        <div className="scrollable-container list-container">
          {transformedReviews.length > 0 ? (
            transformedReviews.map((review) => (
              <div key={review.id} className="review-card">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="review-avatar"
                />
                <div className="review-content">
                  <h3 className="review-name">
                    {review.name.charAt(0).toUpperCase() + review.name.slice(1)}
                  </h3>
                  <p className="review-date">{review.date}</p>
                  <div className="review-rating">
                    {"⭐".repeat(review.rating)}
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="no-reviews">No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
