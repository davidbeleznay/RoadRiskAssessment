// src/utils/professionalPDF.js
// Professional PDF with complete factor details and QuickCapture integration

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export async function generateProfessionalPDF(assessment) {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'letter'
    });

    const data = assessment.data || {};
    const basicInfo = data.basicInfo || {};
    const riskAssessment = data.riskAssessment || {};
    const fieldNotes = data.fieldNotes || {};
    const method = data.riskMethod || 'Scorecard';
    const quickCaptureRef = data.quickCaptureRef || '';

    const mosaicGreen = [46, 125, 50];
    const darkGray = [51, 51, 51];
    const lightGray = [245, 245, 245];
    const orange = [255, 152, 0];

    let yPos = 20;

    // Clean header (no emojis - they cause encoding issues)
    doc.setFillColor(...mosaicGreen);
    doc.rect(0, 0, 220, 30, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont(undefined, 'bold');
    doc.text('Road Risk Assessment', 105, 12, { align: 'center' });
    
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text('Mosaic Forest Management', 105, 22, { align: 'center' });

    yPos = 40;

    // Method badge (no emoji)
    doc.setFillColor(method === 'LMH' ? 225 : 230, method === 'LMH' ? 190 : 247, method === 'LMH' ? 231 : 255);
    doc.roundedRect(15, yPos, 60, 8, 2, 2, 'F');
    doc.setTextColor(...darkGray);
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.text(method === 'LMH' ? 'LMH Method' : 'Scorecard Method', 45, yPos + 5.5, { align: 'center' });

    yPos += 15;

    // Basic Information
    doc.setTextColor(...mosaicGreen);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Basic Information', 15, yPos);
    yPos += 2;
    
    doc.setDrawColor(224, 224, 224);
    doc.setLineWidth(0.5);
    doc.line(15, yPos, 195, yPos);
    yPos += 8;

    const basicInfoData = [
      ['Road Name/ID', basicInfo.roadName || 'N/A'],
      ['Assessment Date', basicInfo.assessmentDate || 'N/A'],
      ['Assessor', basicInfo.assessor || data.assessor || 'N/A'],
      ['Road Section', `KM ${basicInfo.startKm || '?'} - ${basicInfo.endKm || '?'}`],
      ['Weather', basicInfo.weatherConditions || 'N/A']
    ];

    doc.autoTable({
      startY: yPos,
      head: [],
      body: basicInfoData,
      theme: 'plain',
      styles: { fontSize: 9, cellPadding: 3, textColor: darkGray },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 50 },
        1: { cellWidth: 130 }
      },
      margin: { left: 15 }
    });

    yPos = doc.lastAutoTable.finalY + 10;

    // Risk Assessment Summary
    doc.setTextColor(...mosaicGreen);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Risk Assessment Summary', 15, yPos);
    yPos += 2;
    doc.line(15, yPos, 195, yPos);
    yPos += 10;

    const riskLevel = riskAssessment.finalRisk || riskAssessment.riskLevel || data.riskCategory || 'N/A';
    const riskColors = {
      'Very High': [244, 67, 54],
      'High': [255, 152, 0],
      'Moderate': [255, 193, 7],
      'Low': [76, 175, 80],
      'Very Low': [33, 150, 243]
    };
    const riskColor = riskColors[riskLevel] || [100, 100, 100];

    doc.setFillColor(...riskColor);
    doc.roundedRect(15, yPos, 180, 25, 3, 3, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    
    if (method === 'Scorecard') {
      const hazardScore = Object.values(data.hazardFactors || {}).reduce((sum, val) => sum + (val || 0), 0);
      const consequenceScore = Object.values(data.consequenceFactors || {}).reduce((sum, val) => sum + (val || 0), 0);
      doc.text(`Hazard: ${hazardScore}/50  |  Consequence: ${consequenceScore}/40`, 105, yPos + 8, { align: 'center' });
      doc.setFontSize(20);
      doc.setFont(undefined, 'bold');
      doc.text(`Score: ${data.riskScore || hazardScore * consequenceScore}`, 105, yPos + 16, { align: 'center' });
    } else {
      doc.text(`${data.likelihood || 'N/A'} Likelihood  |  ${data.consequence || 'N/A'} Consequence`, 105, yPos + 8, { align: 'center' });
      doc.setFontSize(20);
      doc.setFont(undefined, 'bold');
      doc.text(`${data.riskScore || 'N/A'}`, 105, yPos + 16, { align: 'center' });
    }
    
    doc.setFontSize(16);
    doc.text(`${riskLevel.toUpperCase()} RISK`, 105, yPos + 22, { align: 'center' });

    yPos += 35;

    // DETAILED FACTOR SCORES (Scorecard only)
    if (method === 'Scorecard' && data.hazardFactors) {
      // Hazard Factors
      doc.setTextColor(...mosaicGreen);
      doc.setFontSize(13);
      doc.setFont(undefined, 'bold');
      doc.text('Hazard Factor Details', 15, yPos);
      yPos += 2;
      doc.line(15, yPos, 195, yPos);
      yPos += 6;

      const hazardData = Object.entries(data.hazardFactors).map(([key, value]) => [
        key.replace(/([A-Z])/g, ' $1').trim(),
        `${value || 0}/10`,
        value >= 7 ? 'High' : (value >= 4 ? 'Moderate' : 'Low')
      ]);

      doc.autoTable({
        startY: yPos,
        head: [['Factor', 'Score', 'Level']],
        body: hazardData,
        theme: 'grid',
        styles: { fontSize: 9, cellPadding: 3, textColor: darkGray },
        headStyles: { fillColor: orange, textColor: [255,255,255], fontStyle: 'bold' },
        columnStyles: {
          0: { cellWidth: 120 },
          1: { cellWidth: 30, halign: 'center', fontStyle: 'bold' },
          2: { cellWidth: 30, halign: 'center' }
        },
        didParseCell: (data) => {
          if (data.section === 'body' && data.column.index === 2) {
            if (data.cell.raw === 'High') {
              data.cell.styles.textColor = [244, 67, 54];
              data.cell.styles.fontStyle = 'bold';
            }
          }
        },
        margin: { left: 15 }
      });

      yPos = doc.lastAutoTable.finalY + 10;

      // Consequence Factors
      doc.setTextColor(...mosaicGreen);
      doc.setFontSize(13);
      doc.setFont(undefined, 'bold');
      doc.text('Consequence Factor Details', 15, yPos);
      yPos += 2;
      doc.line(15, yPos, 195, yPos);
      yPos += 6;

      const consequenceData = Object.entries(data.consequenceFactors || {}).map(([key, value]) => [
        key.replace(/([A-Z])/g, ' $1').trim(),
        `${value || 0}/10`,
        value >= 7 ? 'High' : (value >= 4 ? 'Moderate' : 'Low')
      ]);

      doc.autoTable({
        startY: yPos,
        head: [['Factor', 'Score', 'Level']],
        body: consequenceData,
        theme: 'grid',
        styles: { fontSize: 9, cellPadding: 3, textColor: darkGray },
        headStyles: { fillColor: [233, 30, 99], textColor: [255,255,255], fontStyle: 'bold' },
        columnStyles: {
          0: { cellWidth: 120 },
          1: { cellWidth: 30, halign: 'center', fontStyle: 'bold' },
          2: { cellWidth: 30, halign: 'center' }
        },
        didParseCell: (data) => {
          if (data.section === 'body' && data.column.index === 2) {
            if (data.cell.raw === 'High') {
              data.cell.styles.textColor = [244, 67, 54];
              data.cell.styles.fontStyle = 'bold';
            }
          }
        },
        margin: { left: 15 }
      });

      yPos = doc.lastAutoTable.finalY + 10;
    }

    // QuickCapture Reference
    if (quickCaptureRef) {
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      }

      doc.setTextColor(...mosaicGreen);
      doc.setFontSize(13);
      doc.setFont(undefined, 'bold');
      doc.text('QuickCapture Data Reference', 15, yPos);
      yPos += 2;
      doc.line(15, yPos, 195, yPos);
      yPos += 8;

      doc.setFillColor(227, 242, 253);
      doc.roundedRect(15, yPos, 180, 'auto', 3, 3, 'F');
      
      doc.setTextColor(...darkGray);
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      const refLines = doc.splitTextToSize(quickCaptureRef, 170);
      doc.text(refLines, 18, yPos + 6);
      yPos += (refLines.length * 5) + 10;

      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('See LRM database for GPS coordinates and field photos at these QuickCapture points/segments', 18, yPos);
      yPos += 8;
    }

    // Field Documentation Requirements
    if (yPos > 235) {
      doc.addPage();
      yPos = 20;
    }

    doc.setTextColor(...mosaicGreen);
    doc.setFontSize(13);
    doc.setFont(undefined, 'bold');
    doc.text('Field Documentation Requirements', 15, yPos);
    yPos += 2;
    doc.line(15, yPos, 195, yPos);
    yPos += 8;

    const docRequirements = {
      'Very High': 'Minimum 7 photo points: drainage issues, soil conditions, water proximity, infrastructure, visible hazards, tension cracks, erosion features',
      'High': 'Minimum 5 photo points: critical drainage features, soil exposures, stream crossings, infrastructure condition, potential failure indicators',
      'Moderate': 'Minimum 3 photo points: key drainage structures, soil/terrain characteristics, stream crossings if present',
      'Low': 'Minimum 1-2 photo points: general road condition, representative features'
    };

    const requirement = docRequirements[riskLevel] || docRequirements['Moderate'];
    
    const colorMap = {
      'Very High': [244, 67, 54],
      'High': [255, 152, 0],
      'Moderate': [255, 193, 7],
      'Low': [76, 175, 80]
    };
    
    doc.setFillColor(...(colorMap[riskLevel] || [200,200,200]));
    doc.roundedRect(15, yPos, 180, 'auto', 3, 3, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text(`${riskLevel} Risk - QuickCapture Documentation:`, 18, yPos + 6);
    
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    const reqLines = doc.splitTextToSize(requirement, 170);
    doc.text(reqLines, 18, yPos + 12);
    yPos += (reqLines.length * 5) + 18;

    // Field Notes
    if (fieldNotes.hazardObservations || fieldNotes.consequenceObservations || 
        fieldNotes.generalComments || fieldNotes.recommendations) {
      
      if (yPos > 230) {
        doc.addPage();
        yPos = 20;
      }

      doc.setTextColor(...mosaicGreen);
      doc.setFontSize(13);
      doc.setFont(undefined, 'bold');
      doc.text('Field Notes & Observations', 15, yPos);
      yPos += 2;
      doc.line(15, yPos, 195, yPos);
      yPos += 8;

      doc.setTextColor(...darkGray);
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');

      const addNote = (title, content) => {
        if (!content) return;
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }
        doc.setFont(undefined, 'bold');
        doc.text(title, 15, yPos);
        yPos += 5;
        doc.setFont(undefined, 'normal');
        const lines = doc.splitTextToSize(content, 175);
        doc.text(lines, 15, yPos);
        yPos += (lines.length * 4.5) + 6;
      };

      addNote('Hazard Observations:', fieldNotes.hazardObservations);
      addNote('Consequence Observations:', fieldNotes.consequenceObservations);
      addNote('General Comments:', fieldNotes.generalComments);
      addNote('Recommendations:', fieldNotes.recommendations);
    }

    // Professional note
    if (yPos < 235) {
      doc.setFillColor(227, 242, 253);
      doc.roundedRect(15, yPos, 180, 18, 3, 3, 'F');
      doc.setTextColor(25, 118, 210);
      doc.setFontSize(8);
      doc.setFont(undefined, 'bold');
      doc.text('PROFESSIONAL NOTE:', 18, yPos + 6);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(...darkGray);
      doc.setFontSize(8);
      const noteText = 'This assessment supplements QuickCapture field data. GPS coordinates and photos referenced above are stored in LRM.';
      const noteLines = doc.splitTextToSize(noteText, 170);
      doc.text(noteLines, 18, yPos + 11);
    }

    // Footer on all pages
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFillColor(...lightGray);
      doc.rect(0, 270, 220, 27, 'F');
      doc.setTextColor(120, 120, 120);
      doc.setFontSize(8);
      doc.text('Road Risk Assessment - Professional Tool', 105, 278, { align: 'center' });
      doc.text(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 105, 283, { align: 'center' });
      doc.text('© 2025 Mosaic Forest Management', 105, 288, { align: 'center' });
      doc.text(`Page ${i} of ${pageCount}`, 195, 288, { align: 'right' });
    }

    // Save the PDF
    const fileName = `RoadRisk_${basicInfo.roadName?.replace(/[^a-zA-Z0-9]/g, '_') || 'Assessment'}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    
    console.log('✅ Professional PDF generated:', fileName);
    return { success: true, fileName };

  } catch (error) {
    console.error('❌ PDF generation error:', error);
    throw error;
  }
}

export async function exportToProfessionalPDF(assessment) {
  const roadName = assessment.data?.basicInfo?.roadName || assessment.roadName || 'assessment';
  const method = assessment.data?.riskMethod || 'Scorecard';
  
  console.log(`📄 Generating ${method} PDF for: ${roadName}`);
  
  try {
    const result = await generateProfessionalPDF(assessment);
    
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    setTimeout(() => {
      if (isMobile) {
        alert(`✅ PDF Downloaded!\n\nFile: ${result.fileName}\n\nCheck your Downloads or Files app.`);
      } else {
        alert(`✅ PDF Downloaded!\n\nFile: ${result.fileName}\n\nCheck your Downloads folder.`);
      }
    }, 300);
    
    return result;
  } catch (error) {
    console.error('PDF error:', error);
    alert('❌ PDF generation failed: ' + error.message);
    throw error;
  }
}
