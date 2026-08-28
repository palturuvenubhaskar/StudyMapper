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

db.version(8).stores({
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
  flashcards: 'id, deck_id, front, back, tag, created_at',
  // Study Sessions (Pomodoro)
  study_sessions: 'id, topic_id, duration_minutes, created_at'
});

db.version(11).stores({
  subjects: 'id, title, created_at',
  units: 'id, subject_id, title, order_index',
  topics: 'id, unit_id, title, order_index, has_content, difficulty_rating',
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
  study_plans: 'id, profile_id, exam_date, updated_at',
  // Flashcards
  flashcard_decks: 'id, topic_id, title, created_at',
  flashcards: 'id, deck_id, front, back, tag, created_at',
  // Study Sessions (Pomodoro)
  study_sessions: 'id, topic_id, duration_minutes, created_at',
  // Gamification Engine
  gamification_profiles: 'id, user_id, total_xp, current_level, streak_days, longest_streak, last_study_date',
  achievements: 'id, user_id, achievement_id, unlocked_at, viewed',
  daily_quests: 'id, user_id, date, quests_json, completed_count',
  xp_transactions: 'id, user_id, amount, source, source_id, created_at',
  // Analytics Engine
  user_analytics: 'id, user_id, topic_id, action_type, duration_seconds, accuracy_score, created_at',
  study_weaknesses: 'id, user_id, topic_id, weakness_score, last_detected_at, revision_count'
});

db.version(12).stores({
  subjects: 'id, title, created_at',
  units: 'id, subject_id, title, order_index',
  topics: 'id, unit_id, title, order_index, has_content, difficulty_rating, *prerequisite_topic_ids',
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
  study_plans: 'id, profile_id, exam_date, updated_at',
  // Flashcards
  flashcard_decks: 'id, topic_id, title, created_at',
  flashcards: 'id, deck_id, front, back, tag, created_at',
  // Study Sessions (Pomodoro)
  study_sessions: 'id, topic_id, duration_minutes, created_at',
  // Gamification Engine
  gamification_profiles: 'id, user_id, total_xp, current_level, streak_days, longest_streak, last_study_date',
  achievements: 'id, user_id, achievement_id, unlocked_at, viewed',
  daily_quests: 'id, user_id, date, quests_json, completed_count',
  xp_transactions: 'id, user_id, amount, source, source_id, created_at',
  // Analytics Engine
  user_analytics: 'id, user_id, topic_id, action_type, duration_seconds, accuracy_score, created_at',
  study_weaknesses: 'id, user_id, topic_id, weakness_score, last_detected_at, revision_count'
});

db.version(14).stores({
  subjects: 'id, title, created_at',
  units: 'id, subject_id, title, order_index',
  topics: 'id, unit_id, title, order_index, has_content, difficulty_rating, *prerequisite_topic_ids',
  topic_contents: 'id, topic_id, is_latest',
  bookmarks: 'id, topic_id, section_id, created_at',
  notes: 'id, topic_id, updated_at',
  study_stats: 'id, topic_id, last_opened_at',
  question_banks: 'id, subject_id, title, created_at',
  questions: 'id, bank_id, text, marks, answer, order_index, wrong_answer_analysis',
  // Mock Exams
  question_variants: 'id, original_question_id, text, marks, created_at',
  mock_exams: 'id, bank_id, duration_minutes, total_questions, score, created_at',
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
  study_plans: 'id, profile_id, exam_date, updated_at',
  // Flashcards (Upgraded for SRS in v14)
  flashcard_decks: 'id, topic_id, title, created_at', // mastery etc. can be dynamically calculated
  flashcards: 'id, deck_id, front, back, tag, interval, repetitions, easiness_factor, next_review_date, last_review_date, created_at',
  // Study Sessions (Pomodoro)
  study_sessions: 'id, topic_id, duration_minutes, created_at',
  // Gamification Engine
  gamification_profiles: 'id, user_id, total_xp, current_level, streak_days, longest_streak, last_study_date',
  achievements: 'id, user_id, achievement_id, unlocked_at, viewed',
  daily_quests: 'id, user_id, date, quests_json, completed_count',
  xp_transactions: 'id, user_id, amount, source, source_id, created_at',
  // Analytics Engine
  user_analytics: 'id, user_id, topic_id, action_type, duration_seconds, accuracy_score, created_at',
  study_weaknesses: 'id, user_id, topic_id, weakness_score, last_detected_at, revision_count'
});

db.version(15).stores({
  subjects: 'id, title, created_at',
  units: 'id, subject_id, title, order_index',
  topics: 'id, unit_id, title, order_index, has_content, difficulty_rating, *prerequisite_topic_ids',
  topic_contents: 'id, topic_id, is_latest',
  bookmarks: 'id, topic_id, section_id, created_at',
  notes: 'id, topic_id, updated_at',
  study_stats: 'id, topic_id, last_opened_at',
  question_banks: 'id, subject_id, title, created_at',
  questions: 'id, bank_id, text, marks, answer, order_index, wrong_answer_analysis',
  // Mock Exams
  question_variants: 'id, original_question_id, text, marks, created_at',
  mock_exams: 'id, bank_id, duration_minutes, total_questions, score, created_at',
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
  study_plans: 'id, profile_id, exam_date, updated_at',
  // Flashcards (Upgraded for SRS in v14)
  flashcard_decks: 'id, topic_id, title, created_at', // mastery etc. can be dynamically calculated
  flashcards: 'id, deck_id, front, back, tag, interval, repetitions, easiness_factor, next_review_date, last_review_date, created_at',
  // Study Sessions (Pomodoro)
  study_sessions: 'id, topic_id, duration_minutes, created_at',
  // Gamification Engine
  gamification_profiles: 'id, user_id, total_xp, current_level, streak_days, longest_streak, last_study_date',
  achievements: 'id, user_id, achievement_id, unlocked_at, viewed',
  daily_quests: 'id, user_id, date, quests_json, completed_count',
  xp_transactions: 'id, user_id, amount, source, source_id, created_at',
  // Analytics Engine
  user_analytics: 'id, user_id, topic_id, action_type, duration_seconds, accuracy_score, created_at',
  study_weaknesses: 'id, user_id, topic_id, weakness_score, last_detected_at, revision_count',
  // New Tables for Settings & Utilities
  cookie_consent: 'id, necessary, analytics, marketing, functional, consent_date, updated_at',
  support_tickets: 'id, user_id, category, subject, message, status, created_at, updated_at',
  user_settings: 'id, user_id, theme, email_notifications, push_notifications, study_reminders, public_profile, language, created_at, updated_at'
});
