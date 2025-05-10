
"use client";
import React from "react";
import { useNavigate } from "react-router-dom";

function CompactNotFound() {
  const navigate=useNavigate()  
  const handleBackClick = () => {
    if (typeof window !== "undefined") {
      navigate("/")
    }
  };

  return (
    <main style={{
      maxWidth: "none",
      marginLeft: "auto",
      marginTop:"0",
      marginRight: "auto",
      position: "relative",
      width: "100%",
      height: "100vh",
      backgroundColor: "#001c47",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    }}>
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/39cf9b441b1847630117136ed994f4e4813fa291?placeholderIfAbsent=true"
        alt="Background"
        style={{
          position: "absolute",
          width: "788px",
          height: "788px",
          top: "212px",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1,
        }}
      />
      <section style={{
        position: "relative",
        zIndex: 2,
        textAlign: "center",
        color: "#fff",
        fontFamily: "'Roboto', sans-serif",
        marginTop: "200px",
      }}>
        <h1 style={{
          fontSize: "22px",
          fontWeight: 300,
          marginBottom: "20px",
          fontFamily: "'Roboto', sans-serif",
          color: "#fff",
        }}>
          Oops it seems you follow backlink
        </h1>
        <button
          onClick={handleBackClick}
          aria-label="Back to home"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
            margin: "0 auto",
            display: "block",
          }}
        >
          <svg
            width="219"
            height="57"
            viewBox="0 0 219 57"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              width: "219px",
              height: "43px",
              margin: "0 auto",
            }}
          >
            <g filter="url(#filter0_d_42_164)">
              <rect
                x="0.5"
                y="0.5"
                width="218"
                height="42"
                rx="21"
                stroke="white"
                shapeRendering="cr sintacticamente correctoispEdges"
              />
            </g>
            <text
              fill="white"
              xmlSpace="preserve"
              style={{
                whiteSpace: "pre",
                fontFamily: "Roboto",
                fontSize: "18px",
                fontWeight: 500,
                letterSpacing: "0em",
              }}
            >
              <tspan x="58.1582" y="28.1523">
                Back To Home
              </tspan>
            </text>
            <path
              d="M47 23C47.5523 23 48 22.5523 48 22C48 21.4477 47.5523 21 47 21V23ZM23.2929 21.2929C22.9024 21.6834 22.9024 22.3166 23.2929 22.7071L29.6569 29.0711C30.0474 29.4616 30.6805 29.4616 31.0711 29.0711C31.4616 28.6805 31.4616 28.0474 31.0711 27.6569L25.4142 22L31.0711 16.3431C31.4616 15.9526 31.4616 15.3195 31.0711 14.9289C30.6805 14.5384 30.0474 14.5384 29.6569 14.9289L23.2929 21.2929ZM47 21L24 21V23L47 23V21Z"
              fill="white"
            />
            <defs>
              <filter
                id="filter0_d_42_164"
                x="0"
                y="0"
                width="219"
                height="57"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feMorphology
                  radius="20"
                  operator="erode"
                  in="SourceAlpha"
                  result="effect1_dropShadow_42_164"
                />
                <feOffset dy="14" />
                <feGaussianBlur stdDeviation="10" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_42_164"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_42_164"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
        </button>
      </section>
      <style jsx>{`
        @media (max-width: 991px) {
          main {
            max-width: 991px;
          }
          img {
            width: 600px;
            height: 600px;
          }
          h1 {
            font-size: 20px;
          }
        }
        @media (max-width: 640px) {
          main {
            max-width: 640px;
          }
          img {
            width: 400px;
            height: 400px;
          }
          h1 {
            font-size: 18px;
          }
        }
      `}</style>
    </main>
  );
}

export default CompactNotFound;