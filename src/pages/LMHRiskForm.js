// src/pages/LMHRiskForm.js - Toggle buttons, better summary display
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
    actionItems: '',
    requiresSpecialist: false,
    specialistNotes: '',
    nextInspectionDate: '',
    inspectionFrequency: '',
    inspectorDesignation: ''
  });

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
    setSegments([...segments, {
      id: Date.now(), startKm: '', endKm: '', likelihood: '', consequence: '',
      observations: '',
      quickCapture: { lineType: '', lineRange: '', points: [] }
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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const fieldNotes = JSON.parse(localStorage.getItem('currentFieldNotes') || '{}');
      
      if (useSegments) {
        await saveAssessmentDB({
          basicInfo: roadInfo,
          riskMethod: 'LMH-Multi',
          useSegments: true,
          segments: segments,
          inspectionReport: inspectionReport,
          fieldNotes,
          summary: getSegmentStats()
        });
      } else {
        const risk = getRiskMatrix(entireRoad.likelihood, entireRoad.consequence);
        await saveAssessmentDB({
          basicInfo: roadInfo,
          riskMethod: 'LMH',
          useSegments: false,
          likelihood: entireRoad.likelihood,
          consequence: entireRoad.consequence,
          riskAssessment: { ...risk, method: 'LMH', riskLevel: risk?.level, riskClass: risk?.class },
          quickCapture: entireRoad.quickCapture,
          observations: entireRoad.observations,
          inspectionReport: inspectionReport,
          fieldNotes,
          riskScore: `${entireRoad.likelihood}/${entireRoad.consequence}`,
          riskCategory: risk?.level
        });
      }
      
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
          <button key={s.id} className={`nav-button ${activeSection === s.id ? 'active' : ''}`}
            onClick={() => setActiveSection(s.id)}>
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
              {[
                {name: 'roadName', label: 'Road Name', placeholder: 'FSR 123'},
                {name: 'startKm', label: 'Start KM', placeholder: '0'},
                {name: 'endKm', label: 'End KM', placeholder: '15'},
                {name: 'assessor', label: 'Assessor', placeholder: 'Your name'},
                {name: 'assessmentDate', label: 'Date', type: 'date'}
              ].map(f => (
                <div key={f.name} className="form-group">
                  <label>{f.label}</label>
                  <input type={f.type || 'text'} value={roadInfo[f.name]}
                    onChange={(e) => setRoadInfo({...roadInfo, [f.name]: e.target.value})}
                    placeholder={f.placeholder} />
                </div>
              ))}
              <div className="form-group">
                <label>Weather</label>
                <select value={roadInfo.weatherConditions}
                  onChange={(e) => setRoadInfo({...roadInfo, weatherConditions: e.target.value})}>
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

            {/* TOGGLE BUTTONS - Not checkbox */}
            <div style={{background: '#e3f2fd', padding: '20px', borderRadius: '8px', marginBottom: '24px', border: '2px solid #2196f3'}}>
              <div style={{fontWeight: 'bold', marginBottom: '12px', fontSize: '15px', color: '#1976d2'}}>
                Assessment Approach
              </div>
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
                  }}>
                  <div style={{fontWeight: 'bold', fontSize: '14px', marginBottom: '4px'}}>
                    🛣️ Entire Road
                  </div>
                  <div style={{fontSize: '12px', color: '#666'}}>
                    Assess full road as single unit
                  </div>
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
                  }}>
                  <div style={{fontWeight: 'bold', fontSize: '14px', marginBottom: '4px'}}>
                    📍 Risk Segments
                  </div>
                  <div style={{fontSize: '12px', color: '#666'}}>
                    Multiple segments with varying risk
                  </div>
                </button>
              </div>
            </div>

            <button onClick={() => setShowFrameworks({...showFrameworks, matrix: !showFrameworks.matrix})}
              style={{background: 'linear-gradient(135deg, #9c27b0, #ba68c8)', color: 'white', border: 'none', padding: '14px 20px', borderRadius: '8px', width: '100%', cursor: 'pointer', fontWeight: 'bold', marginBottom: '20px', display: 'flex', justifyContent: 'space-between'}}>
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

            {useSegments ? (
              <div>
                {segments.length > 0 && (
                  <div style={{background: 'linear-gradient(135deg, #e8f5e9, #f1f8e9)', padding: '16px', borderRadius: '8px', marginBottom: '20px', border: '2px solid #4caf50'}}>
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

                {segments.map((seg, idx) => (
                  <RiskSegmentCard key={seg.id} segment={seg} segmentNumber={idx + 1}
                    onUpdate={(u) => updateSegment(seg.id, u)}
                    onDelete={() => deleteSegment(seg.id)} />
                ))}

                <button onClick={addSegment} style={{background: '#4caf50', color: 'white', border: 'none', padding: '14px 24px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', width: '100%'}}>
                  + Add Risk Segment
                </button>
              </div>
            ) : (
              <div>
                <div style={{background: '#fff3e0', padding: '14px', borderRadius: '6px', marginBottom: '16px', border: '2px solid #ff9800', fontSize: '13px'}}>
                  <strong>Entire Road:</strong> Assessing KM {roadInfo.startKm || '?'} - {roadInfo.endKm || '?'} as single unit
                </div>
                <RiskSegmentCard
                  segment={{...entireRoad, startKm: roadInfo.startKm, endKm: roadInfo.endKm}}
                  segmentNumber={1}
                  onUpdate={(u) => setEntireRoad({likelihood: u.likelihood, consequence: u.consequence, observations: u.observations, quickCapture: u.quickCapture})}
                  onDelete={() => {}}
                />
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
            <div style={{background: '#fff3e0', padding: '12px', borderRadius: '6px', border: '2px solid #ff9800', fontSize: '13px', marginBottom: '16px'}}>
              <strong>Note:</strong> Use Observations in each segment for segment-specific notes. 
              Use Field Notes here for overall road-level comments.
            </div>
            <FieldNotesSection />
          </div>
        )}

        {activeSection === 'results' && (
          <div className="form-section" style={{borderTop: '4px solid #4caf50'}}>
            <h2 className="section-header" style={{color: '#4caf50', paddingLeft: '40px'}}>
              <span className="section-accent" style={{background: 'linear-gradient(to bottom, #4caf50, #81c784)'}}></span>
              Assessment Summary
            </h2>

            {/* Road Overview */}
            <div style={{background: 'linear-gradient(135deg, #ffffff, #f5f5f5)', padding: '24px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '2px solid #e0e0e0'}}>
              <div style={{display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '16px', alignItems: 'center'}}>
                <div style={{fontSize: '64px', opacity: 0.2}}>🛣️</div>
                <div>
                  <h2 style={{margin: '0 0 8px 0', color: '#2e7d32', fontSize: '24px'}}>
                    {roadInfo.roadName || 'Untitled Road'}
                  </h2>
                  <div style={{display: 'grid', gap: '6px', fontSize: '14px', color: '#555'}}>
                    <div><strong>Range:</strong> KM {roadInfo.startKm || '?'} - {roadInfo.endKm || '?'} 
                      ({roadInfo.endKm && roadInfo.startKm ? (parseFloat(roadInfo.endKm) - parseFloat(roadInfo.startKm)).toFixed(1) : '?'} km)
                    </div>
                    <div><strong>Assessor:</strong> {roadInfo.assessor || 'Not specified'}</div>
                    <div><strong>Date:</strong> {roadInfo.assessmentDate}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Summary */}
            {useSegments ? (
              <div style={{background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '2px solid #4caf50'}}>
                <h3 style={{marginTop: 0, color: '#2e7d32', fontSize: '18px'}}>📍 Risk Segment Analysis</h3>
                {segments.length === 0 ? (
                  <div style={{textAlign: 'center', padding: '40px', color: '#999'}}>
                    <div style={{fontSize: '48px', marginBottom: '12px'}}>📍</div>
                    <div>No segments added</div>
                  </div>
                ) : (
                  <div>
                    {/* Stats */}
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px'}}>
                      {(() => {
                        const stats = getSegmentStats();
                        return (
                          <>
                            <div style={{background: '#fff3e0', padding: '16px', borderRadius: '8px', textAlign: 'center'}}>
                              <div style={{fontSize: '32px', fontWeight: 'bold', color: '#f57c00'}}>{segments.length}</div>
                              <div style={{fontSize: '12px', color: '#f57c00', fontWeight: 'bold'}}>SEGMENTS</div>
                            </div>
                            <div style={{background: '#e8f5e9', padding: '16px', borderRadius: '8px', textAlign: 'center'}}>
                              <div style={{fontSize: '32px', fontWeight: 'bold', color: '#2e7d32'}}>{stats.totalKm.toFixed(1)}</div>
                              <div style={{fontSize: '12px', color: '#2e7d32', fontWeight: 'bold'}}>KM ASSESSED</div>
                            </div>
                          </>
                        );
                      })()}
                    </div>

                    {/* Progress Bars */}
                    {(() => {
                      const stats = getSegmentStats();
                      const total = stats.totalKm;
                      return total > 0 && (
                        <div style={{marginBottom: '20px'}}>
                          <div style={{fontWeight: 'bold', marginBottom: '12px', color: '#333'}}>Risk Distribution:</div>
                          {[
                            {key: 'veryHigh', label: 'Very High (Class 5)', color: '#f44336', icon: '🔴'},
                            {key: 'high', label: 'High (Class 4)', color: '#ff9800', icon: '🟠'},
                            {key: 'moderate', label: 'Moderate (Class 2-3)', color: '#ffc107', icon: '🟡'},
                            {key: 'low', label: 'Low (Class 1)', color: '#8bc34a', icon: '🟢'}
                          ].map(risk => (
                            stats[risk.key] > 0 && (
                              <div key={risk.key} style={{marginBottom: '12px'}}>
                                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px'}}>
                                  <span><strong>{risk.icon} {risk.label}</strong></span>
                                  <span style={{fontWeight: 'bold'}}>{stats[risk.key].toFixed(1)} km ({((stats[risk.key]/total)*100).toFixed(0)}%)</span>
                                </div>
                                <div style={{background: '#e0e0e0', height: '24px', borderRadius: '12px', overflow: 'hidden'}}>
                                  <div style={{background: risk.color, height: '100%', width: `${(stats[risk.key]/total)*100}%`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '11px', fontWeight: 'bold'}}>
                                    {stats[risk.key].toFixed(1)} km
                                  </div>
                                </div>
                              </div>
                            )
                          ))}
                        </div>
                      );
                    })()}

                    {/* Segment Details with observations and points */}
                    <div>
                      <div style={{fontWeight: 'bold', marginBottom: '12px', color: '#333'}}>Segment Details:</div>
                      {segments.map((seg, idx) => {
                        const risk = getRiskMatrix(seg.likelihood, seg.consequence);
                        const length = seg.endKm && seg.startKm ? (parseFloat(seg.endKm) - parseFloat(seg.startKm)).toFixed(1) : '?';
                        const hasContent = seg.observations || (seg.quickCapture?.points && seg.quickCapture.points.some(p => p.description));
                        
                        return risk && (
                          <div key={seg.id} style={{background: 'white', padding: '16px', borderRadius: '8px', marginBottom: '12px', border: `2px solid ${risk.color}`, borderLeft: `6px solid ${risk.color}`}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: hasContent ? '12px' : 0}}>
                              <div>
                                <div style={{fontWeight: 'bold', fontSize: '14px'}}>
                                  Segment {idx + 1}: KM {seg.startKm || '?'} - {seg.endKm || '?'}
                                </div>
                                <div style={{fontSize: '12px', color: '#666', marginTop: '2px'}}>
                                  {seg.likelihood} × {seg.consequence} • {length} km
                                </div>
                              </div>
                              <div style={{background: risk.color, color: 'white', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', fontSize: '13px', textAlign: 'center'}}>
                                Class {risk.class}<br/>{risk.level}
                              </div>
                            </div>
                            
                            {/* Show observations if present */}
                            {seg.observations && (
                              <div style={{marginTop: '12px', padding: '12px', background: '#f9f9f9', borderRadius: '6px', borderLeft: '3px solid #2196f3'}}>
                                <div style={{fontSize: '11px', fontWeight: 'bold', color: '#1976d2', marginBottom: '6px'}}>OBSERVATIONS</div>
                                <div style={{fontSize: '13px', color: '#555', whiteSpace: 'pre-wrap'}}>{seg.observations}</div>
                              </div>
                            )}

                            {/* Show point descriptions if present */}
                            {seg.quickCapture?.points && seg.quickCapture.points.filter(p => p.description).length > 0 && (
                              <div style={{marginTop: '12px', padding: '12px', background: '#f9f9f9', borderRadius: '6px', borderLeft: '3px solid #ff9800'}}>
                                <div style={{fontSize: '11px', fontWeight: 'bold', color: '#f57c00', marginBottom: '8px'}}>POINT NOTES</div>
                                {seg.quickCapture.points.filter(p => p.description).map((pt, ptIdx) => (
                                  <div key={ptIdx} style={{fontSize: '13px', color: '#555', marginBottom: '8px'}}>
                                    <strong>KM {pt.km}:</strong> {pt.description}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {entireRoad.likelihood && entireRoad.consequence ? (
                  <div style={{background: 'white', padding: '24px', borderRadius: '8px', marginBottom: '20px', border: '2px solid #4caf50'}}>
                    <h3 style={{marginTop: 0, color: '#2e7d32', fontSize: '18px'}}>🛣️ Entire Road Assessment</h3>
                    {(() => {
                      const risk = getRiskMatrix(entireRoad.likelihood, entireRoad.consequence);
                      const length = roadInfo.endKm && roadInfo.startKm ? (parseFloat(roadInfo.endKm) - parseFloat(roadInfo.startKm)).toFixed(1) : '?';
                      return risk && (
                        <div>
                          <div style={{background: risk.color, color: 'white', padding: '32px', borderRadius: '12px', textAlign: 'center', marginBottom: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)'}}>
                            <div style={{fontSize: '14px', opacity: 0.9, marginBottom: '8px'}}>
                              {entireRoad.likelihood} Likelihood × {entireRoad.consequence} Consequence
                            </div>
                            <div style={{fontSize: '48px', fontWeight: 'bold', marginBottom: '8px'}}>Class {risk.class}</div>
                            <div style={{fontSize: '24px', fontWeight: 'bold'}}>{risk.level} Risk</div>
                          </div>
                          
                          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '20px'}}>
                            <div style={{background: '#e3f2fd', padding: '16px', borderRadius: '8px', textAlign: 'center'}}>
                              <div style={{fontSize: '11px', color: '#666', marginBottom: '4px'}}>LENGTH</div>
                              <div style={{fontSize: '24px', fontWeight: 'bold', color: '#1976d2'}}>{length} km</div>
                            </div>
                            <div style={{background: '#f3e5f5', padding: '16px', borderRadius: '8px', textAlign: 'center'}}>
                              <div style={{fontSize: '11px', color: '#666', marginBottom: '4px'}}>RISK CLASS</div>
                              <div style={{fontSize: '24px', fontWeight: 'bold', color: '#9c27b0'}}>{risk.class}</div>
                            </div>
                          </div>

                          {/* Show observations if present */}
                          {entireRoad.observations && (
                            <div style={{padding: '12px', background: '#f9f9f9', borderRadius: '6px', borderLeft: '3px solid #2196f3', marginBottom: '12px'}}>
                              <div style={{fontSize: '11px', fontWeight: 'bold', color: '#1976d2', marginBottom: '6px'}}>OBSERVATIONS</div>
                              <div style={{fontSize: '13px', color: '#555', whiteSpace: 'pre-wrap'}}>{entireRoad.observations}</div>
                            </div>
                          )}

                          {/* Show point descriptions if present */}
                          {entireRoad.quickCapture?.points && entireRoad.quickCapture.points.filter(p => p.description).length > 0 && (
                            <div style={{padding: '12px', background: '#f9f9f9', borderRadius: '6px', borderLeft: '3px solid #ff9800'}}>
                              <div style={{fontSize: '11px', fontWeight: 'bold', color: '#f57c00', marginBottom: '8px'}}>POINT NOTES</div>
                              {entireRoad.quickCapture.points.filter(p => p.description).map((pt, ptIdx) => (
                                <div key={ptIdx} style={{fontSize: '13px', color: '#555', marginBottom: '8px'}}>
                                  <strong>KM {pt.km}:</strong> {pt.description}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <div style={{textAlign: 'center', padding: '60px 20px', background: '#f9f9f9', borderRadius: '8px'}}>
                    <div style={{fontSize: '64px', marginBottom: '16px', opacity: 0.3'}}>⚖️</div>
                    <h3 style={{color: '#999'}}>Assessment Incomplete</h3>
                  </div>
                )}
              </div>
            )}

            {/* Field Notes Summary (only if filled out) */}
            {(() => {
              const fieldNotes = JSON.parse(localStorage.getItem('currentFieldNotes') || '{}');
              const hasNotes = fieldNotes.hazardObservations || fieldNotes.consequenceObservations || 
                              fieldNotes.generalComments || fieldNotes.recommendations;
              
              return hasNotes && (
                <div style={{background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '2px solid #2e7d32'}}>
                  <h3 style={{marginTop: 0, color: '#2e7d32', fontSize: '16px'}}>📝 Field Notes</h3>
                  {fieldNotes.hazardObservations && (
                    <div style={{marginBottom: '12px'}}>
                      <div style={{fontSize: '12px', fontWeight: 'bold', color: '#666', marginBottom: '4px'}}>Hazard Observations:</div>
                      <div style={{fontSize: '13px', color: '#555', whiteSpace: 'pre-wrap'}}>{fieldNotes.hazardObservations}</div>
                    </div>
                  )}
                  {fieldNotes.consequenceObservations && (
                    <div style={{marginBottom: '12px'}}>
                      <div style={{fontSize: '12px', fontWeight: 'bold', color: '#666', marginBottom: '4px'}}>Consequence Observations:</div>
                      <div style={{fontSize: '13px', color: '#555', whiteSpace: 'pre-wrap'}}>{fieldNotes.consequenceObservations}</div>
                    </div>
                  )}
                  {fieldNotes.generalComments && (
                    <div style={{marginBottom: '12px'}}>
                      <div style={{fontSize: '12px', fontWeight: 'bold', color: '#666', marginBottom: '4px'}}>General Comments:</div>
                      <div style={{fontSize: '13px', color: '#555', whiteSpace: 'pre-wrap'}}>{fieldNotes.generalComments}</div>
                    </div>
                  )}
                  {fieldNotes.recommendations && (
                    <div>
                      <div style={{fontSize: '12px', fontWeight: 'bold', color: '#666', marginBottom: '4px'}}>Recommendations:</div>
                      <div style={{fontSize: '13px', color: '#555', whiteSpace: 'pre-wrap'}}>{fieldNotes.recommendations}</div>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* INSPECTION REPORT FIELDS */}
            <div style={{background: '#e3f2fd', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '2px solid #1976d2'}}>
              <h3 style={{color: '#1976d2', marginTop: 0, fontSize: '16px'}}>
                📋 Inspection Report (EGBC/FPBC 3.7.2)
              </h3>

              <div className="form-group" style={{marginBottom: '16px'}}>
                <label style={{fontWeight: 'bold', color: '#333', marginBottom: '6px', display: 'block'}}>
                  🔧 Priority Actions
                </label>
                <div style={{fontSize: '12px', color: '#666', marginBottom: '8px', fontStyle: 'italic'}}>
                  List maintenance/repair with priority. Example: "Clean culvert KM 5.4 - High (Safety)"
                </div>
                <textarea
                  value={inspectionReport.actionItems}
                  onChange={(e) => setInspectionReport({...inspectionReport, actionItems: e.target.value})}
                  placeholder="• Clean culvert at KM 5.4 - High priority (Safety)&#10;• Repair fill slope erosion KM 7.2 - High priority (Environmental)&#10;• Grade road surface - Medium priority (Maintenance)"
                  style={{width: '100%', minHeight: '100px', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px', fontFamily: 'monospace'}}
                />
              </div>

              <div style={{marginBottom: '16px'}}>
                <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '10px'}}>
                  <input type="checkbox" checked={inspectionReport.requiresSpecialist}
                    onChange={(e) => setInspectionReport({...inspectionReport, requiresSpecialist: e.target.checked})}
                    style={{width: '16px', height: '16px'}} />
                  <span style={{fontWeight: 'bold', color: '#333'}}>🎓 Requires Specialist</span>
                </label>
                {inspectionReport.requiresSpecialist && (
                  <textarea
                    value={inspectionReport.specialistNotes}
                    onChange={(e) => setInspectionReport({...inspectionReport, specialistNotes: e.target.value})}
                    placeholder="Specify specialist type and reason. Example: 'P.Eng required for retaining wall assessment'"
                    style={{width: '100%', minHeight: '60px', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px'}}
                  />
                )}
              </div>

              <div style={{background: 'white', padding: '16px', borderRadius: '8px', border: '2px solid #ff9800', marginBottom: '16px'}}>
                <div style={{fontWeight: 'bold', color: '#f57c00', marginBottom: '12px', fontSize: '14px'}}>
                  📅 Next Inspection Schedule
                </div>
                {(() => {
                  const rec = getRecommendedFrequency();
                  return rec.frequency && (
                    <div style={{background: '#fff3e0', padding: '10px', borderRadius: '4px', marginBottom: '12px', fontSize: '13px'}}>
                      <strong>Recommended:</strong> {rec.frequency} ({rec.months}) - {rec.reason}
                    </div>
                  );
                })()}
                <div className="form-group">
                  <label>Inspection Frequency</label>
                  <select value={inspectionReport.inspectionFrequency}
                    onChange={(e) => setInspectionReport({...inspectionReport, inspectionFrequency: e.target.value})}
                    style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd'}}>
                    <option value="">Select</option>
                    <option value="Semi-Annual">Semi-Annual (6 months) - Very High Risk</option>
                    <option value="Annual">Annual (12 months) - High Risk</option>
                    <option value="Bi-Annual">Bi-Annual (24 months) - Moderate Risk</option>
                    <option value="Tri-Annual">Tri-Annual (36 months) - Low Risk</option>
                    <option value="After Storm Events">After Storm Events Only</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
                <div className="form-group" style={{marginTop: '12px'}}>
                  <label>Next Inspection Date</label>
                  <input type="date" value={inspectionReport.nextInspectionDate}
                    onChange={(e) => setInspectionReport({...inspectionReport, nextInspectionDate: e.target.value})}
                    style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd'}} />
                </div>
              </div>

              <div style={{background: 'white', padding: '16px', borderRadius: '8px', border: '2px solid #2e7d32'}}>
                <div style={{fontWeight: 'bold', color: '#2e7d32', marginBottom: '12px', fontSize: '14px'}}>
                  ✍️ Inspector Certification
                </div>
                <div className="form-group">
                  <label>Professional Designation</label>
                  <select value={inspectionReport.inspectorDesignation}
                    onChange={(e) => setInspectionReport({...inspectionReport, inspectorDesignation: e.target.value})}
                    style={{width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd'}}>
                    <option value="">Select</option>
                    <option value="RPF">RPF - Registered Professional Forester</option>
                    <option value="RFT">RFT - Registered Forest Technologist</option>
                    <option value="P.Eng">P.Eng - Professional Engineer</option>
                    <option value="P.Geo">P.Geo - Professional Geoscientist</option>
                    <option value="Qualified Inspector">Qualified Inspector (under POR supervision)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div style={{fontSize: '12px', color: '#666', marginTop: '8px', fontStyle: 'italic'}}>
                  Inspector: {roadInfo.assessor || 'Not specified'} • Date: {roadInfo.assessmentDate}
                </div>
              </div>
            </div>

            <div style={{textAlign: 'center', marginTop: '32px'}}>
              <button onClick={handleSave} disabled={isSaving} style={{background: 'linear-gradient(135deg, #2e7d32, #66bb6a)', color: 'white', border: 'none', padding: '18px 56px', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: isSaving ? 'not-allowed' : 'pointer', opacity: isSaving ? 0.5 : 1, boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)'}}>
                {isSaving ? '💾 Saving...' : '💾 Save Assessment'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LMHRiskForm;
