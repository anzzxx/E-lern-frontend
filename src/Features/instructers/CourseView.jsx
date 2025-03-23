import { useParams } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import '../../styles/app.css';
import { useDispatch, useSelector } from "react-redux";
import ReviewAndChart from "./ReviewAndChart";

function CourseView() {

    const { id } = useParams();
    
    // Handle video selectionconst { id } = useParams();
    const course = useSelector(state =>
        state.courses.courses.find(course => String(course.id) === id)
    );
    console.log(`course${JSON.stringify(course)}`);

    const fixedVideoUrl = course.preview_video?.replace("video/upload/", "");
    const prevcourse = {
        "id": course.id,
        "title": course.title,
        "description": course.description,
        "video_url": fixedVideoUrl,

    }


    const lessons = course ? course.lessons || [] : [];

    const [video, setVideo] = useState(prevcourse);
    const handleVideoSelect = (selectedVideo) => {
        setVideo(selectedVideo);
    };
    

    // Static playlist array
    const playlist = lessons
    // Dummy comments
    const comments = [
        { id: 1, text: 'Great video! Never gets old.' },
        { id: 2, text: 'Rickrolled again! 😂' },
    ];

    //Reviews
   
    return (
        <div className="app">
            <div className="common-container">
                {/* Playlist on the left side */}
                <div className="playlist">
                    <h3>Playlist</h3>
                    <div className="playlist-items">
                        {playlist.map(video => (
                            <div key={video.id} className="playlist-item" onClick={() => handleVideoSelect(video)}>
                                <video width="150" height="90" controls={false} poster={video.thumbnail}>
                                    <source src={video.video_url} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                                <div className="playlist-item-info">
                                    <p className="playlist-item-title">{video.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

                {/* Video Player */}
                <div className="video-player">
                    {video ? (
                        <video width="100%" height="auto" controls>
                            <source src={video.video_url} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    ) : (
                        <p>Select a video to play</p>
                    )}
                </div>
            </div>

            {/* Title and Description */}
            <div className="video-info">
                <h2 className="video-title">{video ? video.title : 'Welcome to the Course!'}</h2>
                <p className="video-description">
                    {video ? video.description : 'Select a video from the playlist to get started.'}
                </p>
            </div>

            {/* Comments Section */}
           <ReviewAndChart courseId={course.id}/>
        </div>

    );
};

export default CourseView
