import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomeScreen = () => {
  const navigate = useNavigate();
  
  const navigateToRoadRisk = () => {
    // Clear any saved form data to start a new assessment
    localStorage.removeItem('roadRiskBasicInfo');
    localStorage.removeItem('roadRiskHazardFactors');
    localStorage.removeItem('roadRiskConsequenceFactors');
    localStorage.removeItem('roadRiskOptionalAssessments');
    localStorage.removeItem('roadRiskGeotechnicalFactors');
    localStorage.removeItem('roadRiskInfrastructureFactors');
    
    navigate('/road-risk');
  };
  
  const navigateToHistory = () => {
    navigate('/history');
  };
  
  const navigateToRoadRiskEdit = (id) => {
    navigate(`/road-risk/edit/${id}`);
  };
  
  const getRoadRiskAssessments = () => {
    try {
      const history = JSON.parse(localStorage.getItem('assessmentHistory') || '[]');
      return history
        .filter(a => a.type === 'roadRisk')
        .sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated))
        .slice(0, 3);
    } catch (error) {
      console.error('Error retrieving assessments:', error);
      return [];
    }
  };
  
  const [recentAssessments, setRecentAssessments] = useState([]);
  
  useEffect(() => {
    setRecentAssessments(getRoadRiskAssessments());
  }, []);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric', 
      year: 'numeric'
    });
  };
  
  const getLocationString = (location) => {
    if (typeof location === 'string') return location;
    if (location?.latitude) {
      return `Lat: ${String(location.latitude).substring(0, 7)}, Lng: ${String(location.longitude).substring(0, 7)}`;
    }
    return 'No location';
  };
  
  return (
    <div className="home-container">
      <div className="app-header">
        <h1 className="app-title">Road Risk Assessment</h1>
        <p className="app-subtitle">Professional risk evaluation for forest roads</p>
      </div>
      
      <div className="tool-section">
        <div className="field-card-grid">
          <div className="field-card primary" onClick={navigateToRoadRisk}>
            <div className="field-card-content">
              <div className="field-card-title">Road Risk Assessment</div>
              <div className="field-card-description">
                Evaluate forest road risk factors using official EGBC/FPBC methodology with hazard and consequence scoring.
              </div>
            </div>
            <div className="field-card-icon">🛣️</div>
          </div>
          
          <div className="field-card secondary" onClick={navigateToHistory}>
            <div className="field-card-content">
              <div className="field-card-title">Assessment History</div>
              <div className="field-card-description">
                View, edit, and manage all your saved road risk assessments.
              </div>
            </div>
            <div className="field-card-icon">📋</div>
          </div>
        </div>
      </div>
      
      {recentAssessments.length > 0 && (
        <div className="drafts-section">
          <h2 className="section-title">Recent Assessments</h2>
          
          <div className="draft-list">
            {recentAssessments.map(assessment => (
              <div 
                className="draft-item" 
                key={assessment.id}
                onClick={() => navigateToRoadRiskEdit(assessment.id)}
              >
                <div className="draft-info">
                  <div className="draft-name">
                    {assessment.title || 'Untitled Assessment'}
                  </div>
                  <div className="draft-location">
                    {getLocationString(assessment.data?.location)}
                  </div>
                </div>
                
                <div className="draft-meta">
                  <div className="draft-type road-risk">
                    Road Risk
                  </div>
                  <div className="draft-date">
                    {formatDate(assessment.dateCreated)}
                  </div>
                </div>
                
                <div className="continue-button">
                  Open →
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="app-footer">
        <div className="app-version">Road Risk Assessment v2.0.0</div>
        <div className="app-copyright">© 2025 Mosaic Forest Management</div>
      </div>
    </div>
  );
};

export default HomeScreen;
