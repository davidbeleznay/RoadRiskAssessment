// src/utils/dataExport.js
// Data export utilities for road risk assessments

/**
 * Export assessments to JSON format from localStorage
 * @param {Object} options - Export options
 * @returns {Object} - Export data
 */
export function exportToJSON(options = {}) {
  try {
    // Get data from localStorage
    const historyData = localStorage.getItem('assessmentHistory');
    const inspections = historyData ? JSON.parse(historyData) : [];
    
    // Filter to road risk only
    const roadRiskInspections = inspections.filter(i => i.type === 'roadRisk');

    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        appVersion: '2.0.0',
        totalInspections: roadRiskInspections.length
      },
      inspections: roadRiskInspections
    };

    return exportData;
  } catch (error) {
    console.error('Error exporting to JSON:', error);
    throw error;
  }
}

/**
 * Export assessments to CSV format
 * @returns {string} - CSV string
 */
export function exportToCSV() {
  try {
    // Get data from localStorage
    const historyData = localStorage.getItem('assessmentHistory');
    const allInspections = historyData ? JSON.parse(historyData) : [];
    
    // Filter to road risk only
    const inspections = allInspections.filter(i => i.type === 'roadRisk');
    
    if (inspections.length === 0) {
      return 'No assessments to export';
    }

    // CSV headers
    const headers = [
      'Road Name',
      'Assessment Date',
      'Inspector/Assessor',
      'Start KM',
      'End KM',
      'Hazard Score',
      'Consequence Score',
      'Total Risk Score',
      'Risk Category',
      'Risk Level',
      'Priority',
      'Start Latitude',
      'Start Longitude',
      'End Latitude',
      'End Longitude',
      'Weather Conditions',
      'Hazard Notes',
      'Consequence Notes',
      'General Comments',
      'Recommendations',
      'Created Date'
    ];

    // Convert data to rows
    const rows = inspections.map(inspection => {
      const data = inspection.data || {};
      const basicInfo = data.basicInfo || {};
      const riskAssessment = data.riskAssessment || {};
      const fieldNotes = data.fieldNotes || {};
      
      // Calculate scores
      const hazardScore = Object.values(data.hazardFactors || {}).reduce((sum, val) => sum + (val || 0), 0);
      const consequenceScore = Object.values(data.consequenceFactors || {}).reduce((sum, val) => sum + (val || 0), 0);
      const totalRiskScore = data.riskScore || (hazardScore * consequenceScore);
      
      return [
        basicInfo.roadName || 'Untitled',
        basicInfo.assessmentDate || '',
        basicInfo.assessor || data.assessor || '',
        basicInfo.startKm || '',
        basicInfo.endKm || '',
        hazardScore,
        consequenceScore,
        totalRiskScore,
        data.riskCategory || riskAssessment.riskLevel || '',
        riskAssessment.finalRisk || riskAssessment.riskLevel || '',
        riskAssessment.priority || data.recommendation || '',
        basicInfo.startGPS?.latitude || '',
        basicInfo.startGPS?.longitude || '',
        basicInfo.endGPS?.latitude || '',
        basicInfo.endGPS?.longitude || '',
        basicInfo.weatherConditions || '',
        fieldNotes.hazardObservations || '',
        fieldNotes.consequenceObservations || '',
        fieldNotes.generalComments || '',
        fieldNotes.recommendations || '',
        inspection.dateCreated || inspection.completedAt || ''
      ];
    });

    // Build CSV string with proper escaping
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => {
        const cellStr = String(cell || '');
        // Escape commas, quotes, and newlines
        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
          return `"${cellStr.replace(/"/g, '""')}"`;
        }
        return cellStr;
      }).join(','))
    ].join('\n');

    return csvContent;
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    throw error;
  }
}

/**
 * Download JSON export as file with road name
 * @param {Object} data - Data to export
 * @param {string} roadName - Road name for filename
 */
export function downloadJSON(data, roadName = null) {
  const timestamp = new Date().toISOString().split('T')[0];
  const safeName = roadName ? roadName.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'road-risk';
  const filename = `${safeName}_export_${timestamp}.json`;
  
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Download CSV export as file
 * @param {string} csvContent - CSV string
 */
export function downloadCSV(csvContent) {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `road_risk_assessments_${timestamp}.csv`;
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export to GeoJSON format (for GIS integration)
 * @returns {Object} - GeoJSON FeatureCollection
 */
export function exportToGeoJSON() {
  try {
    // Get data from localStorage
    const historyData = localStorage.getItem('assessmentHistory');
    const allInspections = historyData ? JSON.parse(historyData) : [];
    
    // Filter to road risk with GPS coordinates
    const inspections = allInspections.filter(i => 
      i.type === 'roadRisk' && 
      i.data?.basicInfo?.startGPS?.latitude
    );

    const features = inspections.map(inspection => {
      const data = inspection.data || {};
      const basicInfo = data.basicInfo || {};
      const riskAssessment = data.riskAssessment || {};
      
      const hazardScore = Object.values(data.hazardFactors || {}).reduce((sum, val) => sum + (val || 0), 0);
      const consequenceScore = Object.values(data.consequenceFactors || {}).reduce((sum, val) => sum + (val || 0), 0);
      
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [
            parseFloat(basicInfo.startGPS.longitude),
            parseFloat(basicInfo.startGPS.latitude)
          ]
        },
        properties: {
          inspectionId: inspection.id,
          roadName: basicInfo.roadName || 'Untitled',
          assessmentDate: basicInfo.assessmentDate,
          inspector: basicInfo.assessor,
          startKm: basicInfo.startKm,
          endKm: basicInfo.endKm,
          hazardScore: hazardScore,
          consequenceScore: consequenceScore,
          riskScore: data.riskScore || (hazardScore * consequenceScore),
          riskCategory: data.riskCategory || riskAssessment.riskLevel,
          priority: riskAssessment.priority,
          weatherConditions: basicInfo.weatherConditions,
          timestamp: inspection.dateCreated
        }
      };
    });

    return {
      type: 'FeatureCollection',
      features,
      metadata: {
        exportDate: new Date().toISOString(),
        count: features.length,
        appVersion: '2.0.0'
      }
    };
  } catch (error) {
    console.error('Error exporting to GeoJSON:', error);
    throw error;
  }
}

/**
 * Download GeoJSON export as file
 * @param {Object} geoJSON - GeoJSON data
 */
export function downloadGeoJSON(geoJSON) {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `road_risk_gis_${timestamp}.geojson`;
  
  const jsonString = JSON.stringify(geoJSON, null, 2);
  const blob = new Blob([jsonString], { type: 'application/geo+json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
