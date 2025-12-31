// src/components/RiskSegmentCard.js
// Individual risk segment with structured QuickCapture entry

import React, { useState } from 'react';

const RiskSegmentCard = ({ segment, onUpdate, onDelete, segmentNumber }) => {
  const [showQCPoints, setShowQCPoints] = useState(false);

  const lineTypes = [
    "Road Inspection", "High Risk Road", "Moderate Road Risk", "Road Unsafe to Drive",
    "Brushing", "Capping", "Ditching", "Grading", "Reconstruction",
    "Seasonal Deactivation", "Roadside Broom", "Light Cut Slope Pullback"
  ];

  const pointTypes = [
    "Existing culvert 400", "Existing culvert 500", "Existing culvert 600", "Existing culvert 800",
    "Existing culvert 1000", "Existing culvert 1200", "Existing culvert 1400", "Existing culvert 1600", "Existing culvert 1800",
    "Install culvert 400", "Install culvert 500", "Install culvert 600", "Install culvert 800",
    "Install culvert 1000", "Install culvert 1200", "Install culvert 1400", "Install culvert 1600", "Install culvert 1800",
    "No Culvert Observed", "Remove Culvert", "Clean Culvert",
    "Install Water Bar", "Install Water Bar Reversed (into Ditch)", "Install Cross Ditch",
    "Install Cross Ditch at Culvert as Backup", "Install Ford", "Install French Drain", "Install Swale",
    "Danger tree", "Gate",
    "Water flowing across road surface", "Infrastructure or road failures", "Excessive soil rutting",
    "Excessive discolored water", "Tension cracks or instability signs", "Rockfall", "Other Storm Observations"
  ];

  const riskMatrix = {
    'High-High': { class: 5, level: 'Very High', color: '#f44336' },
    'High-Moderate': { class: 4, level: 'High', color: '#ff9800' },
    'High-Low': { class: 3, level: 'Moderate', color: '#ffc107' },
    'High-Very Low': { class: 1, level: 'Low', color: '#8bc34a' },
    'Moderate-High': { class: 4, level: 'High', color: '#ff9800' },
    'Moderate-Moderate': { class: 3, level: 'Moderate', color: '#ffc107' },
    'Moderate-Low': { class: 2, level: 'Moderate', color: '#ffc107' },
    'Moderate-Very Low': { class: 1, level: 'Low', color: '#8bc34a' },
    'Low-High': { class: 3, level: 'Moderate', color: '#ffc107' },
    'Low-Moderate': { class: 2, level: 'Moderate', color: '#ffc107' },
    'Low-Low': { class: 2, level: 'Moderate', color: '#ffc107' },
    'Low-Very Low': { class: 1, level: 'Low', color: '#8bc34a' },
    'Very Low-High': { class: 1, level: 'Low', color: '#8bc34a' },
    'Very Low-Moderate': { class: 1, level: 'Low', color: '#8bc34a' },
    'Very Low-Low': { class: 1, level: 'Low', color: '#8bc34a' },
    'Very Low-Very Low': { class: 1, level: 'Low', color: '#8bc34a' }
  };

  const getRisk = () => {
    if (!segment.likelihood || !segment.consequence) return null;
    return riskMatrix[`${segment.likelihood}-${segment.consequence}`];
  };

  const risk = getRisk();
  const length = segment.endKm && segment.startKm ? 
    (parseFloat(segment.endKm) - parseFloat(segment.startKm)).toFixed(1) : '0.0';

  const updateSegment = (field, value) => {
    onUpdate({ ...segment, [field]: value });
  };

  const updateQC = (field, value) => {
    onUpdate({ ...segment, quickCapture: { ...segment.quickCapture, [field]: value }});
  };

  const addPoint = () => {
    const newPoint = { km: '', featureType: '', photoTaken: false, description: '' };
    const points = segment.quickCapture?.points || [];
    updateQC('points', [...points, newPoint]);
    setShowQCPoints(true);
  };

  const updatePoint = (index, field, value) => {
    const points = [...(segment.quickCapture?.points || [])];
    points[index] = { ...points[index], [field]: value };
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
      marginBottom: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      {/* Segment Header */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px'}}>
        <div>
          <h3 style={{margin: 0, color: risk?.color || '#333'}}>
            Segment {segmentNumber} {risk && `- ${risk.level.toUpperCase()} RISK (Class ${risk.class})`}
          </h3>
          <div style={{fontSize: '13px', color: '#666', marginTop: '4px'}}>
            {length} km • KM {segment.startKm || '?'} - {segment.endKm || '?'}
          </div>
        </div>
        <button onClick={onDelete} style={{
          background: '#dc3545', color: 'white', border: 'none',
          padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px'
        }}>
          🗑️ Delete
        </button>
      </div>

      {/* Location */}
      <div style={{marginBottom: '16px'}}>
        <div style={{fontWeight: 'bold', marginBottom: '6px', fontSize: '14px'}}>📍 Location</div>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px'}}>
          <div>
            <label style={{fontSize: '12px', color: '#666'}}>Start KM</label>
            <input type="text" value={segment.startKm || ''} onChange={(e) => updateSegment('startKm', e.target.value)} 
              style={{width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '13px'}} 
              placeholder="5.2" />
          </div>
          <div>
            <label style={{fontSize: '12px', color: '#666'}}>End KM</label>
            <input type="text" value={segment.endKm || ''} onChange={(e) => updateSegment('endKm', e.target.value)}
              style={{width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '13px'}}
              placeholder="7.8" />
          </div>
          <div>
            <label style={{fontSize: '12px', color: '#666'}}>Length</label>
            <input type="text" value={length + ' km'} readOnly
              style={{width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ddd', background: '#f5f5f5', fontSize: '13px'}} />
          </div>
        </div>
      </div>

      {/* LMH Assessment */}
      <div style={{marginBottom: '16px'}}>
        <div style={{fontWeight: 'bold', marginBottom: '6px', fontSize: '14px'}}>⚖️ LMH Assessment</div>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
          <div>
            <label style={{fontSize: '12px', color: '#666'}}>Likelihood</label>
            <select value={segment.likelihood || ''} onChange={(e) => updateSegment('likelihood', e.target.value)}
              style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '13px'}}>
              <option value="">Select...</option>
              <option value="High">High</option>
              <option value="Moderate">Moderate</option>
              <option value="Low">Low</option>
              <option value="Very Low">Very Low</option>
            </select>
          </div>
          <div>
            <label style={{fontSize: '12px', color: '#666'}}>Consequence</label>
            <select value={segment.consequence || ''} onChange={(e) => updateSegment('consequence', e.target.value)}
              style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '13px'}}>
              <option value="">Select...</option>
              <option value="High">High</option>
              <option value="Moderate">Moderate</option>
              <option value="Low">Low</option>
              <option value="Very Low">Very Low</option>
            </select>
          </div>
        </div>
        {risk && (
          <div style={{
            marginTop: '10px', background: risk.color, color: 'white', 
            padding: '12px', borderRadius: '6px', textAlign: 'center', fontWeight: 'bold'
          }}>
            Risk Class {risk.class}: {risk.level}
          </div>
        )}
      </div>

      {/* QuickCapture */}
      <div style={{marginBottom: '16px'}}>
        <div style={{fontWeight: 'bold', marginBottom: '6px', fontSize: '14px'}}>📍 QuickCapture Data</div>
        <div style={{display: 'grid', gap: '10px'}}>
          <div>
            <label style={{fontSize: '12px', color: '#666'}}>Line Type</label>
            <select value={segment.quickCapture?.lineType || ''} onChange={(e) => updateQC('lineType', e.target.value)}
              style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '13px'}}>
              <option value="">Select QuickCapture line layer...</option>
              {lineTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={{fontSize: '12px', color: '#666'}}>Line Range</label>
            <input type="text" 
              value={segment.quickCapture?.lineRange || `KM ${segment.startKm || '?'}-${segment.endKm || '?'}`}
              onChange={(e) => updateQC('lineRange', e.target.value)}
              style={{width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '13px'}} />
          </div>
          <div>
            <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'}}>
              <input type="checkbox" 
                checked={segment.quickCapture?.photosCollected || false}
                onChange={(e) => updateQC('photosCollected', e.target.checked)}
                style={{width: '16px', height: '16px'}} />
              <span style={{fontSize: '13px', fontWeight: '500'}}>Photos collected for this segment</span>
            </label>
          </div>
        </div>
      </div>

      {/* Point Features */}
      <div style={{marginBottom: '16px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
          <div style={{fontWeight: 'bold', fontSize: '14px'}}>
            📌 Point Features ({(segment.quickCapture?.points || []).length})
          </div>
          <button onClick={() => setShowQCPoints(!showQCPoints)} style={{
            background: '#2196f3', color: 'white', border: 'none',
            padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px'
          }}>
            {showQCPoints ? '▼ Hide' : '▶ Show'}
          </button>
        </div>

        {showQCPoints && (
          <div style={{background: '#f9f9f9', padding: '12px', borderRadius: '6px'}}>
            {(segment.quickCapture?.points || []).map((point, idx) => (
              <div key={idx} style={{
                background: 'white', padding: '12px', borderRadius: '4px',
                marginBottom: '10px', border: '1px solid #ddd'
              }}>
                <div style={{display: 'grid', gridTemplateColumns: '100px 1fr auto', gap: '10px', marginBottom: '8px'}}>
                  <div>
                    <label style={{fontSize: '11px', color: '#666'}}>KM</label>
                    <input type="text" value={point.km || ''} onChange={(e) => updatePoint(idx, 'km', e.target.value)}
                      style={{width: '100%', padding: '5px', borderRadius: '3px', border: '1px solid #ddd', fontSize: '12px'}}
                      placeholder="5.4" />
                  </div>
                  <div>
                    <label style={{fontSize: '11px', color: '#666'}}>Feature Type</label>
                    <select value={point.featureType || ''} onChange={(e) => updatePoint(idx, 'featureType', e.target.value)}
                      style={{width: '100%', padding: '5px', borderRadius: '3px', border: '1px solid #ddd', fontSize: '12px'}}>
                      <option value="">Select...</option>
                      {pointTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <label style={{display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px'}}>
                    <input type="checkbox" checked={point.photoTaken || false}
                      onChange={(e) => updatePoint(idx, 'photoTaken', e.target.checked)} />
                    Photo
                  </label>
                </div>
                <div>
                  <label style={{fontSize: '11px', color: '#666'}}>Description</label>
                  <textarea value={point.description || ''} onChange={(e) => updatePoint(idx, 'description', e.target.value)}
                    rows={2} placeholder="Describe what photo shows..."
                    style={{width: '100%', padding: '6px', borderRadius: '3px', border: '1px solid #ddd', fontSize: '12px'}} />
                </div>
                <button onClick={() => deletePoint(idx)} style={{
                  marginTop: '6px', background: '#dc3545', color: 'white', border: 'none',
                  padding: '4px 8px', borderRadius: '3px', cursor: 'pointer', fontSize: '11px'
                }}>
                  Delete Point
                </button>
              </div>
            ))}
            <button onClick={addPoint} style={{
              background: '#4caf50', color: 'white', border: 'none',
              padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold'
            }}>
              + Add Point Feature
            </button>
          </div>
        )}
      </div>

      {/* Observations */}
      <div>
        <label style={{fontWeight: 'bold', fontSize: '14px', display: 'block', marginBottom: '6px'}}>
          📝 Observations
        </label>
        <textarea value={segment.observations || ''} onChange={(e) => updateSegment('observations', e.target.value)}
          rows={4} placeholder="Describe terrain, drainage, soils, hazards observed in this segment..."
          style={{width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '13px'}} />
      </div>
    </div>
  );
};

export default RiskSegmentCard;
