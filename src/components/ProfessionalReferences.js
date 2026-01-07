import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RoadInspectionGuidance from './RoadInspectionGuidance';

const ProfessionalReferences = () => {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState(null);
  const [showInspectionChecklist, setShowInspectionChecklist] = useState(false);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const references = [
    { id: 'road-inspections', title: '🔍 Road Inspection Requirements', agency: 'EGBC/FPBC Forest Roads Guidelines', year: '2024',
      sections: [{ title: 'Inspection Requirements (Section 3.7.1)', content: ['Carried out as prescribed in Road Maintenance Plan', 'By or under direct supervision of Road Activity POR', 'Level of detail varies with complexity, use, timing, region', 'Frequency based on potential for unsafe conditions and environmental hazards', 'Required after severe storm events'] },
        { title: 'Inspection Report Requirements (Section 3.7.2)', content: ['Date of inspection', 'Condition assessment for each item', 'Maintenance recommendations with priority levels', 'Repair recommendations with reasons (structural, safety, environmental)', 'Photographs of highlighted items', 'Specialist recommendations if needed', 'Next scheduled inspection date', 'Authentication by inspector'] },
        { title: 'Risk-Based Inspection Frequency', content: ['High-risk roads: Annual or more frequent', 'Moderate-risk: Regular per maintenance plan', 'Low-risk: Less frequent but documented', 'Increase frequency when nearing end of design life', 'Known hazards require increased monitoring'] }] },
    { id: 'crossing-inspections', title: '🌉 Crossing Inspection Requirements', agency: 'EGBC/FPBC Section 3.12', year: '2024',
      sections: [{ title: 'Inspection Frequency (Section 3.12.3)', content: ['Permanent structures: Every 3 years minimum', 'Log/wood structures: Every 2 years minimum', 'After severe storm events', 'More frequent when nearing end of design life', 'Professional engineer may specify different frequency'] },
        { title: 'Crossing Elements to Inspect', content: ['All structural components', 'Road approaches and sight lines', 'Road fills and armouring', 'Surface drainage and sediment management', 'Signage', 'Stream interaction with crossing structure', 'Safety and environmental considerations'] },
        { title: 'Report Requirements (Section 3.12.2)', content: ['Current load rating evaluation', 'Remaining design service life estimate', 'Repair recommendations with priority', 'Photographs of highlighted items', 'Next inspection date', 'Authentication'] }] },
    { id: 'bc-engineering-manual', title: '📗 BC Ministry Engineering Manual', agency: 'BC Ministry of Forests', year: '2025',
      sections: [{ title: 'FSR Management & Inspection (Section 232)', content: ['Ministry prioritizes inspections based on risk', '~58,000 km of FSRs managed in BC', 'Engineering Manual provides policy and technical guidance', 'Safety and environmental outcomes defined', 'Risk-based planning for maintenance vs deactivation'] },
        { title: 'Road Maintenance Plans (Section 230)', content: ['Identify current/expected road use', 'Set inspection frequency based on risk', 'Establish priorities for remedial work', 'May use SOPs for routine tasks', 'Detailed instructions for high-risk sections'] }],
      link: 'https://www2.gov.bc.ca/assets/gov/farming-natural-resources-and-industry/natural-resource-use/resource-roads/engineering-manual/engineering_manual.pdf' },
    { id: 'forest-road-regulation', title: '⚖️ Forest Road Regulation (FRPA)', agency: 'Forest and Range Practices Act',
      sections: [{ title: 'Maintenance Requirements (Section 13)', content: ['Maintain structural integrity of road prism', 'Ensure drainage systems functional', 'Minimize sediment transport to streams', 'Provide safe fish passage at crossings', 'Road must be safe for intended use'] },
        { title: 'Bridge/Culvert Inspections (Section 11)', content: ['Every 3 years for permanent structures', 'Every 2 years for untreated wood', 'After events that might cause damage', 'Records retained 1 year beyond structure life', 'Professional engineer evaluation if deficiencies'] }] },
    { id: 'lmh-56', title: '📘 LMH 56: Landslide Risk Case Studies', agency: 'BC Ministry of Forests', year: '2004',
      sections: [{ title: 'Risk Matrix (Table 4a, pg. 119)', content: ['Likelihood × Sediment Delivery = Risk Class (1-5)', 'Class 5 (Very High): High × High', 'Class 4 (High): High/Moderate combinations', 'Class 2-3 (Moderate): Various moderate', 'Class 1 (Low): Very low likelihood or delivery'] }],
      link: 'https://www.for.gov.bc.ca/hfd/pubs/Docs/Lmh/Lmh56.htm' },
    { id: 'lmh-61', title: '📗 LMH 61: Hydrogeomorphic Risks on Fans', agency: 'BC Ministry of Forests', year: '2009', link: 'https://www.for.gov.bc.ca/hfd/pubs/docs/lmh/lmh61.htm' },
    { id: 'lmh-57', title: '📕 LMH 57: Forest Management on Fans', agency: 'BC Ministry of Forests', year: '2005', link: 'https://www.for.gov.bc.ca/hfd/pubs/Docs/Lmh/Lmh57.htm' }
  ];

  return (
    <div style={{padding: '20px', maxWidth: '1000px', margin: '0 auto'}}>
      <div style={{marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px'}}>
        <h2 style={{color: '#2e7d32', margin: 0}}>📚 Professional Standards & Inspection Requirements</h2>
        <button onClick={() => navigate('/')} style={{background: '#666', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'}}>← Back to Home</button>
      </div>
      
      <p style={{fontSize: '14px', color: '#666', marginBottom: '20px'}}>Comprehensive guidance from EGBC/FPBC, BC Ministry, and regulatory frameworks</p>

      <button onClick={() => setShowInspectionChecklist(!showInspectionChecklist)} style={{width: '100%', background: showInspectionChecklist ? 'linear-gradient(135deg, #ff9800, #ffc107)' : 'linear-gradient(135deg, #f57c00, #ff9800)', color: 'white', border: 'none', padding: '18px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 12px rgba(245, 124, 0, 0.4)'}}>
        <span>🔍 ROAD INSPECTION CHECKLIST - Field Guide</span>
        <span style={{fontSize: '24px'}}>{showInspectionChecklist ? '▼' : '▶'}</span>
      </button>

      {showInspectionChecklist && <RoadInspectionGuidance />}

      {references.map((ref) => (
        <div key={ref.id} style={{marginBottom: '16px'}}>
          <button onClick={() => toggleSection(ref.id)} style={{width: '100%', background: expandedSection === ref.id ? '#e8f5e9' : '#f5f5f5', border: expandedSection === ref.id ? '2px solid #4caf50' : '2px solid #e0e0e0', padding: '14px', borderRadius: '6px', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div>
              <div style={{fontWeight: 'bold', fontSize: '15px', color: '#2e7d32', marginBottom: '4px'}}>{ref.title}</div>
              <div style={{fontSize: '12px', color: '#666'}}>{ref.agency} {ref.year && `(${ref.year})`}</div>
            </div>
            <span style={{fontSize: '20px', color: '#2e7d32'}}>{expandedSection === ref.id ? '▼' : '▶'}</span>
          </button>

          {expandedSection === ref.id && (
            <div style={{background: '#fafafa', padding: '16px', borderRadius: '0 0 6px 6px', borderLeft: '3px solid #4caf50', marginTop: '-2px'}}>
              {ref.sections?.map((section, idx) => (
                <div key={idx} style={{marginBottom: idx < ref.sections.length - 1 ? '16px' : 0}}>
                  <div style={{fontWeight: 'bold', color: '#1976d2', marginBottom: '8px', fontSize: '14px'}}>{section.title}</div>
                  <ul style={{margin: 0, paddingLeft: '20px', fontSize: '13px', lineHeight: '1.6'}}>
                    {section.content.map((item, i) => (<li key={i} style={{marginBottom: '4px', color: '#555'}}>{item}</li>))}
                  </ul>
                </div>
              ))}
              {ref.link && (<div style={{marginTop: '12px', padding: '10px', background: '#e3f2fd', borderRadius: '4px'}}><a href={ref.link} target="_blank" rel="noopener noreferrer" style={{color: '#1976d2', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px'}}>📄 View Full Document →</a></div>)}
            </div>
          )}
        </div>
      ))}

      <div style={{marginTop: '20px', padding: '14px', background: '#fff3e0', borderRadius: '6px', border: '2px solid #ff9800'}}>
        <div style={{fontWeight: 'bold', color: '#f57c00', marginBottom: '6px', fontSize: '14px'}}>⚖️ Professional Accountability</div>
        <div style={{fontSize: '13px', color: '#555', lineHeight: '1.5'}}>These guidelines are mandatory for registered professionals (RPF, P.Eng, P.Geo). All assessments must prioritize public safety, environmental protection, and sustainable resource management.</div>
      </div>

      <div style={{marginTop: '20px', textAlign: 'center'}}>
        <button onClick={() => navigate('/')} style={{background: '#2e7d32', color: 'white', border: 'none', padding: '12px 32px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px'}}>← Back to Home</button>
      </div>
    </div>
  );
};

export default ProfessionalReferences;
