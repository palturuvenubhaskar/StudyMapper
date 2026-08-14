import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudentProfile, getCodingStats, getCodingProblems, saveCodingProblem, getLearningTrack, createLearningTrack, getLearningLesson, saveLearningLesson } from '../../data/repository';
import { generateCodingProblemPrompt, generateLearningLessonPrompt, extractJson, callOpenRouter } from '../../core/api/aiService';
import { useToast } from '../../components/ToastProvider/ToastProvider';
import { ArrowLeft, Code2, Loader, ChevronRight, Zap, Target, TrendingUp, BookOpen, CheckCircle2, Circle, Lock, Play, RotateCcw, Type, Calculator, GitBranch, Repeat, Box, List, TerminalSquare, Database, Cpu, FileCode, Clock } from 'lucide-react';
import PremiumSelect from '../../components/PremiumSelect/PremiumSelect';
import './CodingHub.css';

const LANGUAGES = ['HTML', 'CSS', 'C', 'C++', 'C#', 'Java', 'Python', 'JavaScript', 'TypeScript', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'R', 'Dart', 'Scala'];
const TOPICS = ['Arrays', 'Strings', 'Linked Lists', 'Stacks', 'Queues', 'Trees', 'Graphs', 'Dynamic Programming', 'Recursion', 'Sorting', 'Searching', 'Hashing', 'Greedy', 'Backtracking'];
const CURRICULUMS = {
  HTML: [
    { title: 'HTML Basics and Structure', icon: FileCode, time: '5 mins' },
    { title: 'Headings, Paragraphs, and Text', icon: Type, time: '8 mins' },
    { title: 'Links and Images', icon: Box, time: '8 mins' },
    { title: 'Lists (Ordered and Unordered)', icon: List, time: '8 mins' },
    { title: 'Tables and Data Display', icon: Database, time: '10 mins' },
    { title: 'Forms and Input Elements', icon: TerminalSquare, time: '12 mins' },
    { title: 'Semantic HTML Elements', icon: Cpu, time: '10 mins' },
    { title: 'Audio, Video, and Media', icon: Box, time: '10 mins' },
    { title: 'HTML Accessibility Basics', icon: CheckCircle2, time: '10 mins' },
    { title: 'Building a Complete Web Page', icon: Code2, time: '15 mins' }
  ],
  CSS: [
    { title: 'CSS Basics and Selectors', icon: FileCode, time: '5 mins' },
    { title: 'Colors, Fonts, and Text Styling', icon: Type, time: '8 mins' },
    { title: 'Box Model (Margin, Padding, Border)', icon: Box, time: '10 mins' },
    { title: 'Display and Positioning', icon: GitBranch, time: '12 mins' },
    { title: 'Flexbox Layout', icon: List, time: '15 mins' },
    { title: 'CSS Grid Layout', icon: Database, time: '15 mins' },
    { title: 'Responsive Design and Media Queries', icon: TerminalSquare, time: '12 mins' },
    { title: 'Transitions and Animations', icon: Repeat, time: '12 mins' },
    { title: 'Pseudo-classes and Pseudo-elements', icon: Calculator, time: '10 mins' },
    { title: 'Building a Responsive Page', icon: Code2, time: '20 mins' }
  ],
  default: [
    { title: 'Variables and Data Types', icon: Type, time: '5 mins' },
    { title: 'Basic Operators and Math', icon: Calculator, time: '8 mins' },
    { title: 'Conditionals (If/Else)', icon: GitBranch, time: '10 mins' },
    { title: 'Loops (For and While)', icon: Repeat, time: '12 mins' },
    { title: 'Functions and Scope', icon: Box, time: '15 mins' },
    { title: 'Arrays / Lists Basics', icon: List, time: '12 mins' },
    { title: 'Strings and Manipulation', icon: TerminalSquare, time: '10 mins' },
    { title: 'Dictionaries / Maps / Objects', icon: Database, time: '15 mins' },
    { title: 'Object-Oriented Basics', icon: Cpu, time: '20 mins' },
    { title: 'File I/O and Error Handling', icon: FileCode, time: '15 mins' }
  ]
};

const getCurriculum = (lang) => CURRICULUMS[lang] || CURRICULUMS.default;

export default function CodingHub() {
  const navigate = useNavigate();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('practice'); // 'practice' or 'learn'

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ total: 0, solved: 0, topics: {} });
  const [recentProblems, setRecentProblems] = useState([]);
  
  // Practice state
  const [language, setLanguage] = useState('Python');
  const [topic, setTopic] = useState('Arrays');
  const [difficulty, setDifficulty] = useState('Medium');
  const [generating, setGenerating] = useState(false);

  // Learning state
  const [learnLanguage, setLearnLanguage] = useState('Python');
  const [learningTrack, setLearningTrack] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [generatingLesson, setGeneratingLesson] = useState(false);
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [trackLoading, setTrackLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const p = await getStudentProfile();
      setProfile(p);
      if (p) {
        const s = await getCodingStats(p.id);
        setStats(s);
        const problems = await getCodingProblems(p.id);
        setRecentProblems(problems.slice(0, 10));
      }
    })();
  }, []);

  // Load learning track when tab or language changes
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
      const messages = generateCodingProblemPrompt(language, topic, difficulty);
      const responseText = await callOpenRouter(messages);
      const parsed = extractJson(responseText);

      if (parsed && parsed.title) {
        const problem = await saveCodingProblem(profile?.id || 'guest', {
          ...parsed, language, topic, difficulty
        });
        toast('Problem generated!', 'success');
        navigate(`/coding/workspace/${problem.id}`);
      } else {
        toast('Failed to generate problem. Try again.', 'error');
      }
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

  const difficultyColor = (d) => d === 'Easy' ? 'var(--success)' : d === 'Medium' ? 'var(--warning)' : 'var(--danger)';

  return (
    <div className="coding-hub">


      <div className="coding-hero">
        <div className="hero-glow"></div>
        <div className="hero-content">
          <div className="hero-badge"><Code2 size={16}/> Developer Arena</div>
          <h1 className="hero-title">Coding <span>Practice</span></h1>
          <p className="hero-subtitle">Master algorithms, data structures, and languages.</p>
        </div>
        
        <div className="hero-stats-overview">
          <div className="stat-pill">
            <Target size={18} color="#818cf8"/>
            <span>{stats.total}</span> Attempted
          </div>
          <div className="stat-pill">
            <Zap size={18} color="#34d399"/>
            <span>{stats.solved}</span> Solved
          </div>
          <div className="stat-pill">
            <TrendingUp size={18} color="#fbbf24"/>
            <span>{stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0}%</span> Success
          </div>
        </div>
      </div>

      <div className="coding-tabs-container">
        <button 
          className={`premium-tab ${activeTab === 'practice' ? 'active' : ''}`} 
          onClick={() => setActiveTab('practice')}
        >
          <Code2 size={18} /> Practice Random
        </button>
        <button 
          className={`premium-tab ${activeTab === 'learn' ? 'active' : ''}`} 
          onClick={() => setActiveTab('learn')}
        >
          <BookOpen size={18} /> Step-by-Step Learning
        </button>
      </div>

      {activeTab === 'practice' ? (
        <>
          {/* Generate Problem */}
          <div className="premium-glass-panel generate-section">
            <div className="panel-header">
              <Zap size={20} color="#818cf8" />
              <h2>Generate a Problem</h2>
            </div>
            
            <div className="premium-generate-controls">
              <div className="premium-form-group">
                <label>Language</label>
                <PremiumSelect 
                  value={language} 
                  onChange={e => setLanguage(e.target.value)} 
                  options={LANGUAGES} 
                />
              </div>
              <div className="premium-form-group">
                <label>Topic</label>
                <PremiumSelect 
                  value={topic} 
                  onChange={e => setTopic(e.target.value)} 
                  options={TOPICS} 
                />
              </div>
              <div className="premium-form-group">
                <label>Difficulty</label>
                <PremiumSelect 
                  value={difficulty} 
                  onChange={e => setDifficulty(e.target.value)} 
                  options={['Easy', 'Medium', 'Hard']} 
                />
              </div>
            </div>
            
            <button className="btn-premium-action" onClick={generateProblem} disabled={generating}>
              {generating ? <><Loader size={18} className="spin-icon" /> Synthesizing...</> : <><Code2 size={18} /> Generate Problem</>}
            </button>
          </div>

          {/* Topic Breakdown */}
          {Object.keys(stats.topics).length > 0 && (
            <div className="glass-card" style={{ padding: '24px', marginTop: '24px' }}>
              <h3 style={{ marginBottom: '16px' }}>Topic Breakdown</h3>
              <div className="topic-breakdown">
                {Object.entries(stats.topics).map(([t, data]) => (
                  <div key={t} className="topic-row">
                    <span>{t}</span>
                    <div className="topic-bar-container">
                      <div className="topic-bar" style={{ width: `${data.total > 0 ? (data.solved / data.total) * 100 : 0}%` }}></div>
                    </div>
                    <span className="badge badge-accent">{data.solved}/{data.total}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Problems */}
          {recentProblems.length > 0 && (
            <div style={{ marginTop: '24px' }}>
              <h3 style={{ marginBottom: '16px' }}>Recent Problems</h3>
              <div className="recent-problems-list">
                {recentProblems.map(p => (
                  <div key={p.id} className="glass-card recent-problem-card" onClick={() => navigate(`/coding/workspace/${p.id}`)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                      <span className="badge" style={{ background: `${difficultyColor(p.difficulty)}20`, color: difficultyColor(p.difficulty) }}>{p.difficulty}</span>
                      <h4>{p.title}</h4>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="badge badge-accent">{p.language}</span>
                      <span className="badge" style={{ background: p.status === 'solved' ? 'var(--success-soft)' : 'var(--bg-glass)', color: p.status === 'solved' ? 'var(--success)' : 'var(--text-muted)' }}>
                        {p.status === 'solved' ? '✅ Solved' : '⏳ Unsolved'}
                      </span>
                      <ChevronRight size={16} color="var(--text-muted)" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="learning-track-container" style={{ marginTop: '24px' }}>
          <div className="track-header premium-glass-panel" style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Your Coding Journey</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Master programming step-by-step. Begin by choosing your language.</p>
            </div>
            <div className="premium-form-group" style={{ minWidth: '250px', flex: '0 0 auto' }}>
              <label>Target Language</label>
              <PremiumSelect 
                value={learnLanguage} 
                onChange={e => setLearnLanguage(e.target.value)} 
                options={LANGUAGES} 
              />
            </div>
          </div>

          <div className="track-progress-container glass-card" style={{ padding: '24px', marginBottom: '32px' }}>
            <div className="progress-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Track Progress</h3>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
                {completedLessons.length} of {getCurriculum(learnLanguage).length} completed
              </span>
            </div>
            <div className="topic-bar-container" style={{ height: '12px' }}>
              <div className="topic-bar" style={{ width: `${(completedLessons.length / getCurriculum(learnLanguage).length) * 100}%` }}></div>
            </div>
          </div>

          <div className="lesson-cards-grid">
            {getCurriculum(learnLanguage).map((lessonData, idx) => {
              const topicName = lessonData.title;
              const Icon = lessonData.icon;
              const time = lessonData.time;
              const isCompleted = completedLessons.includes(topicName);
              const isActive = idx === activeLessonIdx && !isCompleted;
              const isUnlocked = idx <= activeLessonIdx || isCompleted || idx === 0;
              
              return (
                <div 
                  key={topicName} 
                  className={`lesson-card ${isCompleted ? 'completed' : isActive ? 'active' : isUnlocked ? 'unlocked' : 'locked'}`}
                  onClick={() => startLearningLesson(idx, topicName)}
                >
                  <div className="lesson-card-header">
                    <div className="lesson-icon-wrapper">
                      {isCompleted ? <CheckCircle2 size={24} color="var(--success)" /> : !isUnlocked ? <Lock size={24} color="var(--text-muted)" /> : <Icon size={24} color={isActive ? "var(--accent)" : "var(--text-primary)"} />}
                    </div>
                    <span className="lesson-number">Step {idx + 1}</span>
                  </div>
                  
                  <h3 className="lesson-title">{topicName}</h3>
                  
                  <div className="lesson-card-footer">
                    <div className="lesson-meta">
                      <Clock size={14} /> {time}
                    </div>
                    {generatingLesson && isUnlocked && idx === activeLessonIdx ? (
                       <button className="btn-start-lesson" style={{ opacity: 0.7, cursor: 'not-allowed', display: 'flex', alignItems: 'center', gap: '8px' }} disabled>
                         <Loader size={16} className="spin-icon" /> Generating...
                       </button>
                    ) : !isUnlocked ? (
                       <div className="locked-badge"><Lock size={12} /> Locked</div>
                    ) : isCompleted ? (
                       <div className="status-badge success">Review</div>
                    ) : isActive ? (
                       <span className="btn-start-lesson">Start Now</span>
                    ) : (
                       <div className="status-badge">Unlocked</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
