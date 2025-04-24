import React from 'react';
import { Button, Popconfirm } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';

function ReviewItem({ 
  avatar, 
  name, 
  date, 
  content, 
  rating,
  isOwner,
  onEdit,
  onDelete,
  showMenu,
  onToggleMenu
}) {
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ color: i <= rating ? "#ffc107" : "#e0e0e0" }}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="review-item">
      <div className="review-container">
        <img
          src={avatar}
          className="reviewer-avatar"
          alt={`${name}'s avatar`}
        />
        <div className="review-content">
          <div className="review-header">
            <div className="review-header-left">
              <h3 className="reviewer-name">{name}</h3>
              <div className="review-rating">{renderStars(rating)}</div>
            </div>
            {isOwner && (
              <div className="review-menu-container">
                <Button 
                  type="text"
                  icon={<EllipsisOutlined />}
                  onClick={onToggleMenu}
                  className="review-menu-button"
                />
                {showMenu && (
                  <div className="review-menu-dropdown" onClick={(e) => e.stopPropagation()}>
                    <Button 
                      type="text"
                      className="menu-item"
                      onClick={onEdit}
                    >
                      Edit
                    </Button>
                    <Popconfirm
                      title="Delete this review?"
                      description="Are you sure you want to delete this review?"
                      onConfirm={onDelete}
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
          <span className="review-date">{date}</span>
          <p className="review-text">{content}</p>
        </div>
      </div>

      <style jsx>{`
        .review-item {
          margin-top: 16px;
          width: 100%;
          overflow: visible;
          position: relative;
          min-height: 100px; /* Ensure minimum height */
        }

        .review-container {
          display: flex;
          align-items: start;
          gap: 16px;
          justify-content: start;
          flex-wrap: wrap;
          position: relative;
        }

        .reviewer-avatar {
          aspect-ratio: 1;
          object-fit: contain;
          object-position: center;
          width: 33px;
          border-radius: 0px 0px 0px 0px;
          flex-shrink: 0;
        }

        .review-content {
          min-width: 240px;
          overflow: visible;
          width: 741px;
          position: relative;
          padding-bottom: 20px; /* Add padding to prevent content clipping */
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start; /* Changed to flex-start for better alignment */
          gap: 8px;
          margin-bottom: 4px;
          position: relative;
        }

        .review-header-left {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .reviewer-name {
          color: #3dcbb1;
          font-size: 16px;
          font-weight: 700;
          line-height: 1;
          margin: 0;
        }

        .review-rating {
          font-size: 16px;
          line-height: 1;
        }

        .review-date {
          font-size: 10px;
          display: block;
        }

        .review-text {
          align-self: stretch;
          width: 741px;
          max-width: 100%;
          gap: 4px;
          font-size: 14px;
          line-height: 18px;
          margin: 4px 0 0 0;
        }

        .review-menu-container {
          position: relative;
          display: inline-block;
          z-index: 2; /* Ensure dropdown appears above other elements */
        }

        .review-menu-button {
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .review-menu-dropdown {
          position: absolute;
          right: 0;
          top: 100%;
          background: white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          border-radius: 4px;
          z-index: 10; /* Higher z-index to ensure visibility */
          display: flex;
          flex-direction: column;
          min-width: 100px;
          margin-top: 5px; /* Add some space between button and dropdown */
        }

        .menu-item {
          text-align: left;
          padding: 5px 12px;
          border-radius: 0;
          white-space: nowrap;
        }

        @media (max-width: 991px) {
          .review-item {
            max-width: 100%;
          }

          .review-container {
            max-width: 100%;
          }

          .review-content {
            max-width: 100%;
          }

          .review-text {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

export default ReviewItem;