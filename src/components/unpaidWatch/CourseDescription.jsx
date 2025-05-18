import React, { useEffect, useState, useCallback } from "react";
import ReviewItem from "./ReviewItem";
import {STATIC_URL} from "../../Redux/api";
import { useSelector, useDispatch } from "react-redux";
import { Button, Popconfirm, message } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import api from '../../Redux/api';
import { fetchReviews } from "../../Redux/Slices/reviewSlice";

function CourseDescription({ selectedCourse }) {
  const dispatch = useDispatch();
  const { courses } = useSelector((state) => state.enrollments);
  const Enrolled = courses?.some((course) => course.id === selectedCourse.id) || false;
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const userId = user ? user.id : null;
  
  const reviews = useSelector((state) => state.reviews.reviews);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editComment, setEditComment] = useState("");
  const [editRating, setEditRating] = useState(0);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(2);

  const avatar = "https://cdn.builder.io/api/v1/image/assets/TEMP/caa5444b73f7b5237790d16380f02d528ae66762?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c";

  useEffect(() => {
    dispatch(fetchReviews());
  }, [dispatch]);

  const handleStarClick = (index) => setRating(index + 1);
  const handleEditStarClick = (index) => setEditRating(index + 1);

  const handleSubmit = useCallback(async () => {
    if (!rating || !comment) {
      message.warning("Please enter a rating and comment.");
      return;
    }

    setLoading(true);
    try {
      await api.post("reviews/create/", {
        course: selectedCourse.id,
        rating: rating,
        comment: comment,
      });

      message.success("Review submitted successfully!");
      setRating(0);
      setComment("");
      dispatch(fetchReviews());
      // Reset visible count to show the newly added review
      setVisibleReviewsCount(2);
    } catch (error) {
      console.error("Error submitting review:", error);
      message.error("Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [rating, comment, selectedCourse.id, dispatch]);

  const handleUpdate = async (reviewId) => {
    if (!editRating || !editComment) {
      message.warning("Please enter a rating and comment.");
      return;
    }

    try {
      await api.put(`reviews/edit-update/${reviewId}/`, {
        course: selectedCourse.id,
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

  const handleDelete = async (reviewId) => {
    try {
      await api.delete(`reviews/edit-update/${reviewId}/`);
      message.success("Review deleted successfully!");
      dispatch(fetchReviews());
      // Reset visible count after deletion
      setVisibleReviewsCount(2);
    } catch (error) {
      console.error("Error deleting review:", error);
      message.error("Failed to delete review. Please try again.");
    }
  };

  const startEditing = (review) => {
    setEditingReviewId(review.id);
    setEditComment(review.comment);
    setEditRating(review.rating);
    setOpenMenuId(null);
  };

  const cancelEditing = () => {
    setEditingReviewId(null);
    setEditComment("");
    setEditRating(0);
  };

  const toggleMenu = (reviewId, e) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === reviewId ? null : reviewId);
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenuId(null);
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const transformedReviews = reviews
    .filter((review) => review.course === selectedCourse.id)
    .map((review) => ({
      id: review.id,
      username: review.user_details.username,
      userId: review.user_details.id,
      profile: review.user_details.profile
        ? `${STATIC_URL}${review.user_details.profile}`
        : `https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?s=250`,
      rating: review.rating,
      comment: review.comment,
      created_at: new Date(review.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    }));

  const visibleReviews = transformedReviews.slice(0, visibleReviewsCount);
  const hasMoreReviews = transformedReviews.length > visibleReviews.length;

  const loadMoreReviews = () => {
    setVisibleReviewsCount(prev => prev + 5); // Load 5 more reviews
  };

  return (
    <article className="course-description">
      <nav className="tabs-navigation">
        <span className="tab">Description</span>
        <div className="active-tab-container">
          <span className="tab active">Courses</span>
          <div className="active-indicator" />
        </div>
        <span className="tab">Review</span>
      </nav>

      <h2 className="section-title">About Course</h2>
      <p className="description-text">
        {selectedCourse.description}
      </p>

      <h2 className="section-title review-title">Review</h2>
      
      {isAuthenticated && Enrolled && (
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

      {visibleReviews.length > 0 ? (
        visibleReviews.map((review) => (
          <div key={review.id} className="review-item-container">
            {editingReviewId === review.id ? (
              <div className="edit-review-container">
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
                  className="edit-review-input"
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
              </div>
            ) : (
              <ReviewItem
                key={review.id}
                avatar={review.profile || avatar}
                name={review.username}
                date={review.created_at}
                content={review.comment}
                rating={review.rating}
                isOwner={review.userId === userId}
                onEdit={() => startEditing(review)}
                onDelete={() => handleDelete(review.id)}
                showMenu={openMenuId === review.id}
                onToggleMenu={(e) => toggleMenu(review.id, e)}
              />
            )}
          </div>
        ))
      ) : (
        <p className="no-reviews">No reviews yet.</p>
      )}

      {hasMoreReviews && (
        <button className="load-more-button" onClick={loadMoreReviews}>
          <span className="button-text">Load more reviews</span>
        </button>
      )}

      <style jsx>{`
        .course-description {
          display: flex;
          width: 100%;
          flex-direction: column;
          align-items: stretch;
          font-family:
            Gilroy,
            -apple-system,
            Roboto,
            Helvetica,
            sans-serif;
          color: #1b1b1b;
          font-weight: 400;
        }

        .tabs-navigation {
          align-self: start;
          display: flex;
          align-items: stretch;
          gap: 32px;
          font-size: 16px;
          color: rgba(0, 0, 0, 1);
          white-space: nowrap;
        }

        .tab {
          cursor: pointer;
        }

        .active-tab-container {
          display: flex;
          flex-direction: column;
        }

        .active-indicator {
          background-color: #c5322a;
          display: flex;
          margin-top: 4px;
          width: 62px;
          flex-shrink: 0;
          height: 2px;
        }

        .section-title {
          color: #000;
          font-size: 16px;
          font-weight: 700;
          line-height: 1;
          align-self: start;
          margin: 24px 0 0 0;
        }

        .review-title {
          margin-top: 33px;
        }

        .description-text {
          font-size: 16px;
          line-height: 24px;
          margin-top: 16px;
        }

        .review-post-box {
          margin-top: 16px;
          width: 100%;
        }

        .review-input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          resize: vertical;
          font-family: inherit;
          margin-bottom: 12px;
        }

        .review-post-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .star-rating {
          display: inline-block;
        }

        .star {
          font-size: 24px;
          color: #ccc;
          cursor: pointer;
          margin-right: 4px;
        }

        .star.selected {
          color: #ffc107;
        }

        .no-reviews {
          text-align: center;
          color: #666;
          margin: 20px 0;
        }

        .review-item-container {
          margin: 16px 0;
        }

        .edit-review-container {
          padding: 16px;
          border: 1px solid #eee;
          border-radius: 4px;
          margin-bottom: 16px;
        }

        .edit-review-input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          resize: vertical;
          font-family: inherit;
          margin: 12px 0;
        }

        .edit-actions {
          display: flex;
          justify-content: flex-end;
        }

        .load-more-button {
          align-items: center;
          border-radius: 3px;
          align-self: center;
          display: flex;
          margin-top: 24px;
          padding: 8px 16px;
          flex-direction: column;
          overflow: hidden;
          font-size: 12px;
          font-weight: 700;
          line-height: 1;
          justify-content: center;
          background: transparent;
          border: 1px solid #1b1b1b;
          color: #1b1b1b;
          cursor: pointer;
        }

        .load-more-button:hover {
          background-color: #f5f5f5;
        }

        .button-text {
          align-self: stretch;
          gap: 8px;
          overflow: hidden;
        }

        @media (max-width: 991px) {
          .course-description {
            max-width: 100%;
          }

          .tabs-navigation {
            white-space: initial;
          }

          .description-text {
            max-width: 100%;
          }
        }
      `}</style>
    </article>
  );
}

export default CourseDescription;