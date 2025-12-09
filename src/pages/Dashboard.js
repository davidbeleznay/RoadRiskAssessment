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
import { getDatabaseStats } from '../utils/db';

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState(null);
  
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const dbStats = await getDatabaseStats();
    setStats(dbStats);
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
          setExportStatus({ type: 'success', message: `✅ Exported ${jsonData.inspections?.length || 0} inspections to JSON` });
          break;
          
        case 'csv':
          const csvContent = await exportToCSV();
          downloadCSV(csvContent, `road-risk-export-${timestamp}.csv`);
          setExportStatus({ type: 'success', message: '✅ Exported to CSV successfully' });
          break;
          
        case 'geojson':
          const geoJSON = await exportToGeoJSON();
          downloadGeoJSON(geoJSON, `road-risk-export-${timestamp}.geojson`);
          setExportStatus({ type: 'success', message: `✅ Exported ${geoJSON.features?.length || 0} inspections to GeoJSON` });
          break;
          
        default:
          throw new Error('Unknown export format');
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
        <h1 style={{color: '#2e7d32', marginBottom: '8px'}}>Road Risk Assessment Dashboard</h1>
        <p style={{color: '#666'}}>Overview of your assessment data and quick actions</p>
      </div>

      {/* Statistics Section */}
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
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{fontSize: '14px', opacity: 0.9, marginBottom: '8px'}}>Total Inspections</div>
            <div style={{fontSize: '32px', fontWeight: 'bold'}}>{stats.inspections || 0}</div>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
            color: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{fontSize: '14px', opacity: 0.9, marginBottom: '8px'}}>Risk Assessments</div>
            <div style={{fontSize: '32px', fontWeight: 'bold'}}>{stats.riskAssessments || 0}</div>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
            color: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{fontSize: '14px', opacity: 0.9, marginBottom: '8px'}}>Issues Noted</div>
            <div style={{fontSize: '32px', fontWeight: 'bold'}}>{stats.issues || 0}</div>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #f44336 0%, #ef5350 100%)',
            color: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{fontSize: '14px', opacity: 0.9, marginBottom: '8px'}}>Pending Sync</div>
            <div style={{fontSize: '32px', fontWeight: 'bold'}}>{stats.pendingSync || 0}</div>
          </div>
        </div>
      )}

      {/* Export Status */}
      {exportStatus && (
        <div style={{
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '20px',
          background: exportStatus.type === 'success' ? '#e8f5e9' : '#ffebee',
          color: exportStatus.type === 'success' ? '#2e7d32' : '#c62828',
          borderLeft: exportStatus.type === 'success' ? '4px solid #4caf50' : '4px solid #f44336'
        }}>
          {exportStatus.message}
        </div>
      )}

      {/* Quick Actions */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h2 style={{marginTop: 0, marginBottom: '20px', fontSize: '20px'}}>Quick Actions</h2>
        
        <div style={{display: 'grid', gap: '12px'}}>
          <button
            onClick={() => navigate('/road-risk')}
            style={{
              background: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
              color: 'white',
              border: 'none',
              padding: '15px 20px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span>🛣️</span>
            <span>New Road Risk Assessment</span>
          </button>
          
          <button
            onClick={() => navigate('/history')}
            style={{
              background: 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)',
              color: 'white',
              border: 'none',
              padding: '15px 20px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span>📋</span>
            <span>View Assessment History</span>
          </button>
        </div>
      </div>

      {/* Data Export Section */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{marginTop: 0, marginBottom: '12px', fontSize: '20px'}}>📊 Export Data</h2>
        <p style={{color: '#666', marginBottom: '20px', fontSize: '14px'}}>
          Download your assessment data for backup or integration with other systems
        </p>
        
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
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: isExporting ? 'not-allowed' : 'pointer',
              opacity: isExporting ? 0.6 : 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span style={{fontSize: '24px'}}>📄</span>
            <span>{isExporting ? 'Exporting...' : 'JSON'}</span>
            <span style={{fontSize: '11px', opacity: 0.9}}>Complete backup</span>
          </button>
          
          <button
            onClick={() => handleExport('csv')}
            disabled={isExporting}
            style={{
              background: '#4caf50',
              color: 'white',
              border: 'none',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: isExporting ? 'not-allowed' : 'pointer',
              opacity: isExporting ? 0.6 : 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span style={{fontSize: '24px'}}>📊</span>
            <span>{isExporting ? 'Exporting...' : 'CSV'}</span>
            <span style={{fontSize: '11px', opacity: 0.9}}>Excel format</span>
          </button>
          
          <button
            onClick={() => handleExport('geojson')}
            disabled={isExporting}
            style={{
              background: '#ff9800',
              color: 'white',
              border: 'none',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: isExporting ? 'not-allowed' : 'pointer',
              opacity: isExporting ? 0.6 : 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span style={{fontSize: '24px'}}>🗺️</span>
            <span>{isExporting ? 'Exporting...' : 'GeoJSON'}</span>
            <span style={{fontSize: '11px', opacity: 0.9}}>For ArcGIS</span>
          </button>
        </div>
        
        <div style={{
          marginTop: '16px',
          padding: '12px',
          background: '#f5f5f5',
          borderRadius: '8px',
          fontSize: '13px',
          color: '#666'
        }}>
          <strong style={{color: '#333'}}>ℹ️ Export Notes:</strong>
          <ul style={{margin: '8px 0 0 0', paddingLeft: '20px'}}>
            <li><strong>JSON:</strong> Complete data including all assessments and configurations</li>
            <li><strong>CSV:</strong> Simplified format - opens in Excel for quick analysis</li>
            <li><strong>GeoJSON:</strong> Geographic format - import directly to ArcGIS or QGIS</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
