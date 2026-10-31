import { db } from '../../data/db';
import { v4 as uuidv4 } from 'uuid';
import { ACHIEVEMENTS } from './achievements';
import { awardXP } from './xpEngine';
import confetti from 'canvas-confetti';

export const checkAchievements = async (userId = 'guest') => {
  const existing = await db.achievements.where('user_id').equals(userId).toArray();
  const unlockedIds = new Set(existing.map(a => a.achievement_id));

  const unlocked = [];

  for (const achievement of ACHIEVEMENTS) {
    // Find the tiers that haven't been awarded yet.
    const pendingTiers = achievement.tiers.filter(t => !unlockedIds.has(`${achievement.id}_${t.tier}`));
    if (pendingTiers.length === 0) continue;

    const progress = await achievement.getProgress(userId);

    for (const tier of pendingTiers) {
      if (progress >= tier.threshold) {
        const tierId = `${achievement.id}_${tier.tier}`;

        await db.achievements.add({
          id: uuidv4(),
          user_id: userId,
          achievement_id: tierId,
          unlocked_at: new Date().toISOString(),
          viewed: 0,
        });

        await awardXP(userId, tier.xp_reward, 'achievement', tierId);

        unlocked.push({
          id: tierId,
          title: tier.suffix ? `${achievement.title}: ${tier.suffix}` : achievement.title,
          description: tier.description,
          icon_name: achievement.icon_name,
          tier: tier.tier,
          xp_reward: tier.xp_reward,
        });
      }
    }
  }

  if (unlocked.length > 0) {
    // Fire confetti for achievement
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
    });
    // Haptics
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
  }

  return unlocked; // Return newly unlocked achievements for notification
};
