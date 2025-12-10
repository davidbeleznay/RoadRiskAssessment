// src/utils/pdfExport.js
// Generate PDF reports from road risk assessments - mobile compatible

/**
 * Generate a PDF report from assessment data
 * Mobile-friendly: creates downloadable HTML that can be saved as PDF
 */
export async function generatePDFReport(assessment) {
  try {
    const data = assessment.data || {};
    const basicInfo = data.basicInfo || {};
    const riskAssessment = data.riskAssessment || {};
    const fieldNotes = data.fieldNotes || {};
    const photos = data.photos || [];
    
    const hazardScore = Object.values(data.hazardFactors || {}).reduce((sum, val) => sum + (val || 0), 0);
    const consequenceScore = Object.values(data.consequenceFactors || {}).reduce((sum, val) => sum + (val || 0), 0);
    const method = data.riskMethod || 'Scorecard';
    
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Road Risk Assessment - ${basicInfo.roadName || 'Report'}</title>
  <style>
    @media print {
      @page { margin: 0.5in; size: letter; }
      .no-print { display: none !important; }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background: white;
    }
    .header {
      text-align: center;
      border-bottom: 4px solid #2e7d32;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #2e7d32;
      margin: 0 0 10px 0;
      font-size: 28px;
    }
    .method-badge {
      display: inline-block;
      background: ${method === 'LMH' ? '#e1bee7' : '#e6f7ff'};
      color: ${method === 'LMH' ? '#6a1b9a' : '#0066cc'};
      padding: 6px 16px;
      border-radius: 6px;
      font-weight: bold;
      margin: 10px 0;
    }
    .section {
      margin-bottom: 25px;
      page-break-inside: avoid;
    }
    .section h2 {
      color: #2e7d32;
      border-bottom: 2px solid #e0e0e0;
      padding-bottom: 8px;
      font-size: 20px;
      margin-top: 25px;
    }
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
      margin: 15px 0;
    }
    .info-item {
      padding: 10px;
      background: #f5f5f5;
      border-radius: 6px;
    }
    .info-label {
      font-weight: bold;
      color: #555;
      font-size: 13px;
    }
    .info-value {
      color: #333;
      margin-top: 4px;
      font-size: 15px;
    }
    .risk-summary {
      background: ${riskAssessment.finalColor || riskAssessment.color || '#4caf50'};
      color: white;
      padding: 25px;
      border-radius: 10px;
      text-align: center;
      margin: 25px 0;
    }
    .risk-score {
      font-size: 56px;
      font-weight: bold;
      margin: 15px 0;
    }
    .risk-level {
      font-size: 28px;
      margin-top: 10px;
      font-weight: bold;
    }
    .notes-section {
      background: #f9f9f9;
      padding: 15px;
      border-left: 4px solid #2e7d32;
      margin: 15px 0;
      border-radius: 4px;
    }
    .notes-section h4 {
      margin-top: 0;
      color: #2e7d32;
    }
    .notes-section p {
      margin: 8px 0 0 0;
      white-space: pre-wrap;
    }
    .photo-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin: 20px 0;
    }
    .photo-item {
      page-break-inside: avoid;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
      background: #fafafa;
    }
    .photo-item img {
      width: 100%;
      height: auto;
      display: block;
    }
    .photo-caption {
      padding: 12px;
      font-size: 13px;
      color: #666;
      line-height: 1.5;
    }
    .photo-caption strong {
      color: #333;
      display: block;
      margin-bottom: 4px;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e0e0e0;
      text-align: center;
      color: #666;
      font-size: 12px;
    }
    .print-button {
      position: fixed;
      top: 20px;
      right: 20px;
      background: #2e7d32;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 1000;
    }
    @media (max-width: 768px) {
      .info-grid { grid-template-columns: 1fr; }
      .photo-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <button class="print-button no-print" onclick="window.print()">🖨️ Save as PDF</button>

  <div class="header">
    <h1>🛣️ Road Risk Assessment Report</h1>
    <div class="method-badge">${method === 'LMH' ? '⚖️ LMH Method' : '🔬 Scorecard Method'}</div>
    <div style="color: #666; font-size: 14px; margin-top: 10px;">© 2025 Mosaic Forest Management</div>
  </div>

  <div class="section">
    <h2>📋 Basic Information</h2>
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
        <div class="info-value">${basicInfo.assessor || data.assessor || 'N/A'}</div>
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
    <h2>🎯 Risk Assessment Summary</h2>
    <div class="risk-summary">
      ${method === 'Scorecard' ? `
      <div>Hazard Score: ${hazardScore} / 50</div>
      <div>Consequence Score: ${consequenceScore} / 40</div>
      ` : `
      <div>Likelihood: ${data.likelihood || 'N/A'}</div>
      <div>Consequence: ${data.consequence || 'N/A'}</div>
      `}
      <div class="risk-score">${data.riskScore || (hazardScore * consequenceScore)}</div>
      <div class="risk-level">${riskAssessment.finalRisk || riskAssessment.riskLevel || 'N/A'} RISK</div>
      ${riskAssessment.priority ? `<div style="margin-top: 10px; font-size: 16px;">Priority: ${riskAssessment.priority}</div>` : ''}
    </div>
  </div>

  ${fieldNotes.hazardObservations || fieldNotes.consequenceObservations || fieldNotes.generalComments || fieldNotes.recommendations ? `
  <div class="section">
    <h2>📝 Field Notes & Observations</h2>
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
    <h2>📸 Site Photos (${photos.length})</h2>
    <div class="photo-grid">
      ${photos.map((photo, index) => `
        <div class="photo-item">
          <img src="${photo.data}" alt="Site photo ${index + 1}" />
          <div class="photo-caption">
            <strong>Photo ${index + 1}</strong><br>
            ${photo.timestamp ? new Date(photo.timestamp).toLocaleString() : ''}<br>
            ${photo.gps?.latitude ? `📍 GPS: ${photo.gps.latitude}, ${photo.gps.longitude}` : '📍 GPS: Not available'}
            ${photo.comment ? `<br><br><em>${photo.comment}</em>` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  </div>
  ` : ''}

  <div class="footer">
    <p><strong>Road Risk Assessment Report</strong></p>
    <p>Generated: ${new Date().toLocaleString()}</p>
    <p>Mosaic Forest Management - Professional Forest Road Risk Evaluation</p>
  </div>

  <script>
    console.log('📄 PDF Report generated');
    console.log('Photos included:', ${photos.length});
    
    // Auto-trigger print on mobile after content loads
    window.addEventListener('load', function() {
      setTimeout(() => {
        if (window.matchMedia('(max-width: 768px)').matches) {
          console.log('📱 Mobile detected - tap Save as PDF button to download');
        }
      }, 500);
    });
  </script>
</body>
</html>
    `;

    // Open in new window
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('❌ Popup blocked! Please allow popups for this site.');
      return;
    }
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    console.log('📄 PDF window opened with', photos.length, 'photos');

  } catch (error) {
    console.error('❌ PDF generation error:', error);
    throw error;
  }
}

/**
 * Export assessment to PDF
 */
export function exportToPDF(assessment) {
  const roadName = assessment.data?.basicInfo?.roadName || 'assessment';
  const method = assessment.data?.riskMethod || 'Scorecard';
  
  console.log(`📄 Generating ${method} PDF for: ${roadName}`);
  console.log('Photos to include:', assessment.data?.photos?.length || 0);
  
  try {
    generatePDFReport(assessment);
    
    // Different instructions for mobile vs desktop
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      setTimeout(() => {
        alert(`📱 PDF Ready!\n\nTap the "🖨️ Save as PDF" button in the new window.\n\nOn iPhone:\n1. Tap the share icon\n2. Choose "Save to Files" or "Print"\n3. If Print: pinch to zoom → Share → Save PDF`);
      }, 500);
    } else {
      setTimeout(() => {
        alert(`💻 PDF Ready!\n\nClick "🖨️ Save as PDF" button, or use Ctrl+P (Cmd+P on Mac)\n\nIn print dialog, choose "Save as PDF"`);
      }, 500);
    }
    
  } catch (error) {
    alert('❌ PDF generation failed: ' + error.message);
  }
}
