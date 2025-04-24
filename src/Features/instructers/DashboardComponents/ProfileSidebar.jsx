"use client";
import React from "react";
import EarningsCard from "./EarningsCard";
import PopularCourses from "./PopularCourses";
import StudentLocations from "./StudentLocations";

const ProfileSidebar = () => {
  return (
    <aside style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      lineHeight: 'normal',
      width: '26%',
      marginLeft: '20px',
      '@media (max-width: 991px)': {
        width: '100%'
      }
    }}>
      <div style={{
        borderRadius: '15px',
        backgroundColor: 'rgba(255, 255, 255, 1)',
        boxShadow: '-7px 3px 22px rgba(146, 146, 146, 0.1)',
        border: '1px solid rgba(0, 0, 0, 0.06)',
        marginTop: 'auto',
        marginBottom: 'auto',
        padding: '22px 12px 55px',
        alignSelf: 'stretch',
        width: '100%',
        '@media (max-width: 991px)': {
          marginTop: '32px'
        }
      }}>
        <div>
          <section style={{
            width: '118px',
            maxWidth: '100%',
            fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif'
          }}>
            <h2 style={{
              color: 'rgba(0, 0, 0, 1)',
              fontSize: '16px',
              fontWeight: 600,
              margin: 0
            }}>
              Profile
            </h2>
            <div style={{
              display: 'flex',
              marginTop: '10px',
              width: '100%',
              alignItems: 'center',
              gap: '5px',
              justifyContent: 'flex-start'
            }}>
              <img
                style={{
                  aspectRatio: '1.02',
                  objectFit: 'contain',
                  objectPosition: 'center',
                  width: '47px',
                  borderRadius: '326px',
                  alignSelf: 'stretch',
                  marginTop: 'auto',
                  marginBottom: 'auto',
                  flexShrink: 0
                }}
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/99a81f094358e8383f998e571dfdb361fa82943d?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c"
                alt="Profile"
              />
              <div style={{
                alignSelf: 'stretch',
                marginTop: 'auto',
                marginBottom: 'auto',
                width: '66px'
              }}>
                <h3 style={{
                  color: 'rgba(0, 0, 0, 1)',
                  fontSize: '12px',
                  fontWeight: 500,
                  margin: 0
                }}>
                  Manav
                </h3>
                <p style={{
                  color: 'rgba(63, 63, 68, 1)',
                  fontSize: '9px',
                  fontWeight: 400,
                  margin: 0
                }}>
                  UI/UX Designer
                </p>
              </div>
            </div>
          </section>

          <EarningsCard />

          <PopularCourses />

          <hr style={{
            borderColor: 'rgba(0, 0, 0, 0.27)',
            minHeight: '0px',
            marginTop: '26px',
            width: '100%'
          }} />

          <StudentLocations />
        </div>
      </div>
    </aside>
  );
};

export default ProfileSidebar;