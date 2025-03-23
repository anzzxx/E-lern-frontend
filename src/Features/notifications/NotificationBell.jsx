import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import useWebSocket from "../notifications/Notification";
import { useDispatch, useSelector } from "react-redux";
import "../../styles/NotificationBell.css"; // Import the CSS file
import { clearNotifications} from "../../Redux/Slices/notificationSlice";
import api from "../../Redux/api";

const NotificationBell = () => {
  useWebSocket(); // Ensures WebSocket is running
  

  const notifications = useSelector((state) => state.notifications.list);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  
  // Function to fetch unread notifications
  const fetchNotifications = async () => {
    try {
      const response = await api.get("notifications/unread/");
      setUnreadNotifications(response.data); // Update local state
     
    } catch (error) {
      console.error("Error fetching notifications:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);
  useEffect(() => {
    setUnreadNotifications(notifications);
  }, [notifications]);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Mark all notifications as read
  const handleMarkNotification = async () => {
    try {
      await api.put("notifications/mark-read/");
      setUnreadNotifications([]); // Clear unread notifications locally
      setIsOpen(false); // Close dropdown
     
    } catch (error) {
      console.error("Error marking notifications as read:", error.response?.data || error.message);
    }
  };


  

  // Clear all notifications
  const handleClearNotifications = async () => {
    try {
      await api.delete("notifications/clear/");
      dispatch(clearNotifications()); // Clear Redux store
      setUnreadNotifications([]); // Clear local state
    } catch (error) {
      console.error("Error clearing notifications:", error.response?.data || error.message);
    }
  };

  return (
    <div className="notification-container">
      <div className="bell-icon" onClick={toggleDropdown}>
        <Bell size={28} className="icon" />
        {unreadNotifications.length > 0 && (
          <span className="notification-badge">{unreadNotifications.length}</span>
        )}
      </div>

      {isOpen && (
        <div className="notification-dropdown">
          <h3 className="notification-title">Notifications</h3>
          <ul>
            {unreadNotifications.length > 0 ? (
              unreadNotifications.map((notification, index) => (
                <li key={index} className="notification-item">
                  {notification.message}
                </li>
              ))
            ) : (
              <li className="no-notification">No new notifications</li>
            )}
          </ul>
          
          <a onClick={handleMarkNotification} className="notification-action">
            Mark as Read
          </a>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
