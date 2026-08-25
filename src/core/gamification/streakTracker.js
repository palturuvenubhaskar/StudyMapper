import { db } from '../../data/db';
import { getGamificationProfile } from './xpEngine';

// Calculate days between two dates (ignoring time)
const getDaysDifference = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  const diffTime = Math.abs(d2 - d1);
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

export const updateStreak = async (userId = 'guest', currentDateStr = new Date().toISOString()) => {
  const profile = await getGamificationProfile(userId);
  const today = new Date(currentDateStr);
  
  if (!profile.last_study_date) {
    // First time studying
    await db.gamification_profiles.update(profile.id, {
      streak_days: 1,
      longest_streak: 1,
      last_study_date: currentDateStr
    });
    return { streakActive: true, streakDays: 1, newMilestone: false };
  }

  const daysDiff = getDaysDifference(profile.last_study_date, currentDateStr);

  // Already studied today
  if (daysDiff === 0) {
    return { streakActive: true, streakDays: profile.streak_days, newMilestone: false };
  }

  // Studied yesterday -> increment streak
  if (daysDiff === 1) {
    const newStreak = profile.streak_days + 1;
    const newLongest = Math.max(profile.longest_streak, newStreak);
    await db.gamification_profiles.update(profile.id, {
      streak_days: newStreak,
      longest_streak: newLongest,
      last_study_date: currentDateStr
    });
    return { 
      streakActive: true, 
      streakDays: newStreak, 
      newMilestone: [7, 14, 30, 50, 100].includes(newStreak) 
    };
  }

  // Studied before yesterday -> streak broken
  await db.gamification_profiles.update(profile.id, {
    streak_days: 1, // Reset to 1 for today
    last_study_date: currentDateStr
  });
  return { streakActive: false, streakDays: 1, newMilestone: false };
};
