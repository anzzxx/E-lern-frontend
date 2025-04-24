import React from "react";

const InstructorCard = ({ imageSrc, name, title, columnStyle }) => {
  const cardInstructorStyles = {
    color: "#fff",
    textAlign: "center",
    borderRadius: "18px",
    flexGrow: 1,
    fontFamily: "Gilroy, -apple-system, Roboto, Helvetica, sans-serif",
  };

  const cardContainerStyles = {
    aspectRatio: "0.713",
    borderRadius: "30px",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    position: "relative",
  };

  const instructorImageStyles = {
    objectFit: "cover",
    objectPosition: "center",
    width: "100%",
    height: "100%",
    position: "absolute",
    inset: "0",
  };

  const overlayStyles = {
    borderRadius: "30px",
    position: "relative",
  };

  const overlayContentStyles = {
    borderRadius: "18px",
    padding: "325px 33px 16px",
  };

  const nameContainerStyles = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    overflow: "hidden",
  };

  const instructorNameStyles = {
    fontSize: "24px",
    fontWeight: 700,
    lineHeight: 1,
  };

  const instructorTitleStyles = {
    marginTop: "4px",
    fontSize: "16px",
    fontWeight: 400,
  };

  return (
    <div style={columnStyle}>
      <article style={cardInstructorStyles}>
        <div style={cardContainerStyles}>
          <img
            src={imageSrc}
            alt={`${name}, ${title}`}
            style={instructorImageStyles}
          />
          <div style={overlayStyles}>
            <div style={overlayContentStyles}>
              <div style={nameContainerStyles}>
                <h3 style={instructorNameStyles}>{name}</h3>
                <p style={instructorTitleStyles}>{title}</p>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default InstructorCard;