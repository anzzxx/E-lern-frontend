import React, { useState } from 'react';

const ControlsComponent = ({ onToggleAudio, onToggleVideo }) => {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  const handleToggleAudio = () => {
    onToggleAudio();
    setAudioEnabled((prev) => !prev);
  };

  const handleToggleVideo = () => {
    onToggleVideo();
    setVideoEnabled((prev) => !prev);
  };

  return (
    <div className="controls">
      <button onClick={handleToggleAudio}>{audioEnabled ? 'Audio Mute' : 'Audio Unmute'}</button>
      <button onClick={handleToggleVideo}>{videoEnabled ? 'Video Off' : 'Video On'}</button>
    </div>
  );
};

export default ControlsComponent;