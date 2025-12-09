import React, { forwardRef } from 'react';

/**
 * Component for PDF export of Road Risk Assessment data
 * 
 * @param {Object} props Component props
 * @param {Object} props.formData The form data to be exported
 * @param {number} props.riskScore Calculated risk score
 * @param {string} props.riskCategory Risk category label
 * @param {Object} props.riskColor Color theme for risk level
 * @param {string} props.requirements Professional resource requirements text
 * @param {Object} ref Forwarded ref for PDF generation
 */
const PDFExport = forwardRef(({ 
  formData, 
  riskScore, 
  riskCategory, 
  riskColor, 
  requirements 
}, ref) => {
  // Destructure form data for easier access
  const { basicInfo, hazardFactors, consequenceFactors, comments } = formData;

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Function to render factor score with label
  const renderFactorScore = (label, score) => {
    return (
      <div style={styles.factorRow}>
        <span style={styles.factorLabel}>{label}:</span>
        <span style={styles.factorScore}>{score}</span>
      </div>
    );
  };

  // Styles for PDF layout
  const styles = {
    pdfContainer: {
      fontFamily: 'Arial, sans-serif',
      maxWidth: '850px',
      margin: '20px auto',
      padding: '30px',
      backgroundColor: '#fff',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      color: '#333'
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px',
      borderBottom: '2px solid #34495e',
      paddingBottom: '20px'
    },
    title: {
      fontSize: '24px',
      color: '#2c3e50',
      marginBottom: '5px',
      fontWeight: 'bold'
    },
    subtitle: {
      fontSize: '14px',
      color: '#7f8c8d',
      marginBottom: '0'
    },
    basicInfoSection: {
      marginBottom: '25px',
      padding: '15px',
      backgroundColor: '#f8f9fa',
      borderRadius: '5px'
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#2c3e50',
      marginBottom: '15px',
      paddingBottom: '5px',
      borderBottom: '1px solid #ddd'
    },
    fieldRow: {
      display: 'flex',
      marginBottom: '8px'
    },
    fieldLabel: {
      width: '150px',
      fontWeight: 'bold',
      color: '#555'
    },
    fieldValue: {
      flex: 1,
      color: '#333'
    },
    factorsSection: {
      marginBottom: '25px'
    },
    factorGroup: {
      marginBottom: '20px',
      padding: '15px',
      backgroundColor: '#f8f9fa',
      borderRadius: '5px'
    },
    factorRow: {
      display: 'flex',
      marginBottom: '5px',
      padding: '3px 0'
    },
    factorLabel: {
      flex: 3,
      fontWeight: 'normal',
      color: '#555'
    },
    factorScore: {
      flex: 1,
      textAlign: 'center',
      fontWeight: 'bold',
      color: '#333'
    },
    riskSection: {
      marginBottom: '25px',
      padding: '20px',
      borderRadius: '5px',
      border: '1px solid',
      borderColor: riskColor?.text || '#ccc',
      backgroundColor: riskColor?.bg || '#f8f9fa'
    },
    riskHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '15px',
      paddingBottom: '10px',
      borderBottom: '1px solid',
      borderColor: riskColor?.text ? `${riskColor.text}30` : '#ddd'
    },
    riskCategory: {
      fontWeight: 'bold',
      fontSize: '20px',
      color: riskColor?.text || '#333'
    },
    riskScore: {
      fontWeight: 'bold',
      fontSize: '20px',
      color: riskColor?.text || '#333',
      padding: '5px 15px',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      borderRadius: '20px'
    },
    requirementsText: {
      lineHeight: '1.5',
      color: '#333'
    },
    commentsSection: {
      marginBottom: '25px',
      padding: '15px',
      backgroundColor: '#f8f9fa',
      borderRadius: '5px'
    },
    footerSection: {
      marginTop: '30px',
      borderTop: '1px solid #ddd',
      paddingTop: '15px',
      fontSize: '12px',
      color: '#777'
    }
  };

  // The PDF Export JSX
  return (
    <div ref={ref} style={styles.pdfContainer}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Forest Road Risk Assessment</h1>
        <p style={styles.subtitle}>Generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
      
      {/* Basic Information */}
      <div style={styles.basicInfoSection}>
        <h2 style={styles.sectionTitle}>Road Information</h2>
        
        <div style={styles.fieldRow}>
          <span style={styles.fieldLabel}>Road Name:</span>
          <span style={styles.fieldValue}>{basicInfo.roadName || 'Not specified'}</span>
        </div>
        
        <div style={styles.fieldRow}>
          <span style={styles.fieldLabel}>Road Segment:</span>
          <span style={styles.fieldValue}>
            {basicInfo.startKm ? `${basicInfo.startKm} km` : 'Start'} to {basicInfo.endKm ? `${basicInfo.endKm} km` : 'End'}
          </span>
        </div>
        
        <div style={styles.fieldRow}>
          <span style={styles.fieldLabel}>Start Coordinates:</span>
          <span style={styles.fieldValue}>
            {basicInfo.startLat && basicInfo.startLong 
              ? `${basicInfo.startLat}, ${basicInfo.startLong}` 
              : 'Not specified'
            }
          </span>
        </div>
        
        <div style={styles.fieldRow}>
          <span style={styles.fieldLabel}>End Coordinates:</span>
          <span style={styles.fieldValue}>
            {basicInfo.endLat && basicInfo.endLong 
              ? `${basicInfo.endLat}, ${basicInfo.endLong}` 
              : 'Not specified'
            }
          </span>
        </div>
        
        <div style={styles.fieldRow}>
          <span style={styles.fieldLabel}>Assessment Date:</span>
          <span style={styles.fieldValue}>{formatDate(basicInfo.date)}</span>
        </div>
        
        <div style={styles.fieldRow}>
          <span style={styles.fieldLabel}>Inspector:</span>
          <span style={styles.fieldValue}>{basicInfo.inspector || 'Not specified'}</span>
        </div>
      </div>
      
      {/* Hazard Factors */}
      <div style={styles.factorsSection}>
        <h2 style={styles.sectionTitle}>Hazard Factors</h2>
        
        <div style={styles.factorGroup}>
          {renderFactorScore('Terrain Stability', hazardFactors.terrainStability)}
          {renderFactorScore('Slope Grade', hazardFactors.slopeGrade)}
          {renderFactorScore('Geology/Soil', hazardFactors.geologySoil)}
          {renderFactorScore('Drainage Conditions', hazardFactors.drainageConditions)}
          {renderFactorScore('Road Failure History', hazardFactors.roadFailureHistory)}
          
          <div style={{
            marginTop: '10px',
            paddingTop: '10px',
            borderTop: '1px solid #ddd',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span style={{fontWeight: 'bold', color: '#333'}}>Total Hazard Score:</span>
            <span style={{fontWeight: 'bold', color: '#333'}}>
              {Object.values(hazardFactors).reduce((sum, value) => sum + value, 0)}
            </span>
          </div>
        </div>
      </div>
      
      {/* Consequence Factors */}
      <div style={styles.factorsSection}>
        <h2 style={styles.sectionTitle}>Consequence Factors</h2>
        
        <div style={styles.factorGroup}>
          {renderFactorScore('Proximity to Water', consequenceFactors.proximityToWater)}
          {renderFactorScore('Drainage Structure', consequenceFactors.drainageStructure)}
          {renderFactorScore('Public/Industrial Use', consequenceFactors.publicIndustrialUse)}
          {renderFactorScore('Environmental Value', consequenceFactors.environmentalValue)}
          
          <div style={{
            marginTop: '10px',
            paddingTop: '10px',
            borderTop: '1px solid #ddd',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span style={{fontWeight: 'bold', color: '#333'}}>Total Consequence Score:</span>
            <span style={{fontWeight: 'bold', color: '#333'}}>
              {Object.values(consequenceFactors).reduce((sum, value) => sum + value, 0)}
            </span>
          </div>
        </div>
      </div>
      
      {/* Risk Assessment Results */}
      <div style={styles.riskSection}>
        <div style={styles.riskHeader}>
          <div style={styles.riskCategory}>{riskCategory} Risk</div>
          <div style={styles.riskScore}>{riskScore}</div>
        </div>
        
        <h3 style={{
          fontSize: '16px',
          fontWeight: 'bold',
          marginBottom: '10px',
          color: riskColor?.text || '#333'
        }}>
          Professional Resource Requirements:
        </h3>
        
        <p style={styles.requirementsText}>
          {requirements}
        </p>
      </div>
      
      {/* Comments Section */}
      {comments && (
        <div style={styles.commentsSection}>
          <h2 style={styles.sectionTitle}>Comments & Observations</h2>
          <p style={{whiteSpace: 'pre-wrap', lineHeight: '1.5'}}>
            {comments || 'No comments provided'}
          </p>
        </div>
      )}
      
      {/* Footer */}
      <div style={styles.footerSection}>
        <p>This assessment is based on visual observations and conditions at the time of inspection. 
        Assessment protocols follow provincial guidelines for forest road management.</p>
        <p>Generated by AI Forester App • Copyright © {new Date().getFullYear()}</p>
      </div>
    </div>
  );
});

export default PDFExport;