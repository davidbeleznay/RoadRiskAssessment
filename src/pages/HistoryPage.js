import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function HistoryPage() {
  const [assessmentHistory, setAssessmentHistory] = useState([]);
  
  useEffect(() => {
    // Load history from localStorage - filter out culvert assessments
    const historyData = localStorage.getItem('assessmentHistory');
    if (historyData) {
      const allHistory = JSON.parse(historyData);
      // Only show roadRisk assessments
      const roadRiskOnly = allHistory.filter(assessment => assessment.type === 'roadRisk');
      setAssessmentHistory(roadRiskOnly);
    }
  }, []);
  
  // Format date for display
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
  
  // Get title based on assessment data
  const getAssessmentTitle = (assessment) => {
    if (assessment.title) {
      return assessment.title;
    }
    
    return assessment.data?.siteName || assessment.data?.basicInfo?.roadName || 'Untitled Road Risk Assessment';
  };
  
  // Get location info
  const getLocationInfo = (assessment) => {
    if (assessment.data?.location) {
      return assessment.data.location;
    }
    
    if (assessment.data?.basicInfo) {
      const { startKm, endKm } = assessment.data.basicInfo;
      
      if (startKm && endKm) {
        return `KM ${startKm} - ${endKm}`;
      }
      
      if (startKm) {
        return `KM ${startKm}`;
      }
    }
    
    return 'No location';
  };
  
  // Get risk level for road risk assessment
  const getRiskLevel = (assessment) => {
    if (!assessment.data) return null;
    
    // For our new format with riskCategory
    if (assessment.data.riskCategory) {
      const category = assessment.data.riskCategory;
      
      if (category === 'high') {
        return { level: 'High', color: '#dc3545' };
      } else if (category === 'moderate') {
        return { level: 'Moderate', color: '#ffc107' };
      } else if (category === 'low') {
        return { level: 'Low', color: '#28a745' };
      }
    }
    
    // For legacy format
    const hazardScore = Object.values(assessment.data.hazardFactors || {}).reduce((sum, score) => sum + score, 0);
    const consequenceScore = Object.values(assessment.data.consequenceFactors || {}).reduce((sum, score) => sum + score, 0);
    const riskScore = hazardScore * consequenceScore;
    
    if (riskScore > 1000) return { level: 'Very High', color: '#F44336' };
    if (riskScore >= 500) return { level: 'High', color: '#FF9800' };
    if (riskScore >= 250) return { level: 'Moderate', color: '#FFC107' };
    if (riskScore >= 150) return { level: 'Low', color: '#4CAF50' };
    return { level: 'Very Low', color: '#2196F3' };
  };
  
  // Handle view assessment
  const handleViewAssessment = (assessment) => {
    const title = getAssessmentTitle(assessment);
    const date = formatDate(assessment.dateCreated || assessment.completedAt);
    const riskLevel = getRiskLevel(assessment);
    const riskScore = assessment.data.riskScore || 'Not calculated';
    
    let details = `Risk Score: ${riskScore}\nRisk Level: ${riskLevel ? riskLevel.level : 'Not calculated'}\n`;
    
    if (assessment.data.recommendation) {
      details += `\nRecommendation: ${assessment.data.recommendation}`;
    }
    
    alert(`Assessment Details\n\nTitle: ${title}\nType: Road Risk Assessment\nDate: ${date}\n\n${details}`);
  };
  
  // Delete an assessment
  const handleDeleteAssessment = (id) => {
    if (window.confirm('Are you sure you want to delete this assessment? This action cannot be undone.')) {
      const updatedHistory = assessmentHistory.filter(assessment => assessment.id !== id);
      localStorage.setItem('assessmentHistory', JSON.stringify(updatedHistory));
      setAssessmentHistory(updatedHistory);
    }
  };
  
  return (
    <div style={{padding: '20px', maxWidth: '800px', margin: '0 auto'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h1 style={{color: '#2e7d32'}}>Road Risk Assessment History</h1>
        <Link to="/" style={{
          display: 'inline-block',
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
          borderRadius: '8px',
          color: '#666'
        }}>
          <p style={{fontSize: '1.2rem', marginBottom: '15px'}}>📋 No assessments found</p>
          <p>Complete a Road Risk Assessment to see it here.</p>
          <Link to="/road-risk" style={{
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
                        backgroundColor: '#e6f7ff',
                        color: '#0066cc',
                        padding: '3px 10px',
                        borderRadius: '4px',
                        display: 'inline-block'
                      }}>
                        🛣️ Road Risk
                      </span>
                      
                      {riskLevel && (
                        <span style={{
                          fontSize: '0.85rem',
                          backgroundColor: `${riskLevel.color}22`,
                          color: riskLevel.color,
                          padding: '3px 10px',
                          borderRadius: '4px',
                          display: 'inline-block',
                          fontWeight: 'bold'
                        }}>
                          {riskLevel.level} Risk
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <div style={{fontSize: '0.9rem', color: '#666', marginBottom: '4px'}}>
                      {formatDate(assessment.dateCreated || assessment.completedAt)}
                    </div>
                    {assessment.data?.assessor && (
                      <div style={{fontSize: '0.9rem', color: '#666'}}>
                        {assessment.data.assessor}
                      </div>
                    )}
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  borderTop: '1px solid #eee',
                  borderBottom: '1px solid #eee',
                  marginBottom: '12px',
                  color: '#666',
                  fontSize: '0.9rem'
                }}>
                  <span>📍 {getLocationInfo(assessment)}</span>
                  <span>{assessment.photoCount ? `📷 ${assessment.photoCount} photos` : ''}</span>
                </div>
                
                <div style={{display: 'flex', justifyContent: 'flex-end', gap: '8px'}}>
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
