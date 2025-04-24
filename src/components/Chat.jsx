import React, { useState, useEffect, useRef } from "react";
import api from "../Redux/api";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import "../styles/chat.css";
import MediaUploadCard from "../components/MediaUploadCard";
import { MdOutlineFilePresent } from "react-icons/md";
import { fetchEnrolledCourses } from "../Redux/Slices/enrollmentSlice";
import EmojiPicker from "emoji-picker-react";

export const handleFileUpload = (file) => {
  if (!file) return;

  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = () => {
      const base64Data = reader.result.split(",")[1];
      const payload = {
        type: "file_upload",
        filename: file.name,
        mimetype: file.type,
        data: base64Data,
      };
      console.log(JSON.stringify(payload), "decoded");
      resolve(payload);
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const auth = useSelector((state) => state.auth);
  const name = useSelector((state) => state.profile.name);
  const [roomName, setroomName] = useState("testroom");
  const [displayname, setDisplayname] = useState("testroom");
  const userId = useSelector((state) => state.auth.user.id);
  const dispatch = useDispatch();
  const { courses } = useSelector((state) => state.enrollments);
  const [mediaLoading, setMediaLoading] = useState({});
  const [loadedMedia, setLoadedMedia] = useState({});

  useEffect(() => {
    const chatSocket = new WebSocket(
      `ws://127.0.0.1:8000/ws/chat/${roomName}/?token=${token}`
    );
    dispatch(fetchEnrolledCourses());
    chatSocketRef.current = chatSocket;
    fetchProfiles();
    fetchMessages();

    chatSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(`dta`, data);
      if (data.file_url) {
        setLoadedMedia((prev) => ({ ...prev, [data.timestamp]: false }));
      }
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
  }, [roomName, token, dispatch]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTo({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [allMessages, loadedMedia]);

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

      const parsedMessages = response.data.map((msg) => {
        let fixedFileUrl = msg.file_url;

        if (
          typeof fixedFileUrl === "string" &&
          fixedFileUrl.trim().startsWith("{")
        ) {
          try {
            fixedFileUrl = JSON.parse(fixedFileUrl.replace(/'/g, '"'));
          } catch (e) {
            console.warn("Failed to parse file_url:", fixedFileUrl);
          }
        }

        return {
          ...msg,
          file_url: fixedFileUrl,
        };
      });

      const initialLoaded = {};
      parsedMessages.forEach(msg => {
        if (msg.file_url) {
          initialLoaded[msg.timestamp] = msg.sender_name === name;
        }
      });
      
      setLoadedMedia(initialLoaded);
      
      const initialLoading = parsedMessages.reduce((acc, msg) => {
        if (msg.file_url && msg.sender_name === name) {
          acc[msg.timestamp] = false;
        }
        return acc;
      }, {});
      
      setMediaLoading(initialLoading);
      setAllMessages(parsedMessages.reverse());
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = () => {
    if (chatSocketRef.current) {
      const trimmedMessage = message.trim();
      const timestamp = new Date().toISOString();

      const baseMessage = {
        sender_name: name || "Unknown",
        message: trimmedMessage || "",
        timestamp: timestamp,
      };

      if (filrUrl && typeof filrUrl === "object" && filrUrl.data) {
        console.log("file uploaded");

        const fileMessage = {
          ...baseMessage,
          type: "file_upload",
          file: {
            filename: filrUrl.filename || "file.jpg",
            mimetype: filrUrl.mimetype || "application/octet-stream",
            data: filrUrl.data,
          },
        };
        
        setMediaLoading((prev) => ({ ...prev, [timestamp]: true }));
        setLoadedMedia((prev) => ({ ...prev, [timestamp]: false }));
        
        chatSocketRef.current.send(JSON.stringify(fileMessage));
        
        setTimeout(() => {
          setMediaLoading((prev) => ({ ...prev, [timestamp]: false }));
          setLoadedMedia((prev) => ({ ...prev, [timestamp]: true }));
        }, 1500);
      } else {
        const textMessage = {
          ...baseMessage,
          type: "text",
          file_url: "",
        };

        chatSocketRef.current.send(JSON.stringify(textMessage));
      }

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

  const getProfileImage = (username) => {
    const userProfile = profile.find((p) => p.username === username);
    return (
      userProfile?.profile_picture ||
      "https://bootdey.com/img/Content/avatar/avatar7.png"
    );
  };

  const onEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleMediaClick = (timestamp) => {
    setLoadedMedia((prev) => ({ ...prev, [timestamp]: true }));
  };

  const renderMediaPlaceholder = (message) => {
    const isImage = message.file_url?.mimetype?.startsWith("image/") || 
                   (typeof message.file_url === "string" && 
                   message.file_url.match(/\.(jpg|jpeg|png|gif|webp)$/i));
    
    const isVideo = message.file_url?.mimetype?.startsWith("video/") || 
                   (typeof message.file_url === "string" && 
                   message.file_url.match(/\.(mp4|webm|ogg|mov)$/i));

    return (
      <div 
        className="media-placeholder" 
        onClick={() => handleMediaClick(message.timestamp)}
        style={{
          width: '200px',
          height: '150px',
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          cursor: 'pointer',
          marginTop: '8px',
          flexDirection: 'column'
        }}
      >
        <MdOutlineFilePresent size={40} />
        <div style={{ marginTop: '8px' }}>
          {isImage ? 'Click to view image' : 
           isVideo ? 'Click to view video' : 'Click to view file'}
        </div>
      </div>
    );
  };

  const renderMedia = (message) => {
    if (mediaLoading[message.timestamp]) {
      return (
        <div style={{ 
          width: '200px',
          height: '150px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      );
    }

    if (typeof message.file_url === "object" && message.file_url.data) {
      const { mimetype, data } = message.file_url;
      const base64Url = `data:${mimetype};base64,${data}`;

      return (
        <div style={{ marginTop: '8px' }}>
          {mimetype.startsWith("image/") ? (
            <img
              src={base64Url}
              alt="media"
              style={{
                maxWidth: "45%",
                height: "auto",
                borderRadius: "8px"
              }}
            />
          ) : mimetype.startsWith("video/") ? (
            <video
              controls
              style={{
                maxWidth: "45%",
                height: "auto",
                borderRadius: "8px"
              }}
              src={base64Url}
            />
          ) : (
            <a 
              href={base64Url} 
              download={message.file_url.filename || "file"}
              style={{ display: 'block', marginTop: '8px' }}
            >
              <MdOutlineFilePresent size={24} />
              <span style={{ marginLeft: '8px' }}>
                {message.file_url.filename || "Download file"}
              </span>
            </a>
          )}
        </div>
      );
    } else if (typeof message.file_url === "string") {
      const fileUrl = message.file_url;
      
      return (
        <div style={{ marginTop: '8px' }}>
          {fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
            <img
              src={fileUrl}
              alt="media"
              style={{
                maxWidth: "45%",
                height: "auto",
                borderRadius: "8px"
              }}
            />
          ) : fileUrl.match(/\.(mp4|webm|ogg|mov)$/i) ? (
            <video
              controls
              style={{
                maxWidth: "45%",
                height: "auto",
                borderRadius: "8px"
              }}
              src={fileUrl}
            />
          ) : (
            <a 
              href={fileUrl} 
              download
              style={{ display: 'block', marginTop: '8px' }}
            >
              <MdOutlineFilePresent size={24} />
              <span style={{ marginLeft: '8px' }}>Download file</span>
            </a>
          )}
        </div>
      );
    }
    return null;
  };

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
              {showCourses
                ? courses.map((course) => (
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
                          onClick={() => {
                            setroomName(course.id),
                              setDisplayname(course.title);
                          }}
                        />
                        <div className="flex-grow-1 ml-3">
                          {course.title}
                          <div className="small">
                            <span className="fas fa-circle chat-offline" />{" "}
                            Offline
                          </div>
                        </div>
                      </div>
                    </a>
                  ))
                : profile.map((pro) => (
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
                            <span className="fas fa-circle chat-offline" />{" "}
                            Offline
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
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
                    <strong>{displayname}</strong>
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
                            {message.file_url && (
                              loadedMedia[message.timestamp] ? 
                                renderMedia(message) : 
                                renderMediaPlaceholder(message)
                            )}
                          </div>
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
                            {message.file_url && (
                              loadedMedia[message.timestamp] ? 
                                renderMedia(message) : 
                                renderMediaPlaceholder(message)
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {showEmojiPicker && (
                <div className="emoji-picker-container">
                  <EmojiPicker onEmojiClick={onEmojiClick} />
                </div>
              )}

              <div
                style={{
                  position: "relative",
                  display: showCard ? "block" : "none",
                }}
              >
                <MediaUploadCard
                  handlefilesend={handlefilesend}
                  setFileUrl={setFileUrl}
                />
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