import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateCourse } from "../../Redux/Slices/CoursesSlice";
import "../../styles/editcourse.css";

const EditCourse = ({ course, onClose }) => {

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

      setPreviewImage(
        fixedImageUrl ||""
      );
      setPreviewVideo(fixedVideoUrl || "");
    }
  }, [course]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      const file = files[0];
      setFormData({ ...formData, [name]: file });

      if (name === "image") {
        setPreviewImage(URL.createObjectURL(file));
      } else if (name === "video") {
        setPreviewVideo(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = new FormData();
    updatedData.append("title", formData.title);
    updatedData.append("description", formData.description);
    updatedData.append("price", formData.price);
    updatedData.append("status", formData.status);
    if (formData.image) updatedData.append("image", formData.image);
    if (formData.video) updatedData.append("video", formData.video);

    try {
      await dispatch(updateCourse({ courseId: course.id, updatedData })).unwrap();
      alert("Course updated successfully!");
      window.location.reload();
      onClose();
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update course.");
    }
  };



  
  
  
  return (
    <div className="edit-course-modal">
      <h2>Edit Course</h2>
      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} required />

        <label>Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required />

        <label>Price</label>
        <input type="number" name="price" value={formData.price} onChange={handleChange} required />

        <label>Status</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>

        <label>Course Image</label>
        <div className="preview-container">
          {previewImage ? <img src={previewImage} alt="Course Preview" className="preview-image" /> : <p>No Image</p>}
          <input type="file" name="image" accept="image/*" onChange={handleFileChange} />
        </div>

        <label>Course Video</label>
        <div className="preview-container">
          {previewVideo ? <video src={previewVideo} controls className="preview-video"></video> : <p>No Video</p>}
          <input type="file" name="video" accept="video/*" onChange={handleFileChange} />
        </div>

        <div className="buttons">
          <button type="submit">Update</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditCourse;


