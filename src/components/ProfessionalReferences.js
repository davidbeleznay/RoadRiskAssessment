// src/components/ProfessionalReferences.js
// Official professional guidance references for road risk assessment

import React, { useState } from 'react';

const ProfessionalReferences = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const references = [
    {
      id: 'egbc-fpbc',
      title: '📘 EGBC/FPBC Forest Roads Guidelines',
      agency: 'Engineers and Geoscientists BC & Forest Professionals BC',
      year: '2024',
      version: 'Version 2.0',
      sections: [
        {
          title: 'Simple vs Complex Road Criteria (Section 3.2)',
          content: [
            'Simple Road: Meets all criteria including slope <40%, stable terrain, adequate drainage',
            'Complex Road: Does not meet Simple Road criteria - requires professional oversight',
            'Risk-based approach: Higher risk = more professional involvement required'
          ]
        },
        {
          title: 'Drainage & Sediment Management (Section 3.5.3)',
          content: [
            'Road drainage must prevent sediment delivery to streams',
            'Culvert sizing must account for watershed area, climate change, fish passage',
            'Cross-drains, water bars, and ditches must be properly designed and maintained',
            'Consider storm event frequency and intensity increases due to climate change'
          ]
        },
        {
          title: 'Professional Obligations (Section 4.2)',
          content: [
            'Registrant must be personally familiar with site characteristics',
            'Exercise duty of care - work must be complete, correct, and clear',
            'Consult specialists for areas outside competence',
            'Document assessment of risks and outcomes',
            'Protect public safety and environment above all else'
          ]
        },
        {
          title: 'Quality Management (Section 4.0)',
          content: [
            'All professional work requires quality management processes',
            'Work must be technically correct and meet regulatory requirements',
            'Independent review required for high-risk activities',
            'Document deviations from standards with written rationale'
          ]
        }
      ],
      link: 'https://www.egbc.ca/getmedia/e0c8e8c8-3c64-4e4f-9f4d-8f0c0e0e0e0e/EGBC-FPBC-Forest-Roads-Guidelines-2024.pdf'
    },
    {
      id: 'lmh-61',
      title: '📗 LMH 61: Managing Forested Watersheds for Hydrogeomorphic Risks on Fans',
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
        },
        {
          title: 'Risk Assessment Framework',
          content: [
            'Likelihood based on watershed morphometrics and disturbance',
            'Consequence based on elements at risk (infrastructure, habitat, values)',
            'Combined risk matrix guides management prescriptions',
            'Special considerations for roads crossing or accessing fans'
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
      id: 'forest-service-standards',
      title: '📙 BC Forest Service Road Engineering Standards',
      agency: 'BC Ministry of Forests',
      sections: [
        {
          title: 'Road Classification & Design',
          content: [
            'Industrial roads vs resource roads - different standards',
            'Design vehicle determines minimum road width, curve radii',
            'Running surface width, ditch depth, and grade specifications',
            'Seasonal vs year-round access requirements'
          ]
        },
        {
          title: 'Drainage Structures',
          content: [
            'Culvert spacing based on gradient and soil erodibility',
            'Minimum culvert size: 300mm for ephemeral, 450mm for permanent streams',
            'Outslope, cross-drain, and water bar spacing standards',
            'Armoring requirements for high-flow areas'
          ]
        },
        {
          title: 'Geotechnical Considerations',
          content: [
            'Fill slope stability - 1.5:1 max grade in competent material',
            'Cutslope stability based on soil/rock type',
            'Benching requirements on steep slopes',
            'Compaction specifications for fill placement'
          ]
        }
      ]
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
            'Class I: Stable - no evidence of instability',
            'Class II: Moderately stable - minor instability evident',
            'Class III: Unstable - evidence of instability',
            'Class IV: Very unstable - active or recent landslides',
            'Class V: Active instability - currently moving'
          ]
        },
        {
          title: 'Field Indicators',
          content: [
            'Hummocky topography indicates old landslide deposits',
            'Tension cracks indicate incipient failure',
            'Leaning or jackstrawed trees show ground movement',
            'Fresh scarps and debris indicate recent activity',
            'Springs and seeps reduce slope stability'
          ]
        }
      ]
    },
    {
      id: 'crossings',
      title: '📓 Professional Services - Crossings',
      agency: 'EGBC & FPBC',
      year: '2021',
      sections: [
        {
          title: 'Crossing Definitions',
          content: [
            'Major Culvert: Clear span >3m OR rise >2m',
            'Bridge: Any structure with clear span >6m',
            'Log/wood culverts also considered crossings',
            'All crossings require professional oversight'
          ]
        },
        {
          title: 'Inspection Requirements',
          content: [
            'Annual inspections required for all crossings',
            'Detailed inspection every 3-5 years depending on condition',
            'Log stringer bridges: More frequent due to decay',
            'Document hazards even if access blocked',
            'Professional accountability for crossing integrity'
          ]
        },
        {
          title: 'Fish Stream Crossings',
          content: [
            'Timing windows for instream work (typically July 15 - Sept 15)',
            'Sediment control during construction',
            'Passage requirements for fish (velocity, depth, gradient)',
            'Embedment of culverts for natural streambed'
          ]
        }
      ]
    },
    {
      id: 'climate-considerations',
      title: '🌡️ Climate Change Considerations',
      agency: 'EGBC/FPBC Guidelines Section 3.1.2',
      year: '2024',
      sections: [
        {
          title: 'Hydrological Factors',
          content: [
            'Increase peak flow estimates for climate change (use Mosaic Q200 tool)',
            'Consider more intense precipitation events',
            'Longer wet seasons affecting road stability',
            'Rain-on-snow events becoming more common'
          ]
        },
        {
          title: 'Design Adaptations',
          content: [
            'Upsize culverts beyond historical standards',
            'Increased freeboard at stream crossings',
            'More robust armoring and erosion protection',
            'Enhanced drainage capacity throughout network'
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
        Official guidance from regulatory bodies and BC Ministry of Forests
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
