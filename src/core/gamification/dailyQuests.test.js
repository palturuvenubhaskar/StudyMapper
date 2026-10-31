import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { db } from '../../data/db';
import { getOrCreateDailyQuests, getTodayString, updateQuestProgress } from './dailyQuests';
import { getGamificationProfile, XP_RULES } from './xpEngine';

const seedQuests = async (userId, quests) => {
  await db.daily_quests.add({
    id: `daily_${userId}`,
    user_id: userId,
    date: getTodayString(),
    quests_json: JSON.stringify(quests),
    completed_count: 0,
  });
};

const clearAll = async () => {
  await Promise.all([
    db.daily_quests.clear(),
    db.gamification_profiles.clear(),
    db.xp_transactions.clear(),
  ]);
};

describe('Daily quests', () => {
  beforeEach(clearAll);
  afterEach(clearAll);

  it('creates the day record on demand instead of dropping progress', async () => {
    // A session completed before the dashboard was ever opened.
    await updateQuestProgress('test', 'pomodoro', 1);

    const record = await db.daily_quests.where('[user_id+date]').equals(['test', getTodayString()]).first();
    expect(record).toBeDefined();
    expect(JSON.parse(record.quests_json)).toHaveLength(3);
  });

  it('always includes one quest anyone can complete', async () => {
    for (let i = 0; i < 12; i += 1) {
      const daily = await getOrCreateDailyQuests(`user_${i}`);
      expect(daily.quests.some(q => q.universal)).toBe(true);
      expect(daily.quests).toHaveLength(3);
    }
  });

  it('completes a quest once and awards its XP', async () => {
    await seedQuests('test', [
      { id: 'q_pomodoro', type: 'pomodoro', title: 'Complete 2 focus sessions', target: 2, progress: 0, completed: false },
      { id: 'q_notes', type: 'generate_notes', title: 'Generate notes for 1 topic', target: 1, progress: 0, completed: false },
    ]);

    const first = await updateQuestProgress('test', 'pomodoro', 1);
    expect(first.newlyCompleted).toBe(0);
    expect(first.xpAwarded).toBe(0);
    expect(first.allQuestsComplete).toBe(false);

    const second = await updateQuestProgress('test', 'pomodoro', 1);
    expect(second.newlyCompleted).toBe(1);
    expect(second.xpAwarded).toBe(XP_RULES.dailyQuest);
    expect(second.completedQuests[0].title).toContain('2 focus sessions');
    expect(second.allQuestsComplete).toBe(false);

    const profile = await getGamificationProfile('test');
    expect(profile.total_xp).toBe(XP_RULES.dailyQuest);

    // Finishing more sessions must not pay the same quest again.
    const third = await updateQuestProgress('test', 'pomodoro', 1);
    expect(third.xpAwarded).toBe(0);
    expect(third.allQuestsComplete).toBe(false);
    expect((await getGamificationProfile('test')).total_xp).toBe(XP_RULES.dailyQuest);
  });

  it('awards bonus when all quests are completed', async () => {
    await seedQuests('test_all', [
      { id: 'q_notes', type: 'generate_notes', title: 'Generate notes', target: 1, progress: 0, completed: false },
    ]);

    const res = await updateQuestProgress('test_all', 'generate_notes', 1);
    expect(res.newlyCompleted).toBe(1);
    expect(res.allQuestsComplete).toBe(true);
    expect(res.xpAwarded).toBe(XP_RULES.dailyQuest + XP_RULES.allQuestsCompleteBonus);
  });

  it('keeps quests separate per user', async () => {
    await seedQuests('alice', [
      { id: 'q_pomodoro', type: 'pomodoro', title: 'Complete 2 focus sessions', target: 1, progress: 0, completed: false },
    ]);

    await updateQuestProgress('bob', 'pomodoro', 1);

    const alice = await getOrCreateDailyQuests('alice');
    expect(alice.quests[0].completed).toBe(false);
    expect((await getGamificationProfile('alice')).total_xp).toBe(0);
  });

  it('uses the local calendar day, not UTC', () => {
    const justAfterLocalMidnight = new Date();
    justAfterLocalMidnight.setHours(0, 30, 0, 0);

    const expected = `${justAfterLocalMidnight.getFullYear()}-${String(justAfterLocalMidnight.getMonth() + 1).padStart(2, '0')}-${String(justAfterLocalMidnight.getDate()).padStart(2, '0')}`;
    expect(getTodayString(justAfterLocalMidnight)).toBe(expected);
  });
});
