import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import '../../styles/app.css';
import { useDispatch, useSelector } from "react-redux";
import { Card, ListGroup, Button } from 'react-bootstrap';
import { fetchTests } from "../../Redux/Slices/TestSlice";
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
function PlayCourse() {
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const { id } = useParams();
    const course = useSelector(state =>
        state.courses.courses.find(course => String(course.id) === id)
    );
    const tests=useSelector((state)=>state.tests.data)
    const filteredTests = tests.filter((test) => test.course === parseInt(id, 10));
    console.log(filteredTests);
    
    useEffect(()=>{
        dispatch(fetchTests()) 
    },[])
    const fixedVideoUrl = course.preview_video?.replace("video/upload/", "");
    const prevcourse = {
        "id": course.id,
        "title": course.title,
        "description": course.description,
        "video_url": fixedVideoUrl,
    };

    const [video, setVideo] = useState(prevcourse);
    const lessons = course ? course.lessons || [] : [];

    const handleVideoSelect = (selectedVideo) => {
        setVideo(selectedVideo);
    };

    console.log('vdo', video);

    // Static playlist array
    const playlist = lessons;

    // Dummy comments
    const comments = [
        { id: 1, text: 'Great video! Never gets old.' },
        { id: 2, text: 'Rickrolled again! 😂' },
    ];



    // Static quiz data
    const quizzes = filteredTests

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
                        <video key={video.video_url} width="100%" height="auto" controls>
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
            <div className="comments">
                <div className="comment-container">
                    <div className="left-section">
                        <Card style={{ width: '100%', border: 'none', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                            <Card.Header className="bg-primary text-white">
                                <h2 className="mb-0">Quizzes</h2>
                            </Card.Header>
                            <ListGroup variant="flush">
                                {quizzes.map((quiz) => (
                                    <ListGroup.Item key={quiz.id} className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h5 className="mb-1">{quiz.title}</h5>
                                            
                                        </div>
                                        <Button variant="outline-primary" size="sm" onClick={()=>navigate(`/mcq/test/${quiz.id}`)}>
                                            Start
                                        </Button>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card>
                    </div>
                    <div className="right-section">
                        <h3>Comments</h3>
                        {comments.map(comment => (
                            <div key={comment.id} className="comment">
                                <p>{comment.text}</p>
                            </div>
                        ))}
                        <form>
                            <textarea placeholder="Add a comment..." />
                            <button type="submit">Post</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlayCourse;