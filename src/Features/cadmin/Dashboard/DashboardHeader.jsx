"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { STATIC_URL } from "../../../Redux/api";
import { FiBell, FiChevronDown, FiMenu } from "react-icons/fi";

export default function DashboardHeader({ toggleSidebar }) {
  const { image, name } = useSelector((state) => state.profile);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const defaultImage = "https://cdn.builder.io/api/v1/image/assets/TEMP/b01d550df24f0fe370b9a4bdec09665db8185282?placeholderIfAbsent=true&apiKey=34d728b774e44ebe92ee1866d5dfa190";

  return (
    <header className="dashboard-header">
      <div className="header-left">
       
        <h1 className="page-title">Dashboard</h1>
      </div>
      
      <div className="header-right">
        <button className="notification-btn">
          <FiBell size={20} />
          <span className="notification-badge">3</span>
        </button>
        
        <div 
          className={`profile-dropdown ${isProfileOpen ? 'open' : ''}`}
          onClick={() => setIsProfileOpen(!isProfileOpen)}
        >
          <div className="profile-info">
            <img
              src={image ? `${STATIC_URL}${image}` : defaultImage}
              alt="Profile"
              className="profile-image"
            />
            <span className="profile-name">{name}</span>
            <FiChevronDown className="dropdown-icon" />
          </div>
          
          {isProfileOpen && (
            <div className="dropdown-menu">
              <a href="#" className="dropdown-item">My Profile</a>
              <a href="#" className="dropdown-item">Settings</a>
              <a href="#" className="dropdown-item">Logout</a>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .dashboard-header {
          display: flex;
          width: 85%;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          height: 70px;
          background: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          margin-left:280px;
          z-index: 100;
        }
        
        .header-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        
        .menu-toggle {
          background: none;
          border: none;
          cursor: pointer;
          color: #4c4c4c;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .page-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #333;
          margin: 0;
        }
        
        .header-right {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        
        .notification-btn {
          position: relative;
          background: #f5f5f5;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #4c4c4c;
        }
        
        .notification-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: #ff4757;
          color: white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: bold;
        }
        
        .profile-dropdown {
          position: relative;
          cursor: pointer;
        }
        
        .profile-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .profile-image {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #f0f0f0;
        }
        
        .profile-name {
          font-weight: 500;
          color: #333;
        }
        
        .dropdown-icon {
          transition: transform 0.2s;
        }
        
        .profile-dropdown.open .dropdown-icon {
          transform: rotate(180deg);
        }
        
        .dropdown-menu {
          position: absolute;
          right: 0;
          top: 50px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          width: 200px;
          overflow: hidden;
          z-index: 10;
        }
        
        .dropdown-item {
          display: block;
          padding: 12px 16px;
          color: #555;
          text-decoration: none;
          transition: background 0.2s;
        }
        
        .dropdown-item:hover {
          background: #f9f9f9;
          color: #000;
        }
        
        @media (max-width: 768px) {
          .dashboard-header {
            padding: 0 16px;
          }
          
          .profile-name {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}