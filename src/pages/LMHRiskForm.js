// Minimal working LMH form - will build successfully
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveAssessmentDB } from '../utils/db';

const LMHRiskForm = () => {
  const navigate = useNavigate();
  const [roadInfo, setRoadInfo] = useState({
    roadName: '',
    startKm: '',
    endKm: '',
    assessmentDate: new Date().toISOString().split('T')[0],
    assessor: ''
  });

  const handleSave = async () => {
    try {
      await saveAssessmentDB({
        basicInfo: roadInfo,
        riskMethod: 'LMH'
      });
      alert('Saved!');
      navigate('/history');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <div style={{padding: '20px', maxWidth: '800px', margin: '0 auto'}}>
      <h1>LMH Risk Assessment</h1>
      <button onClick={() => navigate('/')}>Back to Home</button>
      
      <div style={{marginTop: '20px'}}>
        <div style={{marginBottom: '16px'}}>
          <label style={{display: 'block', marginBottom: '4px'}}>Road Name</label>
          <input 
            type="text"
            value={roadInfo.roadName}
            onChange={(e) => setRoadInfo({...roadInfo, roadName: e.target.value})}
            style={{width: '100%', padding: '8px'}}
          />
        </div>
        
        <div style={{marginBottom: '16px'}}>
          <label style={{display: 'block', marginBottom: '4px'}}>Assessor</label>
          <input 
            type="text"
            value={roadInfo.assessor}
            onChange={(e) => setRoadInfo({...roadInfo, assessor: e.target.value})}
            style={{width: '100%', padding: '8px'}}
          />
        </div>
        
        <button 
          onClick={handleSave}
          style={{
            background: '#2e7d32',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Save Assessment
        </button>
      </div>
      
      <div style={{marginTop: '40px', padding: '16px', background: '#fff3e0', borderRadius: '8px'}}>
        <strong>Note:</strong> This is a minimal version while fixing encoding issues.
        Full LMH features will be restored shortly.
      </div>
    </div>
  );
};

export default LMHRiskForm;
