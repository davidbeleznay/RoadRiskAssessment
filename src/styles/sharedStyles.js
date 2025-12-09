// Shared styles to maintain consistency across the application
const sharedStyles = {
  // Main container styles
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: '#f9fafb',
    minHeight: '100vh'
  },
  
  // Header styles
  header: {
    color: '#2563eb',
    fontSize: '1.75rem',
    fontWeight: 'bold',
    marginBottom: '8px',
    borderBottom: '2px solid #e5e7eb',
    paddingBottom: '8px'
  },
  
  // Form styles
  form: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    margin: '16px 0'
  },
  formGroup: {
    marginBottom: '16px'
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontWeight: 'bold',
    color: '#1f2937'
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '16px'
  },
  
  // Button styles
  primaryButton: {
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  secondaryButton: {
    backgroundColor: '#9ca3af',
    color: 'white',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  
  // Card styles for dashboard items
  card: {
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
    backgroundColor: 'white',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
  },
  
  // Status message styles
  statusMessage: {
    padding: '12px',
    marginBottom: '16px',
    borderRadius: '6px',
    backgroundColor: '#e9f5e9',
    color: '#1f7a1f',
    border: '1px solid #c3e6cb'
  },
  
  // Link styles
  link: {
    color: '#2563eb',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'color 0.2s'
  },
  
  // Tool button styles (for dashboard)
  toolButton: {
    display: 'block',
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '16px 20px',
    borderRadius: '8px',
    textDecoration: 'none',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: '16px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    border: 'none'
  },
  
  // Section styles
  section: {
    marginTop: '24px',
    paddingTop: '16px',
    borderTop: '1px solid #e5e7eb'
  },
  
  // Badge styles
  badge: {
    fontSize: '0.75rem',
    fontWeight: 'bold',
    padding: '4px 8px',
    borderRadius: '9999px',
    backgroundColor: '#e5e7eb',
    color: '#4b5563'
  },
  
  // Responsive styles
  responsive: {
    button: {
      width: '100%',
      '@media (min-width: 640px)': {
        width: 'auto'
      }
    },
    flexColumn: {
      display: 'flex',
      flexDirection: 'column',
      '@media (min-width: 640px)': {
        flexDirection: 'row'
      }
    }
  }
};

export default sharedStyles;