import React, { useState } from "react";
import RazorpayButton from "../../components/RazorpayButton";
import { useSelector } from "react-redux";

function CourseDetails({ selectedCourse }) {
  // State to toggle between thumbnail and video
  const [showVideo, setShowVideo] = useState(false);
  const user = useSelector((state) => state.auth.user);
  // Calculate discount percentage if there's a sale price
  const originalPrice = parseFloat(selectedCourse?.price || "0");
  const currentPrice = originalPrice;
  const discountPercentage = Math.round(
    (1 - currentPrice / originalPrice) * 100
  );
  const { courses } = useSelector((state) => state.enrollments);
  const Enrolled =
    courses?.some((course) => course.id=== selectedCourse.id) ||
    false;
  
  console.log(Enrolled);
  console.log(courses,"courses");
  
  // Toggle video display on click
  const handleThumbnailClick = () => {
    setShowVideo(true);
  };

  // Process URLs
  const videoUrl =
    selectedCourse?.preview_video?.replace("video/upload/", "") || "";
  const thumbnailUrl =
    selectedCourse?.thumbnail?.replace("image/upload/", "") || "";

  return (
    <section
      style={{
        marginTop: "32px",
        maxWidth: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "20px",
          flexDirection: window.innerWidth <= 991 ? "column" : "row",
          alignItems: window.innerWidth <= 991 ? "stretch" : "flex-start",
        }}
      >
        {/* Image/Video Column */}
        <div
          style={{
            width: window.innerWidth <= 991 ? "100%" : "67%",
          }}
        >
          {showVideo ? (
            <video
              controls
              style={{
                width: "100%",
                aspectRatio: "1.78",
                objectFit: "cover",
                borderRadius: "30px",
                marginTop: window.innerWidth <= 991 ? "20px" : "0",
              }}
            >
              <source
                src={videoUrl || "https://example.com/sample-video.mp4"} // Replace with actual video URL
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              src={thumbnailUrl || "https://via.placeholder.com/800x450"}
              style={{
                width: "100%",
                aspectRatio: "1.78",
                objectFit: "cover",
                borderRadius: "30px",
                marginTop: window.innerWidth <= 991 ? "20px" : "0",
                cursor: "pointer", // Indicate clickable
              }}
              alt="Course thumbnail"
              onClick={handleThumbnailClick}
            />
          )}
        </div>

        {/* Info Column */}
        <div
          style={{
            width: window.innerWidth <= 991 ? "100%" : "33%",
            marginLeft: window.innerWidth <= 991 ? "0" : "20px",
          }}
        >
          <div
            style={{
              boxShadow: "0px 6px 20px 0px rgba(0, 0, 0, 0.05)",
              backgroundColor: "#fff",
              width: "100%",
              padding: "24px",
              fontFamily:
                "Gilroy, -apple-system, Roboto, Helvetica, sans-serif",
            }}
          >
            {/* Price Section */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <h3
                style={{
                  color: "#000",
                  fontSize: "24px",
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                ${currentPrice.toFixed(2)}
              </h3>
              <span
                style={{
                  color: "#1b1b1b",
                  fontSize: "16px",
                  textDecoration: "line-through",
                }}
              >
                ${originalPrice.toFixed(2)}
              </span>
            </div>

            {discountPercentage > 0 && (
              <div
                style={{
                  borderRadius: "2px",
                  backgroundColor: "#a04ae3",
                  marginTop: "8px",
                  padding: "4px",
                  fontSize: "16px",
                  color: "#fff",
                  fontWeight: 700,
                  width: "fit-content",
                }}
              >
                {discountPercentage}% OFF
              </div>
            )}

            {user ? (
              !Enrolled ? (
                <RazorpayButton
                  amount={Number(selectedCourse?.price || 0)} // Convert to paise
                  courseId={selectedCourse?.id}
                  userId={user?.id}
                />
              ) : (
                <p className="enrolled-message">
                  You are already enrolled in this course.
                </p>
              )
            ) : (
              <p className="login-message">Please login to enroll</p>
            )}

            <button
              style={{
                borderRadius: "18px",
                width: "100%",
                padding: "12px 24px",
                marginTop: "16px",
                fontSize: "20px",
                color: "#1b1b1b",
                fontWeight: 700,
                background: "transparent",
                border: "1px solid #1b1b1b",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/e1a972d9708c0de3831d58f9c94c5401a4a7cba1?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c"
                style={{ width: "26px" }}
                alt="Wishlist icon"
              />
              Wishlist
            </button>

            {/* Course Stats */}
            <div
              style={{
                marginTop: "24px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/711ac612cfbbe7be0b1708df6be6e70fcc9cbef9?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c"
                style={{ width: "24px" }}
                alt="Sections icon"
              />
              <span>{selectedCourse?.lessons?.length || 0} Sections</span>
            </div>

            <div
              style={{
                marginTop: "14px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/f45dde1680df53afa8d55d9913ad8dd2f4ff82d8?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c"
                style={{ width: "24px" }}
                alt="Lectures icon"
              />
              <span>152 Lectures</span>
            </div>

            <div
              style={{
                marginTop: "14px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/96f37d7b6c1bf0099c34ea44bbe87b38f2a541e6?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c"
                style={{ width: "24px" }}
                alt="Duration icon"
              />
              <span>21h 33m total length</span>
            </div>

            <div
              style={{
                marginTop: "14px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/fcc31717a9daa38ce925af81115667ddb32fe4f5?placeholderIfAbsent=true&apiKey=5421258326d542d8bd77b304c1f7486c"
                style={{ width: "24px" }}
                alt="Language icon"
              />
              <span>English</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CourseDetails;
