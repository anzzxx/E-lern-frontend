"use client";
import React, { useEffect } from "react";

const MeetingInterface = ({
  onJoin,
  localVideoRef,
  roomName,
  username,
  localStream,
  isConnecting,
}) => {
  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
      console.log("Stream assigned to MeetingInterface video");
    }
  }, [localStream]);

  return (
    <div className="meeting-container">
      <div className="background-overlay" />
      <main className="meeting-content">
        <section className="video-preview">
          {localStream ? (
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="video-element"
              onLoadedMetadata={() => console.log("MeetingInterface video metadata loaded")}
            />
          ) : (
            <div className="video-placeholder">
              <CameraOffIcon />
              <p>Camera is loading...</p>
            </div>
          )}
        </section>
        <aside className="meeting-sidebar">
          <p className="meeting-id">Room: {roomName}</p>
          <h2 className="meeting-status">
            {username ? `Welcome, ${username}!` : "Ready to Join?"}
          </h2>
          <div className="participants-preview">
            <div className="participant-avatar">
              <UserIcon />
            </div>
            <div className="participant-avatar">
              <UserIcon />
            </div>
          </div>
          <p className="participants-text">Participants waiting</p>
          <button
            className="join-button"
            onClick={onJoin}
            disabled={!localStream || isConnecting}
          >
            {isConnecting ? <span className="loading-spinner" /> : "Join Now"}
          </button>
        </aside>
      </main>
      <style jsx>{`
        .meeting-container {
          position: relative;
          border-radius: 16px;
          background-color: #1a1a1a;
          overflow: hidden;
          min-height: 70vh;
 ежеmax-height: 100vh;
          width: 100%;
          font-family: "Inter", -apple-system, Roboto, Helvetica, sans-serif;
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .background-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #2c3e50 0%, #1a1a1a 100%);
          z-index: 0;
        }
        .meeting-content {
          position: relative;
          display: flex;
          gap: 40px;
          width: 90%;
          max-width: 1200px;
          z-index: 1;
          padding: 40px 0;
        }
        .video-preview {
          flex: 3;
          border-radius: 12px;
          overflow: hidden;
          background-color: #2d2d2d;
          display: flex;
          justify-content: center;
          align-items: center;
          aspect-ratio: 16/9;
          position: relative;
          min-height: 300px; /* Ensure visibility */
        }
        .video-element {
          width: 100%;
          height: 100%;
          object-fit: contain; /* Changed to contain to avoid cropping */
        }
        .video-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          color: #a1a1a1;
        }
        .meeting-sidebar {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 20px;
        }
        .meeting-id {
          font-size: 14px;
          font-weight: 500;
          color: #a1a1a1;
          margin-bottom: 8px;
        }
        .meeting-status {
          font-size: 28px;
          font-weight: 600;
          margin: 20px 0 0;
          line-height: 1.3;
        }
        .participants-preview {
          display: flex;
          gap: 16px;
          margin: 40px 0;
        }
        .participant-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-color: #3a3a3a;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .participants-text {
          font-size: 16px;
          color: #a1a1a1;
          margin: 0;
        }
        .join-button {
          border: none;
          cursor: pointer;
          border-radius: 8px;
          background-color: #2563eb;
          color: white;
          font-size: 16px;
          font-weight: 500;
          padding: 12px 24px;
          margin-top: 40px;
          width: 100%;
          max-width: 200px;
          transition: all 0.2s ease;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
        }
        .join-button:hover {
          background-color: #1d4ed8;
        }
        .join-button:disabled {
          background-color: #3a3a3a;
          cursor: not-allowed;
        }
        .loading-spinner {
          width: 18px;
          height: 18px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        .user-icon,
        .camera-off-icon {
          width: 24px;
          height: 24px;
        }
        @media (max-width: 768px) {
          .meeting-content {
            flex-direction: column;
            gap: 30px;
          }
          .video-preview {
            width: 100%;
          }
          .meeting-sidebar {
            width: 100%;
            padding: 0;
          }
          .participants-preview {
            margin: 30px 0;
          }
        }
      `}</style>
    </div>
  );
};

// Icon components
const UserIcon = () => (
  <svg
    className="user-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const CameraOffIcon = () => (
  <svg
    className="camera-off-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="1" y1="1" x2="23" y2="23"></line>
    <path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 2h4a2 2 0 0 1 2 2v9.34m-7.72-2.06a4 4 0 1 1-5.56-5.56"></path>
  </svg>
);

export default MeetingInterface;