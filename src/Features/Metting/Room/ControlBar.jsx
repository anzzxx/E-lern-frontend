import React from "react";

function ControlBar() {
  return (
    <section className="control-bar">
      <button
        className="control-button mic-button"
        aria-label="Mute microphone"
      ></button>
      <button
        className="control-button video-button"
        aria-label="Turn off camera"
      ></button>
      <button className="leave-meeting-button">Leave Meeting</button>
      <button
        className="control-button settings-button"
        aria-label="Settings"
      ></button>
      <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/19e7eb83e4fa59ffbbf84135b2ab2f5b1171b499?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c" alt="More options" className="more-options" />

      <style jsx>{`
        .control-bar {
          align-self: center;
          display: flex;
          margin-top: 18px;
          width: 339px;
          max-width: 100%;
          align-items: stretch;
          gap: 18px;
          font-family:
            Poppins,
            -apple-system,
            Roboto,
            Helvetica,
            sans-serif;
          font-size: 11px;
          color: rgba(255, 255, 255, 1);
          font-weight: 400;
        }
        .control-button {
          border: none;
          cursor: pointer;
        }
        .mic-button {
          background-color: #f1414f;
          border-radius: 50%;
          display: flex;
          width: 38px;
          flex-shrink: 0;
          height: 38px;
          fill: #f1414f;
        }
        .video-button {
          background-color: #fff;
          border-radius: 50%;
          display: flex;
          width: 38px;
          flex-shrink: 0;
          height: 38px;
          fill: #fff;
        }
        .leave-meeting-button {
          border: none;
          border-radius: 21.683px;
          background-color: #f1414f;
          padding: 11px 20px;
          color: #fff;
          font-size: 11px;
          font-weight: 400;
          cursor: pointer;
        }
        .settings-button {
          background-color: #fff;
          border-radius: 50%;
          display: flex;
          width: 38px;
          flex-shrink: 0;
          height: 38px;
          fill: #fff;
        }
        .more-options {
          aspect-ratio: 0.97;
          object-fit: contain;
          object-position: center;
          width: 37px;
          flex-shrink: 0;
        }
      `}</style>
    </section>
  );
}

export default ControlBar;
