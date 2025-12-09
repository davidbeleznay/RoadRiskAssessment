// src/utils/db.js
// IndexedDB configuration using Dexie for offline road risk assessments

import Dexie from 'dexie';

// Create database instance
export const db = new Dexie('RoadRiskDB');

// Define database schema - aligned with multi-method architecture
db.version(1).stores({
  // Road segments being assessed
  roadSegments: '++id, name, identifier, location, roadClass',
  
  // Road risk assessments (main inspection records)
  inspections: '++id, timestamp, roadSegmentId, riskMethodId, assessmentDate, inspector, syncStatus, latitude, longitude',
  
  // Risk assessment results (supports multiple methods per inspection)
  riskAssessments: '++id, inspectionId, riskMethodId, hazardTotal, consequenceTotal, riskScore, riskCategory, syncStatus',
  
  // Individual factor values for each assessment
  riskFactorValues: '++id, riskAssessmentId, factorId, selectedOptionId, score',
  
  // Issues/observations noted during inspection
  issues: '++id, inspectionId, description, issueType, locationReference, photoUrl, timestamp',
  
  // Action items from inspections
  actionItems: '++id, inspectionId, description, priority, dueDate, assignedTo, status',
  
  // Risk method definitions (Mosaic, LMH, future methods)
  riskMethods: '++id, name, description, version, status, createdDate',
  
  // Factor groups (Hazard, Consequence)
  factorGroups: '++id, riskMethodId, name, displayOrder',
  
  // Individual factors within each method
  factors: '++id, factorGroupId, name, description, displayOrder',
  
  // Options for each factor (with scores)
  factorOptions: '++id, factorId, label, scoreValue, displayOrder',
  
  // Risk categories for each method
  riskCategories: '++id, riskMethodId, categoryName, minScore, maxScore, description',
  
  // Sync queue for offline data
  syncQueue: '++id, type, dataId, attempts, lastAttempt, created'
});

// Sync status enumeration
export const SyncStatus = {
  PENDING: 'pending',
  SYNCING: 'syncing',
  SYNCED: 'synced',
  FAILED: 'failed'
};

// Risk method status
export const MethodStatus = {
  ACTIVE: 'active',
  RETIRED: 'retired',
  DRAFT: 'draft'
};

// Open database connection
db.open()
  .then(() => {
    console.log('✅ RoadRiskDB opened successfully');
  })
  .catch((err) => {
    console.error('❌ Failed to open RoadRiskDB:', err);
  });

/**
 * Get database statistics
 */
export async function getDatabaseStats() {
  try {
    const inspectionCount = await db.inspections.count();
    const assessmentCount = await db.riskAssessments.count();
    const pendingSync = await db.syncQueue.count();
    const issuesCount = await db.issues.count();
    
    return {
      inspections: inspectionCount,
      riskAssessments: assessmentCount,
      pendingSync,
      issues: issuesCount
    };
  } catch (error) {
    console.error('Error getting database stats:', error);
    return null;
  }
}

/**
 * Export all data to JSON for backup or transfer
 */
export async function exportAllData() {
  try {
    const data = {
      inspections: await db.inspections.toArray(),
      riskAssessments: await db.riskAssessments.toArray(),
      riskFactorValues: await db.riskFactorValues.toArray(),
      issues: await db.issues.toArray(),
      actionItems: await db.actionItems.toArray(),
      roadSegments: await db.roadSegments.toArray(),
      riskMethods: await db.riskMethods.toArray(),
      factorGroups: await db.factorGroups.toArray(),
      factors: await db.factors.toArray(),
      factorOptions: await db.factorOptions.toArray(),
      riskCategories: await db.riskCategories.toArray(),
      exportDate: new Date().toISOString(),
      appVersion: '2.0.0'
    };
    return data;
  } catch (error) {
    console.error('Error exporting database:', error);
    return null;
  }
}

/**
 * Import database from JSON (for restore)
 */
export async function importDatabase(data) {
  try {
    if (data.inspections) await db.inspections.bulkAdd(data.inspections);
    if (data.riskAssessments) await db.riskAssessments.bulkAdd(data.riskAssessments);
    if (data.riskFactorValues) await db.riskFactorValues.bulkAdd(data.riskFactorValues);
    if (data.issues) await db.issues.bulkAdd(data.issues);
    if (data.actionItems) await db.actionItems.bulkAdd(data.actionItems);
    if (data.roadSegments) await db.roadSegments.bulkAdd(data.roadSegments);
    if (data.riskMethods) await db.riskMethods.bulkAdd(data.riskMethods);
    if (data.factorGroups) await db.factorGroups.bulkAdd(data.factorGroups);
    if (data.factors) await db.factors.bulkAdd(data.factors);
    if (data.factorOptions) await db.factorOptions.bulkAdd(data.factorOptions);
    if (data.riskCategories) await db.riskCategories.bulkAdd(data.riskCategories);
    
    console.log('✅ Database imported successfully');
    return true;
  } catch (error) {
    console.error('Error importing database:', error);
    return false;
  }
}

/**
 * Clear all data (for testing/reset)
 */
export async function clearAllData() {
  try {
    await db.inspections.clear();
    await db.riskAssessments.clear();
    await db.riskFactorValues.clear();
    await db.issues.clear();
    await db.actionItems.clear();
    await db.syncQueue.clear();
    console.log('✅ All data cleared');
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
}

export default db;
