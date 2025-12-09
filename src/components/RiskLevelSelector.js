import React from 'react';

/**
 * Component for toggling between low, moderate, and high risk levels
 */
const RiskLevelSelector = ({ name, value, onChange, descriptions }) => {
  const riskLevels = [
    { level: 'low', label: 'Low Risk', color: '#d4edda', textColor: '#155724', borderColor: '#c3e6cb' },
    { level: 'moderate', label: 'Moderate Risk', color: '#fff3cd', textColor: '#856404', borderColor: '#ffeeba' },
    { level: 'high', label: 'High Risk', color: '#f8d7da', textColor: '#721c24', borderColor: '#f5c6cb' }
  ];

  return (
    <div style={{ display: 'flex', marginBottom: '8px' }}>
      {riskLevels.map((option) => (
        <div 
          key={option.level} 
          style={{ 
            flex: 1, 
            textAlign: 'center',
            cursor: 'pointer'
          }}
          onClick={() => onChange({ target: { name, value: option.level } })}
        >
          <div 
            style={{
              backgroundColor: value === option.level ? option.color : '#f5f5f5',
              border: value === option.level ? `2px solid ${option.borderColor}` : '1px solid #ddd',
              padding: '8px',
              margin: '0 2px',
              borderRadius: '4px',
              fontWeight: value === option.level ? 'bold' : 'normal',
              color: value === option.level ? option.textColor : '#333',
              transition: 'all 0.2s ease'
            }}
          >
            {option.label}
          </div>
          {descriptions && descriptions[option.level] && (
            <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '4px', textAlign: 'center' }}>
              {descriptions[option.level]}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default RiskLevelSelector;