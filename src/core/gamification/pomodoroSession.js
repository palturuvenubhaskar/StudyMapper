import { db } from '../../data/db';
import { v4 as uuidv4 } from 'uuid';
import { awardXP, calculatePomodoroXP, getGamificationProfile, getComboBonus, XP_RULES } from './xpEngine';
import { updateStreak } from './streakTracker';
import { updateQuestProgress } from './dailyQuests';
import { updateWeeklyChallengeProgress } from './weeklyChallenges';
import { checkAchievements } from './achievementChecker';
import { logEvent } from '../analytics/tracker';

const localDayKey = (value = new Date()) => {
  const d = new Date(value);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

/**
 * Award everything a finished focus session deserves, in one place.
 *
 * The timer used to gate all of this behind an optional `topicId` prop that no
 * caller passed, so finishing a session paid nothing. The session is now the
 * unit of reward; a topic is only extra analytics context.
 *
 * Guarded by the session id: a second finalize (double mount, refresh during
 * the completion tick) is a no-op instead of a double payout.
 */
export const completePomodoroSession = async ({
  sessionId = uuidv4(),
  userId = 'guest',
  topicId = null,
  durationMinutes,
  startedAt = null,
  endedAt = new Date().toISOString(),
}) => {
  const alreadyCompleted = await db.study_sessions.get(sessionId);
  if (alreadyCompleted) {
    return { alreadyCompleted: true, sessionId };
  }

  const before = await getGamificationProfile(userId);

  try {
    await db.study_sessions.add({
      id: sessionId,
      user_id: userId,
      topic_id: topicId,
      duration_minutes: Math.round(durationMinutes),
      completed: 1,
      created_at: endedAt,
      started_at: startedAt,
    });
  } catch (err) {
    // Lost a race with another mounted timer finalizing the same session.
    if (err && err.name === 'ConstraintError') {
      return { alreadyCompleted: true, sessionId };
    }
    throw err;
  }

  // --- Streak ---
  const streak = await updateStreak(userId, endedAt);

  // --- Session XP (duration-scaled + streak multiplier) ---
  const sessionXP = calculatePomodoroXP(durationMinutes, streak.streakDays);
  await awardXP(userId, sessionXP, 'pomodoro', sessionId);

  // --- First-session-of-day bonus ---
  const todayStats = await getTodayFocusStats(userId);
  let firstSessionBonusXP = 0;
  if (todayStats.sessions === 1) {
    // This is the first completed session today
    firstSessionBonusXP = Math.round(sessionXP * XP_RULES.firstSessionBonus);
    if (firstSessionBonusXP > 0) {
      await awardXP(userId, firstSessionBonusXP, 'first_session_bonus', sessionId);
    }
  }

  // --- Combo bonus (multiple sessions same day, diminishing) ---
  const comboBonus = getComboBonus(todayStats.sessions);
  if (comboBonus > 0) {
    await awardXP(userId, comboBonus, 'combo_bonus', sessionId);
  }

  // --- Daily quest progress ---
  const questResult = await updateQuestProgress(userId, 'pomodoro', 1);

  // Also track study_minutes and pomodoro_long quest types
  await updateQuestProgress(userId, 'study_minutes', Math.round(durationMinutes));
  if (durationMinutes >= 45) {
    await updateQuestProgress(userId, 'pomodoro_long', 1);
  }

  // --- Weekly challenge progress ---
  await updateWeeklyChallengeProgress(userId, 'sessions', 1);
  await updateWeeklyChallengeProgress(userId, 'focus_minutes', Math.round(durationMinutes));
  if (questResult.completedQuests.length > 0) {
    await updateWeeklyChallengeProgress(userId, 'quests', questResult.completedQuests.length);
  }

  // --- Achievements ---
  const achievements = await checkAchievements(userId);

  if (topicId) {
    await logEvent(userId, topicId, 'pomodoro_complete', Math.round(durationMinutes * 60), null);
    await updateQuestProgress(userId, 'study_topics', 1);
  }

  const profile = await getGamificationProfile(userId);
  const milestoneXP = streak.milestoneXP || 0;

  return {
    alreadyCompleted: false,
    sessionId,
    sessionXP,
    firstSessionBonusXP,
    comboBonus,
    questXP: questResult.xpAwarded,
    milestoneXP,
    allQuestsComplete: questResult.allQuestsComplete,
    xp: sessionXP + firstSessionBonusXP + comboBonus + questResult.xpAwarded + milestoneXP,
    totalXp: profile.total_xp,
    level: profile.current_level,
    leveledUp: profile.current_level > before.current_level,
    oldLevel: before.current_level,
    streakDays: streak.streakDays,
    streakMultiplier: streak.multiplier,
    freezeUsed: streak.freezeUsed,
    freezesRemaining: streak.freezesRemaining,
    newMilestone: streak.newMilestone,
    questsCompleted: questResult.completedQuests,
    achievements,
  };
};

/**
 * Focus time already banked today, for the timer's "today" summary.
 */
export const getTodayFocusStats = async (userId = 'guest') => {
  const sessions = await db.study_sessions.where('user_id').equals(userId).toArray();
  const today = localDayKey();
  const todaySessions = sessions.filter(s => s.completed !== 0 && localDayKey(s.created_at) === today);

  return {
    sessions: todaySessions.length,
    minutes: todaySessions.reduce((sum, s) => sum + (Number(s.duration_minutes) || 0), 0),
  };
};
