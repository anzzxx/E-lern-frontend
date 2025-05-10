import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateMeetingButton = () => {
  const [meetingId, setMeetingId] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const navigate = useNavigate();

  const generateMeetingId = () => {
    // Generate a random 10-character alphanumeric ID
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setMeetingId(result);
    setIsCopied(false);
  };

  const copyToClipboard = () => {
    if (meetingId) {
      navigator.clipboard.writeText(meetingId);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const joinMeeting = () => {
    if (meetingId) {
      navigate(`/room/join/${meetingId}/`);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <button
        onClick={generateMeetingId}
        style={{
          padding: '10px 15px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
          marginBottom: '10px'
        }}
      >
        Create New Meeting
      </button>

      {meetingId && (
        <div style={{ marginTop: '15px' }}>
          <p>Meeting ID: <strong>{meetingId}</strong></p>
          <button
            onClick={copyToClipboard}
            style={{
              padding: '8px 12px',
              backgroundColor: isCopied ? '#4CAF50' : '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
            disabled={isCopied}
          >
            {isCopied ? 'Copied!' : 'Copy Meeting ID'}
          </button>
          <button
            onClick={joinMeeting}
            style={{
              padding: '8px 12px',
              backgroundColor: '#FF5722',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Join Meeting
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateMeetingButton;