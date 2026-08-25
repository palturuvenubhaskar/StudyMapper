import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { db } from '../../data/db';
import { updateStreak } from './streakTracker';
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

  it('resets streak if a day is missed', async () => {
    const day1 = '2023-10-15T12:00:00Z';
    const day3 = '2023-10-17T12:00:00Z';
    
    await updateStreak('test', day1);
    
    // forcefully set streak_days to something higher to ensure it resets to 1
    const profile = await getGamificationProfile('test');
    await db.gamification_profiles.update(profile.id, { streak_days: 5 });

    const result = await updateStreak('test', day3);
    
    expect(result.streakActive).toBe(false);
    expect(result.streakDays).toBe(1);
  });
});
