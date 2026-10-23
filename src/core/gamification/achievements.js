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
      const problems = await db.coding_problems.toArray();
      const solved = problems.filter(p => p.status === 'solved').length;
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
      const subjects = await db.subjects.toArray();
      for (const subject of subjects) {
        const units = await db.units.where('subject_id').equals(subject.id).toArray();
        const topicIds = units.map(u => u.id);
        const topics = await db.topics.where('unit_id').anyOf(topicIds).toArray();
        if (topics.length === 0) continue;
        const topicsWithContent = topics.filter(t => t.has_content === 1);
        if (topicsWithContent.length === topics.length) {
          return true; // All topics in this subject have content
        }
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
      const qbanks = await db.question_banks.toArray();
      for (const qb of qbanks) {
        const questions = await db.questions.where('bank_id').equals(qb.id).toArray();
        if (questions.length >= 10) {
          return true;
        }
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
      const topics = await db.topics.toArray();
      const topicsWithContent = topics.filter(t => t.has_content === 1);
      return topicsWithContent.length > 0;
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
