import React, { useState, useRef } from 'react';

/**
 * A component for capturing and managing photos in field forms
 * @param {Object} props Component props
 * @param {Array} props.photos Array of photo objects
 * @param {Function} props.onPhotosChange Function to handle photo changes
 */
const PhotoCapture = ({ photos = [], onPhotosChange }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  // Handle file input change
  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      addPhotos(files);
    }
  };

  // Process files and convert to data URLs
  const addPhotos = async (files) => {
    const newPhotos = [...photos];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        continue;
      }
      
      // Read file as data URL
      const dataUrl = await readFileAsDataURL(file);
      
      // Add to photos array
      newPhotos.push({
        id: `photo-${Date.now()}-${i}`,
        name: file.name,
        dataUrl,
        timestamp: new Date().toISOString()
      });
    }
    
    onPhotosChange(newPhotos);
  };

  // Convert file to data URL
  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle deleting a photo
  const handleDeletePhoto = (id) => {
    const updatedPhotos = photos.filter(photo => photo.id !== id);
    onPhotosChange(updatedPhotos);
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addPhotos(e.dataTransfer.files);
    }
  };

  // Trigger file input click
  const handleTriggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Styles for the component
  const styles = {
    photoUploadArea: {
      border: `2px dashed ${dragActive ? '#3498db' : '#ddd'}`,
      borderRadius: '8px',
      padding: '20px',
      textAlign: 'center',
      cursor: 'pointer',
      marginBottom: '20px',
      transition: 'all 0.2s ease',
      backgroundColor: dragActive ? 'rgba(52, 152, 219, 0.05)' : '#f9f9f9'
    },
    uploadIcon: {
      fontSize: '36px',
      color: '#7f8c8d',
      marginBottom: '10px'
    },
    uploadText: {
      color: '#34495e',
      marginBottom: '5px',
      fontWeight: '600'
    },
    uploadSubtext: {
      color: '#7f8c8d',
      fontSize: '0.9rem'
    },
    hiddenInput: {
      display: 'none'
    },
    photoGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      gap: '15px',
      marginTop: '20px'
    },
    photoItem: {
      position: 'relative',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      backgroundColor: '#fff'
    },
    photo: {
      width: '100%',
      height: '150px',
      objectFit: 'cover',
      display: 'block'
    },
    photoName: {
      padding: '8px 10px',
      fontSize: '0.85rem',
      color: '#34495e',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      backgroundColor: '#f9f9f9',
      borderTop: '1px solid #eee'
    },
    deleteButton: {
      position: 'absolute',
      top: '5px',
      right: '5px',
      backgroundColor: 'rgba(231, 76, 60, 0.9)',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '28px',
      height: '28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'all 0.2s ease',
      opacity: 0.8
    },
    timestamp: {
      fontSize: '0.75rem',
      color: '#7f8c8d',
      padding: '0 10px 8px',
      backgroundColor: '#f9f9f9'
    }
  };

  return (
    <div>
      {/* File input (hidden) */}
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        style={styles.hiddenInput}
      />
      
      {/* Dropzone area */}
      <div 
        style={styles.photoUploadArea}
        onClick={handleTriggerFileInput}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div style={styles.uploadIcon}>📷</div>
        <p style={styles.uploadText}>
          Click or drag photos here to upload
        </p>
        <p style={styles.uploadSubtext}>
          Upload up to 10 photos of road conditions, drainage structures, or hazards
        </p>
      </div>
      
      {/* Photo preview section */}
      {photos.length > 0 && (
        <div style={styles.photoGrid}>
          {photos.map(photo => (
            <div key={photo.id} style={styles.photoItem}>
              <img 
                src={photo.dataUrl} 
                alt={photo.name || 'Captured photo'} 
                style={styles.photo}
              />
              <button
                type="button"
                onClick={() => handleDeletePhoto(photo.id)}
                style={styles.deleteButton}
                title="Delete photo"
              >
                ×
              </button>
              <div style={styles.photoName}>
                {photo.name || 'Photo'}
              </div>
              <div style={styles.timestamp}>
                {new Date(photo.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoCapture;