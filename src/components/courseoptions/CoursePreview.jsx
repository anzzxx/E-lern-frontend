import React, { useRef, useState, useEffect } from "react";
import Lessons from "../../components/courseoptions/Lessons";
import { set } from "lodash";

const CoursePreview = ({ course,handleCreateLessons,showModal,isLoading,setLesson,setShowModal }) => {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  const fixedImageUrl = course.thumbnail?.replace("image/upload/", "");
  const fixedVideoUrl = selectedLesson ? selectedLesson.video_url
    : course.preview_video?.replace("video/upload/", "");
  
  // Format time (seconds to MM:SS)
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  setLesson(selectedLesson);
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleProgressChange = (e) => {
    const newTime = (e.target.value / 100) * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleFullscreen = () => {
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    } else if (videoRef.current.webkitRequestFullscreen) {
      videoRef.current.webkitRequestFullscreen();
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    
    const updateProgress = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
        setCurrentTime(video.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      video.volume = volume;
    };

    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [volume]);

  // Reset playback when selected lesson changes
  useEffect(() => {
    if (selectedLesson && videoRef.current) {
      videoRef.current.load();
      setIsPlaying(false);
    }
  }, [selectedLesson]);

  return (
    <div style={{
      backgroundColor: '#fff',
      padding: '16px',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginBottom: '24px',
      width: '100%'
    }}>
      {/* Video Player */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingBottom: '56.25%',
        backgroundColor: '#000',
        borderRadius: '4px',
        marginBottom: '12px',
        overflow: 'hidden'
      }}>
        <video
          ref={videoRef}
          src={fixedVideoUrl}
          poster={!selectedLesson ? fixedImageUrl : undefined}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          onClick={togglePlay}
        />
        
        {!isPlaying && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            backgroundColor: 'rgba(0,0,0,0.3)',
            cursor: 'pointer'
          }} onClick={togglePlay}>
            <div style={{
              textAlign: 'center',
              padding: '20px'
            }}>
              <div style={{
                fontSize: '48px',
                marginBottom: '16px'
              }}>▶</div>
              <p>{selectedLesson ? selectedLesson.title : "Course Preview Video"}</p>
            </div>
          </div>
        )}

        {/* Video Controls */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <button onClick={togglePlay} style={{ color: '#fff', background: 'none', border: 'none' }}>
            {isPlaying ? '❚❚' : '▶'}
          </button>
          
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleProgressChange}
            style={{ flex: 1 }}
          />
          
          <span style={{ color: '#fff', fontSize: '12px' }}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          
          <button onClick={toggleMute} style={{ color: '#fff', background: 'none', border: 'none' }}>
            {isMuted ? '🔇' : '🔊'}
          </button>
          
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            style={{ width: '60px' }}
          />
          
          <button onClick={toggleFullscreen} style={{ color: '#fff', background: 'none', border: 'none' }}>
            ⛶
          </button>
        </div>
      </div>

      <h2 style={{
        fontSize: '20px',
        fontWeight: '600',
        marginBottom: '8px'
      }}>{selectedLesson ? selectedLesson.title : course.title}</h2>
      
      <p style={{
        color: '#4b5563',
        marginBottom: '12px'
      }}>{selectedLesson ? selectedLesson.description : course.description}</p>
      
      <Lessons 
        setSelectedLesson={setSelectedLesson} 
        addButton={true} 
        courseId={course.id}
        selectedLessonId={selectedLesson?.id}
        handleCreateLessons={handleCreateLessons}
        showModal={showModal}
        isLoading={isLoading}
        setShowModal={setShowModal}
        
      />
    </div>
  );
};

export default CoursePreview;