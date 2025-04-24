"use client";
import React from "react";

const CourseStats = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      lineHeight: 'normal',
      width: '37%',
      marginLeft: '0px',
      '@media (max-width: 991px)': {
        width: '100%'
      }
    }}>
      <article style={{
        display: 'flex',
        flexGrow: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
        fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
        '@media (max-width: 991px)': {
          marginTop: '39px'
        }
      }}>
        <h3 style={{
          color: 'rgba(63, 63, 68, 1)',
          fontSize: '17px',
          fontWeight: 600,
          alignSelf: 'flex-start',
          margin: 0
        }}>
          Course Stats
        </h3>
        
        <div style={{
          borderRadius: '4px',
          boxShadow: '0px 11px 23px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(239, 239, 239, 1)',
          display: 'flex',
          marginTop: '12px',
          width: '100%',
          padding: '9px 9px 17px',
          flexDirection: 'column',
          alignItems: 'center',
          fontSize: '7px',
          color: 'rgba(0, 0, 0, 1)',
          fontWeight: 400
        }}>
          <div style={{
            alignSelf: 'stretch',
            display: 'flex',
            alignItems: 'stretch',
            gap: '39px',
            textAlign: 'center'
          }}>
            <div style={{
              display: 'flex',
              marginTop: 'auto',
              marginBottom: 'auto',
              alignItems: 'center',
              gap: '4px',
              flex: 1
            }}>
              <span style={{
                borderRadius: '2px',
                backgroundColor: 'rgba(252, 107, 87, 1)',
                display: 'flex',
                width: '11px',
                flexShrink: 0,
                height: '10px'
              }} />
              <span>Point Prograss</span>
            </div>
            
            <div style={{
              borderRadius: '2px',
              backgroundColor: 'rgba(236, 237, 243, 1)',
              display: 'flex',
              padding: '3px 7px',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
              flex: 1,
              '@media (max-width: 991px)': {
                whiteSpace: 'initial'
              }
            }}>
              <span>Monthly</span>
              <img
                style={{
                  aspectRatio: '1.33',
                  objectFit: 'contain',
                  objectPosition: 'center',
                  width: '4px',
                  marginTop: 'auto',
                  marginBottom: 'auto',
                  flexShrink: 0
                }}
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/5a4c6b3386d79c0e0312f38cc2859a60bad5da23?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c"
                alt="Dropdown"
              />
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            aspectRatio: '1',
            marginTop: '10px',
            width: '85px',
            padding: '31px 18px',
            fontFamily: 'IBM Plex Sans, -apple-system, Roboto, Helvetica, sans-serif',
            fontSize: '19px',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            textAlign: 'center',
            letterSpacing: '-0.19px',
            '@media (max-width: 991px)': {
              whiteSpace: 'initial'
            }
          }}>
            <img
              style={{
                position: 'absolute',
                inset: 0,
                height: '100%',
                width: '100%',
                objectFit: 'cover',
                objectPosition: 'center'
              }}
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/84fa2380c5550ce5833d792f5573201f5bab27cd?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c"
              alt="Chart background"
            />
            <span style={{ position: 'relative', zIndex: 1 }}>8.966</span>
          </div>
          
          <p style={{
            color: 'rgba(63, 63, 68, 1)',
            margin: '12px 0 0'
          }}>
            Course Sale 40%
          </p>
          
          <p style={{
            color: 'rgba(63, 63, 68, 1)',
            margin: '6px 0 0'
          }}>
            Course Watched 30%
          </p>
        </div>
      </article>
    </div>
  );
};

export default CourseStats;