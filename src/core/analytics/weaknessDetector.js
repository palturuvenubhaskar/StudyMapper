import { db } from '../../data/db';
import { v4 as uuidv4 } from 'uuid';

/**
 * Analyzes recent user analytics to detect weak topics.
 * Weakness Score (0-100) logic:
 * - Coding failure: +30 points
 * - High Pomodoro count without notes generated: +20 points
 * - Low accuracy score: + (100 - accuracy) * 0.5 points
 * Caps at 100.
 */
export const analyzeWeaknesses = async (userId = 'guest') => {
  // Get analytics from the last 7 days
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const cutoff = sevenDaysAgo.toISOString();

  const recentEvents = await db.user_analytics
    .where('user_id').equals(userId)
    .filter(e => e.created_at >= cutoff)
    .toArray();

  const topicScores = {};

  for (const e of recentEvents) {
    if (!topicScores[e.topic_id]) {
      topicScores[e.topic_id] = { score: 0, title: '' };
    }
    
    // Penalize failed coding attempts
    if (e.action_type === 'coding_problem_attempt' && e.accuracy_score === 0) {
      topicScores[e.topic_id].score += 30;
    }
    
    // Penalize low accuracy generally (ignore coding attempts since they are binary 0/100 and handled above/below)
    if (e.action_type !== 'coding_problem_attempt' && e.accuracy_score !== null && e.accuracy_score < 60) {
      topicScores[e.topic_id].score += (100 - e.accuracy_score) * 0.5;
    }
    
    // Penalize pomodoros if they keep stacking up
    if (e.action_type === 'pomodoro_complete') {
      topicScores[e.topic_id].score += 10;
    }
    
    // Reward success (lower weakness score)
    if (e.action_type === 'coding_problem_attempt' && e.accuracy_score === 100) {
      topicScores[e.topic_id].score -= 20;
    }
    
    // If they generated notes, it might mean they are finally understanding it
    if (e.action_type === 'generate_notes') {
      topicScores[e.topic_id].score -= 10;
    }
  }

  // Update study_weaknesses table
  for (const [topicId, data] of Object.entries(topicScores)) {
    const finalScore = Math.max(0, Math.min(100, data.score)); // Clamp between 0 and 100
    
    if (finalScore >= 40) {
      // It's a weakness
      const existing = await db.study_weaknesses
        .where('topic_id').equals(topicId)
        .first();
        
      if (existing) {
        await db.study_weaknesses.update(existing.id, {
          weakness_score: finalScore,
          last_detected_at: new Date().toISOString()
        });
      } else {
        await db.study_weaknesses.add({
          id: uuidv4(),
          user_id: userId,
          topic_id: topicId,
          weakness_score: finalScore,
          last_detected_at: new Date().toISOString(),
          revision_count: 0
        });
      }
    } else {
      // If it dropped below 40, they might have mastered it, so we can optionally delete it
      const existing = await db.study_weaknesses
        .where('topic_id').equals(topicId)
        .first();
      if (existing) {
        await db.study_weaknesses.delete(existing.id);
      }
    }
  }
};
