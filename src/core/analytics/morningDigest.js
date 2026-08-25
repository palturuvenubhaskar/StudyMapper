import { db } from '../../data/db';
import { analyzeWeaknesses } from './weaknessDetector';
import { getOrCreateDailyQuests } from '../gamification/dailyQuests';
import { getGamificationProfile } from '../gamification/xpEngine';

/**
 * Generates the Morning Digest.
 * Returns null if it has already been generated today, unless force=true.
 */
export const generateMorningDigest = async (userId = 'guest', force = false) => {
  const today = new Date().toISOString().split('T')[0];
  
  // Check if we already showed it today using a simple local storage flag (or we could use IndexedDB)
  const lastDigestDate = localStorage.getItem(`lastDigest_${userId}`);
  if (lastDigestDate === today && !force) {
    return null;
  }

  // Ensure weaknesses are up to date
  await analyzeWeaknesses(userId);

  // Get top 2 weaknesses
  const weaknesses = await db.study_weaknesses
    .where('user_id').equals(userId)
    .reverse()
    .sortBy('weakness_score');
    
  const topWeaknesses = weaknesses.slice(0, 2);
  
  // Try to resolve titles
  const weakTopics = [];
  for (const w of topWeaknesses) {
    const topic = await db.topics.get(w.topic_id);
    if (topic) {
      weakTopics.push({ ...w, title: topic.title });
    } else {
      // Might be a coding problem id
      const prob = await db.coding_problems.get(w.topic_id);
      if (prob) {
        weakTopics.push({ ...w, title: `Coding: ${prob.title}` });
      } else {
         weakTopics.push({ ...w, title: 'Unknown Topic' });
      }
    }
  }

  // Get quests
  const dailyRecord = await getOrCreateDailyQuests(userId);
  const incompleteQuests = dailyRecord.quests.filter(q => !q.completed);

  // Get streak
  const profile = await getGamificationProfile(userId);

  localStorage.setItem(`lastDigest_${userId}`, today);

  return {
    weakTopics,
    incompleteQuests,
    streakDays: profile.streak_days
  };
};
