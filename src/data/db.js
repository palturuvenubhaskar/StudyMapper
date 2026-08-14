import Dexie from 'dexie';

export const db = new Dexie('StudyMapperDB');

db.version(2).stores({
  subjects: 'id, title, created_at',
  units: 'id, subject_id, title, order_index',
  topics: 'id, unit_id, title, order_index, has_content',
  topic_contents: 'id, topic_id, is_latest',
  bookmarks: 'id, topic_id, section_id, created_at',
  notes: 'id, topic_id, updated_at',
  study_stats: 'id, topic_id, last_opened_at',
  question_banks: 'id, subject_id, title, created_at',
  questions: 'id, bank_id, text, marks, answer, order_index'
});

db.version(3).stores({
  subjects: 'id, title, created_at',
  units: 'id, subject_id, title, order_index',
  topics: 'id, unit_id, title, order_index, has_content',
  topic_contents: 'id, topic_id, is_latest',
  bookmarks: 'id, topic_id, section_id, created_at',
  notes: 'id, topic_id, updated_at',
  study_stats: 'id, topic_id, last_opened_at',
  question_banks: 'id, subject_id, title, created_at',
  questions: 'id, bank_id, text, marks, answer, order_index',
  // Skill Roadmap
  student_profiles: 'id, branch, career_goal, created_at',
  roadmaps: 'id, profile_id, title, career_goal, created_at',
  roadmap_skills: 'id, roadmap_id, name, order_index, status',
  // Placement Preparation
  placement_sessions: 'id, profile_id, category, created_at',
  placement_questions: 'id, session_id, category, subcategory, difficulty, is_correct, created_at',
  placement_stats: 'id, profile_id, category, subcategory, updated_at',
  // Coding Practice
  coding_problems: 'id, profile_id, language, topic, difficulty, status, created_at',
  coding_stats: 'id, profile_id, topic, difficulty, updated_at'
});

db.version(4).stores({
  subjects: 'id, title, created_at',
  units: 'id, subject_id, title, order_index',
  topics: 'id, unit_id, title, order_index, has_content',
  topic_contents: 'id, topic_id, is_latest',
  bookmarks: 'id, topic_id, section_id, created_at',
  notes: 'id, topic_id, updated_at',
  study_stats: 'id, topic_id, last_opened_at',
  question_banks: 'id, subject_id, title, created_at',
  questions: 'id, bank_id, text, marks, answer, order_index',
  // Skill Roadmap
  student_profiles: 'id, branch, career_goal, created_at',
  roadmaps: 'id, profile_id, title, career_goal, created_at',
  roadmap_skills: 'id, roadmap_id, name, order_index, status',
  // Placement Preparation
  placement_sessions: 'id, profile_id, category, created_at',
  placement_questions: 'id, session_id, category, subcategory, difficulty, is_correct, created_at',
  placement_stats: 'id, profile_id, category, subcategory, updated_at',
  // Coding Practice
  coding_problems: 'id, profile_id, language, topic, difficulty, status, created_at',
  coding_stats: 'id, profile_id, topic, difficulty, updated_at',
  // AI Assistant
  ai_sessions: 'id, title, created_at, updated_at',
  ai_messages: 'id, session_id, role, created_at'
});

db.version(5).stores({
  subjects: 'id, title, created_at',
  units: 'id, subject_id, title, order_index',
  topics: 'id, unit_id, title, order_index, has_content',
  topic_contents: 'id, topic_id, is_latest',
  bookmarks: 'id, topic_id, section_id, created_at',
  notes: 'id, topic_id, updated_at',
  study_stats: 'id, topic_id, last_opened_at',
  question_banks: 'id, subject_id, title, created_at',
  questions: 'id, bank_id, text, marks, answer, order_index',
  // Skill Roadmap
  student_profiles: 'id, branch, career_goal, created_at',
  roadmaps: 'id, profile_id, title, career_goal, created_at',
  roadmap_skills: 'id, roadmap_id, name, order_index, status',
  // Placement Preparation
  placement_sessions: 'id, profile_id, category, created_at',
  placement_questions: 'id, session_id, category, subcategory, difficulty, is_correct, created_at',
  placement_stats: 'id, profile_id, category, subcategory, updated_at',
  // Coding Practice
  coding_problems: 'id, profile_id, language, topic, difficulty, status, created_at',
  coding_stats: 'id, profile_id, topic, difficulty, updated_at',
  ai_sessions: 'id, title, created_at, updated_at',
  ai_messages: 'id, session_id, role, created_at',
  // Learning Track
  learning_tracks: 'id, [profile_id+language], profile_id, language, current_step, updated_at',
  learning_lessons: 'id, [track_id+topic], track_id, language, topic, status, created_at'
});

db.version(6).stores({
  subjects: 'id, title, created_at',
  units: 'id, subject_id, title, order_index',
  topics: 'id, unit_id, title, order_index, has_content',
  topic_contents: 'id, topic_id, is_latest',
  bookmarks: 'id, topic_id, section_id, created_at',
  notes: 'id, topic_id, updated_at',
  study_stats: 'id, topic_id, last_opened_at',
  question_banks: 'id, subject_id, title, created_at',
  questions: 'id, bank_id, text, marks, answer, order_index',
  // Skill Roadmap
  student_profiles: 'id, branch, career_goal, created_at',
  roadmaps: 'id, profile_id, title, career_goal, created_at',
  roadmap_skills: 'id, roadmap_id, name, order_index, status',
  // Placement Preparation
  placement_sessions: 'id, profile_id, category, created_at',
  placement_questions: 'id, session_id, category, subcategory, difficulty, is_correct, created_at',
  placement_stats: 'id, profile_id, category, subcategory, updated_at',
  // Coding Practice
  coding_problems: 'id, profile_id, language, topic, difficulty, status, created_at',
  coding_stats: 'id, profile_id, topic, difficulty, updated_at',
  ai_sessions: 'id, title, created_at, updated_at',
  ai_messages: 'id, session_id, role, created_at',
  // Learning Track
  learning_tracks: 'id, [profile_id+language], profile_id, language, current_step, updated_at',
  learning_lessons: 'id, [track_id+topic], track_id, language, topic, status, created_at',
  // Study Planner
  study_plans: 'id, profile_id, updated_at'
});

db.version(7).stores({
  subjects: 'id, title, created_at',
  units: 'id, subject_id, title, order_index',
  topics: 'id, unit_id, title, order_index, has_content',
  topic_contents: 'id, topic_id, is_latest',
  bookmarks: 'id, topic_id, section_id, created_at',
  notes: 'id, topic_id, updated_at',
  study_stats: 'id, topic_id, last_opened_at',
  question_banks: 'id, subject_id, title, created_at',
  questions: 'id, bank_id, text, marks, answer, order_index',
  // Skill Roadmap
  student_profiles: 'id, branch, career_goal, created_at',
  roadmaps: 'id, profile_id, title, career_goal, created_at',
  roadmap_skills: 'id, roadmap_id, name, order_index, status',
  // Placement Preparation
  placement_sessions: 'id, profile_id, category, created_at',
  placement_questions: 'id, session_id, category, subcategory, difficulty, is_correct, created_at',
  placement_stats: 'id, profile_id, category, subcategory, updated_at',
  // Coding Practice
  coding_problems: 'id, profile_id, language, topic, difficulty, status, created_at',
  coding_stats: 'id, profile_id, topic, difficulty, updated_at',
  ai_sessions: 'id, title, created_at, updated_at',
  ai_messages: 'id, session_id, role, created_at',
  // Learning Track
  learning_tracks: 'id, [profile_id+language], profile_id, language, current_step, updated_at',
  learning_lessons: 'id, [track_id+topic], track_id, language, topic, status, created_at',
  // Study Planner
  study_plans: 'id, profile_id, updated_at',
  // Flashcards
  flashcard_decks: 'id, topic_id, title, created_at',
  flashcards: 'id, deck_id, front, back, tag, created_at'
});
