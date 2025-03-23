import React, { useState } from 'react';
import api from '../../Redux/api';
import Reusablesidebar from "../../components/Reusablesidebar";
import { handleLogout } from "../../components/Logout";
import '../../styles/login.css';

function SendNotification() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await api.post('notifications/create/', { message });
      setSuccess('Notification sent successfully!');
      setMessage('');
    } catch (err) {
      setError('Failed to send notification');
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { label: "Dashboard", path: "/instructor/" },
    { label: "Courses", path: "/instructor/course" },
    { label: "Lessons", path: "/instructor/lessons" },
    { label: "Notification", path: "/instructor/notification" },
    { label: "MCQ-Test", path: "/instructor/mcq-test" },
    { label: "Logout", onClick: handleLogout },
  ];

  return (
    <>
      <Reusablesidebar title="E-LEARN" menuItems={menuItems} />
      <div className="login-container">
        <div className="form-box">
          <h2>Send Notification</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <label>Message</label>
              <input
                type="text"
                required
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Submit'}
            </button>
          </form>

          {success && <p className="success-message">{success}</p>}
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </>
  );
}

export default SendNotification;
