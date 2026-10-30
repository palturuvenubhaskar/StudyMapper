import Dexie from 'dexie';

export const db = new Dexie('StudyMapperDB');

// Only the current schema needs to be declared. The previous 13 version
// declarations were removed because none had upgrade hooks; Dexie diffs the
// installed schema against this one and upgrades older databases in place.
db.version(19).stores({
  // Study library
  subjects: 'id, title, created_at',
  units: 'id, subject_id, title, order_index',
  topics: 'id, unit_id, title, order_index, has_content, difficulty_rating, *prerequisite_topic_ids',
  topic_contents: 'id, topic_id, is_latest',
  bookmarks: 'id, topic_id, section_id, created_at',
  notes: 'id, topic_id, updated_at',
  study_stats: 'id, topic_id, last_opened_at',

  // Question banks and mock exams
  question_banks: 'id, subject_id, title, created_at',
  questions: 'id, bank_id, text, marks, answer, order_index, wrong_answer_analysis',
  question_variants: 'id, original_question_id, text, marks, created_at',
  mock_exams: 'id, bank_id, duration_minutes, total_questions, score, created_at',

  // Skill roadmaps
  student_profiles: 'id, branch, career_goal, created_at',
  roadmaps: 'id, profile_id, title, career_goal, created_at',
  roadmap_skills: 'id, roadmap_id, name, order_index, status',

  // Placement preparation
  placement_sessions: 'id, profile_id, category, created_at',
  placement_questions: 'id, session_id, category, subcategory, difficulty, is_correct, created_at',
  placement_topics: 'id, category, subcategory, title, difficulty, order_index, estimated_minutes, is_premium',
  placement_topic_content: 'id, topic_id, content_markdown, formulas_json, examples_json, tips_json, is_ai_generated, created_at',
  placement_learning_progress: 'id, user_id, topic_id, status, completion_percentage, time_spent_minutes, last_studied_at, notes',
  placement_test_results: 'id, user_id, category, subcategory, score, total_questions, correct_answers, time_taken_seconds, weak_topics_json, created_at',
  placement_bookmarks: 'id, user_id, topic_id, section_type, note, created_at',

  // Coding practice
  coding_problems: 'id, profile_id, language, topic, difficulty, status, title, description, constraints, examples_json, test_cases_json, hints_json, starter_code_json, solution_code, time_limit_ms, memory_limit_mb, created_at',
  coding_hints_unlocked: 'id, problem_id, hint_index, points_deducted, unlocked_at',

  // AI assistant
  ai_sessions: 'id, title, created_at, updated_at',
  ai_messages: 'id, session_id, role, created_at',

  // Learning tracks
  learning_tracks: 'id, [profile_id+language], profile_id, language, current_step, updated_at',
  learning_lessons: 'id, [track_id+topic], track_id, language, topic, status, created_at',

  // Study planner
  study_plans: 'id, profile_id, exam_date, updated_at',

  // Flashcards and study sessions
  flashcard_decks: 'id, topic_id, title, created_at',
  flashcards: 'id, deck_id, front, back, tag, interval, repetitions, easiness_factor, next_review_date, last_review_date, created_at',
  study_sessions: 'id, user_id, topic_id, duration_minutes, completed, created_at',

  // Gamification
  gamification_profiles: 'id, user_id, total_xp, current_level, streak_days, longest_streak, last_study_date',
  achievements: 'id, user_id, achievement_id, unlocked_at, viewed',
  daily_quests: 'id, [user_id+date], user_id, date, completed_count',
  xp_transactions: 'id, user_id, amount, source, source_id, created_at',

  // Analytics
  user_analytics: 'id, user_id, topic_id, action_type, duration_seconds, accuracy_score, created_at',
  study_weaknesses: 'id, user_id, topic_id, weakness_score, last_detected_at, revision_count',

  // Settings and support
  cookie_consent: 'id, necessary, analytics, marketing, functional, consent_date, updated_at',
  support_tickets: 'id, user_id, category, subject, message, status, created_at, updated_at',
  user_settings: 'id, user_id, theme, email_notifications, push_notifications, study_reminders, public_profile, language, created_at, updated_at',
});
