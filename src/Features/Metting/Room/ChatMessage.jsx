import React from "react";

function ChatMessage({
  avatarSrc,
  name,
  time,
  message,
  nameColor = "#020f21",
  isCurrentUser = false,
}) {
  return (
    <article
      className={`message-container ${isCurrentUser ? "current-user" : ""}`}
    >
      <img src={avatarSrc} alt={`${name}'s avatar`} className="avatar" />
      <div
        className={`message-bubble ${isCurrentUser ? "current-user-bubble" : ""}`}
      >
        <div className="message-content">
          <header className="message-header">
            <h3
              className="sender-name"
              style={{ color: isCurrentUser ? "#f9fafb" : nameColor }}
            >
              {name}
            </h3>
            <time
              className="message-time"
              style={{ color: isCurrentUser ? "#f9fafb" : "#b9bec6" }}
            >
              {time}
            </time>
          </header>
          <p
            className="message-text"
            style={{ color: isCurrentUser ? "#fff" : "#020f21" }}
          >
            {message}
          </p>
        </div>
      </div>

      <style jsx>{`
        .message-container {
          display: flex;
          margin-top: 24px;
          align-items: stretch;
          gap: 13px;
        }
        .message-container.current-user {
          margin-top: 24px;
        }
        .avatar {
          aspect-ratio: ${name === "Tomas" ||
          name === "Anna" ||
          name === "You" ||
          name === "Jessica"
            ? "0.98"
            : "1"};
          object-fit: contain;
          object-position: center;
          width: 43px;
          align-self: start;
          flex-shrink: 0;
        }
        .message-bubble {
          border-radius: 6.195px;
          background-color: #fff;
          padding: 6px 12px 7px;
        }
        .message-bubble.current-user-bubble {
          background-color: #176dee;
        }
        .message-content {
          width: 100%;
          max-width: 159px;
        }
        .message-header {
          display: flex;
          width: 100%;
          align-items: stretch;
          gap: 20px;
          white-space: nowrap;
          justify-content: space-between;
        }
        @media (max-width: 991px) {
          .message-header {
            white-space: initial;
          }
        }
        .sender-name {
          margin: 0;
          font-size: 9px;
          font-weight: 400;
        }
        .message-time {
          text-align: right;
          font-size: 9px;
          font-weight: 400;
        }
        .message-text {
          margin: 0;
          font-size: 9px;
          font-weight: 400;
        }
      `}</style>
    </article>
  );
}

export default ChatMessage;
