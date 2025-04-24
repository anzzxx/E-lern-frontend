import React, { useState } from 'react';
import { handleFileUpload } from "../components/Chat";

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

  // Inline styles
  const styles = {
    cardContainer: {
      position: 'absolute',
      bottom: '60px',
      right: '20px',
      zIndex: 1000,
      transition: 'all 0.3s ease',
      opacity: 1,
      transform: 'translateY(0)'
    },
    mediaUploadCard: {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'white',
      color: '#333',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '10px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
      width: '200px'
    },
    mediaOption: {
      display: 'flex',
      alignItems: 'center',
      padding: '8px',
      cursor: 'pointer'
    },
    mediaOptionHover: {
      backgroundColor: '#f5f5f5',
      color: '#100e0e'
    },
    mediaOptionLabel: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '4px'
    },
    sendButton: {
      marginTop: '10px',
      padding: '8px 16px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    sendButtonDisabled: {
      marginTop: '10px',
      padding: '8px 16px',
      backgroundColor: '#cccccc',
      color: '#666666',
      border: 'none',
      borderRadius: '4px',
      cursor: 'not-allowed'
    }
  };

  return (
    <div style={styles.cardContainer}>
      <div style={styles.mediaUploadCard}>
        <div style={styles.mediaOption}>
          <label htmlFor="camera-upload" style={styles.mediaOptionLabel}>
            <span role="img" aria-label="camera">📷</span>
            <span style={{ marginLeft: '10px' }}>Camera</span>
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
        
        <div style={styles.mediaOption}>
          <label htmlFor="photo-upload" style={styles.mediaOptionLabel}>
            <span role="img" aria-label="image">🖼️</span>
            <span style={{ marginLeft: '10px' }}>Photo</span>
          </label>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'photo')}
            style={{ display: 'none' }}
          />
        </div>
        
        <div style={styles.mediaOption}>
          <label htmlFor="video-upload" style={styles.mediaOptionLabel}>
            <span role="img" aria-label="video">🎥</span>
            <span style={{ marginLeft: '10px' }}>Video</span>
          </label>
          <input
            id="video-upload"
            type="file"
            accept="video/*"
            onChange={(e) => handleFileChange(e, 'video')}
            style={{ display: 'none' }}
          />
        </div>
        
        <div style={styles.mediaOption}>
          <label htmlFor="document-upload" style={styles.mediaOptionLabel}>
            <span role="img" aria-label="document">📄</span>
            <span style={{ marginLeft: '10px' }}>Document</span>
          </label>
          <input
            id="document-upload"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => handleFileChange(e, 'document')}
            style={{ display: 'none' }}
          />
        </div>
        
        <div style={styles.mediaOption}>
          <label htmlFor="contact-upload" style={styles.mediaOptionLabel}>
            <span role="img" aria-label="contact">📇</span>
            <span style={{ marginLeft: '10px' }}>Contact</span>
          </label>
          <input
            id="contact-upload"
            type="file"
            accept=".vcf"
            onChange={(e) => handleFileChange(e, 'contact')}
            style={{ display: 'none' }}
          />
        </div>
        
        <div style={styles.mediaOption}>
          <label htmlFor="drawing-upload" style={styles.mediaOptionLabel}>
            <span role="img" aria-label="drawing">🎨</span>
            <span style={{ marginLeft: '10px' }}>Drawing</span>
          </label>
          <input
            id="drawing-upload"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, 'drawing')}
            style={{ display: 'none' }}
          />
        </div>
        
        <button 
          onClick={handleSend} 
          disabled={!file}
          style={file ? styles.sendButton : styles.sendButtonDisabled}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MediaUploadCard;