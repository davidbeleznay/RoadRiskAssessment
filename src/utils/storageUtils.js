/**
 * Save form data to localStorage
 * @param {string} formKey - Unique key for the form
 * @param {object} formData - Form data to save
 */
export const saveFormData = (formKey, formData) => {
  try {
    const formDataWithTimestamp = {
      ...formData,
      lastSaved: new Date().toISOString(),
    };
    localStorage.setItem(formKey, JSON.stringify(formDataWithTimestamp));
    return true;
  } catch (error) {
    console.error('Error saving form data:', error);
    return false;
  }
};

/**
 * Load form data from localStorage
 * @param {string} formKey - Unique key for the form
 * @returns {object|null} - Retrieved form data or null if not found
 */
export const loadFormData = (formKey) => {
  try {
    const savedData = localStorage.getItem(formKey);
    return savedData ? JSON.parse(savedData) : null;
  } catch (error) {
    console.error('Error loading form data:', error);
    return null;
  }
};

/**
 * Save assessment to history
 * @param {string} assessmentType - Type of assessment ("road-risk" or "culvert")
 * @param {object} assessmentData - Complete assessment data
 */
export const saveToHistory = (assessmentType, assessmentData) => {
  try {
    // Get existing history or initialize empty array
    const historyKey = `${assessmentType}-history`;
    const existingHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');
    
    // Add new assessment with timestamp and unique ID
    const newAssessment = {
      ...assessmentData,
      id: `${assessmentType}-${Date.now()}`,
      savedAt: new Date().toISOString(),
    };
    
    // Prepend to history (most recent first)
    const updatedHistory = [newAssessment, ...existingHistory];
    
    // Save updated history
    localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
    return newAssessment.id;
  } catch (error) {
    console.error('Error saving to history:', error);
    return null;
  }
};

/**
 * Get assessment history
 * @param {string} assessmentType - Type of assessment ("road-risk" or "culvert")
 * @returns {array} - Array of historical assessments
 */
export const getHistory = (assessmentType) => {
  try {
    const historyKey = `${assessmentType}-history`;
    return JSON.parse(localStorage.getItem(historyKey) || '[]');
  } catch (error) {
    console.error('Error getting history:', error);
    return [];
  }
};