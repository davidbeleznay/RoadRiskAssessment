import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { saveAssessmentDB, getAssessmentDB } from '../utils/db';
import GPSCapture from '../components/GPSCapture';
import RiskSegmentCard from '../components/RiskSegmentCard';
import LMHRiskMatrix from '../components/LMHRiskMatrix';
import LikelihoodGuidance from '../components/LikelihoodGuidance';
import ConsequenceGuidance from '../components/ConsequenceGuidance';
import FieldNotesSection from '../components/FieldNotesSection';
import '../styles/enhanced-form.css';

const LMHRiskForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('basic');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [assessmentId, setAssessmentId] = useState(null);
  const [useSegments, setUseSegments] = useState(false);
  const [showFrameworks, setShowFrameworks] = useState({ likelihood: false, consequence: false, matrix: false });
  const [roadInfo, setRoadInfo] = useState({ 
    roadName: '', 
    startKm: '', 
    endKm: '', 
    assessmentDate: new Date().toISOString().split('T')[0], 
    assessor: '', 
    weatherConditions: '', 
    startGPS: null, 
    endGPS: null 
  });
  const [entireRoad, setEntireRoad] = useState({ 
    likelihood: '', 
    consequence: '', 
    observations: '', 
    quickCapture: { lineType: '', points: [] } 
  });
  const [segments, setSegments] = useState([]);
  const [inspectionReport, setInspectionReport] = useState({ 
    actionItems: '', 
    requiresSpecialist: false, 
    specialistNotes: '', 
    nextInspectionDate: '', 
    inspectionFrequency: '', 
    inspectorDesignation: '' 
  });

  useEffect(() => {
    const loadExisting = async () => {
      const idToLoad = location.state?.assessmentId;
      if (idToLoad) {
        setIsLoading(true);
        setEditMode(true);
        setAssessmentId(idToLoad);
        try {
          const existing = await getAssessmentDB(idToLoad);
          if (existing?.data) {
            const d = existing.data;
            if (d.basicInfo) setRoadInfo(d.basicInfo);
            if (d.useSegments !== undefined) setUseSegments(d.useSegments);
            if (d.useSegments && d.segments) setSegments(d.segments);
            if (!d.useSegments) {
              setEntireRoad({ 
                likelihood: d.likelihood || '', 
                consequence: d.consequence || '', 
                observations: d.observations || '', 
                quickCapture: d.quickCapture || { lineType: '', points: [] } 
              });
            }
            if (d.inspectionReport) setInspectionReport(d.inspectionReport);
            if (d.fieldNotes) localStorage.setItem('currentFieldNotes', JSON.stringify(d.fieldNotes));
          }
        } catch (error) { 
          alert('Failed to load: ' + error.message); 
        } finally { 
          setIsLoading(false); 
        }
      }
    };
    loadExisting();
  }, [location.state?.assessmentId]);

  const handleFrequencyChange = (f) => {
    if (f === 'After Storm Events') {
      setInspectionReport({...inspectionReport, inspectionFrequency: f, nextInspectionDate: ''});
      return;
    }
    if (f && f !== 'Custom') {
      const base = roadInfo.assessmentDate ? new Date(roadInfo.assessmentDate) : new Date();
      let m = 0;
      if (f === 'Semi-Annual') m = 6;
      else if (f === 'Annual') m = 12;
      else if (f === 'Bi-Annual') m = 24;
      else if (f === 'Tri-Annual') m = 36;
      else { setInspectionReport({...inspectionReport, inspectionFrequency: f}); return; }
      const next = new Date(base);
      next.setMonth(next.getMonth() + m);
      setInspectionReport({...inspectionReport, inspectionFrequency: f, nextInspectionDate: next.toISOString().split('T')[0]});
    } else {
      setInspectionReport({...inspectionReport, inspectionFrequency: f});
    }
  };

  const getRiskMatrix = (l, c) => {
    const m = {
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
    return m[`${l}-${c}`] || null;
  };

  const getRecommendedFrequency = () => {
    if (useSegments) {
      const stats = getSegmentStats();
      if (stats.veryHigh > 0) return { frequency: 'Semi-Annual', reason: 'Very High risk segments present' };
      if (stats.high > 0) return { frequency: 'Annual', reason: 'High risk segments present' };
      if (stats.moderate > 0) return { frequency: 'Bi-Annual', reason: 'Moderate risk segments' };
      return { frequency: 'Tri-Annual', reason: 'Low risk road' };
    } else {
      const risk = getRiskMatrix(entireRoad.likelihood, entireRoad.consequence);
      if (!risk) return { frequency: '', reason: '' };
      if (risk.class === 5) return { frequency: 'Semi-Annual', reason: 'Very High risk' };
      if (risk.class === 4) return { frequency: 'Annual', reason: 'High risk' };
      if (risk.class === 3 || risk.class === 2) return { frequency: 'Bi-Annual', reason: 'Moderate risk' };
      return { frequency: 'Tri-Annual', reason: 'Low risk' };
    }
  };

  const hasCulvertReplacements = () => {
    const a = inspectionReport.actionItems.toLowerCase();
    const has = a.includes('replace culvert') || a.includes('install culvert') || a.includes('remove culvert');
    if (useSegments) return has || segments.some(s => s.quickCapture?.points?.some(p => p.featureType?.toLowerCase().includes('culvert')));
    return has || entireRoad.quickCapture?.points?.some(p => p.featureType?.toLowerCase().includes('culvert'));
  };

  const getSegmentStats = () => {
    const s = {veryHigh: 0, high: 0, moderate: 0, low: 0, totalKm: 0};
    segments.forEach(seg => {
      if (seg.likelihood && seg.consequence && seg.startKm && seg.endKm) {
        const r = getRiskMatrix(seg.likelihood, seg.consequence);
        if (r) {
          const len = parseFloat(seg.endKm) - parseFloat(seg.startKm);
          s.totalKm += len;
          if (r.class === 5) s.veryHigh += len;
          else if (r.class === 4) s.high += len;
          else if (r.class === 3 || r.class === 2) s.moderate += len;
          else s.low += len;
        }
      }
    });
    return s;
  };

  const addSegment = () => setSegments([...segments, {
    id: Date.now(), 
    startKm: '', 
    endKm: '', 
    likelihood: '', 
    consequence: '', 
    observations: '', 
    quickCapture: {lineType: '', points: []}
  }]);

  const updateSegment = (id, u) => setSegments(segments.map(s => s.id === id ? u : s));
  const deleteSegment = (id) => { if (window.confirm('Delete this segment?')) setSegments(segments.filter(s => s.id !== id)); };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const fn = JSON.parse(localStorage.getItem('currentFieldNotes') || '{}');
      const ad = {
        basicInfo: roadInfo,
        riskMethod: useSegments ? 'LMH-Multi' : 'LMH',
        useSegments,
        inspectionReport,
        fieldNotes: fn
      };
      if (useSegments) {
        ad.segments = segments;
        ad.summary = getSegmentStats();
      } else {
        const r = getRiskMatrix(entireRoad.likelihood, entireRoad.consequence);
        ad.likelihood = entireRoad.likelihood;
        ad.consequence = entireRoad.consequence;
        ad.riskAssessment = {...r, method: 'LMH', riskLevel: r?.level, riskClass: r?.class};
        ad.quickCapture = entireRoad.quickCapture;
        ad.observations = entireRoad.observations;
        ad.riskScore = `${entireRoad.likelihood}/${entireRoad.consequence}`;
        ad.riskCategory = r?.level;
      }
      await saveAssessmentDB(ad, assessmentId);
      alert(editMode ? 'Assessment updated!' : 'Assessment saved!');
      setTimeout(() => navigate('/history'), 1000);
    } catch (e) {
      alert('Error: ' + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const sections = [
    {id: 'basic', title: 'Road Info', icon: '📝'},
    {id: 'assessment', title: 'Assessment', icon: '⚖️'},
    {id: 'notes', title: 'Notes', icon: '📋'},
    {id: 'results', title: 'Summary', icon: '📊'}
  ];

  if (isLoading) {
    return (
      <div style={{padding: '60px', textAlign: 'center', fontSize: '24px', color: '#666'}}>
        Loading assessment...
      </div>
    );
  }

  return (
    <div className="road-risk-form">
      <div className="form-header">
        <h1>⚖️ LMH Risk Assessment</h1>
        <p>Likelihood × Consequence Risk Assessment</p>
        {editMode && (
          <div style={{
            background: '#e3f2fd',
            padding: '8px 16px',
            borderRadius: '6px',
            marginTop: '8px',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#1976d2'
          }}>
            EDIT MODE - Updating existing assessment
          </div>
        )}
        <button onClick={() => navigate('/')} className="back-button">← Back</button>
      </div>

      <div className="section-navigation">
        {sections.map(s => (
          <button
            key={s.id}
            className={`nav-button ${activeSection === s.id ? 'active' : ''}`}
            onClick={() => setActiveSection(s.id)}
          >
            <span className="nav-icon">{s.icon}</span>
            <span className="nav-title">{s.title}</span>
          </button>
        ))}
      </div>

      <div className="form-content">
        {/* ROAD INFO TAB */}
        {activeSection === 'basic' && (
          <div className="form-section" style={{borderTop: '4px solid #2196f3'}}>
            <h2 style={{color: '#2196f3', marginBottom: '20px'}}>Road Information</h2>

            <div style={{marginBottom: '20px'}}>
              <label style={{fontWeight: 'bold', display: 'block', marginBottom: '6px'}}>Road Name</label>
              <input
                type="text"
                value={roadInfo.roadName}
                onChange={e => setRoadInfo({...roadInfo, roadName: e.target.value})}
                placeholder="FSR 123"
                style={{width: '100%', padding: '12px', borderRadius: '6px', border: '2px solid #ddd', fontSize: '16px'}}
              />
            </div>

            <div style={{marginBottom: '20px'}}>
              <label style={{fontWeight: 'bold', display: 'block', marginBottom: '8px'}}>Start KM with GPS</label>
              <div style={{display: 'flex', gap: '10px', alignItems: 'flex-start'}}>
                <input
                  type="text"
                  value={roadInfo.startKm}
                  onChange={e => setRoadInfo({...roadInfo, startKm: e.target.value})}
                  placeholder="0"
                  style={{flex: 1, padding: '12px', borderRadius: '6px', border: '2px solid #2196f3', fontSize: '16px', fontWeight: 'bold'}}
                />
                <GPSCapture
                  label="Get GPS"
                  onCapture={gps => {
                    setRoadInfo({...roadInfo, startGPS: gps});
                    if (!roadInfo.startKm) {
                      const km = window.prompt('Enter Start KM for this GPS location:', '');
                      if (km) setRoadInfo({...roadInfo, startKm: km, startGPS: gps});
                    }
                  }}
                />
              </div>
              {roadInfo.startGPS && (
                <div style={{fontSize: '12px', color: '#4caf50', marginTop: '8px', padding: '8px', background: '#e8f5e9', borderRadius: '6px', border: '1px solid #4caf50'}}>
                  📍 GPS: {roadInfo.startGPS.latitude.toFixed(6)}, {roadInfo.startGPS.longitude.toFixed(6)} (±{Math.round(roadInfo.startGPS.accuracy)}m)
                </div>
              )}
            </div>

            <div style={{marginBottom: '20px'}}>
              <label style={{fontWeight: 'bold', display: 'block', marginBottom: '8px'}}>End KM with GPS</label>
              <div style={{display: 'flex', gap: '10px', alignItems: 'flex-start'}}>
                <input
                  type="text"
                  value={roadInfo.endKm}
                  onChange={e => setRoadInfo({...roadInfo, endKm: e.target.value})}
                  placeholder="15"
                  style={{flex: 1, padding: '12px', borderRadius: '6px', border: '2px solid #2196f3', fontSize: '16px', fontWeight: 'bold'}}
                />
                <GPSCapture
                  label="Get GPS"
                  onCapture={gps => {
                    setRoadInfo({...roadInfo, endGPS: gps});
                    if (!roadInfo.endKm) {
                      const km = window.prompt('Enter End KM for this GPS location:', '');
                      if (km) setRoadInfo({...roadInfo, endKm: km, endGPS: gps});
                    }
                  }}
                />
              </div>
              {roadInfo.endGPS && (
                <div style={{fontSize: '12px', color: '#4caf50', marginTop: '8px', padding: '8px', background: '#e8f5e9', borderRadius: '6px', border: '1px solid #4caf50'}}>
                  📍 GPS: {roadInfo.endGPS.latitude.toFixed(6)}, {roadInfo.endGPS.longitude.toFixed(6)} (±{Math.round(roadInfo.endGPS.accuracy)}m)
                </div>
              )}
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px'}}>
              <div>
                <label style={{fontWeight: 'bold', display: 'block', marginBottom: '6px'}}>Assessor</label>
                <input
                  type="text"
                  value={roadInfo.assessor}
                  onChange={e => setRoadInfo({...roadInfo, assessor: e.target.value})}
                  placeholder="Your name"
                  style={{width: '100%', padding: '12px', borderRadius: '6px', border: '2px solid #ddd', fontSize: '14px'}}
                />
              </div>
              <div>
                <label style={{fontWeight: 'bold', display: 'block', marginBottom: '6px'}}>Date</label>
                <input
                  type="date"
                  value={roadInfo.assessmentDate}
                  onChange={e => setRoadInfo({...roadInfo, assessmentDate: e.target.value})}
                  style={{width: '100%', padding: '12px', borderRadius: '6px', border: '2px solid #ddd', fontSize: '14px'}}
                />
              </div>
            </div>

            <div>
              <label style={{fontWeight: 'bold', display: 'block', marginBottom: '6px'}}>Weather Conditions</label>
              <select
                value={roadInfo.weatherConditions}
                onChange={e => setRoadInfo({...roadInfo, weatherConditions: e.target.value})}
                style={{width: '100%', padding: '12px', borderRadius: '6px', border: '2px solid #ddd', fontSize: '14px'}}
              >
                <option value="">Select weather...</option>
                <option value="Dry">Dry</option>
                <option value="Recent Rain">Recent Rain</option>
                <option value="Wet">Wet</option>
                <option value="Snow">Snow</option>
              </select>
            </div>
          </div>
        )}

        {/* ASSESSMENT TAB */}
        {activeSection === 'assessment' && (
          <div className="form-section" style={{borderTop: '4px solid #1976d2'}}>
            <h2 style={{color: '#1976d2', marginBottom: '20px'}}>LMH Risk Assessment</h2>

            {/* Assessment Approach Toggle */}
            <div style={{background: '#e3f2fd', padding: '20px', borderRadius: '8px', marginBottom: '24px', border: '2px solid #2196f3'}}>
              <div style={{fontWeight: 'bold', marginBottom: '12px', fontSize: '15px', color: '#1976d2'}}>Assessment Approach</div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                <button
                  onClick={() => setUseSegments(false)}
                  style={{
                    background: !useSegments ? 'white' : '#f5f5f5',
                    border: !useSegments ? '3px solid #2196f3' : '1px solid #ddd',
                    padding: '16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{fontWeight: 'bold', fontSize: '14px', marginBottom: '4px'}}>🛣️ Entire Road</div>
                  <div style={{fontSize: '12px', color: '#666'}}>Assess full road as single unit</div>
                </button>
                <button
                  onClick={() => setUseSegments(true)}
                  style={{
                    background: useSegments ? 'white' : '#f5f5f5',
                    border: useSegments ? '3px solid #4caf50' : '1px solid #ddd',
                    padding: '16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{fontWeight: 'bold', fontSize: '14px', marginBottom: '4px'}}>📍 Risk Segments</div>
                  <div style={{fontSize: '12px', color: '#666'}}>Multiple segments with varying risk</div>
                </button>
              </div>
            </div>

            {/* GUIDANCE TABLES - Expandable */}
            <div style={{marginBottom: '24px'}}>
              <button
                onClick={() => setShowFrameworks({...showFrameworks, matrix: !showFrameworks.matrix})}
                style={{
                  background: 'linear-gradient(135deg, #9c27b0, #ba68c8)',
                  color: 'white',
                  border: 'none',
                  padding: '14px 20px',
                  borderRadius: '8px',
                  width: '100%',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  marginBottom: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>📊 LMH Risk Matrix (Table 4a)</span>
                <span>{showFrameworks.matrix ? '▼' : '▶'}</span>
              </button>
              {showFrameworks.matrix && <LMHRiskMatrix />}

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                <button
                  onClick={() => setShowFrameworks({...showFrameworks, likelihood: !showFrameworks.likelihood})}
                  style={{
                    background: '#2196f3',
                    color: 'white',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>📊 Likelihood Guidance</span>
                  <span>{showFrameworks.likelihood ? '▼' : '▶'}</span>
                </button>
                <button
                  onClick={() => setShowFrameworks({...showFrameworks, consequence: !showFrameworks.consequence})}
                  style={{
                    background: '#ff9800',
                    color: 'white',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>🌊 Consequence Guidance</span>
                  <span>{showFrameworks.consequence ? '▼' : '▶'}</span>
                </button>
              </div>
              {showFrameworks.likelihood && <div style={{marginTop: '12px'}}><LikelihoodGuidance /></div>}
              {showFrameworks.consequence && <div style={{marginTop: '12px'}}><ConsequenceGuidance /></div>}
            </div>

            {/* Segment Summary (if multi-segment) */}
            {useSegments && segments.length > 0 && (
              <div style={{
                background: 'linear-gradient(135deg, #e8f5e9, #f1f8e9)',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '20px',
                border: '2px solid #4caf50'
              }}>
                <div style={{fontWeight: 'bold', marginBottom: '10px'}}>📊 Segment Summary</div>
                {(() => {
                  const stats = getSegmentStats();
                  return (
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px', fontSize: '13px'}}>
                      {stats.veryHigh > 0 && <div style={{color: '#f44336'}}>🔴 Very High: {stats.veryHigh.toFixed(1)} km</div>}
                      {stats.high > 0 && <div style={{color: '#ff9800'}}>🟠 High: {stats.high.toFixed(1)} km</div>}
                      {stats.moderate > 0 && <div style={{color: '#ffc107'}}>🟡 Moderate: {stats.moderate.toFixed(1)} km</div>}
                      {stats.low > 0 && <div style={{color: '#4caf50'}}>🟢 Low: {stats.low.toFixed(1)} km</div>}
                      <div style={{fontWeight: 'bold'}}>📏 Total: {stats.totalKm.toFixed(1)} km</div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Segment Cards or Entire Road */}
            {useSegments ? (
              <div>
                {segments.map((seg, idx) => (
                  <RiskSegmentCard
                    key={seg.id}
                    segment={seg}
                    segmentNumber={idx + 1}
                    onUpdate={u => updateSegment(seg.id, u)}
                    onDelete={() => deleteSegment(seg.id)}
                  />
                ))}
                <button
                  onClick={addSegment}
                  style={{
                    background: '#4caf50',
                    color: 'white',
                    border: 'none',
                    padding: '14px 24px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  + Add Risk Segment
                </button>
              </div>
            ) : (
              <div>
                <div style={{
                  background: '#fff3e0',
                  padding: '14px',
                  borderRadius: '6px',
                  marginBottom: '16px',
                  border: '2px solid #ff9800',
                  fontSize: '13px'
                }}>
                  <strong>📍 Entire Road Assessment:</strong> KM {roadInfo.startKm || '?'} - {roadInfo.endKm || '?'}
                </div>
                <RiskSegmentCard
                  segment={{...entireRoad, startKm: roadInfo.startKm, endKm: roadInfo.endKm}}
                  segmentNumber={1}
                  onUpdate={u => setEntireRoad({
                    likelihood: u.likelihood,
                    consequence: u.consequence,
                    observations: u.observations,
                    quickCapture: u.quickCapture
                  })}
                  onDelete={null}
                />
              </div>
            )}
          </div>
        )}

        {/* NOTES TAB */}
        {activeSection === 'notes' && (
          <div className="form-section" style={{borderTop: '4px solid #2e7d32'}}>
            <h2 style={{color: '#2e7d32', marginBottom: '20px'}}>Field Notes</h2>
            <FieldNotesSection />
          </div>
        )}

        {/* SUMMARY TAB */}
        {activeSection === 'results' && (
          <div className="form-section" style={{borderTop: '4px solid #4caf50'}}>
            <h2 style={{color: '#4caf50', marginBottom: '20px'}}>Assessment Summary</h2>

            {/* Road Summary Card */}
            <div style={{
              background: 'linear-gradient(135deg, #ffffff, #f5f5f5)',
              padding: '24px',
              borderRadius: '12px',
              marginBottom: '20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              border: '2px solid #e0e0e0'
            }}>
              <div style={{fontSize: '20px', fontWeight: 'bold', color: '#2e7d32', marginBottom: '12px'}}>
                {roadInfo.roadName || 'Untitled Road'}
              </div>
              <div style={{fontSize: '14px', color: '#555'}}>
                KM {roadInfo.startKm || '?'} - {roadInfo.endKm || '?'}
                {roadInfo.endKm && roadInfo.startKm && ` (${(parseFloat(roadInfo.endKm) - parseFloat(roadInfo.startKm)).toFixed(1)} km)`}
              </div>
              <div style={{fontSize: '13px', color: '#666', marginTop: '4px'}}>
                Assessor: {roadInfo.assessor || 'Not specified'} | Date: {roadInfo.assessmentDate}
              </div>
            </div>

            {/* Risk Result Display */}
            {!useSegments && entireRoad.likelihood && entireRoad.consequence && (
              <div style={{marginBottom: '20px'}}>
                {(() => {
                  const r = getRiskMatrix(entireRoad.likelihood, entireRoad.consequence);
                  return r && (
                    <div style={{
                      background: r.color,
                      color: 'white',
                      padding: '24px',
                      borderRadius: '12px',
                      textAlign: 'center',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                    }}>
                      <div style={{fontSize: '16px', marginBottom: '8px', opacity: 0.9}}>
                        {entireRoad.likelihood} Likelihood × {entireRoad.consequence} Consequence
                      </div>
                      <div style={{fontSize: '40px', fontWeight: 'bold', letterSpacing: '2px'}}>
                        CLASS {r.class}
                      </div>
                      <div style={{fontSize: '24px', marginTop: '8px', fontWeight: 'bold'}}>
                        {r.level.toUpperCase()} RISK
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Multi-Segment Summary */}
            {useSegments && segments.length > 0 && (
              <div style={{marginBottom: '20px'}}>
                <h3 style={{fontSize: '16px', marginBottom: '12px'}}>📍 Segment Breakdown</h3>
                {segments.map((seg, i) => {
                  const r = getRiskMatrix(seg.likelihood, seg.consequence);
                  return r && (
                    <div key={i} style={{
                      background: r.color,
                      color: 'white',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      marginBottom: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div><strong>Segment {i+1}:</strong> KM {seg.startKm}-{seg.endKm}</div>
                      <div style={{fontWeight: 'bold'}}>{r.level} (Class {r.class})</div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Inspection Report */}
            <div style={{
              background: '#e3f2fd',
              padding: '20px',
              borderRadius: '12px',
              border: '2px solid #1976d2',
              marginBottom: '20px'
            }}>
              <h3 style={{color: '#1976d2', margin: '0 0 16px 0', fontSize: '18px'}}>📋 Inspection Report (EGBC 3.7.2)</h3>

              <div style={{marginBottom: '12px'}}>
                <label style={{fontWeight: 'bold', display: 'block', marginBottom: '6px'}}>🔧 Priority Actions</label>
                <textarea
                  value={inspectionReport.actionItems}
                  onChange={e => setInspectionReport({...inspectionReport, actionItems: e.target.value})}
                  placeholder="List maintenance/repair items with priority levels"
                  style={{width: '100%', minHeight: '100px', padding: '12px', borderRadius: '6px', border: '2px solid #ddd', fontSize: '14px'}}
                />
              </div>

              <div style={{marginBottom: '12px'}}>
                <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'}}>
                  <input
                    type="checkbox"
                    checked={inspectionReport.requiresSpecialist}
                    onChange={e => setInspectionReport({...inspectionReport, requiresSpecialist: e.target.checked})}
                  />
                  <span style={{fontWeight: 'bold'}}>🎓 Requires Specialist (P.Eng/P.Geo)</span>
                </label>
                {inspectionReport.requiresSpecialist && (
                  <textarea
                    value={inspectionReport.specialistNotes}
                    onChange={e => setInspectionReport({...inspectionReport, specialistNotes: e.target.value})}
                    placeholder="Specify specialist type and reason for referral"
                    style={{width: '100%', minHeight: '60px', padding: '12px', marginTop: '8px', borderRadius: '6px', border: '2px solid #ddd', fontSize: '14px'}}
                  />
                )}
              </div>

              <div style={{marginBottom: '12px'}}>
                <label style={{fontWeight: 'bold', display: 'block', marginBottom: '6px'}}>📅 Inspection Frequency</label>
                {(() => {
                  const rec = getRecommendedFrequency();
                  return rec.frequency && (
                    <div style={{fontSize: '12px', color: '#1976d2', marginBottom: '6px', fontStyle: 'italic'}}>
                      Recommended: {rec.frequency} ({rec.reason})
                    </div>
                  );
                })()}
                <select
                  value={inspectionReport.inspectionFrequency}
                  onChange={e => handleFrequencyChange(e.target.value)}
                  style={{width: '100%', padding: '12px', borderRadius: '6px', border: '2px solid #ddd', fontSize: '14px'}}
                >
                  <option value="">Select frequency based on risk...</option>
                  <option value="Semi-Annual">Semi-Annual (6 months) - Very High Risk</option>
                  <option value="Annual">Annual (12 months) - High Risk</option>
                  <option value="Bi-Annual">Bi-Annual (24 months) - Moderate Risk</option>
                  <option value="Tri-Annual">Tri-Annual (36 months) - Low Risk</option>
                  <option value="After Storm Events">After Storm Events Only</option>
                  <option value="Custom">Custom Schedule</option>
                </select>
              </div>

              {inspectionReport.inspectionFrequency && inspectionReport.inspectionFrequency !== 'After Storm Events' && (
                <div style={{marginBottom: '12px'}}>
                  <label style={{fontWeight: 'bold', display: 'block', marginBottom: '6px'}}>🗓️ Next Inspection Date</label>
                  <input
                    type="date"
                    value={inspectionReport.nextInspectionDate}
                    onChange={e => setInspectionReport({...inspectionReport, nextInspectionDate: e.target.value})}
                    readOnly={inspectionReport.inspectionFrequency !== 'Custom'}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '6px',
                      border: '2px solid #ddd',
                      fontSize: '14px',
                      background: inspectionReport.inspectionFrequency === 'Custom' ? 'white' : '#f5f5f5'
                    }}
                  />
                </div>
              )}

              <div>
                <label style={{fontWeight: 'bold', display: 'block', marginBottom: '6px'}}>✍️ Inspector Designation</label>
                <select
                  value={inspectionReport.inspectorDesignation}
                  onChange={e => setInspectionReport({...inspectionReport, inspectorDesignation: e.target.value})}
                  style={{width: '100%', padding: '12px', borderRadius: '6px', border: '2px solid #ddd', fontSize: '14px'}}
                >
                  <option value="">Select professional designation...</option>
                  <option value="RPF">RPF - Registered Professional Forester</option>
                  <option value="RFT">RFT - Registered Forest Technologist</option>
                  <option value="P.Eng">P.Eng - Professional Engineer</option>
                  <option value="P.Geo">P.Geo - Professional Geoscientist</option>
                  <option value="Qualified Inspector">Qualified Inspector (under POR supervision)</option>
                  <option value="Other">Other Professional</option>
                </select>
              </div>
            </div>

            {/* Section 11 WSA Warning */}
            {hasCulvertReplacements() && (
              <div style={{
                background: 'linear-gradient(135deg, #fff3e0, #ffe0b2)',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '20px',
                border: '3px solid #ff9800',
                boxShadow: '0 4px 16px rgba(255, 152, 0, 0.25)'
              }}>
                <div style={{display: 'flex', gap: '16px', alignItems: 'start'}}>
                  <div style={{fontSize: '40px', flexShrink: 0}}>⚠️</div>
                  <div>
                    <div style={{fontWeight: 'bold', color: '#f57c00', marginBottom: '8px', fontSize: '16px'}}>
                      Section 11 Compliance Reminder (WSA)
                    </div>
                    <div style={{fontSize: '14px', color: '#555', lineHeight: '1.6'}}>
                      <strong>Culvert replacement/installation work detected.</strong>
                      <div style={{marginTop: '10px', padding: '12px', background: 'rgba(255, 255, 255, 0.7)', borderRadius: '6px'}}>
                        You must schedule a <strong>Planned Maintenance Event in LRM</strong> to meet Section 11 notification requirements under the <strong>Water Sustainability Act (WSA)</strong> before commencing work.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div style={{textAlign: 'center', marginTop: '32px'}}>
              <button
                onClick={handleSave}
                disabled={isSaving}
                style={{
                  background: 'linear-gradient(135deg, #2e7d32, #66bb6a)',
                  color: 'white',
                  border: 'none',
                  padding: '18px 56px',
                  borderRadius: '8px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  opacity: isSaving ? 0.5 : 1,
                  boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)',
                  transition: 'all 0.3s'
                }}
              >
                {isSaving ? '💾 Saving...' : (editMode ? '💾 Update Assessment' : '💾 Save Assessment')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LMHRiskForm;
