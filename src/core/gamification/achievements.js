import { db } from '../../data/db';

export const ACHIEVEMENTS = [
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Study after 10 PM',
    icon_name: 'Moon',
    xp_reward: 100,
    condition_checker: async (userId) => {
      // Check if there's any study session created after 22:00
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
  }
];
