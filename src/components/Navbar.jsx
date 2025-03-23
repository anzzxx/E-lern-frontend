import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/navbar.css";
import NotificationBell from "../Features/notifications/NotificationBell";

const Navbar = ({ isAuthenticated, isStaff, isSuperuser }) => {
  const location = useLocation(); // Detects URL changes


  useEffect(() => {
    // This forces re-render when the route changes
  }, [location.pathname]);
  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Left Section: E-LERN Logo & Menu Links */}
        <div className="nav-left">
          <h1 className="navbar-logo">E-LERN</h1>
          <ul className="navbar-links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/courses">Courses</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <Link to="/messages">Mesaages</Link>
            </li>
            {isSuperuser ? (
              <li>
                <Link to="/admin-panel">Admin Panel</Link>
              </li>
            ) : isStaff ? (
              <li>
                <Link to="/instructor">Instructor Panel</Link>
              </li>
            ) : isAuthenticated ? (
              <li>
                <Link to="/become-instructor">Teach On E-LERN</Link>
              </li>
            ) : (
              <li>
                <Link to="/login">Login</Link>
              </li>
            )}

          </ul>
        </div>

        {/* Right Section: Notification Icon */}
        <div className="nav-right">
          {(isSuperuser || isStaff || isAuthenticated) && (
            <div className="navbar-notification">
              <NotificationBell />
            </div>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
