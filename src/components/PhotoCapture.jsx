// src/components/PhotoCapture.jsx
// Photo capture component with GPS tagging and comments

import React, { useState, useRef, useEffect } from 'react';
import './PhotoCapture.css';

function PhotoCapture({ onPhotoSaved }) {
  const [photos, setPhotos] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [currentComment, setCurrentComment] = useState('');
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const fileInputRef = useRef(null);

  // Load existing photos on mount
  useEffect(() => {
    const savedPhotos = localStorage.getItem('currentPhotos');
    if (savedPhotos) {
      try {
        const parsed = JSON.parse(savedPhotos);
        setPhotos(parsed);
      } catch (error) {
        console.error('Error loading photos:', error);
      }
    }
  }, []);

  const capturePhoto = async (file) => {
    setIsCapturing(true);
    
    try {
      // Get GPS coordinates
      const gpsData = await new Promise((resolve) => {
        if (!navigator.geolocation) {
          resolve({ latitude: null, longitude: null, accuracy: null });
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude.toFixed(6),
              longitude: position.coords.longitude.toFixed(6),
              accuracy: Math.round(position.coords.accuracy)
            });
          },
          () => {
            resolve({ latitude: null, longitude: null, accuracy: null });
          },
          { enableHighAccuracy: true, timeout: 5000 }
        );
      });

      // Convert photo to base64
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoData = {
          id: Date.now().toString(),
          data: e.target.result,
          timestamp: new Date().toISOString(),
          gps: gpsData,
          comment: '',
          filename: file.name
        };

        setPreviewPhoto(photoData);
        setCurrentComment('');
      };
      reader.readAsDataURL(file);

    } catch (error) {
      console.error('Error capturing photo:', error);
      alert('❌ Failed to capture photo');
    } finally {
      setIsCapturing(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      capturePhoto(file);
    }
  };

  const savePhoto = () => {
    if (!previewPhoto) return;

    const photoWithComment = {
      ...previewPhoto,
      comment: currentComment
    };

    const updatedPhotos = [...photos, photoWithComment];
    setPhotos(updatedPhotos);
    localStorage.setItem('currentPhotos', JSON.stringify(updatedPhotos));

    if (onPhotoSaved) {
      onPhotoSaved(updatedPhotos);
    }

    setPreviewPhoto(null);
    setCurrentComment('');
    
    alert('✅ Photo saved with GPS and comment!');
  };

  const deletePhoto = (photoId) => {
    const updatedPhotos = photos.filter(p => p.id !== photoId);
    setPhotos(updatedPhotos);
    localStorage.setItem('currentPhotos', JSON.stringify(updatedPhotos));
    
    if (onPhotoSaved) {
      onPhotoSaved(updatedPhotos);
    }
  };

  const cancelPreview = () => {
    setPreviewPhoto(null);
    setCurrentComment('');
  };

  return (
    <div className="photo-capture-container">
      <h3>📸 Photo Documentation</h3>
      <p className="photo-description">
        Take photos of site conditions. GPS coordinates are automatically captured with each photo.
      </p>

      <div className="camera-controls">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <button
          onClick={() => fileInputRef.current.click()}
          disabled={isCapturing}
          className="camera-button"
        >
          📷 {isCapturing ? 'Capturing...' : 'Take Photo'}
        </button>
        <div className="photo-count">
          {photos.length} photo{photos.length !== 1 ? 's' : ''} captured
        </div>
      </div>

      {previewPhoto && (
        <div className="photo-preview-modal">
          <div className="photo-preview-content">
            <h4>Add Photo Details</h4>
            
            <div className="preview-image-container">
              <img src={previewPhoto.data} alt="Preview" className="preview-image" />
            </div>

            <div className="photo-metadata">
              <div className="metadata-item">
                <strong>📅 Time:</strong> {new Date(previewPhoto.timestamp).toLocaleString()}
              </div>
              {previewPhoto.gps.latitude && (
                <div className="metadata-item">
                  <strong>📍 GPS:</strong> {previewPhoto.gps.latitude}, {previewPhoto.gps.longitude}
                  {previewPhoto.gps.accuracy && ` (±${previewPhoto.gps.accuracy}m)`}
                </div>
              )}
              {!previewPhoto.gps.latitude && (
                <div className="metadata-item warning">
                  <strong>⚠️ No GPS:</strong> Location services unavailable
                </div>
              )}
            </div>

            <div className="comment-section">
              <label htmlFor="photo-comment">
                <strong>💬 Photo Description/Comment:</strong>
              </label>
              <textarea
                id="photo-comment"
                value={currentComment}
                onChange={(e) => setCurrentComment(e.target.value)}
                placeholder="Describe what this photo shows: terrain conditions, hazards, infrastructure details, etc..."
                rows={3}
                className="photo-comment-input"
              />
            </div>

            <div className="preview-actions">
              <button onClick={savePhoto} className="save-photo-btn">
                ✅ Save Photo
              </button>
              <button onClick={cancelPreview} className="cancel-photo-btn">
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {photos.length > 0 && (
        <div className="photo-gallery">
          <h4>Captured Photos:</h4>
          <div className="photo-grid">
            {photos.map((photo) => (
              <div key={photo.id} className="photo-card">
                <div className="photo-thumbnail-container">
                  <img src={photo.data} alt="Site" className="photo-thumbnail" />
                </div>
                <div className="photo-info">
                  <div className="photo-time">
                    {new Date(photo.timestamp).toLocaleTimeString()}
                  </div>
                  {photo.gps.latitude && (
                    <div className="photo-gps">
                      📍 {photo.gps.latitude}, {photo.gps.longitude}
                    </div>
                  )}
                  {photo.comment && (
                    <div className="photo-comment-display">
                      💬 {photo.comment}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => deletePhoto(photo.id)}
                  className="delete-photo-btn"
                  title="Delete photo"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PhotoCapture;
