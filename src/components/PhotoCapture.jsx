// src/components/PhotoCapture.jsx
// Photo capture component - simplified and debugged

import React, { useState, useRef, useEffect } from 'react';
import './PhotoCapture.css';

function PhotoCapture({ onPhotoSaved }) {
  const [photos, setPhotos] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [currentComment, setCurrentComment] = useState('');
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [debugLog, setDebugLog] = useState([]);
  const fileInputRef = useRef(null);

  const addLog = (message) => {
    console.log(message);
    setDebugLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    const savedPhotos = localStorage.getItem('currentPhotos');
    if (savedPhotos) {
      try {
        const parsed = JSON.parse(savedPhotos);
        setPhotos(parsed);
        addLog(`📸 Loaded ${parsed.length} existing photos`);
      } catch (error) {
        addLog('❌ Error loading photos: ' + error.message);
      }
    }
  }, []);

  const capturePhoto = async (file) => {
    addLog(`📸 Processing: ${file.name} (${Math.round(file.size/1024)}KB)`);
    setIsCapturing(true);
    
    try {
      // Get GPS
      addLog('📍 Requesting GPS...');
      const gpsData = await new Promise((resolve) => {
        if (!navigator.geolocation) {
          addLog('⚠️ Geolocation not supported');
          resolve({ latitude: null, longitude: null, accuracy: null });
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const gps = {
              latitude: position.coords.latitude.toFixed(6),
              longitude: position.coords.longitude.toFixed(6),
              accuracy: Math.round(position.coords.accuracy)
            };
            addLog(`✅ GPS: ${gps.latitude}, ${gps.longitude}`);
            resolve(gps);
          },
          (error) => {
            addLog(`⚠️ GPS failed: ${error.message}`);
            resolve({ latitude: null, longitude: null, accuracy: null });
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 }
        );
      });

      // Convert to base64
      addLog('🔄 Converting photo to base64...');
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

        addLog('✅ Photo loaded, showing preview');
        setPreviewPhoto(photoData);
        setCurrentComment('');
        setIsCapturing(false);
      };
      
      reader.onerror = (error) => {
        addLog('❌ FileReader error: ' + error);
        alert('Failed to read photo');
        setIsCapturing(false);
      };
      
      reader.readAsDataURL(file);

    } catch (error) {
      addLog('❌ Capture error: ' + error.message);
      alert('Failed to capture: ' + error.message);
      setIsCapturing(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    addLog(`📁 File selected: ${file ? file.name : 'none'}`);
    
    if (!file) {
      addLog('⚠️ No file selected');
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      addLog('❌ Not an image file: ' + file.type);
      alert('Please select an image file');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      addLog('❌ File too large: ' + Math.round(file.size/1024/1024) + 'MB');
      alert('Photo too large (max 10MB)');
      return;
    }
    
    capturePhoto(file);
  };

  const savePhoto = () => {
    addLog('💾 Save button clicked');
    
    if (!previewPhoto) {
      addLog('⚠️ No photo in preview');
      alert('No photo to save');
      return;
    }

    try {
      const photoWithComment = {
        ...previewPhoto,
        comment: currentComment.trim()
      };

      const updatedPhotos = [...photos, photoWithComment];
      
      addLog(`💾 Saving photo ${updatedPhotos.length}...`);
      const jsonString = JSON.stringify(updatedPhotos);
      const sizeMB = (jsonString.length / 1024 / 1024).toFixed(2);
      addLog(`📦 Total size: ${sizeMB}MB`);
      
      localStorage.setItem('currentPhotos', jsonString);
      setPhotos(updatedPhotos);
      addLog(`✅ SUCCESS! Photo saved. Total: ${updatedPhotos.length}`);
      
      if (onPhotoSaved) {
        onPhotoSaved(updatedPhotos);
      }

      setPreviewPhoto(null);
      setCurrentComment('');
      alert(`✅ Photo ${updatedPhotos.length} saved!`);
      
    } catch (error) {
      addLog('❌ Save failed: ' + error.message);
      if (error.name === 'QuotaExceededError') {
        alert('❌ Storage full! Save your assessment or delete photos.');
      } else {
        alert('❌ Failed to save: ' + error.message);
      }
    }
  };

  const deletePhoto = (photoId) => {
    addLog(`🗑️ Deleting photo: ${photoId}`);
    const updatedPhotos = photos.filter(p => p.id !== photoId);
    setPhotos(updatedPhotos);
    localStorage.setItem('currentPhotos', JSON.stringify(updatedPhotos));
    addLog(`✅ Deleted. Remaining: ${updatedPhotos.length}`);
    
    if (onPhotoSaved) {
      onPhotoSaved(updatedPhotos);
    }
  };

  const cancelPreview = () => {
    addLog('❌ Preview cancelled');
    setPreviewPhoto(null);
    setCurrentComment('');
  };

  return (
    <div className="photo-capture-container">
      <h3>📸 Photo Documentation</h3>
      <p className="photo-description">
        Select photos from your device. GPS coordinates are automatically captured.
      </p>

      {/* Debug Log */}
      {debugLog.length > 0 && (
        <details style={{
          marginBottom: '20px',
          padding: '12px',
          background: '#f5f5f5',
          borderRadius: '6px',
          fontSize: '12px'
        }}>
          <summary style={{cursor: 'pointer', fontWeight: 'bold', color: '#1976d2'}}>
            🔍 Debug Log ({debugLog.length} events)
          </summary>
          <div style={{marginTop: '8px', maxHeight: '200px', overflow: 'auto'}}>
            {debugLog.map((log, i) => (
              <div key={i} style={{fontFamily: 'monospace', fontSize: '11px', padding: '2px 0'}}>
                {log}
              </div>
            ))}
          </div>
        </details>
      )}

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
            addLog('📷 Button clicked - opening file picker');
            fileInputRef.current?.click();
          }}
          disabled={isCapturing}
          className="camera-button"
          style={{ fontSize: '18px', padding: '16px 32px' }}
        >
          📷 {isCapturing ? 'Processing...' : 'Select Photo'}
        </button>
        <div className="photo-count" style={{fontSize: '16px', fontWeight: 'bold', color: photos.length > 0 ? '#2e7d32' : '#999'}}>
          {photos.length} photo{photos.length !== 1 ? 's' : ''} captured
        </div>
      </div>

      {previewPhoto && (
        <div className="photo-preview-modal">
          <div className="photo-preview-content">
            <h4 style={{color: '#2e7d32'}}>📸 Preview & Save Photo</h4>
            
            <div className="preview-image-container">
              <img src={previewPhoto.data} alt="Preview" className="preview-image" />
            </div>

            <div className="photo-metadata">
              <div className="metadata-item">
                <strong>📅 Time:</strong> {new Date(previewPhoto.timestamp).toLocaleString()}
              </div>
              {previewPhoto.gps.latitude ? (
                <div className="metadata-item" style={{color: '#2e7d32'}}>
                  <strong>📍 GPS:</strong> {previewPhoto.gps.latitude}, {previewPhoto.gps.longitude}
                  {previewPhoto.gps.accuracy && ` (±${previewPhoto.gps.accuracy}m)`}
                </div>
              ) : (
                <div className="metadata-item warning">
                  <strong>⚠️ GPS:</strong> Not available (photo will still save)
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
              <button 
                onClick={() => {
                  addLog('💾 Save Photo button clicked');
                  savePhoto();
                }}
                className="save-photo-btn"
                style={{
                  fontSize: '16px',
                  padding: '14px 28px',
                  fontWeight: 'bold'
                }}
              >
                ✅ Save Photo
              </button>
              <button 
                onClick={() => {
                  addLog('❌ Cancel clicked');
                  cancelPreview();
                }}
                className="cancel-photo-btn"
                style={{
                  fontSize: '16px',
                  padding: '14px 28px'
                }}
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {photos.length > 0 && (
        <div className="photo-gallery">
          <h4 style={{color: '#2e7d32'}}>✅ Captured Photos ({photos.length}):</h4>
          <div className="photo-grid">
            {photos.map((photo, index) => (
              <div key={photo.id} className="photo-card">
                <div className="photo-thumbnail-container">
                  <img src={photo.data} alt={`Photo ${index + 1}`} className="photo-thumbnail" />
                </div>
                <div className="photo-info">
                  <div className="photo-time" style={{fontWeight: 'bold', color: '#333'}}>
                    Photo {index + 1}
                  </div>
                  <div style={{fontSize: '12px', color: '#666', marginTop: '4px'}}>
                    {new Date(photo.timestamp).toLocaleString()}
                  </div>
                  {photo.gps.latitude && (
                    <div className="photo-gps" style={{marginTop: '6px'}}>
                      📍 {photo.gps.latitude}, {photo.gps.longitude}
                    </div>
                  )}
                  {photo.comment && (
                    <div className="photo-comment-display" style={{marginTop: '8px'}}>
                      💬 {photo.comment}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => {
                    addLog(`🗑️ Delete photo ${photo.id}`);
                    deletePhoto(photo.id);
                  }}
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
        padding: '16px',
        background: '#e3f2fd',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#1565c0'
      }}>
        <strong>📱 Instructions:</strong>
        <ol style={{margin: '8px 0 0 20px', paddingLeft: 0}}>
          <li>Click "Select Photo" to choose an image</li>
          <li>Preview appears with GPS location</li>
          <li>Add optional comment describing the photo</li>
          <li><strong>Click "Save Photo"</strong> to add to gallery</li>
          <li>Photos are saved with your assessment</li>
        </ol>
      </div>
    </div>
  );
}

export default PhotoCapture;
