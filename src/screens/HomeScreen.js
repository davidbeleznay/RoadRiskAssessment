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
        {/* DEPLOYMENT TEST BANNER */}
        <div style={{
          background: '#4caf50',
          color: 'white',
          padding: '10px',
          borderRadius: '6px',
          marginTop: '10px',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          ✅ v2.0.0 - UPDATED WITH EXPORT & NOTES - Dec 9, 2024
        </div>
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

          {/* Export Card with Visual Indicator */}
          <div className="field-card success" onClick={() => setShowExport(!showExport)} style={{
            border: showExport ? '3px solid #4caf50' : undefined,
            transform: showExport ? 'scale(1.02)' : undefined
          }}>
            <div className="field-card-content">
              <div className="field-card-title">📤 Export Data</div>
              <div className="field-card-description">
                Download assessments as JSON or CSV files
              </div>
            </div>
            <div className="field-card-icon" style={{fontSize: '48px'}}>
              {showExport ? '▼' : '📤'}
            </div>
          </div>
        </div>
      </div>

      {/* Export Panel - NOW VERY VISIBLE */}
      {showExport && (
        <div style={{
          background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)',
          borderRadius: '12px',
          padding: '24px',
          marginTop: '20px',
          boxShadow: '0 4px 16px rgba(76, 175, 80, 0.3)',
          border: '3px solid #4caf50'
        }}>
          <h3 style={{marginTop: 0, color: '#2e7d32', fontSize: '24px'}}>
            📊 Export Your Assessment Data
          </h3>
          <p style={{color: '#666', fontSize: '14px', marginBottom: '20px'}}>
            Download your data for backup, analysis in Excel, or import to other systems
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            marginBottom: '16px'
          }}>
            <button
              onClick={() => handleExport('json')}
              disabled={isExporting}
              style={{
                background: 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)',
                color: 'white',
                border: 'none',
                padding: '20px',
                borderRadius: '12px',
                cursor: isExporting ? 'not-allowed' : 'pointer',
                opacity: isExporting ? 0.6 : 1,
                fontSize: '16px',
                fontWeight: 'bold',
                boxShadow: '0 4px 8px rgba(33, 150, 243, 0.3)',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => !isExporting && (e.target.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <div style={{fontSize: '40px', marginBottom: '8px'}}>📄</div>
              <div>JSON Export</div>
              <div style={{fontSize: '11px', opacity: 0.9, marginTop: '4px'}}>Complete backup</div>
            </button>

            <button
              onClick={() => handleExport('csv')}
              disabled={isExporting}
              style={{
                background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
                color: 'white',
                border: 'none',
                padding: '20px',
                borderRadius: '12px',
                cursor: isExporting ? 'not-allowed' : 'pointer',
                opacity: isExporting ? 0.6 : 1,
                fontSize: '16px',
                fontWeight: 'bold',
                boxShadow: '0 4px 8px rgba(76, 175, 80, 0.3)',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => !isExporting && (e.target.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              <div style={{fontSize: '40px', marginBottom: '8px'}}>📊</div>
              <div>CSV Export</div>
              <div style={{fontSize: '11px', opacity: 0.9, marginTop: '4px'}}>For Excel</div>
            </button>

            <button
              disabled={true}
              style={{
                background: 'linear-gradient(135deg, #9e9e9e 0%, #bdbdbd 100%)',
                color: 'white',
                border: 'none',
                padding: '20px',
                borderRadius: '12px',
                cursor: 'not-allowed',
                opacity: 0.5,
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              <div style={{fontSize: '40px', marginBottom: '8px'}}>📑</div>
              <div>PDF Export</div>
              <div style={{fontSize: '11px', opacity: 0.9, marginTop: '4px'}}>Coming soon</div>
            </button>
          </div>

          <div style={{
            padding: '12px',
            background: 'white',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#666',
            border: '2px solid #4caf50'
          }}>
            <strong style={{color: '#2e7d32'}}>💡 How to use:</strong>
            <ul style={{margin: '8px 0 0 0', paddingLeft: '20px'}}>
              <li><strong>JSON:</strong> Complete data - all assessments and settings</li>
              <li><strong>CSV:</strong> Simplified format - opens in Excel</li>
              <li><strong>PDF:</strong> Formatted reports with photos (coming next!)</li>
            </ul>
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
        <div className="app-version">Road Risk Assessment v2.0.0 - Updated Dec 9</div>
        <div className="app-copyright">© 2025 Mosaic Forest Management</div>
      </div>
    </div>
  );
};

export default HomeScreen;
