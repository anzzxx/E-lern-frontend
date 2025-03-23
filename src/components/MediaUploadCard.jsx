import React, { useState } from 'react';
import '../styles/MediaUploadCard.css'; // Assuming you have a CSS file for styling
import { handleUploadMedia } from "../components/Chat";

const MediaUploadCard = ({ setFileUrl, handlefilesend }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = async (event, type) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (selectedFile.size > maxSize) {
      alert("File is too large. Please upload a file less than 5MB.");
      return;
    }

    setFile(selectedFile);

    const formData = new FormData();
    formData.append("file", selectedFile);

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
    if (file) {
      handlefilesend(file);
      setFile(null); // Reset the file state after sending
    }
  };

  return (
    <div className="media-upload-card">
      <div className="media-option">
        <label htmlFor="camera-upload">
          <span role="img" aria-label="camera">📷</span>
          <span>Camera</span>
        </label>
        <input
          id="camera-upload"
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => handleFileChange(e, 'camera')}
          style={{ display: 'none' }}
        />
      </div>
      <div className="media-option">
        <label htmlFor="photo-upload">
          <span role="img" aria-label="image">🖼️</span>
          <span>Photo</span>
        </label>
        <input
          id="photo-upload"
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, 'photo')}
          style={{ display: 'none' }}
        />
      </div>
      <div className="media-option">
        <label htmlFor="video-upload">
          <span role="img" aria-label="video">🎥</span>
          <span>Video</span>
        </label>
        <input
          id="video-upload"
          type="file"
          accept="video/*"
          onChange={(e) => handleFileChange(e, 'video')}
          style={{ display: 'none' }}
        />
      </div>
      <div className="media-option">
        <label htmlFor="document-upload">
          <span role="img" aria-label="document">📄</span>
          <span>Document</span>
        </label>
        <input
          id="document-upload"
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => handleFileChange(e, 'document')}
          style={{ display: 'none' }}
        />
      </div>
      <div className="media-option">
        <label htmlFor="contact-upload">
          <span role="img" aria-label="contact">📇</span>
          <span>Contact</span>
        </label>
        <input
          id="contact-upload"
          type="file"
          accept=".vcf"
          onChange={(e) => handleFileChange(e, 'contact')}
          style={{ display: 'none' }}
        />
      </div>
      <div className="media-option">
        <label htmlFor="drawing-upload">
          <span role="img" aria-label="drawing">🎨</span>
          <span>Drawing</span>
        </label>
        <input
          id="drawing-upload"
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e, 'drawing')}
          style={{ display: 'none' }}
        />
      </div>
      <button onClick={handleSend} disabled={!file}>
        Send
      </button>
    </div>
  );
};

export default MediaUploadCard;