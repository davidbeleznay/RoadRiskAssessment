// src/components/SaveAssessmentButton.jsx
// Save button for road risk assessments

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveAssessment } from '../utils/assessmentStorage';
import './SaveAssessmentButton.css';

export function SaveAssessmentButton({ 
  basicInfo, 
  hazardFactors, 
  consequenceFactors, 
  optionalAssessments,
  fieldNotes,
  riskAssessment,
  disabled 
}) {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const handleSave = () => {
    setIsSaving(true);
    setSaveStatus(null);
    
    try {
      // Prepare assessment data
      const assessmentData = {
        basicInfo,
        hazardFactors,
        consequenceFactors,
        optionalAssessments,
        fieldNotes,
        riskAssessment,
        riskScore: riskAssessment?.riskScore,
        riskCategory: riskAssessment?.riskLevel,
        recommendation: riskAssessment?.priority
      };
      
      // Save it
      const result = saveAssessment(assessmentData);
      
      if (result.success) {
        setSaveStatus({ type: 'success', message: '✅ Assessment saved successfully!' });
        
        // Redirect to history after 1.5 seconds
        setTimeout(() => {
          navigate('/history');
        }, 1500);
      } else {
        setSaveStatus({ type: 'error', message: '❌ Failed to save: ' + result.error });
      }
      
    } catch (error) {
      setSaveStatus({ type: 'error', message: '❌ Error saving assessment' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="save-assessment-container">
      <button
        onClick={handleSave}
        disabled={disabled || isSaving}
        className="save-assessment-button"
      >
        {isSaving ? '💾 Saving...' : '💾 Save Assessment'}
      </button>
      
      {saveStatus && (
        <div className={`save-status ${saveStatus.type}`}>
          {saveStatus.message}
        </div>
      )}
      
      {disabled && (
        <div className="save-hint">
          💡 Complete all required factors to save your assessment
        </div>
      )}
    </div>
  );
}

export default SaveAssessmentButton;
