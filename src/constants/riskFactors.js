/**
 * Constants for the Road Risk Assessment form
 */

// Risk factors with descriptions and default values
export const RISK_FACTORS = {
  slope: {
    title: 'Slope Steepness',
    descriptions: {
      low: 'Less than 30%',
      moderate: '30% to 50%',
      high: 'Greater than 50%'
    },
    defaultValue: 'moderate'
  },
  fillSlope: {
    title: 'Fill Slope',
    descriptions: {
      low: 'Less than 1m high',
      moderate: '1-3m high',
      high: 'Greater than 3m high'
    },
    defaultValue: 'low'
  },
  cutSlope: {
    title: 'Cut Slope Stability',
    descriptions: {
      low: 'Stable, well-vegetated',
      moderate: 'Some erosion evident',
      high: 'Unstable, frequent slides'
    },
    defaultValue: 'low'
  },
  drainageFeatures: {
    title: 'Drainage Features',
    descriptions: {
      low: 'Good cross drains, well-maintained ditches',
      moderate: 'Some functioning drainage features',
      high: 'Poor or missing drainage features'
    },
    defaultValue: 'moderate'
  },
  streamCrossings: {
    title: 'Stream Crossings',
    descriptions: {
      low: 'Bridges or well-sized culverts',
      moderate: 'Adequate crossings with minor issues',
      high: 'Undersized or blocked culverts'
    },
    defaultValue: 'low'
  },
  surfaceMaterial: {
    title: 'Surface Material',
    descriptions: {
      low: 'Gravel or rock surface, good condition',
      moderate: 'Mixed surface with some erosion',
      high: 'Native soil, highly erodible'
    },
    defaultValue: 'moderate'
  }
};

// Risk rating options with color coding
export const RISK_RATING_OPTIONS = [
  { value: 2, label: '2', color: '#28a745', borderColor: '#218838', textColor: '#fff' },
  { value: 4, label: '4', color: '#17a2b8', borderColor: '#138496', textColor: '#fff' },
  { value: 6, label: '6', color: '#ffc107', borderColor: '#d39e00', textColor: '#212529' },
  { value: 10, label: '10', color: '#dc3545', borderColor: '#c82333', textColor: '#fff' }
];

// Calculate overall risk score from individual factor ratings
export const calculateRiskScore = (ratings) => {
  if (!ratings || Object.keys(ratings).length === 0) return 0;
  
  const values = Object.values(ratings).filter(val => typeof val === 'number');
  if (values.length === 0) return 0;
  
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum;
};

// Get risk category based on total score
export const getRiskCategory = (score) => {
  if (score < 24) return 'low';
  if (score < 36) return 'moderate';
  return 'high';
};

// Get recommendation based on risk category
export const getRecommendation = (category) => {
  switch (category) {
    case 'low':
      return 'Regular maintenance recommended. Inspect annually.';
    case 'moderate':
      return 'Enhanced monitoring needed. Consider drainage improvements and surface repairs.';
    case 'high':
      return 'Immediate attention required. Implement mitigation measures for slope stability and drainage.';
    default:
      return 'Complete assessment to receive recommendations.';
  }
};
