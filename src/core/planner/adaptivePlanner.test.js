import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { db } from '../../data/db';
import { generateAdaptivePlan, triggerPanicMode } from './adaptivePlanner';

describe('Adaptive Planner Tests', () => {
  beforeEach(async () => {
    await db.study_plans.clear();
    await db.subjects.clear();
    await db.units.clear();
    await db.topics.clear();
  });

  afterEach(async () => {
    await db.study_plans.clear();
    await db.subjects.clear();
    await db.units.clear();
    await db.topics.clear();
  });

  it('allocates topics based on difficulty', async () => {
    await db.subjects.add({ id: 's1', title: 'Math' });
    await db.units.add({ id: 'u1', subject_id: 's1', title: 'Unit 1' });
    
    await db.topics.add({ id: 't1', unit_id: 'u1', title: 'Easy', difficulty_rating: 1 });
    await db.topics.add({ id: 't2', unit_id: 'u1', title: 'Medium', difficulty_rating: 3 });
    await db.topics.add({ id: 't3', unit_id: 'u1', title: 'Hard', difficulty_rating: 5 });

    // Exam date 5 days from now
    const examDate = new Date();
    examDate.setDate(examDate.getDate() + 5);

    const plan = await generateAdaptivePlan('guest', examDate.toISOString(), ['s1']);
    const schedule = JSON.parse(plan.plan_json);

    // Count occurrences
    let t1Count = 0;
    let t2Count = 0;
    let t3Count = 0;

    for (const day of Object.values(schedule)) {
      t1Count += day.filter(t => t.topic_id === 't1').length;
      t2Count += day.filter(t => t.topic_id === 't2').length;
      t3Count += day.filter(t => t.topic_id === 't3').length;
    }

    expect(t1Count).toBe(1);
    expect(t2Count).toBe(2);
    expect(t3Count).toBe(3);
  });
});
