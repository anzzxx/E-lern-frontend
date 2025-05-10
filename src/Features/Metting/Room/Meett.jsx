"use client";
import React from "react";
import VideoArea from "./VideoArea";
import ChatSection from "./ChatSection";

function Meett({video,ref}) {
  return (
    <section className="meett">
   
      <VideoArea video={video} ref={ref}/>
      <ChatSection />

      <style jsx>{`
        .meett {
          border-radius: 27.103px;
          box-shadow: 0px 17.229px 68.918px 0px rgba(43, 91, 163, 0.15);
          background-color: #fff;
          display: flex;
          padding: 25px;
          width:100%;
          align-items: stretch;
          gap: 15px;
          overflow: hidden;
          flex-wrap: wrap;
        }
        @media (max-width: 991px) {
          .meett {
            padding: 20px;
          }
        }
      `}</style>
    </section>
  );
}

export default Meett