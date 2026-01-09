import React, { useState } from 'react';

const GPSCapture = ({ onCapture, label = 'Get GPS', small = false }) => {
  const [isGetting, setIsGetting] = useState(false);
  const [error, setError] = useState(null);

  const captureGPS = () => {
    if (!navigator.geolocation) {
      alert('GPS not available on this device');
      return;
    }

    setIsGetting(true);
    setError(null);

    const options = {
      enableHighAccuracy: true,
      timeout: 45000,
      maximumAge: 0
    };

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
        setError(null);
      },
      (err) => {
        setIsGetting(false);
        if (err.code === 1) {
          alert('GPS Permission Denied!\n\nGo to browser settings and enable location permissions for this site.');
          setError('Permission denied');
        } else if (err.code === 2) {
          alert('GPS Position Unavailable!\n\nMake sure you are outdoors with clear view of sky. GPS may not work indoors.');
          setError('Position unavailable');
        } else if (err.code === 3) {
          alert('GPS Timeout!\n\nStill searching after 45 seconds. Try:\n1. Move outdoors\n2. Wait a moment and try again\n3. Restart your browser\n\nOr enter coordinates manually.');
          setError('Timeout - try again');
        } else {
          alert('GPS Error: ' + err.message);
          setError('GPS failed');
        }
      },
      options
    );
  };

  return (
    <div>
      <button
        type="button"
        onClick={captureGPS}
        disabled={isGetting}
        style={{
          background: isGetting ? '#ff9800' : '#4caf50',
          color: 'white',
          border: 'none',
          padding: small ? '10px 14px' : '12px 20px',
          borderRadius: '6px',
          cursor: isGetting ? 'not-allowed' : 'pointer',
          fontSize: small ? '13px' : '15px',
          fontWeight: 'bold',
          minWidth: small ? '100px' : '130px',
          boxShadow: '0 2px 8px rgba(76, 175, 80, 0.4)'
        }}
      >
        {isGetting ? '📡 Getting GPS...' : `📍 ${label}`}
      </button>
      {isGetting && (
        <div style={{
          fontSize: '12px',
          color: '#f57c00',
          marginTop: '8px',
          padding: '8px',
          background: '#fff3e0',
          borderRadius: '4px',
          fontWeight: '500'
        }}>
          Searching for GPS signal... (up to 45 seconds)
          <div style={{fontSize: '11px', marginTop: '4px', opacity: 0.8}}>Make sure location is enabled and you're outdoors</div>
        </div>
      )}
    </div>
  );
};

export default GPSCapture;
