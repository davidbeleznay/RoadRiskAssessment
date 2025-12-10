// src/components/PhotoCapture.jsx
// Photo capture component - mobile-first design

import React, { useState, useRef, useEffect } from 'react';
import './PhotoCapture.css';

function PhotoCapture({ onPhotoSaved }) {
  const [photos, setPhotos] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [currentComment, setCurrentComment] = useState('');
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const fileInputRef = useRef(null);

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
    console.log('📸 Processing photo:', file.name, 'Size:', Math.round(file.size/1024), 'KB');
    setIsCapturing(true);
    
    try {
      // Get GPS with longer timeout for mobile
      const gpsData = await new Promise((resolve) => {
        if (!navigator.geolocation) {
          console.log('⚠️ Geolocation not supported');
          resolve({ latitude: null, longitude: null, accuracy: null });
          return;
        }

        console.log('📍 Requesting GPS...');
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const gps = {
              latitude: position.coords.latitude.toFixed(6),
              longitude: position.coords.longitude.toFixed(6),
              accuracy: Math.round(position.coords.accuracy)
            };
            console.log('✅ GPS acquired:', gps);
            resolve(gps);
          },
          (error) => {
            console.log('⚠️ GPS failed:', error.message);
            resolve({ latitude: null, longitude: null, accuracy: null });
          },
          { 
            enableHighAccuracy: true, 
            timeout: 15000,
            maximumAge: 30000
          }
        );
      });

      // Convert to base64
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

        console.log('✅ Photo ready for preview');
        setPreviewPhoto(photoData);
        setCurrentComment('');
        setIsCapturing(false);
      };
      
      reader.onerror = (error) => {
        console.error('❌ FileReader error:', error);
        alert('Failed to read photo');
        setIsCapturing(false);
      };
      
      reader.readAsDataURL(file);

    } catch (error) {
      console.error('❌ Capture error:', error);
      alert('Failed to capture photo: ' + error.message);
      setIsCapturing(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    console.log('📁 File input changed:', file ? file.name : 'no file');
    
    if (!file) {
      console.log('⚠️ No file selected');
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      alert('❌ Please select an image file');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      alert('❌ Photo too large (max 10MB). Try taking a new photo.');
      return;
    }
    
    capturePhoto(file);
  };

  const savePhoto = () => {
    if (!previewPhoto) {
      console.log('⚠️ No photo to save');
      return;
    }

    console.log('💾 Saving photo...');
    const photoWithComment = {
      ...previewPhoto,
      comment: currentComment
    };

    const updatedPhotos = [...photos, photoWithComment];
    
    try {
      const jsonString = JSON.stringify(updatedPhotos);
      const sizeMB = (jsonString.length / 1024 / 1024).toFixed(2);
      console.log('📦 Total photo data size:', sizeMB, 'MB');
      
      if (jsonString.length > 5 * 1024 * 1024) {
        alert('⚠️ Photo storage nearly full. Consider saving assessment soon.');
      }
      
      localStorage.setItem('currentPhotos', jsonString);
      setPhotos(updatedPhotos);
      console.log('✅ Photo saved! Total:', updatedPhotos.length);
      
      if (onPhotoSaved) {
        onPhotoSaved(updatedPhotos);
      }

      setPreviewPhoto(null);
      setCurrentComment('');
      
    } catch (error) {
      console.error('❌ Save error:', error);
      if (error.name === 'QuotaExceededError') {
        alert('❌ Storage full! Please save your assessment or delete some photos.');
      } else {
        alert('❌ Failed to save photo: ' + error.message);
      }
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
    console.log('❌ Photo preview cancelled');
    setPreviewPhoto(null);
    setCurrentComment('');
  };

  return (
    <div className="photo-capture-container">
      <h3>📸 Photo Documentation</h3>
      <p className="photo-description">
        Take photos with your phone camera. GPS coordinates are automatically captured.
      </p>

      <div className="camera-controls">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <button
          onClick={() => {
            console.log('📷 Camera button clicked');
            if (fileInputRef.current) {
              fileInputRef.current.click();
            } else {
              console.error('❌ File input ref not available');
            }
          }}
          disabled={isCapturing}
          className="camera-button"
          style={{
            fontSize: '18px',
            padding: '16px 32px'
          }}
        >
          📷 {isCapturing ? 'Processing...' : 'Take or Select Photo'}
        </button>
        <div className="photo-count" style={{fontSize: '16px', fontWeight: 'bold'}}>
          {photos.length} photo{photos.length !== 1 ? 's' : ''} captured
        </div>
      </div>

      {previewPhoto && (
        <div className="photo-preview-modal" onClick={(e) => {
          if (e.target.className === 'photo-preview-modal') {
            cancelPreview();
          }
        }}>
          <div className="photo-preview-content">
            <h4>Add Photo Details</h4>
            
            <div className="preview-image-container">
              <img src={previewPhoto.data} alt="Preview" className="preview-image" />
            </div>

            <div className="photo-metadata">
              <div className="metadata-item">
                <strong>📅 Time:</strong> {new Date(previewPhoto.timestamp).toLocaleString()}
              </div>
              {previewPhoto.gps.latitude ? (
                <div className="metadata-item">
                  <strong>📍 GPS:</strong> {previewPhoto.gps.latitude}, {previewPhoto.gps.longitude}
                  {previewPhoto.gps.accuracy && ` (±${previewPhoto.gps.accuracy}m)`}
                </div>
              ) : (
                <div className="metadata-item warning">
                  <strong>⚠️ No GPS:</strong> Location unavailable (photo still saved)
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
                placeholder="Describe what this photo shows..."
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
      
      <div style={{
        marginTop: '20px',
        padding: '12px',
        background: '#e3f2fd',
        borderRadius: '8px',
        fontSize: '13px',
        color: '#1565c0'
      }}>
        <strong>📱 Mobile Tip:</strong> On iPhone, you may need to allow camera/photo access when prompted. 
        Photos are stored locally on your device and included when you save the assessment.
      </div>
    </div>
  );
}

export default PhotoCapture;
