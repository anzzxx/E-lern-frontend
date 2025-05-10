"use client";
import React from "react";
import { useSelector } from 'react-redux';

export default function WelcomeCard() {
  const {name}=useSelector((state)=>state.profile)
  return (
    <section className="welcome-card">
      <div className="content-wrapper">
        <p className="welcome-label">Admin Dashboard</p>
        <h1 className="welcome-title">{`Welcome, ${name}! Manage Platform`}</h1>
        <p className="welcome-subtitle">Monitor and manage your e-learning platform efficiently</p>
        <br />
      </div>
      <div className="image-container">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/baeb6f6039bd369892cf19882fcf6a92e664282c?placeholderIfAbsent=true&apiKey=34d728b774e44ebe92ee1866d5dfa190"
          className="welcome-image"
          alt="E-Learning Platform Illustration"
        />

      </div>


      <style jsx>{`
        .welcome-card {
          align-self: stretch;
          border-radius: 16px;
          background: linear-gradient(135deg, #702dff 0%, #8a5cff 100%);
          display: flex;
          max-width: 1240px;
          height: 150px;
          padding: 20px 24px;
          align-items: center;
          gap: 24px;
          box-shadow: 0 4px 12px rgba(112, 45, 255, 0.2);
          position: relative;
          overflow: hidden;
        }
        
        .content-wrapper {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          flex: 1;
          min-width: 0;
          z-index: 2;
        }
        
        .welcome-label {
          color: rgba(255, 255, 255, 0.9);
          font-family: Inter, -apple-system, Roboto, Helvetica, sans-serif;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
          margin: 0 0 4px 0;
          letter-spacing: 0.5px;
        }
        
        .welcome-title {
          color: #fff;
          font-family: Inter, -apple-system, Roboto, Helvetica, sans-serif;
          font-size: 20px;
          font-weight: 700;
          margin: 0;
          line-height: 1.3;
        }
        
        .welcome-subtitle {
          color: rgba(255, 255, 255, 0.8);
          font-family: Inter, -apple-system, Roboto, Helvetica, sans-serif;
          font-size: 12px;
          font-weight: 400;
          margin: 6px 0 12px 0;
          line-height: 1.4;
        }
        
        .cta-button {
          align-items: center;
          border-radius: 24px;
          background-color: #fff;
          display: flex;
          height: 36px;
          padding: 0 16px;
          gap: 8px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .cta-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        .button-text {
          color: #702dff;
          font-family: Inter, -apple-system, Roboto, Helvetica, sans-serif;
          font-size: 12px;
          font-weight: 600;
        }
        
        .play-icon-wrapper {
          border-radius: 50%;
          background-color: #702dff;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 20px;
          width: 20px;
          padding: 0;
        }
        
        .image-container {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          z-index: 1;
        }
        
        .welcome-image {
          height: 100px;
          width: auto;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
        }
        
        @media (max-width: 768px) {
          .welcome-card {
            padding: 16px;
            gap: 16px;
            height: 140px;
          }
          
          .welcome-title {
            font-size: 18px;
          }
          
          .welcome-image {
            height: 80px;
          }
        }
        
        @media (max-width: 480px) {
          .welcome-card {
            flex-direction: column;
            height: auto;
            padding: 20px 16px;
            text-align: center;
            align-items: center;
          }
          
          .content-wrapper {
            align-items: center;
          }
          
          .welcome-image {
            height: 60px;
            margin-top: 10px;
          }
        }
      `}</style>
    </section>
  );
}