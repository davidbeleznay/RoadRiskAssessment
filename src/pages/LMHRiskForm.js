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
  const [activeSection, setActiveSection] = useState('basic');
  const [isSaving, setIsSaving] = useState(false);
  const [useSegments, setUseSegments] = useState(false);
  const [showFrameworks, setShowFrameworks] = useState({ likelihood: false, consequence: false, matrix: false });

  const [roadInfo, setRoadInfo] = useState({
    roadName: '', startKm: '', endKm: '',
    assessmentDate: new Date().toISOString().split('T')[0],
    assessor: '', weatherConditions: ''
  });

  const [entireRoad, setEntireRoad] = useState({
    likelihood: '', consequence: '', observations: '',
    quickCapture: { lineType: '', points: [] }
  });

  const [segments, setSegments] = useState([]);

  const [inspectionReport, setInspectionReport] = useState({
    actionItems: '', requiresSpecialist: false, specialistNotes: '',
    nextInspectionDate: '', inspectionFrequency: '', inspectorDesignation: ''
  });

  const handleFrequencyChange = (frequency) => {
    setInspectionReport({...inspectionReport, inspectionFrequency: frequency});
    if (frequency === 'After Storm Events') {
      setInspectionReport({...inspectionReport, inspectionFrequency: frequency, nextInspectionDate: ''});
      return;
    }
    if (frequency !== 'Custom' && frequency !== '') {
      const baseDate = roadInfo.assessmentDate ? new Date(roadInfo.assessmentDate) : new Date();
      let months = 0;
      switch(frequency) {
        case 'Semi-Annual': months = 6; break;
        case 'Annual': months = 12; break;
        case 'Bi-Annual': months = 24; break;
        case 'Tri-Annual': months = 36; break;
        default: return;
      }
      const nextDate = new Date(baseDate);
      nextDate.setMonth(nextDate.getMonth() + months);
      setInspectionReport({...inspectionReport, inspectionFrequency: frequency, nextInspectionDate: nextDate.toISOString().split('T')[0]});
    }
  };

  const getRiskMatrix = (l, c) => {
    const matrix = {
      'High-High': { class: 5, level: 'Very High', color: '#f44336' }, 'High-Moderate': { class: 4, level: 'High', color: '#ff9800' }, 'High-Low': { class: 3, level: 'Moderate', color: '#ffc107' }, 'High-Very Low': { class: 1, level: 'Low', color: '#8bc34a' },
      'Moderate-High': { class: 4, level: 'High', color: '#ff9800' }, 'Moderate-Moderate': { class: 3, level: 'Moderate', color: '#ffc107' }, 'Moderate-Low': { class: 2, level: 'Moderate', color: '#ffc107' }, 'Moderate-Very Low': { class: 1, level: 'Low', color: '#8bc34a' },
      'Low-High': { class: 3, level: 'Moderate', color: '#ffc107' }, 'Low-Moderate': { class: 2, level: 'Moderate', color: '#ffc107' }, 'Low-Low': { class: 2, level: 'Moderate', color: '#ffc107' }, 'Low-Very Low': { class: 1, level: 'Low', color: '#8bc34a' },
      'Very Low-High': { class: 1, level: 'Low', color: '#8bc34a' }, 'Very Low-Moderate': { class: 1, level: 'Low', color: '#8bc34a' }, 'Very Low-Low': { class: 1, level: 'Low', color: '#8bc34a' }, 'Very Low-Very Low': { class: 1, level: 'Low', color: '#8bc34a' }
    };
    return matrix[`${l}-${c}`] || null;
  };

  const getRecommendedFrequency = () => {
    if (useSegments) {
      const stats = getSegmentStats();
      if (stats.veryHigh > 0) return { frequency: 'Semi-Annual', months: '6 months', reason: 'Very High risk segments present' };
      if (stats.high > 0) return { frequency: 'Annual', months: '12 months', reason: 'High risk segments present' };
      if (stats.moderate > 0) return { frequency: 'Bi-Annual', months: '24 months', reason: 'Moderate risk segments' };
      return { frequency: 'Tri-Annual', months: '36 months', reason: 'Low risk road' };
    } else {
      const risk = getRiskMatrix(entireRoad.likelihood, entireRoad.consequence);
      if (!risk) return { frequency: '', months: '', reason: '' };
      if (risk.class === 5) return { frequency: 'Semi-Annual', months: '6 months', reason: 'Very High risk' };
      if (risk.class === 4) return { frequency: 'Annual', months: '12 months', reason: 'High risk' };
      if (risk.class === 3 || risk.class === 2) return { frequency: 'Bi-Annual', months: '24 months', reason: 'Moderate risk' };
      return { frequency: 'Tri-Annual', months: '36 months', reason: 'Low risk' };
    }
  };

  const hasCulvertReplacements = () => {
    const actionText = inspectionReport.actionItems.toLowerCase();
    const hasInActions = actionText.includes('replace culvert') || actionText.includes('install culvert') || actionText.includes('remove culvert');
    if (useSegments) { return hasInActions || segments.some(seg => seg.quickCapture?.points?.some(pt => pt.featureType?.toLowerCase().includes('install culvert') || pt.featureType?.toLowerCase().includes('remove culvert'))); }
    return hasInActions || entireRoad.quickCapture?.points?.some(pt => pt.featureType?.toLowerCase().includes('install culvert') || pt.featureType?.toLowerCase().includes('remove culvert'));
  };

  const getSegmentStats = () => {
    const stats = { veryHigh: 0, high: 0, moderate: 0, low: 0, totalKm: 0 };
    segments.forEach(seg => {
      if (seg.likelihood && seg.consequence && seg.startKm && seg.endKm) {
        const risk = getRiskMatrix(seg.likelihood, seg.consequence);
        if (risk) {
          const length = parseFloat(seg.endKm) - parseFloat(seg.startKm);
          stats.totalKm += length;
          if (risk.class === 5) stats.veryHigh += length; else if (risk.class === 4) stats.high += length; else if (risk.class === 3 || risk.class === 2) stats.moderate += length; else stats.low += length;
        }
      }
    });
    return stats;
  };

  const addSegment = () => { setSegments([...segments, { id: Date.now(), startKm: '', endKm: '', likelihood: '', consequence: '', observations: '', quickCapture: { lineType: '', lineRange: '', points: [] } }]); };
  const updateSegment = (id, updated) => { setSegments(segments.map(s => s.id === id ? updated : s)); };
  const deleteSegment = (id) => { if (window.confirm('Delete this segment?')) { setSegments(segments.filter(s => s.id !== id)); } };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const fieldNotes = JSON.parse(localStorage.getItem('currentFieldNotes') || '{}');
      const assessmentData = { basicInfo: roadInfo, riskMethod: useSegments ? 'LMH-Multi' : 'LMH', useSegments, inspectionReport, fieldNotes };
      if (useSegments) { assessmentData.segments = segments; assessmentData.summary = getSegmentStats(); }
      else {
        const risk = getRiskMatrix(entireRoad.likelihood, entireRoad.consequence);
        assessmentData.likelihood = entireRoad.likelihood; assessmentData.consequence = entireRoad.consequence;
        assessmentData.riskAssessment = { ...risk, method: 'LMH', riskLevel: risk?.level, riskClass: risk?.class };
        assessmentData.quickCapture = entireRoad.quickCapture; assessmentData.observations = entireRoad.observations;
        assessmentData.riskScore = `${entireRoad.likelihood}/${entireRoad.consequence}`; assessmentData.riskCategory = risk?.level;
      }
      await saveAssessmentDB(assessmentData, null);
      alert('Assessment saved!'); setTimeout(() => navigate('/history'), 1000);
    } catch (error) { alert('Error: ' + error.message); }
    finally { setIsSaving(false); }
  };

  const sections = [{ id: 'basic', title: 'Road Info', icon: '📝' }, { id: 'assessment', title: 'Assessment', icon: '⚖️' }, { id: 'notes', title: 'Notes', icon: '📋' }, { id: 'results', title: 'Summary', icon: '📊' }];

  return (
    <div className="road-risk-form" style={{minHeight: '100vh', background: '#f5f5f5', display: 'block', visibility: 'visible', opacity: 1}}>
      <div className="form-header" style={{background: 'white', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}}>
        <h1 style={{margin: '0 0 8px 0', color: '#2e7d32'}}>⚖️ LMH Risk Assessment</h1>
        <p style={{margin: 0, color: '#666'}}>Assess entire road or identify risk segments</p>
        <button onClick={() => navigate('/')} className="back-button" style={{marginTop: '12px', padding: '8px 16px', background: '#666', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>← Back</button>
      </div>

      <div className="section-navigation" style={{display: 'flex', justifyContent: 'center', gap: '8px', padding: '20px', background: 'white', position: 'sticky', top: 0, zIndex: 100}}>
        {sections.map(s => (
          <button key={s.id} className={`nav-button ${activeSection === s.id ? 'active' : ''}`} onClick={() => setActiveSection(s.id)} style={{padding: '12px 16px', border: 'none', background: activeSection === s.id ? '#2196f3' : '#f5f5f5', color: activeSection === s.id ? 'white' : '#666', borderRadius: '8px', cursor: 'pointer', minWidth: '100px'}}>
            <span>{s.icon}</span> <span>{s.title}</span>
          </button>
        ))}
      </div>

      <div className="form-content" style={{padding: '20px', maxWidth: '1200px', margin: '0 auto', display: 'block', visibility: 'visible'}}>
        {activeSection === 'basic' && (<div className="form-section" style={{background: 'white', padding: '32px', borderRadius: '8px', marginBottom: '20px'}}><h2>Road Information</h2><div className="form-grid" style={{display: 'grid', gap: '20px', marginTop: '20px'}}>{[{name: 'roadName', label: 'Road Name', placeholder: 'FSR 123'}, {name: 'startKm', label: 'Start KM'}, {name: 'endKm', label: 'End KM'}, {name: 'assessor', label: 'Assessor'}, {name: 'assessmentDate', label: 'Date', type: 'date'}].map(f => (<div key={f.name}><label style={{display: 'block', marginBottom: '4px', fontWeight: 'bold'}}>{f.label}</label><input type={f.type || 'text'} value={roadInfo[f.name]} onChange={(e) => setRoadInfo({...roadInfo, [f.name]: e.target.value})} placeholder={f.placeholder} style={{width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px'}} /></div>))}<div><label style={{display: 'block', marginBottom: '4px', fontWeight: 'bold'}}>Weather</label><select value={roadInfo.weatherConditions} onChange={(e) => setRoadInfo({...roadInfo, weatherConditions: e.target.value})} style={{width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px'}}><option value="">Select</option>{['Dry', 'Recent Rain', 'Wet', 'Snow'].map(w => <option key={w}>{w}</option>)}</select></div></div></div>)}
        {activeSection === 'assessment' && (<div className="form-section" style={{background: 'white', padding: '32px', borderRadius: '8px'}}><h2>Assessment</h2><div>Work in progress - basic and results sections available</div></div>)}
        {activeSection === 'notes' && (<div className="form-section" style={{background: 'white', padding: '32px', borderRadius: '8px'}}><h2>Field Notes</h2><FieldNotesSection /></div>)}
        {activeSection === 'results' && (<div className="form-section" style={{background: 'white', padding: '32px', borderRadius: '8px', textAlign: 'center'}}><h2>Summary</h2><button onClick={handleSave} disabled={isSaving} style={{background: '#2e7d32', color: 'white', padding: '16px 32px', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: isSaving ? 'not-allowed' : 'pointer', opacity: isSaving ? 0.5 : 1, marginTop: '20px'}}>{isSaving ? 'Saving...' : 'Save Assessment'}</button></div>)}
      </div>
    </div>
  );
};

export default LMHRiskForm;
