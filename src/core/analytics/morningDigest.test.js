import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { db } from '../../data/db';
import { generateMorningDigest } from './morningDigest';
import { getGamificationProfile } from '../gamification/xpEngine';

describe('Morning Digest Tests', () => {
  beforeEach(async () => {
    localStorage.clear();
    await db.gamification_profiles.clear();
    await db.study_weaknesses.clear();
    await db.daily_quests.clear();
    await db.topics.clear();
  });

  afterEach(async () => {
    localStorage.clear();
  });

  it('generates a digest only once per day unless forced', async () => {
    const profile = await getGamificationProfile('test');

    let digest = await generateMorningDigest('test');
    expect(digest).toBeDefined();
    expect(digest.streakDays).toBe(0);

    // Call again, should be null
    digest = await generateMorningDigest('test');
    expect(digest).toBeNull();

    // Force it
    digest = await generateMorningDigest('test', true);
    expect(digest).toBeDefined();
  });
});
