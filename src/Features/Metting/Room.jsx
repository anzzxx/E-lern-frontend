import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

function Room() {
    const [users, setUsers] = useState([]);
    const [status, setStatus] = useState("Connecting...");
    const ws = useRef(null);
    const localStream = useRef(null);
    const remoteStreams = useRef({});
    const videoRefs = useRef({});
    const roomName = "test_room";
    const token = useSelector((state) => state.auth?.accessToken || null);
    const myID = useSelector((state) => state.auth?.user?.id || null);
    
    const peerConnections = {};

    useEffect(() => {
        if (!token) {
            setStatus("No token available");
            console.error("Token is missing!");
            return;
        }

        console.log("Initializing WebSocket connection...");

        // Wait for media to be initialized before proceeding
        startMedia().then((stream) => {
            if (stream) {
                console.log("✅ Media ready, proceeding with WebSocket...");
                connectWebSocket();
            } else {
                console.error("❌ Failed to get local media stream. Stopping.");
                setStatus("Media Error");
            }
        });

        return () => ws.current?.close();
    }, [token]);

    async function startMedia() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localStream.current = stream;
            console.log("🎥 Local media stream initialized.");

            const localVideo = document.getElementById("localVideo");
            if (localVideo) {
                localVideo.srcObject = stream;
            }

            return stream; // ✅ Return the stream for verification
        } catch (error) {
            console.error("❌ Error accessing media devices:", error);
            return null; // Prevents trying to use an undefined stream
        }
    }

    function connectWebSocket() {
        console.log("🌐 Attempting WebSocket connection...");
        ws.current = new WebSocket(`ws://127.0.0.1:8000/ws/meeting/${roomName}/?token=${token}`);

        ws.current.onopen = () => {
            console.log("✅ WebSocket connected.");
            setStatus("Connected");

            setTimeout(() => {
                users.forEach(user => initiateWebRTCConnection(user.user_id));
            }, 500);
        };

        ws.current.onmessage = (e) => {
            const data = JSON.parse(e.data);
            console.log("📡 Signaling data received:", data);
            handleWebRTCSignaling(data); // ✅ Function is defined before use
        };

        ws.current.onerror = (error) => {
            console.error("⚠️ WebSocket error:", error);
            setStatus("Error");
        };

        ws.current.onclose = (event) => {
            console.warn(`🛑 WebSocket disconnected (Code: ${event.code})`);
            setStatus("Disconnected");
        };
    }

    function initiateWebRTCConnection(userID) {
        if (peerConnections[userID]) {
            console.warn(`⚠️ Skipping duplicate WebRTC connection for user: ${userID}`);
            return;
        }

        if (!localStream.current) {
            console.error("🚨 Cannot start WebRTC! Local stream is not available.");
            return;
        }

        console.log(`🔄 Creating WebRTC connection for user: ${userID}`);
        const pc = new RTCPeerConnection({
            iceServers: [
                { urls: "stun:stun.l.google.com:19302" },
                { urls: "turn:YOUR_TURN_SERVER", username: "user", credential: "pass" }
            ]
        });
        peerConnections[userID] = pc;

        console.log("🎤 Adding local media tracks...");
        localStream.current.getTracks().forEach(track => {
            console.log(`➕ Adding track: ${track.kind}`);
            pc.addTrack(track, localStream.current);
        });

        pc.ontrack = (event) => {
            console.log(`🚀 Receiving media from ${userID}`, event.streams);

            if (event.streams.length > 0) {
                remoteStreams.current[userID] = event.streams[0];

                if (!videoRefs.current[userID]) {
                    videoRefs.current[userID] = document.getElementById(`video-${userID}`);
                }

                if (videoRefs.current[userID]) {
                    console.log(`✅ Assigning remote stream to video element for user ${userID}`);
                    videoRefs.current[userID].srcObject = event.streams[0];
                } else {
                    console.warn(`⚠️ No video element found for user ${userID}`);
                }
            } else {
                console.error(`🚨 No media streams received from ${userID}`);
            }
        };

        pc.oniceconnectionstatechange = () => {
            console.log(`🧊 ICE Connection State for ${userID}:`, pc.iceConnectionState);
        };

        pc.createOffer()
            .then(offer => pc.setLocalDescription(offer))
            .then(() => {
                console.log(`📤 Sending offer to ${userID}`);
                ws.current.send(JSON.stringify({
                    type: "offer",
                    from: myID,
                    to: userID,
                    offer: peerConnections[userID].localDescription
                }));
            })
            .catch(error => console.error("❌ Error initiating WebRTC:", error));
    }

    function handleWebRTCSignaling(data) {
        const { type, from, offer, answer } = data;

        if (from === myID) {
            console.warn("🚫 Ignoring self-created WebRTC message.");
            return;
        }

        if (!peerConnections[from]) {
            console.log(`🔄 Creating new RTCPeerConnection for ${from}`);
            peerConnections[from] = new RTCPeerConnection({
                iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
            });

            peerConnections[from].ontrack = (event) => {
                console.log(`🚀 Receiving media from ${from}`);
                remoteStreams.current[from] = event.streams[0];

                if (!videoRefs.current[from]) {
                    videoRefs.current[from] = document.getElementById(`video-${from}`);
                }

                if (videoRefs.current[from]) {
                    console.log(`✅ Assigning remote stream to video element for user ${from}`);
                    videoRefs.current[from].srcObject = event.streams[0];
                } else {
                    console.warn(`⚠️ No video element found for user ${from}`);
                }
            };
        }

        const pc = peerConnections[from];

        if (type === "offer" && offer) {
            console.log(`📥 Received offer from ${from}`);
            pc.setRemoteDescription(new RTCSessionDescription(offer))
                .then(() => pc.createAnswer())
                .then(answer => pc.setLocalDescription(answer))
                .then(() => {
                    console.log(`📤 Sending answer to ${from}`);
                    ws.current.send(JSON.stringify({
                        type: "answer",
                        from: myID,
                        to: from,
                        answer: pc.localDescription
                    }));
                })
                .catch(error => console.error("❌ Error handling offer:", error));
        }

        if (type === "answer" && answer) {
            console.log(`📥 Received answer from ${from}`);

            if (pc.signalingState === "have-local-offer") {
                console.log(`🔄 Setting remote answer for ${from}`);
                pc.setRemoteDescription(new RTCSessionDescription(answer))
                    .catch(error => console.error("❌ Error setting remote answer:", error));
            } else {
                console.warn(`⚠️ Skipping answer setting for ${from}, invalid signaling state: ${pc.signalingState}`);
            }
        }
    }

    return (
        <div>
            <h1>Room: {roomName}</h1>
            <p>Status: {status}</p>
            <h2>Users:</h2>
            <video id="localVideo" autoPlay playsInline muted />
            <ul>
                {users.map(user => (
                    <li key={user.user_id}>
                        {user.username}
                        <video id={`video-${user.user_id}`} autoPlay playsInline />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Room;
