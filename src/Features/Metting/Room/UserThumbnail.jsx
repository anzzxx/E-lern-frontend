import React from "react";

function UserThumbnail({
  imageSrc,
  micIconSrc,
  name,
  columnClass,
  isCurrentUser = false,
}) {
  return (
    <div className={columnClass}>
      <div className="thumbnail-container">
        <img
          src={imageSrc}
          alt={`${name}'s video feed`}
          className="thumbnail-image"
        />
        <img src={micIconSrc} alt="Microphone status" className="mic-icon" />
        <div className="user-name">{name}</div>
      </div>

      <style jsx>{`
        .thumbnail-container {
          display: flex;
          flex-direction: column;
          border-radius: 0px;
          position: relative;
          aspect-ratio: ${isCurrentUser ? "1" : "0.993"};
          width: 100%;
          padding: ${isCurrentUser ? "45px 30px 7px" : "7px 30px 7px 6px"};
          ${isCurrentUser ? "align-items: center;" : ""}
          font-family: Poppins, -apple-system, Roboto, Helvetica, sans-serif;
          font-size: 11px;
          color: rgba(255, 255, 255, 1);
          font-weight: 400;
          white-space: nowrap;
        }
        @media (max-width: 991px) {
          .thumbnail-container {
            margin-top: 14px;
            padding-right: 20px;
            ${isCurrentUser ? "padding-left: 20px;" : ""}
            white-space: initial;
          }
        }
        .thumbnail-image {
          position: absolute;
          inset: 0;
          height: 100%;
          width: 100%;
          object-fit: cover;
          object-position: center;
        }
        .mic-icon {
          aspect-ratio: ${isCurrentUser ? "1" : "0.95"};
          object-fit: contain;
          object-position: center;
          width: ${isCurrentUser ? "62px" : "18px"};
          ${isCurrentUser
            ? "box-shadow: 0px 2px 6px rgba(55, 28, 38, 0.5);"
            : ""}
        }
        .user-name {
          position: relative;
          align-self: ${isCurrentUser ? "stretch" : "center"};
          border-radius: ${name === "Sara"
            ? "28px"
            : name === "Jeong"
              ? "18px"
              : "22px"};
          background-color: rgba(2, 15, 33, 0.4);
          margin-top: ${isCurrentUser ? "15px" : "97px"};
          padding: 3px 15px;
          gap: 6px;
        }
        @media (max-width: 991px) {
          .user-name {
            margin-top: ${isCurrentUser ? "initial" : "40px"};
            white-space: initial;
          }
        }
      `}</style>
    </div>
  );
}

export default UserThumbnail;
