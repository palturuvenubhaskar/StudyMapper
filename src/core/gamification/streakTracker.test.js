import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { db } from '../../data/db';
import { updateStreak, getStreakSnapshot } from './streakTracker';
import { getGamificationProfile } from './xpEngine';

describe('Streak Tracker Tests', () => {
  beforeEach(async () => {
    await db.gamification_profiles.clear();
  });

  afterEach(async () => {
    await db.gamification_profiles.clear();
  });

  it('starts a new streak on first study', async () => {
    const today = '2023-10-15T12:00:00Z';
    const result = await updateStreak('test', today);
    expect(result.streakActive).toBe(true);
    expect(result.streakDays).toBe(1);
  });

  it('maintains streak on same day study', async () => {
    const today1 = '2023-10-15T12:00:00Z';
    const today2 = '2023-10-15T15:00:00Z';
    
    await updateStreak('test', today1);
    const result = await updateStreak('test', today2);
    
    expect(result.streakActive).toBe(true);
    expect(result.streakDays).toBe(1);
  });

  it('increments streak on consecutive days', async () => {
    const day1 = '2023-10-15T12:00:00Z';
    const day2 = '2023-10-16T12:00:00Z';
    
    await updateStreak('test', day1);
    const result = await updateStreak('test', day2);
    
    expect(result.streakActive).toBe(true);
    expect(result.streakDays).toBe(2);
  });

  it('resets streak if a day is missed and no freezes available', async () => {
    const day1 = '2023-10-15T12:00:00Z';
    const day3 = '2023-10-17T12:00:00Z';
    
    await updateStreak('test', day1);
    
    // forcefully set streak_days to something higher and remove freezes
    const profile = await getGamificationProfile('test');
    await db.gamification_profiles.update(profile.id, { streak_days: 5, streak_freezes: 0 });

    const result = await updateStreak('test', day3);
    
    expect(result.streakActive).toBe(false);
    expect(result.streakDays).toBe(1);
    expect(result.freezeUsed).toBe(false);
  });

  it('uses a streak freeze when exactly one day is missed', async () => {
    const day1 = '2023-10-15T12:00:00Z';
    const day3 = '2023-10-17T12:00:00Z';

    await updateStreak('test', day1);
    const profile = await getGamificationProfile('test');
    await db.gamification_profiles.update(profile.id, { streak_days: 5, streak_freezes: 1 });

    const result = await updateStreak('test', day3);

    expect(result.freezeUsed).toBe(true);
    expect(result.streakActive).toBe(true);
    expect(result.streakDays).toBe(6);
    expect(result.freezesRemaining).toBe(0);
  });

  it('resets streak if multiple days are missed even with a freeze', async () => {
    const day1 = '2023-10-15T12:00:00Z';
    const day4 = '2023-10-18T12:00:00Z';

    await updateStreak('test', day1);
    const profile = await getGamificationProfile('test');
    await db.gamification_profiles.update(profile.id, { streak_days: 5, streak_freezes: 1 });

    const result = await updateStreak('test', day4);

    expect(result.freezeUsed).toBe(false);
    expect(result.streakActive).toBe(false);
    expect(result.streakDays).toBe(1);
  });

  it('does not increment when the clock jumps backwards', async () => {
    await updateStreak('test', '2023-10-16T12:00:00Z');
    const result = await updateStreak('test', '2023-10-15T12:00:00Z');

    expect(result.streakDays).toBe(1);
    expect(result.streakActive).toBe(true);
  });

  it('awards a milestone bonus on the 7th day', async () => {
    await updateStreak('test', '2023-10-09T12:00:00Z');
    const profile = await getGamificationProfile('test');
    await db.gamification_profiles.update(profile.id, { streak_days: 6 });

    const result = await updateStreak('test', '2023-10-10T12:00:00Z');

    expect(result.streakDays).toBe(7);
    expect(result.newMilestone).toBe(true);
    expect(result.milestoneXP).toBeGreaterThan(0);
    expect((await getGamificationProfile('test')).total_xp).toBe(result.milestoneXP);
  });

  it('getStreakSnapshot returns 1x multiplier when streak is stale', async () => {
    await updateStreak('test', '2020-01-01T12:00:00Z');
    const snapshot = await getStreakSnapshot('test');
    expect(snapshot.streakDays).toBe(0);
    expect(snapshot.multiplier).toBe(1);
  });
});
