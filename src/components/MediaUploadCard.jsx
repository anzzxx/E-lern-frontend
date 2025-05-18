import React, { useState } from 'react';
import { handleFileUpload } from "../components/Chat";
import styles from "../styles/MediaUploadCard.module.css";

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

    try {
      const encode = await handleFileUpload(selectedFile);
      setFileUrl(encode);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. Please try again.");
    }
  };

  const handleSend = () => {
    if (file) {
      handlefilesend(file);
      setFile(null);
    }
  };

  return (
    <div className={styles.cardContainer}>
      <div className={styles.mediaUploadCard}>
        <div className={styles.mediaOption}>
          <label htmlFor="camera-upload" className={styles.mediaOptionLabel}>
            <span role="img" aria-label="camera">📷</span>
            <span>Camera</span>
          </label>
          <input
            id="camera-upload"
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => handleFileChange(e, 'camera')}
            className={styles.hiddenInput}
          />
        </div>
        
        <div className={styles.mediaOption}>
          <label htmlFor="photo-upload" className={styles.mediaOptionLabel}>
            <span role="img" aria-label="image">🖼️</span>
            <span>Photo</span>
          </label>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'photo')}
            className={styles.hiddenInput}
          />
        </div>
        
        <div className={styles.mediaOption}>
          <label htmlFor="video-upload" className={styles.mediaOptionLabel}>
            <span role="img" aria-label="video">🎥</span>
            <span>Video</span>
          </label>
          <input
            id="video-upload"
            type="file"
            accept="video/*"
            onChange={(e) => handleFileChange(e, 'video')}
            className={styles.hiddenInput}
          />
        </div>
        
        <div className={styles.mediaOption}>
          <label htmlFor="document-upload" className={styles.mediaOptionLabel}>
            <span role="img" aria-label="document">📄</span>
            <span>Document</span>
          </label>
          <input
            id="document-upload"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => handleFileChange(e, 'document')}
            className={styles.hiddenInput}
          />
        </div>
        
        <div className={styles.mediaOption}>
          <label htmlFor="contact-upload" className={styles.mediaOptionLabel}>
            <span role="img" aria-label="contact">📇</span>
            <span>Contact</span>
          </label>
          <input
            id="contact-upload"
            type="file"
            accept=".vcf"
            onChange={(e) => handleFileChange(e, 'contact')}
            className={styles.hiddenInput}
          />
        </div>
        
        <div className={styles.mediaOption}>
          <label htmlFor="drawing-upload" className={styles.mediaOptionLabel}>
            <span role="img" aria-label="drawing">🎨</span>
            <span>Drawing</span>
          </label>
          <input
            id="drawing-upload"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'drawing')}
            className={styles.hiddenInput}
          />
        </div>
        
        <button 
          onClick={handleSend} 
          disabled={!file}
          className={styles.sendButton}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MediaUploadCard;