import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect, useRef } from 'react';
import '../../styles/app.css';
import { useDispatch, useSelector } from "react-redux";
import { Card, ListGroup, Button } from 'react-bootstrap';
import { fetchTests } from "../../Redux/Slices/TestSlice";
import { fetchLesson } from "../../Redux/Slices/lessonsSlice";
import { fetchEnrolledCourses } from "../../Redux/Slices/enrollmentSlice";
import ReusableForm from "../../components/ReusableForm";
import * as yup from "yup";
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import api from "../../Redux/api";
import Message from "../../components/Message";

function PlayCourse() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();
    const [showCard, setShowCard] = useState(false);
    const [message, setMessage] = useState({});
    const [showModal, setShowModal] = useState(false);
    
    const { courses, stats, loading, error } = useSelector((state) => state.enrollments);
    const course = courses.find((course) => course.id === parseInt(id, 10));
    const filteredTests = useSelector((state) => state.tests.data);

    // Add ref for video element
    const videoRef = useRef(null);

    useEffect(() => {
        dispatch(fetchTests(33));
        dispatch(fetchLesson(parseInt(id, 10)));
        dispatch(fetchEnrolledCourses());
    }, [dispatch, id]);

    const fixedVideoUrl = course.preview_video?.replace("video/upload/", "");
    const prevcourse = {
        "id": course.id,
        "title": course.title,
        "description": course.description,
        "video_url": fixedVideoUrl,
    };

    const [video, setVideo] = useState(prevcourse);

    const handleVideoSelect = (selectedVideo) => {
        setVideo(selectedVideo);
    };

    // Static playlist array
    const playlist = useSelector((state) => state.lesson.lessons) || [];

    // Dummy comments
    const comments = [
        { id: 1, text: 'Great video! Never gets old.' },
        { id: 2, text: 'Rickrolled again! 😂' },
    ];

    const ReportFields = [
        { name: "reason", label: "Reason", type: "text", placeholder: "Provide a reason to report this course" },
    ];
    const reportCourseSchema = yup.object().shape({
        reason: yup.string().required("This field is required"),
    });

    const handleReportCourse = async (formData) => {
        if (!formData.reason) {
            console.error("Form Data Missing Required Fields:", formData);
            return;
        }

        const Data = {
            ...formData,
            course: course.id,
        };

        try {
            const response = await api.post("course/report-course/", Data);
            setMessage({ type: "success", message: "Course reported successfully" });
        } catch (error) {
            if (error.response) {
                setMessage({
                    message: error.response.data.message || "Something went wrong!",
                    type: "error",
                });
            } else if (error.request) {
                setMessage({
                    message: "No response from server. Please try again.",
                    type: "error",
                });
            } else {
                setMessage({
                    message: "An error occurred. Please try again.",
                    type: "error",
                });
            }
        }
    };

    // Static quiz data
    const quizzes = filteredTests;

    const onHide = () => {
        setMessage(null);
    };

    useEffect(() => {
        if (videoRef.current) {
            const handleVideoEnd = async () => {
                try {
                    // Trigger the API to mark the lesson as watched
                    console.log("triggerd");
                    
                    await api.post("lessons/lesson-progress/", {
                        lesson: video.id,
                        completed:true,
                    });
                    console.log("Lesson marked as watched!");
                } catch (error) {
                    console.error("Failed to mark lesson as watched", error);
                }
            };

            const videoElement = videoRef.current;
            videoElement.addEventListener("ended", handleVideoEnd);

            return () => {
                videoElement.removeEventListener("ended", handleVideoEnd);
            };
        }
    }, [video]);

    return (
        <>
            <div className="app">
                <div className="common-container">
                    {/* Playlist on the left side */}
                    <div className="playlist">
                        <h3>Lessons</h3>
                        <div className="playlist-items">
                            {playlist.map((video) => (
                                <div
                                    key={video.id}
                                    className="playlist-item"
                                    onClick={() => handleVideoSelect(video)}
                                >
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
                            <video ref={videoRef} key={video.video_url} width="100%" height="auto" controls>
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
                                            <Button variant="outline-primary" size="sm" onClick={() => navigate(`/mcq/test/${quiz.id}/${id}/`)}>
                                                Start
                                            </Button>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </Card>
                        </div>

                        <div className="right-section">
                            <h3>Comments</h3>
                            {comments.map((comment) => (
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

            {/* Modal for Report Form */}
            <div className={`app ${showModal ? 'modal-open' : ''}`}>
                <button className="report-button" onClick={() => setShowModal(true)}>
                    Report Course
                </button>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title">Report This Course</h3>
                            <button className="close-button" onClick={() => setShowModal(false)}>
                                &times;
                            </button>
                        </div>

                        <ReusableForm
                            fields={ReportFields}
                            validationSchema={reportCourseSchema}
                            onSubmit={(data) => {
                                handleReportCourse(data);
                                setShowModal(false);
                            }}
                            submitButtonText="Submit Report"
                            cancelButtonText="Cancel"
                            onCancel={() => setShowModal(false)}
                        />
                    </div>
                </div>
            )}

            {message && <Message message={message.message} type={message.type} onHide={onHide} />}
        </>
    );
}

export default PlayCourse;
