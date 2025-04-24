import React from "react";

function NewsletterSection() {
  return (
    <section className="newsletter-section">
      <div className="newsletter-container">
        <div className="newsletter-columns">
          <div className="text-column">
            <div className="text-content">
              <h2 className="newsletter-title">
                Join and get amazing discount
              </h2>
              <p className="newsletter-description">
                With our responsive themes and mobile and desktop apps
              </p>
            </div>
          </div>
          <div className="form-column">
            <div className="form-container">
              <div className="email-input">
                <label className="input-label">Email Address</label>
                <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/0dbfe691940842b4428d70df1fdaf6d167c1f325?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c" className="email-icon" alt="Email icon" />
              </div>
              <button className="subscribe-button">
                <span className="button-text">Subscribe</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .newsletter-section {
          border-radius: 12px;
          background-color: rgba(34, 115, 209, 1);
          margin-top: 114px;
          width: 100%;
        }

        .newsletter-container {
          border-radius: 12px;
          width: 100%;
          padding: 51px 60px;
        }

        .newsletter-columns {
          gap: 20px;
          display: flex;
        }

        .text-column {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          width: 64%;
        }

        .text-content {
          display: flex;
          flex-grow: 1;
          flex-direction: column;
          align-items: stretch;
          font-family:
            Gilroy,
            -apple-system,
            Roboto,
            Helvetica,
            sans-serif;
        }

        .newsletter-title {
          color: #fff;
          font-size: 32px;
          font-weight: 700;
          line-height: 1;
          align-self: start;
          margin: 0;
        }

        .newsletter-description {
          color: #ffffff;
          font-size: 24px;
          font-weight: 400;
          margin: 4px 0 0 0;
        }

        .form-column {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          width: 36%;
          margin-left: 20px;
        }

        .form-container {
          display: flex;
          margin-top: auto;
          margin-bottom: auto;
          width: 100%;
          align-items: stretch;
          gap: 16px;
          align-self: stretch;
          font-family:
            Gilroy,
            -apple-system,
            Roboto,
            Helvetica,
            sans-serif;
          font-size: 16px;
          line-height: 1;
        }

        .email-input {
          border-radius: 3px;
          background-color: rgba(249, 249, 249, 0.3);
          display: flex;
          padding: 10px 12px;
          align-items: stretch;
          gap: 40px 95px;
          color: #f9f9f9;
          font-weight: 400;
        }

        .input-label {
          flex-grow: 1;
        }

        .email-icon {
          aspect-ratio: 1;
          object-fit: contain;
          object-position: center;
          width: 21px;
          border-radius: 3px;
          flex-shrink: 0;
        }

        .subscribe-button {
          align-items: center;
          border-radius: 3px;
          background-color: #3dcbb1;
          display: flex;
          padding: 10px 18px;
          flex-direction: column;
          overflow: hidden;
          color: #fff;
          font-weight: 700;
          white-space: nowrap;
          justify-content: center;
          border: none;
          cursor: pointer;
        }

        .button-text {
          align-self: stretch;
          gap: 8px;
          overflow: hidden;
        }

        @media (max-width: 991px) {
          .newsletter-section {
            max-width: 100%;
            margin-top: 40px;
          }

          .newsletter-container {
            max-width: 100%;
            padding: 40px 20px;
          }

          .newsletter-columns {
            flex-direction: column;
            align-items: stretch;
            gap: 0px;
          }

          .text-column {
            width: 100%;
          }

          .text-content {
            max-width: 100%;
            margin-top: 40px;
          }

          .newsletter-title {
            max-width: 100%;
          }

          .newsletter-description {
            max-width: 100%;
          }

          .form-column {
            width: 100%;
            margin-left: 0;
          }

          .form-container {
            margin-top: 40px;
          }

          .subscribe-button {
            white-space: initial;
          }
        }
      `}</style>
    </section>
  );
}

export default NewsletterSection;
