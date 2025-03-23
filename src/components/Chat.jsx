import React, { useState, useEffect, useRef } from "react";
import api from "../Redux/api";
import { useSelector } from "react-redux";
import moment from "moment";
import "../styles/chat.css";
import ImageUploadCard from "../components/ImageUploadCard";
import MediaUploadCard from "../components/MediaUploadCard"
import { MdOutlineFilePresent } from "react-icons/md";
import EmojiPicker from "emoji-picker-react"; // Import the EmojiPicker

// File upload
export const handleUploadMedia = async (formData) => {
  try {
    const response = await api.post("chat/upload/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const { file_url } = response.data;
    
    return file_url;
  } catch (error) {
    console.error("Error uploading media:", error);
  }
};

const Chat = ({ token }) => {
  const ws = useRef(null);
  const [msg, setMsg] = useState([]);
  const [filrUrl, setFileUrl] = useState("");
  const [showCard, setShowCard] = useState(false);
  const [allMessages, setAllMessages] = useState([]);
  const [recipientId, setRecipientId] = useState();
  const [message, setMessage] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [profile, setProfile] = useState([]);
  const chatSocketRef = useRef(null);
  const chatBoxRef = useRef(null);
  const [showCourses, setShowCourses] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // State for emoji picker visibility
  const auth = useSelector((state) => state.auth);
  const name = useSelector((state) => state.profile.name);
  const [roomName, setroomName] = useState("testroom");
  const { data, loading, error } = useSelector((state) => state.enrollments);
  const userId = useSelector((state) => state.auth.user.id);

  const filteredEnrollments = data?.filter((enrollment) => enrollment.user.id === userId);
  const courses = filteredEnrollments?.map((enrollment) => enrollment.course);

  

  useEffect(() => {
    const chatSocket = new WebSocket(
      `ws://127.0.0.1:8000/ws/chat/${roomName}/?token=${token}`
    );

    chatSocketRef.current = chatSocket;
    fetchProfiles();
    fetchMessages();

    chatSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);

      setAllMessages((prev) => [
        ...prev,
        {
          ...data,
          sender_name: data.username,
          timestamp: data.timestamp || new Date().toISOString(),
        },
      ]);
      setFileUrl("");
    };

    chatSocket.onclose = (event) => {
      console.log("WebSocket Closed. Reason:", event.reason);
    };

    return () => {
      chatSocket.close();
    };
  }, [roomName, token]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTo({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth", // Smooth scrolling
      });
    }
  }, [allMessages, handleUploadMedia]); // Triggered whenever `allMessages` changes

  const fetchProfiles = async () => {
    try {
      const response = await api.get("chat/profiles/");
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await api.get(`chat/${roomName}/messages/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setAllMessages(response.data.reverse());
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = () => {
    if (chatSocketRef.current) {
      const newMessage = {
        sender_name: name || "Unknown",
        message: message.trim() || "",
        file_url: filrUrl,
        timestamp: new Date().toISOString(),
      };
      if (message.trim() && ws.current) {
        const newMessage = {
          sender_name: name || "Unknown",
          message: message.trim() || "",
          timestamp: new Date().toISOString(),
        };
        ws.current.send(JSON.stringify(newMessage));
      }

      chatSocketRef.current.send(JSON.stringify(newMessage));
      setMessage("");
      setFileUrl("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const handlefilesend = () => {
    sendMessage();
    setShowCard(false);
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  // Function to get the profile image of a user
  const getProfileImage = (username) => {
    const userProfile = profile.find((p) => p.username === username);
    return userProfile?.profile_picture || "https://bootdey.com/img/Content/avatar/avatar7.png"; // Default image
  };

  // Function to handle emoji selection
  const onEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false); // Hide the emoji picker after selection
  };
  console.log(`url`,filrUrl);
  

  return (
    <main className="content" style={{ marginTop: "30px" }}>
      <div className="container p-0">
        <h1 className="h3 mb-3">Messages</h1>
        <div className="card">
          <div className="row g-0">
            <div className="col-12 col-lg-5 col-xl-3 border-right">
              <div className="px-4 d-none d-md-block">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <input
                      type="text"
                      className="form-control my-3"
                      placeholder="Search..."
                      value={searchInput}
                      onChange={handleSearchChange}
                    />
                  </div>
                </div>
              </div>
              {showCourses ? (
                courses.map((course) => (
                  <a
                    href="#"
                    className="list-group-item list-group-item-action border-0"
                    key={course.id}
                  >
                    <div className="d-flex align-items-start">
                      <img
                        src="https://bootdey.com/img/Content/avatar/avatar7.png"
                        className="rounded-circle mr-1"
                        alt={course.title}
                        width={40}
                        height={40}
                        onClick={() => setroomName(course.title)}
                      />
                      <div className="flex-grow-1 ml-3">
                        {course.title}
                        <div className="small">
                          <span className="fas fa-circle chat-offline" /> Offline
                        </div>
                      </div>
                    </div>
                  </a>
                ))
              ) : (
                profile.map((pro) => (
                  <a
                    href="#"
                    className="list-group-item list-group-item-action border-0"
                    key={pro.id}
                  >
                    <div className="d-flex align-items-start">
                      <img
                        src="https://bootdey.com/img/Content/avatar/avatar7.png"
                        className="rounded-circle mr-1"
                        alt={pro.username}
                        width={40}
                        height={40}
                        onClick={() => setRecipientId(pro.id)}
                      />
                      <div className="flex-grow-1 ml-3">
                        {pro.username}
                        <div className="small">
                          <span className="fas fa-circle chat-offline" /> Offline
                        </div>
                      </div>
                    </div>
                  </a>
                ))
              )}
              <hr className="d-block d-lg-none mt-1 mb-0" />
            </div>
            <div className="col-12 col-lg-7 col-xl-9">
              <div className="py-2 px-4 border-bottom d-none d-lg-block">
                <div className="d-flex align-items-center py-1">
                  <div className="position-relative">
                    <img
                      src={getProfileImage(name)}
                      className="rounded-circle mr-1"
                      alt={name}
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="flex-grow-1 pl-3">
                    <strong>{roomName}</strong>
                    <div className="text-muted small">
                      <em>Online</em>
                    </div>
                  </div>
                  <div>
                    <button className="btn btn-primary btn-lg mr-1 px-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-phone feather-lg"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </button>
                    <button className="btn btn-info btn-lg mr-1 px-3 d-none d-md-inline-block">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-video feather-lg"
                      >
                        <polygon points="23 7 16 12 23 17 23 7" />
                        <rect
                          x={1}
                          y={5}
                          width={15}
                          height={14}
                          rx={2}
                          ry={2}
                        />
                      </svg>
                    </button>
                    <button className="btn btn-light border btn-lg px-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-more-horizontal feather-lg"
                      >
                        <circle cx={12} cy={12} r={1} />
                        <circle cx={19} cy={12} r={1} />
                        <circle cx={5} cy={12} r={1} />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="position-relative">
                <div className="chat-messages p-4" ref={chatBoxRef}>
                  {allMessages.map((message, index) => (
                    <div key={index}>
                      {message.sender_name === name ? (
                        <div className="chat-message-right mb-4">
                          <div>
                            <img
                              src={getProfileImage(name)}
                              className="rounded-circle mr-1"
                              alt="You"
                              width={40}
                              height={40}
                            />
                            <div className="text-muted small text-nowrap mt-2">
                              {moment(message.timestamp).format("hh:mm A")}
                            </div>
                          </div>
                          <div className="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">
                            <div className="font-weight-bold mb-1">You</div>
                            {message.message}
                          </div>
                          {message.file_url && (
                            <img
                              src={message.file_url}
                              alt="media"
                              style={{
                                maxWidth: "45%",
                                height: "auto",
                                borderRadius: "8px",
                                marginTop: "8px",
                              }}
                            />
                          )}
                        </div>
                      ) : (
                        <div className="chat-message-left pb-4">
                          <div>
                            <img
                              src={getProfileImage(message.sender_name)}
                              className="rounded-circle mr-1"
                              alt={message.sender_name}
                              width={40}
                              height={40}
                            />
                            <div className="text-muted small text-nowrap mt-2">
                              {moment(message.timestamp).format("hh:mm A")}
                            </div>
                          </div>
                          <div className="flex-shrink-1 bg-light rounded py-2 px-3 ml-3">
                            <div className="font-weight-bold mb-1">
                              {message.sender_name}
                            </div>
                            {message.message}
                          </div>
                          {message.file_url && (
                            <img
                              src={message.file_url}
                              alt="media"
                              style={{
                                maxWidth: "45%",
                                height: "auto",
                                borderRadius: "8px",
                                marginTop: "8px",
                              }}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className="emoji-picker-container">
                  <EmojiPicker onEmojiClick={onEmojiClick} />
                </div>
              )}

              <div className={`card-container ${showCard ? "visible" : ""}`}>
                {showCard && (
                  // <ImageUploadCard setFileUrl={setFileUrl} sendFile={handlefilesend} />
                  <MediaUploadCard handlefilesend={handlefilesend} setFileUrl={setFileUrl}/>
                )}
              </div>

              <div className="flex-grow-0 py-3 px-4 border-top">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type your message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    😀
                  </button>
                  <button className="btn btn-primary" onClick={sendMessage}>
                    Send
                  </button>
                  <div
                    onClick={() => setShowCard(!showCard)}
                    className="btn btn-primary"
                  >
                    <MdOutlineFilePresent />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Chat;