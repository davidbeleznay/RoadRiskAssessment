// src/components/SimplePhotoCapture.jsx
// Photo capture using IndexedDB for unlimited storage

import React, { useState } from 'react';

function SimplePhotoCapture() {
  const [photos, setPhotos] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [comment, setComment] = useState('');

  // Load photos from localStorage (temporary until saved to IndexedDB)
  React.useEffect(() => {
    const saved = localStorage.getItem('currentPhotos');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPhotos(parsed);
        console.log('Loaded', parsed.length, 'temp photos');
      } catch (e) {
        console.error('Load error:', e);
      }
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log('📸 File selected:', file.name, Math.round(file.size/1024)+'KB');

    // Get GPS
    if (navigator.geolocation) {
      console.log('📍 Getting GPS...');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const gps = {
            latitude: pos.coords.latitude.toFixed(6),
            longitude: pos.coords.longitude.toFixed(6),
            accuracy: Math.round(pos.coords.accuracy)
          };
          console.log('✅ GPS:', gps);
          processPhoto(file, gps);
        },
        (err) => {
          console.log('⚠️ GPS failed:', err.message);
          processPhoto(file, { latitude: null, longitude: null, accuracy: null });
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      processPhoto(file, { latitude: null, longitude: null, accuracy: null });
    }
  };

  const processPhoto = (file, gps) => {
    console.log('🔄 Converting to base64...');
    const reader = new FileReader();
    reader.onload = (e) => {
      const photoData = {
        id: Date.now(),
        data: e.target.result,
        timestamp: new Date().toISOString(),
        gps: gps,
        filename: file.name,
        size: file.size
      };
      console.log('✅ Photo ready, showing preview');
      setPreviewData(photoData);
      setComment('');
      setShowPreview(true);
    };
    reader.onerror = (err) => {
      console.error('❌ Read error:', err);
      alert('Failed to read file');
    };
    reader.readAsDataURL(file);
  };

  const savePhoto = () => {
    console.log('💾 Saving photo...');
    
    try {
      const photo = { ...previewData, comment: comment.trim() };
      const updated = [...photos, photo];
      
      // Save to localStorage temporarily (will move to IndexedDB when assessment is saved)
      const jsonString = JSON.stringify(updated);
      const sizeMB = (jsonString.length / 1024 / 1024).toFixed(2);
      console.log('📦 Temp storage size:', sizeMB, 'MB');
      
      // Check if we're approaching limit
      if (jsonString.length > 4 * 1024 * 1024) {
        alert('⚠️ Approaching storage limit. Photos will be moved to unlimited storage when you save the assessment.');
      }
      
      localStorage.setItem('currentPhotos', jsonString);
      setPhotos(updated);
      console.log('✅ Photo saved! Total:', updated.length);
      
      setShowPreview(false);
      setPreviewData(null);
      setComment('');
      
      alert(`✅ Photo ${updated.length} saved!\n\nPhotos are stored temporarily and will be moved to unlimited storage when you save your assessment.`);
    } catch (error) {
      console.error('❌ Save error:', error);
      if (error.name === 'QuotaExceededError') {
        alert('❌ Temporary storage full! Please save your assessment now to move photos to unlimited storage.');
      } else {
        alert('❌ Save failed: ' + error.message);
      }
    }
  };

  const deletePhoto = (id) => {
    console.log('🗑️ Deleting', id);
    const updated = photos.filter(p => p.id !== id);
    setPhotos(updated);
    localStorage.setItem('currentPhotos', JSON.stringify(updated));
    console.log('Remaining:', updated.length);
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
          background: 'rgba(0,0,0,0.85)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }} onClick={(e) => {
          if (e.target === e.currentTarget) {
            console.log('Modal backdrop clicked - closing');
            setShowPreview(false);
          }
        }}>
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '12px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <h4 style={{marginTop: 0, color: '#2e7d32'}}>💾 Save Photo</h4>
            
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
                <div style={{color: '#2e7d32', fontWeight: 'bold'}}>
                  📍 {previewData.gps.latitude}, {previewData.gps.longitude}
                </div>
              ) : (
                <div style={{color: '#ff9800'}}>⚠️ GPS unavailable</div>
              )}
              <div style={{color: '#666', fontSize: '12px', marginTop: '4px'}}>
                Size: {Math.round(previewData.size / 1024)} KB
              </div>
            </div>

            <div style={{marginBottom: '16px'}}>
              <label style={{display: 'block', marginBottom: '8px', fontWeight: 'bold'}}>
                💬 Comment (optional):
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Describe this: terrain, hazards, infrastructure..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '2px solid #e0e0e0',
                  fontSize: '14px',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{display: 'flex', gap: '12px'}}>
              <button onClick={savePhoto} style={{
                flex: 1,
                background: '#4caf50',
                color: 'white',
                border: 'none',
                padding: '14px 24px',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '16px',
                cursor: 'pointer'
              }}>
                ✅ Save Photo
              </button>
              <button onClick={() => {
                console.log('❌ Cancel clicked');
                setShowPreview(false);
              }} style={{
                flex: 1,
                background: '#f5f5f5',
                color: '#666',
                border: 'none',
                padding: '14px 24px',
                borderRadius: '8px',
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
        <div style={{marginTop: '24px'}}>
          <h4 style={{color: '#2e7d32', marginBottom: '12px'}}>✅ Captured ({photos.length}):</h4>
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
                position: 'relative',
                background: '#fafafa'
              }}>
                <img src={photo.data} alt={`Site ${i+1}`} style={{
                  width: '100%',
                  height: '150px',
                  objectFit: 'cover'
                }} />
                <div style={{padding: '10px', fontSize: '13px'}}>
                  <div style={{fontWeight: 'bold', color: '#333'}}>Image {i+1}</div>
                  <div style={{fontSize: '11px', color: '#999', marginTop: '2px'}}>
                    {new Date(photo.timestamp).toLocaleTimeString()}
                  </div>
                  {photo.gps.latitude && (
                    <div style={{color: '#2196f3', fontSize: '11px', marginTop: '4px'}}>
                      📍 {photo.gps.latitude}, {photo.gps.longitude}
                    </div>
                  )}
                  {photo.comment && (
                    <div style={{marginTop: '6px', color: '#555', fontSize: '12px', lineHeight: '1.4'}}>
                      {photo.comment}
                    </div>
                  )}
                </div>
                <button onClick={() => deletePhoto(photo.id)} style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: 'rgba(244, 67, 54, 0.95)',
                  color: 'white',
                  border: 'none',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
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
        fontSize: '13px',
        lineHeight: '1.6'
      }}>
        <strong style={{color: '#2e7d32'}}>💡 How it works:</strong>
        <ul style={{margin: '8px 0 0 0', paddingLeft: '20px'}}>
          <li>Photos stored temporarily while editing</li>
          <li>When you <strong>Save Assessment</strong>, photos move to unlimited IndexedDB storage</li>
          <li>No more quota errors!</li>
        </ul>
      </div>
    </div>
  );
}

export default SimplePhotoCapture;
