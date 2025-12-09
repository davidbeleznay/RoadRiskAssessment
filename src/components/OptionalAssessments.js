import React from 'react';
import '../styles/OptionalAssessments.css';

const OptionalAssessments = ({ 
  optionalAssessments, 
  onToggleAssessment,
  assessmentData,
  onUpdateAssessmentData
}) => {
  // Handler for toggling assessment sections
  const handleToggle = (assessmentKey) => {
    onToggleAssessment(assessmentKey);
  };
  
  // Handler for updating field values in an assessment
  const handleFieldChange = (assessmentKey, fieldName, value) => {
    onUpdateAssessmentData(assessmentKey, {
      ...assessmentData[assessmentKey],
      [fieldName]: value
    });
  };
  
  // Add a new item to an array field (e.g., culverts, water crossings)
  const handleAddItem = (assessmentKey, arrayField, newItem) => {
    onUpdateAssessmentData(assessmentKey, {
      ...assessmentData[assessmentKey],
      [arrayField]: [
        ...assessmentData[assessmentKey][arrayField],
        { id: Date.now().toString(), ...newItem }
      ]
    });
  };
  
  // Update an item in an array field
  const handleUpdateItem = (assessmentKey, arrayField, itemId, field, value) => {
    onUpdateAssessmentData(assessmentKey, {
      ...assessmentData[assessmentKey],
      [arrayField]: assessmentData[assessmentKey][arrayField].map(item => 
        item.id === itemId ? { ...item, [field]: value } : item
      )
    });
  };
  
  // Remove an item from an array field
  const handleRemoveItem = (assessmentKey, arrayField, itemId) => {
    onUpdateAssessmentData(assessmentKey, {
      ...assessmentData[assessmentKey],
      [arrayField]: assessmentData[assessmentKey][arrayField].filter(item => item.id !== itemId)
    });
  };
  
  // Specific handlers for each assessment type
  const handleAddCulvert = () => {
    handleAddItem('drainage', 'culverts', {
      location: '',
      size: '',
      condition: '',
      notes: ''
    });
  };
  
  const handleUpdateCulvert = (id, field, value) => {
    handleUpdateItem('drainage', 'culverts', id, field, value);
  };
  
  const handleRemoveCulvert = (id) => {
    handleRemoveItem('drainage', 'culverts', id);
  };
  
  const handleAddWaterCrossing = () => {
    handleAddItem('drainage', 'waterCrossings', {
      type: '',
      streamClass: '',
      width: '',
      notes: ''
    });
  };
  
  const handleUpdateWaterCrossing = (id, field, value) => {
    handleUpdateItem('drainage', 'waterCrossings', id, field, value);
  };
  
  const handleRemoveWaterCrossing = (id) => {
    handleRemoveItem('drainage', 'waterCrossings', id);
  };
  
  return (
    <div className="optional-assessments">
      {/* Soils Assessment */}
      <div className="assessment-section">
        <div className="assessment-header">
          <h3>Soils & Slope Assessment</h3>
          <div className="toggle-switch-container">
            <label className="switch">
              <input 
                type="checkbox" 
                checked={optionalAssessments.soils} 
                onChange={() => handleToggle('soils')}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
        
        {optionalAssessments.soils && (
          <div className="assessment-content">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="soilType">Soil Type</label>
                <select 
                  id="soilType" 
                  value={assessmentData.soils.soilType || ''}
                  onChange={(e) => handleFieldChange('soils', 'soilType', e.target.value)}
                  className="form-select"
                >
                  <option value="">Select...</option>
                  <option value="clay">Clay</option>
                  <option value="silt">Silt</option>
                  <option value="loam">Loam</option>
                  <option value="sandy">Sandy</option>
                  <option value="rocky">Rocky</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="soilDepth">Soil Depth</label>
                <select 
                  id="soilDepth" 
                  value={assessmentData.soils.soilDepth || ''}
                  onChange={(e) => handleFieldChange('soils', 'soilDepth', e.target.value)}
                  className="form-select"
                >
                  <option value="">Select...</option>
                  <option value="shallow">Shallow (&lt;30cm)</option>
                  <option value="moderate">Moderate (30-100cm)</option>
                  <option value="deep">Deep (&gt;100cm)</option>
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="slopeClass">Slope Class</label>
                <select 
                  id="slopeClass" 
                  value={assessmentData.soils.slopeClass || ''}
                  onChange={(e) => handleFieldChange('soils', 'slopeClass', e.target.value)}
                  className="form-select"
                >
                  <option value="">Select...</option>
                  <option value="flat">Flat (0-5%)</option>
                  <option value="gentle">Gentle (5-15%)</option>
                  <option value="moderate">Moderate (15-30%)</option>
                  <option value="steep">Steep (30-60%)</option>
                  <option value="very-steep">Very Steep (&gt;60%)</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="erosionRisk">Erosion Risk</label>
                <select 
                  id="erosionRisk" 
                  value={assessmentData.soils.erosionRisk || ''}
                  onChange={(e) => handleFieldChange('soils', 'erosionRisk', e.target.value)}
                  className="form-select"
                >
                  <option value="">Select...</option>
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                  <option value="very-high">Very High</option>
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group full-width">
                <label htmlFor="soilsComments">Additional Comments</label>
                <textarea 
                  id="soilsComments" 
                  value={assessmentData.soils.comments || ''}
                  onChange={(e) => handleFieldChange('soils', 'comments', e.target.value)}
                  className="form-textarea"
                  rows={3}
                  placeholder="Enter any additional observations about soil and slope conditions..."
                ></textarea>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Drainage Assessment */}
      <div className="assessment-section">
        <div className="assessment-header">
          <h3>Drainage Assessment</h3>
          <div className="toggle-switch-container">
            <label className="switch">
              <input 
                type="checkbox" 
                checked={optionalAssessments.drainage} 
                onChange={() => handleToggle('drainage')}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
        
        {optionalAssessments.drainage && (
          <div className="assessment-content">
            {/* Culvert Information Table */}
            <div className="table-section">
              <h4>Culvert Information</h4>
              
              {assessmentData.drainage.culverts && assessmentData.drainage.culverts.length > 0 && (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Location (km)</th>
                      <th>Size (mm)</th>
                      <th>Condition</th>
                      <th>Notes</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assessmentData.drainage.culverts.map(culvert => (
                      <tr key={culvert.id}>
                        <td>
                          <input
                            type="text"
                            value={culvert.location}
                            onChange={(e) => handleUpdateCulvert(culvert.id, 'location', e.target.value)}
                            className="table-input"
                            placeholder="e.g. 0.4"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={culvert.size}
                            onChange={(e) => handleUpdateCulvert(culvert.id, 'size', e.target.value)}
                            className="table-input"
                            placeholder="e.g. 600"
                          />
                        </td>
                        <td>
                          <select
                            value={culvert.condition}
                            onChange={(e) => handleUpdateCulvert(culvert.id, 'condition', e.target.value)}
                            className="table-select"
                          >
                            <option value="">Select...</option>
                            <option value="good">Good</option>
                            <option value="fair">Fair</option>
                            <option value="poor">Poor</option>
                            <option value="failed">Failed</option>
                          </select>
                        </td>
                        <td>
                          <input
                            type="text"
                            value={culvert.notes}
                            onChange={(e) => handleUpdateCulvert(culvert.id, 'notes', e.target.value)}
                            className="table-input"
                            placeholder="Additional notes"
                          />
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => handleRemoveCulvert(culvert.id)}
                            className="table-button remove"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              
              <button
                type="button"
                onClick={handleAddCulvert}
                className="add-button"
              >
                + Add Culvert
              </button>
            </div>
            
            {/* Water Crossings Table */}
            <div className="table-section">
              <h4>Water Crossings</h4>
              
              {assessmentData.drainage.waterCrossings && assessmentData.drainage.waterCrossings.length > 0 && (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Stream Class</th>
                      <th>Width (m)</th>
                      <th>Notes</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assessmentData.drainage.waterCrossings.map(crossing => (
                      <tr key={crossing.id}>
                        <td>
                          <select
                            value={crossing.type}
                            onChange={(e) => handleUpdateWaterCrossing(crossing.id, 'type', e.target.value)}
                            className="table-select"
                          >
                            <option value="">Select...</option>
                            <option value="culvert">Culvert</option>
                            <option value="bridge">Bridge</option>
                            <option value="ford">Ford</option>
                            <option value="other">Other</option>
                          </select>
                        </td>
                        <td>
                          <select
                            value={crossing.streamClass}
                            onChange={(e) => handleUpdateWaterCrossing(crossing.id, 'streamClass', e.target.value)}
                            className="table-select"
                          >
                            <option value="">Select...</option>
                            <option value="S1">S1 (Fish-bearing ≥20m)</option>
                            <option value="S2">S2 (Fish-bearing 5-20m)</option>
                            <option value="S3">S3 (Fish-bearing 1.5-5m)</option>
                            <option value="S4">S4 (Fish-bearing &lt;1.5m)</option>
                            <option value="S5">S5 (Non-fish ≥3m)</option>
                            <option value="S6">S6 (Non-fish &lt;3m)</option>
                          </select>
                        </td>
                        <td>
                          <input
                            type="text"
                            value={crossing.width}
                            onChange={(e) => handleUpdateWaterCrossing(crossing.id, 'width', e.target.value)}
                            className="table-input"
                            placeholder="e.g. 2.5"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={crossing.notes}
                            onChange={(e) => handleUpdateWaterCrossing(crossing.id, 'notes', e.target.value)}
                            className="table-input"
                            placeholder="Additional notes"
                          />
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => handleRemoveWaterCrossing(crossing.id)}
                            className="table-button remove"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              
              <button
                type="button"
                onClick={handleAddWaterCrossing}
                className="add-button"
              >
                + Add Water Crossing
              </button>
            </div>
            
            {/* Additional Drainage Fields */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ditchConditions">Ditch Conditions</label>
                <select 
                  id="ditchConditions" 
                  value={assessmentData.drainage.ditchConditions || ''}
                  onChange={(e) => handleFieldChange('drainage', 'ditchConditions', e.target.value)}
                  className="form-select"
                >
                  <option value="">Select...</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                  <option value="none">No Ditches Present</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="surfaceWater">Surface Water</label>
                <select 
                  id="surfaceWater" 
                  value={assessmentData.drainage.surfaceWater || ''}
                  onChange={(e) => handleFieldChange('drainage', 'surfaceWater', e.target.value)}
                  className="form-select"
                >
                  <option value="">Select...</option>
                  <option value="none">None</option>
                  <option value="limited">Limited</option>
                  <option value="moderate">Moderate</option>
                  <option value="significant">Significant</option>
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group full-width">
                <label htmlFor="drainageComments">Additional Comments</label>
                <textarea 
                  id="drainageComments" 
                  value={assessmentData.drainage.comments || ''}
                  onChange={(e) => handleFieldChange('drainage', 'comments', e.target.value)}
                  className="form-textarea"
                  rows={3}
                  placeholder="Enter any additional observations about drainage conditions..."
                ></textarea>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Vegetation Assessment */}
      <div className="assessment-section">
        <div className="assessment-header">
          <h3>Vegetation Assessment</h3>
          <div className="toggle-switch-container">
            <label className="switch">
              <input 
                type="checkbox" 
                checked={optionalAssessments.vegetation} 
                onChange={() => handleToggle('vegetation')}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>
        
        {optionalAssessments.vegetation && (
          <div className="assessment-content">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="forestType">Forest Type</label>
                <select 
                  id="forestType" 
                  value={assessmentData.vegetation.forestType || ''}
                  onChange={(e) => handleFieldChange('vegetation', 'forestType', e.target.value)}
                  className="form-select"
                >
                  <option value="">Select...</option>
                  <option value="coniferous">Coniferous</option>
                  <option value="deciduous">Deciduous</option>
                  <option value="mixed">Mixed</option>
                  <option value="open">Open/Clearcut</option>
                  <option value="riparian">Riparian</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="dominantSpecies">Dominant Species</label>
                <input 
                  type="text" 
                  id="dominantSpecies" 
                  value={assessmentData.vegetation.dominantSpecies || ''}
                  onChange={(e) => handleFieldChange('vegetation', 'dominantSpecies', e.target.value)}
                  className="form-input"
                  placeholder="e.g. Douglas Fir, Western Hemlock"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="understoryDensity">Understory Density</label>
                <select 
                  id="understoryDensity" 
                  value={assessmentData.vegetation.understoryDensity || ''}
                  onChange={(e) => handleFieldChange('vegetation', 'understoryDensity', e.target.value)}
                  className="form-select"
                >
                  <option value="">Select...</option>
                  <option value="sparse">Sparse</option>
                  <option value="moderate">Moderate</option>
                  <option value="dense">Dense</option>
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group full-width">
                <label htmlFor="vegetationComments">Additional Comments</label>
                <textarea 
                  id="vegetationComments" 
                  value={assessmentData.vegetation.comments || ''}
                  onChange={(e) => handleFieldChange('vegetation', 'comments', e.target.value)}
                  className="form-textarea"
                  rows={3}
                  placeholder="Enter any additional observations about vegetation..."
                ></textarea>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OptionalAssessments;