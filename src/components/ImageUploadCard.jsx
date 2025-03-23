import React, { useState } from "react";
import "../styles/ImageUploadCard.css"; // For styling
import {handleUploadMedia} from "../components/Chat";

const ImageUploadCard = ({ setFileUrl,sendFile }) => {
  const [media, setMedia] = useState(null); // To store the uploaded file
  const [caption, setCaption] = useState(""); // To store the caption
  const [fileType, setFileType] = useState(null); // To check if it's an image or video

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "video/mp4"];
    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file type. Only JPEG, PNG, JPG, MP4 files are allowed.");
      return;
    }
  
    // Validate file size
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("File is too large. Please upload a file less than 5MB.");
      return;
    }
  
    // Create FormData and append the file
    const formData = new FormData();
    formData.append("file", file);
  
    // Generate a local URL for preview
    const fileURL = URL.createObjectURL(file);
    setMedia(fileURL); // Set the media preview URL
    setFileType(file.type.startsWith("image/") ? "image" : "video"); // Set file type
  
    try {
      // Upload the file and get the URL
      const url = await handleUploadMedia(formData);
      
      // Set the uploaded file URL in state
      setFileUrl(url);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. Please try again.");
    }
  };
  const handleSend = () => {
    if (media) {
      alert(`File sent with caption: ${caption}`);
      
      setMedia(null);
      setCaption("");
      setFileType(null);
    }
  };

  return (
    <div className="app">
    <div className="image-upload-card">
      <div className="card-header">
        <h3>Send a file</h3>
      </div>
      <div className="card-body">
        {media && (
          <div className="media-preview">
            {fileType === "image" ? (
              <img src={media} alt="Uploaded media" />
            ) : (
              <video controls>
                <source src={media} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
            
            <div className="media-options">
              <br />
              <div className="actions">
                <button onClick={() => setMedia(null)}>Cancel</button>
                <button onClick={sendFile}>Send</button>
              </div>
            </div>
          </div>
        )}
        <br />
        <div className="upload-section">
          <label htmlFor="file-upload" className="upload-button">
            Upload File
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*,video/*"
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />
        </div>
      </div>
    </div>
    </div>
  );
};

export default ImageUploadCard;
