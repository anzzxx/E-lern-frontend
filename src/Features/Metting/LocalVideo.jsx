import React, { useEffect, useRef } from 'react';

const LocalVideo = ({ localStream }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && localStream.current) {
      videoRef.current.srcObject = localStream.current;
      videoRef.current.muted = true;
    }
  }, [localStream]);

  return (
    <div className="local-video">
      <video ref={videoRef} autoPlay playsInline muted />
    </div>
  );
};

export default LocalVideo;