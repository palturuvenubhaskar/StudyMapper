import { db } from '../../data/db';
import { v4 as uuidv4 } from 'uuid';
import { awardXP } from './xpEngine';

const CHALLENGE_TEMPLATES = [
  { id: 'wc_focus_120', type: 'focus_minutes', title: 'Focus for 120 minutes total', target: 120, xp_reward: 500 },
  { id: 'wc_sessions_10', type: 'sessions', title: 'Complete 10 focus sessions', target: 10, xp_reward: 400 },
  { id: 'wc_quests_15', type: 'quests', title: 'Complete 15 daily quests', target: 15, xp_reward: 600 },
  { id: 'wc_notes_5', type: 'notes', title: 'Generate notes for 5 topics', target: 5, xp_reward: 350 },
  { id: 'wc_code_5', type: 'code', title: 'Solve 5 coding problems', target: 5, xp_reward: 450 },
  { id: 'wc_streak_7', type: 'streak_maintain', title: 'Maintain your streak all week', target: 7, xp_reward: 500 },
];

const CHALLENGES_PER_WEEK = 2;

/**
 * ISO week key for the current week (e.g. "2026-W44").
 */
export const getWeekKey = (date = new Date()) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  const weekNum = 1 + Math.round(((d - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
};

const shuffle = (items) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const findThisWeek = (userId, weekKey) =>
  db.weekly_challenges.where('[user_id+week_key]').equals([userId, weekKey]).first();

export const getOrCreateWeeklyChallenges = async (userId = 'guest') => {
  const weekKey = getWeekKey();
  let record = await findThisWeek(userId, weekKey);

  if (!record) {
    const selected = shuffle(CHALLENGE_TEMPLATES)
      .slice(0, CHALLENGES_PER_WEEK)
      .map(c => ({ ...c, progress: 0, completed: false }));

    record = {
      id: uuidv4(),
      user_id: userId,
      week_key: weekKey,
      challenges_json: JSON.stringify(selected),
      completed_count: 0,
    };
    await db.weekly_challenges.add(record);
  }

  return { ...record, challenges: JSON.parse(record.challenges_json) };
};

/**
 * Update weekly challenge progress.
 *
 * @param {string} userId
 * @param {string} type - one of: focus_minutes, sessions, quests, notes, code, streak_maintain
 * @param {number} amount
 * @returns {{newlyCompleted: number, completedChallenges: Array, xpAwarded: number}}
 */
export const updateWeeklyChallengeProgress = async (userId = 'guest', type, amount = 1) => {
  const weekKey = getWeekKey();
  let record = await findThisWeek(userId, weekKey);
  if (!record) {
    await getOrCreateWeeklyChallenges(userId);
    record = await findThisWeek(userId, weekKey);
  }
  if (!record) return { newlyCompleted: 0, completedChallenges: [], xpAwarded: 0 };

  const challenges = JSON.parse(record.challenges_json);
  let updated = false;
  const completedChallenges = [];
  let totalXP = 0;

  for (const c of challenges) {
    if (c.type === type && !c.completed) {
      c.progress = Math.min(c.target, c.progress + amount);
      updated = true;
      if (c.progress >= c.target) {
        c.completed = true;
        completedChallenges.push({ id: c.id, title: c.title });
        totalXP += c.xp_reward;
      }
    }
  }

  if (!updated) return { newlyCompleted: 0, completedChallenges: [], xpAwarded: 0 };

  await db.weekly_challenges.update(record.id, {
    challenges_json: JSON.stringify(challenges),
    completed_count: challenges.filter(c => c.completed).length,
  });

  if (totalXP > 0) {
    await awardXP(userId, totalXP, 'weekly_challenge');
  }

  return { newlyCompleted: completedChallenges.length, completedChallenges, xpAwarded: totalXP };
};

