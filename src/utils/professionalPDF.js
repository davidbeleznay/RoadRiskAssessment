// src/utils/professionalPDF.js
// Professional PDF generation with jsPDF and Mosaic branding

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

/**
 * Generate professional PDF report with Mosaic branding
 */
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
    const photos = data.photos || [];
    const method = data.riskMethod || 'Scorecard';

    // Colors
    const mosaicGreen = [46, 125, 50];
    const darkGray = [51, 51, 51];
    const lightGray = [245, 245, 245];

    let yPos = 20;

    // Header with Mosaic branding
    doc.setFillColor(...mosaicGreen);
    doc.rect(0, 0, 220, 35, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('Road Risk Assessment Report', 105, 15, { align: 'center' });
    
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    doc.text('Mosaic Forest Management', 105, 22, { align: 'center' });
    doc.text('Professional Risk Evaluation System', 105, 28, { align: 'center' });

    yPos = 45;

    // Method badge
    doc.setFillColor(method === 'LMH' ? 225 : 230, method === 'LMH' ? 190 : 247, method === 'LMH' ? 231 : 255);
    doc.roundedRect(15, yPos, 50, 8, 2, 2, 'F');
    doc.setTextColor(...darkGray);
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.text(method === 'LMH' ? '⚖️ LMH Method' : '🔬 Scorecard Method', 40, yPos + 5.5, { align: 'center' });

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

    doc.setTextColor(...darkGray);
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');

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
      styles: { fontSize: 9, cellPadding: 3 },
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

    // Risk box
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
    doc.roundedRect(15, yPos, 180, 30, 3, 3, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont(undefined, 'normal');
    
    if (method === 'Scorecard') {
      const hazardScore = Object.values(data.hazardFactors || {}).reduce((sum, val) => sum + (val || 0), 0);
      const consequenceScore = Object.values(data.consequenceFactors || {}).reduce((sum, val) => sum + (val || 0), 0);
      doc.text(`Hazard: ${hazardScore}/50  •  Consequence: ${consequenceScore}/40`, 105, yPos + 8, { align: 'center' });
      doc.setFontSize(20);
      doc.setFont(undefined, 'bold');
      doc.text(`Score: ${data.riskScore || hazardScore * consequenceScore}`, 105, yPos + 17, { align: 'center' });
    } else {
      doc.text(`${data.likelihood || 'N/A'} Likelihood  •  ${data.consequence || 'N/A'} Consequence`, 105, yPos + 8, { align: 'center' });
      doc.setFontSize(20);
      doc.setFont(undefined, 'bold');
      doc.text(`${data.riskScore || 'N/A'}`, 105, yPos + 17, { align: 'center' });
    }
    
    doc.setFontSize(16);
    doc.text(`${riskLevel.toUpperCase()} RISK`, 105, yPos + 25, { align: 'center' });

    yPos += 40;

    // Field Notes
    if (fieldNotes.hazardObservations || fieldNotes.consequenceObservations || 
        fieldNotes.generalComments || fieldNotes.recommendations) {
      
      doc.setTextColor(...mosaicGreen);
      doc.setFontSize(14);
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
        yPos += (lines.length * 4.5) + 5;
      };

      addNote('⚠️ Hazard Observations:', fieldNotes.hazardObservations);
      addNote('🎯 Consequence Observations:', fieldNotes.consequenceObservations);
      addNote('💬 General Comments:', fieldNotes.generalComments);
      addNote('✅ Recommendations:', fieldNotes.recommendations);
    }

    // Photos
    if (photos.length > 0) {
      if (yPos > 240) {
        doc.addPage();
        yPos = 20;
      }

      doc.setTextColor(...mosaicGreen);
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text(`Site Photos (${photos.length})`, 15, yPos);
      yPos += 2;
      doc.line(15, yPos, 195, yPos);
      yPos += 8;

      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        
        if (yPos > 220) {
          doc.addPage();
          yPos = 20;
        }

        try {
          // Add photo
          doc.addImage(photo.data, 'JPEG', 15, yPos, 85, 64);
          
          // Photo info
          doc.setFontSize(9);
          doc.setTextColor(...darkGray);
          doc.setFont(undefined, 'bold');
          doc.text(`Photo ${i + 1}`, 105, yPos + 5);
          
          doc.setFont(undefined, 'normal');
          doc.setFontSize(8);
          doc.text(new Date(photo.timestamp).toLocaleString(), 105, yPos + 10);
          
          if (photo.gps.latitude) {
            doc.text(`GPS: ${photo.gps.latitude}, ${photo.gps.longitude}`, 105, yPos + 15);
          }
          
          if (photo.comment) {
            const commentLines = doc.splitTextToSize(photo.comment, 85);
            doc.text(commentLines, 105, yPos + 22);
          }
          
          yPos += 70;
        } catch (error) {
          console.error('Error adding photo to PDF:', error);
          doc.setFontSize(9);
          doc.text(`[Photo ${i + 1} - Error loading]`, 15, yPos);
          yPos += 10;
        }
      }
    }

    // Footer on all pages
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFillColor(...lightGray);
      doc.rect(0, 270, 220, 27, 'F');
      doc.setTextColor(120, 120, 120);
      doc.setFontSize(8);
      doc.text('Road Risk Assessment Report', 105, 278, { align: 'center' });
      doc.text(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 105, 283, { align: 'center' });
      doc.text('© 2025 Mosaic Forest Management', 105, 288, { align: 'center' });
      doc.text(`Page ${i} of ${pageCount}`, 195, 288, { align: 'right' });
    }

    // Save the PDF
    const fileName = `RoadRisk_${basicInfo.roadName?.replace(/[^a-zA-Z0-9]/g, '_') || 'Assessment'}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    
    console.log('✅ PDF generated:', fileName);
    return { success: true, fileName };

  } catch (error) {
    console.error('❌ PDF generation error:', error);
    throw error;
  }
}

/**
 * Export assessment to professional PDF
 */
export async function exportToProfessionalPDF(assessment) {
  const roadName = assessment.data?.basicInfo?.roadName || assessment.roadName || 'assessment';
  const method = assessment.data?.riskMethod || 'Scorecard';
  
  console.log(`📄 Generating ${method} PDF for: ${roadName}`);
  console.log('Photos to include:', assessment.data?.photos?.length || 0);
  
  try {
    const result = await generateProfessionalPDF(assessment);
    
    // Show success message
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    setTimeout(() => {
      if (isMobile) {
        alert(`✅ PDF Downloaded!\n\nFile: ${result.fileName}\n\nCheck your Downloads folder or Files app.`);
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
