import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  exportToJSON, 
  exportToCSV, 
  exportToGeoJSON,
  downloadJSON,
  downloadCSV,
  downloadGeoJSON
} from '../utils/dataExport';
import { getAssessmentCountDB } from '../utils/db';

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState(null);
  
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const count = await getAssessmentCountDB();
      setStats({
        inspections: count,
        riskAssessments: count,
        issues: 0,
        pendingSync: 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      setStats({
        inspections: 0,
        riskAssessments: 0,
        issues: 0,
        pendingSync: 0
      });
    }
  };

  const handleExport = async (format) => {
    setIsExporting(true);
    setExportStatus(null);
    
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      
      switch(format) {
        case 'json':
          const jsonData = await exportToJSON({ includeAll: true });
          downloadJSON(jsonData, `road-risk-export-${timestamp}.json`);
          setExportStatus({ type: 'success', message: `✅ Exported to JSON` });
          break;
          
        case 'csv':
          const csvContent = await exportToCSV();
          downloadCSV(csvContent, `road-risk-export-${timestamp}.csv`);
          setExportStatus({ type: 'success', message: '✅ Exported to CSV' });
          break;
          
        case 'geojson':
          const geoJSON = await exportToGeoJSON();
          downloadGeoJSON(geoJSON, `road-risk-export-${timestamp}.geojson`);
          setExportStatus({ type: 'success', message: `✅ Exported to GeoJSON` });
          break;
          
        default:
          throw new Error('Unknown format');
      }
    } catch (error) {
      setExportStatus({ type: 'error', message: '❌ Export failed: ' + error.message });
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <div style={{padding: '20px', maxWidth: '1000px', margin: '0 auto'}}>
      <div style={{marginBottom: '30px'}}>
        <h1 style={{color: '#2e7d32', marginBottom: '8px'}}>Dashboard</h1>
        <p style={{color: '#666'}}>Assessment overview and data export</p>
      </div>

      {stats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '30px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)',
            color: 'white',
            padding: '20px',
            borderRadius: '12px'
          }}>
            <div style={{fontSize: '14px', opacity: 0.9}}>Total Assessments</div>
            <div style={{fontSize: '32px', fontWeight: 'bold'}}>{stats.inspections || 0}</div>
          </div>
        </div>
      )}

      {exportStatus && (
        <div style={{
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '20px',
          background: exportStatus.type === 'success' ? '#e8f5e9' : '#ffebee',
          color: exportStatus.type === 'success' ? '#2e7d32' : '#c62828'
        }}>
          {exportStatus.message}
        </div>
      )}

      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h2 style={{marginTop: 0, marginBottom: '20px'}}>Quick Actions</h2>
        
        <div style={{display: 'grid', gap: '12px'}}>
          <button
            onClick={() => navigate('/road-risk')}
            style={{
              background: '#2e7d32',
              color: 'white',
              border: 'none',
              padding: '15px',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🛣️ New Assessment
          </button>
          
          <button
            onClick={() => navigate('/history')}
            style={{
              background: '#2196f3',
              color: 'white',
              border: 'none',
              padding: '15px',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            📋 View History
          </button>
        </div>
      </div>

      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{marginTop: 0, marginBottom: '20px'}}>📊 Export Data</h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px'
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
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            <div style={{fontSize: '32px'}}>📄</div>
            <div>JSON</div>
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
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            <div style={{fontSize: '32px'}}>📊</div>
            <div>CSV</div>
          </button>
          
          <button
            onClick={() => handleExport('geojson')}
            disabled={isExporting}
            style={{
              background: '#ff9800',
              color: 'white',
              border: 'none',
              padding: '20px',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            <div style={{fontSize: '32px'}}>🗺️</div>
            <div>GeoJSON</div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
