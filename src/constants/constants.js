// src/constants/constants.js

// Colors now reference CSS variables for theme support
export const colors = {
  primary: 'var(--primary-color)',
  primaryDark: 'var(--action-color)',
  secondary: 'var(--secondary-color)',
  text: 'var(--text-color)',
  lightText: 'var(--text-light)',
  border: 'var(--border-color)',
  background: 'var(--bg-color)',
  white: 'var(--card-bg)',
  error: 'var(--error-color)',
  warning: 'var(--warning-color)',
  success: 'var(--success-color)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const fonts = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
};

export const sizes = {
  h1: 28,
  h2: 22,
  h3: 18,
  body: 16,
  caption: 14,
  small: 12,
};

export const formatCoordinates = (lat, lng) => {
  if (lat && lng) {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
  return null;
};

export const culvertMaterials = [
  { label: 'Corrugated Metal Pipe (CMP)', value: 'cmp', manningsN: 0.024 },
  { label: 'Concrete', value: 'concrete', manningsN: 0.013 },
  { label: 'High-Density Polyethylene (HDPE)', value: 'hdpe', manningsN: 0.012 },
  { label: 'Polyvinyl Chloride (PVC)', value: 'pvc', manningsN: 0.01 },
];

export const culvertShapes = [
  { label: 'Circular', value: 'circular' },
  { label: 'Arch', value: 'arch' },
  { label: 'Box', value: 'box' },
  { label: 'Elliptical', value: 'elliptical' },
];

export const standardCulvertSizes = {
  circular: [300, 400, 500, 600, 700, 800, 900, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2400], // mm
  arch: [450, 600, 900, 1200, 1500, 1800, 2100, 2400, 2700, 3000], // mm
  box: [600, 900, 1200, 1500, 1800, 2100, 2400, 2700, 3000, 3300, 3600], // mm
  elliptical: [450, 600, 900, 1050, 1200, 1350, 1500, 1650, 1800, 1950, 2100], // mm
};

export const regions = [
  { label: 'British Columbia', value: 'bc' },
  { label: 'California', value: 'california' },
  { label: 'Pacific Northwest', value: 'pnw' },
];

export const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString(undefined, options);
};