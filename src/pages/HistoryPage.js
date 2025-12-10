import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { exportToPDF } from '../utils/pdfExport';

function HistoryPage() {
  const [assessmentHistory, setAssessmentHistory] = useState([]);
  
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const historyData = localStorage.getItem('assessmentHistory');
    if (historyData) {
      const allHistory = JSON.parse(historyData);
      const roadRiskOnly = allHistory.filter(assessment => assessment.type === 'roadRisk');
      setAssessmentHistory(roadRiskOnly);
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
    return assessment.title || assessment.data?.basicInfo?.roadName || 'Untitled Assessment';
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
    const method = assessment.data?.riskMethod || 'Mosaic';
    
    alert(`Assessment Details\n\nTitle: ${title}\nMethod: ${method}\nDate: ${date}\nRisk Level: ${riskLevel?.level || 'Not calculated'}\nPhotos: ${assessment.photoCount || 0}`);
  };
  
  const handleDeleteAssessment = (id) => {
    if (window.confirm('Are you sure you want to delete this assessment?')) {
      const updatedHistory = assessmentHistory.filter(assessment => assessment.id !== id);
      localStorage.setItem('assessmentHistory', JSON.stringify(updatedHistory));
      setAssessmentHistory(updatedHistory);
    }
  };
  
  return (
    <div style={{padding: '20px', maxWidth: '900px', margin: '0 auto'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h1 style={{color: '#2e7d32'}}>Assessment History</h1>
        <Link to="/" style={{
          padding: '8px 16px',
          backgroundColor: '#f5f5f5',
          color: '#333',
          textDecoration: 'none',
          borderRadius: '4px',
          fontWeight: 'bold'
        }}>
          ← Back to Home
        </Link>
      </div>
      
      {assessmentHistory.length === 0 ? (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          backgroundColor: '#f9f9f9',
          borderRadius: '8px'
        }}>
          <p style={{fontSize: '1.2rem', marginBottom: '15px'}}>📋 No assessments found</p>
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
            Create New Assessment
          </Link>
        </div>
      ) : (
        <div>
          {assessmentHistory.map((assessment) => {
            const riskLevel = getRiskLevel(assessment);
            const method = assessment.data?.riskMethod || 'Mosaic';
            
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
                        {method === 'LMH' ? '⚖️ LMH Method' : '🛣️ Mosaic Method'}
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

                      {assessment.photoCount > 0 && (
                        <span style={{
                          fontSize: '0.85rem',
                          backgroundColor: '#e8f5e9',
                          color: '#2e7d32',
                          padding: '3px 10px',
                          borderRadius: '4px'
                        }}>
                          📷 {assessment.photoCount} photos
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <div style={{fontSize: '0.9rem', color: '#666'}}>
                      {formatDate(assessment.dateCreated)}
                    </div>
                    {assessment.data?.assessor && (
                      <div style={{fontSize: '0.9rem', color: '#666'}}>
                        {assessment.data.assessor}
                      </div>
                    )}
                  </div>
                </div>
                
                <div style={{
                  padding: '8px 0',
                  borderTop: '1px solid #eee',
                  borderBottom: '1px solid #eee',
                  marginBottom: '12px',
                  color: '#666',
                  fontSize: '0.9rem'
                }}>
                  📍 {getLocationInfo(assessment)}
                </div>
                
                <div style={{display: 'flex', justifyContent: 'flex-end', gap: '8px'}}>
                  <button 
                    onClick={() => exportToPDF(assessment)}
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
                    📑 Export PDF
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
                    📄 View Details
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
                    🗑️ Delete
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
