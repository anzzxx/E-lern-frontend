"use client";
import React from "react";
import ChatMessage from "./ChatMessage";

function ChatSection() {
  return (
    <aside className="chat-section">
      <h2 className="chat-title">Messages</h2>
      <p className="chat-description">
        You can chat here with other members during the meeting and they will be
        deleted after the meeting.
      </p>

      <ChatMessage
        avatarSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/0e144f53db337f28050dfd2ec0d1a3af5ab9b8e9?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c"
        name="Amir"
        time="9:20"
        message="Hello guys, How are you doing?"
        nameColor="#176dee"
      />

      <ChatMessage
        avatarSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/e6e79b1d057a8a4713916e7ef89c7125a211d39d?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c"
        name="Jessica"
        time="9:21"
        message="Hi Amir"
        nameColor="#f1414f"
      />

      <ChatMessage
        avatarSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/1804d9fa029ce5b9697969fb8fda1a82c355b498?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c"
        name="Anna"
        time="9:24"
        message="Hey guys, whats the topic of this week?"
        nameColor="rgba(14, 180, 190, 1)"
      />

      <ChatMessage
        avatarSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/b69b3e793b65cd9361999d648f85b112bea5220b?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c"
        name="Tomas"
        time="9:26"
        message="Hey Anna, its te challenges of working in big componeis"
        nameColor="rgba(21, 143, 10, 1)"
      />

      <ChatMessage
        avatarSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/7958e10bdbfba9be9b8e8d323c9c481c8ed183d1?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c"
        name="Anna"
        time="9:26"
        message="Thats great. I realy had questions about this"
        nameColor="rgba(14, 180, 190, 1)"
      />

      <ChatMessage
        avatarSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/f00119d080d309225ef3f348ce878a8008bcbc85?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c"
        name="You"
        time="9:44"
        message="What exactley matter for this companeis?"
        isCurrentUser={true}
      />

      <ChatMessage
        avatarSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/073d9eac66e983c8affa646963fa3f7fb8d1a1a9?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c"
        name="Jessica"
        time="9:21"
        message="What exactly do you mean Keyvan?"
        nameColor="#f1414f"
      />

      <div className="message-input-container">
        <div className="input-wrapper">
          <div className="emoji-button"></div>
          <input
            type="text"
            placeholder="Write a message..."
            className="message-input"
          />
        </div>
        <button className="send-button" aria-label="Send message"></button>
      </div>

      <style jsx>{`
        .chat-section {
          border-radius: 15.488px;
          background-color: #f9fafb;
          display: flex;
          padding: 19px;
          flex-direction: column;
          align-items: stretch;
          font-family:
            Poppins,
            -apple-system,
            Roboto,
            Helvetica,
            sans-serif;
          font-size: 9px;
          font-weight: 400;
        }
        .chat-title {
          color: #020f21;
          font-size: 19px;
          font-weight: 600;
          align-self: center;
          margin: 0;
        }
        .chat-description {
          color: #818a98;
          text-align: center;
          margin-top: 5px;
          width: 245px;
          align-self: center;
        }
        .message-input-container {
          display: flex;
          margin-top: 18px;
          width: 100%;
          align-items: stretch;
          gap: 20px;
          font-family:
            Inter,
            -apple-system,
            Roboto,
            Helvetica,
            sans-serif;
          font-size: 11px;
          color: #9da4af;
          justify-content: space-between;
        }
        .input-wrapper {
          display: flex;
          align-items: stretch;
          gap: 13px;
          flex-grow: 1;
          background-color: #fff;
          border-radius: 7.744px;
          padding: 10px 9px;
        }
        .emoji-button {
          border-radius: 5px;
          background-color: rgba(238, 178, 22, 1);
          display: flex;
          width: 31px;
          flex-shrink: 0;
          height: 31px;
          cursor: pointer;
        }
        .message-input {
          margin-top: auto;
          margin-bottom: auto;
          border: none;
          outline: none;
          background: transparent;
          color: #9da4af;
          font-size: 11px;
          font-family:
            Inter,
            -apple-system,
            Roboto,
            Helvetica,
            sans-serif;
          width: 100%;
        }
        .send-button {
          border-radius: 5.421px;
          background-color: #176dee;
          display: flex;
          width: 31px;
          flex-shrink: 0;
          height: 31px;
          border: none;
          cursor: pointer;
        }
      `}</style>
    </aside>
  );
}

export default ChatSection;
