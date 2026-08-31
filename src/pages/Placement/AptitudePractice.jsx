import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudentProfile, createPlacementSession, savePlacementQuestions, updatePlacementQuestion } from '../../data/repository';
import { generateAptitudeQuestionsPrompt, extractJson, callOpenRouter } from '../../core/api/aiService';
import { useToast } from '../../components/ToastProvider/ToastProvider';
import { ArrowLeft, Clock, Loader, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
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
  const [learnedTopicsCount, setLearnedTopicsCount] = useState(0);
  const [weakTopicsCount, setWeakTopicsCount] = useState(0);

  // Keep a ref of current state for cleanup
  const stateRef = useRef({});
  useEffect(() => {
    stateRef.current = { subcategory, difficulty, questions, currentIdx, selectedAnswer, showExplanation, timer, quizDone, sessionId, testScope };
  }, [subcategory, difficulty, questions, currentIdx, selectedAnswer, showExplanation, timer, quizDone, sessionId, testScope]);

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
    try {
      const messages = generateAptitudeQuestionsPrompt(subcategory, difficulty, 5);
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
        toast('Failed to generate questions. Try again.', 'error');
      }
    } catch (err) {
      console.error(err);
      toast('Error: ' + err.message, 'error');
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

  return (
    <div className="practice-page">
      <button className="btn btn-ghost back-btn" onClick={() => navigate('/placement')}>
        <ArrowLeft size={18} /> Back to Placement Prep
      </button>

      <h1 className="page-title">Aptitude Practice</h1>

      <div className="controls-section">
        <select className="modern-select" value={subcategory} onChange={e => setSubcategory(e.target.value)}>
          <option>Quantitative Aptitude</option>
          <option>Logical Reasoning</option>
          <option>Verbal Ability</option>
        </select>
        <select className="modern-select" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
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
            <div className="scope-text">
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
            <div className="scope-text">
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
            <div className="scope-text">
              <strong>Full Test</strong>
              <span>All topics mixed together</span>
            </div>
          </div>
        </label>
      </div>

      <div className="generate-action">
        <button className="btn-generate" onClick={generateQuestions} disabled={generating}>
          {generating ? <><Loader size={20} className="spin-icon" /> Generating...</> : <><RefreshCw size={20} /> Generate 5 Questions</>}
        </button>
      </div>

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
