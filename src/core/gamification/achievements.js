import { db } from '../../data/db';

/**
 * Tiered achievement system: each achievement has bronze → silver → gold → diamond tiers.
 * The achievement checker awards the next unearned tier when conditions are met.
 */

const countCompletedSessions = async (userId) => {
  const sessions = await db.study_sessions.where('user_id').equals(userId).toArray();
  return sessions.filter(s => s.completed !== 0).length;
};

const countSolvedProblems = async () => {
  return await db.coding_problems.where('status').equals('solved').count();
};

const getLongestStreak = async (userId) => {
  const profile = await db.gamification_profiles.where('user_id').equals(userId).first();
  return profile ? profile.longest_streak : 0;
};

const countStudiedTopics = async () => {
  return await db.topics.where('has_content').equals(1).count();
};

const countCompletedSubjects = async () => {
  const [units, topics] = await Promise.all([db.units.toArray(), db.topics.toArray()]);
  const subjectByUnit = new Map(units.map(u => [u.id, u.subject_id]));
  const topicCountBySubject = new Map();
  const studiedCountBySubject = new Map();
  for (const topic of topics) {
    const subjectId = subjectByUnit.get(topic.unit_id);
    if (!subjectId) continue;
    topicCountBySubject.set(subjectId, (topicCountBySubject.get(subjectId) || 0) + 1);
    if (topic.has_content === 1) {
      studiedCountBySubject.set(subjectId, (studiedCountBySubject.get(subjectId) || 0) + 1);
    }
  }
  let count = 0;
  for (const [subjectId, total] of topicCountBySubject) {
    if (studiedCountBySubject.get(subjectId) === total) count++;
  }
  return count;
};

const countQuestionsInAnyBank = async () => {
  const questions = await db.questions.toArray();
  const countByBank = new Map();
  let max = 0;
  for (const q of questions) {
    const count = (countByBank.get(q.bank_id) || 0) + 1;
    countByBank.set(q.bank_id, count);
    if (count > max) max = count;
  }
  return max;
};

const getTotalFocusMinutes = async (userId) => {
  const sessions = await db.study_sessions.where('user_id').equals(userId).toArray();
  return sessions.filter(s => s.completed !== 0).reduce((sum, s) => sum + (Number(s.duration_minutes) || 0), 0);
};

const hasStudiedInTimeRange = async (userId, startHour, endHour) => {
  const sessions = await db.study_sessions.where('user_id').equals(userId).toArray();
  return sessions.some(s => {
    const hour = new Date(s.created_at).getHours();
    if (startHour < endHour) return hour >= startHour && hour < endHour;
    return hour >= startHour || hour < endHour; // wraps midnight
  });
};

export const ACHIEVEMENTS = [
  // === Pomodoro Mastery ===
  {
    id: 'pomodoro_mastery',
    title: 'Pomodoro Mastery',
    icon_name: 'Timer',
    tiers: [
      { tier: 'bronze', suffix: 'Starter',    description: 'Complete 10 focus sessions',  xp_reward: 100,  threshold: 10 },
      { tier: 'silver', suffix: 'Regular',     description: 'Complete 50 focus sessions',  xp_reward: 300,  threshold: 50 },
      { tier: 'gold',   suffix: 'Pro',         description: 'Complete 200 focus sessions', xp_reward: 750,  threshold: 200 },
      { tier: 'diamond',suffix: 'Legendary',   description: 'Complete 500 focus sessions', xp_reward: 1500, threshold: 500 },
    ],
    getProgress: (userId) => countCompletedSessions(userId),
  },

  // === Streak Champion ===
  {
    id: 'streak_champion',
    title: 'Streak Champion',
    icon_name: 'Flame',
    tiers: [
      { tier: 'bronze', suffix: 'Warming Up', description: 'Achieve a 3-day streak',  xp_reward: 50,   threshold: 3 },
      { tier: 'silver', suffix: 'On Fire',    description: 'Achieve a 7-day streak',  xp_reward: 200,  threshold: 7 },
      { tier: 'gold',   suffix: 'Blazing',    description: 'Achieve a 30-day streak', xp_reward: 750,  threshold: 30 },
      { tier: 'diamond',suffix: 'Unstoppable', description: 'Achieve a 100-day streak', xp_reward: 2000, threshold: 100 },
    ],
    getProgress: (userId) => getLongestStreak(userId),
  },

  // === Code Ninja ===
  {
    id: 'code_ninja',
    title: 'Code Ninja',
    icon_name: 'TerminalSquare',
    tiers: [
      { tier: 'bronze', suffix: 'Novice',    description: 'Solve 5 coding problems',   xp_reward: 100,  threshold: 5 },
      { tier: 'silver', suffix: 'Coder',     description: 'Solve 25 coding problems',  xp_reward: 400,  threshold: 25 },
      { tier: 'gold',   suffix: 'Hacker',    description: 'Solve 100 coding problems', xp_reward: 1000, threshold: 100 },
      { tier: 'diamond',suffix: 'Grandmaster', description: 'Solve 250 coding problems', xp_reward: 2500, threshold: 250 },
    ],
    getProgress: () => countSolvedProblems(),
  },

  // === Topic Explorer ===
  {
    id: 'topic_explorer',
    title: 'Topic Explorer',
    icon_name: 'BookOpen',
    tiers: [
      { tier: 'bronze', suffix: 'Curious',    description: 'Study 1 topic',    xp_reward: 50,   threshold: 1 },
      { tier: 'silver', suffix: 'Studious',   description: 'Study 10 topics',  xp_reward: 200,  threshold: 10 },
      { tier: 'gold',   suffix: 'Voracious',  description: 'Study 50 topics',  xp_reward: 600,  threshold: 50 },
      { tier: 'diamond',suffix: 'Encyclopedia', description: 'Study 100 topics', xp_reward: 1500, threshold: 100 },
    ],
    getProgress: () => countStudiedTopics(),
  },

  // === Subject Master ===
  {
    id: 'subject_master',
    title: 'Subject Master',
    icon_name: 'GraduationCap',
    tiers: [
      { tier: 'bronze', suffix: '',           description: 'Complete all topics in 1 subject',  xp_reward: 500,  threshold: 1 },
      { tier: 'silver', suffix: 'Double',     description: 'Complete all topics in 2 subjects', xp_reward: 800,  threshold: 2 },
      { tier: 'gold',   suffix: 'Triple',     description: 'Complete all topics in 3 subjects', xp_reward: 1200, threshold: 3 },
      { tier: 'diamond',suffix: 'Total',      description: 'Complete all topics in 5 subjects', xp_reward: 2500, threshold: 5 },
    ],
    getProgress: () => countCompletedSubjects(),
  },

  // === Question Collector ===
  {
    id: 'question_collector',
    title: 'Question Collector',
    icon_name: 'FileText',
    tiers: [
      { tier: 'bronze', suffix: '',          description: 'Create 10 questions in a bank', xp_reward: 100, threshold: 10 },
      { tier: 'silver', suffix: 'Builder',   description: 'Create 25 questions in a bank', xp_reward: 250, threshold: 25 },
      { tier: 'gold',   suffix: 'Architect', description: 'Create 50 questions in a bank', xp_reward: 500, threshold: 50 },
    ],
    getProgress: () => countQuestionsInAnyBank(),
  },

  // === Deep Focus ===
  {
    id: 'deep_focus',
    title: 'Deep Focus',
    icon_name: 'Brain',
    tiers: [
      { tier: 'bronze', suffix: '',          description: 'Accumulate 60 minutes of focus', xp_reward: 100, threshold: 60 },
      { tier: 'silver', suffix: 'Marathoner', description: 'Accumulate 300 minutes of focus', xp_reward: 400, threshold: 300 },
      { tier: 'gold',   suffix: 'Titan',     description: 'Accumulate 1000 minutes of focus', xp_reward: 1000, threshold: 1000 },
      { tier: 'diamond',suffix: 'Ascended',  description: 'Accumulate 3000 minutes of focus', xp_reward: 3000, threshold: 3000 },
    ],
    getProgress: (userId) => getTotalFocusMinutes(userId),
  },

  // === Night Owl (non-tiered, single unlock) ===
  {
    id: 'night_owl',
    title: 'Night Owl',
    icon_name: 'Moon',
    tiers: [
      { tier: 'bronze', suffix: '', description: 'Study after 10 PM', xp_reward: 100, threshold: 1 },
    ],
    getProgress: async (userId) => (await hasStudiedInTimeRange(userId, 22, 4)) ? 1 : 0,
  },

  // === Early Bird (non-tiered, single unlock) ===
  {
    id: 'early_bird',
    title: 'Early Bird',
    icon_name: 'Sun',
    tiers: [
      { tier: 'bronze', suffix: '', description: 'Study before 7 AM', xp_reward: 100, threshold: 1 },
    ],
    getProgress: async (userId) => (await hasStudiedInTimeRange(userId, 4, 7)) ? 1 : 0,
  },
];

/** Flat list of all tier IDs for easy lookup. */
export const ALL_TIER_IDS = ACHIEVEMENTS.flatMap(a =>
  a.tiers.map(t => `${a.id}_${t.tier}`)
);
