import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/RoadRiskForm.css';

function InputScreen() {
  const navigate = useNavigate();
  const [recentAssessments, setRecentAssessments] = useState([]);

  // Get assessment history from localStorage
  useEffect(() => {
    try {
      // Get unified assessment history
      const historyData = localStorage.getItem('assessmentHistory');
      let assessments = historyData ? JSON.parse(historyData) : [];
      
      // Filter for only road risk assessments and sort by date
      const roadRiskAssessments = assessments
        .filter(item => item.type === 'roadRisk')
        .sort((a, b) => new Date(b.dateCreated || b.completedAt) - new Date(a.dateCreated || a.completedAt));
      
      setRecentAssessments(roadRiskAssessments);
    } catch (error) {
      console.error('Error loading assessment history:', error);
      setRecentAssessments([]);
    }
  }, []);

  // Start a new assessment
  const handleNewAssessment = () => {
    // Clear any saved draft data
    localStorage.removeItem('roadRiskBasicInfo');
    localStorage.removeItem('roadRiskHazardFactors');
    localStorage.removeItem('roadRiskConsequenceFactors');
    localStorage.removeItem('roadRiskOptionalAssessments');
    localStorage.removeItem('roadRiskGeotechnicalFactors');
    localStorage.removeItem('roadRiskInfrastructureFactors');
    
    // Navigate to the edit screen with a new flag
    navigate('/road-risk/edit/new');
  };

  // Handle clicking on an existing assessment
  const handleSelectAssessment = (id) => {
    navigate(`/road-risk/edit/${id}`);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric', 
      year: 'numeric'
    });
  };

  // Get location string
  const getLocationString = (assessment) => {
    if (!assessment || !assessment.data) return 'No location';
    
    const data = assessment.data;
    
    if (data.basicInfo) {
      if (data.basicInfo.startKm && data.basicInfo.endKm) {
        return `KM ${data.basicInfo.startKm} - ${data.basicInfo.endKm}`;
      }
      
      if (data.basicInfo.startLat && data.basicInfo.startLong) {
        return `Lat: ${String(data.basicInfo.startLat).substring(0, 7)}, Lng: ${String(data.basicInfo.startLong).substring(0, 7)}`;
      }
    }
    
    return 'No location';
  };

  // Get assessment title
  const getAssessmentTitle = (assessment) => {
    if (!assessment) return 'Untitled Assessment';
    
    if (assessment.title) return assessment.title;
    
    if (assessment.data && assessment.data.basicInfo && assessment.data.basicInfo.roadName) {
      return assessment.data.basicInfo.roadName;
    }
    
    return 'Untitled Road Risk Assessment';
  };

  // Get risk level label
  const getRiskLevelLabel = (assessment) => {
    if (!assessment || !assessment.data) return null;
    
    // For our new format with riskCategory
    if (assessment.data.riskCategory) {
      return assessment.data.riskCategory;
    }
    
    // For legacy format if we have hazard and consequence factors
    if (assessment.data.hazardFactors && assessment.data.consequenceFactors) {
      const hazardValues = Object.values(assessment.data.hazardFactors).filter(val => val !== null);
      const consequenceValues = Object.values(assessment.data.consequenceFactors).filter(val => val !== null);
      
      if (hazardValues.length > 0 && consequenceValues.length > 0) {
        const hazardScore = hazardValues.reduce((sum, val) => sum + val, 0);
        const consequenceScore = consequenceValues.reduce((sum, val) => sum + val, 0);
        const riskScore = hazardScore * consequenceScore;
        
        if (riskScore >= 300) return 'Very High';
        if (riskScore >= 200) return 'High';
        if (riskScore >= 100) return 'Moderate';
        if (riskScore >= 50) return 'Low';
        return 'Very Low';
      }
    }
    
    return null;
  };

  // Get risk level color
  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'Very High': return '#d32f2f';
      case 'High': return '#f57c00';
      case 'Moderate': return '#fbc02d';
      case 'Low': return '#689f38';
      case 'Very Low': return '#388e3c';
      default: return '#888888';
    }
  };

  return (
    <div className="road-risk-input">
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb-link">Home</Link>
        <span className="breadcrumb-separator">›</span>
        <span className="breadcrumb-current">Road Risk Assessment</span>
      </div>
      
      <h1 className="form-title">Road Risk Assessment</h1>
      
      {/* New Assessment Button */}
      <div className="new-assessment-container">
        <button 
          className="new-assessment-button"
          onClick={handleNewAssessment}
        >
          <span className="new-assessment-icon">+</span>
          <span className="new-assessment-text">New Assessment</span>
        </button>
      </div>
      
      {/* Recent Assessments */}
      {recentAssessments.length > 0 && (
        <div className="recent-assessments-container">
          <h2 className="recent-heading">Recent Assessments</h2>
          <div className="assessment-list">
            {recentAssessments.map(assessment => {
              const riskLevel = getRiskLevelLabel(assessment);
              
              return (
                <div key={assessment.id} className="assessment-item" onClick={() => handleSelectAssessment(assessment.id)}>
                  <div className="assessment-info">
                    <div className="assessment-title">{getAssessmentTitle(assessment)}</div>
                    <div className="assessment-subtitle">{getLocationString(assessment)}</div>
                  </div>
                  
                  <div className="assessment-meta">
                    {riskLevel && (
                      <div className="risk-label" style={{ backgroundColor: getRiskLevelColor(riskLevel) }}>
                        {riskLevel}
                      </div>
                    )}
                    <div className="assessment-date">{formatDate(assessment.dateCreated || assessment.completedAt)}</div>
                  </div>
                  
                  <div className="open-indicator">›</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* No Assessments Message */}
      {recentAssessments.length === 0 && (
        <div className="no-assessments">
          <p>No road risk assessments found. Create a new assessment to get started.</p>
        </div>
      )}
      
      {/* Back to Dashboard Button */}
      <div className="form-actions">
        <Link to="/" className="action-button tertiary">Back to Dashboard</Link>
      </div>
    </div>
  );
}

export default InputScreen;
