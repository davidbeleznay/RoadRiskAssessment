// src/components/LMHRiskMatrix.js
// Official LMH risk matrix from LMH 56 (Table 4a)

import React from 'react';

const LMHRiskMatrix = () => {
  return (
    <div style={{
      background: 'white',
      padding: '20px',
      borderRadius: '8px',
      border: '3px solid #9c27b0',
      marginBottom: '20px'
    }}>
      <h3 style={{color: '#9c27b0', marginTop: 0}}>
        📊 Official LMH Risk Matrix (Table 4a)
      </h3>
      
      <div style={{
        fontSize: '12px',
        color: '#666',
        marginBottom: '16px',
        fontStyle: 'italic'
      }}>
        Source: LMH 56 (Landslide Risk Case Studies, 2004), pg. 119 - Table 4a: Risk Classes
      </div>

      {/* Risk Matrix Table */}
      <div style={{overflowX: 'auto'}}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '13px',
          marginBottom: '16px'
        }}>
          <thead>
            <tr style={{background: '#9c27b0', color: 'white'}}>
              <th style={{padding: '12px', border: '1px solid #ddd', textAlign: 'left'}}>
                Likelihood of<br/>Landslide Occurrence
              </th>
              <th colSpan={4} style={{padding: '12px', border: '1px solid #ddd', textAlign: 'center'}}>
                Sediment Delivery Potential to Value
              </th>
            </tr>
            <tr style={{background: '#e1bee7'}}>
              <th style={{padding: '10px', border: '1px solid #ddd'}}></th>
              <th style={{padding: '10px', border: '1px solid #ddd', textAlign: 'center'}}>High</th>
              <th style={{padding: '10px', border: '1px solid #ddd', textAlign: 'center'}}>Moderate</th>
              <th style={{padding: '10px', border: '1px solid #ddd', textAlign: 'center'}}>Low</th>
              <th style={{padding: '10px', border: '1px solid #ddd', textAlign: 'center'}}>Very Low</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{padding: '10px', border: '1px solid #ddd', fontWeight: 'bold'}}>High</td>
              <td style={{padding: '10px', border: '1px solid #ddd', background: '#ff5252', color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: '16px'}}>5</td>
              <td style={{padding: '10px', border: '1px solid #ddd', background: '#ffc107', textAlign: 'center', fontWeight: 'bold', fontSize: '16px'}}>4</td>
              <td style={{padding: '10px', border: '1px solid #ddd', background: '#ffeb3b', textAlign: 'center', fontWeight: 'bold', fontSize: '16px'}}>3</td>
              <td style={{padding: '10px', border: '1px solid #ddd', background: '#8bc34a', textAlign: 'center', fontWeight: 'bold', fontSize: '16px'}}>1</td>
            </tr>
            <tr>
              <td style={{padding: '10px', border: '1px solid #ddd', fontWeight: 'bold'}}>Moderate</td>
              <td style={{padding: '10px', border: '1px solid #ddd', background: '#ffc107', textAlign: 'center', fontWeight: 'bold', fontSize: '16px'}}>4</td>
              <td style={{padding: '10px', border: '1px solid #ddd', background: '#ffeb3b', textAlign: 'center', fontWeight: 'bold', fontSize: '16px'}}>3</td>
              <td style={{padding: '10px', border: '1px solid #ddd', background: '#ffeb3b', textAlign: 'center', fontWeight: 'bold', fontSize: '16px'}}>2</td>
              <td style={{padding: '10px', border: '1px solid #ddd', background: '#8bc34a', textAlign: 'center', fontWeight: 'bold', fontSize: '16px'}}>1</td>
            </tr>
            <tr>
              <td style={{padding: '10px', border: '1px solid #ddd', fontWeight: 'bold'}}>Low</td>
              <td style={{padding: '10px', border: '1px solid #ddd', background: '#ffeb3b', textAlign: 'center', fontWeight: 'bold', fontSize: '16px'}}>3</td>
              <td style={{padding: '10px', border: '1px solid #ddd', background: '#ffeb3b', textAlign: 'center', fontWeight: 'bold', fontSize: '16px'}}>2</td>
              <td style={{padding: '10px', border: '1px solid #ddd', background: '#ffeb3b', textAlign: 'center', fontWeight: 'bold', fontSize: '16px'}}>2</td>
              <td style={{padding: '10px', border: '1px solid #ddd', background: '#8bc34a', textAlign: 'center', fontWeight: 'bold', fontSize: '16px'}}>1</td>
            </tr>
            <tr>
              <td style={{padding: '10px', border: '1px solid #ddd', fontWeight: 'bold'}}>Very Low</td>
              <td style={{padding: '10px', border: '1px solid #ddd', background: '#8bc34a', textAlign: 'center', fontWeight: 'bold', fontSize: '16px'}}>1</td>
              <td style={{padding: '10px', border: '1px solid #ddd', background: '#8bc34a', textAlign: 'center', fontWeight: 'bold', fontSize: '16px'}}>1</td>
              <td style={{padding: '10px', border: '1px solid #ddd', background: '#8bc34a', textAlign: 'center', fontWeight: 'bold', fontSize: '16px'}}>1</td>
              <td style={{padding: '10px', border: '1px solid #ddd', background: '#8bc34a', textAlign: 'center', fontWeight: 'bold', fontSize: '16px'}}>1</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Risk Class Legend */}
      <div style={{
        background: '#f5f5f5',
        padding: '14px',
        borderRadius: '6px',
        marginBottom: '16px'
      }}>
        <div style={{fontWeight: 'bold', marginBottom: '10px', color: '#333'}}>
          Risk Class Interpretation:
        </div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <div style={{width: '30px', height: '30px', background: '#ff5252', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold'}}>5</div>
            <span style={{fontSize: '13px'}}><strong>Very High</strong></span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <div style={{width: '30px', height: '30px', background: '#ffc107', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>4</div>
            <span style={{fontSize: '13px'}}><strong>High</strong></span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <div style={{width: '30px', height: '30px', background: '#ffeb3b', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>3</div>
            <span style={{fontSize: '13px'}}><strong>Moderate</strong></span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <div style={{width: '30px', height: '30px', background: '#ffeb3b', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>2</div>
            <span style={{fontSize: '13px'}}><strong>Moderate</strong></span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            <div style={{width: '30px', height: '30px', background: '#8bc34a', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>1</div>
            <span style={{fontSize: '13px'}}><strong>Low</strong></span>
          </div>
        </div>
      </div>

      {/* Likelihood Definitions */}
      <div style={{
        background: '#e3f2fd',
        padding: '14px',
        borderRadius: '6px',
        marginBottom: '12px',
        border: '2px solid #2196f3'
      }}>
        <div style={{fontWeight: 'bold', color: '#1976d2', marginBottom: '10px'}}>
          Likelihood of Occurrence (within 20-year period):
        </div>
        <div style={{fontSize: '12px', lineHeight: '1.6', color: '#555'}}>
          <div style={{marginBottom: '6px'}}><strong>High:</strong> Event is probable or certain</div>
          <div style={{marginBottom: '6px'}}><strong>Moderate:</strong> Event is not likely but possible</div>
          <div style={{marginBottom: '6px'}}><strong>Low:</strong> Remote possibility of occurrence</div>
          <div><strong>Very Low:</strong> Very remote possibility; conditions not present for event to occur</div>
        </div>
      </div>

      {/* Sediment Delivery Definitions */}
      <div style={{
        background: '#fff3e0',
        padding: '14px',
        borderRadius: '6px',
        border: '2px solid #ff9800'
      }}>
        <div style={{fontWeight: 'bold', color: '#f57c00', marginBottom: '10px'}}>
          Sediment Delivery Potential to Value:
        </div>
        <div style={{fontSize: '12px', lineHeight: '1.6', color: '#555'}}>
          <div style={{marginBottom: '8px'}}>
            <strong>High:</strong> Landslide material would enter fish stream or impact other value at time of event
          </div>
          <div style={{marginBottom: '8px'}}>
            <strong>Moderate:</strong> Most coarse material deposits in runout zone; fine sediment may reach fish stream
          </div>
          <div style={{marginBottom: '8px'}}>
            <strong>Low:</strong> Some suspended sediment or small woody debris may reach value; coarse material stored
          </div>
          <div>
            <strong>Very Low:</strong> Material unlikely to reach fish habitat or other value
          </div>
        </div>
      </div>

      {/* How to Use */}
      <div style={{
        background: '#f5f5f5',
        padding: '14px',
        borderRadius: '6px',
        marginTop: '12px',
        fontSize: '12px',
        lineHeight: '1.6'
      }}>
        <div style={{fontWeight: 'bold', marginBottom: '8px', color: '#333'}}>
          How to Use This Matrix:
        </div>
        <ol style={{paddingLeft: '20px', margin: 0}}>
          <li style={{marginBottom: '4px'}}>Determine <strong>Likelihood</strong> (High/Moderate/Low/Very Low) based on terrain, slope, soils, drainage</li>
          <li style={{marginBottom: '4px'}}>Determine <strong>Sediment Delivery Potential</strong> (High/Moderate/Low/Very Low) based on runout zones, stream proximity</li>
          <li style={{marginBottom: '4px'}}>Find intersection in matrix → Risk Class (1-5)</li>
          <li>Use risk class to determine management response and inspection frequency</li>
        </ol>
      </div>

      {/* Citation */}
      <div style={{
        marginTop: '12px',
        padding: '10px',
        background: '#e8eaf6',
        borderRadius: '4px',
        fontSize: '11px',
        color: '#666',
        borderLeft: '4px solid #9c27b0'
      }}>
        <strong>Source:</strong> Wise, M.P., G.D. Moore, and D.F. VanDine (editors). 2004. 
        <em>Landslide Risk Case Studies in Forest Development Planning and Operations.</em> 
        BC Ministry of Forests, Research Branch, Victoria, BC. Land Management Handbook No. 56, Table 4a (pg. 119).
        <br/>
        <a href="https://www.for.gov.bc.ca/hfd/pubs/Docs/Lmh/Lmh56.htm" target="_blank" rel="noopener noreferrer" style={{color: '#9c27b0', fontWeight: 'bold', marginTop: '6px', display: 'inline-block'}}>
          📄 View LMH 56 →
        </a>
      </div>
    </div>
  );
};

export default LMHRiskMatrix;
