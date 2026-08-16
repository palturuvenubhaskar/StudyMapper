import { db } from './db';
import { v4 as uuidv4 } from 'uuid';

// ========== SUBJECTS ==========
export const getAllSubjects = () => db.subjects.orderBy('created_at').reverse().toArray();

export const getSubjectById = (id) => db.subjects.get(id);

export const addSubject = (title) => {
  const subject = {
    id: uuidv4(),
    title,
    created_at: new Date().toISOString(),
    progress_percentage: 0,
  };
  return db.subjects.add(subject).then(() => subject);
};

export const updateSubject = (id, changes) => db.subjects.update(id, changes);

export const deleteSubject = async (id) => {
  const units = await db.units.where('subject_id').equals(id).toArray();
  const unitIds = units.map(u => u.id);
  const topics = await db.topics.where('unit_id').anyOf(unitIds).toArray();
  const topicIds = topics.map(t => t.id);

  await db.transaction('rw', [db.subjects, db.units, db.topics, db.topic_contents, db.bookmarks, db.notes, db.study_stats], async () => {
    await db.study_stats.where('topic_id').anyOf(topicIds).delete();
    await db.notes.where('topic_id').anyOf(topicIds).delete();
    await db.bookmarks.where('topic_id').anyOf(topicIds).delete();
    await db.topic_contents.where('topic_id').anyOf(topicIds).delete();
    await db.topics.where('unit_id').anyOf(unitIds).delete();
    await db.units.where('subject_id').equals(id).delete();
    await db.subjects.delete(id);
  });
};

// ========== UNITS ==========
export const getUnitsForSubject = (subjectId) =>
  db.units.where('subject_id').equals(subjectId).sortBy('order_index');

export const addUnit = (subjectId, title, orderIndex) => {
  const unit = {
    id: uuidv4(),
    subject_id: subjectId,
    title,
    order_index: orderIndex,
  };
  return db.units.add(unit).then(() => unit);
};

export const updateUnit = (id, changes) => db.units.update(id, changes);

export const deleteUnit = async (id) => {
  const topics = await db.topics.where('unit_id').equals(id).toArray();
  const topicIds = topics.map(t => t.id);

  await db.transaction('rw', [db.units, db.topics, db.topic_contents, db.bookmarks, db.notes, db.study_stats], async () => {
    await db.study_stats.where('topic_id').anyOf(topicIds).delete();
    await db.notes.where('topic_id').anyOf(topicIds).delete();
    await db.bookmarks.where('topic_id').anyOf(topicIds).delete();
    await db.topic_contents.where('topic_id').anyOf(topicIds).delete();
    await db.topics.where('unit_id').equals(id).delete();
    await db.units.delete(id);
  });
};

// ========== TOPICS ==========
export const getTopicsForUnit = (unitId) =>
  db.topics.where('unit_id').equals(unitId).sortBy('order_index');

export const getTopicById = (id) => db.topics.get(id);

export const addTopic = (unitId, title, orderIndex) => {
  const topic = {
    id: uuidv4(),
    unit_id: unitId,
    title,
    order_index: orderIndex,
    has_content: 0,
  };
  return db.topics.add(topic).then(() => topic);
};

export const updateTopic = (id, changes) => db.topics.update(id, changes);

export const deleteTopic = async (id) => {
  await db.transaction('rw', [db.topics, db.topic_contents, db.bookmarks, db.notes, db.study_stats], async () => {
    await db.study_stats.where('topic_id').equals(id).delete();
    await db.notes.where('topic_id').equals(id).delete();
    await db.bookmarks.where('topic_id').equals(id).delete();
    await db.topic_contents.where('topic_id').equals(id).delete();
    await db.topics.delete(id);
  });
};

// ========== TOPIC CONTENT ==========
export const getLatestTopicContent = (topicId) =>
  db.topic_contents
    .where('topic_id').equals(topicId)
    .filter(c => c.is_latest === 1)
    .first();

export const saveTopicContent = async (topicId, generatedJson) => {
  const content = {
    id: uuidv4(),
    topic_id: topicId,
    generated_json: generatedJson,
    created_at: new Date().toISOString(),
    is_latest: 1,
  };
  await db.transaction('rw', [db.topic_contents, db.topics], async () => {
    await db.topic_contents.where('topic_id').equals(topicId).modify({ is_latest: 0 });
    await db.topic_contents.add(content);
    await db.topics.update(topicId, { has_content: 1 });
  });
  return content;
};

// ========== BOOKMARKS ==========
export const getBookmarksForTopic = (topicId) =>
  db.bookmarks.where('topic_id').equals(topicId).toArray();

export const getAllBookmarks = async () => {
  const bookmarks = await db.bookmarks.orderBy('created_at').reverse().toArray();
  const enriched = [];
  for (const bm of bookmarks) {
    const topic = await db.topics.get(bm.topic_id);
    enriched.push({ ...bm, topic_title: topic?.title || 'Unknown' });
  }
  return enriched;
};

export const addBookmark = (topicId, sectionId = null) => {
  const bookmark = {
    id: uuidv4(),
    topic_id: topicId,
    section_id: sectionId,
    created_at: new Date().toISOString(),
  };
  return db.bookmarks.add(bookmark).then(() => bookmark);
};

export const deleteBookmark = (id) => db.bookmarks.delete(id);

export const isTopicBookmarked = async (topicId) => {
  const count = await db.bookmarks.where('topic_id').equals(topicId).count();
  return count > 0;
};

// ========== NOTES ==========
export const getNotesForTopic = (topicId) =>
  db.notes.where('topic_id').equals(topicId).reverse().sortBy('updated_at');

export const addNote = (topicId, content) => {
  const note = {
    id: uuidv4(),
    topic_id: topicId,
    content,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  return db.notes.add(note).then(() => note);
};

export const updateNote = (id, content) =>
  db.notes.update(id, { content, updated_at: new Date().toISOString() });

export const deleteNote = (id) => db.notes.delete(id);

// ========== STUDY STATS ==========
export const recordTopicOpened = async (topicId) => {
  const existing = await db.study_stats.where('topic_id').equals(topicId).first();
  if (existing) {
    await db.study_stats.update(existing.id, {
      last_opened_at: new Date().toISOString(),
      open_count: (existing.open_count || 0) + 1,
    });
  } else {
    await db.study_stats.add({
      id: uuidv4(),
      topic_id: topicId,
      last_opened_at: new Date().toISOString(),
      open_count: 1,
    });
  }
};

export const getStudyStats = () => db.study_stats.toArray();

// ========== SEARCH ==========
export const searchAll = async (query) => {
  const q = query.toLowerCase();
  const results = [];

  const subjects = await db.subjects.toArray();
  subjects.filter(s => s.title.toLowerCase().includes(q)).forEach(s => {
    results.push({ id: s.id, type: 'subject', title: s.title, snippet: `Subject: ${s.title}` });
  });

  const units = await db.units.toArray();
  units.filter(u => u.title.toLowerCase().includes(q)).forEach(u => {
    results.push({ id: u.id, type: 'unit', title: u.title, snippet: `Unit: ${u.title}`, parentId: u.subject_id });
  });

  const topics = await db.topics.toArray();
  topics.filter(t => t.title.toLowerCase().includes(q)).forEach(t => {
    results.push({ id: t.id, type: 'topic', title: t.title, snippet: `Topic: ${t.title}`, parentId: t.unit_id });
  });

  const notes = await db.notes.toArray();
  notes.filter(n => n.content.toLowerCase().includes(q)).forEach(n => {
    results.push({ id: n.id, type: 'note', title: 'Personal Note', snippet: n.content.substring(0, 80), parentId: n.topic_id });
  });

  return results;
};

// ========== BULK IMPORT (for syllabus save) ==========
export const saveSyllabus = async (subject, units, topics) => {
  await db.transaction('rw', [db.subjects, db.units, db.topics], async () => {
    await db.subjects.add(subject);
    await db.units.bulkAdd(units);
    await db.topics.bulkAdd(topics);
  });
};

// ========== PROGRESS ==========
export const getSubjectProgress = async (subjectId) => {
  const units = await getUnitsForSubject(subjectId);
  const unitIds = units.map(u => u.id);
  const topics = await db.topics.where('unit_id').anyOf(unitIds).toArray();
  const total = topics.length;
  const studied = topics.filter(t => t.has_content === 1).length;
  return total === 0 ? 0 : Math.round((studied / total) * 100);
};

// ========== QUESTION BANKS ==========
export const createQuestionBank = async (subjectId, title, questions) => {
  const bankId = uuidv4();
  await db.transaction('rw', [db.question_banks, db.questions], async () => {
    await db.question_banks.add({
      id: bankId,
      subject_id: subjectId || null,
      title,
      created_at: new Date().toISOString()
    });
    
    if (questions && questions.length > 0) {
      const qs = questions.map((q, idx) => ({
        id: uuidv4(),
        bank_id: bankId,
        text: q.text,
        marks: q.marks,
        answer: null, // to be generated later
        order_index: idx
      }));
      await db.questions.bulkAdd(qs);
    }
  });
  return bankId;
};

export const getQuestionBanksForSubject = (subjectId) => 
  db.question_banks.where('subject_id').equals(subjectId).reverse().sortBy('created_at');

export const getAllQuestionBanks = () => 
  db.question_banks.orderBy('created_at').reverse().toArray();

export const getQuestionBankById = (id) => db.question_banks.get(id);

export const getQuestionsForBank = (bankId) => 
  db.questions.where('bank_id').equals(bankId).sortBy('order_index');

export const updateQuestionBank = (id, changes) => 
  db.question_banks.update(id, changes);

export const deleteQuestionBank = async (bankId) => {
  await db.transaction('rw', [db.question_banks, db.questions], async () => {
    await db.questions.where('bank_id').equals(bankId).delete();
    await db.question_banks.delete(bankId);
  });
};

export const updateQuestionAnswer = (id, answerStr) => 
  db.questions.update(id, { answer: answerStr });

// ========== STUDENT PROFILES ==========
export const getStudentProfile = () => db.student_profiles.toCollection().first();

export const saveStudentProfile = async (profileData) => {
  const existing = await getStudentProfile();
  if (existing) {
    await db.student_profiles.update(existing.id, { ...profileData, updated_at: new Date().toISOString() });
    return existing.id;
  }
  const id = uuidv4();
  await db.student_profiles.add({ id, ...profileData, created_at: new Date().toISOString() });
  return id;
};

// ========== ROADMAPS ==========
export const getRoadmapForProfile = (profileId) =>
  db.roadmaps.where('profile_id').equals(profileId).first();

export const createRoadmap = async (profileId, title, careerGoal, skills) => {
  const roadmapId = uuidv4();
  await db.transaction('rw', [db.roadmaps, db.roadmap_skills], async () => {
    await db.roadmaps.add({ id: roadmapId, profile_id: profileId, title, career_goal: careerGoal, created_at: new Date().toISOString() });
    if (skills && skills.length > 0) {
      const items = skills.map((s, idx) => ({
        id: uuidv4(), roadmap_id: roadmapId, target_roadmap_id: s.roadmap_id || null, name: s.name, why_important: s.why_important || '',
        estimated_time: s.estimated_time || '', order_index: idx, status: 'pending', content: null
      }));
      await db.roadmap_skills.bulkAdd(items);
    }
  });
  return roadmapId;
};

export const getSkillsForRoadmap = (roadmapId) =>
  db.roadmap_skills.where('roadmap_id').equals(roadmapId).sortBy('order_index');

export const updateRoadmapSkill = (id, changes) => db.roadmap_skills.update(id, changes);

export const deleteRoadmapSkill = (id) => db.roadmap_skills.delete(id);

export const addRoadmapSkill = (roadmapId, name, orderIndex) => {
  const skill = { id: uuidv4(), roadmap_id: roadmapId, name, why_important: '', estimated_time: '', order_index: orderIndex, status: 'pending', content: null };
  return db.roadmap_skills.add(skill).then(() => skill);
};

export const deleteRoadmap = async (roadmapId) => {
  await db.transaction('rw', [db.roadmaps, db.roadmap_skills], async () => {
    await db.roadmap_skills.where('roadmap_id').equals(roadmapId).delete();
    await db.roadmaps.delete(roadmapId);
  });
};

// ========== PLACEMENT ==========
export const createPlacementSession = async (profileId, category) => {
  const id = uuidv4();
  await db.placement_sessions.add({ id, profile_id: profileId, category, created_at: new Date().toISOString() });
  return id;
};

export const savePlacementQuestions = async (sessionId, questions) => {
  const items = questions.map(q => ({
    id: uuidv4(), session_id: sessionId, category: q.category, subcategory: q.subcategory,
    question: q.question, options: q.options || null, correct_answer: q.correct_answer,
    explanation: q.explanation || '', difficulty: q.difficulty || 'Medium',
    user_answer: null, is_correct: null, time_taken: null, created_at: new Date().toISOString()
  }));
  await db.placement_questions.bulkAdd(items);
  return items;
};

export const getPlacementQuestions = (sessionId) =>
  db.placement_questions.where('session_id').equals(sessionId).toArray();

export const updatePlacementQuestion = (id, changes) => db.placement_questions.update(id, changes);

export const getPlacementStats = async (profileId) => {
  const sessions = await db.placement_sessions.where('profile_id').equals(profileId).toArray();
  const sessionIds = sessions.map(s => s.id);
  if (sessionIds.length === 0) return { aptitude: { total: 0, correct: 0 }, technical: { total: 0, practiced: 0 }, hr: { total: 0, answered: 0 } };

  const allQs = await db.placement_questions.where('session_id').anyOf(sessionIds).toArray();
  
  const aptQs = allQs.filter(q => q.category === 'aptitude' && q.user_answer !== null);
  const techQs = allQs.filter(q => q.category === 'technical');
  const hrQs = allQs.filter(q => q.category === 'hr');

  return {
    aptitude: { total: aptQs.length, correct: aptQs.filter(q => q.is_correct).length },
    technical: { total: techQs.length, practiced: techQs.filter(q => q.user_answer !== null).length },
    hr: { total: hrQs.length, answered: hrQs.filter(q => q.user_answer !== null).length }
  };
};

// ========== CODING PRACTICE ==========
export const saveCodingProblem = async (profileId, problemData) => {
  const id = uuidv4();
  const problem = {
    id, profile_id: profileId, language: problemData.language, topic: problemData.topic,
    difficulty: problemData.difficulty, title: problemData.title, statement: problemData.statement,
    constraints: problemData.constraints || '', sample_input: problemData.sample_input || '',
    sample_output: problemData.sample_output || '', explanation: problemData.explanation || '',
    hints: problemData.hints || '', test_cases: problemData.test_cases || '',
    user_code: null, ai_analysis: null, status: 'unsolved',
    created_at: new Date().toISOString()
  };
  await db.coding_problems.add(problem);
  return problem;
};

export const getCodingProblem = (id) => db.coding_problems.get(id);

export const updateCodingProblem = (id, changes) => db.coding_problems.update(id, changes);

export const getCodingProblems = (profileId) =>
  db.coding_problems.where('profile_id').equals(profileId).reverse().sortBy('created_at');

export const getCodingStats = async (profileId) => {
  const problems = await db.coding_problems.where('profile_id').equals(profileId).toArray();
  const solved = problems.filter(p => p.status === 'solved');
  const topics = {};
  for (const p of problems) {
    if (!topics[p.topic]) topics[p.topic] = { total: 0, solved: 0 };
    topics[p.topic].total++;
    if (p.status === 'solved') topics[p.topic].solved++;
  }
  return { total: problems.length, solved: solved.length, topics };
};

// ========== AI ASSISTANT ==========
export const getAISessions = () => 
  db.ai_sessions.orderBy('updated_at').reverse().toArray();

export const createAISession = async (title = 'New Conversation') => {
  const id = uuidv4();
  const now = new Date().toISOString();
  await db.ai_sessions.add({ id, title, created_at: now, updated_at: now });
  return id;
};

export const updateAISession = (id, changes) => 
  db.ai_sessions.update(id, { ...changes, updated_at: new Date().toISOString() });

export const deleteAISession = async (sessionId) => {
  await db.transaction('rw', [db.ai_sessions, db.ai_messages], async () => {
    await db.ai_messages.where('session_id').equals(sessionId).delete();
    await db.ai_sessions.delete(sessionId);
  });
};

export const getAIMessages = (sessionId) => 
  db.ai_messages.where('session_id').equals(sessionId).sortBy('created_at');

export const addAIMessage = async (sessionId, role, content, contextMetadata = null) => {
  const message = {
    id: uuidv4(),
    session_id: sessionId,
    role,
    content,
    context_metadata: contextMetadata,
    created_at: new Date().toISOString()
  };
  
  await db.transaction('rw', [db.ai_sessions, db.ai_messages], async () => {
    await db.ai_messages.add(message);
    await db.ai_sessions.update(sessionId, { updated_at: new Date().toISOString() });
  });
  
  return message;
};

export const searchAIMessages = async (query) => {
  const q = query.toLowerCase();
  const allMessages = await db.ai_messages.toArray();
  const matched = allMessages.filter(m => m.content.toLowerCase().includes(q));
  
  // Get unique sessions for these matches
  const results = [];
  const processedSessions = new Set();
  
  for (const m of matched) {
    if (!processedSessions.has(m.session_id)) {
      processedSessions.add(m.session_id);
      const session = await db.ai_sessions.get(m.session_id);
      if (session) {
        results.push({
          session,
          snippet: m.content.substring(0, 100) + '...',
          match_role: m.role
        });
      }
    }
  }
  return results;
};

// ========== LEARNING TRACKS ==========
export const getLearningTrack = async (profileId, language) => {
  return await db.learning_tracks.where({ profile_id: profileId, language }).first();
};

export const createLearningTrack = async (profileId, language) => {
  const track = {
    id: uuidv4(),
    profile_id: profileId,
    language,
    current_step: 0,
    updated_at: new Date().toISOString()
  };
  await db.learning_tracks.add(track);
  return track;
};

export const updateLearningTrack = async (trackId, changes) => {
  await db.learning_tracks.update(trackId, { ...changes, updated_at: new Date().toISOString() });
};

export const getLearningLesson = async (trackId, topic) => {
  return await db.learning_lessons.where({ track_id: trackId, topic }).first();
};

export const saveLearningLesson = async (trackId, language, topic, lessonData) => {
  const lesson = {
    id: uuidv4(),
    track_id: trackId,
    language,
    topic,
    status: 'attempted',
    created_at: new Date().toISOString(),
    ...lessonData
  };
  await db.learning_lessons.add(lesson);
  return lesson;
};

export const getLearningLessonById = async (lessonId) => {
  return await db.learning_lessons.get(lessonId);
};

export const updateLearningLesson = async (lessonId, changes) => {
  await db.learning_lessons.update(lessonId, changes);
};

// ========== STUDY PLANNER ==========
export const getStudyPlan = async (profileId) => {
  if (!profileId) return null;
  return await db.study_plans.where({ profile_id: profileId }).first();
};

export const saveStudyPlan = async (profileId, planData) => {
  if (!profileId) return null;
  const existing = await getStudyPlan(profileId);
  const updated_at = new Date().toISOString();
  if (existing) {
    await db.study_plans.update(existing.id, { plan_data: planData, updated_at });
    return { ...existing, plan_data: planData, updated_at };
  } else {
    const newPlan = { id: uuidv4(), profile_id: profileId, plan_data: planData, updated_at };
    await db.study_plans.add(newPlan);
    return newPlan;
  }
};

// ========== FLASHCARDS ==========
export const getFlashcardDeckForTopic = async (topicId) => {
  return await db.flashcard_decks.where({ topic_id: topicId }).first();
};

export const createFlashcardDeck = async (topicId, title) => {
  const deck = {
    id: uuidv4(),
    topic_id: topicId,
    title,
    created_at: new Date().toISOString()
  };
  await db.flashcard_decks.add(deck);
  return deck;
};

export const deleteFlashcardDeck = async (deckId) => {
  await db.transaction('rw', [db.flashcard_decks, db.flashcards], async () => {
    await db.flashcards.where({ deck_id: deckId }).delete();
    await db.flashcard_decks.delete(deckId);
  });
};

export const saveFlashcards = async (deckId, flashcards) => {
  const cardsToInsert = flashcards.map(card => ({
    id: uuidv4(),
    deck_id: deckId,
    front: card.front,
    back: card.back,
    tag: card.tag || '',
    created_at: new Date().toISOString()
  }));
  await db.flashcards.bulkAdd(cardsToInsert);
  return cardsToInsert;
};

export const getFlashcardsForDeck = async (deckId) => {
  return await db.flashcards.where({ deck_id: deckId }).toArray();
};

// ========== AI ROADMAPS ==========
export const saveAIRoadmap = async (roadmapData) => {
  await db.ai_roadmaps.put(roadmapData);
  return roadmapData;
};

export const getAIRoadmap = async (id) => {
  return await db.ai_roadmaps.get(id);
};

