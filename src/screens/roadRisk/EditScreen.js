import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import '../../styles/RoadRiskForm.css';

function EditScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewAssessment = !id; // If no id passed, it's a new assessment
  
  // State for active section
  const [activeSection, setActiveSection] = useState('basic');
  
  // State for basic information
  const [basicInfo, setBasicInfo] = useState({
    roadName: '',
    startKm: '',
    endKm: '',
    startLat: '',
    startLong: '',
    endLat: '',
    endLong: '',
    assessmentDate: new Date().toISOString().split('T')[0],
    assessor: ''
  });
  
  // State for hazard factors
  const [hazardFactors, setHazardFactors] = useState({
    slopeStability: 0,
    drainagePatterns: 0,
    roadSurfaceCondition: 0,
    trafficVolume: 0
  });
  
  // State for consequence factors
  const [consequenceFactors, setConsequenceFactors] = useState({
    downstreamResources: 0,
    publicSafety: 0,
    environmentalImpact: 0,
    economicConsequences: 0
  });
  
  // State for comments
  const [comments, setComments] = useState({
    hazardGeneral: '',
    consequenceGeneral: ''
  });

  // Handle input changes for basic info
  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  // Handle hazard factor score selection
  const handleHazardScoreSelect = (factor, score) => {
    setHazardFactors(prevState => ({
      ...prevState,
      [factor]: score
    }));
  };
  
  // Handle consequence factor score selection
  const handleConsequenceScoreSelect = (factor, score) => {
    setConsequenceFactors(prevState => ({
      ...prevState,
      [factor]: score
    }));
  };
  
  // Handle comment changes
  const handleCommentChange = (e) => {
    const { name, value } = e.target;
    setComments(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  // Calculate total hazard score
  const calculateHazardTotal = () => {
    return Object.values(hazardFactors).reduce((sum, score) => sum + score, 0);
  };
  
  // Calculate total consequence score
  const calculateConsequenceTotal = () => {
    return Object.values(consequenceFactors).reduce((sum, score) => sum + score, 0);
  };
  
  // Calculate risk score (hazard × consequence)
  const calculateRiskScore = () => {
    return calculateHazardTotal() * calculateConsequenceTotal();
  };
  
  // Get risk category based on risk score
  const getRiskCategory = () => {
    const riskScore = calculateRiskScore();
    
    if (riskScore > 100) return { level: 'Very High', color: '#F44336' };
    if (riskScore >= 75) return { level: 'High', color: '#FF9800' };
    if (riskScore >= 50) return { level: 'Moderate', color: '#FFC107' };
    if (riskScore >= 25) return { level: 'Low', color: '#4CAF50' };
    return { level: 'Very Low', color: '#2196F3' };
  };

  // Function to get current location
  const getCurrentLocation = (positionType) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const long = position.coords.longitude;
          
          if (positionType === 'start') {
            setBasicInfo(prev => ({
              ...prev,
              startLat: lat.toFixed(6),
              startLong: long.toFixed(6)
            }));
          } else if (positionType === 'end') {
            setBasicInfo(prev => ({
              ...prev,
              endLat: lat.toFixed(6),
              endLong: long.toFixed(6)
            }));
          }
        },
        (error) => {
          alert(`Error getting location: ${error.message}`);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // Handler for saving assessment
  const handleSaveAssessment = () => {
    // Validate required fields
    if (!basicInfo.roadName || !basicInfo.assessor) {
      alert("Please fill in required fields (Road Name and Assessor) before saving.");
      return;
    }
    
    // Create unique ID for assessment
    const assessmentId = id || `road-risk-${Date.now()}`;
    
    // Build assessment object
    const assessment = {
      id: assessmentId,
      type: 'roadRisk',
      dateCreated: new Date().toISOString(),
      data: {
        basicInfo: { ...basicInfo },
        hazardFactors: { ...hazardFactors },
        consequenceFactors: { ...consequenceFactors },
        comments: { ...comments },
        hazardTotal: calculateHazardTotal(),
        consequenceTotal: calculateConsequenceTotal(),
        riskScore: calculateRiskScore(),
        riskCategory: getRiskCategory().level
      },
      status: 'completed'
    };
    
    // Get existing history or initialize empty array
    const historyData = localStorage.getItem('assessmentHistory');
    const assessmentHistory = historyData ? JSON.parse(historyData) : [];
    
    // Add new assessment or update existing one
    const updatedHistory = isNewAssessment
      ? [assessment, ...assessmentHistory]
      : assessmentHistory.map(item => item.id === id ? assessment : item);
    
    // Save to localStorage
    localStorage.setItem('assessmentHistory', JSON.stringify(updatedHistory));
    
    // Navigate to history page
    navigate('/history');
    
    // Show confirmation message
    alert('Assessment saved successfully!');
  };
  
  // Handler for saving as draft
  const handleSaveDraft = () => {
    // Create unique ID for the draft
    const draftId = id || `road-risk-draft-${Date.now()}`;
    
    // Build draft assessment object
    const draft = {
      id: draftId,
      type: 'roadRisk',
      dateCreated: new Date().toISOString(),
      data: {
        basicInfo: { ...basicInfo },
        hazardFactors: { ...hazardFactors },
        consequenceFactors: { ...consequenceFactors },
        comments: { ...comments },
        hazardTotal: calculateHazardTotal(),
        consequenceTotal: calculateConsequenceTotal(),
        riskScore: calculateRiskScore(),
        riskCategory: getRiskCategory().level
      },
      status: 'draft'
    };
    
    // Get existing drafts or initialize empty array
    const draftsData = localStorage.getItem('assessmentDrafts');
    const assessmentDrafts = draftsData ? JSON.parse(draftsData) : [];
    
    // Add new draft or update existing one
    const updatedDrafts = isNewAssessment
      ? [draft, ...assessmentDrafts]
      : assessmentDrafts.map(item => item.id === id ? draft : item);
    
    // Save to localStorage
    localStorage.setItem('assessmentDrafts', JSON.stringify(updatedDrafts));
    
    // Show confirmation message
    alert('Draft saved successfully!');
  };
  
  // Handler for resetting form
  const handleResetForm = () => {
    if (window.confirm('Are you sure you want to reset the form? All unsaved changes will be lost.')) {
      // Reset basic info
      setBasicInfo({
        roadName: '',
        startKm: '',
        endKm: '',
        startLat: '',
        startLong: '',
        endLat: '',
        endLong: '',
        assessmentDate: new Date().toISOString().split('T')[0],
        assessor: ''
      });
      
      // Reset hazard factors
      setHazardFactors({
        slopeStability: 0,
        drainagePatterns: 0,
        roadSurfaceCondition: 0,
        trafficVolume: 0
      });
      
      // Reset consequence factors
      setConsequenceFactors({
        downstreamResources: 0,
        publicSafety: 0,
        environmentalImpact: 0,
        economicConsequences: 0
      });
      
      // Reset comments
      setComments({
        hazardGeneral: '',
        consequenceGeneral: ''
      });
      
      // Reset active section to 'basic'
      setActiveSection('basic');
    }
  };

  // Modified render for action buttons
  return (
    <div className="road-risk-form">
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb-link">Home</Link>
        <span className="breadcrumb-separator">›</span>
        <span className="breadcrumb-current">Road Risk Assessment</span>
      </div>
      
      <h1 className="form-title">
        {isNewAssessment ? 'New Road Risk Assessment' : `Edit: ${basicInfo.roadName || 'Untitled Assessment'}`}
      </h1>
      
      {/* Form Section Navigation */}
      <div className="form-nav">
        <button 
          className={`form-nav-button ${activeSection === 'basic' ? 'active' : ''}`}
          onClick={() => setActiveSection('basic')}
        >
          Basic Information
        </button>
        <button 
          className={`form-nav-button ${activeSection === 'hazard' ? 'active' : ''}`}
          onClick={() => setActiveSection('hazard')}
        >
          Hazard Factors
        </button>
        <button 
          className={`form-nav-button ${activeSection === 'consequence' ? 'active' : ''}`}
          onClick={() => setActiveSection('consequence')}
        >
          Consequence Factors
        </button>
        <button 
          className={`form-nav-button ${activeSection === 'optional' ? 'active' : ''}`}
          onClick={() => setActiveSection('optional')}
        >
          Optional Assessments
        </button>
        <button 
          className={`form-nav-button ${activeSection === 'results' ? 'active' : ''}`}
          onClick={() => setActiveSection('results')}
        >
          Results
        </button>
      </div>
      
      {/* Form Content Sections */}
      <div className="form-content-container">
        {/* Basic Information Section */}
        {activeSection === 'basic' && (
          <div className="form-section" style={{ borderTop: '4px solid #2196f3' }}>
            <h2 className="section-header" style={{ color: '#2196f3' }}>
              <span className="section-accent" style={{ background: 'linear-gradient(to bottom, #2196f3, #64b5f6)' }}></span>
              Basic Information
            </h2>
            
            <p className="section-description">
              Enter the general information about the road segment being assessed.
            </p>
            
            {/* Road Name Field */}
            <div className="form-group">
              <label htmlFor="roadName" className="form-label">Road Name/ID <span className="required">*</span></label>
              <input 
                type="text" 
                id="roadName" 
                name="roadName" 
                className="form-input" 
                value={basicInfo.roadName} 
                onChange={handleBasicInfoChange}
                placeholder="Enter road name or identifier" 
                required
              />
            </div>
            
            {/* Road Segment Information */}
            <div className="form-group-row">
              <div className="form-group">
                <label htmlFor="startKm" className="form-label">Start KM</label>
                <input 
                  type="number" 
                  id="startKm" 
                  name="startKm" 
                  className="form-input" 
                  value={basicInfo.startKm} 
                  onChange={handleBasicInfoChange} 
                  placeholder="Starting kilometer"
                  step="0.1"
                  min="0"
                />
              </div>
              <div className="form-group">
                <label htmlFor="endKm" className="form-label">End KM</label>
                <input 
                  type="number" 
                  id="endKm" 
                  name="endKm" 
                  className="form-input" 
                  value={basicInfo.endKm} 
                  onChange={handleBasicInfoChange} 
                  placeholder="Ending kilometer"
                  step="0.1"
                  min="0"
                />
              </div>
            </div>
            
            {/* GPS Coordinates - Start */}
            <div className="form-subheader">
              <h3>Start Location Coordinates</h3>
              <button 
                type="button" 
                className="gps-button"
                onClick={() => getCurrentLocation('start')}
              >
                Get Current GPS
              </button>
            </div>
            
            <div className="form-group-row">
              <div className="form-group">
                <label htmlFor="startLat" className="form-label">Latitude</label>
                <input 
                  type="text" 
                  id="startLat" 
                  name="startLat" 
                  className="form-input" 
                  value={basicInfo.startLat} 
                  onChange={handleBasicInfoChange} 
                  placeholder="e.g. 49.123456"
                />
              </div>
              <div className="form-group">
                <label htmlFor="startLong" className="form-label">Longitude</label>
                <input 
                  type="text" 
                  id="startLong" 
                  name="startLong" 
                  className="form-input" 
                  value={basicInfo.startLong} 
                  onChange={handleBasicInfoChange} 
                  placeholder="e.g. -123.123456"
                />
              </div>
            </div>
            
            {/* GPS Coordinates - End */}
            <div className="form-subheader">
              <h3>End Location Coordinates</h3>
              <button 
                type="button" 
                className="gps-button"
                onClick={() => getCurrentLocation('end')}
              >
                Get Current GPS
              </button>
            </div>
            
            <div className="form-group-row">
              <div className="form-group">
                <label htmlFor="endLat" className="form-label">Latitude</label>
                <input 
                  type="text" 
                  id="endLat" 
                  name="endLat" 
                  className="form-input" 
                  value={basicInfo.endLat} 
                  onChange={handleBasicInfoChange} 
                  placeholder="e.g. 49.123456"
                />
              </div>
              <div className="form-group">
                <label htmlFor="endLong" className="form-label">Longitude</label>
                <input 
                  type="text" 
                  id="endLong" 
                  name="endLong" 
                  className="form-input" 
                  value={basicInfo.endLong} 
                  onChange={handleBasicInfoChange} 
                  placeholder="e.g. -123.123456"
                />
              </div>
            </div>
            
            {/* Assessment Details */}
            <div className="form-group-row">
              <div className="form-group">
                <label htmlFor="assessmentDate" className="form-label">Assessment Date</label>
                <input 
                  type="date" 
                  id="assessmentDate" 
                  name="assessmentDate" 
                  className="form-input" 
                  value={basicInfo.assessmentDate} 
                  onChange={handleBasicInfoChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="assessor" className="form-label">Assessor Name <span className="required">*</span></label>
                <input 
                  type="text" 
                  id="assessor" 
                  name="assessor" 
                  className="form-input" 
                  value={basicInfo.assessor} 
                  onChange={handleBasicInfoChange} 
                  placeholder="Enter your name"
                  required
                />
              </div>
            </div>
            
            <div className="section-divider"></div>
            
            {/* Navigation guidance */}
            <div className="navigation-hint">
              <p>Fill out the basic information and continue to the Hazard Factors section.</p>
              <button 
                className="form-nav-forward"
                onClick={() => setActiveSection('hazard')}
              >
                Continue to Hazard Factors
              </button>
            </div>
          </div>
        )}
        
        {/* Hazard Factors Section */}
        {activeSection === 'hazard' && (
          <div className="form-section" style={{ borderTop: '4px solid #ff9800' }}>
            <h2 className="section-header" style={{ color: '#ff9800' }}>
              <span className="section-accent" style={{ background: 'linear-gradient(to bottom, #ff9800, #ffb74d)' }}></span>
              Hazard Factors
            </h2>
            
            <p className="section-description">
              Assess the hazard factors for this road segment. Each factor contributes to the overall risk assessment.
              Select the score that best represents the hazard level for each factor.
            </p>
            
            {/* Slope Stability Factor */}
            <div className="factor-group">
              <h3 className="factor-header">1. Slope Stability</h3>
              
              <div className="score-buttons">
                <div 
                  className={`score-button green ${hazardFactors.slopeStability === 1 ? 'selected' : ''}`}
                  onClick={() => handleHazardScoreSelect('slopeStability', 1)}
                >
                  <div className="score-value">1</div>
                  <div className="score-label">
                    Low risk: Gentle slopes, no visible erosion, stable terrain
                  </div>
                </div>
                
                <div 
                  className={`score-button yellow ${hazardFactors.slopeStability === 2 ? 'selected' : ''}`}
                  onClick={() => handleHazardScoreSelect('slopeStability', 2)}
                >
                  <div className="score-value">2</div>
                  <div className="score-label">
                    Moderate risk: Some steeper sections, minor erosion present
                  </div>
                </div>
                
                <div 
                  className={`score-button orange ${hazardFactors.slopeStability === 3 ? 'selected' : ''}`}
                  onClick={() => handleHazardScoreSelect('slopeStability', 3)}
                >
                  <div className="score-value">3</div>
                  <div className="score-label">
                    High risk: Steep slopes, visible erosion, potentially unstable areas
                  </div>
                </div>
                
                <div 
                  className={`score-button red ${hazardFactors.slopeStability === 4 ? 'selected' : ''}`}
                  onClick={() => handleHazardScoreSelect('slopeStability', 4)}
                >
                  <div className="score-value">4</div>
                  <div className="score-label">
                    Very high risk: Very steep terrain, active erosion, known instability
                  </div>
                </div>
              </div>
            </div>
            
            {/* Drainage Patterns Factor */}
            <div className="factor-group">
              <h3 className="factor-header">2. Drainage Patterns</h3>
              
              <div className="score-buttons">
                <div 
                  className={`score-button green ${hazardFactors.drainagePatterns === 1 ? 'selected' : ''}`}
                  onClick={() => handleHazardScoreSelect('drainagePatterns', 1)}
                >
                  <div className="score-value">1</div>
                  <div className="score-label">
                    Low risk: Well-maintained ditches, functioning culverts, no water issues
                  </div>
                </div>
                
                <div 
                  className={`score-button yellow ${hazardFactors.drainagePatterns === 2 ? 'selected' : ''}`}
                  onClick={() => handleHazardScoreSelect('drainagePatterns', 2)}
                >
                  <div className="score-value">2</div>
                  <div className="score-label">
                    Moderate risk: Some ditch maintenance needed, minor water pooling
                  </div>
                </div>
                
                <div 
                  className={`score-button orange ${hazardFactors.drainagePatterns === 3 ? 'selected' : ''}`}
                  onClick={() => handleHazardScoreSelect('drainagePatterns', 3)}
                >
                  <div className="score-value">3</div>
                  <div className="score-label">
                    High risk: Poor drainage, clogged culverts, evident water damage
                  </div>
                </div>
                
                <div 
                  className={`score-button red ${hazardFactors.drainagePatterns === 4 ? 'selected' : ''}`}
                  onClick={() => handleHazardScoreSelect('drainagePatterns', 4)}
                >
                  <div className="score-value">4</div>
                  <div className="score-label">
                    Very high risk: Severe drainage issues, failed culverts, active erosion
                  </div>
                </div>
              </div>
            </div>
            
            {/* Road Surface Condition Factor */}
            <div className="factor-group">
              <h3 className="factor-header">3. Road Surface Condition</h3>
              
              <div className="score-buttons">
                <div 
                  className={`score-button green ${hazardFactors.roadSurfaceCondition === 1 ? 'selected' : ''}`}
                  onClick={() => handleHazardScoreSelect('roadSurfaceCondition', 1)}
                >
                  <div className="score-value">1</div>
                  <div className="score-label">
                    Low risk: Well-maintained, consistent surface, no significant issues
                  </div>
                </div>
                
                <div 
                  className={`score-button yellow ${hazardFactors.roadSurfaceCondition === 2 ? 'selected' : ''}`}
                  onClick={() => handleHazardScoreSelect('roadSurfaceCondition', 2)}
                >
                  <div className="score-value">2</div>
                  <div className="score-label">
                    Moderate risk: Some surface irregularities, minor maintenance needed
                  </div>
                </div>
                
                <div 
                  className={`score-button orange ${hazardFactors.roadSurfaceCondition === 3 ? 'selected' : ''}`}
                  onClick={() => handleHazardScoreSelect('roadSurfaceCondition', 3)}
                >
                  <div className="score-value">3</div>
                  <div className="score-label">
                    High risk: Poor surface condition, significant maintenance required
                  </div>
                </div>
                
                <div 
                  className={`score-button red ${hazardFactors.roadSurfaceCondition === 4 ? 'selected' : ''}`}
                  onClick={() => handleHazardScoreSelect('roadSurfaceCondition', 4)}
                >
                  <div className="score-value">4</div>
                  <div className="score-label">
                    Very high risk: Severely degraded surface, unsafe driving conditions
                  </div>
                </div>
              </div>
            </div>
            
            {/* Traffic Volume Factor */}
            <div className="factor-group">
              <h3 className="factor-header">4. Traffic Volume</h3>
              
              <div className="score-buttons">
                <div 
                  className={`score-button green ${hazardFactors.trafficVolume === 1 ? 'selected' : ''}`}
                  onClick={() => handleHazardScoreSelect('trafficVolume', 1)}
                >
                  <div className="score-value">1</div>
                  <div className="score-label">
                    Low risk: Minimal traffic, infrequent use
                  </div>
                </div>
                
                <div 
                  className={`score-button yellow ${hazardFactors.trafficVolume === 2 ? 'selected' : ''}`}
                  onClick={() => handleHazardScoreSelect('trafficVolume', 2)}
                >
                  <div className="score-value">2</div>
                  <div className="score-label">
                    Moderate risk: Regular traffic, moderate use
                  </div>
                </div>
                
                <div 
                  className={`score-button orange ${hazardFactors.trafficVolume === 3 ? 'selected' : ''}`}
                  onClick={() => handleHazardScoreSelect('trafficVolume', 3)}
                >
                  <div className="score-value">3</div>
                  <div className="score-label">
                    High risk: Heavy traffic, frequent use by various vehicles
                  </div>
                </div>
                
                <div 
                  className={`score-button red ${hazardFactors.trafficVolume === 4 ? 'selected' : ''}`}
                  onClick={() => handleHazardScoreSelect('trafficVolume', 4)}
                >
                  <div className="score-value">4</div>
                  <div className="score-label">
                    Very high risk: Very heavy traffic, constant use by heavy vehicles
                  </div>
                </div>
              </div>
            </div>
            
            {/* Hazard Factors Total */}
            <div className="factor-total">
              <div className="factor-total-label">Total Hazard Score:</div>
              <div className="factor-total-value">{calculateHazardTotal()}</div>
            </div>
            
            {/* General Comments */}
            <div className="form-group">
              <label htmlFor="hazardGeneral" className="form-label">Hazard Comments:</label>
              <textarea 
                id="hazardGeneral"
                name="hazardGeneral"
                className="comments-area"
                value={comments.hazardGeneral}
                onChange={handleCommentChange}
                placeholder="Add any comments or observations about hazards on this road segment..."
                rows="4"
              ></textarea>
            </div>
            
            <div className="navigation-hint">
              <div className="nav-buttons-container">
                <button 
                  className="form-nav-back"
                  onClick={() => setActiveSection('basic')}
                >
                  Back to Basic Information
                </button>
                <button 
                  className="form-nav-forward"
                  onClick={() => setActiveSection('consequence')}
                >
                  Continue to Consequence Factors
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Consequence Factors Section */}
        {activeSection === 'consequence' && (
          <div className="form-section" style={{ borderTop: '4px solid #9c27b0' }}>
            <h2 className="section-header" style={{ color: '#9c27b0' }}>
              <span className="section-accent" style={{ background: 'linear-gradient(to bottom, #9c27b0, #ba68c8)' }}></span>
              Consequence Factors
            </h2>
            
            <p className="section-description">
              Assess the potential consequences if a failure were to occur on this road segment.
              Select the score that best represents the potential impact for each consequence factor.
            </p>
            
            {/* Downstream Resources Factor */}
            <div className="factor-group">
              <h3 className="factor-header">1. Downstream Resources at Risk</h3>
              
              <div className="score-buttons">
                <div 
                  className={`score-button green ${consequenceFactors.downstreamResources === 1 ? 'selected' : ''}`}
                  onClick={() => handleConsequenceScoreSelect('downstreamResources', 1)}
                >
                  <div className="score-value">1</div>
                  <div className="score-label">
                    Low risk: No significant resource values downstream
                  </div>
                </div>
                
                <div 
                  className={`score-button yellow ${consequenceFactors.downstreamResources === 2 ? 'selected' : ''}`}
                  onClick={() => handleConsequenceScoreSelect('downstreamResources', 2)}
                >
                  <div className="score-value">2</div>
                  <div className="score-label">
                    Moderate risk: Some resources at distant downstream locations
                  </div>
                </div>
                
                <div 
                  className={`score-button orange ${consequenceFactors.downstreamResources === 3 ? 'selected' : ''}`}
                  onClick={() => handleConsequenceScoreSelect('downstreamResources', 3)}
                >
                  <div className="score-value">3</div>
                  <div className="score-label">
                    High risk: Important resources in immediate vicinity
                  </div>
                </div>
                
                <div 
                  className={`score-button red ${consequenceFactors.downstreamResources === 4 ? 'selected' : ''}`}
                  onClick={() => handleConsequenceScoreSelect('downstreamResources', 4)}
                >
                  <div className="score-value">4</div>
                  <div className="score-label">
                    Very high risk: Critical resources directly downstream
                  </div>
                </div>
              </div>
            </div>
            
            {/* Public Safety Factor */}
            <div className="factor-group">
              <h3 className="factor-header">2. Public Safety Risk</h3>
              
              <div className="score-buttons">
                <div 
                  className={`score-button green ${consequenceFactors.publicSafety === 1 ? 'selected' : ''}`}
                  onClick={() => handleConsequenceScoreSelect('publicSafety', 1)}
                >
                  <div className="score-value">1</div>
                  <div className="score-label">
                    Low risk: Rarely used by public, minimal safety concern
                  </div>
                </div>
                
                <div 
                  className={`score-button yellow ${consequenceFactors.publicSafety === 2 ? 'selected' : ''}`}
                  onClick={() => handleConsequenceScoreSelect('publicSafety', 2)}
                >
                  <div className="score-value">2</div>
                  <div className="score-label">
                    Moderate risk: Occasionally used by public, some safety concerns
                  </div>
                </div>
                
                <div 
                  className={`score-button orange ${consequenceFactors.publicSafety === 3 ? 'selected' : ''}`}
                  onClick={() => handleConsequenceScoreSelect('publicSafety', 3)}
                >
                  <div className="score-value">3</div>
                  <div className="score-label">
                    High risk: Regularly used by public, significant safety concerns
                  </div>
                </div>
                
                <div 
                  className={`score-button red ${consequenceFactors.publicSafety === 4 ? 'selected' : ''}`}
                  onClick={() => handleConsequenceScoreSelect('publicSafety', 4)}
                >
                  <div className="score-value">4</div>
                  <div className="score-label">
                    Very high risk: Heavy public use, serious safety concerns
                  </div>
                </div>
              </div>
            </div>
            
            {/* Environmental Impact Factor */}
            <div className="factor-group">
              <h3 className="factor-header">3. Environmental Impact</h3>
              
              <div className="score-buttons">
                <div 
                  className={`score-button green ${consequenceFactors.environmentalImpact === 1 ? 'selected' : ''}`}
                  onClick={() => handleConsequenceScoreSelect('environmentalImpact', 1)}
                >
                  <div className="score-value">1</div>
                  <div className="score-label">
                    Low risk: Minimal environmental sensitivity in the area
                  </div>
                </div>
                
                <div 
                  className={`score-button yellow ${consequenceFactors.environmentalImpact === 2 ? 'selected' : ''}`}
                  onClick={() => handleConsequenceScoreSelect('environmentalImpact', 2)}
                >
                  <div className="score-value">2</div>
                  <div className="score-label">
                    Moderate risk: Some sensitive environmental features nearby
                  </div>
                </div>
                
                <div 
                  className={`score-button orange ${consequenceFactors.environmentalImpact === 3 ? 'selected' : ''}`}
                  onClick={() => handleConsequenceScoreSelect('environmentalImpact', 3)}
                >
                  <div className="score-value">3</div>
                  <div className="score-label">
                    High risk: Significant sensitive environmental features in vicinity
                  </div>
                </div>
                
                <div 
                  className={`score-button red ${consequenceFactors.environmentalImpact === 4 ? 'selected' : ''}`}
                  onClick={() => handleConsequenceScoreSelect('environmentalImpact', 4)}
                >
                  <div className="score-value">4</div>
                  <div className="score-label">
                    Very high risk: Critical environmental resources directly impacted
                  </div>
                </div>
              </div>
            </div>
            
            {/* Economic Consequences Factor */}
            <div className="factor-group">
              <h3 className="factor-header">4. Economic Consequences</h3>
              
              <div className="score-buttons">
                <div 
                  className={`score-button green ${consequenceFactors.economicConsequences === 1 ? 'selected' : ''}`}
                  onClick={() => handleConsequenceScoreSelect('economicConsequences', 1)}
                >
                  <div className="score-value">1</div>
                  <div className="score-label">
                    Low risk: Minor economic impact if road is damaged
                  </div>
                </div>
                
                <div 
                  className={`score-button yellow ${consequenceFactors.economicConsequences === 2 ? 'selected' : ''}`}
                  onClick={() => handleConsequenceScoreSelect('economicConsequences', 2)}
                >
                  <div className="score-value">2</div>
                  <div className="score-label">
                    Moderate risk: Moderate economic impact, alternative routes available
                  </div>
                </div>
                
                <div 
                  className={`score-button orange ${consequenceFactors.economicConsequences === 3 ? 'selected' : ''}`}
                  onClick={() => handleConsequenceScoreSelect('economicConsequences', 3)}
                >
                  <div className="score-value">3</div>
                  <div className="score-label">
                    High risk: Significant economic impact, limited alternative routes
                  </div>
                </div>
                
                <div 
                  className={`score-button red ${consequenceFactors.economicConsequences === 4 ? 'selected' : ''}`}
                  onClick={() => handleConsequenceScoreSelect('economicConsequences', 4)}
                >
                  <div className="score-value">4</div>
                  <div className="score-label">
                    Very high risk: Severe economic impact, no alternative routes
                  </div>
                </div>
              </div>
            </div>
            
            {/* Consequence Factors Total */}
            <div className="factor-total">
              <div className="factor-total-label">Total Consequence Score:</div>
              <div className="factor-total-value">{calculateConsequenceTotal()}</div>
            </div>
            
            {/* General Comments */}
            <div className="form-group">
              <label htmlFor="consequenceGeneral" className="form-label">Consequence Comments:</label>
              <textarea 
                id="consequenceGeneral"
                name="consequenceGeneral"
                className="comments-area"
                value={comments.consequenceGeneral}
                onChange={handleCommentChange}
                placeholder="Add any comments or observations about potential consequences of road failure..."
                rows="4"
              ></textarea>
            </div>
            
            <div className="navigation-hint">
              <div className="nav-buttons-container">
                <button 
                  className="form-nav-back"
                  onClick={() => setActiveSection('hazard')}
                >
                  Back to Hazard Factors
                </button>
                <button 
                  className="form-nav-forward"
                  onClick={() => setActiveSection('optional')}
                >
                  Continue to Optional Assessments
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Optional Assessments Section */}
        {activeSection === 'optional' && (
          <div className="form-section" style={{ borderTop: '4px solid #00bcd4' }}>
            <h2 className="section-header" style={{ color: '#00bcd4' }}>
              <span className="section-accent" style={{ background: 'linear-gradient(to bottom, #00bcd4, #4dd0e1)' }}></span>
              Optional Assessments
            </h2>
            
            <p className="section-description">
              Additional assessments that may be relevant for this road segment.
            </p>
            
            {/* Placeholder for optional assessments - will implement in next phase */}
            <div className="form-placeholder">
              <p>Optional assessments will be implemented in the next phase.</p>
              <p>This may include:</p>
              <ul>
                <li>Geotechnical considerations</li>
                <li>Culvert and drainage structures</li>
                <li>Wildlife considerations</li>
                <li>Recreational use impacts</li>
              </ul>
            </div>
            
            <div className="navigation-hint">
              <div className="nav-buttons-container">
                <button 
                  className="form-nav-back"
                  onClick={() => setActiveSection('consequence')}
                >
                  Back to Consequence Factors
                </button>
                <button 
                  className="form-nav-forward"
                  onClick={() => setActiveSection('results')}
                >
                  Continue to Results
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Results Section */}
        {activeSection === 'results' && (
          <div className="form-section" style={{ borderTop: '4px solid #4caf50' }}>
            <h2 className="section-header" style={{ color: '#4caf50' }}>
              <span className="section-accent" style={{ background: 'linear-gradient(to bottom, #4caf50, #81c784)' }}></span>
              Results
            </h2>
            
            <p className="section-description">
              Review your assessment results and recommended actions.
            </p>
            
            {/* Results Calculation */}
            <div className="results-summary">
              <div className="results-card">
                <h3 className="results-subtitle">Risk Calculation</h3>
                
                <div className="results-calculation">
                  <div className="calc-group">
                    <div className="calc-label">Hazard Score</div>
                    <div className="calc-value">{calculateHazardTotal()}</div>
                  </div>
                  
                  <div className="calc-operator">×</div>
                  
                  <div className="calc-group">
                    <div className="calc-label">Consequence Score</div>
                    <div className="calc-value">{calculateConsequenceTotal()}</div>
                  </div>
                  
                  <div className="calc-operator">=</div>
                  
                  <div className="calc-group">
                    <div className="calc-label">Risk Score</div>
                    <div className="calc-value risk-total">{calculateRiskScore()}</div>
                  </div>
                </div>
                
                {calculateRiskScore() > 0 && (
                  <div 
                    className="risk-category" 
                    style={{ backgroundColor: getRiskCategory().color }}
                  >
                    <div className="risk-category-label">Risk Category:</div>
                    <div className="risk-category-value">{getRiskCategory().level}</div>
                  </div>
                )}
                
                {calculateRiskScore() === 0 && (
                  <div className="form-placeholder">
                    <p>Complete all hazard and consequence factors to see your risk category.</p>
                  </div>
                )}
                
                {calculateRiskScore() > 0 && (
                  <div className="category-requirements">
                    <h3 className="requirements-header">Professional Requirements:</h3>
                    <div className="requirements-content">
                      {getRiskCategory().level === 'Very High' && (
                        <p>This road segment requires immediate attention from a qualified professional. A detailed assessment should be conducted as soon as possible. Consider temporary closures or restrictions until remediation is complete.</p>
                      )}
                      
                      {getRiskCategory().level === 'High' && (
                        <p>This road segment requires assessment by a qualified professional. Develop a mitigation plan to address identified risks and implement remedial actions within a defined timeframe.</p>
                      )}
                      
                      {getRiskCategory().level === 'Moderate' && (
                        <p>This road segment should be monitored regularly. Consider having a qualified professional review specific areas of concern. Develop a preventative maintenance plan.</p>
                      )}
                      
                      {(getRiskCategory().level === 'Low' || getRiskCategory().level === 'Very Low') && (
                        <p>This road segment requires routine maintenance and periodic monitoring. Follow standard operational practices for forest road management.</p>
                      )}
                    </div>
                  </div>
                )}
                
                {calculateRiskScore() > 0 && (
                  <div className="action-recommendations">
                    <h3 className="recommendations-header">Recommended Actions:</h3>
                    
                    <ul className="recommendations-list">
                      {getRiskCategory().level === 'Very High' && (
                        <>
                          <li>Implement immediate risk control measures</li>
                          <li>Schedule professional engineering assessment</li>
                          <li>Consider temporary road closure if public safety is at risk</li>
                          <li>Develop detailed remediation plan</li>
                          <li>Monitor continuously during remediation</li>
                        </>
                      )}
                      
                      {getRiskCategory().level === 'High' && (
                        <>
                          <li>Schedule professional assessment within 30 days</li>
                          <li>Implement interim risk control measures</li>
                          <li>Develop remediation plan for identified hazards</li>
                          <li>Establish regular monitoring schedule</li>
                          <li>Consider usage restrictions if necessary</li>
                        </>
                      )}
                      
                      {getRiskCategory().level === 'Moderate' && (
                        <>
                          <li>Monitor road conditions on a regular schedule</li>
                          <li>Address maintenance issues promptly</li>
                          <li>Develop maintenance plan for specific problem areas</li>
                          <li>Consider assessment by qualified personnel for specific concerns</li>
                          <li>Maintain good documentation of conditions and actions</li>
                        </>
                      )}
                      
                      {(getRiskCategory().level === 'Low' || getRiskCategory().level === 'Very Low') && (
                        <>
                          <li>Maintain regular inspection schedule</li>
                          <li>Follow standard maintenance procedures</li>
                          <li>Document any changes in conditions</li>
                          <li>Address minor issues during routine maintenance</li>
                          <li>Update assessment if conditions change significantly</li>
                        </>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
            <div className="navigation-hint">
              <button 
                className="form-nav-back"
                onClick={() => setActiveSection('optional')}
              >
                Back to Optional Assessments
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Fixed Action Bar at Bottom */}
      <div className="fixed-action-bar">
        <div className="fixed-action-bar-content">
          <button 
            className="form-action-button primary"
            onClick={handleSaveAssessment}
          >
            Save Assessment
          </button>
          <button 
            className="form-action-button secondary"
            onClick={handleSaveDraft}
          >
            Save Draft
          </button>
          <button 
            className="form-action-button danger"
            onClick={handleResetForm}
          >
            Reset Form
          </button>
          <Link to="/" className="form-action-button tertiary">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

export default EditScreen;