// src/pages/EnhancedDashboard.js
// Comprehensive dashboard with charts, filters, KPI tracking, and gamification

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadAssessmentsDB } from '../utils/db';
import { exportToProfessionalPDF } from '../utils/professionalPDF';
import { calculateUserStats, getMotivationalMessage } from '../utils/gamification';

function EnhancedDashboard() {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [filters, setFilters] = useState({
    riskLevel: 'all',
    method: 'all',
    dateRange: 'all',
    searchTerm: ''
  });

  const loadData = useCallback(async () => {
    try {
      const data = await loadAssessmentsDB();
      setAssessments(data);
      calculateStats(data);
      
      // Load gamification stats
      const gStats = await calculateUserStats();
      setUserStats(gStats);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const calculateStats = (data) => {
    const riskDistribution = {
      'Very High': 0,
      'High': 0,
      'Moderate': 0,
      'Low': 0,
      'Very Low': 0
    };

    const methodCount = { Scorecard: 0, LMH: 0 };
    let totalPhotos = 0;
    
    data.forEach(a => {
      const riskLevel = a.data?.riskAssessment?.finalRisk || a.data?.riskAssessment?.riskLevel || a.data?.riskCategory;
      if (riskLevel && riskDistribution.hasOwnProperty(riskLevel)) {
        riskDistribution[riskLevel]++;
      }
      
      const method = a.riskMethod || 'Scorecard';
      methodCount[method] = (methodCount[method] || 0) + 1;
      
      totalPhotos += (a.data?.photos?.length || 0);
    });

    setStats({
      total: data.length,
      riskDistribution,
      methodCount,
      totalPhotos,
      avgPhotosPerAssessment: data.length ? (totalPhotos / data.length).toFixed(1) : 0,
      highRiskCount: riskDistribution['Very High'] + riskDistribution['High']
    });
  };

  const getFilteredAssessments = () => {
    return assessments.filter(a => {
      if (filters.riskLevel !== 'all') {
        const riskLevel = a.data?.riskAssessment?.finalRisk || a.data?.riskAssessment?.riskLevel || a.data?.riskCategory;
        if (filters.riskLevel === 'high-only') {
          if (riskLevel !== 'High' && riskLevel !== 'Very High') return false;
        } else if (riskLevel !== filters.riskLevel) {
          return false;
        }
      }

      if (filters.method !== 'all' && a.riskMethod !== filters.method) {
        return false;
      }

      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const roadName = (a.roadName || a.data?.basicInfo?.roadName || '').toLowerCase();
        const assessor = (a.data?.basicInfo?.assessor || '').toLowerCase();
        if (!roadName.includes(searchLower) && !assessor.includes(searchLower)) {
          return false;
        }
      }

      if (filters.dateRange !== 'all') {
        const assessmentDate = new Date(a.dateCreated);
        const now = new Date();
        const daysDiff = Math.floor((now - assessmentDate) / (1000 * 60 * 60 * 24));
        
        switch(filters.dateRange) {
          case 'week':
            if (daysDiff > 7) return false;
            break;
          case 'month':
            if (daysDiff > 30) return false;
            break;
          case 'quarter':
            if (daysDiff > 90) return false;
            break;
          default:
            break;
        }
      }

      return true;
    });
  };

  const filteredAssessments = getFilteredAssessments();

  const handleViewDetails = (assessment) => {
    navigate(`/assessment/${assessment.id}`);
  };

  const handleExportFiltered = async () => {
    if (filteredAssessments.length === 0) {
      alert('No assessments match your filters');
      return;
    }
    
    alert(`Exporting ${filteredAssessments.length} filtered assessments...`);
  };

  if (isLoading) {
    return (
      <div style={{padding: '40px', textAlign: 'center'}}>
        <div style={{fontSize: '48px'}}>⏳</div>
        <div>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div style={{padding: '20px', maxWidth: '1400px', margin: '0 auto', background: '#f5f5f5', minHeight: '100vh'}}>
      {/* Header */}
      <div style={{marginBottom: '24px', background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <h1 style={{margin: 0, color: '#2e7d32'}}>📊 Road Risk Dashboard</h1>
            <p style={{color: '#666', margin: '4px 0 0 0'}}>Framework implementation tracking & KPI monitoring</p>
          </div>
          <button onClick={() => navigate('/')} style={{
            padding: '10px 20px',
            background: '#f5f5f5',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            ← Home
          </button>
        </div>
      </div>

      {/* Gamification Stats - Streaks & Badges */}
      {userStats && (
        <div style={{
          background: 'linear-gradient(135deg, #6a1b9a 0%, #9c27b0 100%)',
          color: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(156, 39, 176, 0.3)',
          marginBottom: '24px'
        }}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px'}}>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '48px', marginBottom: '8px'}}>
                {userStats.currentStreak > 0 ? '🔥' : '⭐'}
              </div>
              <div style={{fontSize: '32px', fontWeight: 'bold'}}>
                {userStats.currentStreak}
              </div>
              <div style={{fontSize: '13px', opacity: 0.9}}>Day Streak</div>
            </div>

            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '48px', marginBottom: '8px'}}>📅</div>
              <div style={{fontSize: '32px', fontWeight: 'bold'}}>
                {userStats.thisWeek}
              </div>
              <div style={{fontSize: '13px', opacity: 0.9}}>This Week</div>
            </div>

            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '48px', marginBottom: '8px'}}>📆</div>
              <div style={{fontSize: '32px', fontWeight: 'bold'}}>
                {userStats.thisMonth}
              </div>
              <div style={{fontSize: '13px', opacity: 0.9}}>This Month</div>
            </div>

            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '48px', marginBottom: '8px'}}>🏆</div>
              <div style={{fontSize: '32px', fontWeight: 'bold'}}>
                {userStats.longestStreak}
              </div>
              <div style={{fontSize: '13px', opacity: 0.9}}>Best Streak</div>
            </div>
          </div>

          {(() => {
            const message = getMotivationalMessage(userStats);
            return message ? (
              <div style={{
                marginTop: '16px',
                padding: '12px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '8px',
                textAlign: 'center',
                fontSize: '15px',
                fontWeight: '500'
              }}>
                {message.emoji} {message.text}
              </div>
            ) : null;
          })()}

          {userStats.badges && userStats.badges.length > 0 && (
            <div style={{marginTop: '16px'}}>
              <div style={{fontSize: '13px', opacity: 0.9, marginBottom: '8px', textAlign: 'center'}}>
                🏅 Badges Earned ({userStats.badges.length})
              </div>
              <div style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}>
                {userStats.badges.map(badge => (
                  <div key={badge.id} style={{
                    background: 'rgba(255,255,255,0.2)',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }} title={badge.description}>
                    <span style={{fontSize: '20px'}}>{badge.icon}</span>
                    <span>{badge.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* KPI Cards */}
      {stats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)',
            color: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{fontSize: '13px', opacity: 0.9, marginBottom: '8px'}}>Total Assessments</div>
            <div style={{fontSize: '36px', fontWeight: 'bold'}}>{stats.total}</div>
            <div style={{fontSize: '12px', opacity: 0.8, marginTop: '4px'}}>
              {stats.methodCount.Scorecard} Scorecard • {stats.methodCount.LMH} LMH
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #f44336 0%, #ef5350 100%)',
            color: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{fontSize: '13px', opacity: 0.9, marginBottom: '8px'}}>High Risk Roads</div>
            <div style={{fontSize: '36px', fontWeight: 'bold'}}>{stats.highRiskCount}</div>
            <div style={{fontSize: '12px', opacity: 0.8, marginTop: '4px'}}>
              Requiring priority action
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
            color: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{fontSize: '13px', opacity: 0.9, marginBottom: '8px'}}>Photo Documentation</div>
            <div style={{fontSize: '36px', fontWeight: 'bold'}}>{stats.totalPhotos}</div>
            <div style={{fontSize: '12px', opacity: 0.8, marginTop: '4px'}}>
              Avg {stats.avgPhotosPerAssessment} per assessment
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
            color: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{fontSize: '13px', opacity: 0.9, marginBottom: '8px'}}>Coverage</div>
            <div style={{fontSize: '36px', fontWeight: 'bold'}}>
              {Math.round((stats.total / 50) * 100)}%
            </div>
            <div style={{fontSize: '12px', opacity: 0.8, marginTop: '4px'}}>
              Of target network
            </div>
          </div>
        </div>
      )}

      {/* Risk Distribution Chart */}
      {stats && (
        <div style={{
          background: 'white',
          padding: '24px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '24px'
        }}>
          <h2 style={{color: '#2e7d32', marginTop: 0}}>Risk Level Distribution</h2>
          <div style={{marginTop: '20px'}}>
            {Object.entries(stats.riskDistribution).map(([level, count]) => {
              const colors = {
                'Very High': '#f44336',
                'High': '#ff9800',
                'Moderate': '#ffc107',
                'Low': '#4caf50',
                'Very Low': '#2196f3'
              };
              const percentage = stats.total ? Math.round((count / stats.total) * 100) : 0;
              
              return (
                <div key={level} style={{marginBottom: '12px'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px'}}>
                    <span style={{fontWeight: '500'}}>{level} Risk</span>
                    <span style={{color: '#666'}}>{count} ({percentage}%)</span>
                  </div>
                  <div style={{
                    background: '#f0f0f0',
                    height: '24px',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${percentage}%`,
                      height: '100%',
                      background: colors[level],
                      transition: 'width 0.3s',
                      display: 'flex',
                      alignItems: 'center',
                      paddingLeft: '8px',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '13px'
                    }}>
                      {percentage > 10 && `${count}`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filters & Search */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '24px'
      }}>
        <h2 style={{color: '#2e7d32', marginTop: 0, marginBottom: '16px'}}>🔍 Search & Filter</h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
          marginBottom: '16px'
        }}>
          <div>
            <label style={{display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '500'}}>
              Risk Level
            </label>
            <select 
              value={filters.riskLevel}
              onChange={(e) => setFilters(f => ({...f, riskLevel: e.target.value}))}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '14px'
              }}
            >
              <option value="all">All Levels</option>
              <option value="high-only">High Risk Only</option>
              <option value="Very High">Very High</option>
              <option value="High">High</option>
              <option value="Moderate">Moderate</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <label style={{display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '500'}}>
              Assessment Method
            </label>
            <select 
              value={filters.method}
              onChange={(e) => setFilters(f => ({...f, method: e.target.value}))}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '14px'
              }}
            >
              <option value="all">All Methods</option>
              <option value="Scorecard">Scorecard Only</option>
              <option value="LMH">LMH Only</option>
            </select>
          </div>

          <div>
            <label style={{display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '500'}}>
              Date Range
            </label>
            <select 
              value={filters.dateRange}
              onChange={(e) => setFilters(f => ({...f, dateRange: e.target.value}))}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '14px'
              }}
            >
              <option value="all">All Time</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last 90 Days</option>
            </select>
          </div>

          <div>
            <label style={{display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: '500'}}>
              Search
            </label>
            <input
              type="text"
              placeholder="Road name or assessor..."
              value={filters.searchTerm}
              onChange={(e) => setFilters(f => ({...f, searchTerm: e.target.value}))}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                fontSize: '14px'
              }}
            />
          </div>
        </div>

        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{color: '#666', fontSize: '14px'}}>
            Showing <strong>{filteredAssessments.length}</strong> of {assessments.length} assessments
          </div>
          <div style={{display: 'flex', gap: '8px'}}>
            <button
              onClick={() => setFilters({
                riskLevel: 'all',
                method: 'all',
                dateRange: 'all',
                searchTerm: ''
              })}
              style={{
                padding: '6px 12px',
                background: '#f5f5f5',
                border: 'none',
                borderRadius: '4px',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Clear Filters
            </button>
            <button
              onClick={handleExportFiltered}
              disabled={filteredAssessments.length === 0}
              style={{
                padding: '6px 12px',
                background: '#2e7d32',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: 'bold',
                cursor: filteredAssessments.length > 0 ? 'pointer' : 'not-allowed',
                opacity: filteredAssessments.length > 0 ? 1 : 0.5
              }}
            >
              📊 Export Filtered ({filteredAssessments.length})
            </button>
          </div>
        </div>
      </div>

      {/* Assessment List */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{color: '#2e7d32', marginTop: 0}}>📋 Assessments</h2>
        
        {filteredAssessments.length === 0 ? (
          <div style={{padding: '40px', textAlign: 'center', color: '#999'}}>
            No assessments match your filters
          </div>
        ) : (
          <div style={{display: 'grid', gap: '12px'}}>
            {filteredAssessments.map(assessment => {
              const riskLevel = assessment.data?.riskAssessment?.finalRisk || assessment.data?.riskAssessment?.riskLevel || assessment.data?.riskCategory;
              const riskColors = {
                'Very High': '#f44336',
                'High': '#ff9800',
                'Moderate': '#ffc107',
                'Low': '#4caf50'
              };
              
              return (
                <div key={assessment.id} style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '6px',
                  padding: '16px',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '16px',
                  alignItems: 'center',
                  background: '#fafafa',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }} onClick={() => handleViewDetails(assessment)}>
                  <div>
                    <h4 style={{margin: '0 0 8px 0', color: '#333'}}>
                      {assessment.roadName || assessment.data?.basicInfo?.roadName || 'Untitled'}
                    </h4>
                    <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '13px'}}>
                      <span style={{
                        background: assessment.riskMethod === 'LMH' ? '#e1bee7' : '#e6f7ff',
                        color: assessment.riskMethod === 'LMH' ? '#6a1b9a' : '#0066cc',
                        padding: '2px 8px',
                        borderRadius: '3px'
                      }}>
                        {assessment.riskMethod || 'Scorecard'}
                      </span>
                      {riskLevel && (
                        <span style={{
                          background: `${riskColors[riskLevel]}22`,
                          color: riskColors[riskLevel],
                          padding: '2px 8px',
                          borderRadius: '3px',
                          fontWeight: 'bold'
                        }}>
                          {riskLevel}
                        </span>
                      )}
                      {(assessment.data?.photos?.length || 0) > 0 && (
                        <span style={{
                          background: '#e8f5e9',
                          color: '#2e7d32',
                          padding: '2px 8px',
                          borderRadius: '3px'
                        }}>
                          📷 {assessment.data.photos.length}
                        </span>
                      )}
                      <span style={{color: '#999'}}>
                        {new Date(assessment.dateCreated).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div style={{display: 'flex', gap: '8px'}}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        exportToProfessionalPDF(assessment);
                      }}
                      style={{
                        background: '#f44336',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                    >
                      📄 PDF
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default EnhancedDashboard;
