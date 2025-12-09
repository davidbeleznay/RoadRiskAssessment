import React from 'react';

/**
 * Component for radio button selection of risk factors on a 2-4-6-10 scale
 */
const RiskSelector = ({ name, value, onChange, options }) => {
  return (
    <div style={{ display: 'flex', marginBottom: '8px' }}>
      {options.map((option) => (
        <div 
          key={option.value} 
          style={{ 
            flex: 1, 
            textAlign: 'center',
            cursor: 'pointer'
          }}
          onClick={() => onChange({ target: { name, value: option.value } })}
        >
          <div 
            style={{
              backgroundColor: value === option.value ? option.color : '#f5f5f5',
              border: value === option.value ? `2px solid ${option.borderColor || option.color}` : '1px solid #ddd',
              padding: '8px',
              margin: '0 2px',
              borderRadius: '4px',
              fontWeight: value === option.value ? 'bold' : 'normal',
              color: value === option.value ? (option.textColor || '#fff') : '#333',
              transition: 'all 0.2s ease'
            }}
          >
            {option.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RiskSelector;