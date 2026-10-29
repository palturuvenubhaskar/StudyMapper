import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getStudentProfile, getCodingStats, getCodingProblems, saveCodingProblem, getLearningTrack, createLearningTrack, getLearningLesson, saveLearningLesson } from '../../data/repository';
import { useToast } from '../../components/ToastProvider/ToastProvider';
import {
  Code2, Loader, ChevronRight, Zap, Target, TrendingUp, BookOpen,
  CheckCircle2, Lock, Clock, History, ListOrdered, Check, ArrowRight,
} from 'lucide-react';
import PremiumSelect from '../../components/PremiumSelect/PremiumSelect';
import { LANGUAGES, getCurriculum } from './data/curriculum';
import './CodingPractice.css';
import './CodingPracticeHub.css';

const TOPIC_CATEGORIES = {
  'Fundamentals': [
    'Hello World & I/O',
    'Variables & Data Types',
    'Operators & Expressions',
    'Conditionals (If/Else/Switch)',
    'Loops (For/While)',
    'Functions & Methods',
    'Strings Basics',
    'Arrays/Lists Basics',
    'Error Handling & Exceptions',
  ],
  'Number & Math Problems': [
    'Number Operations',
    'Pattern Printing',
    'Math & Logic Puzzles',
    'Prime Numbers & Factorials',
    'Base Conversions',
  ],
  'Data Structures': [
    'Arrays',
    'Strings',
    'Linked Lists',
    'Stacks',
    'Queues',
    'Trees',
    'Graphs',
    'Hashing',
  ],
  'Algorithms': [
    'Sorting',
    'Searching',
    'Recursion',
    'Dynamic Programming',
    'Greedy',
    'Backtracking',
  ],
};

// Build flattened options array with group headers for PremiumSelect
const TOPICS_OPTIONS = [];
Object.entries(TOPIC_CATEGORIES).forEach(([category, topics]) => {
  TOPICS_OPTIONS.push({ label: category, value: '', isGroupHeader: true });
  topics.forEach(t => TOPICS_OPTIONS.push({ label: t, value: t }));
});

const difficultyChip = (difficulty) =>
  `hub-chip is-${typeof difficulty === 'string' ? difficulty.toLowerCase() : 'easy'}`;

const statusMeta = (status) => {
  if (status === 'solved') return { label: 'Solved', dot: 'is-solved', state: 'is-solved' };
  if (status === 'generating') return { label: 'Generating', dot: 'is-building', state: '' };
  return { label: 'Unsolved', dot: '', state: '' };
};

export default function CodingPractice() {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams] = useSearchParams();

  // Deep links from a lesson can reopen the learning track on the right language.
  const requestedTab = searchParams.get('tab');
  const requestedLanguage = searchParams.get('lang');
  const [activeTab, setActiveTab] = useState(requestedTab === 'learn' ? 'learn' : 'practice'); // 'practice' or 'learn'

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ total: 0, solved: 0, topics: {} });
  const [recentProblems, setRecentProblems] = useState([]);
  const [showAllProblems, setShowAllProblems] = useState(false);
  
  // Practice state
  const [language, setLanguage] = useState('Python');
  const [topic, setTopic] = useState('Hello World & I/O');
  const [difficulty, setDifficulty] = useState('Easy');
  const [generating, setGenerating] = useState(false);

  // Learning state
  const [learnLanguage, setLearnLanguage] = useState(
    () => (LANGUAGES.includes(requestedLanguage) ? requestedLanguage : 'Python')
  );
  const [learningTrack, setLearningTrack] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [generatingLesson, setGeneratingLesson] = useState(false);
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [trackLoading, setTrackLoading] = useState(false);

  // Load the profile plus every problem the student has generated. Guest
  // problems are included so earlier work never disappears after onboarding.
  const loadPracticeHistory = useCallback(async () => {
    const p = await getStudentProfile();
    // Keep the same object when the profile has not changed so the learning
    // track effect does not reload on every window focus.
    setProfile(prev => (prev?.id === p?.id ? prev : p));
    const ownerId = p?.id || 'guest';
    const [s, problems] = await Promise.all([
      getCodingStats(ownerId),
      getCodingProblems(ownerId),
    ]);
    setStats(s);
    setRecentProblems(problems);
  }, []);

  useEffect(() => {
    loadPracticeHistory();
  }, [loadPracticeHistory]);

  // Problems generated in the workspace should be visible when we come back.
  useEffect(() => {
    const refresh = () => loadPracticeHistory();
    window.addEventListener('focus', refresh);
    return () => window.removeEventListener('focus', refresh);
  }, [loadPracticeHistory]);

  // Load learning track when tab or language changes
  useEffect(() => {
    const tab = searchParams.get('tab');
    const lang = searchParams.get('lang');
    if (tab === 'learn') setActiveTab('learn');
    if (LANGUAGES.includes(lang)) setLearnLanguage(lang);
  }, [searchParams]);

  useEffect(() => {
    if (activeTab === 'learn') {
      loadLearningTrack();
    }
  }, [activeTab, learnLanguage, profile]);

  const loadLearningTrack = async () => {
    setTrackLoading(true);
    const profileId = profile?.id || 'guest';
    let track = await getLearningTrack(profileId, learnLanguage);
    if (!track) {
      track = await createLearningTrack(profileId, learnLanguage);
    }
    setLearningTrack(track);

    // Find completed lessons for this track
    const curriculum = getCurriculum(learnLanguage);
    const completed = [];
    let lastCompletedIdx = -1;
    for (let i = 0; i < curriculum.length; i++) {
      const lesson = await getLearningLesson(track.id, curriculum[i].title);
      if (lesson && lesson.status === 'solved') {
        completed.push(curriculum[i].title);
        lastCompletedIdx = i;
      }
    }
    setCompletedLessons(completed);
    
    // Set next unlocked lesson
    const nextIdx = lastCompletedIdx + 1 < curriculum.length ? lastCompletedIdx + 1 : lastCompletedIdx;
    setActiveLessonIdx(nextIdx);
    setTrackLoading(false);
  };

  const generateProblem = async () => {
    setGenerating(true);
    try {
      // Create a placeholder problem immediately and navigate
      const problem = await saveCodingProblem(profile?.id || 'guest', {
        title: `${topic} Problem`,
        statement: '',
        constraints: '',
        sample_input: '',
        sample_output: '',
        explanation: '',
        hints: '',
        test_cases: '',
        language,
        topic,
        difficulty,
        status: 'generating'
      });
      // Navigate immediately — workspace will handle AI generation
      navigate(`/coding/workspace/${problem.id}`);
    } catch (err) {
      console.error(err);
      toast('Error: ' + err.message, 'error');
    }
    setGenerating(false);
  };

  const startLearningLesson = async (index, topicName) => {
    if (generatingLesson) return;
    
    if (!learningTrack) {
      toast('Please wait, loading track...', 'info');
      return;
    }

    // Check if it's unlocked
    if (index > activeLessonIdx && index !== 0) {
      toast('Complete previous lessons first to unlock this topic.', 'error');
      return;
    }

    setGeneratingLesson(true);
    toast('Preparing workspace...', 'info');
    try {
      let lesson = await getLearningLesson(learningTrack.id, topicName);
      
      if (!lesson) {
        // Create placeholder lesson for streaming
        lesson = await saveLearningLesson(learningTrack.id, learnLanguage, topicName, {
          title: topicName,
          theory: '',
          problem_statement: '',
          sample_input: '',
          sample_output: '',
          hints: '',
          status: 'generating'
        });
      }
      
      navigate(`/coding/learning/${lesson.id}`);
    } catch (err) {
      console.error(err);
      toast('Error preparing workspace: ' + err.message, 'error');
    }
    setGeneratingLesson(false);
  };

  const visibleProblems = showAllProblems ? recentProblems : recentProblems.slice(0, 10);
  const successRate = stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0;
  const topicEntries = Object.entries(stats.topics)
    .sort((a, b) => (b[1].total - a[1].total) || a[0].localeCompare(b[0]));

  const curriculum = getCurriculum(learnLanguage);
  const completedCount = completedLessons.length;
  const nextLesson = curriculum[activeLessonIdx];
  const nextIsReview = Boolean(nextLesson && completedLessons.includes(nextLesson.title));

  return (
    <div className="hub-page">
      <header className="hub-head">
        <div className="hub-head-copy">
          <span className="hub-eyebrow">Coding practice</span>
          <h1 className="hub-title">
            Coding <span className="hub-title-accent">Practice</span>
          </h1>
          <p className="hub-subtitle">
            Generate a fresh problem in any language, or follow a guided track from
            fundamentals to algorithms.
          </p>
        </div>

        <div className="hub-metrics">
          <div className="hub-metric">
            <span className="hub-metric-label">
              <Target size={12} /> Attempted
            </span>
            <span className="hub-metric-value">{stats.total}</span>
          </div>
          <div className="hub-metric">
            <span className="hub-metric-label is-success">
              <CheckCircle2 size={12} /> Solved
            </span>
            <span className="hub-metric-value">{stats.solved}</span>
          </div>
          <div className="hub-metric">
            <span className="hub-metric-label is-amber">
              <TrendingUp size={12} /> Success
            </span>
            <span className="hub-metric-value">
              {successRate}<span className="hub-metric-unit">%</span>
            </span>
          </div>
        </div>
      </header>

      <div className="hub-switch" role="tablist" aria-label="Practice mode">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'practice'}
          className={`hub-switch-btn ${activeTab === 'practice' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('practice')}
        >
          <Zap size={15} /> Practice random
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'learn'}
          className={`hub-switch-btn ${activeTab === 'learn' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('learn')}
        >
          <BookOpen size={15} /> Step-by-step learning
        </button>
      </div>

      <div className="hub-body">
        {activeTab === 'practice' ? (
          <div className="hub-grid hub-grid--practice">
            <div className="hub-col">
              <section className="hub-card">
                <div className="hub-card-head">
                  <span className="hub-icon"><Zap size={16} /></span>
                  <div className="hub-card-copy">
                    <h2>Generate a problem</h2>
                    <p>Pick a language, topic, and difficulty. Your workspace opens right after.</p>
                  </div>
                </div>

                <div className="hub-fields">
                  <div className="hub-field">
                    <label className="hub-field-label" htmlFor="hub-language">Language</label>
                    <PremiumSelect
                      value={language}
                      onChange={e => setLanguage(e.target.value)}
                      options={LANGUAGES}
                    />
                  </div>
                  <div className="hub-field">
                    <label className="hub-field-label" htmlFor="hub-topic">Topic</label>
                    <PremiumSelect
                      value={topic}
                      onChange={e => setTopic(e.target.value)}
                      options={TOPICS_OPTIONS}
                    />
                  </div>
                  <div className="hub-field">
                    <label className="hub-field-label" htmlFor="hub-difficulty">Difficulty</label>
                    <PremiumSelect
                      value={difficulty}
                      onChange={e => setDifficulty(e.target.value)}
                      options={['Easy', 'Medium', 'Hard']}
                    />
                  </div>
                </div>

                <div className="hub-generator-actions">
                  <button className="hub-cta" onClick={generateProblem} disabled={generating}>
                    {generating
                      ? <><Loader size={16} className="spin-icon" /> Synthesizing…</>
                      : <><Code2 size={16} /> Generate problem <ArrowRight size={15} /></>}
                  </button>
                  <span className="hub-generator-note">
                    Tests, hints, and an explanation are written for you.
                  </span>
                </div>
              </section>

              <section className="hub-card">
                <div className="hub-card-head">
                  <span className="hub-icon is-emerald"><History size={16} /></span>
                  <div className="hub-card-copy">
                    <h2>Recent problems</h2>
                    <p>
                      {recentProblems.length > 0
                        ? `${recentProblems.length} saved ${recentProblems.length === 1 ? 'problem' : 'problems'}. Reopen any of them to keep going.`
                        : 'Everything you generate is saved here.'}
                    </p>
                  </div>
                  {recentProblems.length > 10 && (
                    <button
                      type="button"
                      className="hub-link-btn"
                      onClick={() => setShowAllProblems(value => !value)}
                    >
                      {showAllProblems ? 'Show less' : `Show all ${recentProblems.length}`}
                    </button>
                  )}
                </div>

                {recentProblems.length > 0 ? (
                  <ul className="hub-rows">
                    {visibleProblems.map(p => {
                      const meta = statusMeta(p.status);
                      return (
                        <li key={p.id}>
                          <button
                            type="button"
                            className="hub-row"
                            onClick={() => navigate(`/coding/workspace/${p.id}`)}
                          >
                            <span className={`hub-row-dot ${meta.dot}`} aria-hidden="true" />
                            <span className="hub-row-title">{p.title}</span>
                            <span className={difficultyChip(p.difficulty)}>{p.difficulty}</span>
                            <span className="hub-chip hub-chip--plain">{p.language}</span>
                            <span className={`hub-row-state ${meta.state}`}>{meta.label}</span>
                            <ChevronRight size={15} className="hub-row-chev" />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="hub-empty">
                    <Code2 size={22} />
                    <p>
                      <strong>Nothing here yet.</strong> Generate a problem above and it
                      will show up with its language, difficulty, and status.
                    </p>
                  </div>
                )}
              </section>
            </div>

            <aside className="hub-col">
              <section className="hub-card">
                <div className="hub-card-head">
                  <span className="hub-icon is-sky"><TrendingUp size={16} /></span>
                  <div className="hub-card-copy">
                    <h2>Topic progress</h2>
                    <p>{stats.total > 0 ? 'Solved problems across the topics you have practised.' : 'Your solved topics will fill up here.'}</p>
                  </div>
                  <span className="hub-rate">{successRate}%</span>
                </div>

                <div className="hub-track" aria-hidden="true">
                  <div className="hub-track-fill" style={{ width: `${successRate}%` }} />
                </div>

                {topicEntries.length > 0 ? (
                  <div className="hub-topics">
                    {topicEntries.map(([name, data]) => {
                      const percent = data.total > 0 ? (data.solved / data.total) * 100 : 0;
                      return (
                        <div key={name}>
                          <div className="hub-topic-line">
                            <span className="hub-topic-name">{name}</span>
                            <span className="hub-topic-count">{data.solved}/{data.total}</span>
                          </div>
                          <div className="hub-topic-track" aria-hidden="true">
                            <div className="hub-topic-fill" style={{ width: `${percent}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="hub-note">
                    No problems yet. Generate your first one and this panel starts
                    tracking solved counts by topic.
                  </p>
                )}
              </section>
            </aside>
          </div>
        ) : (
          <>
            <div className="hub-grid">
              <section className="hub-card">
                <div className="hub-card-head">
                  <span className="hub-icon"><BookOpen size={16} /></span>
                  <div className="hub-card-copy">
                    <h2>Your coding journey</h2>
                    <p>One topic at a time, in order. Each step ends with a small problem to solve.</p>
                  </div>
                </div>

                <div className="hub-fields hub-fields--single">
                  <div className="hub-field">
                    <label className="hub-field-label" htmlFor="hub-learn-language">Target language</label>
                    <PremiumSelect
                      value={learnLanguage}
                      onChange={e => setLearnLanguage(e.target.value)}
                      options={LANGUAGES}
                    />
                  </div>
                </div>

                <div className="hub-generator-actions">
                  <button
                    type="button"
                    className="hub-cta"
                    onClick={() => nextLesson && startLearningLesson(activeLessonIdx, nextLesson.title)}
                    disabled={generatingLesson || !nextLesson}
                  >
                    {generatingLesson
                      ? <><Loader size={16} className="spin-icon" /> Preparing…</>
                      : <>{nextIsReview ? <Check size={16} /> : <ArrowRight size={16} />}
                        {nextIsReview ? 'Review last step' : `Start step ${activeLessonIdx + 1}`}</>}
                  </button>
                  <span className="hub-generator-note">
                    {nextLesson ? `Next up: ${nextLesson.title}` : 'Pick a language to begin.'}
                  </span>
                </div>
              </section>

              <section className="hub-card">
                <div className="hub-card-head">
                  <span className="hub-icon is-sky"><ListOrdered size={16} /></span>
                  <div className="hub-card-copy">
                    <h2>Track progress</h2>
                    <p>{learnLanguage} curriculum</p>
                  </div>
                  <span className="hub-rate">{completedCount}/{curriculum.length}</span>
                </div>

                <div className="hub-track" aria-hidden="true">
                  <div
                    className="hub-track-fill"
                    style={{ width: `${curriculum.length ? (completedCount / curriculum.length) * 100 : 0}%` }}
                  />
                </div>

                <p className="hub-note">
                  {completedCount === 0
                    ? 'Step 1 is open. Finish a lesson to unlock the next topic.'
                    : completedCount === curriculum.length
                      ? 'Every step in this track is complete. Revisit any lesson to sharpen it.'
                      : `${curriculum.length - completedCount} ${curriculum.length - completedCount === 1 ? 'step' : 'steps'} left in this track.`}
                </p>
              </section>
            </div>

            <section className="hub-card">
              <div className="hub-card-head">
                <span className="hub-icon is-emerald"><ListOrdered size={16} /></span>
                <div className="hub-card-copy">
                  <h2>Curriculum steps</h2>
                  <p>Unlocked as you finish the previous lesson.</p>
                </div>
                {trackLoading && (
                  <span className="hub-loading"><Loader size={12} className="spin-icon" /> Loading</span>
                )}
              </div>

              <ul className="hub-steps">
                {curriculum.map((lessonData, idx) => {
                  const topicName = lessonData.title;
                  const isCompleted = completedLessons.includes(topicName);
                  const isActive = idx === activeLessonIdx && !isCompleted;
                  const isUnlocked = idx <= activeLessonIdx || isCompleted || idx === 0;
                  const isBusy = generatingLesson && isUnlocked && idx === activeLessonIdx;

                  return (
                    <li key={topicName}>
                      <button
                        type="button"
                        className={`hub-step ${isCompleted ? 'is-completed' : isActive ? 'is-active' : isUnlocked ? 'is-unlocked' : 'is-locked'}`}
                        onClick={() => startLearningLesson(idx, topicName)}
                        disabled={!isUnlocked || generatingLesson}
                      >
                        <span className="hub-step-num">
                          {isCompleted ? <Check size={13} /> : idx + 1}
                        </span>
                        <span className="hub-step-copy">
                          <span className="hub-step-title">{topicName}</span>
                          <span className="hub-step-meta">
                            <Clock size={11} /> {lessonData.time}
                          </span>
                        </span>
                        {isBusy ? (
                          <span className="hub-step-state">
                            <Loader size={11} className="spin-icon" /> Preparing
                          </span>
                        ) : !isUnlocked ? (
                          <span className="hub-step-state">
                            <Lock size={11} /> Locked
                          </span>
                        ) : isCompleted ? (
                          <span className="hub-step-state">
                            <Check size={11} /> Review
                          </span>
                        ) : isActive ? (
                          <span className="hub-step-state">
                            Start now <ArrowRight size={11} />
                          </span>
                        ) : (
                          <span className="hub-step-state">Unlocked</span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
