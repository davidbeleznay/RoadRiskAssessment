// src/components/LikelihoodGuidance.js
// Detailed likelihood assessment guidance with probability framework

import React from 'react';

const LikelihoodGuidance = () => {
  return (
    <div style={{
      background: '#e3f2fd',
      padding: '20px',
      borderRadius: '8px',
      border: '3px solid #2196f3',
      marginBottom: '20px'
    }}>
      <h3 style={{color: '#1976d2', marginTop: 0}}>
        Understanding Likelihood - Probability of Failure
      </h3>
      
      <div style={{
        background: 'white',
        padding: '14px',
        borderRadius: '6px',
        marginBottom: '16px',
        border: '2px solid #4caf50'
      }}>
        <div style={{fontWeight: 'bold', color: '#2e7d32', marginBottom: '8px', fontSize: '15px'}}>
          📊 Likelihood = Probability within 20-Year Period
        </div>
        <div style={{fontSize: '14px', lineHeight: '1.6', color: '#555'}}>
          Likelihood ratings estimate the probability of road failure (landslide, washout, significant erosion) 
          occurring within the next <strong>20 years</strong>. This aligns with typical road design life and 
          professional practice standards.
        </div>
      </div>

      <div style={{display: 'grid', gap: '12px'}}>
        {/* High Likelihood */}
        <div style={{
          background: 'white',
          padding: '14px',
          borderRadius: '6px',
          border: '2px solid #f44336'
        }}>
          <div style={{fontWeight: 'bold', color: '#f44336', marginBottom: '8px'}}>
            🔴 HIGH Likelihood (Probable or Certain)
          </div>
          <div style={{fontSize: '13px', color: '#555', lineHeight: '1.6'}}>
            <div style={{marginBottom: '8px'}}>
              <strong>Probability:</strong> Event is <strong>probable or certain</strong> to occur within 20 years 
              (e.g., 1 in 5 years to 1 in 10 years = 50-100% chance over 20-year period)
            </div>
            
            <div style={{marginBottom: '6px'}}><strong>Field Indicators:</strong></div>
            <ul style={{marginTop: '4px', marginBottom: '8px', paddingLeft: '20px'}}>
              <li>Road fill on steep slope <strong>&gt;60%</strong></li>
              <li>Instability <strong>likely to occur</strong> in sidecast, fillslopes, or on slope below road</li>
              <li>Active drainage problems (water flowing down road, undermining)</li>
              <li>Recent slide scars or evidence of movement</li>
              <li>Tension cracks developing</li>
              <li>Highly erodible soils (silt, loose sand) with poor drainage</li>
              <li>Springs or seeps actively destabilizing slope</li>
            </ul>

            <div style={{background: '#ffebee', padding: '8px', borderRadius: '4px', fontSize: '12px'}}>
              <strong>Question to ask:</strong> "If I come back in 5-10 years, will this section likely have failed?"
            </div>
          </div>
        </div>

        {/* Moderate Likelihood */}
        <div style={{
          background: 'white',
          padding: '14px',
          borderRadius: '6px',
          border: '2px solid #ff9800'
        }}>
          <div style={{fontWeight: 'bold', color: '#ff9800', marginBottom: '8px'}}>
            🟠 MODERATE Likelihood (Not Likely But Possible)
          </div>
          <div style={{fontSize: '13px', color: '#555', lineHeight: '1.6'}}>
            <div style={{marginBottom: '8px'}}>
              <strong>Probability:</strong> Event is <strong>not likely but possible</strong> within 20 years 
              (e.g., 1 in 15 years to 1 in 25 years = 20-50% chance over 20-year period)
            </div>
            
            <div style={{marginBottom: '6px'}}><strong>Field Indicators:</strong></div>
            <ul style={{marginTop: '4px', marginBottom: '8px', paddingLeft: '20px'}}>
              <li>Road fill on moderately steep slope <strong>(45-60%)</strong></li>
              <li>No landslide evident currently</li>
              <li>Failure <strong>may be possible in some circumstances</strong> (e.g., misdirected drainage, extreme storm)</li>
              <li>Some drainage concerns but functioning</li>
              <li>Moderately erodible soils</li>
              <li>Minor historical issues (repaired, stable since)</li>
            </ul>

            <div style={{background: '#fff3e0', padding: '8px', borderRadius: '4px', fontSize: '12px'}}>
              <strong>Question to ask:</strong> "Under what conditions could this fail? Are those conditions reasonably possible?"
            </div>
          </div>
        </div>

        {/* Low Likelihood */}
        <div style={{
          background: 'white',
          padding: '14px',
          borderRadius: '6px',
          border: '2px solid #4caf50'
        }}>
          <div style={{fontWeight: 'bold', color: '#4caf50', marginBottom: '8px'}}>
            🟢 LOW Likelihood (Remote Possibility)
          </div>
          <div style={{fontSize: '13px', color: '#555', lineHeight: '1.6'}}>
            <div style={{marginBottom: '8px'}}>
              <strong>Probability:</strong> <strong>Remote possibility</strong> of occurrence within 20 years 
              (e.g., 1 in 30 years to 1 in 50 years = 5-20% chance over 20-year period)
            </div>
            
            <div style={{marginBottom: '6px'}}><strong>Field Indicators:</strong></div>
            <ul style={{marginTop: '4px', marginBottom: '8px', paddingLeft: '20px'}}>
              <li>Road fill on gentle to moderate slope <strong>(&lt;45%)</strong></li>
              <li>No landslide evident</li>
              <li>Landslide <strong>highly unlikely</strong> even under extreme conditions</li>
              <li>Good drainage systems functioning properly</li>
              <li>Cohesive soils (clay, till)</li>
              <li>No historical failures</li>
              <li>Stable terrain, well-vegetated slopes</li>
            </ul>

            <div style={{background: '#e8f5e9', padding: '8px', borderRadius: '4px', fontSize: '12px'}}>
              <strong>Question to ask:</strong> "What would it take for this to fail? Only extreme, unlikely events?"
            </div>
          </div>
        </div>

        {/* Very Low Likelihood */}
        <div style={{
          background: 'white',
          padding: '14px',
          borderRadius: '6px',
          border: '2px solid #2196f3'
        }}>
          <div style={{fontWeight: 'bold', color: '#2196f3', marginBottom: '8px'}}>
            🔵 VERY LOW Likelihood (Very Remote Possibility)
          </div>
          <div style={{fontSize: '13px', color: '#555', lineHeight: '1.6'}}>
            <div style={{marginBottom: '8px'}}>
              <strong>Probability:</strong> <strong>Very remote possibility</strong> within 20 years 
              (e.g., &gt;1 in 50 years = &lt;5% chance over 20-year period)
            </div>
            
            <div style={{marginBottom: '6px'}}><strong>Field Indicators:</strong></div>
            <ul style={{marginTop: '4px', marginBottom: '8px', paddingLeft: '20px'}}>
              <li>Road on <strong>flat terrain</strong> OR no fillslope present</li>
              <li>Full-bench construction (cut only, no fill)</li>
              <li>Minimal slope gradient</li>
              <li>Excellent drainage design</li>
              <li>Virtually no possibility of failure</li>
            </ul>

            <div style={{background: '#e3f2fd', padding: '8px', borderRadius: '4px', fontSize: '12px'}}>
              <strong>Question to ask:</strong> "Is failure practically impossible here?"
            </div>
          </div>
        </div>
      </div>

      {/* How to Determine Probability */}
      <div style={{
        background: 'white',
        padding: '16px',
        borderRadius: '6px',
        marginTop: '16px',
        border: '2px solid #9c27b0'
      }}>
        <div style={{fontWeight: 'bold', color: '#9c27b0', marginBottom: '10px', fontSize: '15px'}}>
          🎯 How to Determine Probability of Failure
        </div>
        
        <div style={{fontSize: '13px', lineHeight: '1.7', color: '#555'}}>
          <div style={{marginBottom: '10px'}}>
            <strong>Consider multiple factors together:</strong>
          </div>

          <div style={{marginBottom: '12px'}}>
            <strong>1. Terrain & Slope:</strong>
            <ul style={{marginTop: '4px', paddingLeft: '20px'}}>
              <li>&gt;60% slope = High likelihood baseline</li>
              <li>45-60% slope = Moderate likelihood baseline</li>
              <li>&lt;45% slope = Low likelihood baseline</li>
              <li>Flat or no fill = Very low likelihood</li>
            </ul>
          </div>

          <div style={{marginBottom: '12px'}}>
            <strong>2. Adjust for Site Conditions:</strong>
            <ul style={{marginTop: '4px', paddingLeft: '20px'}}>
              <li><strong>Increase likelihood if:</strong> Poor drainage, erodible soils, springs/seeps, recent activity, tension cracks</li>
              <li><strong>Decrease likelihood if:</strong> Good drainage, cohesive soils, rock armor, recent upgrades, no historical issues</li>
            </ul>
          </div>

          <div style={{marginBottom: '12px'}}>
            <strong>3. Historical Performance:</strong>
            <ul style={{marginTop: '4px', paddingLeft: '20px'}}>
              <li>Has this section failed before? If yes → increase likelihood</li>
              <li>Similar sections nearby failed? If yes → increase likelihood</li>
              <li>Stable for 20+ years with no maintenance? If yes → decrease likelihood</li>
            </ul>
          </div>

          <div style={{marginBottom: '12px'}}>
            <strong>4. Professional Judgment:</strong>
            <ul style={{marginTop: '4px', paddingLeft: '20px'}}>
              <li>What's your gut feeling based on experience?</li>
              <li>Does this road "feel" like it will fail soon?</li>
              <li>Would you be surprised if it failed in next 10 years?</li>
              <li>Compare to similar roads you've seen fail</li>
            </ul>
          </div>

          <div style={{
            background: '#fff3e0',
            padding: '10px',
            borderRadius: '4px',
            marginTop: '12px',
            border: '2px solid #ff9800'
          }}>
            <strong style={{color: '#f57c00'}}>Remember:</strong> Likelihood is about <strong>when</strong>, 
            not <strong>if</strong>. Even stable-looking roads can eventually fail - the question is whether 
            failure is likely within the road's design life (20 years).
          </div>
        </div>
      </div>

      {/* Reference to Source */}
      <div style={{
        marginTop: '12px',
        padding: '10px',
        background: '#f5f5f5',
        borderRadius: '4px',
        fontSize: '11px',
        color: '#666'
      }}>
        <strong>Source:</strong> Mosaic Road Risk Framework (2025), adapted from BC Watershed Assessment guidelines. 
        Likelihood categories based on probability of occurrence within 20-year planning period.
      </div>
    </div>
  );
};

export default LikelihoodGuidance;
