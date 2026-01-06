import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { exportToCSV, downloadCSV } from '../utils/dataExport';
import { getAssessmentCountDB } from '../utils/db';

const HomeScreen = () => {
  const navigate = useNavigate();
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
  
  const navigateToHistory = () => navigate('/history');
  const navigateToDashboard = () => navigate('/dashboard');
  const navigateToReferences = () => navigate('/references');

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const csvContent = await exportToCSV();
      downloadCSV(csvContent);
      alert('✅ Assessment data exported to CSV!\n\nFile includes: road info, segments, points, observations, and inspection reports.');
    } catch (error) {
      alert('❌ Export failed: ' + error.message);
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <div className="home-container">
      <div className="app-header">
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '12px', flexWrap: 'wrap'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 auto'}}>
            <div style={{fontSize: '40px', lineHeight: '1'}}>🛣️</div>
            <div style={{textAlign: 'left'}}>
              <h1 style={{margin: 0, fontSize: '24px', lineHeight: '1.2', color: '#2e7d32'}}>
                Road Risk Assessment
              </h1>
              <p style={{margin: '2px 0 0 0', fontSize: '11px', color: '#666', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px'}}>
                Mosaic Forest Management
              </p>
            </div>
          </div>
          <div style={{
            background: '#2e7d32',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            fontWeight: 'bold',
            fontSize: '13px',
            whiteSpace: 'nowrap'
          }}>
            ✅ v2.7.0
          </div>
        </div>
        <p style={{fontSize: '13px', color: '#555', lineHeight: '1.4', margin: '8px 0 0 0'}}>
          EGBC/FPBC inspection-ready with Section 11 compliance - Supplements QuickCapture
        </p>
      </div>

      {stats && stats.inspections > 0 && (
        <div style={{
          textAlign: 'center', margin: '20px 0', padding: '16px',
          background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)',
          borderRadius: '8px', border: '2px solid #4caf50'
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
        <h2 style={{color: '#2e7d32', marginBottom: '8px'}}>📋 Assessment Methods</h2>
        <p style={{fontSize: '14px', color: '#666', marginBottom: '16px'}}>
          Choose assessment method - LMH recommended for field use
        </p>
        
        <div className="field-card-grid">
          <div className="field-card primary" onClick={navigateToLMH} style={{
            background: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
            cursor: 'pointer'
          }}>
            <div className="field-card-content">
              <div className="field-card-title" style={{color: 'white', fontSize: '18px'}}>⚖️ LMH Method</div>
              <div className="field-card-description" style={{color: 'rgba(255,255,255,0.95)', fontSize: '14px'}}>
                Primary field assessment - Multi-segment capable
              </div>
            </div>
            <div className="field-card-icon" style={{fontSize: '56px'}}>⚡</div>
          </div>

          <div className="field-card" onClick={navigateToRoadRisk} style={{
            background: 'white',
            borderTop: '4px solid #1976d2',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer'
          }}>
            <div className="field-card-content">
              <div className="field-card-title" style={{color: '#333'}}>🔬 Scorecard Method</div>
              <div className="field-card-description" style={{color: '#666'}}>
                Detailed 9-factor comparison assessment
              </div>
            </div>
            <div className="field-card-icon" style={{fontSize: '48px'}}>📊</div>
          </div>

          <div className="field-card" onClick={navigateToReferences} style={{
            background: 'white', borderTop: '4px solid #9c27b0',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', cursor: 'pointer'
          }}>
            <div className="field-card-content">
              <div className="field-card-title" style={{color: '#333'}}>📚 References</div>
              <div className="field-card-description" style={{color: '#666'}}>
                LMH 56/57/61, EGBC/FPBC, inspection standards
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

          <div 
            className="field-card success" 
            onClick={handleExportCSV}
            style={{cursor: isExporting ? 'not-allowed' : 'pointer', opacity: isExporting ? 0.6 : 1}}
          >
            <div className="field-card-content">
              <div className="field-card-title">
                {isExporting ? '⏳ Exporting...' : '📊 Export CSV'}
              </div>
              <div className="field-card-description">
                Export all assessments to spreadsheet
              </div>
            </div>
            <div className="field-card-icon" style={{fontSize: '48px'}}>
              {isExporting ? '⏳' : '📊'}
            </div>
          </div>

          <div className="field-card" onClick={navigateToDashboard} style={{
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', cursor: 'pointer'
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
        background: '#e8f5e9', padding: '16px', borderRadius: '8px',
        marginTop: '20px', border: '2px solid #4caf50'
      }}>
        <div style={{display: 'flex', gap: '12px', alignItems: 'start'}}>
          <div style={{fontSize: '24px'}}>⚖️</div>
          <div>
            <div style={{fontWeight: 'bold', color: '#2e7d32', marginBottom: '4px'}}>
              LMH Method - Primary Assessment Tool
            </div>
            <div style={{fontSize: '14px', color: '#555', lineHeight: '1.5'}}>
              Based on LMH 56 (BC Ministry of Forests). Assess entire road or identify risk segments. 
              Includes structured QuickCapture integration for GPS and field photos. 
              Use <strong>Scorecard</strong> for detailed comparison when needed.
            </div>
          </div>
        </div>
      </div>
      
      <div className="app-footer">
        <div className="app-version">v2.7.0 - EGBC Inspection Reports + Section 11 Compliance</div>
        <div className="app-copyright">© 2025 Mosaic Forest Management</div>
      </div>
    </div>
  );
};

export default HomeScreen;
