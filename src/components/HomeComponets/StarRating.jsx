import React from "react";

const StarRating = ({ rating, reviewCount }) => {
  // Convert rating to number and clamp between 0-5
  const numericRating = Math.min(Math.max(Number(rating) || 0, 0), 5);
  const fullStars = Math.floor(numericRating);
  const hasHalfStar = numericRating % 1 >= 0.5;

  // Styles object
  const styles = {
    ratingWrapper: {
      display: "flex",
      alignItems: "center",
      gap: "4px"
    },
    star: {
      display: "flex",
      width: "16px",
      height: "16px"
    },
    reviewCount: {
      color: "#1b1b1b99",
      fontSize: "14px",
      marginLeft: "4px"
    }
  };

  const StarIcon = ({ filled, half = false }) => (
    <svg 
      width="16" 
      height="16" 
      viewBox="0 0 16 16" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={styles.star}
    >
      <path 
        d="M8.00006 11.6798L10.7667 13.3531C11.2734 13.6598 11.8934 13.2064 11.7601 12.6331L11.0267 9.48643L13.4734 7.36643C13.9201 6.97976 13.6801 6.24643 13.0934 6.19976L9.87339 5.92643L8.61339 2.9531C8.38672 2.4131 7.61339 2.4131 7.38672 2.9531L6.12672 5.91976L2.90672 6.1931C2.32006 6.23976 2.08006 6.9731 2.52672 7.35976L4.97339 9.47976L4.24006 12.6264C4.10672 13.1998 4.72672 13.6531 5.23339 13.3464L8.00006 11.6798Z" 
        fill={filled ? "#FFD130" : "#D3D3D3"}
      />
      {half && (
        <path 
          d="M8 11.68V2.953L9.26 5.92L12.48 6.193C13.067 6.24 13.307 6.973 12.86 7.36L10.413 9.48L11.147 12.626C11.28 13.2 10.66 13.653 10.153 13.347L8 11.68Z" 
          fill="#FFD130"
        />
      )}
    </svg>
  );

  return (
    <div style={styles.ratingWrapper}>
      {/* Full stars */}
      {[...Array(fullStars)].map((_, i) => (
        <StarIcon key={`full-${i}`} filled />
      ))}
      
      {/* Half star */}
      {hasHalfStar && <StarIcon key="half" half />}
      
      {/* Empty stars */}
      {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
        <StarIcon key={`empty-${i}`} filled={false} />
      ))}
      
      {/* Review count */}
      {reviewCount && (
        <span style={styles.reviewCount}>
          ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  );
};

export default StarRating;