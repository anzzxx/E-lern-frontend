import React from "react";

const StudentLocations = () => {
  return (
    <>
      <section className="locations-container">
        <h3 className="locations-title">Top Student Location</h3>

        <article className="location-item">
          <div className="location-info">
            <div className="country-info">
              <img
                className="country-flag"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/9eb7377117bfd51a127f443f38b2ffbf27cd0afa?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c"
                alt="Germany flag"
              />
              <span className="country-name">Germany</span>
            </div>
            <div className="student-count">
              <img
                className="student-icon"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/7428598370bc2ae48dd91258717c1baa18f6c935?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c"
                alt="Students"
              />
              <span className="student-number">3,551</span>
            </div>
          </div>
          <span className="percentage">30%</span>
        </article>

        <article className="location-item">
          <div className="location-info">
            <div className="country-info">
              <img
                className="country-flag"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/b48113bb0eec26812e1796f5156c713e8bfd790f?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c"
                alt="Australia flag"
              />
              <span className="country-name">Australia</span>
            </div>
            <div className="student-count">
              <img
                className="student-icon"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/3ccd75b4fc4b5217993df9c3df651590fdbb3178?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c"
                alt="Students"
              />
              <span className="student-number">2,951</span>
            </div>
          </div>
          <span className="percentage">20%</span>
        </article>

        <article className="location-item">
          <div className="location-info">
            <div className="country-info">
              <img
                className="country-flag"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/618480c552516d5e1266665121d9b51c5fae390b?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c"
                alt="United States flag"
              />
              <span className="country-name">United States</span>
            </div>
            <div className="student-count">
              <img
                className="student-icon"
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/506c5666c66a6263e03f33ba36165052f7c550d1?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c"
                alt="Students"
              />
              <span className="student-number">2,125</span>
            </div>
          </div>
          <span className="percentage">15%</span>
        </article>
      </section>

      <style>{`
        .locations-container {
          border-radius: 0px;
          display: flex;
          margin-top: 26px;
          width: 100%;
          max-width: 246px;
          flex-direction: column;
          align-items: stretch;
          font-weight: 400;
        }

        .locations-title {
          color: rgba(63, 63, 68, 1);
          font-size: 12px;
          font-family: Poppins, -apple-system, Roboto, Helvetica, sans-serif;
          font-weight: 600;
          align-self: flex-start;
          margin: 0;
        }

        .location-item {
          display: flex;
          margin-top: 24px;
          align-items: center;
          gap: 17px;
          justify-content: space-between;
          white-space: nowrap;
        }

        .location-item + .location-item {
          margin-top: 12px;
        }

        .location-info {
          border-radius: 6px;
          display: flex;
          padding: 6px 13px;
          align-items: center;
          gap: 40px;
          color: rgba(63, 63, 68, 1);
          justify-content: space-between;
        }

        .country-info {
          display: flex;
          align-items: center;
          gap: 4px;
          font-family: Poppins, -apple-system, Roboto, Helvetica, sans-serif;
          font-size: 8px;
        }

        .country-flag {
          aspect-ratio: 1;
          object-fit: contain;
          object-position: center;
          width: 12px;
          flex-shrink: 0;
        }

        .student-count {
          display: flex;
          align-items: center;
          gap: 3px;
          font-family: Work Sans, -apple-system, Roboto, Helvetica, sans-serif;
          font-size: 7px;
          text-align: right;
        }

        .student-icon {
          aspect-ratio: 1;
          object-fit: contain;
          object-position: center;
          width: 9px;
          flex-shrink: 0;
        }

        .percentage {
          color: #3f3f44;
          font-size: 9px;
          font-family: Work Sans, -apple-system, Roboto, Helvetica, sans-serif;
          text-align: right;
          margin-top: auto;
          margin-bottom: auto;
        }

        @media (max-width: 991px) {
          .location-item,
          .location-info,
          .country-info,
          .student-count {
            white-space: initial;
          }
        }
      `}</style>
    </>
  );
};

export default StudentLocations;
