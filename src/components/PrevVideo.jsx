import React, { useRef, useState, useEffect } from "react";
import { FaPlay } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllCourses } from "../Redux/Slices/CoursesSlice";
import { useParams } from "react-router-dom";
import "../styles/videoplyer.css";

const PrevVideoPlayer = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { allCourses } = useSelector((state) => state.courses);

  useEffect(() => {
    dispatch(fetchAllCourses());
  }, [dispatch]);

  const selectedCourse = allCourses?.find((course) => course.id.toString() === id);

  // Process URLs
  const videoUrl = selectedCourse?.preview_video?.replace("video/upload/", "") || "";
  const thumbnailUrl = selectedCourse?.thumbnail?.replace("image/upload/", "") || "";

  const videoRef = useRef(null);
  const [showVdo, setShowVdo] = useState(false);

  // Toggle between video and thumbnail
  const handleToggle = () => {
    setShowVdo((prev) => !prev);

    if (!showVdo) {
      videoRef.current?.play();
    } else {
      videoRef.current?.pause();
    }
  };

  if (!selectedCourse) return <p>Loading video...</p>;

  return (
    <>
    <div className="video-container" onClick={handleToggle}>
      {!showVdo ? (
        <div className="media-container">
          <img src={thumbnailUrl} alt="Video Thumbnail" className="media" />
          <button className="play-button">
            <FaPlay />
          </button>
        </div>
      ) : (
        <div className="media-container">
          <video ref={videoRef} className="media" autoPlay muted>
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
    
    </>
  );
};

export default PrevVideoPlayer;
