import { db } from '../../data/db';
import { v4 as uuidv4 } from 'uuid';

/**
 * Helper to calculate number of days between two dates
 */
const getDaysBetween = (start, end) => {
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Distributes topics across available days.
 * Difficulty rating: 
 * 1-2 stars = 1 block
 * 3-4 stars = 2 blocks
 * 5 stars = 3 blocks (spaced out)
 * If no difficulty rating, default to 1 block.
 */
export const generateAdaptivePlan = async (userId, examDateString, subjectIds) => {
  const today = new Date();
  const examDate = new Date(examDateString);
  const daysAvailable = getDaysBetween(today, examDate);
  
  if (daysAvailable <= 0) throw new Error("Exam date must be in the future");

  const planId = uuidv4();
  const schedule = {}; // { dayIndex: [ { topic, durationMinutes } ] }
  
  for (let i = 0; i <= daysAvailable; i++) {
    schedule[i] = [];
  }

  // Fetch all units and topics for selected subjects
  const allTopics = [];
  for (const subjectId of subjectIds) {
    const units = await db.units.where('subject_id').equals(subjectId).toArray();
    for (const unit of units) {
      const topics = await db.topics.where('unit_id').equals(unit.id).toArray();
      allTopics.push(...topics.map(t => ({ ...t, subjectTitle: 'Subject' }))); // simplified subject linking
    }
  }

  let currentDay = 0;
  
  for (const topic of allTopics) {
    const difficulty = topic.difficulty_rating || 2;
    let blocks = 1;
    if (difficulty >= 3 && difficulty <= 4) blocks = 2;
    if (difficulty === 5) blocks = 3;

    // Determine dynamic study duration based on topic difficulty
    let dynamicDuration = 25;
    switch(difficulty) {
      case 1: dynamicDuration = 15; break; // Quick review
      case 2: dynamicDuration = 25; break; // Standard pomodoro
      case 3: dynamicDuration = 45; break; // Deep work
      case 4: dynamicDuration = 60; break; // Complex topic
      case 5: dynamicDuration = 90; break; // Very hard topic
      default: dynamicDuration = 25;
    }

    for (let b = 0; b < blocks; b++) {
      // Space them out by 2 days if multiple blocks, unless we run out of days
      let targetDay = currentDay + (b * 2); 
      if (targetDay > daysAvailable) targetDay = daysAvailable;
      
      schedule[targetDay].push({
        topic_id: topic.id,
        title: topic.title,
        durationMinutes: dynamicDuration
      });
    }

    currentDay++;
    if (currentDay > daysAvailable - 1) currentDay = 0; // Wrap around to fill gaps
  }

  const plan = {
    id: planId,
    profile_id: userId,
    exam_date: examDateString,
    plan_json: JSON.stringify(schedule),
    updated_at: new Date().toISOString()
  };

  await db.study_plans.add(plan);
  return plan;
};

/**
 * Panic Mode compresses remaining uncompleted tasks into remaining days.
 * Discards 1-2 star difficulty topics if too crammed.
 */
export const triggerPanicMode = async (planId, completedTopicIds = []) => {
  const plan = await db.study_plans.get(planId);
  if (!plan) throw new Error("Plan not found");

  const examDate = new Date(plan.exam_date);
  const today = new Date();
  let daysAvailable = getDaysBetween(today, examDate);
  if (daysAvailable <= 0) daysAvailable = 1; // cram it all today

  const schedule = JSON.parse(plan.plan_json);
  
  // Extract all incomplete tasks
  let pendingTasks = [];
  for (const day of Object.values(schedule)) {
    for (const task of day) {
      if (!completedTopicIds.includes(task.topic_id)) {
        pendingTasks.push(task);
      }
    }
  }

  // Deduplicate pending tasks
  pendingTasks = pendingTasks.filter((v, i, a) => a.findIndex(t => t.topic_id === v.topic_id) === i);

  // Filter out low priority if ratio of tasks/days is too high (>4 tasks per day)
  if (pendingTasks.length / daysAvailable > 4) {
    const topics = await db.topics.where('id').anyOf(pendingTasks.map(t => t.topic_id)).toArray();
    pendingTasks = pendingTasks.filter(task => {
      const dbTopic = topics.find(t => t.id === task.topic_id);
      return dbTopic && (dbTopic.difficulty_rating || 0) >= 3;
    });
  }

  const newSchedule = {};
  for (let i = 0; i <= daysAvailable; i++) {
    newSchedule[i] = [];
  }

  // Distribute
  pendingTasks.forEach((task, index) => {
    const day = index % daysAvailable;
    newSchedule[day].push(task);
  });

  plan.plan_json = JSON.stringify(newSchedule);
  plan.updated_at = new Date().toISOString();
  await db.study_plans.put(plan);
  
  return plan;
};
