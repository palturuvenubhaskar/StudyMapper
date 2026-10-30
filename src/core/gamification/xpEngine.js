import { db } from '../../data/db';
import { v4 as uuidv4 } from 'uuid';

/**
 * Single source of truth for XP payouts.
 * Keep every activity's reward here so the economy can be balanced in one place.
 */
export const XP_RULES = {
  // Time-boxed study: the more minutes you invest, the more you earn.
  pomodoroPerMinute: 2,
  pomodoroCompletionBonus: 0.25,
  // Instant actions.
  generateNotes: 50,
  codingProblem: 100,
  dailyQuest: 100,
};

/**
 * Streak multiplier: longer streaks make every session worth more.
 * Capped at 1.5x (30+ days) so the economy cannot run away.
 */
export const getStreakMultiplier = (streakDays = 0) => {
  if (streakDays >= 30) return 1.5;
  if (streakDays >= 14) return 1.35;
  if (streakDays >= 7) return 1.2;
  if (streakDays >= 3) return 1.1;
  return 1;
};

/**
 * XP for a finished focus session: base rate per minute, a completion bonus,
 * then the streak multiplier. Rounded to a whole number.
 */
export const calculatePomodoroXP = (durationMinutes, streakDays = 0) => {
  const minutes = Math.max(0, Number(durationMinutes) || 0);
  const base = minutes * XP_RULES.pomodoroPerMinute;
  return Math.round(base * (1 + XP_RULES.pomodoroCompletionBonus) * getStreakMultiplier(streakDays));
};

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

  const levelResult = await checkAndAwardLevelUp(userId);

  // Let any mounted gamification UI refresh itself.
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('studymapper:xp', { detail: { userId } }));
  }

  return levelResult;
};
