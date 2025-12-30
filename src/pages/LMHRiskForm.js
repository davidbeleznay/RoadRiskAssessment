// src/pages/LMHRiskForm.js
// LMH Risk Assessment with detailed field indicators

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveAssessmentDB } from '../utils/db';
import FieldNotesSection from '../components/FieldNotesSection';
import '../styles/enhanced-form.css';

const LMHRiskForm = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('basic');
  const [isSaving, setIsSaving] = useState(false);
  const [showGuidance, setShowGuidance] = useState({
    terrain: false,
    soils: false,
    drainage: false,
    water: false,
    infrastructure: false
  });

  const [basicInfo, setBasicInfo] = useState({
    assessmentDate: new Date().toISOString().split('T')[0],
    roadName: '',
    assessor: '',
    startKm: '',
    endKm: '',
    weatherConditions: '',
    notes: ''
  });

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

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const savedNotes = localStorage.getItem('currentFieldNotes');
      const fieldNotes = savedNotes ? JSON.parse(savedNotes) : {};
      
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
        riskScore: `${likelihood}/${consequence}`,
        riskCategory: riskResult?.level
      };

      console.log('Saving assessment...');
      const result = await saveAssessmentDB(assessmentData);

      if (result.success) {
        alert('✅ Assessment saved!');
        setTimeout(() => navigate('/history'), 1000);
      } else {
        alert('❌ Save failed: ' + result.error);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('❌ Error: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleGuidance = (key) => {
    setShowGuidance(prev => ({ ...prev, [key]: !prev[key] }));
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
        <p>Land Management Hazard methodology with detailed field guidance</p>
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
        {activeSection === 'basic' && (
          <div className="form-section" style={{ borderTop: '4px solid #2196f3' }}>
            <h2 className="section-header" style={{ color: '#2196f3', paddingLeft: '40px' }}>
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

        {activeSection === 'assessment' && (
          <div className="form-section" style={{ borderTop: '4px solid #1976d2' }}>
            <h2 className="section-header" style={{ color: '#1976d2', paddingLeft: '40px' }}>
              <span className="section-accent" style={{ background: 'linear-gradient(to bottom, #1976d2, #42a5f5)' }}></span>
              LMH Risk Assessment
            </h2>
            <p className="scoring-explanation">
              Qualitative assessment based on observable field conditions
            </p>

            <div className="factor-group">
              <h3>1. Likelihood of Failure</h3>
              <p style={{marginBottom: '16px', color: '#555'}}>
                How likely is this road section to fail (slide, erode, washout)?
              </p>

              {/* Terrain Guidance */}
              <div style={{marginBottom: '16px'}}>
                <button
                  onClick={() => toggleGuidance('terrain')}
                  style={{
                    background: '#e3f2fd',
                    border: '2px solid #2196f3',
                    padding: '12px',
                    borderRadius: '6px',
                    width: '100%',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    color: '#1976d2',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>🏔️ Terrain Stability - What to Look For</span>
                  <span>{showGuidance.terrain ? '▼' : '▶'}</span>
                </button>
                
                {showGuidance.terrain && (
                  <div style={{
                    background: '#f5f5f5',
                    padding: '16px',
                    borderRadius: '0 0 6px 6px',
                    borderLeft: '3px solid #2196f3',
                    fontSize: '13px',
                    lineHeight: '1.6'
                  }}>
                    <div style={{marginBottom: '12px'}}>
                      <strong style={{color: '#4caf50'}}>✅ Stable Terrain Signs:</strong>
                      <ul style={{marginTop: '6px', paddingLeft: '20px'}}>
                        <li>Slopes less than 40%</li>
                        <li>No recent slides or slumps visible</li>
                        <li>Solid bedrock exposure</li>
                        <li>Dense, established vegetation</li>
                        <li>No tension cracks in road surface or cutbanks</li>
                        <li>Old, weathered cutbanks (stable over time)</li>
                      </ul>
                    </div>
                    
                    <div style={{marginBottom: '12px'}}>
                      <strong style={{color: '#ff9800'}}>⚠️ Unstable Terrain Signs:</strong>
                      <ul style={{marginTop: '6px', paddingLeft: '20px'}}>
                        <li>Slopes greater than 60%</li>
                        <li>Recent slide scars or debris</li>
                        <li>Tension cracks parallel to road</li>
                        <li>Leaning trees ("pistol-butted" trees)</li>
                        <li>Fresh slumping in cutbanks</li>
                        <li>Hummocky terrain (old slide deposits)</li>
                        <li>Springs or seeps on slope</li>
                        <li>Road surface showing settlement or bulging</li>
                      </ul>
                    </div>

                    <div>
                      <strong style={{color: '#2196f3'}}>📏 Slope Estimation:</strong>
                      <ul style={{marginTop: '6px', paddingLeft: '20px'}}>
                        <li>40% = 22° angle (moderate slope)</li>
                        <li>60% = 31° angle (steep slope)</li>
                        <li>100% = 45° angle (very steep)</li>
                        <li>Use clinometer or smartphone inclinometer app</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Soils Guidance */}
              <div style={{marginBottom: '16px'}}>
                <button
                  onClick={() => toggleGuidance('soils')}
                  style={{
                    background: '#e3f2fd',
                    border: '2px solid #2196f3',
                    padding: '12px',
                    borderRadius: '6px',
                    width: '100%',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    color: '#1976d2',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>🪨 Soil Types - Field Identification</span>
                  <span>{showGuidance.soils ? '▼' : '▶'}</span>
                </button>
                
                {showGuidance.soils && (
                  <div style={{
                    background: '#f5f5f5',
                    padding: '16px',
                    borderRadius: '0 0 6px 6px',
                    borderLeft: '3px solid #2196f3',
                    fontSize: '13px',
                    lineHeight: '1.6'
                  }}>
                    <div style={{marginBottom: '12px'}}>
                      <strong style={{color: '#4caf50'}}>✅ Cohesive Soils (Low Risk):</strong>
                      <ul style={{marginTop: '6px', paddingLeft: '20px'}}>
                        <li><strong>Clay:</strong> Sticky when wet, holds shape, smooth texture</li>
                        <li><strong>Clay-Loam:</strong> Moldable, holds together in hand</li>
                        <li><strong>Compacted Till:</strong> Dense, hard to dig, mixed particle sizes</li>
                        <li><strong>Test:</strong> Can form a ball that holds shape</li>
                        <li><strong>Cutbanks:</strong> Stand vertically without sloughing</li>
                      </ul>
                    </div>
                    
                    <div style={{marginBottom: '12px'}}>
                      <strong style={{color: '#ff9800'}}>⚠️ Erodible Soils (High Risk):</strong>
                      <ul style={{marginTop: '6px', paddingLeft: '20px'}}>
                        <li><strong>Silt:</strong> Smooth/floury texture, easily eroded by water</li>
                        <li><strong>Fine Sand:</strong> Feels gritty, won't hold shape</li>
                        <li><strong>Loose Fill:</strong> Unconsolidated material, easily disturbed</li>
                        <li><strong>Decomposed Granite:</strong> Crumbly, granular texture</li>
                        <li><strong>Test:</strong> Falls apart immediately when squeezed</li>
                        <li><strong>Cutbanks:</strong> Slough readily, rill erosion visible</li>
                      </ul>
                    </div>

                    <div>
                      <strong style={{color: '#2196f3'}}>🔍 Quick Field Test:</strong>
                      <ul style={{marginTop: '6px', paddingLeft: '20px'}}>
                        <li>Grab handful of soil, squeeze into ball</li>
                        <li>Cohesive: Ball holds shape when opened hand</li>
                        <li>Erodible: Falls apart immediately</li>
                        <li>Check cutbank: Does it stand or slough?</li>
                        <li>Look for rills and gullies (erosion indicators)</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Drainage Guidance */}
              <div style={{marginBottom: '16px'}}>
                <button
                  onClick={() => toggleGuidance('drainage')}
                  style={{
                    background: '#e3f2fd',
                    border: '2px solid #2196f3',
                    padding: '12px',
                    borderRadius: '6px',
                    width: '100%',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    color: '#1976d2',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>💧 Drainage Assessment Guide</span>
                  <span>{showGuidance.drainage ? '▼' : '▶'}</span>
                </button>
                
                {showGuidance.drainage && (
                  <div style={{
                    background: '#f5f5f5',
                    padding: '16px',
                    borderRadius: '0 0 6px 6px',
                    borderLeft: '3px solid #2196f3',
                    fontSize: '13px',
                    lineHeight: '1.6'
                  }}>
                    <div style={{marginBottom: '12px'}}>
                      <strong style={{color: '#4caf50'}}>✅ Good Drainage:</strong>
                      <ul style={{marginTop: '6px', paddingLeft: '20px'}}>
                        <li>Ditches clear, free-flowing, proper grade</li>
                        <li>Culverts clear, adequate capacity, no plugging</li>
                        <li>Water bars functional, draining to stable areas</li>
                        <li>No ponding on road surface</li>
                        <li>Outslope functioning properly</li>
                        <li>Cross-drains spaced appropriately for gradient</li>
                      </ul>
                    </div>
                    
                    <div style={{marginBottom: '12px'}}>
                      <strong style={{color: '#ff9800'}}>⚠️ Poor Drainage:</strong>
                      <ul style={{marginTop: '6px', paddingLeft: '20px'}}>
                        <li>Ditches full of debris, overgrown, silted in</li>
                        <li>Culverts plugged, undersized, or rusted out</li>
                        <li>Water bars breached, eroded, or absent</li>
                        <li>Standing water on road surface</li>
                        <li>Water flowing down road (not off to sides)</li>
                        <li>Erosion gullies developing in road surface</li>
                        <li>Saturated fillslope or cutbank</li>
                      </ul>
                    </div>

                    <div>
                      <strong style={{color: '#f44336'}}>🚨 Critical Drainage Issues:</strong>
                      <ul style={{marginTop: '6px', paddingLeft: '20px'}}>
                        <li>Water undermining road structure</li>
                        <li>Culvert outlet causing fillslope erosion</li>
                        <li>Springs emerging in cutbank or road surface</li>
                        <li>Perched water table above road</li>
                        <li>Concentrated flow patterns developing</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <div className="rating-options">
                {[
                  { value: 'Low', label: 'Low Likelihood', description: 'Stable terrain (<40% slope), good drainage, cohesive soils, no failure history' },
                  { value: 'Moderate', label: 'Moderate Likelihood', description: 'Moderate slopes (40-60%), some drainage issues, moderately stable soils, minor historical issues' },
                  { value: 'High', label: 'High Likelihood', description: 'Steep/unstable terrain (>60%), poor drainage, erodible soils, history of failures' }
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

            <div className="factor-group" style={{marginTop: '32px'}}>
              <h3>2. Consequence of Failure</h3>
              <p style={{marginBottom: '16px', color: '#555'}}>
                What would happen if this road section failed?
              </p>

              {/* Water Resources Guidance */}
              <div style={{marginBottom: '16px'}}>
                <button
                  onClick={() => toggleGuidance('water')}
                  style={{
                    background: '#fff3e0',
                    border: '2px solid #ff9800',
                    padding: '12px',
                    borderRadius: '6px',
                    width: '100%',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    color: '#f57c00',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>🐟 Water Resources Assessment</span>
                  <span>{showGuidance.water ? '▼' : '▶'}</span>
                </button>
                
                {showGuidance.water && (
                  <div style={{
                    background: '#f5f5f5',
                    padding: '16px',
                    borderRadius: '0 0 6px 6px',
                    borderLeft: '3px solid #ff9800',
                    fontSize: '13px',
                    lineHeight: '1.6'
                  }}>
                    <div style={{marginBottom: '12px'}}>
                      <strong style={{color: '#4caf50'}}>✅ Low Consequence (&gt;100m from water):</strong>
                      <ul style={{marginTop: '6px', paddingLeft: '20px'}}>
                        <li>No streams, wetlands, or lakes nearby</li>
                        <li>If failure occurred, sediment would not reach water</li>
                        <li>Adequate vegetated buffer between road and any water</li>
                        <li>Topography prevents sediment delivery</li>
                      </ul>
                    </div>
                    
                    <div style={{marginBottom: '12px'}}>
                      <strong style={{color: '#ff9800'}}>⚠️ Moderate Consequence (30-100m from water):</strong>
                      <ul style={{marginTop: '6px', paddingLeft: '20px'}}>
                        <li>Non-fish bearing stream nearby</li>
                        <li>Seasonal drainage channel present</li>
                        <li>Wetland within sediment delivery distance</li>
                        <li>Some vegetated buffer but failure could deliver sediment</li>
                      </ul>
                    </div>

                    <div>
                      <strong style={{color: '#f44336'}}>🚨 High Consequence (&lt;30m from fish-bearing water):</strong>
                      <ul style={{marginTop: '6px', paddingLeft: '20px'}}>
                        <li>Fish-bearing stream within 30m</li>
                        <li>Road crosses stream (culvert present)</li>
                        <li>Direct sediment delivery pathway visible</li>
                        <li>Spawning habitat present downstream</li>
                        <li>Community water source</li>
                        <li>Known critical habitat area</li>
                      </ul>
                    </div>

                    <div style={{marginTop: '12px', padding: '10px', background: '#e3f2fd', borderRadius: '4px'}}>
                      <strong style={{color: '#1976d2'}}>💡 How to Assess:</strong>
                      <ul style={{marginTop: '6px', paddingLeft: '20px'}}>
                        <li>Use map to identify streams (blue lines)</li>
                        <li>Measure distance from road to water</li>
                        <li>Look for fish presence (check fisheries maps)</li>
                        <li>Trace potential sediment flow path</li>
                        <li>Consider gradient toward water body</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Infrastructure Guidance */}
              <div style={{marginBottom: '16px'}}>
                <button
                  onClick={() => toggleGuidance('infrastructure')}
                  style={{
                    background: '#fff3e0',
                    border: '2px solid #ff9800',
                    padding: '12px',
                    borderRadius: '6px',
                    width: '100%',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    color: '#f57c00',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>🏗️ Infrastructure Capacity Guide</span>
                  <span>{showGuidance.infrastructure ? '▼' : '▶'}</span>
                </button>
                
                {showGuidance.infrastructure && (
                  <div style={{
                    background: '#f5f5f5',
                    padding: '16px',
                    borderRadius: '0 0 6px 6px',
                    borderLeft: '3px solid #ff9800',
                    fontSize: '13px',
                    lineHeight: '1.6'
                  }}>
                    <div style={{marginBottom: '12px'}}>
                      <strong style={{color: '#4caf50'}}>✅ Adequate Infrastructure:</strong>
                      <ul style={{marginTop: '6px', paddingLeft: '20px'}}>
                        <li>Culvert size matches watershed area</li>
                        <li>Recent installation/maintenance records</li>
                        <li>No signs of overtopping during storms</li>
                        <li>Inlet/outlet in good condition</li>
                        <li>Proper gradient (min 2% slope)</li>
                        <li>Headwalls and wingwalls intact</li>
                      </ul>
                    </div>
                    
                    <div style={{marginBottom: '12px'}}>
                      <strong style={{color: '#ff9800'}}>⚠️ Moderate Concerns:</strong>
                      <ul style={{marginTop: '6px', paddingLeft: '20px'}}>
                        <li>Culvert at or near capacity for design storm</li>
                        <li>Minor debris accumulation</li>
                        <li>Some rust but structurally sound</li>
                        <li>Watershed showing some development/harvesting</li>
                        <li>Age: 15-25 years old</li>
                      </ul>
                    </div>

                    <div>
                      <strong style={{color: '#f44336'}}>🚨 Undersized/Failing Infrastructure:</strong>
                      <ul style={{marginTop: '6px', paddingLeft: '20px'}}>
                        <li>Evidence of overtopping (debris on road)</li>
                        <li>Culvert clearly too small for watershed</li>
                        <li>Heavy rust, holes, structural failure</li>
                        <li>Significant debris plugging</li>
                        <li>Beaver activity creating backwater</li>
                        <li>Inlet/outlet erosion undermining road</li>
                        <li>Age: &gt;30 years without assessment</li>
                      </ul>
                    </div>

                    <div style={{marginTop: '12px', padding: '10px', background: '#fff3e0', borderRadius: '4px'}}>
                      <strong style={{color: '#f57c00'}}>📐 Culvert Sizing Rules of Thumb:</strong>
                      <ul style={{marginTop: '6px', paddingLeft: '20px'}}>
                        <li>Small watershed (&lt;5 ha): 300-400mm min</li>
                        <li>Medium watershed (5-20 ha): 450-600mm</li>
                        <li>Large watershed (&gt;20 ha): 600mm+ or bridge</li>
                        <li>Fish stream: Add 20% to account for debris</li>
                        <li>Climate change: Add 20% for increased flows</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <div className="rating-options">
                {[
                  { value: 'Low', label: 'Low Consequence', description: 'No water resources nearby (>100m), adequate infrastructure, minimal use, no special values' },
                  { value: 'Moderate', label: 'Moderate Consequence', description: 'Non-fish streams (30-100m), moderate infrastructure, regular use, some environmental values' },
                  { value: 'High', label: 'High Consequence', description: 'Fish streams (<30m), undersized infrastructure, high use, critical habitat/cultural areas' }
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

        {activeSection === 'notes' && (
          <div className="form-section" style={{ borderTop: '4px solid #2e7d32' }}>
            <h2 className="section-header" style={{ color: '#2e7d32', paddingLeft: '40px' }}>
              <span className="section-accent" style={{ background: 'linear-gradient(to bottom, #2e7d32, #66bb6a)' }}></span>
              Field Notes
            </h2>
            
            <div style={{
              background: '#fff3e0',
              padding: '14px',
              borderRadius: '6px',
              marginBottom: '16px',
              fontSize: '13px',
              border: '2px solid #ff9800'
            }}>
              <strong style={{color: '#f57c00'}}>💡 Tip:</strong> Record detailed observations here, 
              then use <strong>QuickCapture</strong> in the field to capture GPS, photos, and upload to LRM.
            </div>
            
            <FieldNotesSection onSave={(notes) => console.log('Notes saved')} />
          </div>
        )}

        {activeSection === 'results' && (
          <div className="form-section" style={{ borderTop: '4px solid #4caf50' }}>
            <h2 className="section-header" style={{ color: '#4caf50', paddingLeft: '40px' }}>
              <span className="section-accent" style={{ background: 'linear-gradient(to bottom, #4caf50, #81c784)' }}></span>
              LMH Risk Results
            </h2>

            {riskResult ? (
              <div className="risk-results-container">
                <div className="methodology-display" style={{marginLeft: '20px'}}>
                  <h3 style={{marginLeft: '20px'}}>📋 LMH Methodology</h3>
                  <p><strong>Simplified Land Management Hazard Assessment</strong></p>
                  <p>Qualitative risk determination using Likelihood × Consequence matrix</p>
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
                    {isSaving ? '💾 Saving...' : '💾 Save Assessment'}
                  </button>
                  <div style={{
                    marginTop: '12px',
                    fontSize: '13px',
                    color: '#666'
                  }}>
                    💡 Export as PDF report or use QuickCapture for field data
                  </div>
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
                <p>Complete both <strong>Likelihood</strong> and <strong>Consequence</strong> ratings.</p>
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
