import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { exportToJSON, exportToCSV, downloadJSON, downloadCSV } from '../utils/dataExport';

const HomeScreen = () => {
  const navigate = useNavigate();
  const [showExport, setShowExport] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    try {
      const historyData = localStorage.getItem('assessmentHistory');
      const history = historyData ? JSON.parse(historyData) : [];
      const roadRiskAssessments = history.filter(a => a.type === 'roadRisk');
      
      setStats({
        inspections: roadRiskAssessments.length
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };
  
  const navigateToRoadRisk = () => {
    localStorage.removeItem('currentFieldNotes');
    localStorage.removeItem('currentPhotos');
    navigate('/road-risk');
  };

  const navigateToLMH = () => {
    localStorage.removeItem('currentFieldNotes');
    localStorage.removeItem('currentPhotos');
    navigate('/lmh-risk');
  };
  
  const navigateToHistory = () => {
    navigate('/history');
  };

  const handleExport = async (format) => {
    setIsExporting(true);
    
    try {
      if (format === 'json') {
        const data = exportToJSON({ includeAll: true });
        downloadJSON(data);
        alert(`✅ Exported ${data.inspections?.length || 0} assessments to JSON`);
      } else if (format === 'csv') {
        const csvContent = exportToCSV();
        downloadCSV(csvContent);
        alert('✅ Exported to CSV - open in Excel!');
      }
      
      loadStats();
    } catch (error) {
      alert('❌ Export failed: ' + error.message);
    } finally {
      setIsExporting(false);
      setShowExport(false);
    }
  };
  
  return (
    <div className="home-container">
      <div className="app-header">
        <h1 className="app-title">Road Risk Assessment</h1>
        <p className="app-subtitle">Professional risk evaluation for forest roads</p>
        <div style={{
          background: '#4caf50',
          color: 'white',
          padding: '10px',
          borderRadius: '6px',
          marginTop: '10px',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          ✅ v2.2.0 - DUAL METHODS + PHOTOS + PDF - Dec 9, 2024
        </div>
      </div>

      {stats && stats.inspections > 0 && (
        <div style={{
          textAlign: 'center',
          margin: '20px 0',
          padding: '16px',
          background: '#f5f5f5',
          borderRadius: '8px'
        }}>
          <div style={{fontSize: '24px', fontWeight: 'bold', color: '#2e7d32'}}>
            {stats.inspections}
          </div>
          <div style={{fontSize: '12px', color: '#666'}}>Saved Assessments</div>
        </div>
      )}
      
      <div className="tool-section">
        <h2 style={{color: '#2e7d32', marginBottom: '16px'}}>📋 Choose Assessment Method</h2>
        <p style={{color: '#666', marginBottom: '20px', fontSize: '14px'}}>
          Two defensible pathways for professional forest road risk assessment
        </p>

        <div className="field-card-grid">
          <div className="field-card primary" onClick={navigateToRoadRisk}>
            <div className="field-card-content">
              <div className="field-card-title">🔬 Scorecard Method</div>
              <div className="field-card-description">
                Detailed 9-factor quantitative assessment (5 hazard + 4 consequence factors)
              </div>
            </div>
            <div className="field-card-icon" style={{fontSize: '48px'}}>📊</div>
          </div>

          <div className="field-card primary" onClick={navigateToLMH} style={{
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)'
          }}>
            <div className="field-card-content">
              <div className="field-card-title" style={{color: 'white'}}>⚖️ LMH Method</div>
              <div className="field-card-description" style={{color: 'rgba(255, 255, 255, 0.95)'}}>
                Simplified qualitative approach with photos (Likelihood × Consequence)
              </div>
            </div>
            <div className="field-card-icon" style={{fontSize: '48px'}}>⚡</div>
          </div>
          
          <div className="field-card secondary" onClick={navigateToHistory}>
            <div className="field-card-content">
              <div className="field-card-title">Assessment History</div>
              <div className="field-card-description">
                View and export all saved assessments (both methods)
              </div>
            </div>
            <div className="field-card-icon">📋</div>
          </div>

          <div className="field-card success" onClick={() => setShowExport(!showExport)}>
            <div className="field-card-content">
              <div className="field-card-title">📤 Export Data</div>
              <div className="field-card-description">
                Download as JSON, CSV, or PDF with photos
              </div>
            </div>
            <div className="field-card-icon" style={{fontSize: '48px'}}>
              {showExport ? '▼' : '📤'}
            </div>
          </div>
        </div>
      </div>

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

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px'
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
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              <div style={{fontSize: '40px'}}>📄</div>
              <div>JSON Export</div>
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
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              <div style={{fontSize: '40px'}}>📊</div>
              <div>CSV Export</div>
            </button>
          </div>
          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: 'white',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#666'
          }}>
            <strong style={{color: '#2e7d32'}}>💡 Tip:</strong> View individual assessments in History to export as PDF with photos!
          </div>
        </div>
      )}
      
      <div className="app-footer">
        <div className="app-version">Road Risk Assessment v2.2.0 - Dual Methods + Photos + PDF</div>
        <div className="app-copyright">© 2025 Mosaic Forest Management</div>
      </div>
    </div>
  );
};

export default HomeScreen;
