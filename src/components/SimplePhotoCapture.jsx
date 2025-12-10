// src/components/SimplePhotoCapture.jsx
// Simplified photo capture - guaranteed to work

import React, { useState } from 'react';

function SimplePhotoCapture() {
  const [photos, setPhotos] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [comment, setComment] = useState('');

  // Load photos on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('currentPhotos');
    if (saved) {
      try {
        setPhotos(JSON.parse(saved));
      } catch (e) {
        console.error('Load error:', e);
      }
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log('File selected:', file.name);

    // Get GPS
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          processPhoto(file, {
            latitude: pos.coords.latitude.toFixed(6),
            longitude: pos.coords.longitude.toFixed(6),
            accuracy: Math.round(pos.coords.accuracy)
          });
        },
        () => {
          processPhoto(file, { latitude: null, longitude: null, accuracy: null });
        }
      );
    } else {
      processPhoto(file, { latitude: null, longitude: null, accuracy: null });
    }
  };

  const processPhoto = (file, gps) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewData({
        id: Date.now(),
        data: e.target.result,
        timestamp: new Date().toISOString(),
        gps: gps,
        filename: file.name
      });
      setComment('');
      setShowPreview(true);
    };
    reader.readAsDataURL(file);
  };

  const savePhoto = () => {
    const photo = { ...previewData, comment };
    const updated = [...photos, photo];
    setPhotos(updated);
    localStorage.setItem('currentPhotos', JSON.stringify(updated));
    setShowPreview(false);
    setPreviewData(null);
    setComment('');
    alert(`✅ Photo ${updated.length} saved!`);
  };

  const deletePhoto = (id) => {
    const updated = photos.filter(p => p.id !== id);
    setPhotos(updated);
    localStorage.setItem('currentPhotos', JSON.stringify(updated));
  };

  return (
    <div style={{
      background: 'white',
      padding: '24px',
      borderRadius: '12px',
      marginTop: '20px',
      border: '2px solid #2e7d32'
    }}>
      <h3 style={{color: '#2e7d32', marginTop: 0}}>📸 Photo Documentation</h3>
      
      <div style={{marginBottom: '20px'}}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{display: 'none'}}
          id="photo-input"
        />
        <label htmlFor="photo-input" style={{
          display: 'inline-block',
          background: 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)',
          color: 'white',
          padding: '14px 28px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '16px'
        }}>
          📷 Select Photo
        </label>
        <span style={{marginLeft: '16px', color: '#666', fontWeight: 'bold'}}>
          {photos.length} photo{photos.length !== 1 ? 's' : ''}
        </span>
      </div>

      {showPreview && previewData && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }} onClick={(e) => {
          if (e.target === e.currentTarget) setShowPreview(false);
        }}>
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h4 style={{marginTop: 0, color: '#2e7d32'}}>Save Photo</h4>
            
            <img src={previewData.data} alt="Preview" style={{
              width: '100%',
              borderRadius: '8px',
              marginBottom: '16px'
            }} />

            <div style={{
              background: '#f5f5f5',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              <div>📅 {new Date(previewData.timestamp).toLocaleString()}</div>
              {previewData.gps.latitude ? (
                <div style={{color: '#2e7d32'}}>
                  📍 {previewData.gps.latitude}, {previewData.gps.longitude}
                </div>
              ) : (
                <div style={{color: '#ff9800'}}>⚠️ No GPS available</div>
              )}
            </div>

            <div style={{marginBottom: '16px'}}>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: 'bold'}}>
                💬 Comment (optional):
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Describe what this photo shows..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '2px solid #e0e0e0',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{display: 'flex', gap: '12px'}}>
              <button onClick={savePhoto} style={{
                flex: 1,
                background: '#4caf50',
                color: 'white',
                border: 'none',
                padding: '12px',
                borderRadius: '6px',
                fontWeight: 'bold',
                fontSize: '16px',
                cursor: 'pointer'
              }}>
                ✅ Save Photo
              </button>
              <button onClick={() => setShowPreview(false)} style={{
                flex: 1,
                background: '#f5f5f5',
                color: '#666',
                border: 'none',
                padding: '12px',
                borderRadius: '6px',
                fontWeight: 'bold',
                fontSize: '16px',
                cursor: 'pointer'
              }}>
                ❌ Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {photos.length > 0 && (
        <div style={{marginTop: '20px'}}>
          <h4 style={{color: '#2e7d32'}}>Captured Photos:</h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            {photos.map((photo, i) => (
              <div key={photo.id} style={{
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <img src={photo.data} alt={`Site ${i+1}`} style={{
                  width: '100%',
                  height: '150px',
                  objectFit: 'cover'
                }} />
                <div style={{padding: '8px', fontSize: '12px'}}>
                  <div style={{fontWeight: 'bold'}}>Image {i+1}</div>
                  {photo.gps.latitude && (
                    <div style={{color: '#2196f3', fontSize: '11px'}}>
                      📍 {photo.gps.latitude}, {photo.gps.longitude}
                    </div>
                  )}
                  {photo.comment && (
                    <div style={{marginTop: '4px', color: '#666'}}>{photo.comment}</div>
                  )}
                </div>
                <button onClick={() => deletePhoto(photo.id)} style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: 'rgba(244, 67, 54, 0.9)',
                  color: 'white',
                  border: 'none',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}>
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
        background: '#e8f5e9',
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <strong style={{color: '#2e7d32'}}>📱 How to use:</strong>
        <ol style={{margin: '8px 0 0 20px', paddingLeft: 0}}>
          <li>Click "Select Photo" button above</li>
          <li>Choose an image from your device</li>
          <li>GPS location is automatically captured</li>
          <li>Add optional comment</li>
          <li>Click "Save Photo" to add to gallery</li>
          <li>Photos are included when you save assessment</li>
        </ol>
      </div>
    </div>
  );
}

export default SimplePhotoCapture;
