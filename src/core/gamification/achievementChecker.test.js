import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { db } from '../../data/db';
import { checkAchievements } from './achievementChecker';
import * as xpEngine from './xpEngine';

// Mock the xpEngine to track calls
vi.mock('./xpEngine', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    awardXP: vi.fn(),
  };
});

describe('Achievement Checker Tests', () => {
  beforeEach(async () => {
    await db.achievements.clear();
    await db.study_sessions.clear();
    vi.clearAllMocks();
  });

  afterEach(async () => {
    await db.achievements.clear();
    await db.study_sessions.clear();
  });

  it('unlocks Pomodoro Pro achievement when conditions are met', async () => {
    // Check initially - shouldn't unlock
    let unlocked = await checkAchievements('test');
    expect(unlocked.find(a => a.id === 'pomodoro_pro')).toBeUndefined();

    // Add 50 sessions
    const sessions = [];
    for (let i = 0; i < 50; i++) {
      sessions.push({ id: `sess_${i}`, topic_id: 't1', duration_minutes: 25, created_at: new Date().toISOString() });
    }
    await db.study_sessions.bulkAdd(sessions);

    // Check again - should unlock
    unlocked = await checkAchievements('test');
    expect(unlocked.find(a => a.id === 'pomodoro_pro')).toBeDefined();
    
    // Check DB
    const achInDb = await db.achievements.where('achievement_id').equals('pomodoro_pro').first();
    expect(achInDb).toBeDefined();

    // Check if XP was awarded
    expect(xpEngine.awardXP).toHaveBeenCalledWith('test', 500, 'achievement', 'pomodoro_pro');
  });

  it('does not unlock twice', async () => {
    const sessions = [];
    for (let i = 0; i < 50; i++) {
      sessions.push({ id: `sess_${i}`, topic_id: 't1', duration_minutes: 25, created_at: new Date().toISOString() });
    }
    await db.study_sessions.bulkAdd(sessions);

    let unlocked = await checkAchievements('test');
    expect(unlocked.length).toBeGreaterThan(0);

    // Call again
    unlocked = await checkAchievements('test');
    expect(unlocked.length).toBe(0); // Should be empty since it's already unlocked
  });
});
