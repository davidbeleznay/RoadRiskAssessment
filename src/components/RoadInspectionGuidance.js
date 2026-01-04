// src/components/RoadInspectionGuidance.js
// Detailed road inspection checklist from EGBC/FPBC and Mosaic practices

import React from 'react';

const RoadInspectionGuidance = () => {
  return (
    <div style={{
      background: '#fff3e0',
      padding: '20px',
      borderRadius: '8px',
      border: '3px solid #ff9800',
      marginBottom: '20px'
    }}>
      <h3 style={{color: '#f57c00', marginTop: 0}}>
        🔍 Road Inspection Checklist
      </h3>
      
      <div style={{fontSize: '13px', color: '#666', marginBottom: '16px', fontStyle: 'italic'}}>
        Based on EGBC/FPBC Section 3.7.1 and Mosaic Forest Road Inspection Form (2025)
      </div>

      {/* Inspection Categories */}
      <div style={{display: 'grid', gap: '16px'}}>
        
        {/* Road Surface & Prism */}
        <div style={{background: 'white', padding: '14px', borderRadius: '6px', border: '2px solid #2196f3'}}>
          <div style={{fontWeight: 'bold', color: '#1976d2', marginBottom: '10px', fontSize: '14px'}}>
            🛣️ Road Surface & Prism Stability
          </div>
          <ul style={{margin: 0, paddingLeft: '20px', fontSize: '13px', lineHeight: '1.7'}}>
            <li><strong>Road surface condition:</strong> Rutting, potholes, washouts, erosion</li>
            <li><strong>Road damage:</strong> Structural failures, subsidence, edge failures</li>
            <li><strong>Surface water:</strong> Ponding, channelized flow, sheet flow across road</li>
            <li><strong>Tension cracks:</strong> Parallel to road edge, road surface, indicating instability</li>
            <li><strong>Road prism stability:</strong> Overall structural integrity</li>
            <li><strong>Clearing width:</strong> Adequate sight lines, vegetation encroachment</li>
          </ul>
        </div>

        {/* Slopes */}
        <div style={{background: 'white', padding: '14px', borderRadius: '6px', border: '2px solid #ff9800'}}>
          <div style={{fontWeight: 'bold', color: '#f57c00', marginBottom: '10px', fontSize: '14px'}}>
            ⛰️ Cut & Fill Slope Stability
          </div>
          <ul style={{margin: 0, paddingLeft: '20px', fontSize: '13px', lineHeight: '1.7'}}>
            <li><strong>Fill slope condition:</strong> Bulging, settlement, erosion, raveling</li>
            <li><strong>Cut slope stability:</strong> Rock fall, sloughing, overhanging blocks</li>
            <li><strong>Slides/slumps:</strong> Active or recent landslide activity</li>
            <li><strong>Rock movement:</strong> Fresh debris, unstable blocks</li>
            <li><strong>Erosion patterns:</strong> Gullying, rill erosion, sheet erosion</li>
            <li><strong>Vegetation:</strong> Leaning trees, bare areas indicating movement</li>
          </ul>
        </div>

        {/* Drainage */}
        <div style={{background: 'white', padding: '14px', borderRadius: '6px', border: '2px solid #4caf50'}}>
          <div style={{fontWeight: 'bold', color: '#2e7d32', marginBottom: '10px', fontSize: '14px'}}>
            💧 Drainage Systems
          </div>
          <ul style={{margin: 0, paddingLeft: '20px', fontSize: '13px', lineHeight: '1.7'}}>
            <li><strong>Culverts:</strong> Plugged, damaged, crushed, undersized, outlet erosion</li>
            <li><strong>Clean culverts:</strong> Functioning properly, capacity adequate</li>
            <li><strong>Missing culverts:</strong> Locations where culverts needed but absent</li>
            <li><strong>Ditch condition:</strong> Blocked, eroded, inadequate capacity, silted</li>
            <li><strong>Water bars:</strong> Functioning, damaged, spacing adequate</li>
            <li><strong>Cross ditches:</strong> Properly draining, eroded outlets</li>
            <li><strong>Surface drainage:</strong> Sheet flow, channelization, ponding</li>
          </ul>
        </div>

        {/* Sediment & Water Quality */}
        <div style={{background: 'white', padding: '14px', borderRadius: '6px', border: '2px solid #00bcd4'}}>
          <div style={{fontWeight: 'bold', color: '#0097a7', marginBottom: '10px', fontSize: '14px'}}>
            🌊 Sediment Management & Water Quality
          </div>
          <ul style={{margin: 0, paddingLeft: '20px', fontSize: '13px', lineHeight: '1.7'}}>
            <li><strong>Sediment delivery:</strong> Direct to streams, runout zones, deposition areas</li>
            <li><strong>Discolored water:</strong> Turbidity, silt plumes, sediment-laden runoff</li>
            <li><strong>Stream crossings:</strong> Fish passage, armouring condition, erosion</li>
            <li><strong>Proximity to water:</strong> Distance to fish streams, wetlands</li>
            <li><strong>Erosion control:</strong> Effectiveness of erosion protection measures</li>
          </ul>
        </div>

        {/* Infrastructure */}
        <div style={{background: 'white', padding: '14px', borderRadius: '6px', border: '2px solid #9c27b0'}}>
          <div style={{fontWeight: 'bold', color: '#9c27b0', marginBottom: '10px', fontSize: '14px'}}>
            🏗️ Infrastructure & Structures
          </div>
          <ul style={{margin: 0, paddingLeft: '20px', fontSize: '13px', lineHeight: '1.7'}}>
            <li><strong>Bridges:</strong> Structural integrity, deck condition, approaches</li>
            <li><strong>Major culverts:</strong> Condition, capacity, fish passage</li>
            <li><strong>Retaining walls:</strong> Cracking, bulging, drainage, stability</li>
            <li><strong>Gates:</strong> Functionality, signage, access control</li>
            <li><strong>Signage:</strong> Traffic control, warnings, load limits</li>
          </ul>
        </div>

        {/* Safety & Access */}
        <div style={{background: 'white', padding: '14px', borderRadius: '6px', border: '2px solid #e91e63'}}>
          <div style={{fontWeight: 'bold', color: '#c2185b', marginBottom: '10px', fontSize: '14px'}}>
            ⚠️ Safety & Access Considerations
          </div>
          <ul style={{margin: 0, paddingLeft: '20px', fontSize: '13px', lineHeight: '1.7'}}>
            <li><strong>Sight lines:</strong> Visibility, blind curves, approach sight distance</li>
            <li><strong>Danger trees:</strong> Hazard trees over road, windthrow risk</li>
            <li><strong>Downed trees:</strong> Blocking access, requiring removal</li>
            <li><strong>Impassable sections:</strong> Road unsafe to drive, closure needed</li>
            <li><strong>Changes in use:</strong> Increased traffic, new users, public access</li>
            <li><strong>Access conditions:</strong> Seasonal restrictions, road status</li>
          </ul>
        </div>

        {/* Environmental */}
        <div style={{background: 'white', padding: '14px', borderRadius: '6px', border: '2px solid #8bc34a'}}>
          <div style={{fontWeight: 'bold', color: '#689f38', marginBottom: '10px', fontSize: '14px'}}>
            🌲 Environmental Considerations
          </div>
          <ul style={{margin: 0, paddingLeft: '20px', fontSize: '13px', lineHeight: '1.7'}}>
            <li><strong>Fish streams:</strong> Proximity, crossings, sediment delivery pathways</li>
            <li><strong>Wildlife habitat:</strong> Critical areas, corridors, seasonal use</li>
            <li><strong>Cultural values:</strong> Archaeological sites, culturally modified trees</li>
            <li><strong>Drinking water:</strong> Community watersheds, water intakes</li>
            <li><strong>Sensitive areas:</strong> Riparian zones, wetlands, protected areas</li>
          </ul>
        </div>
      </div>

      {/* Inspection Frequency Guide */}
      <div style={{
        background: 'white',
        padding: '16px',
        borderRadius: '6px',
        marginTop: '16px',
        border: '2px solid #ff5722'
      }}>
        <div style={{fontWeight: 'bold', color: '#ff5722', marginBottom: '10px', fontSize: '14px'}}>
          📅 Risk-Based Inspection Frequency
        </div>
        <div style={{fontSize: '13px', lineHeight: '1.7', color: '#555'}}>
          <div style={{marginBottom: '8px'}}>
            <strong style={{color: '#f44336'}}>🔴 High Risk Roads (Class 4-5):</strong>
            <div style={{paddingLeft: '16px', marginTop: '4px'}}>
              • Inspect annually or more frequently<br/>
              • After every severe storm event<br/>
              • When approaching end of design life<br/>
              • Active monitoring for known hazards (fans, unstable slopes)
            </div>
          </div>
          
          <div style={{marginBottom: '8px'}}>
            <strong style={{color: '#ff9800'}}>🟠 Moderate Risk Roads (Class 2-3):</strong>
            <div style={{paddingLeft: '16px', marginTop: '4px'}}>
              • Regular inspections per Road Maintenance Plan<br/>
              • After significant storm events<br/>
              • Before/after peak use periods
            </div>
          </div>
          
          <div>
            <strong style={{color: '#8bc34a'}}>🟢 Low Risk Roads (Class 1):</strong>
            <div style={{paddingLeft: '16px', marginTop: '4px'}}>
              • Periodic inspections as specified in plan<br/>
              • Opportunistic checks during other activities<br/>
              • Document condition even if infrequent use
            </div>
          </div>
        </div>
      </div>

      {/* Inspection Report Requirements */}
      <div style={{
        background: 'white',
        padding: '16px',
        borderRadius: '6px',
        marginTop: '16px',
        border: '2px solid #1976d2'
      }}>
        <div style={{fontWeight: 'bold', color: '#1976d2', marginBottom: '10px', fontSize: '14px'}}>
          📋 Inspection Report Must Include (EGBC/FPBC 3.7.2)
        </div>
        <ul style={{margin: 0, paddingLeft: '20px', fontSize: '13px', lineHeight: '1.7'}}>
          <li><strong>Date of inspection</strong></li>
          <li><strong>Condition assessment</strong> for each item inspected</li>
          <li><strong>Maintenance recommendations</strong> with priority levels (high/medium/low)</li>
          <li><strong>Repair recommendations</strong> with reasons (structural, safety, environmental)</li>
          <li><strong>Photographs</strong> of items highlighted in inspection (if required)</li>
          <li><strong>Specialist recommendations</strong> for items outside inspector's skill set</li>
          <li><strong>Next scheduled inspection date</strong></li>
          <li><strong>Authentication by inspector</strong> (name, designation)</li>
        </ul>
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
        <strong>Sources:</strong> EGBC/FPBC Forest Roads Guidelines (2024) Section 3.7, 
        Mosaic Forest Road Inspection Form (2025), BC Ministry Engineering Manual (2025)
      </div>
    </div>
  );
};

export default RoadInspectionGuidance;
