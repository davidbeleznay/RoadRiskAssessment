// src/utils/dataExport.js
// Enhanced CSV export with full inspection details from IndexedDB

import { loadAssessmentsDB } from './db';

/**
 * Export all assessments to comprehensive CSV format
 * Includes road info, risk assessment, segments, QuickCapture points, observations, and inspection reports
 */
export async function exportToCSV() {
  try {
    // Load from IndexedDB instead of localStorage
    const assessments = await loadAssessmentsDB();
    
    if (assessments.length === 0) {
      throw new Error('No assessments found to export');
    }

    // CSV with comprehensive headers
    const headers = [
      'Road Name',
      'Assessment Date',
      'Assessor',
      'Start KM',
      'End KM',
      'Length (km)',
      'Method',
      'Weather',
      'Risk Level',
      'Risk Class',
      'Likelihood',
      'Consequence',
      'Segments',
      'Segment Details',
      'QuickCapture Lines',
      'QuickCapture Points',
      'Point Descriptions',
      'Observations',
      'Hazard Notes',
      'Consequence Notes',
      'General Comments',
      'Recommendations',
      'Priority Actions',
      'Specialist Required',
      'Specialist Notes',
      'Inspection Frequency',
      'Next Inspection Date',
      'Inspector Designation',
      'Created Date'
    ];

    // Convert each assessment to CSV row
    const rows = assessments.map(assessment => {
      const data = assessment.data || {};
      const basicInfo = data.basicInfo || {};
      const riskAssessment = data.riskAssessment || {};
      const fieldNotes = data.fieldNotes || {};
      const inspectionReport = data.inspectionReport || {};
      const useSegments = data.useSegments || false;
      
      // Calculate length
      const length = basicInfo.endKm && basicInfo.startKm ? 
        (parseFloat(basicInfo.endKm) - parseFloat(basicInfo.startKm)).toFixed(1) : '';
      
      // Segment summary
      let segmentCount = '';
      let segmentDetails = '';
      if (useSegments && data.segments) {
        segmentCount = data.segments.length;
        segmentDetails = data.segments.map((seg, idx) => 
          `Seg${idx+1}: KM${seg.startKm}-${seg.endKm} ${seg.likelihood}×${seg.consequence}`
        ).join('; ');
      }
      
      // QuickCapture Lines
      let qcLines = '';
      if (useSegments && data.segments) {
        qcLines = data.segments
          .filter(s => s.quickCapture?.lineType)
          .map((s, idx) => `Seg${idx+1}: ${s.quickCapture.lineType}`)
          .join('; ');
      } else if (data.quickCapture?.lineType) {
        qcLines = data.quickCapture.lineType;
      }
      
      // QuickCapture Points
      let qcPoints = '';
      let pointDescriptions = '';
      if (useSegments && data.segments) {
        const allPoints = [];
        const allDescs = [];
        data.segments.forEach((seg, idx) => {
          if (seg.quickCapture?.points) {
            seg.quickCapture.points.forEach(pt => {
              allPoints.push(`KM${pt.km}: ${pt.featureType}`);
              if (pt.description) {
                allDescs.push(`KM${pt.km}: ${pt.description}`);
              }
            });
          }
        });
        qcPoints = allPoints.join('; ');
        pointDescriptions = allDescs.join('; ');
      } else if (data.quickCapture?.points) {
        qcPoints = data.quickCapture.points
          .map(pt => `KM${pt.km}: ${pt.featureType}`)
          .join('; ');
        pointDescriptions = data.quickCapture.points
          .filter(pt => pt.description)
          .map(pt => `KM${pt.km}: ${pt.description}`)
          .join('; ');
      }
      
      // Observations
      let observations = '';
      if (useSegments && data.segments) {
        observations = data.segments
          .filter(s => s.observations)
          .map((s, idx) => `Seg${idx+1}: ${s.observations}`)
          .join('; ');
      } else if (data.observations) {
        observations = data.observations;
      }

      return [
        basicInfo.roadName || '',
        basicInfo.assessmentDate || '',
        basicInfo.assessor || '',
        basicInfo.startKm || '',
        basicInfo.endKm || '',
        length,
        data.riskMethod || 'Scorecard',
        basicInfo.weatherConditions || '',
        riskAssessment.riskLevel || data.riskCategory || '',
        riskAssessment.riskClass || '',
        data.likelihood || '',
        data.consequence || '',
        segmentCount,
        segmentDetails,
        qcLines,
        qcPoints,
        pointDescriptions,
        observations,
        fieldNotes.hazardObservations || '',
        fieldNotes.consequenceObservations || '',
        fieldNotes.generalComments || '',
        fieldNotes.recommendations || '',
        inspectionReport.actionItems || '',
        inspectionReport.requiresSpecialist ? 'Yes' : 'No',
        inspectionReport.specialistNotes || '',
        inspectionReport.inspectionFrequency || '',
        inspectionReport.nextInspectionDate || '',
        inspectionReport.inspectorDesignation || '',
        assessment.dateCreated || ''
      ];
    });

    // Build CSV string with proper escaping
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => {
        const cellStr = String(cell || '');
        // Escape quotes, commas, and newlines
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
 * Download CSV file
 */
export function downloadCSV(csvContent) {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `Mosaic_Road_Assessments_${timestamp}.csv`;
  
  // Add BOM for Excel compatibility
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Mobile and desktop compatible download
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  }
}

// Keep these for backwards compatibility but they now use IndexedDB
export async function exportToJSON() {
  const assessments = await loadAssessmentsDB();
  return {
    metadata: {
      exportDate: new Date().toISOString(),
      appVersion: '2.7.0',
      totalAssessments: assessments.length
    },
    assessments: assessments
  };
}

export function downloadJSON(data) {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `Mosaic_Road_Assessments_${timestamp}.json`;
  
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
