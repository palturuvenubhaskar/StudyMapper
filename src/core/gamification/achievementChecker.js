import { db } from '../../data/db';
import { v4 as uuidv4 } from 'uuid';
import { ACHIEVEMENTS } from './achievements';
import { awardXP } from './xpEngine';
import confetti from 'canvas-confetti';

export const checkAchievements = async (userId = 'guest') => {
  const unlocked = [];

  for (const achievement of ACHIEVEMENTS) {
    // Check if already unlocked
    const exists = await db.achievements
      .where('achievement_id')
      .equals(achievement.id)
      .first();

    if (!exists) {
      // Check condition
      const isMet = await achievement.condition_checker(userId);
      if (isMet) {
        // Unlock
        await db.achievements.add({
          id: uuidv4(),
          user_id: userId,
          achievement_id: achievement.id,
          unlocked_at: new Date().toISOString(),
          viewed: 0
        });
        
        // Award XP
        await awardXP(userId, achievement.xp_reward, 'achievement', achievement.id);
        
        unlocked.push(achievement);
      }
    }
  }

  if (unlocked.length > 0) {
    // Fire confetti for achievement
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']
    });
    // Haptics
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
  }

  return unlocked; // Return newly unlocked achievements for notification
};
