// src/components/PhotoCapture.jsx
// Photo capture component with GPS tagging and comments - optimized for mobile

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
        console.log('📸 Loaded', parsed.length, 'existing photos');
      } catch (error) {
        console.error('Error loading photos:', error);
      }
    }
  }, []);

  const capturePhoto = async (file) => {
    console.log('📸 Starting photo capture for:', file.name);
    setIsCapturing(true);
    
    try {
      // Get GPS coordinates
      const gpsData = await new Promise((resolve) => {
        if (!navigator.geolocation) {
          console.log('⚠️ GPS not available');
          resolve({ latitude: null, longitude: null, accuracy: null });
          return;
        }

        console.log('📍 Getting GPS location...');
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const gps = {
              latitude: position.coords.latitude.toFixed(6),
              longitude: position.coords.longitude.toFixed(6),
              accuracy: Math.round(position.coords.accuracy)
            };
            console.log('✅ GPS captured:', gps);
            resolve(gps);
          },
          (error) => {
            console.log('⚠️ GPS error:', error.message);
            resolve({ latitude: null, longitude: null, accuracy: null });
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
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
          filename: file.name,
          size: file.size
        };

        console.log('✅ Photo loaded, size:', Math.round(file.size / 1024), 'KB');
        setPreviewPhoto(photoData);
        setCurrentComment('');
      };
      
      reader.onerror = (error) => {
        console.error('❌ File read error:', error);
        alert('Failed to read photo file');
      };
      
      reader.readAsDataURL(file);

    } catch (error) {
      console.error('❌ Error capturing photo:', error);
      alert('❌ Failed to capture photo: ' + error.message);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    console.log('📁 File selected:', file);
    
    if (!file) {
      console.log('⚠️ No file selected');
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      alert('❌ Please select an image file');
      return;
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('❌ Photo too large. Please use a photo under 10MB.');
      return;
    }
    
    capturePhoto(file);
  };

  const savePhoto = () => {
    if (!previewPhoto) return;

    const photoWithComment = {
      ...previewPhoto,
      comment: currentComment
    };

    const updatedPhotos = [...photos, photoWithComment];
    setPhotos(updatedPhotos);
    
    try {
      localStorage.setItem('currentPhotos', JSON.stringify(updatedPhotos));
      console.log('✅ Photo saved to localStorage. Total photos:', updatedPhotos.length);
      
      if (onPhotoSaved) {
        onPhotoSaved(updatedPhotos);
      }

      setPreviewPhoto(null);
      setCurrentComment('');
      
      alert('✅ Photo saved with GPS!');
    } catch (error) {
      console.error('❌ Error saving photo:', error);
      alert('❌ Failed to save photo. It may be too large.');
    }
  };

  const deletePhoto = (photoId) => {
    const updatedPhotos = photos.filter(p => p.id !== photoId);
    setPhotos(updatedPhotos);
    localStorage.setItem('currentPhotos', JSON.stringify(updatedPhotos));
    console.log('🗑️ Photo deleted. Remaining:', updatedPhotos.length);
    
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
        Tap to take photos on your phone. GPS coordinates are automatically captured.
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
          onClick={() => {
            console.log('📷 Camera button clicked');
            fileInputRef.current.click();
          }}
          disabled={isCapturing}
          className="camera-button"
        >
          📷 {isCapturing ? 'Loading...' : 'Take Photo'}
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
              <div className="metadata-item">
                <strong>📦 Size:</strong> {Math.round(previewPhoto.size / 1024)} KB
              </div>
            </div>

            <div className="comment-section">
              <label htmlFor="photo-comment">
                <strong>💬 Photo Description (Optional):</strong>
              </label>
              <textarea
                id="photo-comment"
                value={currentComment}
                onChange={(e) => setCurrentComment(e.target.value)}
                placeholder="Describe what this photo shows: terrain, hazards, infrastructure, etc..."
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
          <h4>Captured Photos ({photos.length}):</h4>
          <div className="photo-grid">
            {photos.map((photo, index) => (
              <div key={photo.id} className="photo-card">
                <div className="photo-thumbnail-container">
                  <img src={photo.data} alt={`Site photo ${index + 1}`} className="photo-thumbnail" />
                </div>
                <div className="photo-info">
                  <div className="photo-time">
                    Photo {index + 1} - {new Date(photo.timestamp).toLocaleTimeString()}
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
