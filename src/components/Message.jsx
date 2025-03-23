import React, { useState,useEffect } from "react";
import "../styles/message.css"; // Import the CSS for styling


const Message = ({ message, duration = 5000, type = "success", onHide }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-hide the message after `duration` milliseconds
    if (duration) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onHide?.(); // Call the onHide function if provided
      }, duration);

      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [duration, onHide]);

  // Hide the message when the close button is clicked
  const handleClose = () => {
    setIsVisible(false);
    onHide?.(); // Call the onHide function if provided
  };

  if (!isVisible) return null; // Don't render if not visible

  return (
    <div className={`message-box ${type}`}>
      <span>{message}</span>
      <button className="close-btn" onClick={handleClose}>
        &times;
      </button>
    </div>
  );
};

export default Message;