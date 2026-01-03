// src/components/ProfessionalReferences.js
// Comprehensive professional references with inspection requirements

import React, { useState } from 'react';

const ProfessionalReferences = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const references = [
    {
      id: 'road-inspections',
      title: '🔍 Road Inspection Requirements',
      agency: 'EGBC/FPBC Forest Roads Guidelines',
      year: '2024',
      sections: [
        {
          title: 'Forest Road Inspection Requirements (Section 3.7.1)',
          content: [
            'Inspections must be carried out as prescribed in Road Maintenance Plan',
            'Conducted by or under direct supervision of Road Activity POR',
            'Level of detail varies with road complexity, use, timing, region, infrastructure',
            'Frequency set commensurate with potential for unsafe conditions and environmental hazards',
            'Inspections required after severe storm events'
          ]
        },
        {
          title: 'Inspection Items (Section 3.7.1)',
          content: [
            'Road surface condition and drainage',
            'Ditches and drainage structures',
            'Cut and fill slopes stability',
            'Sight lines and safety',
            'Road prism stability',
            'Vegetation management',
            'Changes in use or users',
            'Access conditions',
            'Retaining walls (may require specialist)'
          ]
        },
        {
          title: 'Inspection Reports (Section 3.7.2)',
          content: [
            'Date of inspection required',
            'Condition assessment for each item inspected',
            'Maintenance recommendations with priority levels',
            'Repair recommendations with reason (structural, safety, environmental)',
            'Photographs of highlighted items, if required',
            'Recommendation for specialist inspection if needed',
            'Date of next scheduled inspection',
            'Authentication by inspector'
          ]
        },
        {
          title: 'Risk-Based Inspection Frequency',
          content: [
            'High-risk roads: More frequent inspections (e.g., annually or semi-annually)',
            'Moderate-risk roads: Regular inspections per maintenance plan',
            'Low-risk roads: Less frequent but documented inspections',
            'Inspection frequency must increase for roads nearing end of design life',
            'Known hazards require increased monitoring (active fans, floodplains, unstable slopes)'
          ]
        }
      ]
    },
    {
      id: 'crossing-inspections',
      title: '🌉 Crossing Inspection Requirements',
      agency: 'EGBC/FPBC Forest Roads Guidelines',
      year: '2024',
      sections: [
        {
          title: 'Crossing Inspection Frequency (Section 3.12.3)',
          content: [
            'Permanent structures (except log/wood culverts): Every 3 years minimum',
            'Temporary retaining walls, bridges, log/wood culverts: Every 2 years minimum',
            'Log stringer bridges: Carefully consider frequency due to potential deterioration',
            'Additional inspections required after severe storm events',
            'Increased frequency when nearing end of design service life',
            'Professional engineer may specify different frequency'
          ]
        },
        {
          title: 'Routine vs Detailed Inspections',
          content: [
            'Routine: Confirm consistency with design, identify standard maintenance needs',
            'Detailed: Required when deficiencies may impact load rating or function',
            'Detailed inspection evaluates current load rating and remaining service life',
            'Required for log structures showing decay or damage',
            'Required within 3 years of end of design service life'
          ]
        },
        {
          title: 'Inspection Report Requirements (Section 3.12.2)',
          content: [
            'Date of inspection',
            'Condition assessment of all structural components',
            'Repair recommendations with priority levels',
            'Photographs including highlighted items',
            'Load rating on date of inspection',
            'Next scheduled inspection date',
            'Authentication by qualified inspector'
          ]
        }
      ]
    },
    {
      id: 'bc-engineering-manual',
      title: '📗 BC Ministry Engineering Manual',
      agency: 'BC Ministry of Forests',
      year: '2025',
      sections: [
        {
          title: 'Forest Service Road (FSR) Management',
          content: [
            'Ministry prioritizes inspections, maintenance based on risk',
            'Risk-based planning processes identify roads for deactivation vs maintenance',
            'Engineering Manual provides policy and technical guidance',
            'Outlines safety and environmental outcomes for inspections',
            'Approximately 58,000 km of FSRs in BC managed by ministry'
          ]
        },
        {
          title: 'Road Inspection Standards (Section 232+)',
          content: [
            'Inspection frequency based on road classification and risk level',
            'Wilderness roads: Minimum maintenance to protect against adverse effects',
            'Industrial roads: Maintained for safe industrial use',
            'Inspection schedules documented in Road Maintenance Plans',
            'Professional engineers oversee inspection programs'
          ]
        },
        {
          title: 'Road Maintenance Plan Requirements (Section 230)',
          content: [
            'Must identify current or expected road use and maintenance purpose',
            'Consider original planning objectives and current conditions',
            'Set frequency and scope of inspections based on risk',
            'Establish priorities for remedial work flowing from inspections',
            'May use SOPs for routine inspection and maintenance tasks',
            'More detailed instructions required for high-risk road sections'
          ]
        }
      ],
      link: 'https://www2.gov.bc.ca/assets/gov/farming-natural-resources-and-industry/natural-resource-use/resource-roads/engineering-manual/engineering_manual.pdf'
    },
    {
      id: 'forest-road-regulation',
      title: '⚖️ Forest Road Regulation',
      agency: 'Forest and Range Practices Act',
      sections: [
        {
          title: 'Road Maintenance Requirements (Section 13)',
          content: [
            'Maintain structural integrity of road prism and clearing width',
            'Ensure drainage systems are functional',
            'Minimize sediment transport and effects on forest resources',
            'Provide safe fish passage at stream crossings',
            'Ensure road can be safely used for intended purposes'
          ]
        },
        {
          title: 'Bridge and Major Culvert Inspections (Section 11)',
          content: [
            'Inspection required every 3 years after construction',
            'Every 2 years if stringers are untreated wood',
            'Inspection after events that might cause damage',
            'Inspection records must be retained for 1 year beyond structure life',
            'Structural deficiencies require professional engineer evaluation',
            'Bridge capacity signage required if unable to carry original design load'
          ]
        }
      ]
    },
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
            'Risk Class 4 (High): High/Moderate combinations',
            'Risk Class 3-2 (Moderate): Various moderate combinations',
            'Risk Class 1 (Low): Very low likelihood or very low delivery'
          ]
        },
        {
          title: 'Likelihood Definitions (20-year period)',
          content: [
            'High: Probable or certain (road fill >60%, instability likely)',
            'Moderate: Not likely but possible (slopes 45-60%)',
            'Low: Remote possibility (slopes <45%)',
            'Very Low: Very remote (flat terrain OR no fillslope)'
          ]
        }
      ],
      link: 'https://www.for.gov.bc.ca/hfd/pubs/Docs/Lmh/Lmh56.htm'
    },
    {
      id: 'lmh-61',
      title: '📗 LMH 61: Managing Watersheds for Hydrogeomorphic Risks',
      agency: 'BC Ministry of Forests',
      year: '2009',
      sections: [
        {
          title: 'Road Management on Fans',
          content: [
            'Six-step hazard recognition scheme',
            'Fan identification and watershed pre-typing',
            'Field verification requirements',
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
          title: 'Hazard Recognition and Prescriptions',
          content: [
            'Six-step process for identifying fan hazards',
            'Road location and design considerations on fans',
            'Development strategies for different hazard levels'
          ]
        }
      ],
      link: 'https://www.for.gov.bc.ca/hfd/pubs/Docs/Lmh/Lmh57.htm'
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
      <h2 style={{color: '#2e7d32', marginTop: 0}}>📚 Professional Standards & Inspection Requirements</h2>
      <p style={{fontSize: '14px', color: '#666', marginBottom: '20px'}}>
        Official guidance from EGBC/FPBC, BC Ministry of Forests, and regulatory frameworks
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
                {ref.agency} {ref.year && `(${ref.year})`}
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
