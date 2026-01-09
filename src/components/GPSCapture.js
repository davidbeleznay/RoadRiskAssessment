import React, { useState } from 'react';

const GPSCapture = ({ onCapture, label = 'Get GPS', small = false }) => {
  const [isGetting, setIsGetting] = useState(false);
  const [error, setError] = useState(null);

  const captureGPS = () => {
    if (!navigator.geolocation) {
      setError('GPS not supported');
      return;
    }

    setIsGetting(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const gpsData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toISOString()
        };
        onCapture(gpsData);
        setIsGetting(false);
      },
      (error) => {
        let msg = 'GPS failed';
        if (error.code === 1) msg = 'GPS permission denied';
        else if (error.code === 2) msg = 'GPS position unavailable';
        else if (error.code === 3) msg = 'GPS timeout - try again';
        setError(msg);
        setIsGetting(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0
      }
    );
  };

  return (
    <div>
      <button
        type="button"
        onClick={captureGPS}
        disabled={isGetting}
        style={{
          background: isGetting ? '#ff9800' : 'linear-gradient(135deg, #4caf50, #66bb6a)',
          color: 'white',
          border: 'none',
          padding: small ? '8px 12px' : '10px 16px',
          borderRadius: '6px',
          cursor: isGetting ? 'not-allowed' : 'pointer',
          fontSize: small ? '12px' : '13px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: '0 2px 6px rgba(76, 175, 80, 0.3)',
          transition: 'all 0.3s'
        }}
      >
        <span>{isGetting ? '📡' : '📍'}</span>
        <span>{isGetting ? 'Getting GPS...' : label}</span>
      </button>
      {error && (
        <div style={{
          fontSize: '11px',
          color: '#d32f2f',
          marginTop: '4px',
          padding: '4px 8px',
          background: '#ffebee',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default GPSCapture;
