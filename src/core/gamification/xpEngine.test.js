import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { db } from '../../data/db';
import { calculateLevel, getXPForNextLevel, getXPProgress, awardXP, getGamificationProfile } from './xpEngine';

describe('XP Engine Tests', () => {
  beforeEach(async () => {
    await db.gamification_profiles.clear();
    await db.xp_transactions.clear();
  });

  afterEach(async () => {
    await db.gamification_profiles.clear();
    await db.xp_transactions.clear();
  });

  it('calculates correct level from XP', () => {
    expect(calculateLevel(0)).toBe(1);
    expect(calculateLevel(149)).toBe(1);
    expect(calculateLevel(150)).toBe(2);
    expect(calculateLevel(449)).toBe(2);
    expect(calculateLevel(450)).toBe(3);
  });

  it('calculates XP progress correctly', () => {
    // Level 2 requires 150 total XP. At 200 XP, we are 50 XP into level 2. Next level requires 300 XP.
    const progress = getXPProgress(200, 2);
    expect(progress.xpIntoCurrentLevel).toBe(50);
    expect(progress.xpNeeded).toBe(300);
    expect(progress.percentage).toBe(Math.floor((50/300)*100));
  });

  it('awards XP and triggers level up', async () => {
    let result = await awardXP('testUser', 100, 'test');
    expect(result.leveledUp).toBe(false);

    result = await awardXP('testUser', 100, 'test');
    expect(result.leveledUp).toBe(true);
    expect(result.newLevel).toBe(2);

    const profile = await getGamificationProfile('testUser');
    expect(profile.total_xp).toBe(200);
    expect(profile.current_level).toBe(2);
  });
});
