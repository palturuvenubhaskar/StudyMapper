import { db } from '../../data/db';
import { v4 as uuidv4 } from 'uuid';
import { awardXP } from './xpEngine';

const QUEST_TEMPLATES = [
  { id: 'q_notes', type: 'generate_notes', title: 'Generate notes for 1 topic', target: 1 },
  { id: 'q_pomodoro', type: 'pomodoro', title: 'Complete 2 Pomodoro sessions', target: 2 },
  { id: 'q_code', type: 'solve_code', title: 'Solve 1 coding problem', target: 1 },
  { id: 'q_flashcard', type: 'review_flashcard', title: 'Review 10 flashcards', target: 10 }
];

const getTodayString = () => new Date().toISOString().split('T')[0];

export const getOrCreateDailyQuests = async (userId = 'guest') => {
  const today = getTodayString();
  let dailyRecord = await db.daily_quests.where('date').equals(today).first();

  if (!dailyRecord) {
    // Generate 3 random quests
    const shuffled = [...QUEST_TEMPLATES].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3).map(q => ({ ...q, progress: 0, completed: false }));
    
    dailyRecord = {
      id: uuidv4(),
      user_id: userId,
      date: today,
      quests_json: JSON.stringify(selected),
      completed_count: 0
    };
    await db.daily_quests.add(dailyRecord);
  }

  return { ...dailyRecord, quests: JSON.parse(dailyRecord.quests_json) };
};

export const updateQuestProgress = async (userId, type, amount = 1) => {
  const today = getTodayString();
  const dailyRecord = await db.daily_quests.where('date').equals(today).first();
  if (!dailyRecord) return;

  const quests = JSON.parse(dailyRecord.quests_json);
  let updated = false;
  let newlyCompleted = 0;

  for (let q of quests) {
    if (q.type === type && !q.completed) {
      q.progress += amount;
      updated = true;
      if (q.progress >= q.target) {
        q.progress = q.target;
        q.completed = true;
        newlyCompleted++;
      }
    }
  }

  if (updated) {
    const newCompletedCount = dailyRecord.completed_count + newlyCompleted;
    await db.daily_quests.update(dailyRecord.id, {
      quests_json: JSON.stringify(quests),
      completed_count: newCompletedCount
    });

    if (newlyCompleted > 0) {
      await awardXP(userId, newlyCompleted * 100, 'daily_quest');
    }
  }
};
