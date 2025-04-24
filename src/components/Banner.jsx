import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Carousel from 'react-bootstrap/Carousel';

function Banner() {
  const courses = useSelector((state) => state.courses.allCourses);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-rotate every 5 seconds when not hovered
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered && courses?.length > 0) {
        setActiveIndex((prevIndex) => (prevIndex + 1) % courses.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [courses?.length, isHovered]);

  const cleanThumbnailUrl = (url) => {
    if (!url) return '';
    return url.replace('image/upload/https://', 'https://')
             .replace('image/upload/', '');
  };

  // Dynamic styles
  const containerStyle = {
    position: 'relative',
    width: '98%',
    height: '80vh',
    maxHeight: '500px',
    overflow: 'hidden',
    borderRadius: '8px',
    marginLeft:"15px",
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.5s ease',
  };

  const imageStyle = {
    width: '100%',
    height: '100%',
    minHeight: '500px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    position: 'relative',
    transition: 'background-image 1s ease-in-out'
  };

  const imageOverlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to right, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.4))',
    zIndex: 1,
    transition: 'all 0.5s ease'
  };

  const contentStyle = {
    position: 'absolute',
    top: '50%',
    left: '10%',
    transform: 'translateY(-50%)',
    textAlign: 'left',
    width: '40%',
    padding: '20px',
    zIndex: 2,
    transition: 'all 0.5s ease'
  };

  // Handle manual slide change
  const handleSelect = (selectedIndex) => {
    setActiveIndex(selectedIndex);
  };

  return (
    <div 
      style={containerStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .carousel-control-prev, .carousel-control-next {
            width: 5%;
            opacity: 0.7;
            transition: opacity 0.3s ease;
          }
          .carousel-control-prev:hover, .carousel-control-next:hover {
            opacity: 1;
          }
          .carousel-indicators button {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin: 0 5px;
          }
        `}
      </style>
      
      <Carousel 
        activeIndex={activeIndex}
        onSelect={handleSelect}
        fade
        indicators={true}
        controls={courses?.length > 1}
        interval={null} // Disable default interval since we're using custom
      >
        {courses?.map((course) => {
          const thumbnailUrl = cleanThumbnailUrl(course.thumbnail);
          
          return (
            <Carousel.Item key={course.id}>
              <div style={{ 
                ...imageStyle, 
                backgroundImage: thumbnailUrl ? `url(${thumbnailUrl})` : 'none'
              }}>
                <div style={imageOverlayStyle} />
              </div>
              <Carousel.Caption style={contentStyle}>
                <div style={{
                  animation: 'fadeInUp 0.8s ease-out',
                  transition: 'all 0.5s ease'
                }}>
                  <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: '700',
                    marginBottom: '1rem',
                    color: '#fff',
                    lineHeight: '1.2',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                  }}>
                    {course.title}
                  </h1>
                  <p style={{
                    fontSize: '1rem',
                    color: 'rgba(255, 255, 255, 0.9)',
                    marginBottom: '1.5rem',
                    lineHeight: '1.5'
                  }}>
                    {course.description?.split('\r\n')[0]}
                  </p>
                  <div style={{
                    display: 'flex',
                    gap: '20px',
                    marginBottom: '1.5rem'
                  }}>
                    <span style={{ color: '#fff', fontWeight: '600', fontSize: '1rem' }}>
                      By {course.instructor?.name || 'Unknown Instructor'}
                    </span>
                    <span style={{ color: '#4CAF50', fontWeight: '600', fontSize: '1rem' }}>
                      ${course.price}
                    </span>
                  </div>
                  <button 
                    style={{
                      padding: '12px 30px',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '30px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#45a049';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#4CAF50';
                      e.target.style.transform = 'none';
                      e.target.style.boxShadow = 'none';
                    }}
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