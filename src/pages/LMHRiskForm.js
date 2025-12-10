// src/pages/LMHRiskForm.js
// Simplified Land Management Hazard (LMH) Risk Assessment Form

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveAssessment } from '../utils/assessmentStorage';
import PhotoCapture from '../components/PhotoCapture';
import FieldNotesSection from '../components/FieldNotesSection';
import '../styles/enhanced-form.css';

const LMHRiskForm = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('basic');
  const [isSaving, setIsSaving] = useState(false);

  // Basic Information
  const [basicInfo, setBasicInfo] = useState({
    assessmentDate: new Date().toISOString().split('T')[0],
    roadName: '',
    assessor: '',
    startKm: '',
    endKm: '',
    weatherConditions: '',
    notes: ''
  });

  // LMH Simple Ratings
  const [likelihood, setLikelihood] = useState(null);
  const [consequence, setConsequence] = useState(null);
  const [riskResult, setRiskResult] = useState(null);

  // Calculate risk based on LMH matrix
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

  const handleLikelihoodChange = (value) => {
    setLikelihood(value);
    const result = calculateLMHRisk(value, consequence);
    setRiskResult(result);
  };

  const handleConsequenceChange = (value) => {
    setConsequence(value);
    const result = calculateLMHRisk(likelihood, value);
    setRiskResult(result);
  };

  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsSaving(true);

    try {
      const savedNotes = localStorage.getItem('currentFieldNotes');
      const fieldNotes = savedNotes ? JSON.parse(savedNotes) : {};
      
      const savedPhotos = localStorage.getItem('currentPhotos');
      const photos = savedPhotos ? JSON.parse(savedPhotos) : [];

      const assessmentData = {
        basicInfo,
        riskMethod: 'LMH',
        likelihood,
        consequence,
        riskAssessment: {
          ...riskResult,
          method: 'LMH',
          riskLevel: riskResult?.level
        },
        fieldNotes,
        photos,
        riskScore: `${likelihood}/${consequence}`,
        riskCategory: riskResult?.level
      };

      const result = saveAssessment(assessmentData);

      if (result.success) {
        alert('✅ LMH Assessment saved!');
        localStorage.removeItem('currentFieldNotes');
        localStorage.removeItem('currentPhotos');
        setTimeout(() => navigate('/history'), 1000);
      } else {
        alert('❌ Save failed: ' + result.error);
      }
    } catch (error) {
      alert('❌ Error: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const sections = [
    { id: 'basic', title: 'Basic Information', icon: '📝' },
    { id: 'assessment', title: 'LMH Assessment', icon: '⚖️' },
    { id: 'notes', title: 'Field Notes & Photos', icon: '📋' },
    { id: 'results', title: 'Results', icon: '📈' }
  ];

  return (
    <div className="road-risk-form">
      <div className="form-header">
        <h1>⚖️ LMH Risk Assessment</h1>
        <p>Simplified Land Management Hazard methodology</p>
        <button onClick={() => navigate('/')} className="back-button">
          ← Back to Home
        </button>
      </div>

      <div className="section-navigation">
        {sections.map((section) => (
          <button
            key={section.id}
            className={`nav-button ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => setActiveSection(section.id)}
          >
            <span className="nav-icon">{section.icon}</span>
            <span className="nav-title">{section.title}</span>
          </button>
        ))}
      </div>

      <div className="form-content">
        {/* Basic Information */}
        {activeSection === 'basic' && (
          <div className="form-section" style={{ borderTop: '4px solid #2196f3' }}>
            <h2 className="section-header" style={{ color: '#2196f3' }}>
              <span className="section-accent" style={{ background: 'linear-gradient(to bottom, #2196f3, #64b5f6)' }}></span>
              Basic Information
            </h2>
            
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="assessmentDate">Assessment Date</label>
                <input type="date" id="assessmentDate" name="assessmentDate" value={basicInfo.assessmentDate} onChange={handleBasicInfoChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="roadName">Road Name/ID</label>
                <input type="text" id="roadName" name="roadName" value={basicInfo.roadName} onChange={handleBasicInfoChange} placeholder="e.g., Forest Service Road 123" />
              </div>
              <div className="form-group">
                <label htmlFor="assessor">Assessor Name</label>
                <input type="text" id="assessor" name="assessor" value={basicInfo.assessor} onChange={handleBasicInfoChange} placeholder="Your name" />
              </div>
              <div className="form-group">
                <label htmlFor="startKm">Start Kilometer</label>
                <input type="text" id="startKm" name="startKm" value={basicInfo.startKm} onChange={handleBasicInfoChange} placeholder="e.g., 5.2 km" />
              </div>
              <div className="form-group">
                <label htmlFor="endKm">End Kilometer</label>
                <input type="text" id="endKm" name="endKm" value={basicInfo.endKm} onChange={handleBasicInfoChange} placeholder="e.g., 7.8 km" />
              </div>
              <div className="form-group">
                <label htmlFor="weatherConditions">Weather Conditions</label>
                <select id="weatherConditions" name="weatherConditions" value={basicInfo.weatherConditions} onChange={handleBasicInfoChange}>
                  <option value="">Select conditions</option>
                  <option value="dry">Dry</option>
                  <option value="recent-rain">Recent Rain</option>
                  <option value="wet">Wet</option>
                  <option value="snow">Snow</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* LMH Assessment */}
        {activeSection === 'assessment' && (
          <div className="form-section" style={{ borderTop: '4px solid #9c27b0' }}>
            <h2 className="section-header" style={{ color: '#9c27b0' }}>
              <span className="section-accent" style={{ background: 'linear-gradient(to bottom, #9c27b0, #ba68c8)' }}></span>
              LMH Risk Assessment
            </h2>
            <p className="scoring-explanation">
              Simplified assessment using Likelihood and Consequence ratings
            </p>

            <div className="factor-group">
              <h3>1. Likelihood of Failure</h3>
              <p>Assess the probability that a failure or adverse event could occur</p>
              <div className="rating-options">
                {[
                  { value: 'Low', label: 'Low Likelihood', description: 'Stable conditions, good drainage, no history of failures' },
                  { value: 'Moderate', label: 'Moderate Likelihood', description: 'Some stability concerns, moderate drainage issues, minor historical problems' },
                  { value: 'High', label: 'High Likelihood', description: 'Unstable terrain, poor drainage, history of failures' }
                ].map((option) => (
                  <label key={option.value} className="rating-option">
                    <input
                      type="radio"
                      name="likelihood"
                      value={option.value}
                      checked={likelihood === option.value}
                      onChange={(e) => handleLikelihoodChange(e.target.value)}
                    />
                    <div className={`option-content score-${option.value.toLowerCase()}`}>
                      <div className="option-header">
                        <span className="option-label">{option.label}</span>
                      </div>
                      <span className="option-description">{option.description}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="factor-group">
              <h3>2. Consequence of Failure</h3>
              <p>Assess the potential impact if a failure were to occur</p>
              <div className="rating-options">
                {[
                  { value: 'Low', label: 'Low Consequence', description: 'No water resources nearby, minimal road use, no significant values' },
                  { value: 'Moderate', label: 'Moderate Consequence', description: 'Non-fish streams nearby, moderate road use, some environmental values' },
                  { value: 'High', label: 'High Consequence', description: 'Fish streams, high road use, critical habitat or cultural areas' }
                ].map((option) => (
                  <label key={option.value} className="rating-option">
                    <input
                      type="radio"
                      name="consequence"
                      value={option.value}
                      checked={consequence === option.value}
                      onChange={(e) => handleConsequenceChange(e.target.value)}
                    />
                    <div className={`option-content score-${option.value.toLowerCase()}`}>
                      <div className="option-header">
                        <span className="option-label">{option.label}</span>
                      </div>
                      <span className="option-description">{option.description}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Field Notes & Photos */}
        {activeSection === 'notes' && (
          <div className="form-section" style={{ borderTop: '4px solid #2e7d32' }}>
            <h2 className="section-header" style={{ color: '#2e7d32' }}>
              <span className="section-accent" style={{ background: 'linear-gradient(to bottom, #2e7d32, #66bb6a)' }}></span>
              Field Notes & Photos
            </h2>
            <FieldNotesSection onSave={(notes) => console.log('Notes saved')} />
            <PhotoCapture onPhotoSaved={(photos) => console.log('Photos saved:', photos.length)} />
          </div>
        )}

        {/* Results */}
        {activeSection === 'results' && (
          <div className="form-section" style={{ borderTop: '4px solid #4caf50' }}>
            <h2 className="section-header" style={{ color: '#4caf50' }}>
              <span className="section-accent" style={{ background: 'linear-gradient(to bottom, #4caf50, #81c784)' }}></span>
              LMH Risk Results
            </h2>

            {riskResult ? (
              <div className="risk-results-container">
                <div className="methodology-display">
                  <h3>📋 LMH Methodology</h3>
                  <p><strong>Simplified Land Management Hazard Assessment</strong></p>
                  <p>Risk determined by Likelihood × Consequence matrix</p>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto 1fr auto 1fr',
                  gap: '20px',
                  alignItems: 'center',
                  margin: '30px 0'
                }}>
                  <div style={{
                    background: '#e3f2fd',
                    padding: '20px',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Likelihood</div>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1976d2' }}>
                      {likelihood}
                    </div>
                  </div>

                  <div style={{ fontSize: '32px', color: '#666' }}>×</div>

                  <div style={{
                    background: '#fff3e0',
                    padding: '20px',
                    borderRadius: '8px',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Consequence</div>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f57c00' }}>
                      {consequence}
                    </div>
                  </div>

                  <div style={{ fontSize: '32px', color: '#666' }}>=</div>

                  <div style={{
                    background: riskResult.color,
                    color: 'white',
                    padding: '30px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                  }}>
                    <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>Risk Level</div>
                    <div style={{ fontSize: '36px', fontWeight: 'bold' }}>
                      {riskResult.level}
                    </div>
                  </div>
                </div>

                <div style={{
                  background: '#f5f5f5',
                  padding: '20px',
                  borderRadius: '8px',
                  marginBottom: '20px'
                }}>
                  <h4 style={{ marginTop: 0, color: '#333' }}>📋 Recommended Action:</h4>
                  <p style={{ margin: 0, fontSize: '16px' }}>{riskResult.priority}</p>
                </div>

                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    style={{
                      background: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '16px 48px',
                      borderRadius: '8px',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      cursor: isSaving ? 'not-allowed' : 'pointer',
                      opacity: isSaving ? 0.6 : 1,
                      boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)'
                    }}
                  >
                    {isSaving ? '💾 Saving...' : '💾 Save LMH Assessment'}
                  </button>
                </div>

              </div>
            ) : (
              <div style={{
                padding: '40px',
                textAlign: 'center',
                background: '#f9f9f9',
                borderRadius: '8px'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
                <h3>Assessment Incomplete</h3>
                <p>Complete both <strong>Likelihood</strong> and <strong>Consequence</strong> ratings to see your risk result.</p>
                <div style={{ marginTop: '20px' }}>
                  <div style={{ marginBottom: '8px' }}>
                    {likelihood ? '✅' : '⏹️'} Likelihood: {likelihood || 'Not selected'}
                  </div>
                  <div>
                    {consequence ? '✅' : '⏹️'} Consequence: {consequence || 'Not selected'}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LMHRiskForm;
