/**
 * Constants and default values for the Road Risk Assessment form
 */

// Risk level colors
export const riskColors = {
  veryLow: { bg: '#e6f7ff', text: '#0066cc' },
  low: { bg: '#d4edda', text: '#155724' },
  moderate: { bg: '#fff3cd', text: '#856404' },
  high: { bg: '#ffe0b2', text: '#e65100' },
  veryHigh: { bg: '#f8d7da', text: '#721c24' }
};

// Standard risk options for selectors
export const standardRiskOptions = [
  { value: 2, label: '2', color: '#4CAF50', textColor: '#fff', borderColor: '#388E3C' },
  { value: 4, label: '4', color: '#FFC107', textColor: '#333', borderColor: '#FFA000' },
  { value: 6, label: '6', color: '#FF9800', textColor: '#fff', borderColor: '#F57C00' },
  { value: 10, label: '10', color: '#F44336', textColor: '#fff', borderColor: '#D32F2F' }
];

// Default values for form reset
export const defaultBasicInfo = {
  roadName: '',
  startKm: '',
  endKm: '',
  startLat: '',
  startLong: '',
  endLat: '',
  endLong: '',
  date: new Date().toISOString().split('T')[0],
  inspector: ''
};

export const defaultHazardFactors = {
  terrainStability: 2,
  slopeGrade: 2,
  geologySoil: 2,
  drainageConditions: 2,
  roadFailureHistory: 2
};

export const defaultConsequenceFactors = {
  proximityToWater: 2,
  drainageStructure: 2,
  publicIndustrialUse: 2,
  environmentalValue: 2
};

// Default geotechnical factors with risk levels
export const defaultGeotechnicalFactors = {
  cutSlopeHeight: 'low',
  fillSlopeHeight: 'low',
  bedrockCondition: 'low',
  groundwaterConditions: 'low',
  erosionEvidence: 'low'
};

// Default infrastructure factors with risk levels
export const defaultInfrastructureFactors = {
  roadSurfaceType: 'low',
  ditchCondition: 'low',
  culvertSizing: 'low',
  culvertCondition: 'low',
  roadAge: 'low'
};

// Descriptions for geotechnical factors
export const geotechnicalDescriptions = {
  cutSlopeHeight: {
    low: '<3m',
    moderate: '3-6m',
    high: '>6m'
  },
  fillSlopeHeight: {
    low: '<3m',
    moderate: '3-6m',
    high: '>6m'
  },
  bedrockCondition: {
    low: 'Minimal jointing, favorable orientation',
    moderate: 'Moderate jointing',
    high: 'Highly fractured, adverse orientation'
  },
  groundwaterConditions: {
    low: 'Dry, no seepage',
    moderate: 'Seasonal seepage',
    high: 'Persistent seepage, springs'
  },
  erosionEvidence: {
    low: 'None',
    moderate: 'Minor rilling/gullying',
    high: 'Active erosion, undercutting'
  }
};

// Descriptions for infrastructure factors
export const infrastructureDescriptions = {
  roadSurfaceType: {
    low: 'Well-maintained gravel',
    moderate: 'Basic gravel, some rutting',
    high: 'Native material, significant rutting'
  },
  ditchCondition: {
    low: 'Clean, well-defined',
    moderate: 'Partially vegetated, minor deposits',
    high: 'Filled with sediment/debris'
  },
  culvertSizing: {
    low: 'Adequately sized, aligned with natural drainage',
    moderate: 'Slightly undersized',
    high: 'Significantly undersized, misaligned'
  },
  culvertCondition: {
    low: 'Good condition, no deformation',
    moderate: 'Minor deformation/rusting',
    high: 'Significant deformation, crushed ends'
  },
  roadAge: {
    low: '<5 years',
    moderate: '5-15 years',
    high: '>15 years without major maintenance'
  }
};

// Helper function to determine risk category
export const getRiskCategory = (score) => {
  if (score > 1000) return { category: 'Very High', color: riskColors.veryHigh };
  if (score >= 500 && score <= 1000) return { category: 'High', color: riskColors.high };
  if (score >= 250 && score < 500) return { category: 'Moderate', color: riskColors.moderate };
  if (score >= 150 && score < 250) return { category: 'Low', color: riskColors.low };
  return { category: 'Very Low', color: riskColors.veryLow };
};

// Professional requirements based on risk category
export const getRequirements = (category) => {
  switch(category) {
    case 'Very High':
      return 'Full professional team with CRP and specialist PORs. Geometric design required. Multiple field reviews.';
    case 'High':
      return 'CRP and road activity POR (may be same person for simple roads). Specialist consultation. Field reviews at critical stages.';
    case 'Moderate':
      return 'CRP and road activity POR oversight. Standard designs with field verification.';
    case 'Low':
      return 'Standard oversight by qualified professionals. Routine field reviews.';
    case 'Very Low':
      return 'Routine professional oversight.';
    default:
      return '';
  }
};