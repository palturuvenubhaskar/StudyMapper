import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { db } from '../../data/db';
import { getOrCreateWeeklyChallenges, updateWeeklyChallengeProgress, getWeekKey } from './weeklyChallenges';
import { getGamificationProfile } from './xpEngine';

const clearAll = async () => {
  await Promise.all([
    db.weekly_challenges.clear(),
    db.gamification_profiles.clear(),
    db.xp_transactions.clear(),
  ]);
};

describe('Weekly Challenges', () => {
  beforeEach(clearAll);
  afterEach(clearAll);

  it('generates 2 weekly challenges for the current week', async () => {
    const weekly = await getOrCreateWeeklyChallenges('test_user');
    expect(weekly.week_key).toBe(getWeekKey());
    expect(weekly.challenges).toHaveLength(2);
    expect(weekly.challenges[0].progress).toBe(0);
    expect(weekly.challenges[0].completed).toBe(false);
  });

  it('updates progress and awards XP when challenge completes', async () => {
    const weekKey = getWeekKey();
    await db.weekly_challenges.add({
      id: 'wc_test_1',
      user_id: 'test_user',
      week_key: weekKey,
      challenges_json: JSON.stringify([
        { id: 'c_sessions', type: 'sessions', title: 'Complete 3 sessions', target: 3, progress: 2, completed: false, xp_reward: 300 }
      ]),
      completed_count: 0,
    });

    const res = await updateWeeklyChallengeProgress('test_user', 'sessions', 1);
    expect(res.newlyCompleted).toBe(1);
    expect(res.xpAwarded).toBe(300);
    expect(res.completedChallenges[0].id).toBe('c_sessions');

    const profile = await getGamificationProfile('test_user');
    expect(profile.total_xp).toBe(300);
  });
});

