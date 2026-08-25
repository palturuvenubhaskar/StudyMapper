import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { db } from '../../data/db';
import { analyzeWeaknesses } from './weaknessDetector';

describe('Weakness Detector Tests', () => {
  beforeEach(async () => {
    await db.user_analytics.clear();
    await db.study_weaknesses.clear();
  });

  afterEach(async () => {
    await db.user_analytics.clear();
    await db.study_weaknesses.clear();
  });

  it('detects a weakness after multiple failed coding attempts', async () => {
    const topicId = 'coding_123';
    
    // Add 2 failed attempts (30 + 30 = 60 score)
    await db.user_analytics.add({
      id: 'e1', user_id: 'test', topic_id: topicId,
      action_type: 'coding_problem_attempt', accuracy_score: 0,
      created_at: new Date().toISOString()
    });
    await db.user_analytics.add({
      id: 'e2', user_id: 'test', topic_id: topicId,
      action_type: 'coding_problem_attempt', accuracy_score: 0,
      created_at: new Date().toISOString()
    });

    await analyzeWeaknesses('test');

    const weakness = await db.study_weaknesses.where('topic_id').equals(topicId).first();
    expect(weakness).toBeDefined();
    expect(weakness.weakness_score).toBe(60);
  });

  it('removes a weakness if user later succeeds', async () => {
    const topicId = 'coding_123';
    
    // Add 2 failed attempts
    await db.user_analytics.add({
      id: 'e1', user_id: 'test', topic_id: topicId,
      action_type: 'coding_problem_attempt', accuracy_score: 0,
      created_at: new Date().toISOString()
    });
    await db.user_analytics.add({
      id: 'e2', user_id: 'test', topic_id: topicId,
      action_type: 'coding_problem_attempt', accuracy_score: 0,
      created_at: new Date().toISOString()
    });

    await analyzeWeaknesses('test');
    let weakness = await db.study_weaknesses.where('topic_id').equals(topicId).first();
    expect(weakness).toBeDefined();

    // Now they succeed perfectly 2 times ( -20, -20 = -40 )
    // Total score: 60 - 40 = 20 (below threshold of 40)
    await db.user_analytics.add({
      id: 'e3', user_id: 'test', topic_id: topicId,
      action_type: 'coding_problem_attempt', accuracy_score: 100,
      created_at: new Date().toISOString()
    });
    await db.user_analytics.add({
      id: 'e4', user_id: 'test', topic_id: topicId,
      action_type: 'coding_problem_attempt', accuracy_score: 100,
      created_at: new Date().toISOString()
    });

    await analyzeWeaknesses('test');
    weakness = await db.study_weaknesses.where('topic_id').equals(topicId).first();
    expect(weakness).toBeUndefined(); // Should be deleted
  });
});
