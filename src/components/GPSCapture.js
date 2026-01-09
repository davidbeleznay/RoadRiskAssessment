import React, { useState, useRef, useEffect } from 'react';

const GPSCapture = ({ onCapture, label = 'Get GPS', small = false }) => {
  const [isGetting, setIsGetting] = useState(false);
  const [status, setStatus] = useState('');
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const watchIdRef = useRef(null);
  const timerRef = useRef(null);
  const countRef = useRef(null);
  const startTimeRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => cleanup();
  }, []);

  const cleanup = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (countRef.current) {
      clearInterval(countRef.current);
      countRef.current = null;
    }
  };

  const captureGPS = () => {
    if (!navigator.geolocation) {
      alert('GPS not available on this device');
      return;
    }

    cleanup();
    setIsGetting(true);
    setStatus('Requesting location...');
    setSecondsElapsed(0);
    startTimeRef.current = Date.now();

    // Start countdown timer
    countRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setSecondsElapsed(elapsed);
    }, 1000);

    // Success handler - accept FIRST position we get
    const onSuccess = (position) => {
      cleanup();
      const gpsData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude,
        timestamp: new Date().toISOString()
      };
      console.log('GPS captured:', gpsData);
      onCapture(gpsData);
      setIsGetting(false);
      setStatus('');
      setSecondsElapsed(0);
    };

    // Error handler
    const onError = (err) => {
      console.log('GPS error:', err.code, err.message);
      cleanup();
      setIsGetting(false);
      setSecondsElapsed(0);
      
      if (err.code === 1) {
        setStatus('Permission denied');
        alert('📍 Location Permission Denied!\n\nPlease enable location access:\n• Check browser address bar for location icon\n• Or go to browser Settings → Site Settings → Location\n\nThen refresh and try again.');
      } else if (err.code === 2) {
        setStatus('Position unavailable');
        alert('📍 Position Unavailable\n\nYour device couldn\'t determine location.\n\nTry:\n1. Enable WiFi (helps indoor positioning)\n2. Move near a window\n3. Try again in a moment');
      } else if (err.code === 3) {
        setStatus('Timeout - try again');
        alert('📍 Location Timeout\n\nCouldn\'t get position in time.\n\nTip: Open Google Maps or Apple Maps first, let it find you, then come back and try again.');
      } else {
        setStatus('Error: ' + err.message);
        alert('GPS Error: ' + err.message);
      }
    };

    // Try high accuracy first
    const highAccuracyOptions = {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 60000  // Accept cached position up to 1 minute old
    };

    // Low accuracy fallback options
    const lowAccuracyOptions = {
      enableHighAccuracy: false,
      timeout: 30000,
      maximumAge: 300000  // Accept cached position up to 5 minutes old
    };

    setStatus('Trying high accuracy GPS...');

    // First try: High accuracy
    navigator.geolocation.getCurrentPosition(
      onSuccess,
      (err) => {
        console.log('High accuracy failed, trying low accuracy...', err.code);
        setStatus('Trying network location...');
        
        // Second try: Low accuracy (WiFi/cell)
        navigator.geolocation.getCurrentPosition(
          onSuccess,
          onError,
          lowAccuracyOptions
        );
      },
      highAccuracyOptions
    );

    // Overall timeout after 60 seconds
    timerRef.current = setTimeout(() => {
      if (isGetting) {
        cleanup();
        setIsGetting(false);
        setSecondsElapsed(0);
        setStatus('Timeout');
        alert('📍 Location Timeout (60s)\n\nCouldn\'t get your position.\n\nTry:\n1. Make sure Location Services are ON\n2. Open Maps app first to "warm up" GPS\n3. Move near a window or outdoors');
      }
    }, 60000);
  };

  const cancelGPS = () => {
    cleanup();
    setIsGetting(false);
    setStatus('');
    setSecondsElapsed(0);
  };

  return (
    <div>
      <button
        type="button"
        onClick={isGetting ? cancelGPS : captureGPS}
        style={{
          background: isGetting ? '#ff9800' : '#4caf50',
          color: 'white',
          border: 'none',
          padding: small ? '10px 14px' : '12px 20px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: small ? '13px' : '15px',
          fontWeight: 'bold',
          minWidth: small ? '100px' : '130px',
          boxShadow: isGetting ? '0 2px 8px rgba(255, 152, 0, 0.4)' : '0 2px 8px rgba(76, 175, 80, 0.4)'
        }}
      >
        {isGetting ? `⏳ ${secondsElapsed}s (cancel)` : `📍 ${label}`}
      </button>
      {isGetting && (
        <div style={{
          fontSize: '12px',
          color: '#f57c00',
          marginTop: '8px',
          padding: '10px',
          background: '#fff3e0',
          borderRadius: '6px',
          fontWeight: '500',
          border: '1px solid #ffcc80'
        }}>
          <div style={{marginBottom: '4px'}}>📡 {status}</div>
          <div style={{
            marginTop: '8px',
            height: '4px',
            background: '#ffe0b2',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${Math.min((secondsElapsed / 60) * 100, 100)}%`,
              height: '100%',
              background: '#ff9800',
              transition: 'width 1s linear'
            }} />
          </div>
        </div>
      )}
      {status && !isGetting && (
        <div style={{fontSize: '11px', color: status.includes('denied') || status.includes('Error') ? '#f44336' : '#666', marginTop: '4px'}}>{status}</div>
      )}
    </div>
  );
};

export default GPSCapture;
