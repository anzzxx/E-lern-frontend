import React, { useEffect, useState, useCallback } from "react";
import {STATIC_URL} from "../Redux/api";
import { useDispatch, useSelector } from "react-redux";
import api from '../Redux/api';
import { useParams } from "react-router-dom";
import { fetchReviews } from "../Redux/Slices/reviewSlice";
import { Button, Popconfirm, message } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import "../styles/review.css";
const ShowReview = () => {
  const { id } = useParams();
  const courseId = Number(id);
  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.reviews.reviews);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(0);
  const [openMenuId, setOpenMenuId] = useState(null);

  const IsAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  
  
  const user = useSelector((state) => state.auth.user);
  const userId = user ? user.id : null;

  const { courses } = useSelector((state) => state.enrollments);
  const Enrolled = courses?.some(course => course.id.toString() === id) || false;

  // Toggle menu visibility
  const toggleMenu = (reviewId, e) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === reviewId ? null : reviewId);
  };

  // Close menu when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenuId(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Star rating handlers
  const handleStarClick = (index) => setRating(index + 1);
  const handleEditStarClick = (index) => setEditRating(index + 1);

  // Review submission
  const handleSubmit = useCallback(async () => {
    if (!rating || !comment) {
      message.warning("Please enter a rating and comment.");
      return;
    }

    setLoading(true);
    try {
      await api.post("reviews/create/", {
        course: courseId,
        rating: rating,
        comment: comment,
      });

      message.success("Review submitted successfully!");
      setRating(0);
      setComment("");
      dispatch(fetchReviews());
    } catch (error) {
      console.error("Error submitting review:", error);
      message.error("Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [rating, comment, courseId, dispatch]);

  // Review update
  const handleUpdate = async (reviewId) => {
    if (!editRating || !editComment) {
      message.warning("Please enter a rating and comment.");
      return;
    }

    try {
      await api.put(`reviews/edit-update/${reviewId}/`, {
        course: courseId,
        rating: editRating,
        comment: editComment,
      });

      message.success("Review updated successfully!");
      setEditingReviewId(null);
      setEditComment("");
      setEditRating(0);
      dispatch(fetchReviews());
    } catch (error) {
      console.error("Error updating review:", error);
      message.error("Failed to update review. Please try again.");
    }
  };

  // Review deletion
  const handleDelete = async (reviewId) => {
    try {
      await api.delete(`reviews/edit-update/${reviewId}/`);
      message.success("Review deleted successfully!");
      dispatch(fetchReviews());
    } catch (error) {
      console.error("Error deleting review:", error);
      message.error("Failed to delete review. Please try again.");
    }
  };

  // Start editing a review
  const startEditing = (review) => {
    setEditingReviewId(review.id);
    setEditComment(review.comment);
    setEditRating(review.rating);
    setOpenMenuId(null);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingReviewId(null);
    setEditComment("");
    setEditRating(0);
  };

  // Fetch reviews on mount
  useEffect(() => {
    dispatch(fetchReviews());
  }, [dispatch]);

  // Transform reviews data
  const transformedReviews = reviews
    .filter((review) => review.course === courseId)
    .map((review) => ({
      id: review.id,
      name: review.user_details.username,
      userId: review.user_details.id,
      avatar: review.user_details.profile
        ? `${STATIC_URL}${review.user_details.profile}`
        : `https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250`,
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

      {/* Review submission form */}
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
            <Button 
              type="primary"
              onClick={handleSubmit} 
              loading={loading}
            >
              {loading ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </div>
      )}

      {/* Reviews list */}
      <div className="reviews-scrollable">
        {transformedReviews.length > 0 ? (
          transformedReviews.map((review) => (
            <div key={review.id} className="review-card">
              <img src={review.avatar} alt={review.name} className="review-avatar" />
              <div className="review-content">
                <div className="review-header">
                  <h3 className="review-name">
                    {review.name.charAt(0).toUpperCase() + review.name.slice(1)}
                  </h3>
                  {review.userId === userId && (
                    <div className="review-menu-container">
                      <Button 
                        type="text"
                        icon={<EllipsisOutlined />}
                        onClick={(e) => toggleMenu(review.id, e)}
                        className="review-menu-button"
                      />
                      {openMenuId === review.id && (
                        <div className="review-menu-dropdown" onClick={(e) => e.stopPropagation()}>
                          <Button 
                            type="text"
                            className="menu-item"
                            onClick={() => startEditing(review)}
                          >
                            Edit
                          </Button>
                          <Popconfirm
                            title="Delete this review?"
                            description="Are you sure you want to delete this review?"
                            onConfirm={() => handleDelete(review.id)}
                            okText="Yes"
                            cancelText="No"
                          >
                            <Button 
                              type="text"
                              danger
                              className="menu-item"
                            >
                              Delete
                            </Button>
                          </Popconfirm>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <p className="review-date">{review.date}</p>
                
                {editingReviewId === review.id ? (
                  <>
                    <div className="star-rating">
                      {[...Array(5)].map((_, index) => (
                        <span
                          key={index}
                          className={`star ${index < editRating ? "selected" : ""}`}
                          onClick={() => handleEditStarClick(index)}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <textarea
                      className="review-input edit-comment"
                      value={editComment}
                      onChange={(e) => setEditComment(e.target.value)}
                      rows="3"
                    />
                    <div className="edit-actions">
                      <Button 
                        type="primary"
                        onClick={() => handleUpdate(review.id)}
                      >
                        Save
                      </Button>
                      <Button 
                        onClick={cancelEditing}
                        style={{ marginLeft: 8 }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="review-rating">
                      {"⭐".repeat(review.rating)}
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </>
                )}
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