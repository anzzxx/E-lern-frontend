
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import MeetingInterface from "./Room/MeetingInterface";
import { useParams } from "react-router-dom";

const VideoCall = ({
  wsUrl = "wss://api.elern.shop/",
}) => {
  const {roomName}=useParams()
  const username = useSelector((state) => state.auth.user.username);
  const [connected, setConnected] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const webSocket = useRef(null);
  const localVideoRef = useRef(null); // For MeetingInterface
  const thumbnailVideoRef = useRef(null); // For thumbnail after joining
  const remoteVideosRef = useRef(null);
  const mapPeers = useRef({});
  const messageInputRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const constraints = { video: true, audio: true };
  const iceServers = [{ urls: "stun:stun.l.google.com:19302" }];

  const token=useSelector((state)=>state.auth.accessToken)
  // Initialize local stream
  useEffect(() => {
    const initStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        setLocalStream(stream);
        console.log("Local stream initialized", stream.getVideoTracks());
      } catch (err) {
        console.error("Error accessing media devices:", err);
        setError(
          "Failed to access camera/microphone. Please grant permissions."
        );
      }
    };
    initStream();

    // Cleanup
    return () => {
      console.log("Cleaning up local stream");
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Reassign stream to thumbnail when connected changes
  useEffect(() => {
    if (connected && localStream && thumbnailVideoRef.current) {
      thumbnailVideoRef.current.srcObject = localStream;
      console.log("Stream assigned to thumbnail", localStream.getVideoTracks());
    }
  }, [connected, localStream]);

  // WebSocket connection management
  const connectWebSocket = () => {
    const endPoint = `${wsUrl}/ws/meeting/${roomName}/?token=${token}`;
    webSocket.current = new WebSocket(endPoint);

    webSocket.current.onopen = () => {
      console.log("WebSocket connected");
      reconnectAttempts.current = 0;
      sendSignal("new-peer", {});
    };

    webSocket.current.onmessage = webSocketOnMessage;

    webSocket.current.onclose = () => {
      console.log("WebSocket closed");
      if (connected && reconnectAttempts.current < maxReconnectAttempts) {
        setTimeout(() => {
          console.log(
            `Reconnecting... Attempt ${reconnectAttempts.current + 1}`
          );
          reconnectAttempts.current += 1;
          connectWebSocket();
        }, 2000);
      } else {
        setConnected(false);
        setError("WebSocket connection lost. Please try again.");
      }
    };

    webSocket.current.onerror = (err) => {
      console.error("WebSocket error:", err);
      setError("Failed to connect to server. Please check your connection.");
    };
  };

  // Join call
  const joinCall = () => {
    if (!username?.trim()) {
      setError("Username is required.");
      return;
    }
    if (!localStream) {
      setError("Camera/microphone access is required.");
      return;
    }
    setConnected(true);
    setError(null);
    connectWebSocket();
    console.log(`${username} joining call`);
  };

  // Leave call
  const leaveCall = () => {
    sendSignal("peer-left", {});
    if (webSocket.current) {
      webSocket.current.close();
    }
    Object.keys(mapPeers.current).forEach((peerUsername) =>
      removePeer(peerUsername)
    );
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    setConnected(false);
    setLocalStream(null);
    setMessages([]);
    setError(null);
    console.log(`${username} left call`);
  };

  // Send signaling message
  const sendSignal = (action, message) => {
    if (webSocket.current?.readyState === WebSocket.OPEN) {
      const payload = JSON.stringify({ peer: username, action, message });
      webSocket.current.send(payload);
      console.log(
        `Sent signal: ${action} to ${message.receiver_channel_name || "all"}`,
        message
      );
    } else {
      console.warn("WebSocket not open, cannot send signal:", action);
    }
  };

  // Handle WebSocket messages
  const webSocketOnMessage = (event) => {
    try {
      const parsedData = JSON.parse(event.data);
      const { peer: peerUsername, action, message } = parsedData;

      if (!peerUsername || !action || username === peerUsername) return;

      console.log(`Received signal: ${action} from ${peerUsername}`, message);

      if (action === "new-peer") {
        createOfferer(peerUsername, message.receiver_channel_name);
      } else if (action === "new-offer") {
        createAnswerer(
          message.sdp,
          peerUsername,
          message.receiver_channel_name
        );
      } else if (action === "new-answer") {
        const peer = mapPeers.current[peerUsername]?.[0];
        if (peer) {
          peer
            .setRemoteDescription(new RTCSessionDescription(message.sdp))
            .catch((err) =>
              console.error(
                `Error setting remote description for ${peerUsername}:`,
                err
              )
            );
        } else {
          console.warn(`No peer connection found for ${peerUsername}`);
        }
      } else if (action === "peer-left") {
        removePeer(peerUsername);
      }
    } catch (err) {
      console.error("Error parsing WebSocket message:", err);
    }
  };

  // Create offerer
  const createOfferer = async (peerUsername, receiverChannelName) => {
    if (mapPeers.current[peerUsername]) {
      console.warn(`Peer connection already exists for ${peerUsername}`);
      return;
    }

    const peer = new RTCPeerConnection({ iceServers });
    addLocalTracks(peer);
    const dc = peer.createDataChannel("channel");
    dc.onopen = () => console.log(`Data channel opened with ${peerUsername}`);
    dc.onmessage = (e) => setMessages((prev) => [...prev, e.data]);

    const remoteVideoContainer = createVideo(peerUsername);
    const remoteVideo = remoteVideoContainer.querySelector("video");
    setOnTrack(peer, remoteVideo);

    mapPeers.current[peerUsername] = [peer, dc];

    peer.onicecandidate = (event) => {
      if (!event.candidate) {
        sendSignal("new-offer", {
          sdp: peer.localDescription,
          receiver_channel_name: receiverChannelName,
        });
      }
    };

    peer.oniceconnectionstatechange = () => {
      console.log(
        `ICE connection state for ${peerUsername}: ${peer.iceConnectionState}`
      );
      if (peer.iceConnectionState === "failed") {
        console.warn(
          `ICE connection failed for ${peerUsername}, restarting...`
        );
        peer.restartIce();
      }
    };

    try {
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      console.log(`Offer created for ${peerUsername}`);
    } catch (err) {
      console.error(`Error creating offer for ${peerUsername}:`, err);
    }
  };

  // Create answerer
  const createAnswerer = async (offer, peerUsername, receiverChannelName) => {
    if (mapPeers.current[peerUsername]) {
      console.warn(`Peer connection already exists for ${peerUsername}`);
      return;
    }

    const peer = new RTCPeerConnection({ iceServers });
    addLocalTracks(peer);

    const remoteVideoContainer = createVideo(peerUsername);
    const remoteVideo = remoteVideoContainer.querySelector("video");
    setOnTrack(peer, remoteVideo);

    peer.ondatachannel = (event) => {
      const dc = event.channel;
      dc.onopen = () => console.log(`Data channel opened with ${peerUsername}`);
      dc.onmessage = (e) => setMessages((prev) => [...prev, e.data]);
      mapPeers.current[peerUsername] = [peer, dc];
    };

    peer.onicecandidate = (event) => {
      if (!event.candidate) {
        sendSignal("new-answer", {
          sdp: peer.localDescription,
          receiver_channel_name: receiverChannelName,
        });
      }
    };

    peer.oniceconnectionstatechange = () => {
      console.log(
        `ICE connection state for ${peerUsername}: ${peer.iceConnectionState}`
      );
      if (peer.iceConnectionState === "failed") {
        console.warn(
          `ICE connection failed for ${peerUsername}, restarting...`
        );
        peer.restartIce();
      }
    };

    try {
      await peer.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      console.log(`Answer created for ${peerUsername}`);
    } catch (err) {
      console.error(`Error creating answer for ${peerUsername}:`, err);
    }
  };

  // Add local tracks to peer
  const addLocalTracks = (peer) => {
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        peer.addTrack(track, localStream);
        console.log(`Added track to peer: ${track.kind}`);
      });
    } else {
      console.warn("No local stream available to add tracks");
    }
  };

  // Create remote video element with username
  const createVideo = (peerUsername) => {
    const container = document.createElement("div");
    container.id = `${peerUsername}-video-container`;
    container.className = "relative w-64 h-48";

    const video = document.createElement("video");
    video.id = `${peerUsername}-video`;
    video.autoplay = true;
    video.playsInline = true;
    video.className = "w-full h-full object-cover rounded-lg bg-gray-800";

    const usernameLabel = document.createElement("div");
    usernameLabel.textContent = peerUsername;
    usernameLabel.className =
      "absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-sm p-1 rounded-b-lg";

    container.appendChild(video);
    container.appendChild(usernameLabel);
    remoteVideosRef.current.appendChild(container);
    console.log(`Created video container for ${peerUsername}`);
    return container;
  };

  // Set ontrack event for remote stream
  const setOnTrack = (peer, remoteVideo) => {
    const remoteStream = new MediaStream();
    remoteVideo.srcObject = remoteStream;
    peer.ontrack = (event) => {
      console.log(`Received track for ${remoteVideo.id}: ${event.track.kind}`);
      remoteStream.addTrack(event.track);
    };
  };

  // Remove peer
  const removePeer = (peerUsername) => {
    if (mapPeers.current[peerUsername]) {
      const [peer, dc] = mapPeers.current[peerUsername];
      peer.close();
      dc.close();
      delete mapPeers.current[peerUsername];
      const remoteVideoContainer = document.getElementById(
        `${peerUsername}-video-container`
      );
      remoteVideoContainer?.remove();
      console.log(`Removed peer: ${peerUsername}`);
    }
  };

  // Toggle audio
  const toggleAudio = () => {
    localStream?.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setAudioEnabled(track.enabled);
      console.log(`Audio ${track.enabled ? "enabled" : "disabled"}`);
    });
  };

  // Toggle video
  const toggleVideo = () => {
    localStream?.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
      setVideoEnabled(track.enabled);
      console.log(`Video ${track.enabled ? "enabled" : "disabled"}`);
    });
  };

  // Send chat message
  const sendMsgOnClick = () => {
    const message = messageInputRef.current?.value;
    if (!message?.trim()) return;
    const formattedMessage = `Me: ${message}`;
    setMessages((prev) => [...prev, formattedMessage]);
    const dataChannels = Object.values(mapPeers.current).map(
      (peerData) => peerData[1]
    );
    const peerMessage = `${username}: ${message}`;
    dataChannels.forEach((dc) => {
      if (dc.readyState === "open") {
        dc.send(peerMessage);
        console.log(`Sent message to ${dc.label}: ${peerMessage}`);
      }
    });
    messageInputRef.current.value = "";
  };

  // Handle Enter key for chat
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMsgOnClick();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Error Message */}
      {error && (
        <div className="bg-red-600 text-white p-4 rounded-lg m-4">{error}</div>
      )}

      {/* Video Area */}
      {!connected ? (
        <>
          <MeetingInterface
            onJoin={joinCall}
            localVideoRef={localVideoRef}
            roomName={roomName}
            username={username}
            localStream={localStream}
            isConnecting={false}
          />
          <div
            className="flex-1 flex flex-wrap justify-center items-start gap-4 p-4 overflow-auto"
            ref={remoteVideosRef}
          />
          <div className="flex justify-center gap-4 p-4 bg-gray-800">
            <button
              onClick={joinCall}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-full hover:bg-blue-700 disabled:bg-gray-600"
              disabled={!localStream}
              aria-label="Join video call"
            >
              Join now
            </button>
          </div>
        </>
      ) : (
        <>
          <div
            className="flex-1 flex flex-wrap justify-center items-start gap-4 p-4 overflow-auto"
            ref={remoteVideosRef}
          >
            {/* Local video thumbnail */}
            {localStream && (
              <div className="relative w-48 h-36 absolute bottom-20 right-4 z-10">
                <video
                  ref={thumbnailVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full rounded-lg object-contain bg-gray-800"
                  onLoadedMetadata={() =>
                    console.log("Thumbnail video metadata loaded")
                  }
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-sm p-1 rounded-b-lg">
                  {username}
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-center gap-4 p-4 bg-gray-800">
            <button
              onClick={toggleAudio}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 rounded-full hover:bg-gray-700"
              aria-label={audioEnabled ? "Mute microphone" : "Unmute microphone"}
            >
              {audioEnabled ? "Mute" : "Unmute"}
            </button>
            <button
              onClick={toggleVideo}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 rounded-full hover:bg-gray-700"
              aria-label={videoEnabled ? "Stop video" : "Start video"}
            >
              {videoEnabled ? "Stop Video" : "Start Video"}
            </button>
            <button
              onClick={leaveCall}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded-full hover:bg-red-700"
              aria-label="Leave call"
            >
              Leave
            </button>
          </div>
        </>
      )}

      {/* Chat */}
      {connected && (
        <div className="fixed right-4 bottom-20 w-80 bg-white text-black rounded-lg p-4">
          <ul className="h-48 overflow-y-auto list-none p-0 mb-2">
            {messages.map((msg, index) => (
              <li key={index} className="p-1">
                {msg}
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <input
              type="text"
              ref={messageInputRef}
              placeholder="Type a message"
              className="flex-1 p-2 rounded border border-gray-300"
              onKeyDown={handleKeyDown}
              aria-label="Chat message input"
            />
            <button
              onClick={sendMsgOnClick}
              className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              aria-label="Send message"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCall;
