import React from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const token = localStorage.getItem("accessToken");
  let isAuthenticated = false;
  let isStaff = false;
  let isSuperuser = false;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      isAuthenticated = true;
      isStaff = decoded.is_staff;
      isSuperuser = decoded.is_superuser;
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

  // ❌ If user is superuser OR staff, don't render the navbar at all
  if (isSuperuser || isStaff) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <h1>E-LERN</h1> {/* Replace with your logo or app name */}
        </div>
        <ul className="navbar-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/courses">Courses</Link>
          </li>

          {isAuthenticated ? (
            <>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <Link to="/become-instructor">Teach On E-LERN</Link>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login">Login</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
