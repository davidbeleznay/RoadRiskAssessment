import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { saveAssessmentDB, getAssessmentDB } from '../utils/db';
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
  const [roadInfo, setRoadInfo] = useState({ roadName: '', startKm: '', endKm: '', assessmentDate: new Date().toISOString().split('T')[0], assessor: '', weatherConditions: '' });
  const [entireRoad, setEntireRoad] = useState({ likelihood: '', consequence: '', observations: '', quickCapture: { lineType: '', points: [] } });
  const [segments, setSegments] = useState([]);
  const [inspectionReport, setInspectionReport] = useState({ actionItems: '', requiresSpecialist: false, specialistNotes: '', nextInspectionDate: '', inspectionFrequency: '', inspectorDesignation: '' });

  useEffect(() => {
    const loadExisting = async () => {
      const idToLoad = location.state?.assessmentId;
      console.log('Edit mode check:', idToLoad);
      if (idToLoad) {
        setIsLoading(true);
        setEditMode(true);
        setAssessmentId(idToLoad);
        try {
          const existing = await getAssessmentDB(idToLoad);
          console.log('Loaded assessment:', existing);
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
            console.log('Data loaded successfully');
          }
        } catch (error) {
          console.error('Load error:', error);
          alert('Failed to load: ' + error.message);
        } finally {
          setIsLoading(false);
        }
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
  const handleSave = async () => { setIsSaving(true); try { const fn = JSON.parse(localStorage.getItem('currentFieldNotes') || '{}'); const ad = {basicInfo: roadInfo, riskMethod: useSegments ? 'LMH-Multi' : 'LMH', useSegments, inspectionReport, fieldNotes: fn}; if (useSegments) { ad.segments = segments; ad.summary = getSegmentStats(); } else { const r = getRiskMatrix(entireRoad.likelihood, entireRoad.consequence); ad.likelihood = entireRoad.likelihood; ad.consequence = entireRoad.consequence; ad.riskAssessment = {...r, method: 'LMH', riskLevel: r?.level, riskClass: r?.class}; ad.quickCapture = entireRoad.quickCapture; ad.observations = entireRoad.observations; ad.riskScore = `${entireRoad.likelihood}/${entireRoad.consequence}`; ad.riskCategory = r?.level; } await saveAssessmentDB(ad, assessmentId); alert(editMode ? 'Assessment updated!' : 'Assessment saved!'); setTimeout(() => navigate('/history'), 1000); } catch (e) { alert('Error: ' + e.message); } finally { setIsSaving(false); } };
  
  if (isLoading) return (<div style={{padding: '60px', textAlign: 'center', fontSize: '24px', color: '#666'}}>Loading assessment...</div>);

  return (<div className="road-risk-form"><div className="form-header"><h1>LMH Risk Assessment</h1><p>Assess entire road or identify risk segments</p>{editMode && <div style={{background: '#e3f2fd', padding: '8px 16px', borderRadius: '6px', marginTop: '8px', fontSize: '14px', fontWeight: 'bold', color: '#1976d2'}}>EDIT MODE - Updating existing assessment</div>}<button onClick={() => navigate('/')} className="back-button">Back</button></div><div className="section-navigation">{[{id: 'basic', title: 'Road Info', icon: '📝'}, {id: 'assessment', title: 'Assessment', icon: '⚖️'}, {id: 'notes', title: 'Notes', icon: '📋'}, {id: 'results', title: 'Summary', icon: '📊'}].map(s => (<button key={s.id} className={`nav-button ${activeSection === s.id ? 'active' : ''}`} onClick={() => setActiveSection(s.id)}><span className="nav-icon">{s.icon}</span><span className="nav-title">{s.title}</span></button>))}</div><div className="form-content">{activeSection === 'basic' && (<div className="form-section"><h2>Road Information</h2><div className="form-grid">{[{name: 'roadName', label: 'Road Name', placeholder: 'FSR 123'}, {name: 'startKm', label: 'Start KM'}, {name: 'endKm', label: 'End KM'}, {name: 'assessor', label: 'Assessor'}, {name: 'assessmentDate', label: 'Date', type: 'date'}].map(f => (<div key={f.name} className="form-group"><label>{f.label}</label><input type={f.type || 'text'} value={roadInfo[f.name]} onChange={e => setRoadInfo({...roadInfo, [f.name]: e.target.value})} placeholder={f.placeholder} /></div>))}<div className="form-group"><label>Weather</label><select value={roadInfo.weatherConditions} onChange={e => setRoadInfo({...roadInfo, weatherConditions: e.target.value})}><option value="">Select</option>{['Dry', 'Recent Rain', 'Wet', 'Snow'].map(w => <option key={w}>{w}</option>)}</select></div></div></div>)}{activeSection === 'assessment' && (<div className="form-section"><h2>Assessment</h2><div style={{background: '#e3f2fd', padding: '16px', borderRadius: '8px', marginBottom: '20px'}}><div style={{fontWeight: 'bold', marginBottom: '12px'}}>Assessment Approach</div><div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}><button onClick={() => setUseSegments(false)} style={{background: !useSegments ? 'white' : '#f5f5f5', border: !useSegments ? '3px solid #2196f3' : '1px solid #ddd', padding: '16px', borderRadius: '8px', cursor: 'pointer'}}><div style={{fontWeight: 'bold'}}>Entire Road</div></button><button onClick={() => setUseSegments(true)} style={{background: useSegments ? 'white' : '#f5f5f5', border: useSegments ? '3px solid #4caf50' : '1px solid #ddd', padding: '16px', borderRadius: '8px', cursor: 'pointer'}}><div style={{fontWeight: 'bold'}}>Risk Segments</div></button></div></div>{useSegments ? (<div>{segments.map((seg, i) => (<RiskSegmentCard key={seg.id} segment={seg} segmentNumber={i+1} onUpdate={u => updateSegment(seg.id, u)} onDelete={() => deleteSegment(seg.id)} />))}<button onClick={addSegment} style={{background: '#4caf50', color: 'white', padding: '14px', borderRadius: '8px', border: 'none', width: '100%', fontWeight: 'bold', cursor: 'pointer'}}>+ Add Segment</button></div>) : (<RiskSegmentCard segment={{...entireRoad, startKm: roadInfo.startKm, endKm: roadInfo.endKm}} segmentNumber={1} onUpdate={u => setEntireRoad({likelihood: u.likelihood, consequence: u.consequence, observations: u.observations, quickCapture: u.quickCapture})} onDelete={null} />)}</div>)}{activeSection === 'notes' && (<div className="form-section"><h2>Field Notes</h2><FieldNotesSection /></div>)}{activeSection === 'results' && (<div className="form-section"><h2>Summary & Inspection</h2><div style={{background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px'}}><h3>Road: {roadInfo.roadName || 'Untitled'}</h3><p>KM {roadInfo.startKm} - {roadInfo.endKm}</p><p>Assessor: {roadInfo.assessor}</p></div><div style={{marginBottom: '20px'}}><h3>Inspection Report</h3><div style={{marginBottom: '12px'}}><label style={{fontWeight: 'bold', display: 'block', marginBottom: '6px'}}>Priority Actions</label><textarea value={inspectionReport.actionItems} onChange={e => setInspectionReport({...inspectionReport, actionItems: e.target.value})} style={{width: '100%', minHeight: '80px', padding: '10px', borderRadius: '6px', border: '1px solid #ddd'}} placeholder="List maintenance/repair items" /></div><div style={{marginBottom: '12px'}}><label style={{fontWeight: 'bold', display: 'block', marginBottom: '6px'}}>Inspection Frequency</label><select value={inspectionReport.inspectionFrequency} onChange={e => handleFrequencyChange(e.target.value)} style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd'}}><option value="">Select</option><option value="Semi-Annual">Semi-Annual (6 months)</option><option value="Annual">Annual (12 months)</option><option value="Bi-Annual">Bi-Annual (24 months)</option><option value="Tri-Annual">Tri-Annual (36 months)</option><option value="After Storm Events">After Storm Events</option><option value="Custom">Custom</option></select></div>{inspectionReport.inspectionFrequency && inspectionReport.inspectionFrequency !== 'After Storm Events' && (<div style={{marginBottom: '12px'}}><label style={{fontWeight: 'bold', display: 'block', marginBottom: '6px'}}>Next Inspection Date</label><input type="date" value={inspectionReport.nextInspectionDate} onChange={e => setInspectionReport({...inspectionReport, nextInspectionDate: e.target.value})} style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd'}} /></div>)}<div><label style={{fontWeight: 'bold', display: 'block', marginBottom: '6px'}}>Inspector Designation</label><select value={inspectionReport.inspectorDesignation} onChange={e => setInspectionReport({...inspectionReport, inspectorDesignation: e.target.value})} style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd'}}><option value="">Select</option><option value="RPF">RPF</option><option value="RFT">RFT</option><option value="P.Eng">P.Eng</option><option value="P.Geo">P.Geo</option><option value="Qualified Inspector">Qualified Inspector</option></select></div></div>{hasCulvertReplacements() && (<div style={{background: '#fff3e0', padding: '16px', marginBottom: '20px', borderRadius: '8px', border: '2px solid #ff9800'}}><strong>Section 11 WSA Notice:</strong> Culvert work detected. Schedule LRM notification before work.</div>)}<div style={{textAlign: 'center', marginTop: '32px'}}><button onClick={handleSave} disabled={isSaving} style={{background: '#2e7d32', color: 'white', padding: '18px 56px', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', border: 'none', cursor: isSaving ? 'not-allowed' : 'pointer', opacity: isSaving ? 0.6 : 1}}>{isSaving ? 'Saving...' : (editMode ? 'Update Assessment' : 'Save Assessment')}</button></div></div>)}</div></div>);
};

export default LMHRiskForm;
