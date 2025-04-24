import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Studentjoin() {
  const [roomName, setRoomName] = useState('');
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    const trimmedRoomName = roomName.trim();

    if (!trimmedRoomName) {
      alert('Please enter a room name');
      return;
    }

    navigate(`/join/meeting/${trimmedRoomName}`);
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h2>join meeting</h2>
      
      <div style={{ margin: '20px 0' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          Room Name:
        </label>
        <input
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Enter room name"
          style={{ width: '100%', padding: '10px' }}
          required
        />
      </div>

      <button 
        onClick={handleCreateRoom}
        style={{
          padding: '10px 20px',
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
          width: '100%'
        }}
      >
        Create Room
      </button>
    </div>
  );
}

export default Studentjoin;