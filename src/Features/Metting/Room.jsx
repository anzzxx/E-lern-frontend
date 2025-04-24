import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from "react-redux";

function Room() {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState('Connecting...');
  const ws = useRef(null);
  const peerConnections = useRef({});
  const roomName = 'test_room';
  const token = useSelector((state) => state.auth?.accessToken || null);
  const ownChannelName = useRef(null);
  const initiatedOffers = useRef(new Set());
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 2000; // 2 seconds

  // Initialize WebSocket connection
  useEffect(() => {
    if (!token) {
      setStatus('No token available');
      return;
    }

    const connectWebSocket = () => {
      console.log(`Attempting WebSocket connection (attempt ${reconnectAttempts.current + 1})`);
      const socket = new WebSocket(`ws://127.0.0.1:8000/ws/meeting/${roomName}/?token=${token}`);

      socket.onopen = () => {
        setStatus('Connected');
        console.log('WebSocket connected');
        reconnectAttempts.current = 0; // Reset reconnect attempts
      };

      socket.onmessage = async (e) => {
        const data = JSON.parse(e.data);
        console.log('Received message:', data.type, data);

        switch (data.type) {
          case 'user_list':
            setUsers(data.users);
            await updatePeerConnections(data.users);
            break;
          case 'user_joined':
            console.log(`User joined: ${data.channel_name}, waiting for user_list update`);
            break;
          case 'webrtc_offer':
            await handleOffer(data.sender_channel_name, data.offer);
            break;
          case 'webrtc_answer':
            await handleAnswer(data.sender_channel_name, data.answer);
            break;
          case 'ice_candidate':
            await handleIceCandidate(data.sender_channel_name, data.candidate);
            break;
          case 'connection_established':
            logConnection(data.sender_channel_name);
            break;
          default:
            console.log('Unknown message type:', data.type);
        }
      };

      socket.onerror = (e) => {
        console.error('WebSocket error:', e);
        setStatus('Error');
      };

      socket.onclose = (e) => {
        console.log('WebSocket closed:', e);
        setStatus('Disconnected');
        cleanupPeerConnections();

        if (e.code === 4002 && reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current += 1;
          console.log(`Reconnecting in ${reconnectDelay}ms (attempt ${reconnectAttempts.current}/${maxReconnectAttempts})`);
          setTimeout(connectWebSocket, reconnectDelay);
        } else if (reconnectAttempts.current >= maxReconnectAttempts) {
          console.error('Max reconnect attempts reached. Please check server configuration.');
          setStatus('Connection failed');
        }
      };

      ws.current = socket;
    };

    connectWebSocket();

    return () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.close();
      }
      cleanupPeerConnections();
    };
  }, [token]);

  // Initialize or update peer connections based on user list
  const updatePeerConnections = async (users) => {
    const userId = tokenUserId();
    if (userId && !ownChannelName.current) {
      const user = users.find(u => u.user_id === userId);
      if (user) {
        ownChannelName.current = user.channel_name;
        console.log(`Set ownChannelName to ${ownChannelName.current} for user_id ${userId}`);
      } else {
        console.warn('Own user not found in user_list, userId:', userId);
      }
    }

    for (const user of users) {
      if (user.channel_name === ownChannelName.current) continue;
      if (!peerConnections.current[user.channel_name]) {
        initializePeerConnection(user.channel_name);
        if (
          ownChannelName.current &&
          ownChannelName.current < user.channel_name &&
          !initiatedOffers.current.has(user.channel_name)
        ) {
          initiatedOffers.current.add(user.channel_name);
          await createOfferForNewUser(user.channel_name);
        }
      }
    }

    for (const channelName of Object.keys(peerConnections.current)) {
      if (!users.some(user => user.channel_name === channelName)) {
        console.log(`Removing peer connection for ${channelName}`);
        peerConnections.current[channelName].close();
        delete peerConnections.current[channelName];
        initiatedOffers.current.delete(channelName);
      }
    }
  };

  const tokenUserId = () => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user_id;
    } catch (e) {
      console.error('Failed to parse token:', e);
      return null;
    }
  };

  const initializePeerConnection = (targetChannelName) => {
    console.log(`Initializing peer connection for ${targetChannelName}`);
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    pc.onicecandidate = (e) => {
      if (e.candidate && ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({
          type: 'ice_candidate',
          target_channel_name: targetChannelName,
          data: e.candidate,
        }));
        console.log(`Sent ICE candidate to ${targetChannelName}`);
      }
    };

    pc.onconnectionstatechange = () => {
      console.log(`Connection state changed for ${targetChannelName}: ${pc.connectionState}`);
      if (pc.connectionState === 'connected') {
        logConnection(targetChannelName);
        if (ws.current?.readyState === WebSocket.OPEN) {
          ws.current.send(JSON.stringify({
            type: 'connection_established',
            target_channel_name: targetChannelName,
            data: {}
          }));
          console.log(`Sent connection_established to ${targetChannelName}`);
        }
      }
    };

    peerConnections.current[targetChannelName] = pc;
  };

  const logConnection = (targetChannelName) => {
    const now = new Date().toISOString();
    console.log(`Connection established with ${targetChannelName} at ${now}`);
  };

  const createOfferForNewUser = async (targetChannelName) => {
    if (!peerConnections.current[targetChannelName]) {
      initializePeerConnection(targetChannelName);
    }

    const pc = peerConnections.current[targetChannelName];
    if (pc.signalingState !== 'stable') {
      console.log(`Skipping offer to ${targetChannelName}: PC not in stable state (${pc.signalingState})`);
      return;
    }

    try {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({
          type: 'webrtc_offer',
          target_channel_name: targetChannelName,
          data: offer,
        }));
        console.log(`Sent offer to ${targetChannelName}`);
      }
    } catch (err) {
      console.error(`Failed to create offer for ${targetChannelName}:`, err);
    }
  };

  const handleOffer = async (senderChannelName, offer) => {
    if (!peerConnections.current[senderChannelName]) {
      initializePeerConnection(senderChannelName);
    }

    const pc = peerConnections.current[senderChannelName];
    if (pc.signalingState !== 'stable') {
      console.log(`Ignoring offer from ${senderChannelName}: PCDeposit not in stable state (${pc.signalingState})`);
      return;
    }

    try {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({
          type: 'webrtc_answer',
          target_channel_name: senderChannelName,
          data: answer,
        }));
        console.log(`Sent answer to ${senderChannelName}`);
      }
    } catch (err) {
      console.error(`Failed to handle offer from ${senderChannelName}:`, err);
    }
  };

  const handleAnswer = async (senderChannelName, answer) => {
    const pc = peerConnections.current[senderChannelName];
    if (!pc) {
      console.error(`No peer connection found for ${senderChannelName}`);
      return;
    }

    if (pc.signalingState !== 'have-local-offer') {
      console.log(`Ignoring answer from ${senderChannelName}: PC not in have-local-offer state (${pc.signalingState})`);
      return;
    }

    try {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
      console.log(`Processed answer from ${senderChannelName}`);
    } catch (err) {
      console.error(`Failed to handle answer from ${senderChannelName}:`, err);
    }
  };

  const handleIceCandidate = async (senderChannelName, candidate) => {
    const pc = peerConnections.current[senderChannelName];
    if (!pc) {
      console.error(`No peer connection found for ${senderChannelName}`);
      return;
    }

    try {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
      console.log(`Added ICE candidate from ${senderChannelName}`);
    } catch (err) {
      console.error(`Failed to add ICE candidate from ${senderChannelName}:`, err);
    }
  };

  const cleanupPeerConnections = () => {
    console.log('Cleaning up peer connections');
    Object.values(peerConnections.current).forEach(pc => pc.close());
    peerConnections.current = {};
    initiatedOffers.current.clear();
  };

  return (
    <div>
      <h1>Room: {roomName}</h1>
      <p>Status: {status}</p>
      <h2>Users:</h2>
      <ul>
        {users.map((user) => (
          <li key={user.channel_name}>{user.username}</li>
        ))}
      </ul>
    </div>
  );
}

export default Room;