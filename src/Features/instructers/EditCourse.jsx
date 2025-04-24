import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateCourse } from "../../Redux/Slices/CoursesSlice";
import "../../styles/editcourse.css";
import Message from "../../components/Message";
import { SyncLoader } from "react-spinners";
const EditCourse = ({ course, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isMessage, setIsMessage] = useState(false);
  const [message, setMessage] = useState({});
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    status: "",
    image: null,
    video: null,
  });

  const [previewImage, setPreviewImage] = useState("");
  const [previewVideo, setPreviewVideo] = useState("");

  const fixedVideoUrl = course.preview_video?.replace("video/upload/", "");
  const fixedImageUrl = course.thumbnail?.replace("image/upload/", "");

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || "",
        description: course.description || "",
        price: course.price || "",
        status: course.status || "",
        image: null,
        video: null,
      });

      setPreviewImage(fixedImageUrl || "");
      setPreviewVideo(fixedVideoUrl || "");
    }
  }, [course]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length > 1000) {
      newErrors.description = "Description must be less than 1000 characters";
    }

    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (isNaN(formData.price) || formData.price < 0) {
      newErrors.price = "Price must be a positive number";
    }

    if (!formData.status) {
      newErrors.status = "Status is required";
    }

    // Validate image file if a new one is selected
    if (formData.image) {
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validImageTypes.includes(formData.image.type)) {
        newErrors.image = "Invalid image format (JPEG, PNG, GIF only)";
      } else if (formData.image.size > 5 * 1024 * 1024) {
        // 5MB
        newErrors.image = "Image must be smaller than 5MB";
      }
    }

    // Validate video file if a new one is selected
    if (formData.video) {
      const validVideoTypes = ["video/mp4", "video/webm", "video/ogg"];
      if (!validVideoTypes.includes(formData.video.type)) {
        newErrors.video = "Invalid video format (MP4, WebM, Ogg only)";
      } else if (formData.video.size > 500 * 1024 * 1024) {
        // 500MB
        newErrors.video = "Video must be smaller than 50MB";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      const file = files[0];
      setFormData({ ...formData, [name]: file });

      if (name === "image") {
        setPreviewImage(URL.createObjectURL(file));
        if (errors.image) setErrors((prev) => ({ ...prev, image: "" }));
      } else if (name === "video") {
        setPreviewVideo(URL.createObjectURL(file));
        if (errors.video) setErrors((prev) => ({ ...prev, video: "" }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setIsMessage(true);
      setMessage({
        message: "Please fix the errors in the form",
        type: "error",
      });
      return;
    }

    const updatedData = new FormData();
    updatedData.append("title", formData.title);
    updatedData.append("description", formData.description);
    updatedData.append("price", formData.price);
    updatedData.append("status", formData.status);
    if (formData.image) updatedData.append("image", formData.image);
    if (formData.video) updatedData.append("video", formData.video);

    try {
      setIsLoading(true);
      await dispatch(
        updateCourse({ courseId: course.id, updatedData })
      ).unwrap();
      setIsMessage(true);
      setMessage({ message: "Course updated successfully!", type: "success" });

      setTimeout(() => onClose(), 1000);
    } catch (error) {
      
      setIsMessage(true);
      setMessage({
        message: "Error updating course. Please try again.",
        type: "error",
      });
      setTimeout(() => onClose(), 1000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="edit-course-modal">
        <h2>Edit Course</h2>
        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={errors.title ? "error" : ""}
          />
          {errors.title && (
            <span className="error-message">{errors.title}</span>
          )}

          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={errors.description ? "error" : ""}
          />
          {errors.description && (
            <span className="error-message">{errors.description}</span>
          )}

          <label>Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className={errors.price ? "error" : ""}
            min="0"
            step="0.01"
          />
          {errors.price && (
            <span className="error-message">{errors.price}</span>
          )}

          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={errors.status ? "error" : ""}
          >
            <option value="">Select Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          {errors.status && (
            <span className="error-message">{errors.status}</span>
          )}

          <label>Course Image</label>
          <div className="preview-container">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Course Preview"
                className="preview-image"
              />
            ) : (
              <p>No Image</p>
            )}
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
            />
            {errors.image && (
              <span className="error-message">{errors.image}</span>
            )}
          </div>

          <label>Course Video</label>
          <div className="preview-container">
            {previewVideo ? (
              <video
                src={previewVideo}
                controls
                className="preview-video"
              ></video>
            ) : (
              <p>No Video</p>
            )}
            <input
              type="file"
              name="video"
              accept="video/*"
              onChange={handleFileChange}
            />
            {errors.video && (
              <span className="error-message">{errors.video}</span>
            )}
          </div>

          <div className="buttons">
            <button type="submit">Update</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
      {isMessage && (
        <Message
          message={message.message}
          duration={1000}
          type={message.type}
          onHide={() => setIsMessage(false)}
        />
      )}

      {isLoading ? (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.3)", // Semi-transparent overlay
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000, // Ensure it's above other elements
            cursor: "not-allowed", // Optional: Show "busy" cursor
          }}
        >
          <SyncLoader
            color="#36d7b7" // Customize color
            loading={isLoading}
            size={15} // Adjust size
            speedMultiplier={0.8} // Control animation speed
          />
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default EditCourse;
