// src/pages/AssessmentDetailPage.js
// View and edit saved assessments

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadAssessmentsDB, deleteAssessmentDB } from '../utils/db';
import { exportToProfessionalPDF } from '../utils/professionalPDF';

function AssessmentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedNotes, setEditedNotes] = useState({});

  const loadAssessment = useCallback(async () => {
    try {
      const assessments = await loadAssessmentsDB();
      const found = assessments.find(a => a.id === parseInt(id));
      if (found) {
        setAssessment(found);
        setEditedNotes(found.data?.fieldNotes || {});
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
    // TODO: Update assessment in IndexedDB
    alert('Edit feature coming soon!');
    setIsEditing(false);
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
  const photos = data.photos || [];
  const method = data.riskMethod || 'Scorecard';

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
          {isEditing ? '❌ Cancel Edit' : '✏️ Edit Notes'}
        </button>
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
          {riskAssessment.priority && (
            <div style={{fontSize: '14px', marginTop: '12px', opacity: 0.9}}>
              Priority: {riskAssessment.priority}
            </div>
          )}
        </div>
      </div>

      {/* Field Notes */}
      {(fieldNotes.hazardObservations || fieldNotes.consequenceObservations || 
        fieldNotes.generalComments || fieldNotes.recommendations) && (
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h2 style={{color: '#2e7d32', marginTop: 0}}>📝 Field Notes & Photos</h2>
          
          {isEditing ? (
            <div style={{display: 'grid', gap: '16px'}}>
              {fieldNotes.hazardObservations !== undefined && (
                <div>
                  <label style={{display: 'block', marginBottom: '4px', fontWeight: 'bold'}}>
                    ⚠️ Hazard Observations
                  </label>
                  <textarea
                    value={editedNotes.hazardObservations || ''}
                    onChange={(e) => setEditedNotes(n => ({...n, hazardObservations: e.target.value}))}
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '4px',
                      border: '1px solid #ddd',
                      fontSize: '14px'
                    }}
                  />
                </div>
              )}
              {fieldNotes.consequenceObservations !== undefined && (
                <div>
                  <label style={{display: 'block', marginBottom: '4px', fontWeight: 'bold'}}>
                    🎯 Consequence Observations
                  </label>
                  <textarea
                    value={editedNotes.consequenceObservations || ''}
                    onChange={(e) => setEditedNotes(n => ({...n, consequenceObservations: e.target.value}))}
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '4px',
                      border: '1px solid #ddd',
                      fontSize: '14px'
                    }}
                  />
                </div>
              )}
              {fieldNotes.generalComments !== undefined && (
                <div>
                  <label style={{display: 'block', marginBottom: '4px', fontWeight: 'bold'}}>
                    💬 General Comments
                  </label>
                  <textarea
                    value={editedNotes.generalComments || ''}
                    onChange={(e) => setEditedNotes(n => ({...n, generalComments: e.target.value}))}
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '4px',
                      border: '1px solid #ddd',
                      fontSize: '14px'
                    }}
                  />
                </div>
              )}
              {fieldNotes.recommendations !== undefined && (
                <div>
                  <label style={{display: 'block', marginBottom: '4px', fontWeight: 'bold'}}>
                    ✅ Recommendations
                  </label>
                  <textarea
                    value={editedNotes.recommendations || ''}
                    onChange={(e) => setEditedNotes(n => ({...n, recommendations: e.target.value}))}
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '4px',
                      border: '1px solid #ddd',
                      fontSize: '14px'
                    }}
                  />
                </div>
              )}
              <div style={{display: 'flex', gap: '12px'}}>
                <button
                  onClick={handleSaveEdits}
                  style={{
                    background: '#4caf50',
                    color: 'white',
                    border: 'none',
                    padding: '10px 24px',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  💾 Save Changes
                </button>
                <button
                  onClick={() => {
                    setEditedNotes(fieldNotes);
                    setIsEditing(false);
                  }}
                  style={{
                    background: '#f5f5f5',
                    color: '#666',
                    border: 'none',
                    padding: '10px 24px',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div style={{display: 'grid', gap: '16px'}}>
              {fieldNotes.hazardObservations && (
                <div>
                  <div style={{fontWeight: 'bold', marginBottom: '4px', color: '#f57c00'}}>
                    ⚠️ Hazard Observations
                  </div>
                  <div style={{whiteSpace: 'pre-wrap', color: '#555'}}>{fieldNotes.hazardObservations}</div>
                </div>
              )}
              {fieldNotes.consequenceObservations && (
                <div>
                  <div style={{fontWeight: 'bold', marginBottom: '4px', color: '#e91e63'}}>
                    🎯 Consequence Observations
                  </div>
                  <div style={{whiteSpace: 'pre-wrap', color: '#555'}}>{fieldNotes.consequenceObservations}</div>
                </div>
              )}
              {fieldNotes.generalComments && (
                <div>
                  <div style={{fontWeight: 'bold', marginBottom: '4px', color: '#2196f3'}}>
                    💬 General Comments
                  </div>
                  <div style={{whiteSpace: 'pre-wrap', color: '#555'}}>{fieldNotes.generalComments}</div>
                </div>
              )}
              {fieldNotes.recommendations && (
                <div>
                  <div style={{fontWeight: 'bold', marginBottom: '4px', color: '#4caf50'}}>
                    ✅ Recommendations
                  </div>
                  <div style={{whiteSpace: 'pre-wrap', color: '#555'}}>{fieldNotes.recommendations}</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Photos */}
      {photos.length > 0 && (
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '20px'
        }}>
          <h2 style={{color: '#2e7d32', marginTop: 0}}>📸 Site Photos ({photos.length})</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '16px'
          }}>
            {photos.map((photo, i) => (
              <div key={photo.id || i} style={{
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                overflow: 'hidden',
                background: '#fafafa'
              }}>
                <img src={photo.data} alt={`Site ${i+1}`} style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover'
                }} />
                <div style={{padding: '12px'}}>
                  <div style={{fontWeight: 'bold', marginBottom: '4px'}}>Photo {i + 1}</div>
                  <div style={{fontSize: '12px', color: '#999', marginBottom: '6px'}}>
                    {new Date(photo.timestamp).toLocaleString()}
                  </div>
                  {photo.gps?.latitude && (
                    <div style={{fontSize: '12px', color: '#2196f3', marginBottom: '6px'}}>
                      📍 {photo.gps.latitude}, {photo.gps.longitude}
                    </div>
                  )}
                  {photo.comment && (
                    <div style={{fontSize: '13px', color: '#555', marginTop: '8px', fontStyle: 'italic'}}>
                      "{photo.comment}"
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Risk Breakdown (Scorecard only) */}
      {method === 'Scorecard' && data.hazardFactors && (
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{color: '#2e7d32', marginTop: 0}}>📊 Detailed Factor Scores</h2>
          
          <div style={{marginBottom: '24px'}}>
            <h3 style={{color: '#ff9800', marginBottom: '12px'}}>Hazard Factors</h3>
            <div style={{display: 'grid', gap: '8px'}}>
              {Object.entries(data.hazardFactors).map(([key, value]) => (
                <div key={key} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  background: '#f9f9f9',
                  borderRadius: '4px'
                }}>
                  <span>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span style={{fontWeight: 'bold', color: '#ff9800'}}>{value || 0} pts</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{color: '#e91e63', marginBottom: '12px'}}>Consequence Factors</h3>
            <div style={{display: 'grid', gap: '8px'}}>
              {Object.entries(data.consequenceFactors || {}).map(([key, value]) => (
                <div key={key} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  background: '#f9f9f9',
                  borderRadius: '4px'
                }}>
                  <span>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span style={{fontWeight: 'bold', color: '#e91e63'}}>{value || 0} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AssessmentDetailPage;
