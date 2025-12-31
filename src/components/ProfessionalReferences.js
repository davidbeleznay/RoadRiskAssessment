// src/components/ProfessionalReferences.js
// Professional references including LMH 56, 57, 61

import React, { useState } from 'react';

const ProfessionalReferences = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const references = [
    {
      id: 'lmh-56',
      title: '📘 LMH 56: Landslide Risk Case Studies',
      agency: 'BC Ministry of Forests',
      year: '2004',
      sections: [
        {
          title: 'Risk Assessment Framework (Table 4a - pg. 119)',
          content: [
            'Official landslide risk matrix: Likelihood × Sediment Delivery = Risk Class (1-5)',
            'Risk Class 5 (Very High): High likelihood + High sediment delivery',
            'Risk Class 4 (High): High/Moderate likelihood + High/Moderate delivery',
            'Risk Class 3 (Moderate): Various moderate combinations',
            'Risk Class 2 (Moderate): Lower risk combinations',
            'Risk Class 1 (Low): Very low likelihood or very low delivery'
          ]
        },
        {
          title: 'Likelihood Definitions (Table 4b)',
          content: [
            'Based on 20-year period for forest development planning',
            'High: Probable or certain (road fill >60%, instability likely in fillslopes)',
            'Moderate: Not likely but possible (slopes 45-60%, may fail with misdirected drainage)',
            'Low: Remote possibility (slopes <45%, landslide highly unlikely)',
            'Very Low: Very remote (flat terrain OR no fillslope)'
          ]
        },
        {
          title: 'Sediment Delivery Potential',
          content: [
            'High: Material enters fish stream at time of event (no runout >75m)',
            'Moderate: Most material deposits; fines may reach stream (75-100m runout)',
            'Low: Coarse material stored; some fines may reach (100-200m runout)',
            'Very Low: Material unlikely to reach value (>200m runout)'
          ]
        },
        {
          title: 'Application to Forest Roads',
          content: [
            'Framework for landslide risk management in forest operations',
            'Case studies demonstrate analysis approaches',
            'Links probability and consequence to risk classification',
            'Guides management prescriptions based on risk class'
          ]
        }
      ],
      link: 'https://www.for.gov.bc.ca/hfd/pubs/Docs/Lmh/Lmh56.htm'
    },
    {
      id: 'lmh-61',
      title: '📗 LMH 61: Managing Watersheds for Hydrogeomorphic Risks on Fans',
      agency: 'BC Ministry of Forests',
      year: '2009',
      sections: [
        {
          title: 'Hydrogeomorphic Hazards',
          content: [
            'Fans subject to floods, debris floods, and debris flows',
            'Forest management activities can exacerbate natural processes',
            'Road construction on fans increases hazard potential',
            'Risk assessment considers watershed-generated processes'
          ]
        },
        {
          title: 'Road Management on Fans',
          content: [
            'Six-step hazard recognition scheme for practitioners',
            'Fan identification, watershed pre-typing, field verification',
            'Prescription development based on hazard level',
            'Monitoring requirements for high-hazard areas'
          ]
        }
      ],
      link: 'https://www.for.gov.bc.ca/hfd/pubs/docs/lmh/lmh61.htm'
    },
    {
      id: 'lmh-57',
      title: '📕 LMH 57: Forest Management on Fans',
      agency: 'BC Ministry of Forests',
      year: '2005',
      sections: [
        {
          title: 'Hazard Recognition',
          content: [
            'Six-step process for identifying fan hazards',
            'Aerial photo interpretation techniques',
            'Field verification of hydrogeomorphic activity',
            'Hazard classification based on watershed characteristics'
          ]
        },
        {
          title: 'General Prescriptions',
          content: [
            'Development strategies for different hazard levels',
            'Road location and design considerations on fans',
            'Minimize disturbance in high-hazard areas',
            'Emergency response planning for high-risk infrastructure'
          ]
        }
      ],
      link: 'https://www.for.gov.bc.ca/hfd/pubs/Docs/Lmh/Lmh57.htm'
    },
    {
      id: 'egbc-fpbc',
      title: '📙 EGBC/FPBC Forest Roads Guidelines',
      agency: 'Engineers and Geoscientists BC & Forest Professionals BC',
      year: '2024',
      version: 'Version 2.0',
      sections: [
        {
          title: 'Simple vs Complex Road Criteria (Section 3.2)',
          content: [
            'Simple Road: slope <40%, stable terrain, adequate drainage',
            'Complex Road: requires professional oversight',
            'Risk-based approach to professional involvement'
          ]
        },
        {
          title: 'Professional Obligations (Section 4.2)',
          content: [
            'Registrant must be personally familiar with site',
            'Exercise duty of care - complete, correct, clear',
            'Document assessment of risks and outcomes'
          ]
        }
      ],
      link: 'https://www.egbc.ca/Practice-Resources/Professional-Practice/Professional-Practice-Guidelines'
    },
    {
      id: 'terrain-stability',
      title: '📔 Terrain Stability Assessment Guidelines',
      agency: 'EGBC & FPBC',
      year: '2010',
      sections: [
        {
          title: 'Terrain Stability Classes',
          content: [
            'Class I-V classification system',
            'Field indicators for each class',
            'Assessment requirements by class'
          ]
        }
      ]
    }
  ];

  return (
    <div style={{
      background: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginTop: '20px'
    }}>
      <h2 style={{color: '#2e7d32', marginTop: 0}}>📚 Professional Standards & References</h2>
      <p style={{fontSize: '14px', color: '#666', marginBottom: '20px'}}>
        Official guidance from BC Ministry of Forests and regulatory bodies
      </p>

      {references.map((ref) => (
        <div key={ref.id} style={{marginBottom: '16px'}}>
          <button
            onClick={() => toggleSection(ref.id)}
            style={{
              width: '100%',
              background: expandedSection === ref.id ? '#e8f5e9' : '#f5f5f5',
              border: expandedSection === ref.id ? '2px solid #4caf50' : '2px solid #e0e0e0',
              padding: '14px',
              borderRadius: '6px',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transition: 'all 0.2s'
            }}
          >
            <div>
              <div style={{fontWeight: 'bold', fontSize: '15px', color: '#2e7d32', marginBottom: '4px'}}>
                {ref.title}
              </div>
              <div style={{fontSize: '12px', color: '#666'}}>
                {ref.agency} {ref.year && `(${ref.year})`} {ref.version}
              </div>
            </div>
            <span style={{fontSize: '20px', color: '#2e7d32'}}>
              {expandedSection === ref.id ? '▼' : '▶'}
            </span>
          </button>

          {expandedSection === ref.id && (
            <div style={{
              background: '#fafafa',
              padding: '16px',
              borderRadius: '0 0 6px 6px',
              borderLeft: '3px solid #4caf50',
              marginTop: '-2px'
            }}>
              {ref.sections.map((section, idx) => (
                <div key={idx} style={{marginBottom: idx < ref.sections.length - 1 ? '16px' : 0}}>
                  <div style={{fontWeight: 'bold', color: '#1976d2', marginBottom: '8px', fontSize: '14px'}}>
                    {section.title}
                  </div>
                  <ul style={{margin: 0, paddingLeft: '20px', fontSize: '13px', lineHeight: '1.6'}}>
                    {section.content.map((item, i) => (
                      <li key={i} style={{marginBottom: '4px', color: '#555'}}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
              
              {ref.link && (
                <div style={{
                  marginTop: '12px',
                  padding: '10px',
                  background: '#e3f2fd',
                  borderRadius: '4px'
                }}>
                  <a 
                    href={ref.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#1976d2',
                      textDecoration: 'none',
                      fontWeight: 'bold',
                      fontSize: '13px'
                    }}
                  >
                    📄 View Full Document →
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      <div style={{
        marginTop: '20px',
        padding: '14px',
        background: '#fff3e0',
        borderRadius: '6px',
        border: '2px solid #ff9800'
      }}>
        <div style={{fontWeight: 'bold', color: '#f57c00', marginBottom: '6px', fontSize: '14px'}}>
          ⚖️ Professional Accountability
        </div>
        <div style={{fontSize: '13px', color: '#555', lineHeight: '1.5'}}>
          These guidelines are mandatory for registered professionals (RPF, P.Eng, P.Geo). 
          All assessments must hold paramount public safety, environmental protection, and sustainable resource management.
          Deviations from guidelines must be documented with written rationale.
        </div>
      </div>
    </div>
  );
};

export default ProfessionalReferences;
