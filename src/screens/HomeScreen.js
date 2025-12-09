import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomeScreen = () => {
  const navigate = useNavigate();
  
  // Navigate to specific tools
  const navigateToCulvertTool = () => {
    navigate('/culvert');
  };
  
  const navigateToRoadRisk = () => {
    // Clear any saved form data to start a new assessment
    localStorage.removeItem('roadRiskBasicInfo');
    localStorage.removeItem('roadRiskHazardFactors');
    localStorage.removeItem('roadRiskConsequenceFactors');
    localStorage.removeItem('roadRiskOptionalAssessments');
    localStorage.removeItem('roadRiskGeotechnicalFactors');
    localStorage.removeItem('roadRiskInfrastructureFactors');
    
    // Navigate directly to a new assessment
    navigate('/road-risk');
  };
  
  const navigateToHistory = () => {
    navigate('/history');
  };
  
  // Navigation to edit an existing road risk assessment
  const navigateToRoadRiskEdit = (id) => {
    navigate(`/road-risk/edit/${id}`);
  };
  
  // Get assessments from localStorage
  const getAssessmentHistory = () => {
    try {
      return JSON.parse(localStorage.getItem('assessmentHistory') || '[]');
    } catch (error) {
      console.error('Error retrieving assessment history:', error);
      return [];
    }
  };
  
  // For backward compatibility
  const getLegacyDrafts = () => {
    const culvertDrafts = (() => {
      try {
        return JSON.parse(localStorage.getItem('culvertDrafts') || '[]')
          .map(draft => ({
            ...draft,
            type: 'culvertSizing',
            toolType: 'Culvert Sizing'
          }));
      } catch (error) {
        console.error('Error retrieving culvert drafts:', error);
        return [];
      }
    })();
    
    const roadRiskDrafts = (() => {
      try {
        return JSON.parse(localStorage.getItem('roadRiskDrafts') || '[]')
          .map(draft => ({
            ...draft,
            type: 'roadRisk',
            toolType: 'Road Risk'
          }));
      } catch (error) {
        console.error('Error retrieving road risk drafts:', error);
        return [];
      }
    })();
    
    return [...culvertDrafts, ...roadRiskDrafts];
  };
  
  // Get and combine all assessments
  const [recentAssessments, setRecentAssessments] = useState([]);
  const [recentRoadRiskAssessments, setRecentRoadRiskAssessments] = useState([]);
  
  useEffect(() => {
    // Get assessments from unified assessmentHistory
    const assessmentHistory = getAssessmentHistory();
    
    // Get legacy drafts for backward compatibility
    const legacyDrafts = getLegacyDrafts();
    
    // Combine and format for display
    const formattedAssessments = assessmentHistory.map(assessment => ({
      id: assessment.id,
      title: assessment.title || 'Untitled Assessment',
      type: assessment.type,
      toolType: assessment.type === 'roadRisk' ? 'Road Risk' : 'Culvert Sizing',
      location: assessment.data?.location || 'No location',
      date: assessment.dateCreated || new Date().toISOString()
    }));
    
    // Format legacy drafts to match new format
    const formattedLegacyDrafts = legacyDrafts.map(draft => ({
      id: draft.id || `legacy-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title: draft.roadName || draft.culvertId || 'Untitled Draft',
      type: draft.type,
      toolType: draft.toolType,
      location: draft.location || 'No location',
      date: draft.date || new Date().toISOString()
    }));
    
    // Combine and sort by date (newest first)
    const allAssessments = [...formattedAssessments, ...formattedLegacyDrafts]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5); // Only show the 5 most recent assessments
    
    setRecentAssessments(allAssessments);
    
    // Filter for just road risk assessments and keep only the top 2
    const roadRiskOnly = [...formattedAssessments, ...formattedLegacyDrafts]
      .filter(assessment => assessment.type === 'roadRisk')
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 2); // Only the top 2 most recent Road Risk assessments
    
    setRecentRoadRiskAssessments(roadRiskOnly);
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
        <h1 className="app-title">Digital Forester App</h1>
      </div>
      
      <div className="tool-section">
        <p className="section-label">Select a tool to begin:</p>
        
        <div className="field-card-grid">
          <div className="field-card primary" onClick={navigateToRoadRisk}>
            <div className="field-card-content">
              <div className="field-card-title">Road Risk Assessment</div>
              <div className="field-card-description">
                Evaluate forest road risk factors including terrain, drainage, and maintenance conditions.
              </div>
            </div>
            <div className="field-card-icon">🛣️</div>
          </div>
          
          <div className="field-card success" onClick={navigateToCulvertTool}>
            <div className="field-card-content">
              <div className="field-card-title">Culvert Sizing Tool</div>
              <div className="field-card-description">
                Calculate appropriate culvert dimensions based on stream measurements.
              </div>
            </div>
            <div className="field-card-icon">🌊</div>
          </div>
          
          <div className="field-card secondary" onClick={navigateToHistory}>
            <div className="field-card-content">
              <div className="field-card-title">Assessment History</div>
              <div className="field-card-description">
                View and manage all saved assessments and calculations.
              </div>
            </div>
            <div className="field-card-icon">📋</div>
          </div>
        </div>
      </div>
      
      {/* Recent Road Risk Assessments */}
      {recentRoadRiskAssessments.length > 0 && (
        <div className="drafts-section">
          <h2 className="section-title">Recent Road Risk Assessments</h2>
          
          <div className="draft-list">
            {recentRoadRiskAssessments.map(assessment => (
              <div className="draft-item" key={assessment.id} onClick={() => navigateToRoadRiskEdit(assessment.id)}>
                <div className="draft-info">
                  <div className="draft-name">
                    {assessment.title}
                  </div>
                  <div className="draft-location">
                    {getLocationString(assessment.location)}
                  </div>
                </div>
                
                <div className="draft-meta">
                  <div className="draft-type road-risk">
                    {assessment.toolType}
                  </div>
                  <div className="draft-date">{formatDate(assessment.date)}</div>
                </div>
                
                <div className="continue-button">
                  Open →
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* All Recent Assessments */}
      {recentAssessments.length > 0 && (
        <div className="drafts-section">
          <h2 className="section-title">Recent Assessments</h2>
          
          <div className="draft-list">
            {recentAssessments.map(assessment => (
              <div className="draft-item" key={assessment.id}>
                <div className="draft-info">
                  <div className="draft-name">
                    {assessment.title}
                  </div>
                  <div className="draft-location">
                    {getLocationString(assessment.location)}
                  </div>
                </div>
                
                <div className="draft-meta">
                  <div className={`draft-type ${assessment.type === 'roadRisk' ? 'road-risk' : 'culvert-sizing'}`}>
                    {assessment.toolType}
                  </div>
                  <div className="draft-date">{formatDate(assessment.date)}</div>
                </div>
                
                <button 
                  className="continue-button"
                  onClick={() => navigate('/history')}
                >
                  View details →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="app-footer">
        <div className="app-version">Digital Forester App v0.3.1</div>
        <div className="app-copyright">© 2025 Forest Management Technologies</div>
      </div>
    </div>
  );
};

export default HomeScreen;