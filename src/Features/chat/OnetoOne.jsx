import React, { useState, useEffect, useRef } from 'react';

const ChatComponent = ({ userId, recipientId, token }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const ws = useRef(null);
 
  
  useEffect(() => {
    ws.current = new WebSocket(`wss://api.elern.shop/ws/chat/direct/${recipientId}/?token=${token}`);

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [recipientId, token]);

  const sendMessage = () => {
    if (inputMessage.trim() && ws.current) {
      const message = {
        message: inputMessage,
      };
      ws.current.send(JSON.stringify(message));
      setInputMessage('');
    }
  };

  return (
    <div>
      <h2>Chat with User {recipientId}</h2>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.username}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatComponent;