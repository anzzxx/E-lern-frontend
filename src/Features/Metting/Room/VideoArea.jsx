"use client";
import React from "react";
import ControlBar from "./ControlBar";
import UserThumbnail from "./UserThumbnail";

function VideoArea({ video, ref }) {
  return (
    <main className="video-area">
      <header className="meeting-header">
        <div className="meeting-info">
          <h1 className="meeting-title">Product design weekly meeting</h1>
          <div className="meeting-details">
            <time className="meeting-date">30 May 2022</time>
            <p className="recording-info">Recording 26:32</p>
          </div>
        </div>
        <button className="share-link-button">Share meeting link</button>
      </header>

      <div className="main-video-container" ref={ref}>
        {/* <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/741da205834db675ea69125ddefbecb02f99bb88?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c" alt="Main video feed" className="main-video" /> */}
        <video
          ref={video}
          autoPlay
          muted
          playsInline
          className="main-video"
        />
        <div className="speaker-name">Binna</div>
      </div>

      <section className="participants-grid">
        <div className="participants-row">
          <UserThumbnail
            imageSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/09b11ab1103567216e245a642b600eee5b5c674b?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c"
            micIconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/603d2eb93c5ec94db42d2acf1e7fbc63c66aa001?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c"
            name="Sara"
            columnClass="participant-column"
          />
          <UserThumbnail
            imageSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/5a446400f18525554db782fc220eff2f00852074?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c"
            micIconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/67aae7ff1174043d9b25914b55b03ffd6acb8b07?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c"
            name="Jeong"
            columnClass="participant-column"
          />
          <UserThumbnail
            imageSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/581bbddb602492c3bb4be229c9d31d4cb1157c77?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c"
            micIconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/11c3044a6c0ab954d7886358d853658f9325573b?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c"
            name="John"
            columnClass="participant-column"
          />
          <UserThumbnail
            imageSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/ba4355f7407b61974b9835c11b55b921ad5acfa6?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c"
            micIconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/308d48251d6a6705ff9cffd89c15f8754233dd62?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c"
            name="You"
            columnClass="participant-column"
            isCurrentUser={true}
          />
        </div>
      </section>

      <ControlBar />

      <style jsx>{`
        .video-area {
          border-radius: 15.488px;
          background-color: #f9fafb;
          display: flex;
          padding: 19px 25px;
          width: 70%;
          flex-direction: column;
          align-items: stretch;
        }
        @media (max-width: 991px) {
          .video-area {
            max-width: 100%;
            padding: 19px 20px;
          }
        }
        .meeting-header {
          display: flex;
          width: 100%;
          align-items: stretch;
          gap: 20px;
          font-family: Poppins, -apple-system, Roboto, Helvetica, sans-serif;
          flex-wrap: wrap;
          justify-content: space-between;
        }
        @media (max-width: 991px) {
          .meeting-header {
            max-width: 100%;
          }
        }
        .meeting-info {
          display: flex;
          flex-direction: column;
          align-items: stretch;
        }
        .meeting-title {
          color: rgba(0, 0, 0, 1);
          font-size: 22px;
          font-weight: 600;
          margin: 0;
        }
        .meeting-details {
          align-self: start;
          display: flex;
          margin-top: 12px;
          align-items: stretch;
          gap: 40px;
          font-size: 14px;
          color: #818a98;
          font-weight: 400;
        }
        .meeting-date,
        .recording-info {
          margin: 0;
        }
        .recording-info {
          flex-basis: auto;
        }
        .share-link-button {
          border-radius: 21.683px;
          background-color: #fff;
          align-self: end;
          margin-top: 29px;
          padding: 10px 19px 10px 18px;
          gap: 6px;
          font-size: 11px;
          color: #176dee;
          font-weight: 500;
          border: none;
          cursor: pointer;
        }
        .main-video-container {
          display: flex;
          flex-direction: column;
          border-radius: 15px;
          position: relative;
          min-height: 364px;
          margin-top: 19px;
          width: 100%;
          max-width: 100%;
          padding: 332px 12px 7px;
          align-items: start;
          font-family: Poppins, -apple-system, Roboto, Helvetica, sans-serif;
          font-size: 12px;
          color: rgba(255, 255, 255, 1);
          font-weight: 400;
        }
        @media (max-width: 991px) {
          .main-video-container {
            padding-right: 20px;
            padding-top: 100px;
          }
        }
        .main-video {
          position: absolute;
          inset: 0;
          height: 100%;
          width: 100%;
          object-fit: cover;
          object-position: center;
        }
        .speaker-name {
          position: relative;
          align-self: stretch;
          border-radius: 26px;
          background-color: rgba(2, 15, 33, 0.4);
          padding: 3px 15px;
          gap: 6px;
        }
        .participants-grid {
          margin-top: 15px;
        }
        @media (max-width: 991px) {
          .participants-grid {
            max-width: 100%;
          }
        }
        .participants-row {
          gap: 20px;
          display: flex;
        }
        @media (max-width: 991px) {
          .participants-row {
            flex-direction: column;
            align-items: stretch;
            gap: 0px;
          }
        }
        .participant-column {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          line-height: normal;
          width: 25%;
          margin-left: 0px;
        }
        @media (max-width: 991px) {
          .participant-column {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}

export default VideoArea;
