import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { db } from './db';
import { 
  addSubject, 
  addUnit, 
  addTopic, 
  deleteSubject, 
  getSubjectById,
  saveTopicContent,
  addBookmark
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
});
