// src/utils/professionalPDF.js
// Enhanced multi-segment PDF generation

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export async function generateProfessionalPDF(assessment) {
  try {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });
    const data = assessment.data || {};
    const basicInfo = data.basicInfo || {};
    const method = data.riskMethod || 'Scorecard';
    const useSegments = data.useSegments || false;
    const segments = data.segments || [];
    
    const mosaicGreen = [46, 125, 50];
    const white = [255, 255, 255];
    const lightGray = [245, 245, 245];
    const darkGray = [51, 51, 51];

    let yPos = 20;

    // Professional Header
    doc.setFillColor(...mosaicGreen);
    doc.rect(0, 0, 220, 35, 'F');
    
    doc.setTextColor(...white);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text(useSegments ? 'FULL ROAD INSPECTION' : 'ROAD RISK ASSESSMENT', 105, 14, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text('Mosaic Forest Management', 105, 22, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text(method === 'LMH-Multi' || method === 'LMH' ? 'LMH Risk Assessment Method' : 'Scorecard Method', 105, 29, { align: 'center' });

    yPos = 45;

    // Road Information Box
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(15, yPos, 180, 35, 2, 2, 'F');
    
    doc.setTextColor(...darkGray);
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('ROAD INFORMATION', 20, yPos + 7);
    
    yPos += 12;
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    
    const roadLength = basicInfo.endKm && basicInfo.startKm ? 
      (parseFloat(basicInfo.endKm) - parseFloat(basicInfo.startKm)).toFixed(1) : 'N/A';
    
    const infoData = [
      ['Road:', basicInfo.roadName || 'N/A'],
      ['Range:', `KM ${basicInfo.startKm || '?'} - ${basicInfo.endKm || '?'} (${roadLength} km)`],
      ['Assessor:', basicInfo.assessor || 'N/A'],
      ['Date:', basicInfo.assessmentDate || 'N/A'],
      ['Weather:', basicInfo.weatherConditions || 'N/A']
    ];

    infoData.forEach(([label, value], idx) => {
      doc.setFont(undefined, 'bold');
      doc.text(label, 20, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(value, 55, yPos);
      yPos += 5;
    });

    yPos += 10;

    // MULTI-SEGMENT ASSESSMENT
    if (useSegments && segments.length > 0) {
      // Segment Summary Stats
      const stats = { veryHigh: 0, high: 0, moderate: 0, low: 0, totalKm: 0 };
      const riskMatrix = {
        'High-High': 5, 'High-Moderate': 4, 'High-Low': 3, 'High-Very Low': 1,
        'Moderate-High': 4, 'Moderate-Moderate': 3, 'Moderate-Low': 2, 'Moderate-Very Low': 1,
        'Low-High': 3, 'Low-Moderate': 2, 'Low-Low': 2, 'Low-Very Low': 1,
        'Very Low-High': 1, 'Very Low-Moderate': 1, 'Very Low-Low': 1, 'Very Low-Very Low': 1
      };

      segments.forEach(seg => {
        if (seg.likelihood && seg.consequence && seg.startKm && seg.endKm) {
          const riskClass = riskMatrix[`${seg.likelihood}-${seg.consequence}`];
          const length = parseFloat(seg.endKm) - parseFloat(seg.startKm);
          stats.totalKm += length;
          if (riskClass === 5) stats.veryHigh += length;
          else if (riskClass === 4) stats.high += length;
          else if (riskClass === 3 || riskClass === 2) stats.moderate += length;
          else stats.low += length;
        }
      });

      // Summary Box
      doc.setFillColor(232, 245, 233);
      doc.roundedRect(15, yPos, 180, 40, 2, 2, 'F');
      
      doc.setTextColor(...mosaicGreen);
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('INSPECTION SUMMARY', 20, yPos + 8);
      
      yPos += 14;
      doc.setFontSize(9);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(...darkGray);
      
      const summaryData = [
        [`Total Road Length: ${roadLength} km`, `Segments Assessed: ${segments.length}`, `Total Assessed: ${stats.totalKm.toFixed(1)} km`]
      ];
      if (stats.veryHigh > 0) summaryData.push([`Very High Risk (Class 5): ${stats.veryHigh.toFixed(1)} km`, '', '']);
      if (stats.high > 0) summaryData.push([`High Risk (Class 4): ${stats.high.toFixed(1)} km`, '', '']);
      if (stats.moderate > 0) summaryData.push([`Moderate Risk (Class 2-3): ${stats.moderate.toFixed(1)} km`, '', '']);
      if (stats.low > 0) summaryData.push([`Low Risk (Class 1): ${stats.low.toFixed(1)} km`, '', '']);

      summaryData.forEach(row => {
        doc.text(row[0], 20, yPos);
        if (row[1]) doc.text(row[1], 80, yPos);
        if (row[2]) doc.text(row[2], 140, yPos);
        yPos += 5;
      });

      yPos += 10;

      // Individual Segment Details
      segments.forEach((seg, idx) => {
        if (yPos > 240) {
          doc.addPage();
          yPos = 20;
        }

        const riskClass = riskMatrix[`${seg.likelihood}-${seg.consequence}`];
        const riskColors = { 5: [244, 67, 54], 4: [255, 152, 0], 3: [255, 193, 7], 2: [255, 193, 7], 1: [139, 195, 74] };
        const riskLabels = { 5: 'VERY HIGH', 4: 'HIGH', 3: 'MODERATE', 2: 'MODERATE', 1: 'LOW' };
        const riskColor = riskColors[riskClass] || [100, 100, 100];
        const length = seg.endKm && seg.startKm ? (parseFloat(seg.endKm) - parseFloat(seg.startKm)).toFixed(1) : 'N/A';

        // Segment Header
        doc.setFillColor(...riskColor);
        doc.rect(15, yPos, 180, 12, 'F');
        doc.setTextColor(...white);
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text(`SEGMENT ${idx + 1} - ${riskLabels[riskClass]} RISK (CLASS ${riskClass})`, 20, yPos + 8);
        
        yPos += 17;

        // Segment Info
        doc.setTextColor(...darkGray);
        doc.setFontSize(9);
        doc.setFont(undefined, 'bold');
        doc.text(`Location: KM ${seg.startKm || '?'} - ${seg.endKm || '?'} (${length} km)`, 20, yPos);
        yPos += 5;
        doc.setFont(undefined, 'normal');
        doc.text(`Assessment: ${seg.likelihood || '?'} Likelihood × ${seg.consequence || '?'} Consequence`, 20, yPos);
        yPos += 8;

        // QuickCapture Data
        if (seg.quickCapture?.lineType || (seg.quickCapture?.points && seg.quickCapture.points.length > 0)) {
          doc.setFont(undefined, 'bold');
          doc.text('QuickCapture Field Data:', 20, yPos);
          yPos += 5;
          doc.setFont(undefined, 'normal');
          
          if (seg.quickCapture.lineType) {
            doc.text(`Line: ${seg.quickCapture.lineType} (${seg.quickCapture.lineRange || `KM ${seg.startKm}-${seg.endKm}`})`, 20, yPos);
            yPos += 4;
          }
          
          if (seg.quickCapture.photosCollected) {
            doc.text('Photos: Yes', 20, yPos);
            yPos += 4;
          }

          if (seg.quickCapture.points && seg.quickCapture.points.length > 0) {
            yPos += 2;
            doc.setFont(undefined, 'bold');
            doc.text('Point Features:', 20, yPos);
            yPos += 5;
            doc.setFont(undefined, 'normal');
            
            seg.quickCapture.points.forEach((pt, ptIdx) => {
              if (yPos > 270) {
                doc.addPage();
                yPos = 20;
              }
              
              const ptText = `  KM ${pt.km || '?'}: ${pt.featureType || 'Unknown'} ${pt.photoTaken ? '[Photo]' : ''}`;
              doc.text(ptText, 20, yPos);
              yPos += 4;
              
              if (pt.description) {
                const descLines = doc.splitTextToSize(`     ${pt.description}`, 170);
                doc.setFont(undefined, 'italic');
                doc.text(descLines, 20, yPos);
                doc.setFont(undefined, 'normal');
                yPos += descLines.length * 4;
              }
            });
          }
          yPos += 4;
        }

        // Observations
        if (seg.observations) {
          if (yPos > 250) {
            doc.addPage();
            yPos = 20;
          }
          doc.setFont(undefined, 'bold');
          doc.text('Observations:', 20, yPos);
          yPos += 5;
          doc.setFont(undefined, 'normal');
          const obsLines = doc.splitTextToSize(seg.observations, 170);
          doc.text(obsLines, 20, yPos);
          yPos += obsLines.length * 4.5;
        }

        yPos += 8;
      });

    } else {
      // ENTIRE ROAD OR SCORECARD
      const riskAssessment = data.riskAssessment || {};
      const riskLevel = riskAssessment.riskLevel || data.riskCategory || 'N/A';
      const riskColors = { 'Very High': [244, 67, 54], 'High': [255, 152, 0], 'Moderate': [255, 193, 7], 'Low': [76, 175, 80] };
      const riskColor = riskColors[riskLevel] || [100, 100, 100];

      // Risk Summary Box
      doc.setFillColor(...riskColor);
      doc.roundedRect(15, yPos, 180, 30, 3, 3, 'F');
      doc.setTextColor(...white);
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      
      if (method === 'Scorecard') {
        const hazard = Object.values(data.hazardFactors || {}).reduce((sum, v) => sum + (v || 0), 0);
        const consequence = Object.values(data.consequenceFactors || {}).reduce((sum, v) => sum + (v || 0), 0);
        doc.text(`Hazard: ${hazard}/50  |  Consequence: ${consequence}/40`, 105, yPos + 10, { align: 'center' });
        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        doc.text(`Score: ${data.riskScore || hazard * consequence}`, 105, yPos + 18, { align: 'center' });
      } else {
        doc.text(`${data.likelihood || '?'} Likelihood × ${data.consequence || '?'} Consequence`, 105, yPos + 10, { align: 'center' });
        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        doc.text(data.riskScore || 'N/A', 105, yPos + 18, { align: 'center' });
      }
      
      doc.setFontSize(16);
      doc.text(`${riskLevel.toUpperCase()} RISK`, 105, yPos + 26, { align: 'center' });

      yPos += 40;

      // QuickCapture Data (Entire Road)
      if (data.quickCapture?.lineType || (data.quickCapture?.points && data.quickCapture.points.length > 0)) {
        doc.setTextColor(...mosaicGreen);
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('QUICKCAPTURE FIELD DATA', 15, yPos);
        yPos += 2;
        doc.setDrawColor(224, 224, 224);
        doc.line(15, yPos, 195, yPos);
        yPos += 8;

        doc.setTextColor(...darkGray);
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');

        if (data.quickCapture.lineType) {
          doc.text(`Line: ${data.quickCapture.lineType} (KM ${basicInfo.startKm}-${basicInfo.endKm})`, 15, yPos);
          yPos += 5;
        }

        if (data.quickCapture.photosCollected) {
          doc.text('Photos: Yes', 15, yPos);
          yPos += 5;
        }

        if (data.quickCapture.points && data.quickCapture.points.length > 0) {
          yPos += 2;
          doc.setFont(undefined, 'bold');
          doc.text('Point Features:', 15, yPos);
          yPos += 5;
          doc.setFont(undefined, 'normal');

          data.quickCapture.points.forEach(pt => {
            if (yPos > 270) {
              doc.addPage();
              yPos = 20;
            }
            doc.text(`  KM ${pt.km}: ${pt.featureType} ${pt.photoTaken ? '[Photo]' : ''}`, 15, yPos);
            yPos += 4;
            if (pt.description) {
              const desc = doc.splitTextToSize(`     ${pt.description}`, 170);
              doc.setFont(undefined, 'italic');
              doc.text(desc, 15, yPos);
              doc.setFont(undefined, 'normal');
              yPos += desc.length * 4;
            }
          });
        }
        yPos += 8;
      }

      // Scorecard Factor Tables
      if (method === 'Scorecard' && data.hazardFactors) {
        if (yPos > 200) {
          doc.addPage();
          yPos = 20;
        }

        doc.setTextColor(...mosaicGreen);
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('HAZARD FACTORS', 15, yPos);
        yPos += 2;
        doc.line(15, yPos, 195, yPos);
        yPos += 6;

        const hazardData = Object.entries(data.hazardFactors).map(([k, v]) => [
          k.replace(/([A-Z])/g, ' $1').trim(),
          `${v || 0}/10`,
          v >= 7 ? 'High' : (v >= 4 ? 'Moderate' : 'Low')
        ]);

        doc.autoTable({
          startY: yPos,
          head: [['Factor', 'Score', 'Level']],
          body: hazardData,
          theme: 'grid',
          styles: { fontSize: 8, cellPadding: 2.5, textColor: darkGray },
          headStyles: { fillColor: [255, 152, 0], textColor: white, fontStyle: 'bold' },
          columnStyles: {
            0: { cellWidth: 120 },
            1: { cellWidth: 30, halign: 'center', fontStyle: 'bold' },
            2: { cellWidth: 30, halign: 'center' }
          },
          didParseCell: (data) => {
            if (data.section === 'body' && data.column.index === 2 && data.cell.raw === 'High') {
              data.cell.styles.textColor = [244, 67, 54];
              data.cell.styles.fontStyle = 'bold';
            }
          },
          margin: { left: 15 }
        });

        yPos = doc.lastAutoTable.finalY + 10;

        doc.setTextColor(...mosaicGreen);
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('CONSEQUENCE FACTORS', 15, yPos);
        yPos += 2;
        doc.line(15, yPos, 195, yPos);
        yPos += 6;

        const consequenceData = Object.entries(data.consequenceFactors || {}).map(([k, v]) => [
          k.replace(/([A-Z])/g, ' $1').trim(),
          `${v || 0}/10`,
          v >= 7 ? 'High' : (v >= 4 ? 'Moderate' : 'Low')
        ]);

        doc.autoTable({
          startY: yPos,
          head: [['Factor', 'Score', 'Level']],
          body: consequenceData,
          theme: 'grid',
          styles: { fontSize: 8, cellPadding: 2.5, textColor: darkGray },
          headStyles: { fillColor: [233, 30, 99], textColor: white, fontStyle: 'bold' },
          columnStyles: {
            0: { cellWidth: 120 },
            1: { cellWidth: 30, halign: 'center', fontStyle: 'bold' },
            2: { cellWidth: 30, halign: 'center' }
          },
          didParseCell: (data) => {
            if (data.section === 'body' && data.column.index === 2 && data.cell.raw === 'High') {
              data.cell.styles.textColor = [244, 67, 54];
              data.cell.styles.fontStyle = 'bold';
            }
          },
          margin: { left: 15 }
        });

        yPos = doc.lastAutoTable.finalY + 10;
      }

      // Observations (Entire Road)
      if (data.observations) {
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }
        doc.setTextColor(...mosaicGreen);
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('OBSERVATIONS', 15, yPos);
        yPos += 2;
        doc.line(15, yPos, 195, yPos);
        yPos += 8;
        
        doc.setTextColor(...darkGray);
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        const obsLines = doc.splitTextToSize(data.observations, 175);
        doc.text(obsLines, 15, yPos);
        yPos += obsLines.length * 4.5 + 10;
      }
    }

    // Field Notes
    const fieldNotes = data.fieldNotes || {};
    if (fieldNotes.hazardObservations || fieldNotes.consequenceObservations || 
        fieldNotes.generalComments || fieldNotes.recommendations) {
      
      if (yPos > 220) {
        doc.addPage();
        yPos = 20;
      }

      doc.setTextColor(...mosaicGreen);
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text('FIELD NOTES', 15, yPos);
      yPos += 2;
      doc.line(15, yPos, 195, yPos);
      yPos += 8;

      doc.setTextColor(...darkGray);
      doc.setFontSize(9);

      const addNote = (title, content) => {
        if (!content) return;
        if (yPos > 260) {
          doc.addPage();
          yPos = 20;
        }
        doc.setFont(undefined, 'bold');
        doc.text(title, 15, yPos);
        yPos += 5;
        doc.setFont(undefined, 'normal');
        const lines = doc.splitTextToSize(content, 175);
        doc.text(lines, 15, yPos);
        yPos += lines.length * 4.5 + 6;
      };

      addNote('Hazard Observations:', fieldNotes.hazardObservations);
      addNote('Consequence Observations:', fieldNotes.consequenceObservations);
      addNote('General Comments:', fieldNotes.generalComments);
      addNote('Recommendations:', fieldNotes.recommendations);
    }

    // Footer on all pages
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFillColor(...lightGray);
      doc.rect(0, 270, 220, 27, 'F');
      doc.setTextColor(120, 120, 120);
      doc.setFontSize(8);
      doc.text('Road Risk Assessment v2.6.0', 105, 278, { align: 'center' });
      doc.text(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 105, 283, { align: 'center' });
      doc.text('Mosaic Forest Management', 105, 288, { align: 'center' });
      doc.text(`Page ${i} of ${pageCount}`, 195, 288, { align: 'right' });
    }

    const fileName = `RoadRisk_${basicInfo.roadName?.replace(/[^a-zA-Z0-9]/g, '_') || 'Assessment'}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    
    return { success: true, fileName };

  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
}

export async function exportToProfessionalPDF(assessment) {
  const roadName = assessment.data?.basicInfo?.roadName || 'assessment';
  const method = assessment.data?.riskMethod || 'Scorecard';
  
  console.log(`Generating ${method} PDF for: ${roadName}`);
  
  try {
    const result = await generateProfessionalPDF(assessment);
    
    setTimeout(() => {
      alert(`PDF Downloaded!\n\nFile: ${result.fileName}\n\nCheck your Downloads folder.`);
    }, 300);
    
    return result;
  } catch (error) {
    console.error('PDF error:', error);
    alert('PDF generation failed: ' + error.message);
    throw error;
  }
}
