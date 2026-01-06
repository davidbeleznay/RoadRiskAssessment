import React from 'react';
import { useNavigate } from 'react-router-dom';

const LMHRiskForm = () => {
  const navigate = useNavigate();
  return (
    <div style={{padding: '20px'}}>
      <h1>LMH Assessment</h1>
      <button onClick={() => navigate('/')}>Back</button>
    </div>
  );
};

export default LMHRiskForm;
