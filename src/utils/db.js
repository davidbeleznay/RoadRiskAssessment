// src/utils/db.js
// IndexedDB configuration using Dexie

import Dexie from 'dexie';

export const db = new Dexie('RoadRiskDB');

db.version(2).stores({
  assessments: '++id, type, dateCreated, roadName, riskMethod',
  photos: '++id, assessmentId, timestamp'
});

db.open()
  .then(() => {
    console.log('✅ RoadRiskDB v2 opened successfully');
  })
  .catch((err) => {
    console.error('❌ Failed to open RoadRiskDB:', err);
  });

export async function saveAssessmentDB(assessmentData) {
  try {
    const savedPhotos = localStorage.getItem('currentPhotos');
    const photos = savedPhotos ? JSON.parse(savedPhotos) : [];
    
    const assessment = {
      type: 'roadRisk',
      dateCreated: new Date().toISOString(),
      roadName: assessmentData.basicInfo?.roadName || 'Untitled',
      riskMethod: assessmentData.riskMethod || 'Scorecard',
      data: assessmentData,
      photoCount: photos.length
    };
    
    const assessmentId = await db.assessments.add(assessment);
    console.log('✅ Assessment saved to IndexedDB:', assessmentId);
    
    if (photos.length > 0) {
      const photoRecords = photos.map(photo => ({
        assessmentId: assessmentId,
        ...photo
      }));
      await db.photos.bulkAdd(photoRecords);
      console.log('✅ Saved', photos.length, 'photos to IndexedDB');
    }
    
    localStorage.removeItem('currentPhotos');
    localStorage.removeItem('currentFieldNotes');
    
    return { success: true, id: assessmentId };
  } catch (error) {
    console.error('❌ Error saving to IndexedDB:', error);
    return { success: false, error: error.message };
  }
}

export async function updateAssessmentDB(assessment) {
  try {
    await db.assessments.update(assessment.id, {
      roadName: assessment.data?.basicInfo?.roadName || assessment.roadName,
      data: assessment.data
    });
    console.log('✅ Assessment updated:', assessment.id);
    return { success: true };
  } catch (error) {
    console.error('❌ Error updating assessment:', error);
    return { success: false, error: error.message };
  }
}

export async function loadAssessmentsDB() {
  try {
    const assessments = await db.assessments.toArray();
    
    for (const assessment of assessments) {
      const photos = await db.photos.where('assessmentId').equals(assessment.id).toArray();
      if (!assessment.data) assessment.data = {};
      assessment.data.photos = photos;
    }
    
    return assessments;
  } catch (error) {
    console.error('❌ Error loading from IndexedDB:', error);
    return [];
  }
}

export async function deleteAssessmentDB(id) {
  try {
    await db.photos.where('assessmentId').equals(id).delete();
    await db.assessments.delete(id);
    console.log('✅ Assessment deleted:', id);
    return { success: true };
  } catch (error) {
    console.error('❌ Error deleting:', error);
    return { success: false, error: error.message };
  }
}

export async function getAssessmentCountDB() {
  try {
    return await db.assessments.count();
  } catch (error) {
    return 0;
  }
}

export async function migrateFromLocalStorage() {
  try {
    const historyData = localStorage.getItem('assessmentHistory');
    if (!historyData) {
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
    
    localStorage.setItem('assessmentHistory_backup', historyData);
    localStorage.removeItem('assessmentHistory');
    
    return { success: true, migrated: roadRisk.length };
  } catch (error) {
    console.error('❌ Migration error:', error);
    return { success: false, error: error.message };
  }
}

export default db;
