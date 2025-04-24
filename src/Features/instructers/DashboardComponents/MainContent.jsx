"use client";
import React from "react";
import StatsCard from "./StatsCard";
import CourseStats from "./CourseStats";
import WeeklySalesStats from "./WeeklySalesStats";

const MainContent = () => {
  return (
    <section style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      lineHeight: 'normal',
      width: '69%',
      marginLeft: '20px',
      '@media (max-width: 991px)': {
        width: '100%'
      }
    }}>
      <div style={{
        marginTop: 'auto',
        marginBottom: 'auto',
        width: '100%',
        alignSelf: 'stretch',
        '@media (max-width: 991px)': {
          maxWidth: '100%',
          marginTop: '40px'
        }
      }}>
        <header style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '40px 63px',
          fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
          fontWeight: 300,
          justifyContent: 'flex-start',
          flexWrap: 'wrap',
          '@media (max-width: 991px)': {
            maxWidth: '100%',
            marginRight: '2px'
          }
        }}>
          <div style={{ width: '171px' }}>
            <h2 style={{
              color: 'rgba(0, 0, 0, 1)',
              fontSize: '18px',
              margin: 0
            }}>
              Hello, <strong>Manav</strong>
            </h2>
            <p style={{
              color: '#000000',
              fontSize: '17px',
              margin: 0
            }}>
              Let's learn something new today!
            </p>
          </div>
          <div style={{
            display: 'flex',
            minWidth: '240px',
            alignItems: 'center',
            gap: '9px',
            fontSize: '9px',
            color: '#000000',
            justifyContent: 'flex-start'
          }}>
            <div style={{
              borderRadius: '0px',
              alignSelf: 'stretch',
              marginTop: 'auto',
              marginBottom: 'auto',
              width: '226px'
            }}>
              <input 
                style={{
                  borderRadius: '4px',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  display: 'flex',
                  width: '100%',
                  padding: '10px 12px',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  justifyContent: 'center',
                  fontSize: '9px',
                  fontFamily: 'inherit',
                  color: 'inherit',
                  background: 'transparent',
                  outline: 'none'
                }}
                placeholder="Search anything here..." 
              />
            </div>
            <img
              style={{
                aspectRatio: '1.09',
                objectFit: 'contain',
                objectPosition: 'center',
                width: '38px',
                borderRadius: '0px',
                alignSelf: 'stretch',
                marginTop: 'auto',
                marginBottom: 'auto',
                flexShrink: 0
              }}
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/0267aa66a24b5b472e05bfc461c13e727927cf11?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c"
              alt="Profile"
            />
          </div>
        </header>

        <section style={{
          display: 'flex',
          marginTop: '45px',
          alignItems: 'center',
          gap: '16px',
          color: 'rgba(62, 67, 95, 1)',
          justifyContent: 'flex-start',
          flexWrap: 'wrap',
          '@media (max-width: 991px)': {
            marginRight: '2px',
            marginTop: '40px'
          }
        }}>
          <StatsCard
            type="revenue"
            icon="https://cdn.builder.io/api/v1/image/assets/TEMP/ba974a23dff7af2a6bcb630110e43de2c8c2d550?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c"
            title="Total Revenue"
            value="$168.2"
            bgColor="rgba(255, 243, 237, 1)"
          />
          <StatsCard
            type="ratings"
            icon="https://cdn.builder.io/api/v1/image/assets/TEMP/5d74167e123d72ec86f34413750c2b737775b962?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c"
            title="Average Rating"
            value="4.8/5"
            bgColor="rgba(244, 246, 220, 1)"
          />
          <StatsCard
            type="students"
            icon="https://cdn.builder.io/api/v1/image/assets/TEMP/78b05c95266d781689a3e739c8efe17affef2767?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c"
            title="Total Student"
            value="5,622"
            bgColor="rgba(223, 243, 233, 1)"
          />
          <StatsCard
            type="course"
            icon="https://cdn.builder.io/api/v1/image/assets/TEMP/329061b27f456a8558e3d38f3c4e62409df09332?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c"
            title="Total Course"
            value="110"
            bgColor="rgba(255, 248, 224, 1)"
          />
        </section>

        <section style={{
          marginTop: '31px',
          fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
          fontSize: '16px',
          color: 'rgba(0, 0, 0, 1)',
          fontWeight: 600,
          '@media (max-width: 991px)': {
            maxWidth: '100%'
          }
        }}>
          <h2 style={{
            fontSize: '16px',
            margin: 0,
            '@media (max-width: 991px)': {
              maxWidth: '100%'
            }
          }}>
            Course Overview
          </h2>
          <img
            style={{
              aspectRatio: '2.92',
              objectFit: 'contain',
              objectPosition: 'center',
              width: '859px',
              borderRadius: '0px',
              marginTop: '15px',
              maxWidth: '100%'
            }}
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/7be277c516c8d072ac5d4953748733aabe419e58?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c"
            alt="Course overview chart"
          />
        </section>

        <section style={{
          marginTop: '36px',
          display: 'flex',
          gap: '20px',
          '@media (max-width: 991px)': {
            maxWidth: '100%',
            marginRight: '6px',
            flexDirection: 'column'
          }
        }}>
          <CourseStats />
          <WeeklySalesStats />
        </section>
      </div>
    </section>
  );
};

export default MainContent;