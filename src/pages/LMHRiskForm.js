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
    if (useSegments) {
      const hasInSegments = segments.some(seg => seg.quickCapture?.points?.some(pt => pt.featureType?.toLowerCase().includes('install culvert') || pt.featureType?.toLowerCase().includes('remove culvert')));
      return hasInActions || hasInSegments;
    } else {
      const hasInPoints = entireRoad.quickCapture?.points?.some(pt => pt.featureType?.toLowerCase().includes('install culvert') || pt.featureType?.toLowerCase().includes('remove culvert'));
      return hasInActions || hasInPoints;
    }
  };

  const getSegmentStats = () => {
    const stats = { veryHigh: 0, high: 0, moderate: 0, low: 0, totalKm: 0 };
    segments.forEach(seg => {
      if (seg.likelihood && seg.consequence && seg.startKm && seg.endKm) {
        const risk = getRiskMatrix(seg.likelihood, seg.consequence);
        if (risk) {
          const length = parseFloat(seg.endKm) - parseFloat(seg.startKm);
          stats.totalKm += length;
          if (risk.class === 5) stats.veryHigh += length;
          else if (risk.class === 4) stats.high += length;
          else if (risk.class === 3 || risk.class === 2) stats.moderate += length;
          else stats.low += length;
        }
      }
    });
    return stats;
  };

  const addSegment = () => {
    setSegments([...segments, { id: Date.now(), startKm: '', endKm: '', likelihood: '', consequence: '', observations: '', quickCapture: { lineType: '', lineRange: '', points: [] } }]);
  };

  const updateSegment = (id, updated) => {
    setSegments(segments.map(s => s.id === id ? updated : s));
  };

  const deleteSegment = (id) => {
    if (window.confirm('Delete this segment?')) {
      setSegments(segments.filter(s => s.id !== id));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const fieldNotes = JSON.parse(localStorage.getItem('currentFieldNotes') || '{}');
      const assessmentData = { basicInfo: roadInfo, riskMethod: useSegments ? 'LMH-Multi' : 'LMH', useSegments: useSegments, inspectionReport: inspectionReport, fieldNotes };
      if (useSegments) {
        assessmentData.segments = segments;
        assessmentData.summary = getSegmentStats();
      } else {
        const risk = getRiskMatrix(entireRoad.likelihood, entireRoad.consequence);
        assessmentData.likelihood = entireRoad.likelihood;
        assessmentData.consequence = entireRoad.consequence;
        assessmentData.riskAssessment = { ...risk, method: 'LMH', riskLevel: risk?.level, riskClass: risk?.class };
        assessmentData.quickCapture = entireRoad.quickCapture;
        assessmentData.observations = entireRoad.observations;
        assessmentData.riskScore = `${entireRoad.likelihood}/${entireRoad.consequence}`;
        assessmentData.riskCategory = risk?.level;
      }
      await saveAssessmentDB(assessmentData, null);
      alert('Assessment saved!');
      setTimeout(() => navigate('/history'), 1000);
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const sections = [
    { id: 'basic', title: 'Road Info', icon: '📝' },
    { id: 'assessment', title: 'Assessment', icon: '⚖️' },
    { id: 'notes', title: 'Notes', icon: '📋' },
    { id: 'results', title: 'Summary', icon: '📊' }
  ];

  return (
    <div className="road-risk-form">
      <div className="form-header">
        <h1>⚖️ LMH Risk Assessment</h1>
        <p>Assess entire road or identify risk segments</p>
        <button onClick={() => navigate('/')} className="back-button">← Back</button>
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
          <div className="form-section" style={{borderTop: '4px solid #2196f3'}}>
            <h2 className="section-header" style={{color: '#2196f3', paddingLeft: '40px'}}>
              <span className="section-accent" style={{background: 'linear-gradient(to bottom, #2196f3, #64b5f6)'}}></span>
              Road Information
            </h2>
            <div className="form-grid">
              {[{name: 'roadName', label: 'Road Name', placeholder: 'FSR 123'}, {name: 'startKm', label: 'Start KM', placeholder: '0'}, {name: 'endKm', label: 'End KM', placeholder: '15'}, {name: 'assessor', label: 'Assessor', placeholder: 'Your name'}, {name: 'assessmentDate', label: 'Date', type: 'date'}].map(f => (
                <div key={f.name} className="form-group">
                  <label>{f.label}</label>
                  <input type={f.type || 'text'} value={roadInfo[f.name]} onChange={(e) => setRoadInfo({...roadInfo, [f.name]: e.target.value})} placeholder={f.placeholder} />
                </div>
              ))}
              <div className="form-group">
                <label>Weather</label>
                <select value={roadInfo.weatherConditions} onChange={(e) => setRoadInfo({...roadInfo, weatherConditions: e.target.value})}>
                  <option value="">Select</option>
                  {['Dry', 'Recent Rain', 'Wet', 'Snow'].map(w => <option key={w}>{w}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'assessment' && (
          <div className="form-section" style={{borderTop: '4px solid #1976d2'}}>
            <h2 className="section-header" style={{color: '#1976d2', paddingLeft: '40px'}}>
              <span className="section-accent" style={{background: 'linear-gradient(to bottom, #1976d2, #42a5f5)'}}></span>
              LMH Risk Assessment
            </h2>
            <div style={{background: '#e3f2fd', padding: '20px', borderRadius: '8px', marginBottom: '24px', border: '2px solid #2196f3'}}>
              <div style={{fontWeight: 'bold', marginBottom: '12px', fontSize: '15px', color: '#1976d2'}}>Assessment Approach</div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                <button onClick={() => setUseSegments(false)} style={{background: !useSegments ? 'white' : '#f5f5f5', border: !useSegments ? '3px solid #2196f3' : '1px solid #ddd', padding: '16px', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'}}>
                  <div style={{fontWeight: 'bold', fontSize: '14px', marginBottom: '4px'}}>🛣️ Entire Road</div>
                  <div style={{fontSize: '12px', color: '#666'}}>Assess full road as single unit</div>
                </button>
                <button onClick={() => setUseSegments(true)} style={{background: useSegments ? 'white' : '#f5f5f5', border: useSegments ? '3px solid #4caf50' : '1px solid #ddd', padding: '16px', borderRadius: '8px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'}}>
                  <div style={{fontWeight: 'bold', fontSize: '14px', marginBottom: '4px'}}>📍 Risk Segments</div>
                  <div style={{fontSize: '12px', color: '#666'}}>Multiple segments with varying risk</div>
                </button>
              </div>
            </div>
            <button onClick={() => setShowFrameworks({...showFrameworks, matrix: !showFrameworks.matrix})} style={{background: 'linear-gradient(135deg, #9c27b0, #ba68c8)', color: 'white', border: 'none', padding: '14px 20px', borderRadius: '8px', width: '100%', cursor: 'pointer', fontWeight: 'bold', marginBottom: '20px', display: 'flex', justifyContent: 'space-between'}}>
              <span>📊 LMH Risk Matrix (Table 4a)</span>
              <span>{showFrameworks.matrix ? '▼' : '▶'}</span>
            </button>
            {showFrameworks.matrix && <LMHRiskMatrix />}
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px'}}>
              <button onClick={() => setShowFrameworks({...showFrameworks, likelihood: !showFrameworks.likelihood})} style={{background: '#2196f3', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'}}>📊 Likelihood {showFrameworks.likelihood ? '▼' : '▶'}</button>
              <button onClick={() => setShowFrameworks({...showFrameworks, consequence: !showFrameworks.consequence})} style={{background: '#ff9800', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'}}>🌊 Consequence {showFrameworks.consequence ? '▼' : '▶'}</button>
            </div>
            {showFrameworks.likelihood && <LikelihoodGuidance />}
            {showFrameworks.consequence && <ConsequenceGuidance />}
            {useSegments ? (
              <div>
                {segments.length > 0 && (
                  <div style={{background: 'linear-gradient(135deg, #e8f5e9, #f1f8e9)', padding: '16px', borderRadius: '8px', marginBottom: '20px', border: '2px solid #4caf50'}}>
                    <div style={{fontWeight: 'bold', marginBottom: '10px'}}>Segment Summary</div>
                    {(() => { const stats = getSegmentStats(); return (<div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px', fontSize: '13px'}}>{stats.veryHigh > 0 && <div>🔴 Very High: {stats.veryHigh.toFixed(1)} km</div>}{stats.high > 0 && <div>🟠 High: {stats.high.toFixed(1)} km</div>}{stats.moderate > 0 && <div>🟡 Moderate: {stats.moderate.toFixed(1)} km</div>}{stats.low > 0 && <div>🟢 Low: {stats.low.toFixed(1)} km</div>}<div><strong>Total: {stats.totalKm.toFixed(1)} km</strong></div></div>); })()}
                  </div>
                )}
                {segments.map((seg, idx) => (<RiskSegmentCard key={seg.id} segment={seg} segmentNumber={idx + 1} onUpdate={(u) => updateSegment(seg.id, u)} onDelete={() => deleteSegment(seg.id)} />))}
                <button onClick={addSegment} style={{background: '#4caf50', color: 'white', border: 'none', padding: '14px 24px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', width: '100%'}}>+ Add Risk Segment</button>
              </div>
            ) : (
              <div>
                <div style={{background: '#fff3e0', padding: '14px', borderRadius: '6px', marginBottom: '16px', border: '2px solid #ff9800', fontSize: '13px'}}><strong>Entire Road:</strong> Assessing KM {roadInfo.startKm || '?'} - {roadInfo.endKm || '?'} as single unit</div>
                <RiskSegmentCard segment={{...entireRoad, startKm: roadInfo.startKm, endKm: roadInfo.endKm}} segmentNumber={1} onUpdate={(u) => setEntireRoad({likelihood: u.likelihood, consequence: u.consequence, observations: u.observations, quickCapture: u.quickCapture})} onDelete={null} />
              </div>
            )}
          </div>
        )}

        {activeSection === 'notes' && (
          <div className="form-section" style={{borderTop: '4px solid #2e7d32'}}>
            <h2 className="section-header" style={{color: '#2e7d32', paddingLeft: '40px'}}>
              <span className="section-accent" style={{background: 'linear-gradient(to bottom, #2e7d32, #66bb6a)'}}></span>
              Field Notes
            </h2>
            <FieldNotesSection />
          </div>
        )}

        {activeSection === 'results' && (
          <div className="form-section" style={{borderTop: '4px solid #4caf50'}}>
            <h2 className="section-header" style={{color: '#4caf50', paddingLeft: '40px'}}>
              <span className="section-accent" style={{background: 'linear-gradient(to bottom, #4caf50, #81c784)'}}></span>
              Assessment Summary
            </h2>
            <div style={{textAlign: 'center', marginTop: '32px'}}>
              <button onClick={handleSave} disabled={isSaving} style={{background: 'linear-gradient(135deg, #2e7d32, #66bb6a)', color: 'white', border: 'none', padding: '18px 56px', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: isSaving ? 'not-allowed' : 'pointer', opacity: isSaving ? 0.5 : 1, boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)'}}>{isSaving ? '💾 Saving...' : '💾 Save Assessment'}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LMHRiskForm;
