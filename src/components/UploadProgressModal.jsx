import React from 'react';
import { Modal, ProgressBar } from 'react-bootstrap';

const UploadProgressModal = ({ show, progress, onClose }) => {
  return (
    <Modal show={show} onHide={onClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Uploading </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center mb-3">
          <p>Uploading </p>
          <ProgressBar 
            now={progress} 
            label={`${progress}%`} 
            animated 
            striped 
            variant="success"
            style={{ height: '25px' }}
          />
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default UploadProgressModal;