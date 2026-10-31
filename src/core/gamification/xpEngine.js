import { db } from '../../data/db';
import { v4 as uuidv4 } from 'uuid';

/**
 * Single source of truth for XP payouts.
 * Keep every activity's reward here so the economy can be balanced in one place.
 */
export const XP_RULES = {
  // Time-boxed study: deep work is worth more per minute.
  pomodoroBase: 2,           // XP per minute for first 15 min
  pomodoroDeepWork: 3,       // XP per minute for 15–45 min
  pomodoroUltraFocus: 4,     // XP per minute for 45+ min
  pomodoroCompletionBonus: 0.25,
  // First session of the day breaks inertia.
  firstSessionBonus: 0.25,
  // Instant actions.
  generateNotes: 50,
  codingProblem: 100,
  dailyQuest: 100,
  // Combo: multiple sessions in one day (diminishing).
  comboSessionBonus: [0, 0, 15, 10, 8, 5], // index = session # today (0-indexed, first two are 0)
  // Daily quest completion bonus.
  allQuestsCompleteBonus: 150,
};

/**
 * Streak multiplier: longer streaks make every session worth more.
 * Capped at 2.0x (60+ days) so the economy cannot run away.
 */
export const getStreakMultiplier = (streakDays = 0) => {
  if (streakDays >= 60) return 2.0;
  if (streakDays >= 30) return 1.75;
  if (streakDays >= 14) return 1.5;
  if (streakDays >= 7)  return 1.3;
  if (streakDays >= 3)  return 1.15;
  return 1;
};

/**
 * Duration-scaled XP: longer focus sessions earn *more* per minute,
 * rewarding deep work over quick bursts.
 */
export const calculateDurationXP = (durationMinutes) => {
  const mins = Math.max(0, Number(durationMinutes) || 0);
  if (mins <= 0) return 0;

  let xp = 0;
  // Tier 1: first 15 min at base rate
  const t1 = Math.min(mins, 15);
  xp += t1 * XP_RULES.pomodoroBase;

  // Tier 2: 15–45 min at deep work rate
  if (mins > 15) {
    const t2 = Math.min(mins - 15, 30);
    xp += t2 * XP_RULES.pomodoroDeepWork;
  }

  // Tier 3: 45+ min at ultra focus rate
  if (mins > 45) {
    const t3 = mins - 45;
    xp += t3 * XP_RULES.pomodoroUltraFocus;
  }

  return xp;
};

/**
 * XP for a finished focus session: duration-scaled base,
 * completion bonus, then the streak multiplier. Rounded to a whole number.
 */
export const calculatePomodoroXP = (durationMinutes, streakDays = 0) => {
  const base = calculateDurationXP(durationMinutes);
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
  if (level <= 3)  return 'Freshman';
  if (level <= 7)  return 'Apprentice';
  if (level <= 12) return 'Scholar';
  if (level <= 20) return 'Honors Student';
  if (level <= 30) return 'Research Fellow';
  if (level <= 40) return 'Mentor';
  if (level <= 50) return 'Valedictorian';
  return 'Grandmaster';
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
      last_study_date: null,
      // Streak freeze fields (non-indexed, stored as extra props)
      streak_freezes: 1,
      last_freeze_refill: null,
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

/**
 * Combo bonus for multiple sessions in one day (diminishing returns).
 */
export const getComboBonus = (sessionNumberToday) => {
  const idx = Math.min(sessionNumberToday, XP_RULES.comboSessionBonus.length - 1);
  return XP_RULES.comboSessionBonus[idx] || 0;
};
