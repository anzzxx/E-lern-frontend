import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

const RemoteVideos = forwardRef(({ mapPeers }, ref) => {
  const containerRef = useRef(null);

  const createVideo = (peerUsername) => {
    const videoContainer = containerRef.current;
    const remoteVideo = document.createElement('video');
    remoteVideo.id = `${peerUsername}-video`;
    remoteVideo.autoplay = true;
    remoteVideo.playsInline = true;
    remoteVideo.muted = false;

    const videoWrapper = document.createElement('div');
    videoWrapper.className = 'remote-video-wrapper';
    videoWrapper.id = `wrapper-${peerUsername}`;

    videoContainer.appendChild(videoWrapper);
    videoWrapper.appendChild(remoteVideo);

    // Set up WebRTC track handling
    const peer = mapPeers.current[peerUsername]?.[0];
    if (peer) {
      const remoteStream = new MediaStream();
      remoteVideo.srcObject = remoteStream;
      peer.ontrack = (event) => {
        console.log('Received track:', event.track.kind);
        remoteStream.addTrack(event.track);
      };
    }

    return remoteVideo;
  };

  const removeVideo = (video) => {
    const videoWrapper = video.parentNode;
    if (videoWrapper && videoWrapper.parentNode) {
      videoWrapper.parentNode.removeChild(videoWrapper);
    }
  };

  // Expose createVideo and removeVideo to parent
  useImperativeHandle(ref, () => ({
    createVideo,
    removeVideo,
  }));

  return <div className="remote-videos" ref={containerRef}></div>;
});

export default RemoteVideos;