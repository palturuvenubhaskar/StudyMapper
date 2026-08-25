import { db } from '../../data/db';
import { v4 as uuidv4 } from 'uuid';

/**
 * Log an analytics event to the local database.
 * 
 * @param {string} userId - ID of the user (e.g. 'guest')
 * @param {string} topicId - ID of the related topic, problem, or subject
 * @param {string} actionType - 'topic_study', 'notes_generation', 'coding_problem_attempt', 'pomodoro_complete'
 * @param {number} durationSeconds - Optional duration in seconds
 * @param {number} accuracyScore - Optional score (0-100) for correctness (e.g. flashcards, coding)
 */
export const logEvent = async (userId = 'guest', topicId, actionType, durationSeconds = 0, accuracyScore = null) => {
  if (!topicId) return null;

  const event = {
    id: uuidv4(),
    user_id: userId,
    topic_id: topicId,
    action_type: actionType,
    duration_seconds: durationSeconds,
    accuracy_score: accuracyScore,
    created_at: new Date().toISOString()
  };

  try {
    await db.user_analytics.add(event);
    return event;
  } catch (err) {
    console.error('Failed to log event:', err);
    return null;
  }
};
