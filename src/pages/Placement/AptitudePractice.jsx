import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudentProfile, createPlacementSession, savePlacementQuestions, updatePlacementQuestion } from '../../data/repository';
import { db } from '../../data/db';
import { generateAptitudeQuestionsPrompt, extractJson, callOpenRouter } from '../../core/api/aiService';
import { useToast } from '../../components/ToastProvider/ToastProvider';
import GenerationError from '../../components/GenerationError/GenerationError';
import { ArrowLeft, Clock, Loader, RefreshCw, CheckCircle2, XCircle, BookOpen, Target, Sparkles } from 'lucide-react';
import './Placement.css';
import './AptitudePractice.css';
import { usePlacementState } from '../../context/PlacementStateContext';

export default function AptitudePractice() {
  const navigate = useNavigate();
  const toast = useToast();
  const timerRef = useRef(null);
  const { saveState, loadState } = usePlacementState('aptitude-practice');

  // Restore saved state on mount
  const saved = loadState();

  const [profile, setProfile] = useState(null);
  const [subcategory, setSubcategory] = useState(saved?.subcategory || 'Quantitative Aptitude');
  const [difficulty, setDifficulty] = useState(saved?.difficulty || 'Medium');
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState(null);

  // Quiz state
  const [questions, setQuestions] = useState(saved?.questions || []);
  const [currentIdx, setCurrentIdx] = useState(saved?.currentIdx || 0);
  const [selectedAnswer, setSelectedAnswer] = useState(saved?.selectedAnswer ?? null);
  const [showExplanation, setShowExplanation] = useState(saved?.showExplanation || false);
  const [timer, setTimer] = useState(saved?.timer || 0);
  const [quizDone, setQuizDone] = useState(saved?.quizDone || false);
  const [sessionId, setSessionId] = useState(saved?.sessionId || null);

  // New scope selector state
  const [testScope, setTestScope] = useState(saved?.testScope || 'all');
  const [questionCount, setQuestionCount] = useState(saved?.questionCount || 5);
  const [learnedTopicsCount, setLearnedTopicsCount] = useState(0);
  const [weakTopicsCount, setWeakTopicsCount] = useState(0);
  const resultSavedRef = useRef(false);

  // Persist the finished attempt so the Placement Prep hub can show real
  // test counts and average scores. Keyed by session id, so revisiting the
  // results screen updates the same record instead of adding a duplicate.
  useEffect(() => {
    if (!quizDone || questions.length === 0) {
      resultSavedRef.current = false;
      return;
    }
    if (resultSavedRef.current) return;
    resultSavedRef.current = true;

    const correct = questions.filter((q) => q.is_correct).length;
    db.placement_test_results
      .put({
        id: sessionId || questions[0]?.session_id || `aptitude-${Date.now()}`,
        user_id: profile?.id || 'guest',
        category: 'aptitude',
        subcategory,
        score: correct,
        total_questions: questions.length,
        correct_answers: correct,
        created_at: new Date().toISOString(),
      })
      .catch((err) => console.error('Failed to save placement test result:', err));
  }, [quizDone, questions, sessionId, profile?.id, subcategory]);

  // Keep a ref of current state for cleanup
  const stateRef = useRef({});
  useEffect(() => {
    stateRef.current = { subcategory, difficulty, questions, currentIdx, selectedAnswer, showExplanation, timer, quizDone, sessionId, testScope, questionCount };
  }, [subcategory, difficulty, questions, currentIdx, selectedAnswer, showExplanation, timer, quizDone, sessionId, testScope, questionCount]);

  // Save state on unmount
  useEffect(() => {
    return () => saveState(stateRef.current);
  }, [saveState]);

  useEffect(() => {
    (async () => { const p = await getStudentProfile(); setProfile(p); })();
  }, []);

  // Timer
  useEffect(() => {
    if (questions.length > 0 && !quizDone && !showExplanation) {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
      return () => clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [questions.length, currentIdx, quizDone, showExplanation]);

  const generateQuestions = async () => {
    setGenerating(true);
    setGenerateError(null);
    try {
      const messages = generateAptitudeQuestionsPrompt(subcategory, difficulty, questionCount);
      const responseText = await callOpenRouter(messages);
      const parsed = extractJson(responseText);

      if (parsed && Array.isArray(parsed) && parsed.length > 0) {
        const sid = await createPlacementSession(profile?.id || 'guest', 'aptitude');
        const saved = await savePlacementQuestions(sid, parsed.map(q => ({
          ...q, category: 'aptitude', subcategory, difficulty
        })));
        setSessionId(sid);
        setQuestions(saved);
        setCurrentIdx(0);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setTimer(0);
        setQuizDone(false);
        toast('Questions generated!', 'success');
      } else {
        setGenerateError('The AI response was incomplete. Try again to generate the questions.');
      }
    } catch (err) {
      console.error(err);
      setGenerateError('The AI service did not respond. This is usually temporary.');
    }
    setGenerating(false);
  };

  const handleAnswer = async (answer) => {
    if (selectedAnswer !== null) return;
    clearInterval(timerRef.current);
    setSelectedAnswer(answer);
    setShowExplanation(true);

    const q = questions[currentIdx];
    const isCorrect = answer === q.correct_answer;
    await updatePlacementQuestion(q.id, { user_answer: answer, is_correct: isCorrect, time_taken: timer });
    setQuestions(prev => prev.map((qq, i) => i === currentIdx ? { ...qq, user_answer: answer, is_correct: isCorrect } : qq));
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setTimer(0);
    } else {
      setQuizDone(true);
    }
  };

  const correctCount = questions.filter(q => q.is_correct).length;
  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const scopeLabel = {
    learned: 'Learned topics',
    weak: 'Weak areas',
    all: 'All topics',
  };
  const testScopeScopeLabel = () => scopeLabel[testScope] || 'All topics';

  return (
    <div className="practice-page">
      <button className="btn btn-ghost back-btn" onClick={() => navigate('/placement')}>
        <ArrowLeft size={18} /> Back to Placement Prep
      </button>

      <h1 className="page-title">Aptitude Practice</h1>

      <div className="controls-section">
        <div className="control-pill">
          <label className="pill-label">Topic</label>
          <select className="modern-select" value={subcategory} onChange={e => setSubcategory(e.target.value)}>
            <option>Quantitative Aptitude</option>
            <option>Logical Reasoning</option>
            <option>Verbal Ability</option>
          </select>
        </div>
        <div className="control-pill">
          <label className="pill-label">Difficulty</label>
          <select className="modern-select" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>
      </div>

      <div className="question-count-section">
        <label className="count-label">Questions</label>
        <div className="count-options">
          {[5, 10, 15, 20].map((count) => (
            <button
              key={count}
              className={`count-option ${questionCount === count ? 'active' : ''}`}
              onClick={() => setQuestionCount(count)}
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      <div className="test-scope-selector">
        <label className="scope-option">
          <input
            type="radio"
            name="scope"
            value="learned"
            checked={testScope === 'learned'}
            onChange={(e) => setTestScope(e.target.value)}
          />
          <div className="scope-card">
            <BookOpen size={20} />
            <div>
              <strong>Learned Topics Only</strong>
              <span>Test yourself on {learnedTopicsCount} topics you've studied</span>
            </div>
          </div>
        </label>

        <label className="scope-option">
          <input
            type="radio"
            name="scope"
            value="weak"
            checked={testScope === 'weak'}
            onChange={(e) => setTestScope(e.target.value)}
          />
          <div className="scope-card">
            <Target size={20} />
            <div>
              <strong>Weak Areas</strong>
              <span>Focus on {weakTopicsCount} topics you struggled with</span>
            </div>
          </div>
        </label>

        <label className="scope-option">
          <input
            type="radio"
            name="scope"
            value="all"
            checked={testScope === 'all'}
            onChange={(e) => setTestScope(e.target.value)}
          />
          <div className="scope-card">
            <Sparkles size={20} />
            <div>
              <strong>Full Test</strong>
              <span>All topics mixed together</span>
            </div>
          </div>
        </label>
      </div>

      <div className="generate-action">
        <button className="btn-generate" onClick={generateQuestions} disabled={generating}>
          {generating ? (
            <><Loader size={20} className="spin-icon" /> Generating...</>
          ) : (
            <><RefreshCw size={20} /> Generate {questionCount} Questions</>
          )}
        </button>
        <span className="generate-hint">{questionCount} questions • {testScopeScopeLabel()}</span>
      </div>

      {generateError && !generating && (
        <GenerationError
          title="Couldn't generate questions"
          message={generateError}
          onRetry={generateQuestions}
          retrying={generating}
          className="placement-generate-error"
        />
      )}

      {questions.length > 0 && !quizDone && (
        <div className="quiz-container">
          <div className="glass-card quiz-card">
            <div className="quiz-progress">

              <span>Question {currentIdx + 1} of {questions.length}</span>
              <div className="quiz-timer"><Clock size={14} /> {formatTime(timer)}</div>
              <span className="badge badge-accent">{difficulty}</span>
            </div>

            <div className="quiz-question">{questions[currentIdx].question}</div>

            <div className="quiz-options">
              {(questions[currentIdx].options || []).map((opt, i) => {
                const letter = String.fromCharCode(65 + i);
                let cls = 'quiz-option';
                if (selectedAnswer !== null) {
                  if (letter === questions[currentIdx].correct_answer) cls += ' correct';
                  else if (letter === selectedAnswer) cls += ' wrong';
                } else if (selectedAnswer === letter) {
                  cls += ' selected';
                }
                return (
                  <button key={i} className={cls} onClick={() => handleAnswer(letter)}>
                    {opt}
                  </button>
                );
              })}
            </div>

            {showExplanation && (
              <div className="quiz-explanation">
                <strong>{selectedAnswer === questions[currentIdx].correct_answer ? '✅ Correct!' : `❌ Wrong! Answer: ${questions[currentIdx].correct_answer}`}</strong>
                <br /><br />
                {questions[currentIdx].explanation}
              </div>
            )}

            <div className="quiz-nav">
              <div></div>
              {showExplanation && (
                <button className="btn btn-primary" onClick={nextQuestion}>
                  {currentIdx < questions.length - 1 ? 'Next Question →' : 'See Results'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {quizDone && (
        <div className="quiz-container">
          <div className="glass-card quiz-results">
            <h2>Quiz Complete!</h2>
            <div className="score-display">{correctCount}/{questions.length}</div>
            <p style={{ marginBottom: '24px' }}>
              {correctCount === questions.length ? '🎉 Perfect Score!' : correctCount >= questions.length / 2 ? '👍 Good job! Keep practicing.' : '💪 Keep going, practice makes perfect!'}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={generateQuestions}>Generate More Questions</button>
              <button className="btn btn-secondary" onClick={() => navigate('/placement')}>Back to Prep</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
