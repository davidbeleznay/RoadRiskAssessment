// Matrix Risk Assessment with Professional Override Capability
// Updated to match official Road Risk Assessment Scoring System

class MatrixRiskAssessment {
  constructor() {
    // Official risk level ranges based on Hazard × Consequence scores
    this.riskRanges = {
      'Low': { min: 80, max: 250 },      // Updated from 64-250
      'Moderate': { min: 251, max: 750 },
      'High': { min: 751, max: 1400 },
      'Very High': { min: 1401, max: 2000 }
    };

    this.riskColors = {
      'Low': '#4CAF50',           // Green
      'Moderate': '#FFEB3B',      // Yellow
      'High': '#FF9800',          // Orange  
      'Very High': '#F44336'      // Red
    };

    this.riskLevels = ['Low', 'Moderate', 'High', 'Very High'];

    // Score validation ranges based on official methodology
    this.hazardRange = { min: 10, max: 50 }; // 5 factors × (2-10)
    this.consequenceRange = { min: 8, max: 40 }; // 4 factors × (2-10)
  }

  // Calculate risk level from multiplied score with management priorities
  getRiskLevelFromScore(riskScore) {
    let level, reasoning, priority;
    
    if (riskScore >= 1401) {
      level = 'Very High';
      reasoning = 'Critical risk requiring immediate professional attention and comprehensive mitigation';
      priority = 'Immediate action required';
    } else if (riskScore >= 751) {
      level = 'High';
      reasoning = 'Significant risk requiring prompt professional assessment and active management';
      priority = 'Active management required';
    } else if (riskScore >= 251) {
      level = 'Moderate';
      reasoning = 'Moderate risk requiring professional monitoring and planned maintenance';
      priority = 'Enhanced monitoring';
    } else if (riskScore >= 80) {
      level = 'Low';
      reasoning = 'Low risk suitable for routine monitoring and standard maintenance';
      priority = 'Routine maintenance';
    } else {
      level = 'Low';
      reasoning = 'Very low risk with minimal management requirements';
      priority = 'Standard monitoring';
    }

    return { level, reasoning, priority, score: riskScore };
  }

  // Get hazard level description based on score ranges
  getHazardLevelDescription(hazardScore) {
    if (hazardScore >= 40) {
      return 'Very High hazard conditions (multiple critical risk factors present)';
    } else if (hazardScore >= 30) {
      return 'High hazard conditions (several significant risk factors)';
    } else if (hazardScore >= 20) {
      return 'Moderate hazard conditions (some concerning factors identified)';
    } else if (hazardScore >= 15) {
      return 'Low hazard conditions (minimal risk factors present)';
    } else {
      return 'Very low hazard conditions (stable, well-managed conditions)';
    }
  }

  // Get consequence level description based on score ranges
  getConsequenceLevelDescription(consequenceScore) {
    if (consequenceScore >= 32) {
      return 'Very High consequence potential (critical environmental/infrastructure impacts)';
    } else if (consequenceScore >= 24) {
      return 'High consequence potential (significant environmental/infrastructure impacts)';
    } else if (consequenceScore >= 16) {
      return 'Moderate consequence potential (notable local impacts expected)';
    } else if (consequenceScore >= 12) {
      return 'Low consequence potential (limited local impacts)';
    } else {
      return 'Very low consequence potential (minimal expected impacts)';
    }
  }

  // Calculate initial risk assessment from hazard and consequence scores
  calculateInitialRisk(hazardScore, consequenceScore) {
    // Validate input scores
    const validation = this.validateScores(hazardScore, consequenceScore);
    if (!validation.valid) {
      console.warn('Score validation issues:', validation.issues);
    }

    // Calculate risk using multiplication methodology
    const riskScore = hazardScore * consequenceScore;
    const riskAssessment = this.getRiskLevelFromScore(riskScore);
    
    return {
      hazard: {
        score: hazardScore,
        description: this.getHazardLevelDescription(hazardScore)
      },
      consequence: {
        score: consequenceScore,
        description: this.getConsequenceLevelDescription(consequenceScore)
      },
      riskScore: riskScore,
      riskLevel: riskAssessment.level,
      reasoning: riskAssessment.reasoning,
      priority: riskAssessment.priority,
      color: this.riskColors[riskAssessment.level],
      isCalculated: true,
      isOverridden: false,
      finalRisk: riskAssessment.level,
      finalColor: this.riskColors[riskAssessment.level]
    };
  }

  // Apply direct professional override of overall risk level
  applyDirectOverride(initialAssessment, overrideRiskLevel, justification = '') {
    if (!this.riskLevels.includes(overrideRiskLevel)) {
      throw new Error(`Invalid risk level: ${overrideRiskLevel}. Must be one of: ${this.riskLevels.join(', ')}`);
    }

    return {
      ...initialAssessment,
      finalRisk: overrideRiskLevel,
      finalColor: this.riskColors[overrideRiskLevel],
      isOverridden: true,
      overrideJustification: justification,
      overrideDetails: {
        originalRisk: initialAssessment.riskLevel,
        overrideRisk: overrideRiskLevel,
        changed: overrideRiskLevel !== initialAssessment.riskLevel,
        timestamp: new Date().toISOString()
      }
    };
  }

  // Legacy method for backwards compatibility
  applyOverride(initialAssessment, overrideHazard = null, overrideConsequence = null, justification = '') {
    // If this is actually a direct override (overrideHazard is a risk level)
    if (overrideHazard && this.riskLevels.includes(overrideHazard)) {
      return this.applyDirectOverride(initialAssessment, overrideHazard, justification);
    }
    
    // Otherwise, treat as legacy matrix override (deprecated but supported)
    console.warn('Legacy matrix override used - consider using applyDirectOverride instead');
    return initialAssessment;
  }

  // Get management recommendations based on risk level
  getManagementRecommendations(riskLevel) {
    const recommendations = {
      'Low': [
        'Maintain standard documentation',
        'Include in routine maintenance schedule',
        'Monitor during regular inspections'
      ],
      'Moderate': [
        'Schedule professional field verification',
        'Implement standard monitoring protocol',
        'Document conditions and maintain assessment records'
      ],
      'High': [
        'Professional assessment required within 30 days',
        'Develop maintenance/inspection plan',
        'Consider access restrictions if conditions warrant'
      ],
      'Very High': [
        'Immediate professional assessment required',
        'Implement access controls until remediation complete',
        'Develop comprehensive mitigation plan',
        'Monitor closely until conditions improve'
      ]
    };

    return recommendations[riskLevel] || [];
  }

  // Get all possible risk levels for dropdowns
  getRiskLevels() {
    return this.riskLevels;
  }

  // Get risk colors for UI
  getRiskColors() {
    return this.riskColors;
  }

  // Get color for specific risk level
  getRiskColor(riskLevel) {
    return this.riskColors[riskLevel] || '#666';
  }

  // Get risk range information for debugging/display
  getRiskRanges() {
    return this.riskRanges;
  }

  // Calculate what risk level a given hazard/consequence combination would produce
  calculateRiskScore(hazardScore, consequenceScore) {
    return hazardScore * consequenceScore;
  }

  // Validate if scores are within expected ranges per official methodology
  validateScores(hazardScore, consequenceScore) {
    const issues = [];
    
    if (hazardScore < this.hazardRange.min || hazardScore > this.hazardRange.max) {
      issues.push(`Hazard score ${hazardScore} outside expected range ${this.hazardRange.min}-${this.hazardRange.max}`);
    }
    
    if (consequenceScore < this.consequenceRange.min || consequenceScore > this.consequenceRange.max) {
      issues.push(`Consequence score ${consequenceScore} outside expected range ${this.consequenceRange.min}-${this.consequenceRange.max}`);
    }
    
    return {
      valid: issues.length === 0,
      issues: issues
    };
  }

  // Get score scale information for UI
  getScoreScale() {
    return {
      values: [2, 4, 6, 10],
      labels: ['Low', 'Moderate', 'High', 'Very High'],
      colors: ['#4CAF50', '#FFEB3B', '#FF9800', '#F44336']
    };
  }
}

export default MatrixRiskAssessment;