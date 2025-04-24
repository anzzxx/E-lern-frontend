"use client";
import React from "react";

const EarningsCard = () => {
  return (
    <section style={{
      borderRadius: '0px',
      marginTop: '26px',
      maxWidth: '100%',
      width: '430px',
      paddingBottom: '11px'
    }}>
      <div style={{
        borderRadius: '18px',
        background: 'linear-gradient(135deg, #3e435f 0%, #3e435f 100%)',
        display: 'flex',
        width: '100%',
        padding: '15px 18px',
        flexDirection: 'column',
        alignItems: 'stretch'
      }}>
        <div style={{
          display: 'flex',
          width: '100%',
          alignItems: 'stretch',
          gap: '20px',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1px' }}>
            <div style={{ alignSelf: 'flex-start', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
              <h3 style={{
                color: 'rgba(255, 255, 255, 1)',
                fontSize: '12px',
                fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
                fontWeight: 600,
                margin: 0
              }}>
                Total Earnings
              </h3>
              <p style={{
                color: 'rgba(230, 230, 230, 1)',
                fontSize: '9px',
                fontFamily: 'Work Sans, -apple-system, Roboto, Helvetica, sans-serif',
                fontWeight: 400,
                alignSelf: 'flex-start',
                margin: '14px 0 0'
              }}>
                Today Earning
              </p>
            </div>
            <p style={{
              color: 'rgba(230, 230, 230, 1)',
              fontSize: '9px',
              fontFamily: 'Work Sans, -apple-system, Roboto, Helvetica, sans-serif',
              fontWeight: 400,
              alignSelf: 'flex-end',
              margin: '33px 0 0'
            }}>
              Pending
            </p>
          </div>
          <div style={{
            fontFamily: 'Work Sans, -apple-system, Roboto, Helvetica, sans-serif',
            fontSize: '9px',
            color: 'rgba(230, 230, 230, 1)',
            fontWeight: 400
          }}>
            <img
              style={{
                aspectRatio: '1.86',
                objectFit: 'contain',
                objectPosition: 'center',
                width: '26px',
                marginLeft: '15px',
                '@media (max-width: 991px)': {
                  marginLeft: '10px'
                }
              }}
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/3e3cd87a16f0dbe451e04b12aa8cc7511c5a672a?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c"
              alt="Review"
            />
            <p style={{ margin: '19px 0 0' }}>In Review</p>
          </div>
        </div>

        <div style={{
          alignSelf: 'flex-start',
          display: 'flex',
          marginTop: '4px',
          alignItems: 'stretch',
          gap: '35px',
          fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
          fontSize: '15px',
          color: 'rgba(255, 255, 255, 1)',
          fontWeight: 500,
          whiteSpace: 'nowrap',
          '@media (max-width: 991px)': {
            whiteSpace: 'initial'
          }
        }}>
          <span>$19,010</span>
          <span style={{ color: 'rgba(213, 244, 223, 1)' }}>$64</span>
          <span>$80</span>
        </div>

        <div style={{
          display: 'flex',
          marginTop: '18px',
          alignItems: 'stretch',
          gap: '20px',
          whiteSpace: 'nowrap',
          justifyContent: 'space-between',
          '@media (max-width: 991px)': {
            marginRight: '2px',
            whiteSpace: 'initial'
          }
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            fontFamily: 'Work Sans, -apple-system, Roboto, Helvetica, sans-serif',
            '@media (max-width: 991px)': {
              whiteSpace: 'initial'
            }
          }}>
            <p style={{
              color: 'rgba(230, 230, 230, 1)',
              fontSize: '9px',
              fontWeight: 400,
              margin: 0
            }}>
              Available
            </p>
            <span style={{
              color: 'rgba(255, 255, 255, 1)',
              fontSize: '15px',
              fontWeight: 500,
              alignSelf: 'flex-start',
              marginTop: '4px'
            }}>
              $178
            </span>
          </div>
          <button style={{
            borderRadius: '4px',
            backgroundColor: 'rgba(92, 176, 134, 1)',
            alignSelf: 'flex-start',
            marginTop: '8px',
            padding: '5px 21px',
            fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
            fontSize: '9px',
            color: 'rgba(255, 255, 255, 1)',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            '@media (max-width: 991px)': {
              padding: '5px 20px',
              whiteSpace: 'initial'
            }
          }}>
            Withdraw
          </button>
        </div>
      </div>
    </section>
  );
};

export default EarningsCard;