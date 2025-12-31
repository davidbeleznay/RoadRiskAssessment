// src/components/ConsequenceGuidance.js
// Detailed consequence assessment with road use and updated water assessment

import React from 'react';

const ConsequenceGuidance = () => {
  return (
    <div style={{
      background: '#fff3e0',
      padding: '20px',
      borderRadius: '8px',
      border: '3px solid #ff9800',
      marginBottom: '20px'
    }}>
      <h3 style={{color: '#f57c00', marginTop: 0}}>
        Understanding Consequence - Impact Magnitude
      </h3>
      
      <div style={{
        background: 'white',
        padding: '14px',
        borderRadius: '6px',
        marginBottom: '16px',
        border: '2px solid #f57c00'
      }}>
        <div style={{fontWeight: 'bold', color: '#f57c00', marginBottom: '8px', fontSize: '15px'}}>
          🎯 Consequence = What Gets Harmed + How Badly
        </div>
        <div style={{fontSize: '14px', lineHeight: '1.6', color: '#555'}}>
          Consequence ratings assess the <strong>magnitude and duration of harm</strong> if road failure occurs. 
          Primary factors: sediment delivery to fish streams, infrastructure damage, public safety risk, 
          road use intensity, and impact to environmental/cultural values.
        </div>
      </div>

      <div style={{display: 'grid', gap: '12px'}}>
        {/* High Consequence */}
        <div style={{
          background: 'white',
          padding: '14px',
          borderRadius: '6px',
          border: '2px solid #f44336'
        }}>
          <div style={{fontWeight: 'bold', color: '#f44336', marginBottom: '8px', fontSize: '15px'}}>
            🔴 HIGH Consequence
          </div>
          <div style={{fontSize: '13px', color: '#555', lineHeight: '1.6'}}>
            <div style={{marginBottom: '12px'}}>
              <strong>Definition:</strong> Landslide/failure material would <strong>enter fish stream or impact 
              critical value at time of event</strong>. Value rendered unsafe or unusable. Significant cost and 
              remediation required.
            </div>
            
            <div style={{marginBottom: '10px'}}>
              <strong style={{color: '#1976d2'}}>📍 Sediment Delivery Criteria:</strong>
              <ul style={{marginTop: '4px', paddingLeft: '20px', marginBottom: '8px'}}>
                <li>Failure would enter <strong>fish stream directly</strong></li>
                <li>OR enters non-fish stream with <strong>moderate/high transport</strong> to fish habitat</li>
                <li><strong>Runout zone:</strong> No slope &lt;20% for &gt;75m (material travels directly to stream)</li>
              </ul>
            </div>

            <div style={{marginBottom: '10px'}}>
              <strong style={{color: '#1976d2'}}>🐟 Water Resources:</strong>
              <ul style={{marginTop: '4px', paddingLeft: '20px', marginBottom: '8px'}}>
                <li>Fish-bearing stream within <strong>30m</strong></li>
                <li>Road crosses fish stream (direct impact risk)</li>
                <li>Spawning habitat downstream</li>
                <li>Community drinking water source</li>
                <li>Timing: Failure during migration/spawning season = extreme impact</li>
              </ul>
            </div>

            <div style={{marginBottom: '10px'}}>
              <strong style={{color: '#1976d2'}}>🚗 Road Use & Public Access:</strong>
              <ul style={{marginTop: '4px', paddingLeft: '20px', marginBottom: '8px'}}>
                <li><strong>High traffic volume</strong> (active hauling operations)</li>
                <li><strong>Public road use agreements</strong> in place</li>
                <li>Critical access for emergency services or communities</li>
                <li>Failure would block essential public or commercial access</li>
                <li>Multiple users depend on this road</li>
              </ul>
            </div>

            <div style={{marginBottom: '10px'}}>
              <strong style={{color: '#1976d2'}}>🏗️ Infrastructure:</strong>
              <ul style={{marginTop: '4px', paddingLeft: '20px', marginBottom: '8px'}}>
                <li>Major infrastructure (bridges, large culverts &gt;1800mm)</li>
                <li>Failure would damage critical structures</li>
                <li>High remediation cost (&gt;$100K)</li>
                <li>Extended closure (&gt;1 month)</li>
              </ul>
            </div>

            <div style={{marginBottom: '10px'}}>
              <strong style={{color: '#1976d2'}}>🌲 Environmental/Cultural:</strong>
              <ul style={{marginTop: '4px', paddingLeft: '20px'}}>
                <li>Critical habitat (old growth, wildlife corridors)</li>
                <li>Archaeological sites or culturally modified trees</li>
                <li>Drinking water intake downstream</li>
                <li>Protected or at-risk species present</li>
              </ul>
            </div>

            <div style={{background: '#ffebee', padding: '8px', borderRadius: '4px', fontSize: '12px'}}>
              <strong>Key Question:</strong> "If this fails, does sediment go directly into fish stream? 
              Is critical value or public access immediately impacted?"
            </div>
          </div>
        </div>

        {/* Moderate Consequence */}
        <div style={{
          background: 'white',
          padding: '14px',
          borderRadius: '6px',
          border: '2px solid #ff9800'
        }}>
          <div style={{fontWeight: 'bold', color: '#ff9800', marginBottom: '8px', fontSize: '15px'}}>
            🟠 MODERATE Consequence
          </div>
          <div style={{fontSize: '13px', color: '#555', lineHeight: '1.6'}}>
            <div style={{marginBottom: '12px'}}>
              <strong>Definition:</strong> Most coarse material deposits in runout zone or channel at time of event. 
              <strong>Fine sediment may reach fish stream</strong>. Coarse sediment may transport over time via 
              normal stream processes.
            </div>
            
            <div style={{marginBottom: '10px'}}>
              <strong style={{color: '#1976d2'}}>📍 Sediment Delivery Criteria:</strong>
              <ul style={{marginTop: '4px', paddingLeft: '20px', marginBottom: '8px'}}>
                <li>Enters <strong>non-fish stream with low transport potential</strong> to fish</li>
                <li><strong>Runout zone:</strong> Slope &lt;20% for 75-100m (some deposition occurs)</li>
                <li>Fine sediment reaches fish habitat; coarse stays in runout</li>
                <li>Long-term transport possible but not immediate</li>
              </ul>
            </div>

            <div style={{marginBottom: '10px'}}>
              <strong style={{color: '#1976d2'}}>🐟 Water Resources:</strong>
              <ul style={{marginTop: '4px', paddingLeft: '20px', marginBottom: '8px'}}>
                <li>Non-fish stream <strong>30-100m</strong> from road</li>
                <li>Seasonal drainage channels</li>
                <li>Wetlands within sediment delivery distance</li>
                <li>Fish habitat exists but not immediate/direct connection</li>
              </ul>
            </div>

            <div style={{marginBottom: '10px'}}>
              <strong style={{color: '#1976d2'}}>🚗 Road Use & Public Access:</strong>
              <ul style={{marginTop: '4px', paddingLeft: '20px', marginBottom: '8px'}}>
                <li><strong>Moderate traffic</strong> (periodic hauling, seasonal use)</li>
                <li>Some public access allowed or informal use</li>
                <li>Alternate routes available but inconvenient</li>
                <li>Mixed private/public use considerations</li>
              </ul>
            </div>

            <div style={{marginBottom: '10px'}}>
              <strong style={{color: '#1976d2'}}>🏗️ Infrastructure:</strong>
              <ul style={{marginTop: '4px', paddingLeft: '20px', marginBottom: '8px'}}>
                <li>Standard culverts/infrastructure (600-1400mm)</li>
                <li>Moderate repair costs ($20-100K)</li>
                <li>Short-term closure possible (days to weeks)</li>
              </ul>
            </div>

            <div style={{marginBottom: '10px'}}>
              <strong style={{color: '#1976d2'}}>🌲 Environmental/Cultural:</strong>
              <ul style={{marginTop: '4px', paddingLeft: '20px'}}>
                <li>Some identified environmental values (non-critical)</li>
                <li>Wildlife use but not critical habitat</li>
                <li>Cultural features present but not high significance</li>
              </ul>
            </div>

            <div style={{background: '#fff3e0', padding: '8px', borderRadius: '4px', fontSize: '12px'}}>
              <strong>Key Question:</strong> "If this fails, do fines potentially reach fish over time? 
              Are public access impacts manageable?"
            </div>
          </div>
        </div>

        {/* Low Consequence */}
        <div style={{
          background: 'white',
          padding: '14px',
          borderRadius: '6px',
          border: '2px solid #8bc34a'
        }}>
          <div style={{fontWeight: 'bold', color: '#689f38', marginBottom: '8px', fontSize: '15px'}}>
            🟢 LOW Consequence
          </div>
          <div style={{fontSize: '13px', color: '#555', lineHeight: '1.6'}}>
            <div style={{marginBottom: '12px'}}>
              <strong>Definition:</strong> Some suspended sediment or small woody debris may reach fish stream. 
              <strong>Coarse sediment and large woody debris stored in low-gradient reaches</strong> or runout zones.
            </div>
            
            <div style={{marginBottom: '10px'}}>
              <strong style={{color: '#1976d2'}}>📍 Sediment Delivery Criteria:</strong>
              <ul style={{marginTop: '4px', paddingLeft: '20px', marginBottom: '8px'}}>
                <li>Enters <strong>non-fish stream with very low transport</strong> potential</li>
                <li><strong>Runout zone:</strong> Slope &lt;20% for 100-200m (significant deposition)</li>
                <li>Only fine suspended sediment might reach fish habitat</li>
                <li>Natural filtration by vegetation and terrain</li>
              </ul>
            </div>

            <div style={{marginBottom: '10px'}}>
              <strong style={{color: '#1976d2'}}>🐟 Water Resources:</strong>
              <ul style={{marginTop: '4px', paddingLeft: '20px', marginBottom: '8px'}}>
                <li>Water resources <strong>&gt;100m</strong> away</li>
                <li>No fish streams in sediment delivery path</li>
                <li>Good vegetated buffer zones</li>
                <li>Topography prevents material from reaching water</li>
              </ul>
            </div>

            <div style={{marginBottom: '10px'}}>
              <strong style={{color: '#1976d2'}}>🚗 Road Use & Public Access:</strong>
              <ul style={{marginTop: '4px', paddingLeft: '20px', marginBottom: '8px'}}>
                <li><strong>Minimal use</strong> (deactivation planned, internal access only)</li>
                <li>No public road use agreements</li>
                <li>Private road with limited traffic</li>
                <li>Multiple alternate routes available</li>
              </ul>
            </div>

            <div style={{marginBottom: '10px'}}>
              <strong style={{color: '#1976d2'}}>🏗️ Infrastructure:</strong>
              <ul style={{marginTop: '4px', paddingLeft: '20px', marginBottom: '8px'}}>
                <li>Minor infrastructure (small culverts &lt;600mm)</li>
                <li>Low repair costs (&lt;$20K)</li>
                <li>Easy to bypass or repair quickly</li>
              </ul>
            </div>

            <div style={{marginBottom: '10px'}}>
              <strong style={{color: '#1976d2'}}>🌲 Environmental/Cultural:</strong>
              <ul style={{marginTop: '4px', paddingLeft: '20px'}}>
                <li>No identified special values</li>
                <li>No critical habitat or cultural sites</li>
                <li>Minimal environmental sensitivity</li>
              </ul>
            </div>

            <div style={{background: '#f1f8e9', padding: '8px', borderRadius: '4px', fontSize: '12px'}}>
              <strong>Key Question:</strong> "If this fails, is harm limited to the road itself? 
              No public impact?"
            </div>
          </div>
        </div>

        {/* Very Low Consequence */}
        <div style={{
          background: 'white',
          padding: '14px',
          borderRadius: '6px',
          border: '2px solid #2196f3'
        }}>
          <div style={{fontWeight: 'bold', color: '#2196f3', marginBottom: '8px', fontSize: '15px'}}>
            🔵 VERY LOW Consequence
          </div>
          <div style={{fontSize: '13px', color: '#555', lineHeight: '1.6'}}>
            <div style={{marginBottom: '12px'}}>
              <strong>Definition:</strong> Landslide material <strong>unlikely to reach fish habitat or other 
              value</strong> at time of event or via subsequent transport.
            </div>
            
            <div style={{marginBottom: '10px'}}>
              <strong style={{color: '#1976d2'}}>📍 Sediment Delivery Criteria:</strong>
              <ul style={{marginTop: '4px', paddingLeft: '20px', marginBottom: '8px'}}>
                <li>Failure <strong>would not enter stream</strong></li>
                <li><strong>Runout zone:</strong> Slope &lt;20% for &gt;200m (complete deposition)</li>
                <li>No pathway to water resources</li>
                <li>Material contained on-site</li>
              </ul>
            </div>

            <div style={{marginBottom: '10px'}}>
              <strong style={{color: '#1976d2'}}>All Other Factors:</strong>
              <ul style={{marginTop: '4px', paddingLeft: '20px'}}>
                <li>No water resources nearby</li>
                <li>No critical infrastructure</li>
                <li>Minimal or no use (deactivated)</li>
                <li>No public access</li>
                <li>No identified environmental/cultural values</li>
                <li>Failure impact contained to road itself</li>
              </ul>
            </div>

            <div style={{background: '#e3f2fd', padding: '8px', borderRadius: '4px', fontSize: '12px'}}>
              <strong>Key Question:</strong> "If this fails, is all material contained on-site with zero impact 
              to any values or users?"
            </div>
          </div>
        </div>
      </div>

      {/* Sediment Delivery Assessment */}
      <div style={{
        background: 'white',
        padding: '16px',
        borderRadius: '6px',
        marginTop: '16px',
        border: '2px solid #9c27b0'
      }}>
        <div style={{fontWeight: 'bold', color: '#9c27b0', marginBottom: '10px', fontSize: '15px'}}>
          🌊 How to Assess Sediment Delivery Potential
        </div>
        
        <div style={{fontSize: '13px', lineHeight: '1.7', color: '#555'}}>
          <div style={{marginBottom: '12px'}}>
            <strong>Step 1: Identify Nearest Water Body</strong>
            <ul style={{marginTop: '4px', paddingLeft: '20px'}}>
              <li>Identify streams from maps, field observation, and local knowledge</li>
              <li>Measure horizontal distance from road to water</li>
              <li>Determine if fish-bearing (check fisheries maps, stream surveys, local knowledge)</li>
              <li>Identify any wetlands, lakes, or drainage channels</li>
            </ul>
          </div>

          <div style={{marginBottom: '12px'}}>
            <strong>Step 2: Trace Sediment Delivery Pathway</strong>
            <ul style={{marginTop: '4px', paddingLeft: '20px'}}>
              <li><strong>Direct delivery:</strong> Road failure debris flows straight into stream</li>
              <li><strong>Indirect delivery:</strong> Material enters tributary that feeds into fish stream</li>
              <li><strong>Runout zone:</strong> Is there flat area (&lt;20% slope) that would catch material?</li>
              <li>Measure runout distance: &gt;75m? 75-100m? 100-200m? &gt;200m?</li>
            </ul>
          </div>

          <div style={{marginBottom: '12px'}}>
            <strong>Step 3: Assess Stream Transport Capacity</strong>
            <ul style={{marginTop: '4px', paddingLeft: '20px'}}>
              <li><strong>High transport:</strong> Steep gradient stream, high flows, confined channel</li>
              <li><strong>Moderate transport:</strong> Moderate gradient, seasonal flows</li>
              <li><strong>Low transport:</strong> Low gradient, small flows, wide valley</li>
              <li><strong>Very low transport:</strong> Ephemeral, flat, or no defined channel</li>
            </ul>
          </div>

          <div style={{marginBottom: '12px'}}>
            <strong>Step 4: Evaluate Road Use & Public Impact</strong>
            <ul style={{marginTop: '4px', paddingLeft: '20px'}}>
              <li><strong>Traffic intensity:</strong> Average daily trips, seasonal patterns</li>
              <li><strong>Public access:</strong> Road use agreements, community dependence</li>
              <li><strong>User types:</strong> Commercial hauling, recreational, emergency access</li>
              <li><strong>Alternatives:</strong> Are other routes available if this fails?</li>
            </ul>
          </div>

          <div style={{marginBottom: '12px'}}>
            <strong>Step 5: Consider Infrastructure & Cost</strong>
            <ul style={{marginTop: '4px', paddingLeft: '20px'}}>
              <li><strong>Infrastructure:</strong> Would failure damage culverts, bridges, or other structures?</li>
              <li><strong>Remediation cost:</strong> How much to fix? (&gt;$50K = moderate, &gt;$100K = high)</li>
              <li><strong>Duration:</strong> How long would road be unusable? (&gt;1 month = high)</li>
              <li><strong>Accessibility:</strong> Can repairs be done easily or requires major mobilization?</li>
            </ul>
          </div>

          <div style={{
            background: '#fff3e0',
            padding: '10px',
            borderRadius: '4px',
            marginTop: '12px',
            border: '2px solid #ff9800'
          }}>
            <strong style={{color: '#f57c00'}}>Critical Guiding Questions:</strong>
            <div style={{marginTop: '6px'}}>
              • What is the <strong>vulnerability</strong> of the value?<br/>
              • What is the <strong>nature and magnitude</strong> of potential harm?<br/>
              • Would the value be <strong>rendered unusable or unsafe</strong>?<br/>
              • Is there <strong>significant cost</strong> or public impact?<br/>
              • Are harm mitigation or remediation measures <strong>feasible</strong>?
            </div>
          </div>
        </div>
      </div>

      {/* Quick Reference Table */}
      <div style={{
        background: 'white',
        padding: '16px',
        borderRadius: '6px',
        marginTop: '16px',
        border: '2px solid #2196f3'
      }}>
        <div style={{fontWeight: 'bold', color: '#2196f3', marginBottom: '10px', fontSize: '14px'}}>
          📏 Quick Reference - Runout Zone Thresholds
        </div>
        
        <table style={{width: '100%', fontSize: '12px', borderCollapse: 'collapse'}}>
          <thead>
            <tr style={{background: '#e3f2fd'}}>
              <th style={{padding: '8px', textAlign: 'left', borderBottom: '2px solid #2196f3'}}>Consequence</th>
              <th style={{padding: '8px', textAlign: 'left', borderBottom: '2px solid #2196f3'}}>Runout Zone</th>
              <th style={{padding: '8px', textAlign: 'left', borderBottom: '2px solid #2196f3'}}>Meaning</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{padding: '6px', borderBottom: '1px solid #ddd'}}><strong>High</strong></td>
              <td style={{padding: '6px', borderBottom: '1px solid #ddd'}}>No slope &lt;20% for &gt;75m</td>
              <td style={{padding: '6px', borderBottom: '1px solid #ddd'}}>Material travels directly to stream</td>
            </tr>
            <tr>
              <td style={{padding: '6px', borderBottom: '1px solid #ddd'}}><strong>Moderate</strong></td>
              <td style={{padding: '6px', borderBottom: '1px solid #ddd'}}>Slope &lt;20% for 75-100m</td>
              <td style={{padding: '6px', borderBottom: '1px solid #ddd'}}>Some deposition, fines reach stream</td>
            </tr>
            <tr>
              <td style={{padding: '6px', borderBottom: '1px solid #ddd'}}><strong>Low</strong></td>
              <td style={{padding: '6px', borderBottom: '1px solid #ddd'}}>Slope &lt;20% for 100-200m</td>
              <td style={{padding: '6px', borderBottom: '1px solid #ddd'}}>Most material deposited, minimal impact</td>
            </tr>
            <tr>
              <td style={{padding: '6px'}}><strong>Very Low</strong></td>
              <td style={{padding: '6px'}}>Slope &lt;20% for &gt;200m</td>
              <td style={{padding: '6px'}}>All material contained, no stream entry</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Reference */}
      <div style={{
        marginTop: '12px',
        padding: '10px',
        background: '#f5f5f5',
        borderRadius: '4px',
        fontSize: '11px',
        color: '#666'
      }}>
        <strong>Source:</strong> Mosaic Road Risk Framework (2025), based on BC Watershed Assessment 
        guidelines and LMH 57/61 for sediment delivery potential. Consequence levels based on magnitude 
        and duration of harm to identified values including fish habitat, public access, and infrastructure.
      </div>
    </div>
  );
};

export default ConsequenceGuidance;
