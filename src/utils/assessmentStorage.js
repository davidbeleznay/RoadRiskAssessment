// src/utils/assessmentStorage.js
// Functions for saving and loading road risk assessments

/**
 * Save a road risk assessment to localStorage
 */
export function saveAssessment(assessmentData) {
  try {
    // Generate unique ID
    const id = Date.now().toString();
    
    // Get photos from localStorage
    const savedPhotos = localStorage.getItem('currentPhotos');
    const photos = savedPhotos ? JSON.parse(savedPhotos) : [];
    
    // Create assessment record
    const assessment = {
      id,
      type: 'roadRisk',
      title: assessmentData.basicInfo?.roadName || 'Untitled Assessment',
      dateCreated: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      data: {
        ...assessmentData,
        assessor: assessmentData.basicInfo?.assessor,
        photos: photos
      },
      photoCount: photos.length
    };
    
    // Load existing history
    const historyData = localStorage.getItem('assessmentHistory');
    const history = historyData ? JSON.parse(historyData) : [];
    
    // Add new assessment
    history.unshift(assessment); // Add to beginning
    
    // Save back to localStorage
    localStorage.setItem('assessmentHistory', JSON.stringify(history));
    
    // Clear current photos after save
    localStorage.removeItem('currentPhotos');
    
    console.log('✅ Assessment saved with', photos.length, 'photos. ID:', id);
    return { success: true, id };
    
  } catch (error) {
    console.error('❌ Error saving assessment:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Load all assessments from storage
 */
export function loadAssessments() {
  try {
    const historyData = localStorage.getItem('assessmentHistory');
    if (!historyData) return [];
    
    const history = JSON.parse(historyData);
    // Filter to only road risk assessments
    return history.filter(a => a.type === 'roadRisk');
    
  } catch (error) {
    console.error('❌ Error loading assessments:', error);
    return [];
  }
}

/**
 * Delete an assessment by ID
 */
export function deleteAssessment(id) {
  try {
    const historyData = localStorage.getItem('assessmentHistory');
    if (!historyData) return { success: false };
    
    const history = JSON.parse(historyData);
    const filtered = history.filter(a => a.id !== id);
    
    localStorage.setItem('assessmentHistory', JSON.stringify(filtered));
    
    console.log('✅ Assessment deleted:', id);
    return { success: true };
    
  } catch (error) {
    console.error('❌ Error deleting assessment:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get assessment count
 */
export function getAssessmentCount() {
  try {
    const assessments = loadAssessments();
    return assessments.length;
  } catch (error) {
    return 0;
  }
}
