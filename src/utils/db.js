// src/utils/db.js
// IndexedDB configuration using Dexie - simplified for assessments with photos

import Dexie from 'dexie';

export const db = new Dexie('RoadRiskDB');

// Simplified schema for road risk assessments
db.version(2).stores({
  // Main assessments table
  assessments: '++id, type, dateCreated, roadName, riskMethod',
  
  // Photos table (separate for better performance)
  photos: '++id, assessmentId, timestamp'
});

db.open()
  .then(() => {
    console.log('✅ RoadRiskDB v2 opened successfully');
  })
  .catch((err) => {
    console.error('❌ Failed to open RoadRiskDB:', err);
  });

/**
 * Save assessment to IndexedDB
 */
export async function saveAssessmentDB(assessmentData) {
  try {
    // Get photos from localStorage temporarily
    const savedPhotos = localStorage.getItem('currentPhotos');
    const photos = savedPhotos ? JSON.parse(savedPhotos) : [];
    
    // Create assessment record
    const assessment = {
      type: 'roadRisk',
      dateCreated: new Date().toISOString(),
      roadName: assessmentData.basicInfo?.roadName || 'Untitled',
      riskMethod: assessmentData.riskMethod || 'Scorecard',
      data: assessmentData,
      photoCount: photos.length
    };
    
    // Save assessment
    const assessmentId = await db.assessments.add(assessment);
    console.log('✅ Assessment saved to IndexedDB:', assessmentId);
    
    // Save photos separately
    if (photos.length > 0) {
      const photoRecords = photos.map(photo => ({
        assessmentId: assessmentId,
        ...photo
      }));
      await db.photos.bulkAdd(photoRecords);
      console.log('✅ Saved', photos.length, 'photos to IndexedDB');
    }
    
    // Clear temporary storage
    localStorage.removeItem('currentPhotos');
    localStorage.removeItem('currentFieldNotes');
    
    return { success: true, id: assessmentId };
  } catch (error) {
    console.error('❌ Error saving to IndexedDB:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Load all assessments from IndexedDB
 */
export async function loadAssessmentsDB() {
  try {
    const assessments = await db.assessments.toArray();
    
    // Load photos for each assessment
    for (const assessment of assessments) {
      const photos = await db.photos.where('assessmentId').equals(assessment.id).toArray();
      assessment.data.photos = photos;
    }
    
    return assessments;
  } catch (error) {
    console.error('❌ Error loading from IndexedDB:', error);
    return [];
  }
}

/**
 * Delete assessment from IndexedDB
 */
export async function deleteAssessmentDB(id) {
  try {
    // Delete photos first
    await db.photos.where('assessmentId').equals(id).delete();
    // Delete assessment
    await db.assessments.delete(id);
    console.log('✅ Assessment deleted:', id);
    return { success: true };
  } catch (error) {
    console.error('❌ Error deleting:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get assessment count
 */
export async function getAssessmentCountDB() {
  try {
    return await db.assessments.count();
  } catch (error) {
    return 0;
  }
}

/**
 * Migrate data from localStorage to IndexedDB
 */
export async function migrateFromLocalStorage() {
  try {
    const historyData = localStorage.getItem('assessmentHistory');
    if (!historyData) {
      console.log('No localStorage data to migrate');
      return { success: true, migrated: 0 };
    }
    
    const history = JSON.parse(historyData);
    const roadRisk = history.filter(a => a.type === 'roadRisk');
    
    console.log('Migrating', roadRisk.length, 'assessments to IndexedDB...');
    
    for (const item of roadRisk) {
      await db.assessments.add({
        type: item.type,
        dateCreated: item.dateCreated,
        roadName: item.data?.basicInfo?.roadName || item.title,
        riskMethod: item.data?.riskMethod || 'Scorecard',
        data: item.data,
        photoCount: item.photoCount || 0
      });
    }
    
    console.log('✅ Migration complete!');
    
    // Backup then clear localStorage
    localStorage.setItem('assessmentHistory_backup', historyData);
    localStorage.removeItem('assessmentHistory');
    
    return { success: true, migrated: roadRisk.length };
  } catch (error) {
    console.error('❌ Migration error:', error);
    return { success: false, error: error.message };
  }
}

export default db;
