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

  it('unlocks tiered Pomodoro achievements when conditions are met', async () => {
    // With 0 sessions nothing should unlock for pomodoro_mastery
    let unlocked = await checkAchievements('test');
    expect(unlocked.find(a => a.id === 'pomodoro_mastery_silver')).toBeUndefined();

    // Add 50 sessions → should unlock bronze (10) and silver (50) tiers
    const sessions = [];
    for (let i = 0; i < 50; i++) {
      sessions.push({ id: `sess_${i}`, user_id: 'test', topic_id: 't1', duration_minutes: 25, completed: 1, created_at: new Date().toISOString() });
    }
    await db.study_sessions.bulkAdd(sessions);

    unlocked = await checkAchievements('test');
    expect(unlocked.find(a => a.id === 'pomodoro_mastery_bronze')).toBeDefined();
    expect(unlocked.find(a => a.id === 'pomodoro_mastery_silver')).toBeDefined();
    expect(unlocked.find(a => a.id === 'pomodoro_mastery_gold')).toBeUndefined(); // needs 200

    // Check DB
    const bronzeInDb = await db.achievements.where('achievement_id').equals('pomodoro_mastery_bronze').first();
    expect(bronzeInDb).toBeDefined();
    const silverInDb = await db.achievements.where('achievement_id').equals('pomodoro_mastery_silver').first();
    expect(silverInDb).toBeDefined();

    // Check if XP was awarded for both tiers
    expect(xpEngine.awardXP).toHaveBeenCalledWith('test', 100, 'achievement', 'pomodoro_mastery_bronze');
    expect(xpEngine.awardXP).toHaveBeenCalledWith('test', 300, 'achievement', 'pomodoro_mastery_silver');
  });

  it('does not unlock twice', async () => {
    const sessions = [];
    for (let i = 0; i < 50; i++) {
      sessions.push({ id: `sess_${i}`, user_id: 'test', topic_id: 't1', duration_minutes: 25, completed: 1, created_at: new Date().toISOString() });
    }
    await db.study_sessions.bulkAdd(sessions);

    let unlocked = await checkAchievements('test');
    expect(unlocked.length).toBeGreaterThan(0);

    // Call again
    unlocked = await checkAchievements('test');
    expect(unlocked.length).toBe(0); // Should be empty since tiers are already unlocked
  });
});
