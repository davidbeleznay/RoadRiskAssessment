import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { exportToJSON, exportToCSV, downloadJSON, downloadCSV } from '../utils/dataExport';
import { getDatabaseStats } from '../utils/db';

const HomeScreen = () => {
  const navigate = useNavigate();
  const [showExport, setShowExport] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const dbStats = await getDatabaseStats();
      setStats(dbStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };
  
  const navigateToRoadRisk = () => {
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

  const handleExport = async (format) => {
    setIsExporting(true);
    
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      
      if (format === 'json') {
        const data = await exportToJSON({ includeAll: true });
        downloadJSON(data, `road-risk-export-${timestamp}.json`);
        alert(`✅ Exported ${data.inspections?.length || 0} assessments to JSON`);
      } else if (format === 'csv') {
        const csvContent = await exportToCSV();
        downloadCSV(csvContent, `road-risk-export-${timestamp}.csv`);
        alert('✅ Exported to CSV - open in Excel!');
      }
    } catch (error) {
      alert('❌ Export failed: ' + error.message);
    } finally {
      setIsExporting(false);
      setShowExport(false);
    }
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

      {/* Stats Display */}
      {stats && stats.inspections > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '12px',
          margin: '20px 0',
          padding: '16px',
          background: '#f5f5f5',
          borderRadius: '8px'
        }}>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '24px', fontWeight: 'bold', color: '#2e7d32'}}>
              {stats.inspections}
            </div>
            <div style={{fontSize: '12px', color: '#666'}}>Assessments</div>
          </div>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '24px', fontWeight: 'bold', color: '#2196f3'}}>
              {stats.issues || 0}
            </div>
            <div style={{fontSize: '12px', color: '#666'}}>Issues</div>
          </div>
          <div style={{textAlign: 'center'}}>
            <div style={{fontSize: '24px', fontWeight: 'bold', color: '#ff9800'}}>
              {stats.pendingSync || 0}
            </div>
            <div style={{fontSize: '12px', color: '#666'}}>Pending Sync</div>
          </div>
        </div>
      )}
      
      <div className="tool-section">
        <div className="field-card-grid">
          <div className="field-card primary" onClick={navigateToRoadRisk}>
            <div className="field-card-content">
              <div className="field-card-title">Road Risk Assessment</div>
              <div className="field-card-description">
                Evaluate forest road risk factors using official EGBC/FPBC methodology
              </div>
            </div>
            <div className="field-card-icon">🛣️</div>
          </div>
          
          <div className="field-card secondary" onClick={navigateToHistory}>
            <div className="field-card-content">
              <div className="field-card-title">Assessment History</div>
              <div className="field-card-description">
                View, edit, and manage all your saved road risk assessments
              </div>
            </div>
            <div className="field-card-icon">📋</div>
          </div>

          {/* NEW: Export Card */}
          <div className="field-card success" onClick={() => setShowExport(!showExport)}>
            <div className="field-card-content">
              <div className="field-card-title">Export Data</div>
              <div className="field-card-description">
                Download assessments as JSON, CSV, or PDF reports
              </div>
            </div>
            <div className="field-card-icon">📤</div>
          </div>
        </div>
      </div>

      {/* Export Panel */}
      {showExport && (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          marginTop: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{marginTop: 0, color: '#2e7d32'}}>📊 Export Your Data</h3>
          <p style={{color: '#666', fontSize: '14px'}}>
            Choose a format to download your assessment data
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px',
            marginTop: '16px'
          }}>
            <button
              onClick={() => handleExport('json')}
              disabled={isExporting}
              style={{
                background: 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)',
                color: 'white',
                border: 'none',
                padding: '16px',
                borderRadius: '8px',
                cursor: isExporting ? 'not-allowed' : 'pointer',
                opacity: isExporting ? 0.6 : 1
              }}
            >
              <div style={{fontSize: '32px'}}>📄</div>
              <div style={{fontWeight: 'bold', marginTop: '8px'}}>JSON</div>
              <div style={{fontSize: '12px', opacity: 0.9}}>Complete backup</div>
            </button>

            <button
              onClick={() => handleExport('csv')}
              disabled={isExporting}
              style={{
                background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
                color: 'white',
                border: 'none',
                padding: '16px',
                borderRadius: '8px',
                cursor: isExporting ? 'not-allowed' : 'pointer',
                opacity: isExporting ? 0.6 : 1
              }}
            >
              <div style={{fontSize: '32px'}}>📊</div>
              <div style={{fontWeight: 'bold', marginTop: '8px'}}>CSV</div>
              <div style={{fontSize: '12px', opacity: 0.9}}>For Excel</div>
            </button>

            <button
              disabled={true}
              style={{
                background: 'linear-gradient(135deg, #9e9e9e 0%, #bdbdbd 100%)',
                color: 'white',
                border: 'none',
                padding: '16px',
                borderRadius: '8px',
                cursor: 'not-allowed',
                opacity: 0.6
              }}
            >
              <div style={{fontSize: '32px'}}>📑</div>
              <div style={{fontWeight: 'bold', marginTop: '8px'}}>PDF</div>
              <div style={{fontSize: '12px', opacity: 0.9}}>Coming soon</div>
            </button>
          </div>

          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: '#e8f5e9',
            borderRadius: '6px',
            fontSize: '13px',
            color: '#2e7d32'
          }}>
            💡 <strong>Tip:</strong> Export your data regularly to back up field assessments. CSV opens in Excel for quick analysis.
          </div>
        </div>
      )}
      
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
