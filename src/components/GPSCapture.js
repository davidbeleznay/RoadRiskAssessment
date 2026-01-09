import React, { useState, useRef } from 'react';

const GPSCapture = ({ onCapture, label = 'Get GPS', small = false }) => {
  const [isGetting, setIsGetting] = useState(false);
  const [status, setStatus] = useState('');
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const watchIdRef = useRef(null);
  const timerRef = useRef(null);
  const countRef = useRef(null);

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
    setStatus('Requesting location permission...');
    setSecondsElapsed(0);

    // Start countdown timer
    countRef.current = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);

    const options = {
      enableHighAccuracy: true,
      timeout: 60000,
      maximumAge: 0
    };

    // Success handler
    const onSuccess = (position) => {
      cleanup();
      const gpsData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude,
        timestamp: new Date().toISOString()
      };
      onCapture(gpsData);
      setIsGetting(false);
      setStatus('');
      setSecondsElapsed(0);
    };

    // Error handler
    const onError = (err) => {
      cleanup();
      setIsGetting(false);
      setSecondsElapsed(0);
      
      if (err.code === 1) {
        setStatus('Permission denied');
        alert('📍 GPS Permission Denied!\n\nTo enable:\n• iOS: Settings → Safari → Location → Allow\n• Android: Tap lock icon in browser → Site settings → Location → Allow\n\nThen refresh the page and try again.');
      } else if (err.code === 2) {
        setStatus('Position unavailable');
        alert('📍 GPS Position Unavailable!\n\nTry these steps:\n1. Go OUTSIDE with clear sky view\n2. Wait 10 seconds, try again\n3. Toggle Airplane mode on/off\n4. Restart browser\n\nGPS works best outdoors away from buildings.');
      } else if (err.code === 3) {
        setStatus('Timeout - try outdoors');
        alert('📍 GPS Timeout After 60 Seconds\n\nThe GPS couldn\'t get a fix. Try:\n1. Move to open area with sky view\n2. Wait 30 seconds, try again\n3. Open Google/Apple Maps first (helps warm up GPS)\n4. Enter coordinates manually if needed');
      } else {
        setStatus('GPS error');
        alert('GPS Error: ' + err.message);
      }
    };

    // Update status after permission granted
    setTimeout(() => {
      if (isGetting) {
        setStatus('Searching for satellites...');
      }
    }, 1000);

    // Use watchPosition for better success rate
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        // Accept fix if accuracy is reasonable (under 100m) or after 30s take any fix
        if (position.coords.accuracy < 100 || secondsElapsed > 30) {
          onSuccess(position);
        } else {
          setStatus(`Getting better accuracy... (±${Math.round(position.coords.accuracy)}m)`);
        }
      },
      onError,
      options
    );

    // Timeout fallback after 60 seconds
    timerRef.current = setTimeout(() => {
      cleanup();
      setIsGetting(false);
      setSecondsElapsed(0);
      setStatus('Timeout');
      alert('📍 GPS Timeout After 60 Seconds\n\nCouldn\'t get GPS fix. For best results:\n1. Go outdoors with clear sky view\n2. Try opening Maps app first\n3. Or manually enter coordinates');
    }, 60000);
  };

  const cancelGPS = () => {
    cleanup();
    setIsGetting(false);
    setStatus('Cancelled');
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
        {isGetting ? `⏳ ${secondsElapsed}s... (tap to cancel)` : `📍 ${label}`}
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
          <div style={{marginBottom: '4px'}}>📡 {status || 'Searching for GPS signal...'}</div>
          <div style={{fontSize: '11px', opacity: 0.8}}>
            {secondsElapsed < 15 
              ? 'Make sure location is enabled and you\'re outdoors'
              : secondsElapsed < 30
              ? 'Still searching... move to open area if possible'
              : 'Taking longer than usual - try moving outdoors'}
          </div>
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
      {status && !isGetting && status !== 'Cancelled' && (
        <div style={{fontSize: '11px', color: '#f44336', marginTop: '4px'}}>{status}</div>
      )}
    </div>
  );
};

export default GPSCapture;
