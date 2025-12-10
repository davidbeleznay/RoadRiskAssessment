import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { exportToJSON, exportToCSV, downloadJSON, downloadCSV } from '../utils/dataExport';
import { getAssessmentCountDB } from '../utils/db';

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
      const count = await getAssessmentCountDB();
      setStats({ inspections: count });
    } catch (error) {
      console.error('Error loading stats:', error);
      setStats({ inspections: 0 });
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

  const navigateToDashboard = () => {
    navigate('/dashboard');
  };

  const handleExport = async (format) => {
    setIsExporting(true);
    
    try {
      if (format === 'json') {
        const data = exportToJSON();
        downloadJSON(data);
        alert('✅ Exported to JSON');
      } else if (format === 'csv') {
        const csvContent = exportToCSV();
        downloadCSV(csvContent);
        alert('✅ Exported to CSV!');
      }
      
      await loadStats();
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
          background: '#2e7d32',
          color: 'white',
          padding: '12px',
          borderRadius: '6px',
          marginTop: '10px',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '15px'
        }}>
          ✅ v2.4.0 - Dashboard + View/Edit + Search/Filter
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
        <h2 style={{color: '#2e7d32', marginBottom: '16px'}}>📋 Assessment Tools</h2>
        
        <div className="field-card-grid">
          {/* Dashboard - NEW! */}
          <div className="field-card" onClick={navigateToDashboard} style={{
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            cursor: 'pointer'
          }}>
            <div className="field-card-content">
              <div className="field-card-title" style={{color: 'white'}}>📊 Dashboard</div>
              <div className="field-card-description" style={{color: 'rgba(255,255,255,0.9)'}}>
                KPIs, charts, search & filter
              </div>
            </div>
            <div className="field-card-icon" style={{fontSize: '48px'}}>📈</div>
          </div>

          <div className="field-card primary" onClick={navigateToRoadRisk}>
            <div className="field-card-content">
              <div className="field-card-title">🔬 Scorecard Method</div>
              <div className="field-card-description">
                Detailed 9-factor assessment
              </div>
            </div>
            <div className="field-card-icon" style={{fontSize: '48px'}}>📊</div>
          </div>

          <div className="field-card" onClick={navigateToLMH} style={{
            background: 'white',
            borderTop: '4px solid #f44336',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer'
          }}>
            <div className="field-card-content">
              <div className="field-card-title" style={{color: '#333'}}>⚖️ LMH Method</div>
              <div className="field-card-description" style={{color: '#666'}}>
                Simplified approach with photos
              </div>
            </div>
            <div className="field-card-icon" style={{fontSize: '48px'}}>⚡</div>
          </div>
          
          <div className="field-card secondary" onClick={navigateToHistory}>
            <div className="field-card-content">
              <div className="field-card-title">Assessment History</div>
              <div className="field-card-description">
                View all saved assessments
              </div>
            </div>
            <div className="field-card-icon">📋</div>
          </div>

          <div className="field-card success" onClick={() => setShowExport(!showExport)}>
            <div className="field-card-content">
              <div className="field-card-title">📤 Export Data</div>
              <div className="field-card-description">
                JSON, CSV, or PDF
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
          <h3 style={{marginTop: 0, color: '#2e7d32'}}>📊 Export Data</h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px'
          }}>
            <button
              onClick={() => handleExport('json')}
              disabled={isExporting}
              style={{
                background: '#2196f3',
                color: 'white',
                border: 'none',
                padding: '20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              📄 JSON
            </button>

            <button
              onClick={() => handleExport('csv')}
              disabled={isExporting}
              style={{
                background: '#4caf50',
                color: 'white',
                border: 'none',
                padding: '20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              📊 CSV
            </button>
          </div>
        </div>
      )}
      
      <div className="app-footer">
        <div className="app-version">v2.4.0 - Dashboard + View/Edit + Filters</div>
        <div className="app-copyright">© 2025 Mosaic</div>
      </div>
    </div>
  );
};

export default HomeScreen;
