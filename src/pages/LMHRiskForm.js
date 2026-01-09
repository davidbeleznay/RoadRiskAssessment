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
  const [roadInfo, setRoadInfo] = useState({ roadName: '', startKm: '', endKm: '', assessmentDate: new Date().toISOString().split('T')[0], assessor: '', weatherConditions: '', startGPS: null, endGPS: null });
  const [entireRoad, setEntireRoad] = useState({ likelihood: '', consequence: '', observations: '', quickCapture: { lineType: '', points: [] } });
  const [segments, setSegments] = useState([]);
  const [inspectionReport, setInspectionReport] = useState({ actionItems: '', requiresSpecialist: false, specialistNotes: '', nextInspectionDate: '', inspectionFrequency: '', inspectorDesignation: '' });

  useEffect(() => {
    const loadExisting = async () => {
      const idToLoad = location.state?.assessmentId;
      if (idToLoad) {
        setIsLoading(true); setEditMode(true); setAssessmentId(idToLoad);
        try {
          const existing = await getAssessmentDB(idToLoad);
          if (existing?.data) {
            const d = existing.data;
            if (d.basicInfo) setRoadInfo(d.basicInfo);
            if (d.useSegments !== undefined) setUseSegments(d.useSegments);
            if (d.useSegments && d.segments) setSegments(d.segments);
            if (!d.useSegments) { setEntireRoad({ likelihood: d.likelihood || '', consequence: d.consequence || '', observations: d.observations || '', quickCapture: d.quickCapture || { lineType: '', points: [] } }); }
            if (d.inspectionReport) setInspectionReport(d.inspectionReport);
            if (d.fieldNotes) localStorage.setItem('currentFieldNotes', JSON.stringify(d.fieldNotes));
          }
        } catch (error) { alert('Failed to load: ' + error.message); }
        finally { setIsLoading(false); }
      }
    };
    loadExisting();
  }, [location.state?.assessmentId]);

  const handleFrequencyChange = (f) => { setInspectionReport({...inspectionReport, inspectionFrequency: f}); if (f === 'After Storm Events') { setInspectionReport({...inspectionReport, inspectionFrequency: f, nextInspectionDate: ''}); return; } if (f && f !== 'Custom') { const base = roadInfo.assessmentDate ? new Date(roadInfo.assessmentDate) : new Date(); let m = 0; if (f === 'Semi-Annual') m = 6; else if (f === 'Annual') m = 12; else if (f === 'Bi-Annual') m = 24; else if (f === 'Tri-Annual') m = 36; else return; const next = new Date(base); next.setMonth(next.getMonth() + m); setInspectionReport({...inspectionReport, inspectionFrequency: f, nextInspectionDate: next.toISOString().split('T')[0]}); } };
  const getRiskMatrix = (l, c) => { const m = { 'High-High': {class: 5, level: 'Very High', color: '#f44336'}, 'High-Moderate': {class: 4, level: 'High', color: '#ff9800'}, 'High-Low': {class: 3, level: 'Moderate', color: '#ffc107'}, 'High-Very Low': {class: 1, level: 'Low', color: '#8bc34a'}, 'Moderate-High': {class: 4, level: 'High', color: '#ff9800'}, 'Moderate-Moderate': {class: 3, level: 'Moderate', color: '#ffc107'}, 'Moderate-Low': {class: 2, level: 'Moderate', color: '#ffc107'}, 'Moderate-Very Low': {class: 1, level: 'Low', color: '#8bc34a'}, 'Low-High': {class: 3, level: 'Moderate', color: '#ffc107'}, 'Low-Moderate': {class: 2, level: 'Moderate', color: '#ffc107'}, 'Low-Low': {class: 2, level: 'Moderate', color: '#ffc107'}, 'Low-Very Low': {class: 1, level: 'Low', color: '#8bc34a'}, 'Very Low-High': {class: 1, level: 'Low', color: '#8bc34a'}, 'Very Low-Moderate': {class: 1, level: 'Low', color: '#8bc34a'}, 'Very Low-Low': {class: 1, level: 'Low', color: '#8bc34a'}, 'Very Low-Very Low': {class: 1, level: 'Low', color: '#8bc34a'} }; return m[`${l}-${c}`] || null; };
  const hasCulvertReplacements = () => { const a = inspectionReport.actionItems.toLowerCase(); const has = a.includes('replace culvert') || a.includes('install culvert') || a.includes('remove culvert'); if (useSegments) return has || segments.some(s => s.quickCapture?.points?.some(p => p.featureType?.toLowerCase().includes('culvert'))); return has || entireRoad.quickCapture?.points?.some(p => p.featureType?.toLowerCase().includes('culvert')); };
  const getSegmentStats = () => { const s = {veryHigh: 0, high: 0, moderate: 0, low: 0, totalKm: 0}; segments.forEach(seg => { if (seg.likelihood && seg.consequence && seg.startKm && seg.endKm) { const r = getRiskMatrix(seg.likelihood, seg.consequence); if (r) { const len = parseFloat(seg.endKm) - parseFloat(seg.startKm); s.totalKm += len; if (r.class === 5) s.veryHigh += len; else if (r.class === 4) s.high += len; else if (r.class === 3 || r.class === 2) s.moderate += len; else s.low += len; } } }); return s; };
  const addSegment = () => setSegments([...segments, {id: Date.now(), startKm: '', endKm: '', likelihood: '', consequence: '', observations: '', quickCapture: {lineType: '', points: []}}]);
  const updateSegment = (id, u) => setSegments(segments.map(s => s.id === id ? u : s));
  const deleteSegment = (id) => { if (window.confirm('Delete?')) setSegments(segments.filter(s => s.id !== id)); };
  const handleSave = async () => { setIsSaving(true); try { const fn = JSON.parse(localStorage.getItem('currentFieldNotes') || '{}'); const ad = {basicInfo: roadInfo, riskMethod: useSegments ? 'LMH-Multi' : 'LMH', useSegments, inspectionReport, fieldNotes: fn}; if (useSegments) { ad.segments = segments; ad.summary = getSegmentStats(); } else { const r = getRiskMatrix(entireRoad.likelihood, entireRoad.consequence); ad.likelihood = entireRoad.likelihood; ad.consequence = entireRoad.consequence; ad.riskAssessment = {...r, method: 'LMH', riskLevel: r?.level, riskClass: r?.class}; ad.quickCapture = entireRoad.quickCapture; ad.observations = entireRoad.observations; ad.riskScore = `${entireRoad.likelihood}/${entireRoad.consequence}`; ad.riskCategory = r?.level; } await saveAssessmentDB(ad, assessmentId); alert(editMode ? 'Updated!' : 'Saved!'); setTimeout(() => navigate('/history'), 1000); } catch (e) { alert('Error: ' + e.message); } finally { setIsSaving(false); } };
  const sections = [{id: 'basic', title: 'Road Info', icon: '📝'}, {id: 'assessment', title: 'Assessment', icon: '⚖️'}, {id: 'notes', title: 'Notes', icon: '📋'}, {id: 'results', title: 'Summary', icon: '📊'}];
  
  if (isLoading) return (<div style={{padding: '60px', textAlign: 'center', fontSize: '24px'}}>Loading...</div>);

  return (
    <div className="road-risk-form">
      <div className="form-header">
        <h1>LMH Risk Assessment</h1>
        <p>Assess entire road or identify risk segments</p>
        {editMode && <div style={{background: '#e3f2fd', padding: '8px 16px', borderRadius: '6px', marginTop: '8px', fontSize: '14px', fontWeight: 'bold', color: '#1976d2'}}>EDIT MODE</div>}
        <button onClick={() => navigate('/')} className="back-button">Back</button>
      </div>

      <div className="section-navigation">
        {sections.map(s => (
          <button key={s.id} className={`nav-button ${activeSection === s.id ? 'active' : ''}`} onClick={() => setActiveSection(s.id)}>
            <span className="nav-icon">{s.icon}</span>
            <span className="nav-title">{s.title}</span>
          </button>
        ))}
      </div>

      <div className="form-content">
        {activeSection === 'basic' && (
          <div className="form-section">
            <h2>Road Information</h2>
            
            <div style={{marginBottom: '20px'}}>
              <label style={{fontWeight: 'bold', display: 'block', marginBottom: '6px'}}>Road Name</label>
              <input
                type="text"
                value={roadInfo.roadName}
                onChange={e => setRoadInfo({...roadInfo, roadName: e.target.value})}
                placeholder="FSR 123"
                style={{width: '100%', padding: '10px', borderRadius: '6px', border: '2px solid #ddd', fontSize: '14px'}}
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
                  style={{flex: 1, padding: '10px', borderRadius: '6px', border: '2px solid #2196f3', fontSize: '16px', fontWeight: 'bold'}}
                />
                <div style={{paddingTop: '2px'}}>
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
              </div>
              {roadInfo.startGPS && (
                <div style={{fontSize: '12px', color: '#4caf50', marginTop: '8px', padding: '8px', background: '#e8f5e9', borderRadius: '6px', border: '1px solid #4caf50'}}>
                  GPS: {roadInfo.startGPS.latitude.toFixed(6)}, {roadInfo.startGPS.longitude.toFixed(6)} (±{Math.round(roadInfo.startGPS.accuracy)}m)
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
                  style={{flex: 1, padding: '10px', borderRadius: '6px', border: '2px solid #2196f3', fontSize: '16px', fontWeight: 'bold'}}
                />
                <div style={{paddingTop: '2px'}}>
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
              </div>
              {roadInfo.endGPS && (
                <div style={{fontSize: '12px', color: '#4caf50', marginTop: '8px', padding: '8px', background: '#e8f5e9', borderRadius: '6px', border: '1px solid #4caf50'}}>
                  GPS: {roadInfo.endGPS.latitude.toFixed(6)}, {roadInfo.endGPS.longitude.toFixed(6)} (±{Math.round(roadInfo.endGPS.accuracy)}m)
                </div>
              )}
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px'}}>
              <div>
                <label style={{fontWeight: 'bold', display: 'block', marginBottom: '6px'}}>Assessor</label>
                <input type="text" value={roadInfo.assessor} onChange={e => setRoadInfo({...roadInfo, assessor: e.target.value})} placeholder="Your name" style={{width: '100%', padding: '10px', borderRadius: '6px', border: '2px solid #ddd', fontSize: '14px'}} />
              </div>
              <div>
                <label style={{fontWeight: 'bold', display: 'block', marginBottom: '6px'}}>Date</label>
                <input type="date" value={roadInfo.assessmentDate} onChange={e => setRoadInfo({...roadInfo, assessmentDate: e.target.value})} style={{width: '100%', padding: '10px', borderRadius: '6px', border: '2px solid #ddd', fontSize: '14px'}} />
              </div>
            </div>

            <div>
              <label style={{fontWeight: 'bold', display: 'block', marginBottom: '6px'}}>Weather</label>
              <select value={roadInfo.weatherConditions} onChange={e => setRoadInfo({...roadInfo, weatherConditions: e.target.value})} style={{width: '100%', padding: '10px', borderRadius: '6px', border: '2px solid #ddd', fontSize: '14px'}}>
                <option value="">Select...</option>
                {['Dry', 'Recent Rain', 'Wet', 'Snow'].map(w => <option key={w}>{w}</option>)}
              </select>
            </div>
          </div>
        )}

        {activeSection === 'assessment' && (
          <div className="form-section">
            <h2>Assessment</h2>
            <div style={{background: '#e3f2fd', padding: '16px', borderRadius: '8px', marginBottom: '20px'}}>
              <div style={{fontWeight: 'bold', marginBottom: '12px'}}>Assessment Approach</div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                <button onClick={() => setUseSegments(false)} style={{background: !useSegments ? 'white' : '#f5f5f5', border: !useSegments ? '3px solid #2196f3' : '1px solid #ddd', padding: '16px', borderRadius: '8px', cursor: 'pointer'}}>
                  <div style={{fontWeight: 'bold'}}>Entire Road</div>
                </button>
                <button onClick={() => setUseSegments(true)} style={{background: useSegments ? 'white' : '#f5f5f5', border: useSegments ? '3px solid #4caf50' : '1px solid #ddd', padding: '16px', borderRadius: '8px', cursor: 'pointer'}}>
                  <div style={{fontWeight: 'bold'}}>Risk Segments</div>
                </button>
              </div>
            </div>
            {useSegments ? (
              <div>
                {segments.map((seg, i) => <RiskSegmentCard key={seg.id} segment={seg} segmentNumber={i+1} onUpdate={u => updateSegment(seg.id, u)} onDelete={() => deleteSegment(seg.id)} />)}
                <button onClick={addSegment} style={{background: '#4caf50', color: 'white', padding: '14px', borderRadius: '8px', border: 'none', width: '100%', fontWeight: 'bold'}}>+ Add Segment</button>
              </div>
            ) : (
              <RiskSegmentCard segment={{...entireRoad, startKm: roadInfo.startKm, endKm: roadInfo.endKm}} segmentNumber={1} onUpdate={u => setEntireRoad({likelihood: u.likelihood, consequence: u.consequence, observations: u.observations, quickCapture: u.quickCapture})} onDelete={null} />
            )}
          </div>
        )}

        {activeSection === 'notes' && <div className="form-section"><h2>Field Notes</h2><FieldNotesSection /></div>}

        {activeSection === 'results' && (
          <div className="form-section">
            <h2>Summary</h2>
            <div style={{background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px'}}>
              <h3>{roadInfo.roadName || 'Untitled'}</h3>
              <p>KM {roadInfo.startKm} - {roadInfo.endKm}</p>
            </div>
            <div style={{marginBottom: '20px'}}>
              <h3>Inspection Report</h3>
              <div style={{marginBottom: '12px'}}>
                <label style={{fontWeight: 'bold', display: 'block', marginBottom: '6px'}}>Priority Actions</label>
                <textarea value={inspectionReport.actionItems} onChange={e => setInspectionReport({...inspectionReport, actionItems: e.target.value})} style={{width: '100%', minHeight: '80px', padding: '10px', borderRadius: '6px', border: '1px solid #ddd'}} placeholder="List items..." />
              </div>
              <div style={{marginBottom: '12px'}}>
                <label style={{fontWeight: 'bold', display: 'block', marginBottom: '6px'}}>Inspection Frequency</label>
                <select value={inspectionReport.inspectionFrequency} onChange={e => handleFrequencyChange(e.target.value)} style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd'}}>
                  <option value="">Select...</option>
                  <option value="Semi-Annual">Semi-Annual (6 months)</option>
                  <option value="Annual">Annual (12 months)</option>
                  <option value="Bi-Annual">Bi-Annual (24 months)</option>
                  <option value="Tri-Annual">Tri-Annual (36 months)</option>
                </select>
              </div>
              {inspectionReport.inspectionFrequency && (
                <div style={{marginBottom: '12px'}}>
                  <label style={{fontWeight: 'bold', display: 'block', marginBottom: '6px'}}>Next Inspection</label>
                  <input type="date" value={inspectionReport.nextInspectionDate} onChange={e => setInspectionReport({...inspectionReport, nextInspectionDate: e.target.value})} style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd'}} />
                </div>
              )}
              <div>
                <label style={{fontWeight: 'bold', display: 'block', marginBottom: '6px'}}>Inspector</label>
                <select value={inspectionReport.inspectorDesignation} onChange={e => setInspectionReport({...inspectionReport, inspectorDesignation: e.target.value})} style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd'}}>
                  <option value="">Select...</option>
                  <option value="RPF">RPF</option>
                  <option value="RFT">RFT</option>
                  <option value="P.Eng">P.Eng</option>
                </select>
              </div>
            </div>
            {hasCulvertReplacements() && (
              <div style={{background: '#fff3e0', padding: '16px', marginBottom: '20px', borderRadius: '8px', border: '2px solid #ff9800'}}>
                <strong>Section 11 WSA:</strong> Culvert work detected. Schedule LRM notification.
              </div>
            )}
            <div style={{textAlign: 'center', marginTop: '32px'}}>
              <button onClick={handleSave} disabled={isSaving} style={{background: '#2e7d32', color: 'white', padding: '18px 56px', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', border: 'none', cursor: isSaving ? 'not-allowed' : 'pointer'}}>
                {isSaving ? 'Saving...' : (editMode ? 'Update' : 'Save')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LMHRiskForm;
