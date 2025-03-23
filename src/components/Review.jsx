import React, { useEffect, useState, useCallback } from "react";
import "../styles/review.css";
import { useDispatch, useSelector } from "react-redux";
import api from '../Redux/api';
import { useParams } from "react-router-dom";
import { fetchReviews } from "../Redux/Slices/reviewSlice";

const ShowReview = () => {
  const { id } = useParams();
  const courseId = Number(id); // Convert id to a number
  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.reviews.reviews);
  const [rating, setRating] = useState(0); // State for star rating
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const IsAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const BASE_URL="http://127.0.0.1:8000"
  // Find if user is enrolled
  const user = useSelector((state) => state.auth.user);
  const userId = user ? user.id : null;

  const { data } = useSelector((state) => state.enrollments);
  const filteredEnrollments = userId
    ? data?.filter((enrollment) => enrollment.user.id === userId)
    : [];

  const enrolledCourses = filteredEnrollments?.map((enrollment) => enrollment.course);
  const Enrolled = enrolledCourses.some(course => course.id === courseId); // Fix: Convert courseId to number

  // Function to handle star click
  const handleStarClick = (index) => {
    setRating(index + 1);
  };

  // Handle review submission
  const handleSubmit = useCallback(async () => {
    if (!rating || !comment) {
      alert("Please enter a rating and comment.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("reviews/create/", {
        course: courseId,
        rating: rating, // Use the selected star rating
        comment: comment,
      });

      console.log("Review submitted:", response.data);
      alert("Review submitted successfully!");

      // Clear input fields
      setRating(0);
      setComment("");

      // Fetch reviews again to update the list
      dispatch(fetchReviews());
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [rating, comment, courseId, dispatch]);

  // Fetch reviews when the component mounts
  useEffect(() => {
    dispatch(fetchReviews());
  }, [dispatch]);

  // Transform reviews for display
  console.log(reviews);
  
  const transformedReviews = reviews
    .filter((review) => review.course === courseId) // Filter reviews for the current course
    .map((review) => ({
      id: review.id,
      name: review.user_details.username,
      avatar:
      review.user_details.profile
        ? `${BASE_URL}${review.user_details.profile}` // Use BASE_URL + profile path
        : `https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250`, // Default Gravatar
      rating: review.rating,
      comment: review.comment,
      date: new Date(review.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }));

  return (
    <div className="review-container">
      <h2 className="review-title">Student Reviews</h2>

      {/* Show review post box only if user is authenticated and enrolled */}
      {IsAuthenticated && Enrolled && (
        <div className="review-post-box">
          <textarea
            className="review-input"
            placeholder="Write your review..."
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
          <div className="review-post-actions">
            {/* Star Rating System */}
            <div className="star-rating">
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  className={`star ${index < rating ? "selected" : ""}`}
                  onClick={() => handleStarClick(index)}
                >
                  ★
                </span>
              ))}
            </div>
            <button className="review-submit-button" onClick={handleSubmit} disabled={loading}>
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </div>
      )}

      {/* Scrollable Reviews Section */}
      <div className="reviews-scrollable">
        {transformedReviews.length > 0 ? (
          transformedReviews.map((review) => (
            <div key={review.id} className="review-card">
              <img src={review.avatar} alt={review.name} className="review-avatar" />
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
  );
};

export default ShowReview;