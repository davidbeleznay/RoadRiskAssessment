// src/utils/dataExport.js
// Data export utilities for road risk assessments

import { db } from './db';

/**
 * Export assessments to JSON format
 * @param {Object} options - Export options
 * @returns {Promise<Object>} - Export data
 */
export async function exportToJSON(options = {}) {
  const {
    includeAll = true,
    startDate = null,
    endDate = null,
    riskMethodId = null
  } = options;

  try {
    let inspections = await db.inspections.toArray();
    
    // Apply filters
    if (startDate) {
      inspections = inspections.filter(i => 
        new Date(i.assessmentDate) >= new Date(startDate)
      );
    }
    
    if (endDate) {
      inspections = inspections.filter(i => 
        new Date(i.assessmentDate) <= new Date(endDate)
      );
    }
    
    if (riskMethodId) {
      inspections = inspections.filter(i => i.riskMethodId === riskMethodId);
    }

    // Get all related data
    const inspectionIds = inspections.map(i => i.id);
    
    const riskAssessments = await db.riskAssessments
      .where('inspectionId')
      .anyOf(inspectionIds)
      .toArray();
      
    const issues = await db.issues
      .where('inspectionId')
      .anyOf(inspectionIds)
      .toArray();
      
    const actionItems = await db.actionItems
      .where('inspectionId')
      .anyOf(inspectionIds)
      .toArray();

    const exportData = {
      metadata: {
        exportDate: new Date().toISOString(),
        appVersion: '2.0.0',
        totalInspections: inspections.length,
        filters: { startDate, endDate, riskMethodId }
      },
      inspections,
      riskAssessments,
      issues,
      actionItems
    };

    if (includeAll) {
      exportData.roadSegments = await db.roadSegments.toArray();
      exportData.riskMethods = await db.riskMethods.toArray();
      exportData.factorGroups = await db.factorGroups.toArray();
      exportData.factors = await db.factors.toArray();
      exportData.factorOptions = await db.factorOptions.toArray();
      exportData.riskCategories = await db.riskCategories.toArray();
    }

    return exportData;
  } catch (error) {
    console.error('Error exporting to JSON:', error);
    throw error;
  }
}

/**
 * Export assessments to CSV format (flattened)
 * @param {Object} options - Export options
 * @returns {Promise<string>} - CSV string
 */
export async function exportToCSV(options = {}) {
  try {
    const inspections = await db.inspections.toArray();
    const riskAssessments = await db.riskAssessments.toArray();
    
    // Create a map of assessments by inspection ID
    const assessmentMap = {};
    for (const assessment of riskAssessments) {
      assessmentMap[assessment.inspectionId] = assessment;
    }

    // CSV headers
    const headers = [
      'Inspection ID',
      'Assessment Date',
      'Inspector',
      'Road Segment ID',
      'Road Name',
      'Risk Method ID',
      'Hazard Score',
      'Consequence Score',
      'Total Risk Score',
      'Risk Category',
      'Latitude',
      'Longitude',
      'Sync Status',
      'Created Date'
    ];

    // Convert data to rows
    const rows = inspections.map(inspection => {
      const assessment = assessmentMap[inspection.id] || {};
      
      return [
        inspection.id,
        inspection.assessmentDate,
        inspection.inspector,
        inspection.roadSegmentId || '',
        inspection.roadName || '',
        inspection.riskMethodId || assessment.riskMethodId || '',
        assessment.hazardTotal || '',
        assessment.consequenceTotal || '',
        assessment.riskScore || '',
        assessment.riskCategory || '',
        inspection.latitude || '',
        inspection.longitude || '',
        inspection.syncStatus || 'pending',
        new Date(inspection.timestamp).toISOString()
      ];
    });

    // Build CSV string
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => {
        // Escape commas and quotes in cell content
        const cellStr = String(cell);
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
 * Download JSON export as file
 * @param {Object} data - Data to export
 * @param {string} filename - Output filename
 */
export function downloadJSON(data, filename = 'road-risk-export.json') {
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
 * @param {string} filename - Output filename
 */
export function downloadCSV(csvContent, filename = 'road-risk-export.csv') {
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
 * @returns {Promise<Object>} - GeoJSON FeatureCollection
 */
export async function exportToGeoJSON() {
  try {
    const inspections = await db.inspections
      .filter(i => i.latitude && i.longitude)
      .toArray();
    
    const riskAssessments = await db.riskAssessments.toArray();
    const assessmentMap = {};
    for (const assessment of riskAssessments) {
      assessmentMap[assessment.inspectionId] = assessment;
    }

    const features = inspections.map(inspection => {
      const assessment = assessmentMap[inspection.id] || {};
      
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [
            parseFloat(inspection.longitude),
            parseFloat(inspection.latitude)
          ]
        },
        properties: {
          inspectionId: inspection.id,
          assessmentDate: inspection.assessmentDate,
          inspector: inspection.inspector,
          roadSegmentId: inspection.roadSegmentId,
          riskMethodId: inspection.riskMethodId,
          hazardScore: assessment.hazardTotal,
          consequenceScore: assessment.consequenceTotal,
          riskScore: assessment.riskScore,
          riskCategory: assessment.riskCategory,
          syncStatus: inspection.syncStatus,
          timestamp: inspection.timestamp
        }
      };
    });

    return {
      type: 'FeatureCollection',
      features,
      metadata: {
        exportDate: new Date().toISOString(),
        count: features.length
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
 * @param {string} filename - Output filename
 */
export function downloadGeoJSON(geoJSON, filename = 'road-risk-export.geojson') {
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
