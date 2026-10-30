import { db } from '../../data/db';
import { getGamificationProfile, getStreakMultiplier, awardXP } from './xpEngine';

export const STREAK_MILESTONES = [7, 14, 30, 50, 100];
export const STREAK_MILESTONE_XP = 150;

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

export const updateStreak = async (userId = 'guest', currentDateStr = new Date().toISOString()) => {
  const profile = await getGamificationProfile(userId);
  const today = toDayNumber(currentDateStr);

  if (!profile.last_study_date) {
    // First time studying
    await db.gamification_profiles.update(profile.id, {
      streak_days: 1,
      longest_streak: 1,
      last_study_date: currentDateStr,
    });
    return { streakActive: true, streakDays: 1, longestStreak: 1, newMilestone: false, multiplier: getStreakMultiplier(1) };
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
    };
  }

  // Missed a day -> the streak restarts at 1 today.
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
  };
};

/**
 * Read the streak without mutating it (used for "today" summaries).
 */
export const getStreakSnapshot = async (userId = 'guest') => {
  const profile = await getGamificationProfile(userId);
  const last = profile.last_study_date ? toDayNumber(profile.last_study_date) : null;
  const today = toDayNumber(new Date());
  const stale = last === null ? profile.streak_days === 0 : today - last > 1;
  return {
    streakDays: stale && profile.streak_days > 0 ? 0 : profile.streak_days,
    longestStreak: profile.longest_streak,
    multiplier: getStreakMultiplier(profile.streak_days),
  };
};
