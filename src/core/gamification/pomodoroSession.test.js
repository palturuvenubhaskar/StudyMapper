import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { db } from '../../data/db';
import { completePomodoroSession, getTodayFocusStats } from './pomodoroSession';
import { getGamificationProfile, calculatePomodoroXP } from './xpEngine';

// Keep XP assertions deterministic: achievements have their own suite.
vi.mock('./achievementChecker', () => ({
  checkAchievements: vi.fn(async () => []),
}));

const clearAll = async () => {
  await Promise.all([
    db.study_sessions.clear(),
    db.gamification_profiles.clear(),
    db.xp_transactions.clear(),
    db.daily_quests.clear(),
    db.achievements.clear(),
  ]);
};

describe('Pomodoro session rewards', () => {
  beforeEach(clearAll);
  afterEach(clearAll);

  it('records the session and pays XP even without a topic', async () => {
    const result = await completePomodoroSession({
      sessionId: 'sess-1',
      userId: 'test',
      durationMinutes: 25,
    });

    expect(result.alreadyCompleted).toBe(false);
    expect(result.sessionXP).toBe(calculatePomodoroXP(25, 1));

    const session = await db.study_sessions.get('sess-1');
    expect(session).toBeDefined();
    expect(session.user_id).toBe('test');
    expect(session.topic_id).toBeNull();
    expect(session.completed).toBe(1);
    expect(session.duration_minutes).toBe(25);

    const profile = await getGamificationProfile('test');
    expect(profile.total_xp).toBe(result.sessionXP);
    expect(profile.streak_days).toBe(1);

    const stats = await getTodayFocusStats('test');
    expect(stats.sessions).toBe(1);
    expect(stats.minutes).toBe(25);
  });

  it('never pays the same session twice', async () => {
    const first = await completePomodoroSession({ sessionId: 'sess-dup', userId: 'test', durationMinutes: 25 });
    const second = await completePomodoroSession({ sessionId: 'sess-dup', userId: 'test', durationMinutes: 25 });

    expect(second.alreadyCompleted).toBe(true);

    const profile = await getGamificationProfile('test');
    expect(profile.total_xp).toBe(first.sessionXP);
    expect(await db.study_sessions.count()).toBe(1);
  });

  it('keeps focus stats per user', async () => {
    await completePomodoroSession({ sessionId: 'a-1', userId: 'alice', durationMinutes: 25 });
    await completePomodoroSession({ sessionId: 'b-1', userId: 'bob', durationMinutes: 15 });

    expect((await getTodayFocusStats('alice')).sessions).toBe(1);
    expect((await getTodayFocusStats('alice')).minutes).toBe(25);
    expect((await getTodayFocusStats('bob')).minutes).toBe(15);
    expect((await getTodayFocusStats('carol')).sessions).toBe(0);
  });

  it('applies the streak multiplier to longer streaks', async () => {
    const base = calculatePomodoroXP(25, 0);
    const hot = calculatePomodoroXP(25, 30);

    expect(base).toBe(63); // 25 * 2 XP * 1.25 completion bonus
    expect(hot).toBe(94); // same session, 1.5x streak multiplier
    expect(hot).toBeGreaterThan(base);
  });
});
