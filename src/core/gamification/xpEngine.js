import { db } from '../../data/db';
import { v4 as uuidv4 } from 'uuid';

/**
 * Calculate the level based on total XP.
 * Formula: Each level requires current_level * 150 XP to reach the next.
 * Total XP for level N = sum(i * 150 for i=1 to N-1) = 150 * (N-1)*N/2
 * To find level from XP:
 * (N-1)*N = 2 * XP / 150
 * N^2 - N - (XP/75) = 0
 * N = (1 + sqrt(1 + 4 * XP / 75)) / 2
 */
export const calculateLevel = (totalXP) => {
  if (totalXP <= 0) return 1;
  const n = (1 + Math.sqrt(1 + 4 * totalXP / 75)) / 2;
  return Math.floor(n);
};

export const getLevelTitle = (level) => {
  if (level <= 5) return 'Junior Engineer';
  if (level <= 10) return 'Associate Engineer';
  if (level <= 20) return 'Engineer';
  if (level <= 35) return 'Senior Engineer';
  if (level <= 50) return 'Staff Engineer';
  return 'Principal Engineer';
};

export const getXPForNextLevel = (currentLevel) => {
  return currentLevel * 150;
};

export const getXPProgress = (totalXP, currentLevel) => {
  // Total XP required to reach currentLevel
  const xpForCurrentLevel = 150 * (currentLevel - 1) * currentLevel / 2;
  const xpIntoCurrentLevel = totalXP - xpForCurrentLevel;
  const xpNeeded = getXPForNextLevel(currentLevel);
  return { xpIntoCurrentLevel, xpNeeded, percentage: Math.min(100, Math.floor((xpIntoCurrentLevel / xpNeeded) * 100)) };
};

export const getGamificationProfile = async (userId = 'guest') => {
  let profile = await db.gamification_profiles.where('user_id').equals(userId).first();
  if (!profile) {
    profile = {
      id: uuidv4(),
      user_id: userId,
      total_xp: 0,
      current_level: 1,
      streak_days: 0,
      longest_streak: 0,
      last_study_date: null
    };
    await db.gamification_profiles.add(profile);
  }
  return profile;
};

export const checkAndAwardLevelUp = async (userId = 'guest') => {
  const profile = await getGamificationProfile(userId);
  const newLevel = calculateLevel(profile.total_xp);
  
  if (newLevel > profile.current_level) {
    await db.gamification_profiles.update(profile.id, { current_level: newLevel });
    return { leveledUp: true, oldLevel: profile.current_level, newLevel };
  }
  return { leveledUp: false };
};

export const awardXP = async (userId = 'guest', amount, source, sourceId = null) => {
  const profile = await getGamificationProfile(userId);
  
  await db.transaction('rw', [db.gamification_profiles, db.xp_transactions], async () => {
    // Record transaction
    await db.xp_transactions.add({
      id: uuidv4(),
      user_id: userId,
      amount,
      source,
      source_id: sourceId,
      created_at: new Date().toISOString()
    });

    // Update profile
    const newTotalXP = profile.total_xp + amount;
    await db.gamification_profiles.update(profile.id, { total_xp: newTotalXP });
  });

  // Subtle haptic feedback for XP gain
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate([30]);
  }

  return checkAndAwardLevelUp(userId);
};
