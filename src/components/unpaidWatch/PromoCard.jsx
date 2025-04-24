import React from "react";

function PromoCard() {
  return (
    <section className="promo-card">
      <div className="overlay">
        <div className="promo-content">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/e081e3db28a174ef366e48760ce5acee1d4c6ad1?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c"
            className="background-image"
            alt="Promo background"
          />
          <div className="text-content">
            <span className="promo-badge">WEBINAR</span>
            <h3 className="instructor-name">Ana Kursova</h3>
            <h2 className="promo-title">
              Masterclass in Design Thinking, Innovation & Creativity
            </h2>
            <button className="learn-more-button">
              <span className="button-text">Learn More</span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .promo-card {
          border-radius: 18px;
          font-family:
            Gilroy,
            -apple-system,
            Roboto,
            Helvetica,
            sans-serif;
          font-size: 12px;
          color: #fff;
          font-weight: 700;
        }

        .overlay {
          border-radius: 18px;
          background-color: rgba(27, 40, 63, 1);
        }

        .promo-content {
          display: flex;
          flex-direction: column;
          border-radius: 0px 0px 0px 0px;
          position: relative;
          aspect-ratio: 0.613;
          width: 100%;
          padding: 40px 20px 367px;
        }

        .background-image {
          position: absolute;
          inset: 0;
          height: 100%;
          width: 100%;
          object-fit: cover;
          object-position: center;
        }

        .text-content {
          position: relative;
          display: flex;
          margin-bottom: -73px;
          width: 100%;
          flex-direction: column;
          overflow: hidden;
          align-items: stretch;
          justify-content: start;
        }

        .promo-badge {
          align-self: start;
          border-radius: 2px;
          background-color: #3dcbb1;
          padding: 4px;
          gap: 10px;
          overflow: hidden;
          white-space: nowrap;
          line-height: 1;
        }

        .instructor-name {
          color: #f9f9f9;
          font-size: 20px;
          font-weight: 400;
          margin: 4px 0 0 0;
        }

        .promo-title {
          font-size: 32px;
          line-height: 42px;
          margin: 4px 0 0 0;
        }

        .learn-more-button {
          align-items: center;
          border-radius: 3px;
          align-self: start;
          display: flex;
          margin-top: 4px;
          padding: 8px 16px;
          flex-direction: column;
          overflow: hidden;
          color: #ffd130;
          line-height: 1;
          justify-content: center;
          background: transparent;
          border: 1px solid #ffd130;
          cursor: pointer;
        }

        .button-text {
          align-self: stretch;
          gap: 8px;
          overflow: hidden;
        }

        @media (max-width: 991px) {
          .promo-card {
            margin-top: 22px;
          }

          .promo-content {
            padding-bottom: 100px;
          }

          .text-content {
            margin-bottom: 10px;
          }

          .promo-badge {
            white-space: initial;
          }
        }
      `}</style>
    </section>
  );
}

export default PromoCard;
