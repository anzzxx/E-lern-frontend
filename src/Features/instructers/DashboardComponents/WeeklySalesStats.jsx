import React from "react";

const WeeklySalesStats = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      lineHeight: 'normal',
      width: '63%',
      marginLeft: '20px',
      '@media (max-width: 991px)': {
        width: '100%'
      }
    }}>
      <article style={{
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        alignItems: 'stretch',
        '@media (max-width: 991px)': {
          marginTop: '39px'
        }
      }}>
        <h3 style={{
          color: 'rgba(63, 63, 68, 1)',
          fontSize: '12px',
          fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
          fontWeight: 600,
          alignSelf: 'flex-start',
          margin: 0
        }}>
          Weekly Sales Stats
        </h3>

        <div style={{
          borderRadius: '6px',
          backgroundColor: 'rgba(247, 247, 247, 1)',
          display: 'flex',
          marginTop: '7px',
          width: '100%',
          padding: '6px 15px',
          alignItems: 'center',
          gap: '20px',
          fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
          fontSize: '9px',
          color: '#3f3f44',
          fontWeight: 400,
          whiteSpace: 'nowrap',
          justifyContent: 'space-between',
          '@media (max-width: 991px)': {
            whiteSpace: 'initial'
          }
        }}>
          <span>Course</span>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '28px',
            '@media (max-width: 991px)': {
              whiteSpace: 'initial'
            }
          }}>
            <span>Sale</span>
            <span>Earnings</span>
          </div>
        </div>

        <div style={{
          marginTop: '12px',
          width: '100%',
          padding: '0 16px 0 6px'
        }}>
          {/* First Course Item */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                borderRadius: '6px',
                backgroundColor: 'rgba(62, 67, 95, 1)',
                padding: '0 12px',
                fontFamily: 'Work Sans, -apple-system, Roboto, Helvetica, sans-serif',
                fontSize: '18px',
                color: 'rgba(255, 255, 255, 1)',
                fontWeight: 300,
                whiteSpace: 'nowrap',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                P
              </div>
              <h4 style={{
                color: 'rgba(63, 63, 68, 1)',
                fontSize: '9px',
                fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
                fontWeight: 500,
                lineHeight: '12px',
                margin: 0
              }}>
                UI/UX Prototyping with Proto.io
              </h4>
            </div>
            <div style={{
              display: 'flex',
              marginTop: 'auto',
              marginBottom: 'auto',
              alignItems: 'center',
              gap: '38px',
              fontFamily: 'Work Sans, -apple-system, Roboto, Helvetica, sans-serif',
              fontSize: '9px',
              whiteSpace: 'nowrap'
            }}>
              <span style={{
                color: 'rgba(63, 63, 68, 1)',
                fontWeight: 400,
                marginTop: 'auto',
                marginBottom: 'auto'
              }}>
                10
              </span>
              <span style={{
                borderRadius: '6px',
                backgroundColor: 'rgba(204, 234, 187, 0.25)',
                padding: '4px 6px',
                color: 'rgba(132, 185, 158, 1)',
                fontWeight: 500,
                '@media (max-width: 991px)': {
                  whiteSpace: 'initial'
                }
              }}>
                $150.5
              </span>
            </div>
          </div>

          {/* Second Course Item */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            justifyContent: 'space-between',
            marginTop: '18px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                borderRadius: '6px',
                backgroundColor: 'rgba(132, 185, 158, 1)',
                padding: '0 9px',
                fontFamily: 'Work Sans, -apple-system, Roboto, Helvetica, sans-serif',
                fontSize: '18px',
                whiteSpace: 'nowrap',
                lineHeight: '1',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                📚
              </div>
              <h4 style={{
                color: 'rgba(63, 63, 68, 1)',
                fontSize: '9px',
                fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
                fontWeight: 500,
                lineHeight: '12px',
                margin: 0
              }}>
                How to Make UX Case Study for Beginner
              </h4>
            </div>
            <div style={{
              display: 'flex',
              marginTop: 'auto',
              marginBottom: 'auto',
              alignItems: 'center',
              gap: '38px',
              fontFamily: 'Work Sans, -apple-system, Roboto, Helvetica, sans-serif',
              fontSize: '9px',
              whiteSpace: 'nowrap'
            }}>
              <span style={{
                color: 'rgba(63, 63, 68, 1)',
                fontWeight: 400,
                marginTop: 'auto',
                marginBottom: 'auto'
              }}>
                32
              </span>
              <span style={{
                borderRadius: '6px',
                backgroundColor: 'rgba(204, 234, 187, 0.25)',
                padding: '4px 6px',
                color: 'rgba(132, 185, 158, 1)',
                fontWeight: 500
              }}>
                $285
              </span>
            </div>
          </div>

          {/* Third Course Item */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            justifyContent: 'space-between',
            marginTop: '18px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                borderRadius: '6px',
                backgroundColor: 'rgba(132, 185, 158, 1)',
                padding: '0 9px',
                fontFamily: 'Work Sans, -apple-system, Roboto, Helvetica, sans-serif',
                fontSize: '18px',
                whiteSpace: 'nowrap',
                lineHeight: '1',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                👩‍
              </div>
              <h4 style={{
                color: 'rgba(63, 63, 68, 1)',
                fontSize: '9px',
                fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
                fontWeight: 500,
                lineHeight: '12px',
                margin: 0
              }}>
                How to Conduct User Research from Scratch
              </h4>
            </div>
            <div style={{
              display: 'flex',
              marginTop: 'auto',
              marginBottom: 'auto',
              alignItems: 'center',
              gap: '38px',
              fontFamily: 'Work Sans, -apple-system, Roboto, Helvetica, sans-serif',
              fontSize: '9px',
              whiteSpace: 'nowrap'
            }}>
              <span style={{
                color: 'rgba(63, 63, 68, 1)',
                fontWeight: 400,
                marginTop: 'auto',
                marginBottom: 'auto'
              }}>
                12
              </span>
              <span style={{
                borderRadius: '6px',
                backgroundColor: 'rgba(204, 234, 187, 0.25)',
                padding: '4px 6px',
                color: 'rgba(132, 185, 158, 1)',
                fontWeight: 500
              }}>
                $109
              </span>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default WeeklySalesStats;