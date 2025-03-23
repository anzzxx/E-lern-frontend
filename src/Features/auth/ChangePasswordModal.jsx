import React, { useState, useEffect } from "react";
import api from "../../Redux/api";
import '../../styles/changepassword.css';
import {handleLogout} from '../../components/Logout'
const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentPassword("");
      setNewPassword("");
      setError("");
      setSuccessMessage("");
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!currentPassword || !newPassword) {
      setError("All fields are required.");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post("api/change-password/", {
        current_password: currentPassword,
        new_password: newPassword,
      });

      if (response.status === 200) {
        setSuccessMessage("Password changed successfully!");
        setTimeout(() => {
          setSuccessMessage("");
          onClose();
          handleLogout();
        }, 2000);
      }
    } catch (error) {
      setError(error.response?.data?.error || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Change Password</h2>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <div className="input-box">
          <label>Current Password</label>
          <input 
            type="password" 
            className="login-input" 
            placeholder="Enter current password" 
            value={currentPassword} 
            onChange={(e) => setCurrentPassword(e.target.value)} 
          />
        </div>
        <div className="input-box">
          <label>New Password</label>
          <input 
            type="password" 
            className="login-input" 
            placeholder="Enter new password" 
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)} 
          />
        </div>
        
        <button className={`submit-btn ${isSubmitting ? "loading" : ""}`} onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? <div className="loader"></div> : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default ChangePasswordModal;