import React, { useState } from 'react';

const GPSCapture = ({ onCapture, label = 'Get GPS', small = false }) => {
  const [isGetting, setIsGetting] = useState(false);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  const captureGPS = () => {
    if (!navigator.geolocation) {
      setError('GPS not supported on this device');
      return;
    }

    setIsGetting(true);
    setError(null);
    setAttempt(attempt + 1);

    const timeout = attempt === 0 ? 30000 : 60000;

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
        setAttempt(0);
      },
      (error) => {
        let msg = 'GPS failed';
        if (error.code === 1) {
          msg = 'GPS permission denied. Enable location in browser settings.';
        } else if (error.code === 2) {
          msg = 'GPS unavailable. Move to open area with clear sky view.';
        } else if (error.code === 3) {
          msg = attempt === 0 ? 'GPS timeout. Click again to retry with 60s timeout.' : 'GPS timeout again. Try moving to better location.';
        }
        setError(msg);
        setIsGetting(false);
      },
      {
        enableHighAccuracy: true,
        timeout: timeout,
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
          padding: small ? '8px 12px' : '12px 16px',
          borderRadius: '6px',
          cursor: isGetting ? 'not-allowed' : 'pointer',
          fontSize: small ? '12px' : '14px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          minWidth: small ? '90px' : '120px',
          boxShadow: '0 2px 6px rgba(76, 175, 80, 0.3)'
        }}
      >
        <span>{isGetting ? '📡' : '📍'}</span>
        <span>{isGetting ? (attempt > 0 ? 'Waiting...' : 'Getting...') : label}</span>
      </button>
      {error && (
        <div style={{
          fontSize: '11px',
          color: '#d32f2f',
          marginTop: '6px',
          padding: '6px 8px',
          background: '#ffebee',
          borderRadius: '4px',
          border: '1px solid #ef5350',
          lineHeight: '1.4'
        }}>
          {error}
        </div>
      )}
      {isGetting && (
        <div style={{
          fontSize: '11px',
          color: '#f57c00',
          marginTop: '6px',
          padding: '6px 8px',
          background: '#fff3e0',
          borderRadius: '4px',
          fontStyle: 'italic'
        }}>
          {attempt === 0 ? 'Acquiring GPS signal... (up to 30s)' : 'Trying longer timeout... (up to 60s)'}
        </div>
      )}
    </div>
  );
};

export default GPSCapture;
