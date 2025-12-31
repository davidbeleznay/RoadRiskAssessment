// src/pages/LMHRiskForm.js - Multi-Segment Support
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveAssessmentDB } from '../utils/db';
import RiskSegmentCard from '../components/RiskSegmentCard';
import LMHRiskMatrix from '../components/LMHRiskMatrix';
import LikelihoodGuidance from '../components/LikelihoodGuidance';
import ConsequenceGuidance from '../components/ConsequenceGuidance';
import FieldNotesSection from '../components/FieldNotesSection';
import '../styles/enhanced-form.css';

const LMHRiskForm = () => {
  const navigate = useNavigate();
  const [assessmentMode, setAssessmentMode] = useState('multi');
  const [activeSection, setActiveSection] = useState('setup');
  const [isSaving, setIsSaving] = useState(false);
  const [showFrameworks, setShowFrameworks] = useState({ likelihood: false, consequence: false, matrix: false });
  const [roadInfo, setRoadInfo] = useState({
    roadName: '', fullRangeStart: '', fullRangeEnd: '',
    assessmentDate: new Date().toISOString().split('T')[0],
    assessor: '', weatherConditions: ''
  });
  const [segments, setSegments] = useState([]);

  const addSegment = () => {
    setSegments([...segments, {
      id: Date.now(), startKm: '', endKm: '', likelihood: '', consequence: '',
      observations: '',
      quickCapture: { lineType: '', lineRange: '', photosCollected: false, points: [] }
    }]);
  };

  const updateSegment = (id, updated) => {
    setSegments(segments.map(s => s.id === id ? updated : s));
  };

  const deleteSegment = (id) => {
    if (window.confirm('Delete this segment?')) {
      setSegments(segments.filter(s => s.id !== id));
    }
  };

  const getSegmentStats = () => {
    const riskMatrix = {
      'High-High': 5, 'High-Moderate': 4, 'High-Low': 3, 'High-Very Low': 1,
      'Moderate-High': 4, 'Moderate-Moderate': 3, 'Moderate-Low': 2, 'Moderate-Very Low': 1,
      'Low-High': 3, 'Low-Moderate': 2, 'Low-Low': 2, 'Low-Very Low': 1,
      'Very Low-High': 1, 'Very Low-Moderate': 1, 'Very Low-Low': 1, 'Very Low-Very Low': 1
    };
    const stats = { veryHigh: 0, high: 0, moderate: 0, low: 0, totalKm: 0 };
    segments.forEach(seg => {
      if (seg.likelihood && seg.consequence && seg.startKm && seg.endKm) {
        const riskClass = riskMatrix[`${seg.likelihood}-${seg.consequence}`];
        const length = parseFloat(seg.endKm) - parseFloat(seg.startKm);
        stats.totalKm += length;
        if (riskClass === 5) stats.veryHigh += length;
        else if (riskClass === 4) stats.high += length;
        else if (riskClass === 3 || riskClass === 2) stats.moderate += length;
        else stats.low += length;
      }
    });
    return stats;
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const fieldNotes = JSON.parse(localStorage.getItem('currentFieldNotes') || '{}');
      await saveAssessmentDB({
        basicInfo: roadInfo,
        riskMethod: 'LMH-Multi',
        assessmentMode: 'multi-segment',
        segments: segments,
        fieldNotes,
        summary: getSegmentStats()
      });
      alert('✅ Assessment saved!');
      setTimeout(() => navigate('/history'), 1000);
    } catch (error) {
      alert('❌ Error: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const sections = [
    { id: 'setup', title: 'Setup', icon: '⚙️' },
    { id: 'segments', title: 'Risk Segments', icon: '📍' },
    { id: 'notes', title: 'Notes', icon: '📋' },
    { id: 'summary', title: 'Summary', icon: '📊' }
  ];

  return (
    <div className="road-risk-form">
      <div className="form-header">
        <h1>⚖️ LMH Multi-Segment Assessment</h1>
        <p>Full road inspection with structured QuickCapture integration</p>
        <button onClick={() => navigate('/')} className="back-button">← Back</button>
      </div>

      <div className="section-navigation">
        {sections.map(s => (
          <button key={s.id} className={`nav-button ${activeSection === s.id ? 'active' : ''}`}
            onClick={() => setActiveSection(s.id)}>
            <span className="nav-icon">{s.icon}</span>
            <span className="nav-title">{s.title}</span>
          </button>
        ))}
      </div>

      <div className="form-content">
        {activeSection === 'setup' && (
          <div className="form-section">
            <h2>Full Road Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Road Name/ID</label>
                <input type="text" value={roadInfo.roadName} 
                  onChange={(e) => setRoadInfo({...roadInfo, roadName: e.target.value})}
                  placeholder="FSR 123" />
              </div>
              <div className="form-group">
                <label>Full Range Start (KM)</label>
                <input type="text" value={roadInfo.fullRangeStart}
                  onChange={(e) => setRoadInfo({...roadInfo, fullRangeStart: e.target.value})}
                  placeholder="0" />
              </div>
              <div className="form-group">
                <label>Full Range End (KM)</label>
                <input type="text" value={roadInfo.fullRangeEnd}
                  onChange={(e) => setRoadInfo({...roadInfo, fullRangeEnd: e.target.value})}
                  placeholder="15" />
              </div>
              <div className="form-group">
                <label>Assessor</label>
                <input type="text" value={roadInfo.assessor}
                  onChange={(e) => setRoadInfo({...roadInfo, assessor: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Assessment Date</label>
                <input type="date" value={roadInfo.assessmentDate}
                  onChange={(e) => setRoadInfo({...roadInfo, assessmentDate: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Weather</label>
                <select value={roadInfo.weatherConditions}
                  onChange={(e) => setRoadInfo({...roadInfo, weatherConditions: e.target.value})}>
                  <option value="">Select</option>
                  <option value="Dry">Dry</option>
                  <option value="Recent Rain">Recent Rain</option>
                  <option value="Wet">Wet</option>
                  <option value="Snow">Snow</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'segments' && (
          <div className="form-section">
            <h2>Risk Segments</h2>
            
            {segments.length > 0 && (
              <div style={{
                background: 'linear-gradient(135deg, #e8f5e9, #f1f8e9)',
                padding: '16px', borderRadius: '8px', marginBottom: '20px',
                border: '2px solid #4caf50'
              }}>
                <div style={{fontWeight: 'bold', marginBottom: '10px'}}>Segment Summary</div>
                {(() => {
                  const stats = getSegmentStats();
                  return (
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px', fontSize: '13px'}}>
                      {stats.veryHigh > 0 && <div>🔴 Very High: {stats.veryHigh.toFixed(1)} km</div>}
                      {stats.high > 0 && <div>🟠 High: {stats.high.toFixed(1)} km</div>}
                      {stats.moderate > 0 && <div>🟡 Moderate: {stats.moderate.toFixed(1)} km</div>}
                      {stats.low > 0 && <div>🟢 Low: {stats.low.toFixed(1)} km</div>}
                      <div><strong>Total: {stats.totalKm.toFixed(1)} km</strong></div>
                    </div>
                  );
                })()}
              </div>
            )}

            <button onClick={() => setShowFrameworks({...showFrameworks, matrix: !showFrameworks.matrix})}
              style={{
                background: 'linear-gradient(135deg, #9c27b0, #ba68c8)', color: 'white',
                border: 'none', padding: '14px 20px', borderRadius: '8px', width: '100%',
                cursor: 'pointer', fontWeight: 'bold', marginBottom: '20px',
                display: 'flex', justifyContent: 'space-between'
              }}>
              <span>📊 LMH Risk Matrix (Table 4a)</span>
              <span>{showFrameworks.matrix ? '▼' : '▶'}</span>
            </button>
            {showFrameworks.matrix && <LMHRiskMatrix />}

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px'}}>
              <button onClick={() => setShowFrameworks({...showFrameworks, likelihood: !showFrameworks.likelihood})}
                style={{background: '#2196f3', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'}}>
                📊 Likelihood {showFrameworks.likelihood ? '▼' : '▶'}
              </button>
              <button onClick={() => setShowFrameworks({...showFrameworks, consequence: !showFrameworks.consequence})}
                style={{background: '#ff9800', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'}}>
                🌊 Consequence {showFrameworks.consequence ? '▼' : '▶'}
              </button>
            </div>
            
            {showFrameworks.likelihood && <LikelihoodGuidance />}
            {showFrameworks.consequence && <ConsequenceGuidance />}

            {segments.map((seg, idx) => (
              <RiskSegmentCard key={seg.id} segment={seg} segmentNumber={idx + 1}
                onUpdate={(u) => updateSegment(seg.id, u)}
                onDelete={() => deleteSegment(seg.id)} />
            ))}

            <button onClick={addSegment} style={{
              background: '#4caf50', color: 'white', border: 'none',
              padding: '14px 24px', borderRadius: '8px', fontSize: '16px',
              fontWeight: 'bold', cursor: 'pointer', width: '100%'
            }}>
              + Add Risk Segment
            </button>
          </div>
        )}

        {activeSection === 'notes' && (
          <div className="form-section">
            <h2>Overall Notes & Recommendations</h2>
            <FieldNotesSection />
          </div>
        )}

        {activeSection === 'summary' && (
          <div className="form-section">
            <h2>Assessment Summary</h2>
            <div style={{background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px'}}>
              <h3>Road: {roadInfo.roadName || 'Untitled'}</h3>
              <p>Full Range: KM {roadInfo.fullRangeStart || '?'} - {roadInfo.fullRangeEnd || '?'}</p>
              <p>Segments: {segments.length}</p>
              {(() => {
                const stats = getSegmentStats();
                return stats.totalKm > 0 && (
                  <div style={{marginTop: '16px'}}>
                    <div style={{fontWeight: 'bold', marginBottom: '8px'}}>Risk Distribution:</div>
                    {stats.veryHigh > 0 && <div>🔴 Very High: {stats.veryHigh.toFixed(1)} km</div>}
                    {stats.high > 0 && <div>🟠 High: {stats.high.toFixed(1)} km</div>}
                    {stats.moderate > 0 && <div>🟡 Moderate: {stats.moderate.toFixed(1)} km</div>}
                    {stats.low > 0 && <div>🟢 Low: {stats.low.toFixed(1)} km</div>}
                  </div>
                );
              })()}
            </div>

            <button onClick={handleSave} disabled={isSaving || segments.length === 0}
              style={{
                background: 'linear-gradient(135deg, #2e7d32, #66bb6a)',
                color: 'white', border: 'none',
                padding: '16px 48px', borderRadius: '8px',
                fontSize: '18px', fontWeight: 'bold',
                cursor: segments.length === 0 || isSaving ? 'not-allowed' : 'pointer',
                opacity: segments.length === 0 || isSaving ? 0.5 : 1
              }}>
              {isSaving ? 'Saving...' : 'Save Full Road Assessment'}
            </button>
            {segments.length === 0 && (
              <p style={{color: '#f57c00', marginTop: '10px', textAlign: 'center'}}>
                Add at least one risk segment to save
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LMHRiskForm;
