// src/utils/pdfExport.js
// Generate PDF reports from road risk assessments

/**
 * Generate a PDF report from assessment data
 * This creates a download link for a Python-generated PDF
 * @param {Object} assessment - Assessment data
 * @returns {Promise<void>}
 */
export async function generatePDFReport(assessment) {
  try {
    // For now, create a simple HTML-based PDF using print
    // This will be replaced with proper PDF generation later
    
    const data = assessment.data || {};
    const basicInfo = data.basicInfo || {};
    const riskAssessment = data.riskAssessment || {};
    const fieldNotes = data.fieldNotes || {};
    const photos = data.photos || [];
    
    // Calculate scores
    const hazardScore = Object.values(data.hazardFactors || {}).reduce((sum, val) => sum + (val || 0), 0);
    const consequenceScore = Object.values(data.consequenceFactors || {}).reduce((sum, val) => sum + (val || 0), 0);
    
    // Create HTML content
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Road Risk Assessment Report</title>
  <style>
    @page { margin: 0.75in; }
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #2e7d32;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #2e7d32;
      margin: 0;
      font-size: 24px;
    }
    .header .subtitle {
      color: #666;
      font-size: 14px;
    }
    .section {
      margin-bottom: 25px;
      page-break-inside: avoid;
    }
    .section h2 {
      color: #2e7d32;
      border-bottom: 2px solid #e0e0e0;
      padding-bottom: 8px;
      font-size: 18px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin: 15px 0;
    }
    .info-item {
      padding: 8px;
      background: #f5f5f5;
      border-radius: 4px;
    }
    .info-label {
      font-weight: bold;
      color: #555;
      font-size: 12px;
    }
    .info-value {
      color: #333;
      margin-top: 4px;
    }
    .risk-summary {
      background: ${riskAssessment.finalColor || '#4caf50'};
      color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      margin: 20px 0;
    }
    .risk-score {
      font-size: 48px;
      font-weight: bold;
      margin: 10px 0;
    }
    .risk-level {
      font-size: 24px;
      margin-top: 10px;
    }
    .notes-section {
      background: #f9f9f9;
      padding: 15px;
      border-left: 4px solid #2e7d32;
      margin: 15px 0;
    }
    .notes-section h4 {
      margin-top: 0;
      color: #2e7d32;
    }
    .photo-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin: 15px 0;
    }
    .photo-item {
      page-break-inside: avoid;
    }
    .photo-item img {
      width: 100%;
      height: auto;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .photo-caption {
      font-size: 12px;
      color: #666;
      margin-top: 8px;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e0e0e0;
      text-align: center;
      color: #666;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🛣️ Road Risk Assessment Report</h1>
    <div class="subtitle">Professional risk evaluation for forest roads</div>
    <div class="subtitle">© 2025 Mosaic Forest Management</div>
  </div>

  <div class="section">
    <h2>Basic Information</h2>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Road Name/ID</div>
        <div class="info-value">${basicInfo.roadName || 'N/A'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Assessment Date</div>
        <div class="info-value">${basicInfo.assessmentDate || 'N/A'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Assessor</div>
        <div class="info-value">${basicInfo.assessor || 'N/A'}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Road Section</div>
        <div class="info-value">KM ${basicInfo.startKm || '?'} - ${basicInfo.endKm || '?'}</div>
      </div>
      ${basicInfo.weatherConditions ? `
      <div class="info-item">
        <div class="info-label">Weather Conditions</div>
        <div class="info-value">${basicInfo.weatherConditions}</div>
      </div>
      ` : ''}
    </div>
  </div>

  <div class="section">
    <h2>Risk Assessment Summary</h2>
    <div class="risk-summary">
      <div>Hazard Score: ${hazardScore} / 50</div>
      <div>Consequence Score: ${consequenceScore} / 40</div>
      <div class="risk-score">${data.riskScore || (hazardScore * consequenceScore)}</div>
      <div class="risk-level">${riskAssessment.finalRisk || riskAssessment.riskLevel || 'Not Calculated'} RISK</div>
      ${riskAssessment.priority ? `<div>Priority: ${riskAssessment.priority}</div>` : ''}
    </div>
  </div>

  ${fieldNotes.hazardObservations || fieldNotes.consequenceObservations || fieldNotes.generalComments || fieldNotes.recommendations ? `
  <div class="section">
    <h2>Field Notes & Observations</h2>
    ${fieldNotes.hazardObservations ? `
    <div class="notes-section">
      <h4>⚠️ Hazard Factor Observations</h4>
      <p>${fieldNotes.hazardObservations}</p>
    </div>
    ` : ''}
    ${fieldNotes.consequenceObservations ? `
    <div class="notes-section">
      <h4>🎯 Consequence Factor Observations</h4>
      <p>${fieldNotes.consequenceObservations}</p>
    </div>
    ` : ''}
    ${fieldNotes.generalComments ? `
    <div class="notes-section">
      <h4>💬 General Site Comments</h4>
      <p>${fieldNotes.generalComments}</p>
    </div>
    ` : ''}
    ${fieldNotes.recommendations ? `
    <div class="notes-section">
      <h4>✅ Recommendations & Action Items</h4>
      <p>${fieldNotes.recommendations}</p>
    </div>
    ` : ''}
  </div>
  ` : ''}

  ${photos.length > 0 ? `
  <div class="section">
    <h2>Site Photos (${photos.length})</h2>
    <div class="photo-grid">
      ${photos.map((photo, index) => `
        <div class="photo-item">
          <img src="${photo.data}" alt="Site photo ${index + 1}" />
          <div class="photo-caption">
            <strong>Photo ${index + 1}</strong><br>
            ${photo.timestamp ? new Date(photo.timestamp).toLocaleString() : ''}<br>
            ${photo.gps?.latitude ? `📍 ${photo.gps.latitude}, ${photo.gps.longitude}` : ''}
            ${photo.comment ? `<br>${photo.comment}` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  </div>
  ` : ''}

  <div class="footer">
    <p>Road Risk Assessment Report</p>
    <p>Generated: ${new Date().toLocaleString()}</p>
    <p>Mosaic Forest Management - Professional Forest Road Risk Evaluation</p>
  </div>
</body>
</html>
    `;

    // Open in new window and trigger print
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load, then show print dialog
    setTimeout(() => {
      printWindow.print();
    }, 500);

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

/**
 * Export assessment to PDF (generates and downloads)
 * @param {Object} assessment - Assessment data
 */
export function exportToPDF(assessment) {
  const roadName = assessment.data?.basicInfo?.roadName || 'assessment';
  const safeName = roadName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const timestamp = new Date().toISOString().split('T')[0];
  
  console.log(`📄 Generating PDF report for: ${roadName}`);
  
  // Use browser's print-to-PDF functionality
  generatePDFReport(assessment);
  
  alert(`✅ PDF ready! Use your browser's "Save as PDF" option.\n\nSuggested filename: ${safeName}_${timestamp}.pdf`);
}
