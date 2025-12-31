// src/pages/AssessmentDetailPage.js
// Assessment detail view with simplified QuickCapture integration

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadAssessmentsDB, deleteAssessmentDB, updateAssessmentDB } from '../utils/db';
import { exportToProfessionalPDF } from '../utils/professionalPDF';

function AssessmentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});

  const loadAssessment = useCallback(async () => {
    try {
      const assessments = await loadAssessmentsDB();
      const found = assessments.find(a => a.id === parseInt(id));
      if (found) {
        setAssessment(found);
        setEditedData({
          basicInfo: found.data?.basicInfo || {},
          fieldNotes: found.data?.fieldNotes || {},
          quickCaptureRef: found.data?.quickCaptureRef || ''
        });
      } else {
        alert('Assessment not found');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error loading assessment:', error);
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    loadAssessment();
  }, [loadAssessment]);

  const handleDelete = async () => {
    if (window.confirm('Delete this assessment permanently? This cannot be undone.')) {
      await deleteAssessmentDB(assessment.id);
      alert('✅ Assessment deleted');
      navigate('/dashboard');
    }
  };

  const handleSaveEdits = async () => {
    try {
      const updatedAssessment = {
        ...assessment,
        data: {
          ...assessment.data,
          basicInfo: editedData.basicInfo,
          fieldNotes: editedData.fieldNotes,
          quickCaptureRef: editedData.quickCaptureRef
        }
      };
      
      await updateAssessmentDB(updatedAssessment);
      setAssessment(updatedAssessment);
      setIsEditing(false);
      alert('✅ Assessment updated!');
    } catch (error) {
      console.error('Save error:', error);
      alert('❌ Failed to save: ' + error.message);
    }
  };

  if (isLoading) {
    return (
      <div style={{padding: '40px', textAlign: 'center'}}>
        <div style={{fontSize: '48px'}}>⏳</div>
        <div>Loading assessment...</div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div style={{padding: '40px', textAlign: 'center'}}>
        <div style={{fontSize: '48px'}}>❌</div>
        <div>Assessment not found</div>
      </div>
    );
  }

  const data = assessment.data || {};
  const basicInfo = data.basicInfo || {};
  const riskAssessment = data.riskAssessment || {};
  const fieldNotes = data.fieldNotes || {};
  const method = data.riskMethod || 'Scorecard';
  const quickCaptureRef = data.quickCaptureRef || '';

  const riskLevel = riskAssessment.finalRisk || riskAssessment.riskLevel || data.riskCategory;
  const riskColors = {
    'Very High': '#f44336',
    'High': '#ff9800',
    'Moderate': '#ffc107',
    'Low': '#4caf50'
  };

  return (
    <div style={{padding: '20px', maxWidth: '1000px', margin: '0 auto', background: '#f5f5f5', minHeight: '100vh'}}>
      {/* Header */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
          <div>
            <h1 style={{margin: '0 0 8px 0', color: '#2e7d32'}}>
              {basicInfo.roadName || 'Untitled Assessment'}
            </h1>
            <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
              <span style={{
                background: method === 'LMH' ? '#e1bee7' : '#e6f7ff',
                color: method === 'LMH' ? '#6a1b9a' : '#0066cc',
                padding: '4px 12px',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                {method === 'LMH' ? '⚖️ LMH Method' : '🔬 Scorecard Method'}
              </span>
              {riskLevel && (
                <span style={{
                  background: riskColors[riskLevel],
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  {riskLevel} Risk
                </span>
              )}
            </div>
          </div>
          <button onClick={() => navigate('/dashboard')} style={{
            padding: '8px 16px',
            background: '#f5f5f5',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}>
            ← Back
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        background: 'white',
        padding: '16px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px',
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => exportToProfessionalPDF(assessment)}
          style={{
            background: '#f44336',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          📄 Download PDF
        </button>
        <button
          onClick={() => setIsEditing(!isEditing)}
          style={{
            background: isEditing ? '#ff9800' : '#2e7d32',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          {isEditing ? '❌ Cancel' : '✏️ Edit'}
        </button>
        {isEditing && (
          <button
            onClick={handleSaveEdits}
            style={{
              background: '#4caf50',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            💾 Save Changes
          </button>
        )}
        <button
          onClick={handleDelete}
          style={{
            background: 'white',
            color: '#dc3545',
            border: '2px solid #dc3545',
            padding: '10px 20px',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          🗑️ Delete
        </button>
      </div>

      {/* Basic Information */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h2 style={{color: '#2e7d32', marginTop: 0}}>📋 Basic Information</h2>
        {isEditing ? (
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px'}}>
            <div>
              <label style={{display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 'bold'}}>Road Name</label>
              <input
                type="text"
                value={editedData.basicInfo.roadName || ''}
                onChange={(e) => setEditedData(d => ({
                  ...d,
                  basicInfo: {...d.basicInfo, roadName: e.target.value}
                }))}
                style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd'}}
              />
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 'bold'}}>Assessor</label>
              <input
                type="text"
                value={editedData.basicInfo.assessor || ''}
                onChange={(e) => setEditedData(d => ({
                  ...d,
                  basicInfo: {...d.basicInfo, assessor: e.target.value}
                }))}
                style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd'}}
              />
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 'bold'}}>Start KM</label>
              <input
                type="text"
                value={editedData.basicInfo.startKm || ''}
                onChange={(e) => setEditedData(d => ({
                  ...d,
                  basicInfo: {...d.basicInfo, startKm: e.target.value}
                }))}
                style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd'}}
              />
            </div>
            <div>
              <label style={{display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 'bold'}}>End KM</label>
              <input
                type="text"
                value={editedData.basicInfo.endKm || ''}
                onChange={(e) => setEditedData(d => ({
                  ...d,
                  basicInfo: {...d.basicInfo, endKm: e.target.value}
                }))}
                style={{width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd'}}
              />
            </div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            <div>
              <div style={{fontSize: '12px', color: '#999', fontWeight: 'bold'}}>Assessment Date</div>
              <div style={{fontSize: '15px', color: '#333'}}>{basicInfo.assessmentDate || 'N/A'}</div>
            </div>
            <div>
              <div style={{fontSize: '12px', color: '#999', fontWeight: 'bold'}}>Assessor</div>
              <div style={{fontSize: '15px', color: '#333'}}>{basicInfo.assessor || 'N/A'}</div>
            </div>
            <div>
              <div style={{fontSize: '12px', color: '#999', fontWeight: 'bold'}}>Road Section</div>
              <div style={{fontSize: '15px', color: '#333'}}>
                KM {basicInfo.startKm || '?'} - {basicInfo.endKm || '?'}
              </div>
            </div>
            <div>
              <div style={{fontSize: '12px', color: '#999', fontWeight: 'bold'}}>Weather</div>
              <div style={{fontSize: '15px', color: '#333'}}>{basicInfo.weatherConditions || 'N/A'}</div>
            </div>
          </div>
        )}
      </div>

      {/* QuickCapture Reference */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h2 style={{color: '#2e7d32', marginTop: 0}}>📍 QuickCapture Field Data</h2>
        <p style={{fontSize: '13px', color: '#666', marginBottom: '12px'}}>
          Reference features captured in QuickCapture (line/point layer, KM locations, brief descriptions)
        </p>
        
        {isEditing ? (
          <div>
            <label style={{display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 'bold'}}>
              QuickCapture Features Captured
            </label>
            <textarea
              value={editedData.quickCaptureRef || ''}
              onChange={(e) => setEditedData(d => ({...d, quickCaptureRef: e.target.value}))}
              rows={5}
              placeholder="Example:
Road Inspection line: KM 5.2-7.8

Points captured:
- KM 5.4: Existing culvert 1400 (functioning)
- KM 6.2: No Culvert Observed 
- KM 6.8: Tension cracks (parallel to road)
- KM 7.1: Water flowing across road surface"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '13px',
                fontFamily: 'monospace',
                lineHeight: '1.5'
              }}
            />
            <div style={{fontSize: '12px', color: '#666', marginTop: '6px', lineHeight: '1.5'}}>
              Reference the QuickCapture layer (line or point), KM locations, and what each photo shows. 
              This connects your assessment to spatial field data that will be uploaded to LRM.
            </div>
          </div>
        ) : (
          <div>
            {quickCaptureRef ? (
              <div style={{
                background: '#e8f5e9',
                padding: '14px',
                borderRadius: '6px',
                border: '2px solid #4caf50',
                fontFamily: 'monospace',
                fontSize: '13px',
                whiteSpace: 'pre-wrap',
                lineHeight: '1.6'
              }}>
                {quickCaptureRef}
              </div>
            ) : (
              <div style={{
                background: '#fff3e0',
                padding: '12px',
                borderRadius: '6px',
                border: '2px solid #ff9800',
                fontSize: '13px',
                color: '#f57c00'
              }}>
                ⚠️ No QuickCapture reference added. Click Edit to link this assessment to field data captured in QuickCapture.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Risk Assessment */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h2 style={{color: '#2e7d32', marginTop: 0}}>🎯 Risk Assessment</h2>
        <div style={{
          background: riskColors[riskLevel] || '#999',
          color: 'white',
          padding: '24px',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          {method === 'Scorecard' && (
            <>
              <div style={{fontSize: '14px', marginBottom: '8px'}}>
                Hazard: {Object.values(data.hazardFactors || {}).reduce((sum, val) => sum + (val || 0), 0)}/50 • 
                Consequence: {Object.values(data.consequenceFactors || {}).reduce((sum, val) => sum + (val || 0), 0)}/40
              </div>
              <div style={{fontSize: '42px', fontWeight: 'bold'}}>
                Score: {data.riskScore}
              </div>
            </>
          )}
          {method === 'LMH' && (
            <>
              <div style={{fontSize: '14px', marginBottom: '8px'}}>
                {data.likelihood} Likelihood • {data.consequence} Consequence
              </div>
              <div style={{fontSize: '42px', fontWeight: 'bold'}}>
                {data.riskScore}
              </div>
            </>
          )}
          <div style={{fontSize: '24px', fontWeight: 'bold', marginTop: '8px'}}>
            {riskLevel?.toUpperCase()} RISK
          </div>
        </div>
      </div>

      {/* Detailed Factor Scores (Scorecard only) */}
      {method === 'Scorecard' && data.hazardFactors && (
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h2 style={{color: '#2e7d32', marginTop: 0}}>📊 Detailed Factor Scores</h2>
          
          <div style={{marginBottom: '24px'}}>
            <h3 style={{color: '#ff9800', marginBottom: '12px'}}>Hazard Factors ({Object.values(data.hazardFactors).reduce((sum, val) => sum + (val || 0), 0)}/50)</h3>
            <div style={{display: 'grid', gap: '8px'}}>
              {Object.entries(data.hazardFactors).map(([key, value]) => (
                <div key={key} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: value >= 7 ? '#ffebee' : '#f9f9f9',
                  borderRadius: '4px',
                  borderLeft: value >= 7 ? '4px solid #f44336' : '4px solid #e0e0e0'
                }}>
                  <span style={{fontWeight: '500'}}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span style={{fontWeight: 'bold', color: value >= 7 ? '#f44336' : '#ff9800', fontSize: '16px'}}>
                    {value || 0}/10
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{color: '#e91e63', marginBottom: '12px'}}>Consequence Factors ({Object.values(data.consequenceFactors || {}).reduce((sum, val) => sum + (val || 0), 0)}/40)</h3>
            <div style={{display: 'grid', gap: '8px'}}>
              {Object.entries(data.consequenceFactors || {}).map(([key, value]) => (
                <div key={key} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  background: value >= 7 ? '#ffebee' : '#f9f9f9',
                  borderRadius: '4px',
                  borderLeft: value >= 7 ? '4px solid #f44336' : '4px solid #e0e0e0'
                }}>
                  <span style={{fontWeight: '500'}}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span style={{fontWeight: 'bold', color: value >= 7 ? '#f44336' : '#e91e63', fontSize: '16px'}}>
                    {value || 0}/10
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Field Notes */}
      {(fieldNotes.hazardObservations || fieldNotes.consequenceObservations || 
        fieldNotes.generalComments || fieldNotes.recommendations || isEditing) && (
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h2 style={{color: '#2e7d32', marginTop: 0}}>📝 Field Notes</h2>
          
          {isEditing ? (
            <div style={{display: 'grid', gap: '16px'}}>
              <div>
                <label style={{display: 'block', marginBottom: '4px', fontWeight: 'bold'}}>
                  ⚠️ Hazard Observations
                </label>
                <textarea
                  value={editedData.fieldNotes.hazardObservations || ''}
                  onChange={(e) => setEditedData(d => ({
                    ...d,
                    fieldNotes: {...d.fieldNotes, hazardObservations: e.target.value}
                  }))}
                  rows={4}
                  placeholder="Terrain, slopes, soil types, drainage conditions..."
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    fontSize: '14px'
                  }}
                />
              </div>
              
              <div>
                <label style={{display: 'block', marginBottom: '4px', fontWeight: 'bold'}}>
                  🎯 Consequence Observations
                </label>
                <textarea
                  value={editedData.fieldNotes.consequenceObservations || ''}
                  onChange={(e) => setEditedData(d => ({
                    ...d,
                    fieldNotes: {...d.fieldNotes, consequenceObservations: e.target.value}
                  }))}
                  rows={4}
                  placeholder="Water proximity, infrastructure, road use, values..."
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{display: 'block', marginBottom: '4px', fontWeight: 'bold'}}>
                  💬 General Comments
                </label>
                <textarea
                  value={editedData.fieldNotes.generalComments || ''}
                  onChange={(e) => setEditedData(d => ({
                    ...d,
                    fieldNotes: {...d.fieldNotes, generalComments: e.target.value}
                  }))}
                  rows={4}
                  placeholder="Additional observations, context..."
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{display: 'block', marginBottom: '4px', fontWeight: 'bold'}}>
                  ✅ Recommendations
                </label>
                <textarea
                  value={editedData.fieldNotes.recommendations || ''}
                  onChange={(e) => setEditedData(d => ({
                    ...d,
                    fieldNotes: {...d.fieldNotes, recommendations: e.target.value}
                  }))}
                  rows={4}
                  placeholder="Actions, maintenance needs, follow-up..."
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>
          ) : (
            <div style={{display: 'grid', gap: '16px'}}>
              {fieldNotes.hazardObservations && (
                <div>
                  <div style={{fontWeight: 'bold', marginBottom: '6px', color: '#f57c00', fontSize: '15px'}}>
                    ⚠️ Hazard Observations
                  </div>
                  <div style={{whiteSpace: 'pre-wrap', color: '#555', lineHeight: '1.6', padding: '10px', background: '#fafafa', borderRadius: '4px'}}>
                    {fieldNotes.hazardObservations}
                  </div>
                </div>
              )}
              {fieldNotes.consequenceObservations && (
                <div>
                  <div style={{fontWeight: 'bold', marginBottom: '6px', color: '#e91e63', fontSize: '15px'}}>
                    🎯 Consequence Observations
                  </div>
                  <div style={{whiteSpace: 'pre-wrap', color: '#555', lineHeight: '1.6', padding: '10px', background: '#fafafa', borderRadius: '4px'}}>
                    {fieldNotes.consequenceObservations}
                  </div>
                </div>
              )}
              {fieldNotes.generalComments && (
                <div>
                  <div style={{fontWeight: 'bold', marginBottom: '6px', color: '#2196f3', fontSize: '15px'}}>
                    💬 General Comments
                  </div>
                  <div style={{whiteSpace: 'pre-wrap', color: '#555', lineHeight: '1.6', padding: '10px', background: '#fafafa', borderRadius: '4px'}}>
                    {fieldNotes.generalComments}
                  </div>
                </div>
              )}
              {fieldNotes.recommendations && (
                <div>
                  <div style={{fontWeight: 'bold', marginBottom: '6px', color: '#4caf50', fontSize: '15px'}}>
                    ✅ Recommendations
                  </div>
                  <div style={{whiteSpace: 'pre-wrap', color: '#555', lineHeight: '1.6', padding: '10px', background: '#fafafa', borderRadius: '4px'}}>
                    {fieldNotes.recommendations}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AssessmentDetailPage;
