import React, { useState } from 'react';
import GPSCapture from './GPSCapture';

const RiskSegmentCard = ({ segment, onUpdate, onDelete, segmentNumber }) => {
  const [showQCPoints, setShowQCPoints] = useState(false);
  
  const lineTypes = ["Road Inspection", "High Risk Road", "Moderate Road Risk", "Low Road Risk"];
  const pointTypes = ["Existing culvert", "Install culvert", "Remove culvert", "Install Water Bar", "Install Cross Ditch", "Danger tree", "Rockfall", "Other"];
  
  const riskMatrix = {
    'High-High': {class: 5, level: 'Very High', color: '#f44336'},
    'High-Moderate': {class: 4, level: 'High', color: '#ff9800'},
    'High-Low': {class: 3, level: 'Moderate', color: '#ffc107'},
    'High-Very Low': {class: 1, level: 'Low', color: '#8bc34a'},
    'Moderate-High': {class: 4, level: 'High', color: '#ff9800'},
    'Moderate-Moderate': {class: 3, level: 'Moderate', color: '#ffc107'},
    'Moderate-Low': {class: 2, level: 'Moderate', color: '#ffc107'},
    'Moderate-Very Low': {class: 1, level: 'Low', color: '#8bc34a'},
    'Low-High': {class: 3, level: 'Moderate', color: '#ffc107'},
    'Low-Moderate': {class: 2, level: 'Moderate', color: '#ffc107'},
    'Low-Low': {class: 2, level: 'Moderate', color: '#ffc107'},
    'Low-Very Low': {class: 1, level: 'Low', color: '#8bc34a'},
    'Very Low-High': {class: 1, level: 'Low', color: '#8bc34a'},
    'Very Low-Moderate': {class: 1, level: 'Low', color: '#8bc34a'},
    'Very Low-Low': {class: 1, level: 'Low', color: '#8bc34a'},
    'Very Low-Very Low': {class: 1, level: 'Low', color: '#8bc34a'}
  };
  
  const getRisk = () => {
    if (!segment.likelihood || !segment.consequence) return null;
    return riskMatrix[`${segment.likelihood}-${segment.consequence}`];
  };
  
  const risk = getRisk();
  const length = segment.endKm && segment.startKm ? (parseFloat(segment.endKm) - parseFloat(segment.startKm)).toFixed(1) : '0.0';
  
  const updateSegment = (field, value) => onUpdate({...segment, [field]: value});
  const updateQC = (field, value) => onUpdate({...segment, quickCapture: {...segment.quickCapture, [field]: value}});
  
  const addPoint = () => {
    const newPoint = {km: '', featureType: '', photoTaken: false, description: '', gps: null};
    const points = segment.quickCapture?.points || [];
    updateQC('points', [...points, newPoint]);
    setShowQCPoints(true);
  };
  
  const updatePoint = (index, field, value) => {
    const points = [...(segment.quickCapture?.points || [])];
    points[index] = {...points[index], [field]: value};
    updateQC('points', points);
  };
  
  const deletePoint = (index) => {
    const points = [...(segment.quickCapture?.points || [])];
    points.splice(index, 1);
    updateQC('points', points);
  };

  return (
    <div style={{
      background: 'white',
      border: `3px solid ${risk?.color || '#ddd'}`,
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px'
    }}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px'}}>
        <div>
          <h3 style={{margin: 0, color: risk?.color || '#333'}}>
            Segment {segmentNumber} {risk && `- ${risk.level.toUpperCase()} RISK (Class ${risk.class})`}
          </h3>
          <div style={{fontSize: '13px', color: '#666', marginTop: '4px'}}>
            {length} km
          </div>
        </div>
        {onDelete && (
          <button onClick={onDelete} style={{background: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer'}}>Delete</button>
        )}
      </div>

      <div style={{marginBottom: '16px'}}>
        <div style={{fontWeight: 'bold', marginBottom: '8px'}}>Location with GPS</div>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
          <div>
            <label style={{fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px'}}>Start KM</label>
            <div style={{display: 'flex', gap: '8px', alignItems: 'flex-start'}}>
              <input
                type="text"
                value={segment.startKm || ''}
                onChange={e => updateSegment('startKm', e.target.value)}
                style={{flex: 1, padding: '8px', borderRadius: '4px', border: '2px solid #2196f3', fontSize: '14px', fontWeight: 'bold'}}
                placeholder="0"
              />
              <GPSCapture
                label="GPS"
                small={true}
                onCapture={gps => {
                  updateSegment('startGPS', gps);
                  if (!segment.startKm) {
                    const km = window.prompt('Enter Start KM:', '');
                    if (km) updateSegment('startKm', km);
                  }
                }}
              />
            </div>
            {segment.startGPS && (
              <div style={{fontSize: '10px', color: '#4caf50', marginTop: '4px', padding: '4px 8px', background: '#e8f5e9', borderRadius: '4px'}}>
                GPS: {segment.startGPS.latitude.toFixed(6)}, {segment.startGPS.longitude.toFixed(6)}
              </div>
            )}
          </div>
          
          <div>
            <label style={{fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px'}}>End KM</label>
            <div style={{display: 'flex', gap: '8px', alignItems: 'flex-start'}}>
              <input
                type="text"
                value={segment.endKm || ''}
                onChange={e => updateSegment('endKm', e.target.value)}
                style={{flex: 1, padding: '8px', borderRadius: '4px', border: '2px solid #2196f3', fontSize: '14px', fontWeight: 'bold'}}
                placeholder="15"
              />
              <GPSCapture
                label="GPS"
                small={true}
                onCapture={gps => {
                  updateSegment('endGPS', gps);
                  if (!segment.endKm) {
                    const km = window.prompt('Enter End KM:', '');
                    if (km) updateSegment('endKm', km);
                  }
                }}
              />
            </div>
            {segment.endGPS && (
              <div style={{fontSize: '10px', color: '#4caf50', marginTop: '4px', padding: '4px 8px', background: '#e8f5e9', borderRadius: '4px'}}>
                GPS: {segment.endGPS.latitude.toFixed(6)}, {segment.endGPS.longitude.toFixed(6)}
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{marginBottom: '16px'}}>
        <div style={{fontWeight: 'bold', marginBottom: '6px'}}>LMH Assessment</div>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
          <div>
            <label style={{fontSize: '12px', color: '#666'}}>Likelihood</label>
            <select value={segment.likelihood || ''} onChange={e => updateSegment('likelihood', e.target.value)} style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd'}}>
              <option value="">Select...</option>
              {['High', 'Moderate', 'Low', 'Very Low'].map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label style={{fontSize: '12px', color: '#666'}}>Consequence</label>
            <select value={segment.consequence || ''} onChange={e => updateSegment('consequence', e.target.value)} style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd'}}>
              <option value="">Select...</option>
              {['High', 'Moderate', 'Low', 'Very Low'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        {risk && (
          <div style={{marginTop: '10px', background: risk.color, color: 'white', padding: '12px', borderRadius: '6px', textAlign: 'center', fontWeight: 'bold'}}>
            Risk Class {risk.class}: {risk.level}
          </div>
        )}
      </div>

      <div style={{marginBottom: '16px'}}>
        <div style={{fontWeight: 'bold', marginBottom: '6px'}}>QuickCapture Line</div>
        <select value={segment.quickCapture?.lineType || ''} onChange={e => updateQC('lineType', e.target.value)} style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd'}}>
          <option value="">Select line...</option>
          {lineTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div style={{marginBottom: '16px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
          <div style={{fontWeight: 'bold'}}>Point Features ({(segment.quickCapture?.points || []).length})</div>
          <button onClick={() => setShowQCPoints(!showQCPoints)} style={{background: '#2196f3', color: 'white', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px'}}>
            {showQCPoints ? 'Hide' : 'Show'}
          </button>
        </div>
        
        {showQCPoints && (
          <div style={{background: '#f9f9f9', padding: '12px', borderRadius: '6px'}}>
            {(segment.quickCapture?.points || []).map((point, idx) => (
              <div key={idx} style={{background: 'white', padding: '14px', borderRadius: '6px', marginBottom: '12px', border: '2px solid #e0e0e0'}}>
                <div style={{display: 'flex', gap: '8px', marginBottom: '10px'}}>
                  <div style={{flex: 1}}>
                    <label style={{fontSize: '11px', color: '#666', display: 'block', marginBottom: '4px'}}>KM</label>
                    <input
                      type="text"
                      value={point.km || ''}
                      onChange={e => updatePoint(idx, 'km', e.target.value)}
                      style={{width: '100%', padding: '8px', borderRadius: '4px', border: '2px solid #2196f3', fontSize: '14px', fontWeight: 'bold'}}
                      placeholder="5.4"
                    />
                  </div>
                  <div style={{paddingTop: '18px'}}>
                    <GPSCapture
                      label="GPS"
                      small={true}
                      onCapture={gps => {
                        updatePoint(idx, 'gps', gps);
                        if (!point.km) {
                          const kmInput = window.prompt('Enter KM:', '');
                          if (kmInput) updatePoint(idx, 'km', kmInput);
                        }
                      }}
                    />
                  </div>
                </div>

                {point.gps && (
                  <div style={{fontSize: '11px', color: '#4caf50', marginBottom: '10px', padding: '8px', background: '#e8f5e9', borderRadius: '4px'}}>
                    GPS: {point.gps.latitude.toFixed(6)}, {point.gps.longitude.toFixed(6)} (±{Math.round(point.gps.accuracy)}m)
                  </div>
                )}

                <div style={{marginBottom: '10px'}}>
                  <label style={{fontSize: '11px', color: '#666', display: 'block', marginBottom: '4px'}}>Feature Type</label>
                  <select value={point.featureType || ''} onChange={e => updatePoint(idx, 'featureType', e.target.value)} style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd'}}>
                    <option value="">Select...</option>
                    {pointTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div style={{marginBottom: '10px'}}>
                  <label style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                    <input type="checkbox" checked={point.photoTaken || false} onChange={e => updatePoint(idx, 'photoTaken', e.target.checked)} />
                    <span style={{fontSize: '13px', fontWeight: '600'}}>Photo Taken</span>
                  </label>
                </div>

                <div>
                  <label style={{fontSize: '11px', color: '#666', display: 'block', marginBottom: '4px'}}>Description</label>
                  <textarea value={point.description || ''} onChange={e => updatePoint(idx, 'description', e.target.value)} rows={3} placeholder="Describe..." style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd'}} />
                </div>

                <button onClick={() => deletePoint(idx)} style={{marginTop: '10px', background: '#dc3545', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer'}}>Delete</button>
              </div>
            ))}
            
            <button onClick={addPoint} style={{background: '#4caf50', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', width: '100%'}}>+ Add Point</button>
          </div>
        )}
      </div>

      <div>
        <label style={{fontWeight: 'bold', fontSize: '14px', display: 'block', marginBottom: '6px'}}>Observations</label>
        <textarea value={segment.observations || ''} onChange={e => updateSegment('observations', e.target.value)} rows={4} placeholder="Describe terrain, drainage, hazards..." style={{width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd'}} />
      </div>
    </div>
  );
};

export default RiskSegmentCard;
