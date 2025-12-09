// src/components/DataExportPanel.jsx
// Data export panel for downloading assessment data

import React, { useState } from 'react';
import { 
  exportToJSON, 
  exportToCSV, 
  exportToGeoJSON,
  downloadJSON,
  downloadCSV,
  downloadGeoJSON
} from '../utils/dataExport';
import { getDatabaseStats } from '../utils/db';
import './DataExportPanel.css';

export function DataExportPanel() {
  const [isExporting, setIsExporting] = useState(false);
  const [stats, setStats] = useState(null);
  const [exportStatus, setExportStatus] = useState(null);

  // Load stats on component mount
  React.useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const dbStats = await getDatabaseStats();
    setStats(dbStats);
  };

  const handleExportJSON = async () => {
    setIsExporting(true);
    setExportStatus(null);
    
    try {
      const data = await exportToJSON({ includeAll: true });
      const filename = `road-risk-export-${new Date().toISOString().split('T')[0]}.json`;
      downloadJSON(data, filename);
      setExportStatus({ type: 'success', message: `Exported ${data.inspections.length} inspections to JSON` });
    } catch (error) {
      setExportStatus({ type: 'error', message: 'Export failed: ' + error.message });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    setExportStatus(null);
    
    try {
      const csvContent = await exportToCSV();
      const filename = `road-risk-export-${new Date().toISOString().split('T')[0]}.csv`;
      downloadCSV(csvContent, filename);
      setExportStatus({ type: 'success', message: 'Exported to CSV successfully' });
    } catch (error) {
      setExportStatus({ type: 'error', message: 'Export failed: ' + error.message });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportGeoJSON = async () => {
    setIsExporting(true);
    setExportStatus(null);
    
    try {
      const geoJSON = await exportToGeoJSON();
      const filename = `road-risk-export-${new Date().toISOString().split('T')[0]}.geojson`;
      downloadGeoJSON(geoJSON, filename);
      setExportStatus({ 
        type: 'success', 
        message: `Exported ${geoJSON.features.length} inspections with GPS to GeoJSON` 
      });
    } catch (error) {
      setExportStatus({ type: 'error', message: 'Export failed: ' + error.message });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="data-export-panel">
      <div className="panel-header">
        <h2>📊 Data Export</h2>
        <p>Download your assessment data for backup or integration with other systems</p>
      </div>

      {stats && (
        <div className="export-stats">
          <div className="stat-item">
            <span className="stat-label">Total Inspections:</span>
            <span className="stat-value">{stats.inspections}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Risk Assessments:</span>
            <span className="stat-value">{stats.riskAssessments}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Issues Noted:</span>
            <span className="stat-value">{stats.issues}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Pending Sync:</span>
            <span className="stat-value">{stats.pendingSync}</span>
          </div>
        </div>
      )}

      <div className="export-options">
        <div className="export-card">
          <div className="export-icon">📄</div>
          <h3>JSON Export</h3>
          <p>Complete data export including all inspections, assessments, and method definitions</p>
          <ul className="use-cases">
            <li>Complete backup of all data</li>
            <li>Transfer to another database</li>
            <li>Archive for long-term storage</li>
          </ul>
          <button 
            onClick={handleExportJSON} 
            disabled={isExporting}
            className="export-button primary"
          >
            {isExporting ? 'Exporting...' : 'Export JSON'}
          </button>
        </div>

        <div className="export-card">
          <div className="export-icon">📊</div>
          <h3>CSV Export</h3>
          <p>Simplified spreadsheet format for analysis and reporting</p>
          <ul className="use-cases">
            <li>Open in Excel or Google Sheets</li>
            <li>Quick data analysis</li>
            <li>Import to other systems</li>
          </ul>
          <button 
            onClick={handleExportCSV} 
            disabled={isExporting}
            className="export-button secondary"
          >
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>

        <div className="export-card">
          <div className="export-icon">🗺️</div>
          <h3>GeoJSON Export</h3>
          <p>Geographic data format for GIS integration and mapping</p>
          <ul className="use-cases">
            <li>Import to ArcGIS</li>
            <li>View in QGIS or web maps</li>
            <li>Spatial analysis</li>
          </ul>
          <button 
            onClick={handleExportGeoJSON} 
            disabled={isExporting}
            className="export-button success"
          >
            {isExporting ? 'Exporting...' : 'Export GeoJSON'}
          </button>
        </div>
      </div>

      {exportStatus && (
        <div className={`export-status ${exportStatus.type}`}>
          {exportStatus.type === 'success' ? '✅' : '❌'} {exportStatus.message}
        </div>
      )}

      <div className="export-notes">
        <h4>📝 Export Notes</h4>
        <ul>
          <li><strong>JSON:</strong> Complete data including method definitions - best for backup and transfer</li>
          <li><strong>CSV:</strong> Flattened format - only inspection summaries, great for Excel analysis</li>
          <li><strong>GeoJSON:</strong> Only includes inspections with GPS coordinates - ready for ArcGIS import</li>
          <li>All exports use data from your local device (offline-friendly)</li>
          <li>For synced data from all users, export from the central database instead</li>
        </ul>
      </div>
    </div>
  );
}

export default DataExportPanel;
