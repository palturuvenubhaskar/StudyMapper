import { db } from '../../data/db';
import { v4 as uuidv4 } from 'uuid';
import { awardXP, XP_RULES } from './xpEngine';

const QUEST_TEMPLATES = [
  // Universal quests (anyone can complete)
  { id: 'q_notes',       type: 'generate_notes',   title: 'Generate notes for 1 topic',      target: 1,  universal: true,  weight: 3 },
  { id: 'q_pomodoro',    type: 'pomodoro',          title: 'Complete 2 focus sessions',        target: 2,  universal: true,  weight: 3 },
  { id: 'q_pomodoro_long', type: 'pomodoro_long',   title: 'Complete a 45+ min focus session', target: 1,  universal: true,  weight: 1 },
  { id: 'q_study_30',    type: 'study_minutes',     title: 'Study for 30 minutes total',       target: 30, universal: true,  weight: 2 },
  { id: 'q_topics_2',    type: 'study_topics',      title: 'Study 2 different topics',         target: 2,  universal: true,  weight: 2 },
  // Specialized quests (not everyone has these features active)
  { id: 'q_code',        type: 'solve_code',        title: 'Solve 1 coding problem',           target: 1,  universal: false, weight: 2 },
  { id: 'q_code_2',      type: 'solve_code',        title: 'Solve 2 coding problems',          target: 2,  universal: false, weight: 1 },
  { id: 'q_flashcard',   type: 'review_flashcard',  title: 'Review 10 flashcards',             target: 10, universal: false, weight: 2 },
  { id: 'q_flashcard_20', type: 'review_flashcard', title: 'Review 20 flashcards',             target: 20, universal: false, weight: 1 },
  { id: 'q_questions',   type: 'create_questions',  title: 'Add 3 questions to a bank',        target: 3,  universal: false, weight: 1 },
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

/**
 * Weighted random selection: items with higher weight appear more often.
 */
const weightedShuffle = (items) => {
  const pool = [];
  for (const item of items) {
    for (let i = 0; i < (item.weight || 1); i++) pool.push(item);
  }
  // Fisher-Yates on the pool, then deduplicate by id keeping first occurrence.
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const seen = new Set();
  return pool.filter(item => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
};

const pickQuests = () => {
  const universal = QUEST_TEMPLATES.filter(q => q.universal);
  const optional = QUEST_TEMPLATES.filter(q => !q.universal);
  // Guarantee at least one universal quest.
  const shuffledUniversal = weightedShuffle(universal);
  const guaranteed = shuffledUniversal[0];
  const rest = weightedShuffle([...shuffledUniversal.slice(1), ...optional])
    .slice(0, QUESTS_PER_DAY - 1);
  // Final shuffle so the guaranteed quest isn't always first.
  const picked = [guaranteed, ...rest];
  for (let i = picked.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [picked[i], picked[j]] = [picked[j], picked[i]];
  }
  return picked;
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
 * @returns {{newlyCompleted: number, completedQuests: Array, xpAwarded: number, allQuestsComplete: boolean}}
 */
export const updateQuestProgress = async (userId = 'guest', type, amount = 1) => {
  const today = getTodayString();
  const dailyRecord = await findToday(userId, today);
  if (!dailyRecord) {
    // Create the day's quests first, then look it up again.
    await getOrCreateDailyQuests(userId);
  }

  const record = dailyRecord || (await findToday(userId, today));
  if (!record) return { newlyCompleted: 0, completedQuests: [], xpAwarded: 0, allQuestsComplete: false };

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

  if (!updated) return { newlyCompleted: 0, completedQuests: [], xpAwarded: 0, allQuestsComplete: false };

  const completedCount = quests.filter(q => q.completed).length;
  const wasAllComplete = record.completed_count === quests.length;
  const isAllComplete = completedCount === quests.length && !wasAllComplete;

  let xpAwarded = completedQuests.length * XP_RULES.dailyQuest;

  await db.daily_quests.update(record.id, {
    quests_json: JSON.stringify(quests),
    completed_count: completedCount,
  });

  if (xpAwarded > 0) {
    await awardXP(userId, xpAwarded, 'daily_quest');
  }

  // All-quests-complete bonus
  if (isAllComplete) {
    await awardXP(userId, XP_RULES.allQuestsCompleteBonus, 'all_quests_bonus');
    xpAwarded += XP_RULES.allQuestsCompleteBonus;
  }

  return { newlyCompleted: completedQuests.length, completedQuests, xpAwarded, allQuestsComplete: isAllComplete };
};
