// src/pages/LMHRiskForm.js - With integrated frameworks
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveAssessmentDB } from '../utils/db';
import FieldNotesSection from '../components/FieldNotesSection';
import LikelihoodGuidance from '../components/LikelihoodGuidance';
import ConsequenceGuidance from '../components/ConsequenceGuidance';
import '../styles/enhanced-form.css';

const LMHRiskForm = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('basic');
  const [isSaving, setIsSaving] = useState(false);
  const [showOverride, setShowOverride] = useState(false);
  const [showFrameworks, setShowFrameworks] = useState({ likelihood: false, consequence: false });
  const [overrideData, setOverrideData] = useState({ enabled: false, finalRisk: '', professionalName: '', designation: '', justification: '' });
  const [basicInfo, setBasicInfo] = useState({ assessmentDate: new Date().toISOString().split('T')[0], roadName: '', assessor: '', startKm: '', endKm: '', weatherConditions: '', notes: '' });
  const [likelihood, setLikelihood] = useState(null);
  const [consequence, setConsequence] = useState(null);
  const [riskResult, setRiskResult] = useState(null);

  const calculateLMHRisk = (l, c) => {
    if (!l || !c) return null;
    const matrix = {
      'Low-Low': { level: 'Low', color: '#4caf50', priority: 'Routine monitoring' },
      'Low-Moderate': { level: 'Low', color: '#8bc34a', priority: 'Regular inspection' },
      'Low-High': { level: 'Moderate', color: '#ffc107', priority: 'Increased monitoring' },
      'Moderate-Low': { level: 'Low', color: '#8bc34a', priority: 'Regular inspection' },
      'Moderate-Moderate': { level: 'Moderate', color: '#ffc107', priority: 'Active management' },
      'Moderate-High': { level: 'High', color: '#ff9800', priority: 'Priority action required' },
      'High-Low': { level: 'Moderate', color: '#ffc107', priority: 'Increased monitoring' },
      'High-Moderate': { level: 'High', color: '#ff9800', priority: 'Priority action required' },
      'High-High': { level: 'Very High', color: '#f44336', priority: 'Immediate action required' }
    };
    return matrix[`${l}-${c}`];
  };

  const handleLikelihoodChange = (v) => { setLikelihood(v); setRiskResult(calculateLMHRisk(v, consequence)); };
  const handleConsequenceChange = (v) => { setConsequence(v); setRiskResult(calculateLMHRisk(likelihood, v)); };
  const handleBasicInfoChange = (e) => { setBasicInfo(p => ({ ...p, [e.target.name]: e.target.value })); };
  const handleOverrideChange = (f, v) => { setOverrideData(p => ({ ...p, [f]: v })); };
  const toggleFramework = (k) => { setShowFrameworks(p => ({ ...p, [k]: !p[k] })); };

  const getFinalRisk = () => {
    if (overrideData.enabled && overrideData.finalRisk) {
      const colors = { 'Very High': '#f44336', 'High': '#ff9800', 'Moderate': '#ffc107', 'Low': '#4caf50', 'Very Low': '#2196f3' };
      return { ...riskResult, level: overrideData.finalRisk, color: colors[overrideData.finalRisk], isOverridden: true };
    }
    return riskResult;
  };

  const handleSave = async () => {
    if (overrideData.enabled && (!overrideData.professionalName || !overrideData.designation || !overrideData.justification)) {
      alert('Professional override requires: Name, Designation, and Justification'); return;
    }
    setIsSaving(true);
    try {
      const fieldNotes = JSON.parse(localStorage.getItem('currentFieldNotes') || '{}');
      const finalRisk = getFinalRisk();
      await saveAssessmentDB({
        basicInfo, riskMethod: 'LMH', likelihood, consequence,
        riskAssessment: { ...finalRisk, method: 'LMH', riskLevel: finalRisk?.level, calculatedRisk: riskResult?.level,
          professionalOverride: overrideData.enabled ? { ...overrideData, originalRisk: riskResult?.level, overriddenRisk: overrideData.finalRisk, date: new Date().toISOString() } : null
        },
        fieldNotes, riskScore: `${likelihood}/${consequence}`, riskCategory: finalRisk?.level
      });
      alert('Assessment saved!'); setTimeout(() => navigate('/history'), 1000);
    } catch (error) {
      alert('Error: ' + error.message);
    } finally { setIsSaving(false); }
  };

  const sections = [
    { id: 'basic', title: 'Basic Information', icon: '📝' },
    { id: 'assessment', title: 'LMH Assessment', icon: '⚖️' },
    { id: 'notes', title: 'Field Notes', icon: '📋' },
    { id: 'results', title: 'Results', icon: '📈' }
  ];

  return (
    <div className="road-risk-form">
      <div className="form-header">
        <h1>⚖️ LMH Risk Assessment</h1>
        <p>Scientific methodology with probability & sediment delivery frameworks</p>
        <button onClick={() => navigate('/')} className="back-button">← Back</button>
      </div>

      <div className="section-navigation">
        {sections.map(s => (
          <button key={s.id} className={`nav-button ${activeSection === s.id ? 'active' : ''}`} onClick={() => setActiveSection(s.id)}>
            <span className="nav-icon">{s.icon}</span><span className="nav-title">{s.title}</span>
          </button>
        ))}
      </div>

      <div className="form-content">
        {activeSection === 'basic' && (
          <div className="form-section" style={{borderTop: '4px solid #2196f3'}}>
            <h2 className="section-header" style={{color: '#2196f3', paddingLeft: '40px'}}>
              <span className="section-accent" style={{background: 'linear-gradient(to bottom, #2196f3, #64b5f6)'}}></span>
              Basic Information
            </h2>
            <div className="form-grid">
              {[
                {name: 'assessmentDate', label: 'Date', type: 'date'},
                {name: 'roadName', label: 'Road Name', type: 'text', placeholder: 'FSR 123'},
                {name: 'assessor', label: 'Assessor', type: 'text'},
                {name: 'startKm', label: 'Start KM', type: 'text'},
                {name: 'endKm', label: 'End KM', type: 'text'}
              ].map(f => (
                <div key={f.name} className="form-group">
                  <label>{f.label}</label>
                  <input type={f.type} name={f.name} value={basicInfo[f.name]} onChange={handleBasicInfoChange} placeholder={f.placeholder} required={f.name === 'assessmentDate'} />
                </div>
              ))}
              <div className="form-group">
                <label>Weather</label>
                <select name="weatherConditions" value={basicInfo.weatherConditions} onChange={handleBasicInfoChange}>
                  <option value="">Select</option>
                  {['Dry', 'Recent Rain', 'Wet', 'Snow'].map(w => <option key={w} value={w.toLowerCase().replace(' ', '-')}>{w}</option>)}
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

            <div className="factor-group">
              <h3>1. Likelihood of Failure</h3>
              <p style={{marginBottom: '16px'}}>Probability of failure within 20-year period</p>

              <button onClick={() => toggleFramework('likelihood')} style={{background: 'linear-gradient(135deg, #1976d2, #42a5f5)', color: 'white', border: 'none', padding: '18px 24px', borderRadius: '8px', width: '100%', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'}}>
                <span>📊 UNDERSTANDING LIKELIHOOD - 20-Year Probability Framework</span>
                <span style={{fontSize: '24px'}}>{showFrameworks.likelihood ? '▼' : '▶'}</span>
              </button>
              {showFrameworks.likelihood && <LikelihoodGuidance />}

              <div className="rating-options" style={{marginTop: '20px'}}>
                {[
                  {value: 'Low', label: 'Low Likelihood', description: 'Remote - <20% over 20 years (stable <45%, good drainage)'},
                  {value: 'Moderate', label: 'Moderate Likelihood', description: 'Possible - 20-50% over 20 years (slopes 45-60%)'},
                  {value: 'High', label: 'High Likelihood', description: 'Probable - 50-100% over 20 years (steep >60%, poor drainage)'}
                ].map(o => (
                  <label key={o.value} className="rating-option">
                    <input type="radio" name="likelihood" value={o.value} checked={likelihood === o.value} onChange={(e) => handleLikelihoodChange(e.target.value)} />
                    <div className={`option-content score-${o.value.toLowerCase()}`}>
                      <div className="option-header"><span className="option-label">{o.label}</span></div>
                      <span className="option-description">{o.description}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="factor-group" style={{marginTop: '40px'}}>
              <h3>2. Consequence of Failure</h3>
              <p style={{marginBottom: '16px'}}>Magnitude and duration of harm</p>

              <button onClick={() => toggleFramework('consequence')} style={{background: 'linear-gradient(135deg, #f57c00, #ff9800)', color: 'white', border: 'none', padding: '18px 24px', borderRadius: '8px', width: '100%', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 12px rgba(245, 124, 0, 0.3)'}}>
                <span>🌊 UNDERSTANDING CONSEQUENCE - Sediment Delivery & Impact</span>
                <span style={{fontSize: '24px'}}>{showFrameworks.consequence ? '▼' : '▶'}</span>
              </button>
              {showFrameworks.consequence && <ConsequenceGuidance />}

              <div className="rating-options" style={{marginTop: '20px'}}>
                {[
                  {value: 'Low', label: 'Low Consequence', description: 'Contained (>100m, >200m runout, no critical values)'},
                  {value: 'Moderate', label: 'Moderate Consequence', description: 'Some delivery (30-100m, 75-100m runout, fines may reach fish)'},
                  {value: 'High', label: 'High Consequence', description: 'Direct impact (<30m fish stream, <75m runout, critical values)'}
                ].map(o => (
                  <label key={o.value} className="rating-option">
                    <input type="radio" name="consequence" value={o.value} checked={consequence === o.value} onChange={(e) => handleConsequenceChange(e.target.value)} />
                    <div className={`option-content score-${o.value.toLowerCase()}`}>
                      <div className="option-header"><span className="option-label">{o.label}</span></div>
                      <span className="option-description">{o.description}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'notes' && (
          <div className="form-section" style={{borderTop: '4px solid #2e7d32'}}>
            <h2 className="section-header" style={{color: '#2e7d32', paddingLeft: '40px'}}>
              <span className="section-accent" style={{background: 'linear-gradient(to bottom, #2e7d32, #66bb6a)'}}></span>
              Field Notes
            </h2>
            <div style={{background: '#fff3e0', padding: '14px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px', border: '2px solid #ff9800'}}>
              <strong>Tip:</strong> Record observations, use <strong>QuickCapture</strong> for GPS/photos
            </div>
            <FieldNotesSection />
          </div>
        )}

        {activeSection === 'results' && (
          <div className="form-section" style={{borderTop: '4px solid #4caf50'}}>
            <h2 className="section-header" style={{color: '#4caf50', paddingLeft: '40px'}}>
              <span className="section-accent" style={{background: 'linear-gradient(to bottom, #4caf50, #81c784)'}}></span>
              Results
            </h2>
            {riskResult ? (
              <div>
                <div style={{marginBottom: '20px'}}>
                  <p><strong>20-year probability × Sediment delivery = Risk</strong></p>
                </div>
                <div style={{display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr', gap: '20px', alignItems: 'center', margin: '30px 0'}}>
                  <div style={{background: '#e3f2fd', padding: '20px', borderRadius: '8px', textAlign: 'center'}}>
                    <div style={{fontSize: '14px', marginBottom: '8px'}}>Likelihood</div>
                    <div style={{fontSize: '32px', fontWeight: 'bold', color: '#1976d2'}}>{likelihood}</div>
                  </div>
                  <div style={{fontSize: '32px'}}>×</div>
                  <div style={{background: '#fff3e0', padding: '20px', borderRadius: '8px', textAlign: 'center'}}>
                    <div style={{fontSize: '14px', marginBottom: '8px'}}>Consequence</div>
                    <div style={{fontSize: '32px', fontWeight: 'bold', color: '#f57c00'}}>{consequence}</div>
                  </div>
                  <div style={{fontSize: '32px'}}>=</div>
                  <div style={{background: getFinalRisk()?.color, color: 'white', padding: '30px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.2)'}}>
                    <div style={{fontSize: '14px', opacity: 0.9, marginBottom: '8px'}}>Risk</div>
                    <div style={{fontSize: '36px', fontWeight: 'bold'}}>{getFinalRisk()?.level}</div>
                    {overrideData.enabled && <div style={{fontSize: '11px', marginTop: '6px'}}>(Override)</div>}
                  </div>
                </div>

                <button onClick={() => setShowOverride(!showOverride)} style={{background: overrideData.enabled ? '#ff9800' : '#f5f5f5', color: overrideData.enabled ? 'white' : '#666', border: '2px solid ' + (overrideData.enabled ? '#f57c00' : '#ddd'), padding: '12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', width: '100%', marginBottom: '20px'}}>
                  {overrideData.enabled ? '⚠️ Override Active' : '🔧 Professional Override'}
                </button>

                {showOverride && (
                  <div style={{background: '#fff3e0', padding: '20px', borderRadius: '8px', border: '2px solid #ff9800', marginBottom: '20px'}}>
                    <label style={{display: 'flex', gap: '8px', marginBottom: '16px'}}>
                      <input type="checkbox" checked={overrideData.enabled} onChange={(e) => handleOverrideChange('enabled', e.target.checked)} />
                      <span style={{fontWeight: 'bold'}}>Enable Override</span>
                    </label>
                    {overrideData.enabled && (
                      <div style={{display: 'grid', gap: '12px'}}>
                        <select value={overrideData.finalRisk} onChange={(e) => handleOverrideChange('finalRisk', e.target.value)} style={{padding: '8px', borderRadius: '4px', border: '1px solid #ddd'}}>
                          <option value="">Select...</option>
                          {['Very High', 'High', 'Moderate', 'Low', 'Very Low'].map(r => <option key={r}>{r}</option>)}
                        </select>
                        <input type="text" placeholder="Name" value={overrideData.professionalName} onChange={(e) => handleOverrideChange('professionalName', e.target.value)} style={{padding: '8px', borderRadius: '4px', border: '1px solid #ddd'}} />
                        <input type="text" placeholder="Designation" value={overrideData.designation} onChange={(e) => handleOverrideChange('designation', e.target.value)} style={{padding: '8px', borderRadius: '4px', border: '1px solid #ddd'}} />
                        <textarea placeholder="Justification..." value={overrideData.justification} onChange={(e) => handleOverrideChange('justification', e.target.value)} rows={4} style={{padding: '10px', borderRadius: '4px', border: '1px solid #ddd'}} />
                      </div>
                    )}
                  </div>
                )}

                <div style={{textAlign: 'center', marginTop: '30px'}}>
                  <button onClick={handleSave} disabled={isSaving} style={{background: 'linear-gradient(135deg, #2e7d32, #66bb6a)', color: 'white', border: 'none', padding: '16px 48px', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', cursor: isSaving ? 'not-allowed' : 'pointer', opacity: isSaving ? 0.6 : 1}}>
                    {isSaving ? 'Saving...' : 'Save Assessment'}
                  </button>
                  <div style={{marginTop: '12px', fontSize: '13px', color: '#666'}}>Export PDF or supplement with QuickCapture</div>
                </div>
              </div>
            ) : (
              <div style={{padding: '40px', textAlign: 'center', background: '#f9f9f9', borderRadius: '8px'}}>
                <h3>Incomplete</h3>
                <p>Complete both ratings</p>
                <div>{likelihood ? '✅' : '⏹️'} Likelihood</div>
                <div>{consequence ? '✅' : '⏹️'} Consequence</div>
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
            <div style={{background: '#fff3e0', padding: '14px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px', border: '2px solid #ff9800'}}>
              <strong>Tip:</strong> Record observations, use <strong>QuickCapture</strong> for GPS/photos
            </div>
            <FieldNotesSection />
          </div>
        )}
      </div>
    </div>
  );
};

export default LMHRiskForm;
