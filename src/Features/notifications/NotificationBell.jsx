import React, { useEffect, useState } from "react";
import { Bell, Check, Trash2, X } from "lucide-react";
import useWebSocket from "../notifications/Notification";
import { useDispatch, useSelector } from "react-redux";
import { clearNotifications } from "../../Redux/Slices/notificationSlice";
import api from "../../Redux/api";

const NotificationBell = () => {
  const dispatch = useDispatch();
  useWebSocket(); // Ensures WebSocket is running

  const notifications = useSelector((state) => state.notifications.list);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  
  // Function to fetch unread notifications
  const fetchNotifications = async () => {
    try {
      const response = await api.get("notifications/unread/");
      setUnreadNotifications(response.data);
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
      setUnreadNotifications([]);
      setIsOpen(false);
    } catch (error) {
      console.error("Error marking notifications as read:", error.response?.data || error.message);
    }
  };

  // Clear all notifications
  const handleClearNotifications = async () => {
    try {
      await api.delete("notifications/clear/");
      dispatch(clearNotifications());
      setUnreadNotifications([]);
    } catch (error) {
      console.error("Error clearing notifications:", error.response?.data || error.message);
    }
  };

  // Styles
  const styles = {
    container: {
      position: 'relative',
      display: 'inline-block',
    },
    bellIcon: {
      position: 'relative',
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '50%',
      transition: 'background-color 0.2s',
      ':hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
      },
    },
    badge: {
      position: 'absolute',
      top: '-5px',
      right: '-5px',
      backgroundColor: '#ff4d4f',
      color: 'white',
      borderRadius: '50%',
      width: '18px',
      height: '18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '10px',
      fontWeight: 'bold',
    },
    dropdown: {
      position: 'absolute',
      right: 0,
      top: 'calc(100% + 10px)',
      width: '350px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      zIndex: 1000,
      overflow: 'hidden',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 16px',
      borderBottom: '1px solid #f0f0f0',
    },
    title: {
      margin: 0,
      fontSize: '16px',
      fontWeight: '600',
    },
    closeButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#666',
    },
    list: {
      maxHeight: '400px',
      overflowY: 'auto',
      margin: 0,
      padding: 0,
      listStyle: 'none',
    },
    notificationItem: {
      padding: '12px 16px',
      borderBottom: '1px solid #f0f0f0',
      transition: 'background-color 0.2s',
      ':hover': {
        backgroundColor: '#f9f9f9',
      },
    },
    emptyState: {
      padding: '16px',
      textAlign: 'center',
      color: '#999',
    },
    footer: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '8px 16px',
      borderTop: '1px solid #f0f0f0',
      backgroundColor: '#fafafa',
    },
    actionButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      background: 'none',
      border: 'none',
      color: '#666',
      cursor: 'pointer',
      fontSize: '13px',
      padding: '6px 8px',
      borderRadius: '4px',
      ':hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
      },
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.bellIcon} onClick={toggleDropdown}>
        <Bell size={24} color="#333" />
        {unreadNotifications.length > 0 && (
          <span style={styles.badge}>{unreadNotifications.length}</span>
        )}
      </div>

      {isOpen && (
        <div style={styles.dropdown}>
          <div style={styles.header}>
            <h3 style={styles.title}>Notifications</h3>
            <button style={styles.closeButton} onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>
          
          <ul style={styles.list}>
            {unreadNotifications.length > 0 ? (
              unreadNotifications.map((notification, index) => (
                <li key={index} style={styles.notificationItem}>
                  <div style={{ fontWeight: '500' }}>{notification.title}</div>
                  <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                    {notification.message}
                  </div>
                  <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
                    {new Date(notification.timestamp).toLocaleString()}
                  </div>
                </li>
              ))
            ) : (
              <li style={styles.emptyState}>No new notifications</li>
            )}
          </ul>
          
          {unreadNotifications.length > 0 && (
            <div style={styles.footer}>
              <button style={styles.actionButton} onClick={handleMarkNotification}>
                <Check size={14} /> Mark all as read
              </button>
              <button style={styles.actionButton} onClick={handleClearNotifications}>
                <Trash2 size={14} /> Clear all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;