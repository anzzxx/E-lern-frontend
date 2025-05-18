import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {STATIC_URL} from "../Redux/api"
import { jwtDecode } from "jwt-decode";
import NotificationBell from "../Features/notifications/NotificationBell";
import "../styles/navbar.css";

const Navbar = () => {
  const token = useSelector((state) => state.auth.accessToken);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const {image}=useSelector((state)=>state.profile)
  
  
  // Initialize search term from URL if on search page
  useEffect(() => {
    if (location.pathname === '/search') {
      const searchParams = new URLSearchParams(location.search);
      const query = searchParams.get('q');
      if (query) {
        setSearchTerm(query);
      }
    }
  }, [location]);

  // Authentication logic
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsAuthenticated(true);
        setIsStaff(decoded.is_staff);
        setIsSuperuser(decoded.is_superuser);
      } catch (error) {
        console.error("Invalid token:", error);
        setIsAuthenticated(false);
        setIsStaff(false);
        setIsSuperuser(false);
      }
    } else {
      setIsAuthenticated(false);
      setIsStaff(false);
      setIsSuperuser(false);
    }

    const handleStorageChange = () => {
      if (!localStorage.getItem("accessToken")) {
        setIsAuthenticated(false);
        setIsStaff(false);
        setIsSuperuser(false);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [token]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <nav className="navbar-light-logged-in">
      <div className="navbar-container">
        <div className="navbar-content">
          {/* Logo */}
          <Link to="/" className="logo">
            <div className="logo-circle">
              <div className="logo-letter">E</div>
            </div>
            <h1 className="logo-text">E-LERN</h1>
          </Link>

          {/* Browse Menu */}
          {isAuthenticated && (
            <div className="navbar-menu">
              <Link to="/" className="menu-link">Home</Link>
              <Link to="/courses" className="menu-link">Courses</Link>
              <Link to="/profile" className="menu-link">Profile</Link>
              <Link to="/messages" className="menu-link">Messages</Link>
              {isSuperuser && (
                <Link to="/admin-panel" className="menu-link">Admin Panel</Link>
              )}
              {isStaff && !isSuperuser && (
                <Link to="/instructor" className="menu-link">Instructor Panel</Link>
              )}
            </div>
          )}

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="search-container">
            <input
              type="text"
              placeholder="Search courses..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search courses"
            />
            <button type="submit" className="search-icon-button">
              <img 
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/d71edea7cebcfb7b698734768df40ffd6dc9211b?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c" 
                alt="Search" 
                className="search-icon" 
              />
            </button>
          </form>

          {/* Actions */}
          <div className="actions-container">
            {isAuthenticated ? (
              <>
                {!isStaff && !isSuperuser && (
                  <Link to="/become-instructor" className="instructor-button">
                    Teach On E-LERN
                  </Link>
                )}
                <div className="navbar-notification">
                  <NotificationBell />
                </div>
                <Link to="/profile" className="avatar-button">
                  <img
                    src={image?`${STATIC_URL}${image}`:"https://cdn.builder.io/api/v1/image/assets/TEMP/53a4a16eeaca6c3e420331f5abdb865ae3ce232e?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c"}
                    alt="User avatar"
                    className="avatar-icon"
                  />
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="instructor-button">
                  Login
                </Link>
                <Link to="/signup" className="instructor-button">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;