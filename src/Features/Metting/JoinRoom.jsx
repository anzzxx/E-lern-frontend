import { useState } from "react";
import { useNavigate } from "react-router-dom";

function JoinMeeting() {
  const [meetingId, setMeetingId] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    if (meetingId.trim() === "") return;
    navigate(`/room/join/${meetingId}/`);
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '50px auto',
      padding: '20px',
      textAlign: 'center',
      border: '1px solid #ddd',
      borderRadius: '8px'
    }}>
      <h2>Join Meeting</h2>
      
      <input 
        type="text" 
        value={meetingId} 
        onChange={(e) => setMeetingId(e.target.value)} 
        placeholder="Enter meeting ID"
        style={{
          padding: '10px',
          width: '100%',
          margin: '15px 0',
          borderRadius: '4px',
          border: '1px solid #ccc',
          fontSize: '16px'
        }}
      />
      
      <button 
        onClick={handleJoin}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px',
          width: '100%'
        }}
        disabled={!meetingId.trim()}
      >
        Join Meeting
      </button>
    </div>
  );
}

export default JoinMeeting;