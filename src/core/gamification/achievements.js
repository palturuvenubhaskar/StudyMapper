import { db } from '../../data/db';

export const ACHIEVEMENTS = [
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Study after 10 PM',
    icon_name: 'Moon',
    xp_reward: 100,
    condition_checker: async (userId) => {
      const sessions = await db.study_sessions.toArray();
      return sessions.some(s => {
        const hour = new Date(s.created_at).getHours();
        return hour >= 22 || hour < 4; // 10 PM to 4 AM
      });
    }
  },
  {
    id: 'pomodoro_pro',
    title: 'Pomodoro Pro',
    description: 'Complete 50 Pomodoro sessions',
    icon_name: 'Timer',
    xp_reward: 500,
    condition_checker: async (userId) => {
      const count = await db.study_sessions.count();
      return count >= 50;
    }
  },
  {
    id: 'code_ninja',
    title: 'Code Ninja',
    description: 'Solve 25 coding problems',
    icon_name: 'TerminalSquare',
    xp_reward: 500,
    condition_checker: async (userId) => {
      const solved = await db.coding_problems.where('status').equals('solved').count();
      return solved >= 25;
    }
  },
  {
    id: 'week_warrior',
    title: 'Week Warrior',
    description: 'Achieve a 7-day study streak',
    icon_name: 'Flame',
    xp_reward: 300,
    condition_checker: async (userId) => {
      const profile = await db.gamification_profiles.where('user_id').equals(userId).first();
      return profile ? profile.longest_streak >= 7 : false;
    }
  },
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Study before 7 AM',
    icon_name: 'Sun',
    xp_reward: 100,
    condition_checker: async (userId) => {
      const sessions = await db.study_sessions.toArray();
      return sessions.some(s => {
        const hour = new Date(s.created_at).getHours();
        return hour >= 4 && hour < 7;
      });
    }
  },
  // New achievements connected to real study progress
  {
    id: 'subject_master',
    title: 'Subject Master',
    description: 'Complete all topics in a subject',
    icon_name: 'BookOpen',
    xp_reward: 500,
    condition_checker: async (userId) => {
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
      for (const [subjectId, total] of topicCountBySubject) {
        if (studiedCountBySubject.get(subjectId) === total) return true;
      }
      return false;
    }
  },
  {
    id: 'question_collector',
    title: 'Question Collector',
    description: 'Create 10 questions in a bank',
    icon_name: 'FileText',
    xp_reward: 300,
    condition_checker: async (userId) => {
      const questions = await db.questions.toArray();
      const countByBank = new Map();
      for (const q of questions) {
        const count = (countByBank.get(q.bank_id) || 0) + 1;
        if (count >= 10) return true;
        countByBank.set(q.bank_id, count);
      }
      return false;
    }
  },
  {
    id: 'first_step',
    title: 'First Step',
    description: 'Complete your first topic',
    icon_name: 'CheckCircle2',
    xp_reward: 100,
    condition_checker: async (userId) => {
      const count = await db.topics.where('has_content').equals(1).count();
      return count > 0;
    }
  },
  {
    id: 'streak_30',
    title: '30-Day Streak',
    description: 'Maintain a 30-day study streak',
    icon_name: 'Flame',
    xp_reward: 1000,
    condition_checker: async (userId) => {
      const profile = await db.gamification_profiles.where('user_id').equals(userId).first();
      return profile ? profile.longest_streak >= 30 : false;
    }
  }
];
