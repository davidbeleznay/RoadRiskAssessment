import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function HistoryPage() {
  const [assessmentHistory, setAssessmentHistory] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  
  useEffect(() => {
    // Load history from localStorage
    const historyData = localStorage.getItem('assessmentHistory');
    if (historyData) {
      setAssessmentHistory(JSON.parse(historyData));
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
  
  // Get badge color based on assessment type
  const getBadgeColor = (type) => {
    switch(type) {
      case 'roadRisk':
        return { bg: '#e6f7ff', text: '#0066cc' };
      case 'culvertSizing':
        return { bg: '#e6ffed', text: '#006633' };
      default:
        return { bg: '#f5f5f5', text: '#666666' };
    }
  };
  
  // Get title based on assessment data
  const getAssessmentTitle = (assessment) => {
    if (assessment.title) {
      return assessment.title;
    }
    
    if (assessment.type === 'roadRisk') {
      return assessment.data?.siteName || assessment.data?.basicInfo?.roadName || 'Untitled Road Risk Assessment';
    } else if (assessment.type === 'culvertSizing') {
      return assessment.data?.title || assessment.data?.culvertId || 'Untitled Culvert Sizing';
    }
    
    return 'Untitled Assessment';
  };
  
  // Get location info
  const getLocationInfo = (assessment) => {
    if (assessment.data?.location) {
      return assessment.data.location;
    }
    
    if (assessment.type === 'roadRisk' && assessment.data?.basicInfo) {
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
    if (assessment.type !== 'roadRisk' || !assessment.data) return null;
    
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
  
  // Handle view assessment (placeholder for future implementation)
  const handleViewAssessment = (assessment) => {
    // For now just show the assessment details in an alert
    const title = getAssessmentTitle(assessment);
    const type = assessment.type === 'roadRisk' ? 'Road Risk Assessment' : 'Culvert Sizing';
    const date = formatDate(assessment.dateCreated || assessment.completedAt);
    
    // Format some assessment details based on type
    let details = '';
    
    if (assessment.type === 'roadRisk') {
      const riskLevel = getRiskLevel(assessment);
      const riskScore = assessment.data.riskScore || 'Not calculated';
      details = `Risk Score: ${riskScore}\nRisk Level: ${riskLevel ? riskLevel.level : 'Not calculated'}\n`;
      
      if (assessment.data.recommendation) {
        details += `\nRecommendation: ${assessment.data.recommendation}`;
      }
    } else if (assessment.type === 'culvertSizing') {
      if (assessment.data.results) {
        details = `Recommended Culvert Size: ${assessment.data.results.recommendedSize || 'Not calculated'}\n`;
        details += `Flow Rate: ${assessment.data.results.flowRate || 'Not calculated'}`;
      }
    }
    
    alert(`Assessment Details\n\nTitle: ${title}\nType: ${type}\nDate: ${date}\n\n${details}`);
    
    // Future implementation would navigate to a detailed view page
  };
  
  // Delete an assessment
  const handleDeleteAssessment = (id) => {
    if (window.confirm('Are you sure you want to delete this assessment? This action cannot be undone.')) {
      const updatedHistory = assessmentHistory.filter(assessment => assessment.id !== id);
      localStorage.setItem('assessmentHistory', JSON.stringify(updatedHistory));
      setAssessmentHistory(updatedHistory);
    }
  };
  
  // Filter assessments by type
  const filteredAssessments = selectedType === 'all' 
    ? assessmentHistory 
    : assessmentHistory.filter(assessment => assessment.type === selectedType);
  
  return (
    <div style={{padding: '20px', maxWidth: '800px', margin: '0 auto'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h1 style={{color: '#1976D2'}}>Assessment History</h1>
        <Link to="/" style={{
          display: 'inline-block',
          padding: '8px 16px',
          backgroundColor: '#f5f5f5',
          color: '#333',
          textDecoration: 'none',
          borderRadius: '4px',
          fontWeight: 'bold'
        }}>
          Back to Dashboard
        </Link>
      </div>
      
      {/* Filter buttons */}
      <div style={{marginBottom: '20px'}}>
        <div style={{display: 'flex', gap: '10px'}}>
          <button 
            onClick={() => setSelectedType('all')}
            style={{
              padding: '8px 16px',
              backgroundColor: selectedType === 'all' ? '#1976D2' : '#f5f5f5',
              color: selectedType === 'all' ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: selectedType === 'all' ? 'bold' : 'normal'
            }}
          >
            All
          </button>
          <button 
            onClick={() => setSelectedType('roadRisk')}
            style={{
              padding: '8px 16px',
              backgroundColor: selectedType === 'roadRisk' ? '#1976D2' : '#f5f5f5',
              color: selectedType === 'roadRisk' ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: selectedType === 'roadRisk' ? 'bold' : 'normal'
            }}
          >
            Road Risk
          </button>
          <button 
            onClick={() => setSelectedType('culvertSizing')}
            style={{
              padding: '8px 16px',
              backgroundColor: selectedType === 'culvertSizing' ? '#1976D2' : '#f5f5f5',
              color: selectedType === 'culvertSizing' ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: selectedType === 'culvertSizing' ? 'bold' : 'normal'
            }}
          >
            Culvert Sizing
          </button>
        </div>
      </div>
      
      {filteredAssessments.length === 0 ? (
        <div style={{
          padding: '30px', 
          textAlign: 'center', 
          backgroundColor: '#f9f9f9',
          borderRadius: '8px',
          color: '#666'
        }}>
          <p style={{fontSize: '1.1rem', marginBottom: '15px'}}>No assessments found</p>
          <p>
            {selectedType === 'all' 
              ? 'Complete an assessment using one of the tools to see it here.' 
              : `No ${selectedType === 'roadRisk' ? 'Road Risk' : 'Culvert Sizing'} assessments found.`}
          </p>
        </div>
      ) : (
        <div>
          {filteredAssessments.map((assessment) => {
            const badgeColor = getBadgeColor(assessment.type);
            const riskLevel = assessment.type === 'roadRisk' ? getRiskLevel(assessment) : null;
            
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
                        fontSize: '0.8rem',
                        backgroundColor: badgeColor.bg,
                        color: badgeColor.text,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        display: 'inline-block'
                      }}>
                        {assessment.type === 'roadRisk' ? 'Road Risk' : 'Culvert Sizing'}
                      </span>
                      
                      {riskLevel && (
                        <span style={{
                          fontSize: '0.8rem',
                          backgroundColor: `${riskLevel.color}22`,
                          color: riskLevel.color,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          display: 'inline-block'
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
                    <div style={{fontSize: '0.9rem', color: '#666'}}>
                      {assessment.data?.assessor 
                        ? `Assessor: ${assessment.data.assessor}` 
                        : assessment.inspector ? `Inspector: ${assessment.inspector}` : ''}
                    </div>
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
                  <span>{getLocationInfo(assessment)}</span>
                  <span>{assessment.photoCount ? `${assessment.photoCount} photos` : 'No photos'}</span>
                </div>
                
                <div style={{display: 'flex', justifyContent: 'flex-end', gap: '8px'}}>
                  <button 
                    onClick={() => handleDeleteAssessment(assessment.id)}
                    style={{
                      backgroundColor: '#f5f5f5',
                      color: '#dc3545',
                      border: '1px solid #dc3545',
                      borderRadius: '4px',
                      padding: '8px 16px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                  <button 
                    onClick={() => handleViewAssessment(assessment)}
                    style={{
                      backgroundColor: '#1976D2',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '8px 16px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    View Details
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
