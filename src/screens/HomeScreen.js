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
    navigate('/road-risk');
  };

  const navigateToLMH = () => {
    localStorage.removeItem('currentFieldNotes');
    navigate('/lmh-risk');
  };
  
  const navigateToHistory = () => {
    navigate('/history');
  };

  const navigateToDashboard = () => {
    navigate('/dashboard');
  };

  const navigateToReferences = () => {
    navigate('/references');
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
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '12px'}}>
          <div style={{
            fontSize: '48px',
            background: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}>
            🛣️
          </div>
          <div style={{textAlign: 'left'}}>
            <h1 className="app-title" style={{margin: 0, fontSize: '32px'}}>Road Risk Assessment</h1>
            <p style={{margin: '4px 0 0 0', fontSize: '13px', color: '#666', fontWeight: '500'}}>
              MOSAIC FOREST MANAGEMENT
            </p>
          </div>
        </div>
        <p className="app-subtitle" style={{fontSize: '15px', color: '#555'}}>
          Professional assessment tool with EGBC/FPBC guidance - Supplements QuickCapture
        </p>
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
          ✅ v2.5.0 - Professional Standards Integrated
        </div>
      </div>

      {stats && stats.inspections > 0 && (
        <div style={{
          textAlign: 'center',
          margin: '20px 0',
          padding: '16px',
          background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)',
          borderRadius: '8px',
          border: '2px solid #4caf50'
        }}>
          <div style={{fontSize: '24px', fontWeight: 'bold', color: '#2e7d32'}}>
            {stats.inspections}
          </div>
          <div style={{fontSize: '12px', color: '#2e7d32', fontWeight: '500'}}>
            Assessments Completed
          </div>
        </div>
      )}
      
      <div className="tool-section">
        <h2 style={{color: '#2e7d32', marginBottom: '8px'}}>📋 Assessment Tools</h2>
        <p style={{fontSize: '14px', color: '#666', marginBottom: '16px'}}>
          Complete assessments with professional guidance, export PDFs
        </p>
        
        <div className="field-card-grid">
          <div className="field-card primary" onClick={navigateToRoadRisk}>
            <div className="field-card-content">
              <div className="field-card-title">🔬 Scorecard Method</div>
              <div className="field-card-description">
                Detailed 9-factor risk assessment
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
                Qualitative with field guidance
              </div>
            </div>
            <div className="field-card-icon" style={{fontSize: '48px'}}>⚡</div>
          </div>

          <div className="field-card" onClick={navigateToReferences} style={{
            background: 'white',
            borderTop: '4px solid #1976d2',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer'
          }}>
            <div className="field-card-content">
              <div className="field-card-title" style={{color: '#333'}}>📚 References</div>
              <div className="field-card-description" style={{color: '#666'}}>
                EGBC/FPBC professional standards
              </div>
            </div>
            <div className="field-card-icon" style={{fontSize: '48px'}}>📖</div>
          </div>
          
          <div className="field-card secondary" onClick={navigateToHistory}>
            <div className="field-card-content">
              <div className="field-card-title">Assessment History</div>
              <div className="field-card-description">
                View saved assessments & PDFs
              </div>
            </div>
            <div className="field-card-icon">📋</div>
          </div>

          <div className="field-card success" onClick={() => setShowExport(!showExport)}>
            <div className="field-card-content">
              <div className="field-card-title">📤 Export Data</div>
              <div className="field-card-description">
                Export assessment data
              </div>
            </div>
            <div className="field-card-icon" style={{fontSize: '48px'}}>
              {showExport ? '▼' : '📤'}
            </div>
          </div>

          <div className="field-card" onClick={navigateToDashboard} style={{
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            cursor: 'pointer'
          }}>
            <div className="field-card-content">
              <div className="field-card-title" style={{color: 'white'}}>📊 Dashboard</div>
              <div className="field-card-description" style={{color: 'rgba(255,255,255,0.9)'}}>
                Track activity & progress
              </div>
            </div>
            <div className="field-card-icon" style={{fontSize: '48px'}}>📈</div>
          </div>
        </div>
      </div>

      <div style={{
        background: '#e3f2fd',
        padding: '16px',
        borderRadius: '8px',
        marginTop: '20px',
        border: '2px solid #2196f3'
      }}>
        <div style={{display: 'flex', gap: '12px', alignItems: 'start'}}>
          <div style={{fontSize: '24px'}}>💡</div>
          <div>
            <div style={{fontWeight: 'bold', color: '#1976d2', marginBottom: '4px'}}>
              Professional Workflow
            </div>
            <div style={{fontSize: '14px', color: '#555', lineHeight: '1.5'}}>
              Complete detailed assessments following EGBC/FPBC standards and generate professional PDF reports. 
              Supplement with <strong>QuickCapture</strong> for GPS coordinates and field photos that upload directly to LRM.
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
          <h3 style={{marginTop: 0, color: '#2e7d32'}}>📊 Export Assessment Data</h3>

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
        <div className="app-version">v2.5.0 - Professional Standards Integrated</div>
        <div className="app-copyright">© 2025 Mosaic Forest Management</div>
      </div>
    </div>
  );
};

export default HomeScreen;
