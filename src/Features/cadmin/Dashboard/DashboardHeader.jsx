"use client";
import React from "react";
import { useSelector } from "react-redux";
import { STATIC_URL } from "../../../Redux/api";

export default function DashboardHeader() {
  const {image,name}=useSelector((state)=>state.profile)
  console.log("image",image);
  
  const defaultImage="https://cdn.builder.io/api/v1/image/assets/TEMP/b01d550df24f0fe370b9a4bdec09665db8185282?placeholderIfAbsent=true&apiKey=34d728b774e44ebe92ee1866d5dfa190";
  return (
    <header className="dashboard-header">
      <input
        type="search"
        placeholder="Search courses, instructors"
        className="search-input"
      />
      <div className="header-right">
        <div className="profile-section">
          <img
            src={image ? `${STATIC_URL}${image}` : defaultImage}
            alt="Profile"
            className="profile-image"
          />
          <div className="profile-info">
            <h2 className="profile-name">{name}</h2>
            <p className="profile-role">Admin</p>
          </div>
        </div>
        
      </div>

      <style jsx>{`
        .dashboard-header {
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
        }
        .search-input {
          border-radius: 4px;
          background-color: #fafafa;
          border: 1px solid #e6e6e6;
          padding: 12px 52px;
          font-size: 16px;
          color: #4c4c4c;
        }
        .header-right {
          display: flex;
          align-items: center;
          gap: 40px;
        }
        .profile-section {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .profile-image {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }
        .profile-info {
          font-size: 14px;
          line-height: 1;
        }
        .profile-name {
          color: #4c4c4c;
          font-weight: 600;
          margin: 0;
        }
        .profile-role {
          color: #b3b3b3;
          margin: 4px 0 0;
        }
        .notification-btn {
          background-color: #f2f2f2;
          border-radius: 50px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
        }
        @media (max-width: 991px) {
          .search-input {
            padding: 12px 20px;
          }
        }
      `}</style>
    </header>
  );
}