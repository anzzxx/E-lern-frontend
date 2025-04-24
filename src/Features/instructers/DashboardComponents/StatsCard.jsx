import React from "react";

const StatsCard = ({ type, icon, title, value, bgColor }) => {
  return (
    <article style={{
      borderRadius: '0px',
      alignSelf: 'stretch',
      marginTop: 'auto',
      marginBottom: 'auto',
      width: '200px'
    }}>
      <div style={{
        borderRadius: '4px',
        backgroundColor: bgColor || 'rgba(255, 243, 237, 1)',
        display: 'flex',
        padding: '19px 11px',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'center',
        ...(type === "students" || type === "course" ? {
          '@media (max-width: 991px)': {
            padding: '17px 20px'
          }
        } : {
          '@media (max-width: 991px)': {
            padding: '19px 11px'
          }
        })
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'flex-start'
        }}>
          <img
            style={{
              aspectRatio: '1',
              objectFit: 'contain',
              objectPosition: 'center',
              width: '33px',
              alignSelf: 'center'
            }}
            src={icon}
            alt={title}
          />
          <div style={{ marginTop: '12px', width: '100%' }}>
            <h3 style={{
              fontSize: '10px',
              fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
              fontWeight: 600,
              color: 'rgba(62, 67, 95, 1)',
              margin: 0
            }}>
              {title}
            </h3>
            <p style={{
              fontSize: '16px',
              fontFamily: 'Work Sans, -apple-system, Roboto, Helvetica, sans-serif',
              fontWeight: 500,
              textAlign: 'center',
              margin: '6px 0 0',
              color: 'rgba(62, 67, 95, 1)'
            }}>
              {value}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default StatsCard;