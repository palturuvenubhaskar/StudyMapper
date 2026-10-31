import { db } from '../../data/db';
import { getGamificationProfile, getStreakMultiplier, awardXP } from './xpEngine';

export const STREAK_MILESTONES = [7, 14, 30, 50, 100];
export const STREAK_MILESTONE_XP = 150;
export const FREEZES_PER_WEEK = 1;

/**
 * Convert a timestamp to a local-day number (days since epoch).
 * Using local calendar days keeps the streak aligned with what the user
 * sees on their clock. (The old version mixed UTC dates with local midnight,
 * so in IST the "day" rolled over at 05:30.)
 */
const toDayNumber = (value) => {
  const d = new Date(value);
  return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);
};

/**
 * ISO week key for freeze refill tracking (e.g. "2026-W44").
 */
const getWeekKey = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  const weekNum = 1 + Math.round(((d - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
};

/**
 * Refill streak freezes if a new ISO week has started.
 */
const maybeRefillFreezes = async (profile) => {
  const currentWeek = getWeekKey();
  if (profile.last_freeze_refill !== currentWeek) {
    await db.gamification_profiles.update(profile.id, {
      streak_freezes: FREEZES_PER_WEEK,
      last_freeze_refill: currentWeek,
    });
    return FREEZES_PER_WEEK;
  }
  return profile.streak_freezes ?? 0;
};

export const updateStreak = async (userId = 'guest', currentDateStr = new Date().toISOString()) => {
  const profile = await getGamificationProfile(userId);
  const today = toDayNumber(currentDateStr);
  const availableFreezes = await maybeRefillFreezes(profile);

  if (!profile.last_study_date) {
    // First time studying
    await db.gamification_profiles.update(profile.id, {
      streak_days: 1,
      longest_streak: 1,
      last_study_date: currentDateStr,
    });
    return { streakActive: true, streakDays: 1, longestStreak: 1, newMilestone: false, multiplier: getStreakMultiplier(1), freezeUsed: false, freezesRemaining: availableFreezes };
  }

  const daysDiff = today - toDayNumber(profile.last_study_date);

  // Already studied today (or the clock moved backwards): do not double count.
  if (daysDiff <= 0) {
    return {
      streakActive: true,
      streakDays: profile.streak_days,
      longestStreak: profile.longest_streak,
      newMilestone: false,
      multiplier: getStreakMultiplier(profile.streak_days),
      freezeUsed: false,
      freezesRemaining: availableFreezes,
    };
  }

  // Studied yesterday -> increment streak
  if (daysDiff === 1) {
    const newStreak = profile.streak_days + 1;
    const newLongest = Math.max(profile.longest_streak, newStreak);
    const isMilestone = STREAK_MILESTONES.includes(newStreak);

    await db.gamification_profiles.update(profile.id, {
      streak_days: newStreak,
      longest_streak: newLongest,
      last_study_date: currentDateStr,
    });

    if (isMilestone) {
      await awardXP(userId, STREAK_MILESTONE_XP, 'streak_milestone', `streak_${newStreak}`);
    }

    return {
      streakActive: true,
      streakDays: newStreak,
      longestStreak: newLongest,
      newMilestone: isMilestone,
      milestoneXP: isMilestone ? STREAK_MILESTONE_XP : 0,
      multiplier: getStreakMultiplier(newStreak),
      freezeUsed: false,
      freezesRemaining: availableFreezes,
    };
  }

  // Missed exactly one day and have a freeze available -> use it, keep streak
  if (daysDiff === 2 && availableFreezes > 0) {
    const newFreezes = availableFreezes - 1;
    const newStreak = profile.streak_days + 1;  // count today
    const newLongest = Math.max(profile.longest_streak, newStreak);
    const isMilestone = STREAK_MILESTONES.includes(newStreak);

    await db.gamification_profiles.update(profile.id, {
      streak_days: newStreak,
      longest_streak: newLongest,
      last_study_date: currentDateStr,
      streak_freezes: newFreezes,
    });

    if (isMilestone) {
      await awardXP(userId, STREAK_MILESTONE_XP, 'streak_milestone', `streak_${newStreak}`);
    }

    return {
      streakActive: true,
      streakDays: newStreak,
      longestStreak: newLongest,
      newMilestone: isMilestone,
      milestoneXP: isMilestone ? STREAK_MILESTONE_XP : 0,
      multiplier: getStreakMultiplier(newStreak),
      freezeUsed: true,
      freezesRemaining: newFreezes,
    };
  }

  // Missed too many days (or missed one with no freeze) -> the streak restarts at 1 today.
  await db.gamification_profiles.update(profile.id, {
    streak_days: 1,
    last_study_date: currentDateStr,
  });
  return {
    streakActive: false,
    streakDays: 1,
    longestStreak: profile.longest_streak,
    newMilestone: false,
    multiplier: getStreakMultiplier(1),
    freezeUsed: false,
    freezesRemaining: availableFreezes,
  };
};

/**
 * Read the streak without mutating it (used for "today" summaries).
 * Fixed: returns multiplier of 1 when the streak is stale instead of
 * the old streak's multiplier.
 */
export const getStreakSnapshot = async (userId = 'guest') => {
  const profile = await getGamificationProfile(userId);
  const last = profile.last_study_date ? toDayNumber(profile.last_study_date) : null;
  const today = toDayNumber(new Date());
  const stale = last === null ? profile.streak_days === 0 : today - last > 1;
  const effectiveStreak = stale && profile.streak_days > 0 ? 0 : profile.streak_days;
  return {
    streakDays: effectiveStreak,
    longestStreak: profile.longest_streak,
    multiplier: getStreakMultiplier(effectiveStreak),
    freezesRemaining: profile.streak_freezes ?? 0,
  };
};
