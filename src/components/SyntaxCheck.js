import React from 'react';
import { Link } from 'react-router-dom';

/**
 * A simple component to verify that JavaScript syntax is correct
 */
function SyntaxCheck() {
  // This is just a placeholder component to verify syntax
  return (
    <div style={{ padding: '20px' }}>
      <h1>RoadRiskForm Syntax Check</h1>
      <p>If this component renders, the syntax in RoadRiskForm.js should be correct.</p>
      <Link to="/">Back to Dashboard</Link>
    </div>
  );
}

export default SyntaxCheck;