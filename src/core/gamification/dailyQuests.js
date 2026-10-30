import { db } from '../../data/db';
import { v4 as uuidv4 } from 'uuid';
import { awardXP, XP_RULES } from './xpEngine';

const QUEST_TEMPLATES = [
  { id: 'q_notes', type: 'generate_notes', title: 'Generate notes for 1 topic', target: 1, universal: true },
  { id: 'q_pomodoro', type: 'pomodoro', title: 'Complete 2 focus sessions', target: 2, universal: true },
  { id: 'q_code', type: 'solve_code', title: 'Solve 1 coding problem', target: 1, universal: false },
  { id: 'q_flashcard', type: 'review_flashcard', title: 'Review 10 flashcards', target: 10, universal: false },
];

const QUESTS_PER_DAY = 3;

/**
 * Local calendar day (not UTC), so quests roll over at the user's midnight
 * and match the streak calculation.
 */
export const getTodayString = (date = new Date()) => {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
};

const shuffle = (items) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const pickQuests = () => {
  // Always include one "anyone can finish this" quest so the daily set is
  // never impossible (the old random pick could hand a non-coder only code quests).
  const universal = QUEST_TEMPLATES.filter(q => q.universal);
  const optional = QUEST_TEMPLATES.filter(q => !q.universal);
  const guaranteed = shuffle(universal)[0];
  const rest = shuffle([...universal.filter(q => q.id !== guaranteed.id), ...optional])
    .slice(0, QUESTS_PER_DAY - 1);
  return shuffle([guaranteed, ...rest]);
};

const findToday = (userId, today) =>
  db.daily_quests.where('[user_id+date]').equals([userId, today]).first();

export const getOrCreateDailyQuests = async (userId = 'guest') => {
  const today = getTodayString();
  let dailyRecord = await findToday(userId, today);

  if (!dailyRecord) {
    const selected = pickQuests().map(q => ({ ...q, progress: 0, completed: false }));

    dailyRecord = {
      id: uuidv4(),
      user_id: userId,
      date: today,
      quests_json: JSON.stringify(selected),
      completed_count: 0,
    };
    await db.daily_quests.add(dailyRecord);
  }

  return { ...dailyRecord, quests: JSON.parse(dailyRecord.quests_json) };
};

/**
 * Update today's quest progress. Creates today's quests on demand: previously
 * a session completed before the dashboard was opened was silently discarded.
 *
 * @returns {{newlyCompleted: number, completedQuests: Array, xpAwarded: number}}
 */
export const updateQuestProgress = async (userId = 'guest', type, amount = 1) => {
  const today = getTodayString();
  const dailyRecord = await findToday(userId, today);
  if (!dailyRecord) {
    // Create the day's quests first, then look it up again.
    await getOrCreateDailyQuests(userId);
  }

  const record = dailyRecord || (await findToday(userId, today));
  if (!record) return { newlyCompleted: 0, completedQuests: [], xpAwarded: 0 };

  const quests = JSON.parse(record.quests_json);
  let updated = false;
  const completedQuests = [];

  for (const q of quests) {
    if (q.type === type && !q.completed) {
      q.progress = Math.min(q.target, q.progress + amount);
      updated = true;
      if (q.progress >= q.target) {
        q.completed = true;
        completedQuests.push({ id: q.id, title: q.title });
      }
    }
  }

  if (!updated) return { newlyCompleted: 0, completedQuests: [], xpAwarded: 0 };

  const xpAwarded = completedQuests.length * XP_RULES.dailyQuest;
  await db.daily_quests.update(record.id, {
    quests_json: JSON.stringify(quests),
    completed_count: quests.filter(q => q.completed).length,
  });

  if (xpAwarded > 0) {
    await awardXP(userId, xpAwarded, 'daily_quest');
  }

  return { newlyCompleted: completedQuests.length, completedQuests, xpAwarded };
};
