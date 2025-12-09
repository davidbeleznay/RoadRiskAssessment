import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [savedForms, setSavedForms] = useState({
    roadRisk: null,
    culvertSizing: null
  });
  
  useEffect(() => {
    // Load saved forms from localStorage
    const roadRiskData = localStorage.getItem('roadRiskForm');
    const culvertData = localStorage.getItem('culvertSizingForm');
    
    setSavedForms({
      roadRisk: roadRiskData ? JSON.parse(roadRiskData) : null,
      culvertSizing: culvertData ? JSON.parse(culvertData) : null
    });
  }, []);
  
  // Format date for display
  const formatDate = (isoDate) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  // Get road name or default title for display
  const getRoadTitle = (formData) => {
    if (!formData || !formData.basicInfo) return 'Untitled Road Risk Assessment';
    
    if (formData.basicInfo.roadName) {
      return formData.basicInfo.roadName;
    }
    
    return 'Untitled Road Risk Assessment';
  };
  
  // Get location info
  const getLocationInfo = (formData) => {
    if (!formData || !formData.basicInfo) return 'No location';
    
    if (formData.basicInfo.startKm && formData.basicInfo.endKm) {
      return `KM ${formData.basicInfo.startKm} - ${formData.basicInfo.endKm}`;
    }
    
    if (formData.basicInfo.startKm) {
      return `KM ${formData.basicInfo.startKm}`;
    }
    
    return 'No location';
  };
  
  // Get culvert title
  const getCulvertTitle = (formData) => {
    if (!formData) return 'Untitled Culvert Sizing';
    
    if (formData.title) {
      return formData.title;
    }
    
    return 'Untitled Culvert Sizing';
  };
  
  return (
    <div style={{padding: '20px', maxWidth: '600px', margin: '0 auto'}}>
      <h1 style={{color: '#1976D2'}}>Digital Forester App</h1>
      <p style={{marginBottom: '20px'}}>Select a tool to begin:</p>
      
      <div style={{marginBottom: '10px'}}>
        <Link to="/road-risk" style={{
          display: 'block',
          background: '#1976D2',
          color: 'white',
          padding: '15px',
          borderRadius: '5px',
          textDecoration: 'none',
          textAlign: 'center',
          marginBottom: '10px',
          fontWeight: 'bold'
        }}>
          Road Risk Assessment
        </Link>
      </div>
      
      <div style={{marginBottom: '10px'}}>
        <Link to="/culvert-sizing" style={{
          display: 'block',
          background: '#2E7D32',
          color: 'white',
          padding: '15px',
          borderRadius: '5px',
          textDecoration: 'none',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          Culvert Sizing Tool
        </Link>
      </div>
      
      <div style={{marginBottom: '30px'}}>
        <Link to="/history" style={{
          display: 'block',
          background: '#5E35B1',
          color: 'white',
          padding: '15px',
          borderRadius: '5px',
          textDecoration: 'none',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          Assessment History
        </Link>
      </div>
      
      <div style={{marginTop: '30px'}}>
        <h2 style={{fontSize: '1.2rem', borderBottom: '1px solid #eee', paddingBottom: '8px', marginBottom: '15px'}}>
          Recent Drafts
        </h2>
        
        {(!savedForms.roadRisk && !savedForms.culvertSizing) ? (
          <p style={{color: '#666', fontStyle: 'italic'}}>No saved drafts found.</p>
        ) : (
          <div>
            {savedForms.roadRisk && (
              <div style={{
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '12px',
                marginBottom: '10px'
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span style={{fontWeight: 'bold'}}>
                    {getRoadTitle(savedForms.roadRisk)}
                  </span>
                  <span style={{
                    fontSize: '0.8rem',
                    backgroundColor: '#e6f7ff',
                    color: '#0066cc',
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}>
                    Road Risk
                  </span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '5px', fontSize: '0.9rem'}}>
                  <span style={{color: '#666'}}>
                    {getLocationInfo(savedForms.roadRisk)}
                  </span>
                  <span style={{color: '#666'}}>
                    {formatDate(savedForms.roadRisk.basicInfo?.date || savedForms.roadRisk.timestamp)}
                  </span>
                </div>
                <div style={{marginTop: '8px'}}>
                  <Link to="/road-risk" style={{
                    display: 'inline-block',
                    fontSize: '0.9rem',
                    color: '#1976D2',
                    textDecoration: 'none'
                  }}>
                    Continue editing →
                  </Link>
                </div>
              </div>
            )}
            
            {savedForms.culvertSizing && (
              <div style={{
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '12px'
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span style={{fontWeight: 'bold'}}>
                    {getCulvertTitle(savedForms.culvertSizing)}
                  </span>
                  <span style={{
                    fontSize: '0.8rem',
                    backgroundColor: '#e6ffed',
                    color: '#006633',
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}>
                    Culvert Sizing
                  </span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '5px', fontSize: '0.9rem'}}>
                  <span style={{color: '#666'}}>
                    {savedForms.culvertSizing.location || 'No location'}
                  </span>
                  <span style={{color: '#666'}}>
                    {formatDate(savedForms.culvertSizing.date || savedForms.culvertSizing.timestamp)}
                  </span>
                </div>
                <div style={{marginTop: '8px'}}>
                  <Link to="/culvert-sizing" style={{
                    display: 'inline-block',
                    fontSize: '0.9rem',
                    color: '#2E7D32',
                    textDecoration: 'none'
                  }}>
                    Continue editing →
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <footer style={{
        marginTop: '40px',
        padding: '20px 0',
        borderTop: '1px solid #eee',
        textAlign: 'center',
        color: '#666',
        fontSize: '0.9rem'
      }}>
        <p>Digital Forester App v0.2.0</p>
        <p style={{marginTop: '5px'}}>© 2025 Forest Management Technologies</p>
      </footer>
    </div>
  );
}

export default Dashboard;