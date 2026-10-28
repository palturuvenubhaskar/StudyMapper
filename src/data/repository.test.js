import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { db } from './db';
import { 
  addSubject, 
  addUnit, 
  addTopic, 
  deleteSubject, 
  getSubjectById,
  saveTopicContent,
  addBookmark,
  getAllBookmarks,
  getSubjectsProgress,
  searchAll,
  saveCodingProblem,
  getCodingProblems,
  getCodingStats
} from './repository';

describe('Database Repository Tests', () => {
  beforeEach(async () => {
    // Clear the database before each test
    await db.transaction('rw', db.tables, async () => {
      for (const table of db.tables) {
        await table.clear();
      }
    });
  });

  afterEach(async () => {
    await db.transaction('rw', db.tables, async () => {
      for (const table of db.tables) {
        await table.clear();
      }
    });
  });

  it('cascading deleteSubject deletes related units, topics, and contents', async () => {
    // 1. Create a subject
    const subject = await addSubject('Test Subject');
    expect(subject.id).toBeDefined();

    // 2. Add a unit
    const unit = await addUnit(subject.id, 'Test Unit', 1);
    expect(unit.id).toBeDefined();

    // 3. Add a topic
    const topic = await addTopic(unit.id, 'Test Topic', 1);
    expect(topic.id).toBeDefined();

    // 4. Add topic content and a bookmark
    const content = await saveTopicContent(topic.id, '{"some":"json"}');
    const bookmark = await addBookmark(topic.id, null);

    // Verify they exist
    expect(await db.subjects.count()).toBe(1);
    expect(await db.units.count()).toBe(1);
    expect(await db.topics.count()).toBe(1);
    expect(await db.topic_contents.count()).toBe(1);
    expect(await db.bookmarks.count()).toBe(1);

    // 5. Delete the subject
    await deleteSubject(subject.id);

    // 6. Verify everything is deleted
    expect(await db.subjects.count()).toBe(0);
    expect(await db.units.count()).toBe(0);
    expect(await db.topics.count()).toBe(0);
    expect(await db.topic_contents.count()).toBe(0);
    expect(await db.bookmarks.count()).toBe(0);
  });

  it('computes progress for several subjects in one pass', async () => {
    const subjectA = await addSubject('Subject A');
    const subjectB = await addSubject('Subject B');
    const subjectC = await addSubject('Subject C');
    const unitA = await addUnit(subjectA.id, 'Unit A', 1);
    const topicA1 = await addTopic(unitA.id, 'Topic A1', 1);
    await addTopic(unitA.id, 'Topic A2', 2);
    const unitB = await addUnit(subjectB.id, 'Unit B', 1);
    await addTopic(unitB.id, 'Topic B1', 1);

    await saveTopicContent(topicA1.id, '{"intro":"hello"}');

    expect(await getSubjectsProgress([subjectA.id, subjectB.id, subjectC.id])).toEqual({
      [subjectA.id]: 50,
      [subjectB.id]: 0,
      [subjectC.id]: 0,
    });
    expect(await getSubjectsProgress([subjectC.id])).toEqual({ [subjectC.id]: 0 });
  });

  it('enriches bookmarks with topic titles', async () => {
    const subject = await addSubject('Subject');
    const unit = await addUnit(subject.id, 'Unit', 1);
    const topic = await addTopic(unit.id, 'Topic title', 1);
    await addBookmark(topic.id);

    const bookmarks = await getAllBookmarks();
    expect(bookmarks).toHaveLength(1);
    expect(bookmarks[0].topic_title).toBe('Topic title');
  });

  it('searches only the latest content version', async () => {
    const subject = await addSubject('Operating Systems');
    const unit = await addUnit(subject.id, 'Scheduling', 1);
    const topic = await addTopic(unit.id, 'Round Robin', 1);

    await saveTopicContent(topic.id, '{"body":"old needle"}');
    await saveTopicContent(topic.id, '{"body":"fresh haystack"}');

    const fresh = await searchAll('haystack');
    expect(fresh.filter(r => r.type === 'topic-content')).toHaveLength(1);

    const old = await searchAll('needle');
    expect(old.filter(r => r.type === 'topic-content')).toHaveLength(0);
  });

  it('keeps guest coding problems visible after a profile is created', async () => {
    const guestProblem = await saveCodingProblem('guest', {
      title: 'Guest problem',
      language: 'Python',
      topic: 'Arrays',
      difficulty: 'Easy',
      statement: 'Solve it',
    });
    const profileProblem = await saveCodingProblem('student-1', {
      title: 'Profile problem',
      language: 'Python',
      topic: 'Arrays',
      difficulty: 'Easy',
      statement: 'Solve it',
    });

    const problems = await getCodingProblems('student-1');
    expect(problems.map(p => p.id).sort()).toEqual([guestProblem.id, profileProblem.id].sort());

    const stats = await getCodingStats('student-1');
    expect(stats.total).toBe(2);
  });
});
