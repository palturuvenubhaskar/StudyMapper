import { db } from '../../data/db';
import { v4 as uuidv4 } from 'uuid';
import { awardXP, calculatePomodoroXP, getGamificationProfile } from './xpEngine';
import { updateStreak } from './streakTracker';
import { updateQuestProgress } from './dailyQuests';
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

  const streak = await updateStreak(userId, endedAt);
  const sessionXP = calculatePomodoroXP(durationMinutes, streak.streakDays);
  await awardXP(userId, sessionXP, 'pomodoro', sessionId);

  const questResult = await updateQuestProgress(userId, 'pomodoro', 1);
  const achievements = await checkAchievements(userId);

  if (topicId) {
    await logEvent(userId, topicId, 'pomodoro_complete', Math.round(durationMinutes * 60), null);
  }

  const profile = await getGamificationProfile(userId);
  const milestoneXP = streak.milestoneXP || 0;

  return {
    alreadyCompleted: false,
    sessionId,
    sessionXP,
    questXP: questResult.xpAwarded,
    milestoneXP,
    xp: sessionXP + questResult.xpAwarded + milestoneXP,
    totalXp: profile.total_xp,
    level: profile.current_level,
    leveledUp: profile.current_level > before.current_level,
    oldLevel: before.current_level,
    streakDays: streak.streakDays,
    streakMultiplier: streak.multiplier,
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
