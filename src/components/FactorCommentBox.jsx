// src/components/FactorCommentBox.jsx
// Reusable comment box component for risk factors

import React from 'react';
import './FactorCommentBox.css';

export function FactorCommentBox({ 
  factorName, 
  value, 
  onChange, 
  placeholder 
}) {
  return (
    <div className="factor-comment-box">
      <label htmlFor={`${factorName}-comment`} className="comment-label">
        📝 Notes/Observations:
      </label>
      <textarea
        id={`${factorName}-comment`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Document specific conditions, observations, measurements, or reasoning for this rating..."}
        rows={3}
        className="comment-textarea"
      />
      <div className="comment-hint">
        💡 These notes will be included in your report and export data
      </div>
    </div>
  );
}

export default FactorCommentBox;
