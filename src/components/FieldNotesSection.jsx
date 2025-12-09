// src/components/FieldNotesSection.jsx
// General field notes section for road assessments - with localStorage persistence

import React, { useState, useEffect } from 'react';
import './FieldNotesSection.css';

export function FieldNotesSection({ onSave }) {
  const [notes, setNotes] = useState({
    hazardObservations: '',
    consequenceObservations: '',
    generalComments: '',
    recommendations: ''
  });

  // Load saved notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('currentFieldNotes');
    if (savedNotes) {
      try {
        const parsed = JSON.parse(savedNotes);
        setNotes(parsed);
        if (onSave) onSave(parsed);
      } catch (error) {
        console.error('Error loading saved notes:', error);
      }
    }
  }, [onSave]);

  const handleChange = (field, value) => {
    const updated = { ...notes, [field]: value };
    setNotes(updated);
    
    // Save to localStorage immediately
    localStorage.setItem('currentFieldNotes', JSON.stringify(updated));
    
    // Call parent callback
    if (onSave) {
      onSave(updated);
    }
  };

  return (
    <div className="field-notes-section">
      <h2>📝 Field Notes & Observations</h2>
      <p className="section-description">
        Document your observations, reasoning, and site-specific details that informed your risk ratings.
        Notes are automatically saved as you type.
      </p>

      <div className="notes-grid">
        <div className="note-field">
          <label htmlFor="hazard-observations">
            <strong>⚠️ Hazard Factor Observations</strong>
          </label>
          <textarea
            id="hazard-observations"
            value={notes.hazardObservations}
            onChange={(e) => handleChange('hazardObservations', e.target.value)}
            placeholder="Document terrain conditions, slope measurements, soil/geology observations, drainage issues, historical failures..."
            rows={4}
          />
        </div>

        <div className="note-field">
          <label htmlFor="consequence-observations">
            <strong>🎯 Consequence Factor Observations</strong>
          </label>
          <textarea
            id="consequence-observations"
            value={notes.consequenceObservations}
            onChange={(e) => handleChange('consequenceObservations', e.target.value)}
            placeholder="Note proximity to water bodies, stream names, fish species, culvert details, road usage patterns, environmental values..."
            rows={4}
          />
        </div>

        <div className="note-field">
          <label htmlFor="general-comments">
            <strong>💬 General Site Comments</strong>
          </label>
          <textarea
            id="general-comments"
            value={notes.generalComments}
            onChange={(e) => handleChange('generalComments', e.target.value)}
            placeholder="Any additional observations, concerns, or context not captured above..."
            rows={3}
          />
        </div>

        <div className="note-field">
          <label htmlFor="recommendations">
            <strong>✅ Recommendations & Action Items</strong>
          </label>
          <textarea
            id="recommendations"
            value={notes.recommendations}
            onChange={(e) => handleChange('recommendations', e.target.value)}
            placeholder="Recommended actions, maintenance needs, follow-up requirements, priority items..."
            rows={3}
          />
        </div>
      </div>

      <div className="notes-saved-indicator">
        💾 Notes auto-save as you type and persist when you navigate away
      </div>
    </div>
  );
}

export default FieldNotesSection;
