import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/instsidebar.css";
import { handleLogout } from "../components/Logout";
function InstSidebar() {
  const navigate = useNavigate();

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">E-LERN</h2>
      <ul className="sidebar-menu">
        <li className="sidebar-item" onClick={() => navigate("/dashboard")}>Dashboard</li>
        <li className="sidebar-item" onClick={() => navigate("course/")}>Courses</li>
        <li className="sidebar-item" onClick={() => navigate("/category")}>Category</li>
        <li className="sidebar-item" onClick={() => navigate("/lessons")}>Lessons</li>
        <li className="sidebar-item" onClick={() => navigate("/messages")}>Messages</li>
        <li className="sidebar-item" onClick={() => navigate("/payment")}>Payment</li>
        <li className="sidebar-item" onClick={() => navigate("/notifications")}>Notification</li>
        <li className="sidebar-item" onClick={handleLogout}>Logout</li>
      </ul>
    </div>
  );
}

export default InstSidebar;
