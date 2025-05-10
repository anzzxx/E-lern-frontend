import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Carousel from 'react-bootstrap/Carousel';
import { useNavigate } from 'react-router-dom';
import '../styles/Banner.css';

function Banner() {
  const courses = useSelector((state) => state.courses.allCourses);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!courses || courses.length === 0) return;
    
    const interval = setInterval(() => {
      if (!isHovered) {
        setActiveIndex((prevIndex) => (prevIndex + 1) % courses.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [courses, isHovered]);

  const cleanThumbnailUrl = (url) => {
    if (!url) return '';
    return url.replace('image/upload/https://', 'https://')
             .replace('image/upload/', '');
  };

  const handleCourseClick = (id) => {
    navigate(`/course/${id}`);
  };

  const handleSelect = (selectedIndex) => {
    setActiveIndex(selectedIndex);
  };

  if (!courses || courses.length === 0) {
    return null;
  }

  return (
    <div 
      className="banner-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Carousel 
        activeIndex={activeIndex}
        onSelect={handleSelect}
        fade
        indicators={true}
        controls={courses.length > 1}
        interval={null}
      >
        {courses.map((course) => {
          const thumbnailUrl = cleanThumbnailUrl(course.thumbnail);
          
          return (
            <Carousel.Item key={course.id}>
              <div 
                className="banner-image-container"
                style={{ backgroundImage: thumbnailUrl ? `url(${thumbnailUrl})` : 'none' }}
              >
                <div className="banner-image-overlay" />
              </div>
              <Carousel.Caption className="banner-content-container">
                <div className="banner-animated-content">
                  <h1 className="banner-title">
                    {course.title}
                  </h1>
                  <p className="banner-description">
                    {course.description?.split('\r\n')[0]}
                  </p>
                  <div className="banner-meta-container">
                    <span className="banner-instructor">
                      By {course.instructor?.name || 'Unknown Instructor'}
                    </span>
                    <span className="banner-price">
                      ${course.price}
                    </span>
                  </div>
                  <button 
                    className="banner-enroll-button"
                    onClick={() => handleCourseClick(course.id)}
                  >
                    Enroll Now
                  </button>
                </div>
              </Carousel.Caption>
            </Carousel.Item>
          );
        })}
      </Carousel>
    </div>
  );
}

export default Banner;