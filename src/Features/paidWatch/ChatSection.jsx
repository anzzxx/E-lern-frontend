"use client";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Card, ListGroup, Button } from "react-bootstrap";
import { STATIC_URL } from "../../Redux/api";
import Message from "../../components/Message";
import api from "../../Redux/api";
import { fetchTests } from "../../Redux/Slices/TestSlice";
import "../../styles/watch.css";

// ChatMessage Component with reply functionality
function ChatMessage({ 
  avatar, 
  username, 
  message, 
  mentions = [], 
  onReply,
  isReplyingTo,
  replyToUsername,
  replyToMessage,
  createdAt
}) {
  
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = () => {
    if (mentions.length === 0) return message;
    return message.split(" ").map((word, index) => {
      const isMention = mentions.some((mention) => `@${mention}` === word);
      return (
        <span key={index}>
          {isMention ? <span className="mention">{word}</span> : ` ${word}`}
        </span>
      );
    });
  };

  return (
    <div className="message">
      <img 
        src={avatar ? `${STATIC_URL}${avatar}` : '/default-avatar.png'} 
        className="avatar" 
        alt={`${username}'s avatar`} 
        onError={(e) => {
          e.target.onerror = null; 
          e.target.src = '/default-avatar.png';
        }}
      />
      <div className="message-content">
        <div className="message-header">
          <h4 className="username">{username}</h4>
          <span className="message-time">{formatDate(createdAt)}</span>
        </div>
        {isReplyingTo && replyToUsername && (
          <div className="reply-preview">
            <span className="reply-to">Replying to @{replyToUsername}</span>
            <p className="reply-message-preview">{replyToMessage}</p>
          </div>
        )}
        <p className="text">{renderMessage()}</p>
        <button 
          className="reply-button" 
          onClick={onReply}
          title="Reply to this message"
        >
          Reply
        </button>
      </div>
    </div>
  );
}

// PromoCard Component
function PromoCard() {
  return (
    <article className="promo-card">
      <div className="promo-content">
        <div className="promo-info">
          <span className="badge">WEBINAR</span>
          <time className="date">August 24, 2020</time>
          <h2 className="title">
            One Day
            <br />
            Learn a<br />
            Photo.
            <br />
          </h2>
          <p className="instructor">Sarah Molek</p>
          <button className="cta-button">
            <span className="button-text">Get it Now</span>
          </button>
        </div>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/3fb1941072be83257e7e13a7deeaeee8668d4d0e?placeholderIfAbsent=true&apiKey=34d728b774e44ebe92ee1866d5dfa190"
          className="promo-image"
          alt="Webinar promotional image"
        />
      </div>
    </article>
  );
}

function ChatSection({ courseId, description }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("chat");
  const [message, setMessage] = useState({});
  const [reportForm, setReportForm] = useState({
    reason: "",
    comments: "",
  });
  const { accessToken } = useSelector((state) => state.auth);
  const [formMessage, setFormMessage] = useState("");

  // State for reply functionality
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyPreview, setReplyPreview] = useState({
    username: "",
    message: "",
    id: null
  });

  // Fetch quizzes from Redux store
  const { data: quizzes, loading, error } = useSelector((state) => state.tests);

  // Fetch quizzes when component mounts or courseId changes
  useEffect(() => {
    dispatch(fetchTests(courseId));
  }, [dispatch, courseId]);

  const [messages, setMessages] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const ws = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch initial messages from API
  useEffect(() => {
    const fetchInitialMessages = async () => {
      try {
        const response = await api.get(`lessons/comments/${courseId}/`);
        const formattedMessages = response.data.map(msg => ({
          id: msg.id,
          username: msg.user.username,
          message: msg.message,
          avatar: msg.user.profile_picture || '',
          mentions: msg.mentions || [],
          replyTo: msg.reply_to ? msg.reply_to.id : null,
          replyToUsername: msg.reply_to ? msg.reply_to.user.username : null,
          replyToMessage: msg.reply_to ? msg.reply_to.message : null,
          createdAt: msg.created_at
        }));
        setMessages(formattedMessages);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessage({
          type: "error",
          message: "Failed to load chat history"
        });
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchInitialMessages();
  }, [courseId]);

  // WebSocket setup
  useEffect(() => {
    if (isLoadingMessages) return; // Wait until initial messages are loaded

    ws.current = new WebSocket(`wss://api.elern.shop/ws/comment/${courseId}/?token=${accessToken}`);

    ws.current.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log("New message received:", data);
      
      // Check if this message already exists (from initial load)
      const messageExists = messages.some(msg => msg.id === data.id);
      
      if (!messageExists) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: data.id,
            username: data.username,
            message: data.message,
            avatar: data.avatar,
            mentions: data.mentions || [],
            replyTo: data.replyTo || null,
            replyToMessage: data.replyToMessage || null,
            replyToUsername: data.replyToUsername || null,
            createdAt: data.created_at
          },
        ]);
      }
    };

    ws.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      setMessage({
        type: "error",
        message: "Chat connection error. Please refresh the page."
      });
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [courseId, isLoadingMessages, accessToken]);

  const handleReply = (messageId) => {
    const messageToReply = messages.find(msg => msg.id === messageId);
    if (messageToReply) {
      setReplyingTo(messageId);
      setReplyPreview({
        id: messageToReply.id,
        username: messageToReply.username,
        message: messageToReply.message
      });
      setNewMessage(`@${messageToReply.username} `);
      // Focus the input field
      document.querySelector(".message-input")?.focus();
    }
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setReplyPreview({
      id: null,
      username: "",
      message: ""
    });
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const messageData = {
        message: newMessage,
        replyTo: replyingTo || null,
        replyToUsername: replyingTo ? replyPreview.username : null,
        replyToMessage: replyingTo ? replyPreview.message : null
      };
      
      ws.current.send(JSON.stringify(messageData));
      setNewMessage("");
      setReplyingTo(null);
      setReplyPreview({
        id: null,
        username: "",
        message: ""
      });
    } else {
      console.warn("WebSocket is not connected.");
      setMessage({
        type: "error",
        message: "Connection lost. Please refresh the page."
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const reportReasons = [
    { value: "", label: "Select a reason" },
    { value: "inappropriate_content", label: "Inappropriate Content" },
    { value: "incorrect_information", label: "Incorrect Information" },
    { value: "technical_issues", label: "Technical Issues" },
    { value: "other", label: "Other" },
  ];

  const handleReportChange = (e) => {
    const { name, value } = e.target;
    setReportForm((prev) => ({ ...prev, [name]: value }));
    setFormMessage("");
  };

  const onHide = () => {
    setMessage(null);
  };

  const handleReportSubmit = async () => {
    if (!reportForm.reason) {
      setFormMessage("Please select a reason for reporting.");
      return;
    }

    try {
      const Data = {
        reason: reportForm.reason,
        course: courseId,
        comments: reportForm.comments
      };
      const response = await api.post("course/report-course/", Data);
      setMessage({ type: "success", message: "Course reported successfully" });
      setFormMessage("Report submitted successfully!");
      setReportForm({ reason: "", comments: "" });
    } catch (error) {
      if (error.response) {
        setMessage({
          message: error.response.data.message || "Something went wrong!",
          type: "error",
        });
      } else if (error.request) {
        setMessage({
          message: "No response from server. Please try again.",
          type: "error",
        });
      } else {
        setMessage({
          message: "An error occurred. Please try again.",
          type: "error",
        });
      }
      setFormMessage("Failed to submit report. Please try again.");
      console.error("Report submission error:", error);
    }
  };

  return (
    <>
      <section className="chat-section">
        <div className="chat-grid">
          <article className="chat-container">
            <header className="chat-header">
              <nav className="chat-nav">
                <button
                  className={`nav-button ${activeTab === "about" ? "active" : ""}`}
                  onClick={() => setActiveTab("about")}
                >
                  About
                </button>
                <button
                  className={`nav-button ${activeTab === "chat" ? "active" : ""}`}
                  onClick={() => setActiveTab("chat")}
                >
                  Live Chat
                </button>
                <button
                  className={`nav-button ${activeTab === "test" ? "active" : ""}`}
                  onClick={() => setActiveTab("test")}
                >
                  Quiz
                </button>
                <button
                  className={`nav-button ${activeTab === "report" ? "active" : ""}`}
                  onClick={() => setActiveTab("report")}
                >
                  Report Course
                </button>
              </nav>
            </header>
            {activeTab === "chat" ? (
               <div className="chat-container">
         <div className="messages-container">
        {isLoadingMessages ? (
          <div className="loading-messages">
            <p>Loading chat history...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="no-messages">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              avatar={msg.avatar}
              username={msg.username}
              message={msg.message}
              mentions={msg.mentions}
              onReply={() => handleReply(msg.id)}
              isReplyingTo={msg.replyTo !== null}
              replyToUsername={msg.replyToUsername}
              replyToMessage={msg.replyToMessage}
              createdAt={msg.createdAt}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <footer className="chat-input">
        {replyingTo && (
          <div className="reply-indicator">
            <span>Replying to @{replyPreview.username}</span>
            <button onClick={cancelReply} className="cancel-reply">
              ×
            </button>
          </div>
        )}
        <input
          type="text"
          placeholder="Ask Something..."
          className="message-input"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoadingMessages}
        />
        <button
          className="send-button"
          onClick={sendMessage}
          disabled={isLoadingMessages || !newMessage.trim()}
        >
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/0b7846f87988b5a38ff0cefa39ce536b2bed5fb6?placeholderIfAbsent=true&apiKey=34d728b774e44ebe92ee1866d5dfa190"
            alt="Send message"
            className="send-icon"
          />
        </button>
      </footer>
      {message && (
        <Message
          message={message.message}
          type={message.type}
          onHide={onHide}
        />
      )}
    </div>
            ) : activeTab === "about" ? (
              <div className="about-container">
                <h3>About This Course</h3>
                <p>{description || "No description available."}</p>
              </div>
            ) : activeTab === "test" ? (
              <div className="quiz-container" style={{ padding: "20px" }}>
                <h3>Quizzes</h3>
                {loading ? (
                  <p>Loading quizzes...</p>
                ) : error ? (
                  <p style={{ color: "red" }}>Error loading quizzes: {error}</p>
                ) : quizzes.length === 0 ? (
                  <p>No quizzes available for this course.</p>
                ) : (
                  <Card
                    style={{
                      width: "100%",
                      border: "none",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <ListGroup variant="flush">
                      {quizzes.map((quiz) => (
                        <ListGroup.Item
                          key={quiz.id}
                          className="d-flex justify-content-between align-items-center"
                        >
                          <div>
                            <h5 className="mb-1">{quiz.title}</h5>
                          </div>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() =>
                              navigate(`/mcq/test/${quiz.id}/${courseId}/`)
                            }
                          >
                            Start
                          </Button>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Card>
                )}
              </div>
            ) : (
              <div className="report-container" style={{ padding: "20px" }}>
                <h3>Report Course</h3>
                {formMessage && (
                  <p
                    style={{
                      color: formMessage.includes("successfully")
                        ? "green"
                        : "red",
                    }}
                  >
                    {formMessage}
                  </p>
                )}
                <div style={{ marginBottom: "15px" }}>
                  <label
                    htmlFor="reason"
                    style={{ display: "block", marginBottom: "5px" }}
                  >
                    Reason for Reporting
                  </label>
                  <select
                    id="reason"
                    name="reason"
                    value={reportForm.reason}
                    onChange={handleReportChange}
                    className="message-input"
                    style={{ width: "100%", padding: "8px" }}
                  >
                    {reportReasons.map((reason) => (
                      <option key={reason.value} value={reason.value}>
                        {reason.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ marginBottom: "15px" }}>
                  <label
                    htmlFor="comments"
                    style={{ display: "block", marginBottom: "5px" }}
                  >
                    Additional Comments
                  </label>
                  <textarea
                    id="comments"
                    name="comments"
                    value={reportForm.comments}
                    onChange={handleReportChange}
                    placeholder="Provide more details about the issue..."
                    className="message-input"
                    style={{ width: "100%", height: "100px", padding: "8px" }}
                  />
                </div>
                <button
                  onClick={handleReportSubmit}
                  className="cta-button"
                  style={{ width: "100%", padding: "10px" }}
                  disabled={!reportForm.reason}
                >
                  Submit Report
                </button>
              </div>
            )}
          </article>
          <PromoCard />
        </div>
      </section>
      <br />
    
    </>
  );
}

export default ChatSection;