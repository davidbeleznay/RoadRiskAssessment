// src/utils/gamification.js
// Simple gamification system - streaks and volume tracking

import { loadAssessmentsDB } from './db';

/**
 * Calculate user stats and streaks
 */
export async function calculateUserStats() {
  try {
    const assessments = await loadAssessmentsDB();
    
    if (assessments.length === 0) {
      return {
        totalAssessments: 0,
        currentStreak: 0,
        longestStreak: 0,
        thisWeek: 0,
        thisMonth: 0,
        badges: []
      };
    }

    // Sort by date
    const sorted = [...assessments].sort((a, b) => 
      new Date(a.dateCreated) - new Date(b.dateCreated)
    );

    // Calculate streaks
    const streaks = calculateStreaks(sorted);
    
    // Calculate time-based counts
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const thisWeek = assessments.filter(a => new Date(a.dateCreated) >= weekAgo).length;
    const thisMonth = assessments.filter(a => new Date(a.dateCreated) >= monthAgo).length;

    // Calculate badges
    const badges = calculateBadges(assessments.length, streaks.longest, thisWeek, thisMonth);

    return {
      totalAssessments: assessments.length,
      currentStreak: streaks.current,
      longestStreak: streaks.longest,
      thisWeek,
      thisMonth,
      badges,
      lastAssessment: assessments[assessments.length - 1]?.dateCreated
    };
  } catch (error) {
    console.error('Error calculating stats:', error);
    return null;
  }
}

/**
 * Calculate current and longest streaks (in days)
 */
function calculateStreaks(sortedAssessments) {
  if (sortedAssessments.length === 0) {
    return { current: 0, longest: 0 };
  }

  const dates = sortedAssessments.map(a => {
    const d = new Date(a.dateCreated);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  });

  // Remove duplicates (multiple assessments same day)
  const uniqueDates = [...new Set(dates)].sort((a, b) => a - b);

  // Calculate current streak
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTime = today.getTime();
  
  let currentStreak = 0;
  let checkDate = todayTime;
  
  // Start from most recent and work backward
  for (let i = uniqueDates.length - 1; i >= 0; i--) {
    const daysDiff = Math.floor((checkDate - uniqueDates[i]) / (24 * 60 * 60 * 1000));
    
    if (daysDiff === 0 || daysDiff === 1) {
      currentStreak++;
      checkDate = uniqueDates[i];
    } else {
      break;
    }
  }

  // Calculate longest streak
  let longestStreak = 1;
  let tempStreak = 1;
  
  for (let i = 1; i < uniqueDates.length; i++) {
    const daysDiff = Math.floor((uniqueDates[i] - uniqueDates[i-1]) / (24 * 60 * 60 * 1000));
    
    if (daysDiff === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  return {
    current: currentStreak,
    longest: longestStreak
  };
}

/**
 * Calculate earned badges
 */
function calculateBadges(total, longestStreak, thisWeek, thisMonth) {
  const badges = [];

  // Volume badges
  if (total >= 5) badges.push({ 
    id: 'bronze', 
    name: 'Getting Started', 
    icon: '🥉', 
    description: '5 assessments completed',
    earned: true
  });
  
  if (total >= 15) badges.push({ 
    id: 'silver', 
    name: 'Experienced', 
    icon: '🥈', 
    description: '15 assessments completed',
    earned: true
  });
  
  if (total >= 30) badges.push({ 
    id: 'gold', 
    name: 'Professional', 
    icon: '🥇', 
    description: '30 assessments completed',
    earned: true
  });
  
  if (total >= 50) badges.push({ 
    id: 'diamond', 
    name: 'Expert', 
    icon: '💎', 
    description: '50 assessments completed',
    earned: true
  });

  // Streak badges
  if (longestStreak >= 3) badges.push({ 
    id: 'streak3', 
    name: 'Committed', 
    icon: '🔥', 
    description: '3-day streak achieved',
    earned: true
  });
  
  if (longestStreak >= 7) badges.push({ 
    id: 'streak7', 
    name: 'Dedicated', 
    icon: '🔥🔥', 
    description: '7-day streak achieved',
    earned: true
  });
  
  if (longestStreak >= 14) badges.push({ 
    id: 'streak14', 
    name: 'On Fire!', 
    icon: '🔥🔥🔥', 
    description: '14-day streak achieved',
    earned: true
  });

  // Consistency badges
  if (thisWeek >= 3) badges.push({ 
    id: 'productive', 
    name: 'Productive Week', 
    icon: '⚡', 
    description: '3+ assessments this week',
    earned: true
  });
  
  if (thisMonth >= 10) badges.push({ 
    id: 'poweruser', 
    name: 'Power User', 
    icon: '💪', 
    description: '10+ assessments this month',
    earned: true
  });

  return badges;
}

/**
 * Get motivational message based on stats
 */
export function getMotivationalMessage(stats) {
  if (!stats) return null;

  if (stats.currentStreak === 0) {
    return { 
      emoji: '🎯', 
      text: 'Start a streak! Complete an assessment today.',
      color: '#2196f3'
    };
  }

  if (stats.currentStreak === 1) {
    return { 
      emoji: '🔥', 
      text: 'Day 1 of your streak! Keep it going tomorrow.',
      color: '#ff9800'
    };
  }

  if (stats.currentStreak >= 2 && stats.currentStreak < 7) {
    return { 
      emoji: '🔥', 
      text: `${stats.currentStreak} day streak! Don't break it!`,
      color: '#ff9800'
    };
  }

  if (stats.currentStreak >= 7 && stats.currentStreak < 14) {
    return { 
      emoji: '🔥🔥', 
      text: `Amazing ${stats.currentStreak} day streak!`,
      color: '#f44336'
    };
  }

  if (stats.currentStreak >= 14) {
    return { 
      emoji: '🔥🔥🔥', 
      text: `Incredible ${stats.currentStreak} day streak! You're on fire!`,
      color: '#d32f2f'
    };
  }

  return null;
}

/**
 * Check if new badge was just earned (for popup)
 */
export function checkNewBadge(oldStats, newStats) {
  if (!oldStats || !newStats) return null;
  
  const oldBadgeIds = oldStats.badges.map(b => b.id);
  const newBadge = newStats.badges.find(b => !oldBadgeIds.includes(b.id));
  
  return newBadge || null;
}
