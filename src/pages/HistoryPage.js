import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { exportToProfessionalPDF } from '../utils/professionalPDF';
import { loadAssessmentsDB, migrateFromLocalStorage } from '../utils/db';

function HistoryPage() {
  const [assessmentHistory, setAssessmentHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const migrationResult = await migrateFromLocalStorage();
      if (migrationResult.migrated > 0) {
        console.log('✅ Migrated', migrationResult.migrated, 'assessments');
      }
      
      const assessments = await loadAssessmentsDB();
      console.log('✅ Loaded', assessments.length, 'practice assessments');
      setAssessmentHistory(assessments);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatDate = (isoDate) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getAssessmentTitle = (assessment) => {
    return assessment.roadName || assessment.data?.basicInfo?.roadName || 'Untitled Assessment';
  };
  
  const getLocationInfo = (assessment) => {
    if (assessment.data?.basicInfo) {
      const { startKm, endKm } = assessment.data.basicInfo;
      if (startKm && endKm) return `KM ${startKm} - ${endKm}`;
      if (startKm) return `KM ${startKm}`;
    }
    return 'No location';
  };
  
  const getRiskLevel = (assessment) => {
    if (!assessment.data) return null;
    
    const riskAssessment = assessment.data.riskAssessment || {};
    const riskLevel = riskAssessment.finalRisk || riskAssessment.riskLevel || assessment.data.riskCategory;
    
    if (!riskLevel) return null;
    
    const colorMap = {
      'Very High': '#f44336',
      'High': '#ff9800',
      'Moderate': '#ffc107',
      'Low': '#4caf50',
      'Very Low': '#2196f3'
    };
    
    return {
      level: riskLevel,
      color: colorMap[riskLevel] || '#666'
    };
  };
  
  const handleViewAssessment = (assessment) => {
    const title = getAssessmentTitle(assessment);
    const date = formatDate(assessment.dateCreated);
    const riskLevel = getRiskLevel(assessment);
    const method = assessment.riskMethod || 'Scorecard';
    
    alert(`Practice Assessment\n\nTitle: ${title}\nMethod: ${method}\nDate: ${date}\nRisk: ${riskLevel?.level || 'N/A'}`);
  };
  
  const handleDeleteAssessment = async (id) => {
    if (window.confirm('Delete this practice assessment? This cannot be undone.')) {
      const { deleteAssessmentDB } = await import('../utils/db');
      await deleteAssessmentDB(id);
      loadHistory();
    }
  };
  
  const handleExportPDF = async (assessment) => {
    try {
      await exportToProfessionalPDF(assessment);
    } catch (error) {
      console.error('PDF export failed:', error);
    }
  };
  
  if (isLoading) {
    return (
      <div style={{padding: '40px', textAlign: 'center'}}>
        <div style={{fontSize: '48px'}}>⏳</div>
        <div>Loading practice assessments...</div>
      </div>
    );
  }
  
  return (
    <div style={{padding: '20px', maxWidth: '900px', margin: '0 auto'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <div>
          <h1 style={{color: '#2e7d32', margin: '0 0 4px 0'}}>Practice Assessment History</h1>
          <p style={{margin: 0, fontSize: '14px', color: '#666'}}>
            Review your saved practice assessments
          </p>
        </div>
        <Link to="/" style={{
          padding: '8px 16px',
          backgroundColor: '#f5f5f5',
          color: '#333',
          textDecoration: 'none',
          borderRadius: '4px',
          fontWeight: 'bold'
        }}>
          ← Back
        </Link>
      </div>
      
      {assessmentHistory.length === 0 ? (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px'
        }}>
          <p style={{fontSize: '1.2rem'}}>📋 No practice assessments found</p>
          <Link to="/" style={{
            display: 'inline-block',
            marginTop: '20px',
            padding: '12px 24px',
            background: '#2e7d32',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontWeight: 'bold'
          }}>
            Create Practice Assessment
          </Link>
        </div>
      ) : (
        <div>
          {assessmentHistory.map((assessment) => {
            const riskLevel = getRiskLevel(assessment);
            const method = assessment.riskMethod || 'Scorecard';
            
            return (
              <div key={assessment.id} style={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                border: '1px solid #eee'
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px'}}>
                  <div>
                    <h3 style={{margin: '0 0 8px 0', color: '#333'}}>
                      {getAssessmentTitle(assessment)}
                    </h3>
                    <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                      <span style={{
                        fontSize: '0.85rem',
                        backgroundColor: method === 'LMH' ? '#e1bee7' : '#e6f7ff',
                        color: method === 'LMH' ? '#6a1b9a' : '#0066cc',
                        padding: '3px 10px',
                        borderRadius: '4px'
                      }}>
                        {method === 'LMH' ? '⚖️ LMH' : '🔬 Scorecard'}
                      </span>
                      
                      {riskLevel && (
                        <span style={{
                          fontSize: '0.85rem',
                          backgroundColor: `${riskLevel.color}22`,
                          color: riskLevel.color,
                          padding: '3px 10px',
                          borderRadius: '4px',
                          fontWeight: 'bold'
                        }}>
                          {riskLevel.level} Risk
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{textAlign: 'right', fontSize: '0.9rem', color: '#666'}}>
                    {formatDate(assessment.dateCreated)}
                  </div>
                </div>
                
                <div style={{
                  padding: '8px 0',
                  borderTop: '1px solid #eee',
                  marginBottom: '12px',
                  color: '#666',
                  fontSize: '0.9rem'
                }}>
                  📍 {getLocationInfo(assessment)}
                </div>
                
                <div style={{display: 'flex', justifyContent: 'flex-end', gap: '8px'}}>
                  <button 
                    onClick={() => handleExportPDF(assessment)}
                    style={{
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '8px 16px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    📄 Download PDF
                  </button>
                  <button 
                    onClick={() => handleViewAssessment(assessment)}
                    style={{
                      backgroundColor: '#2e7d32',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '8px 16px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    👁️ View
                  </button>
                  <button 
                    onClick={() => handleDeleteAssessment(assessment.id)}
                    style={{
                      backgroundColor: '#fff',
                      color: '#dc3545',
                      border: '1px solid #dc3545',
                      borderRadius: '4px',
                      padding: '8px 16px',
                      cursor: 'pointer'
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default HistoryPage;
