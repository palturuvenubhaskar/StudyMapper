import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Clock, ChevronLeft, ChevronRight, CheckCircle, AlertTriangle } from 'lucide-react';
import * as repository from '../../data/repository';
import { generateQuestionVariant } from '../../core/api/aiService';
import './MockExam.css';

const MockExamSession = () => {
  const { bankId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState(new Set());
  
  const [timeLeft, setTimeLeft] = useState(location.state?.duration * 60 || 3600);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const timerRef = useRef(null);

  useEffect(() => {
    const initializeExam = async () => {
      try {
        const config = location.state;
        if (!config) {
          navigate(`/mock-exam/setup/${bankId}`);
          return;
        }

        let allQuestions = await repository.getQuestionsForBank(parseInt(bankId));
        // Shuffle questions
        allQuestions.sort(() => 0.5 - Math.random());
        
        let selectedQuestions = allQuestions.slice(0, config.questionCount);

        if (config.includeVariants) {
          // Replace some questions with AI variants
          selectedQuestions = await Promise.all(selectedQuestions.map(async (q, index) => {
            if (index % 2 === 0) { // Replace every other question
              try {
                const variant = await generateQuestionVariant(q.text, q.marks);
                if (variant) {
                  return { ...q, id: `v_${q.id}`, text: variant.text, original_id: q.id, isVariant: true };
                }
              } catch (e) {
                console.error("Variant generation failed for", q.id);
              }
            }
            return q;
          }));
        }

        setQuestions(selectedQuestions);
        setLoading(false);
        
        // Start timer
        timerRef.current = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              handleSubmit(selectedQuestions, answers); // Auto-submit when time is up
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

      } catch (error) {
        console.error("Error initializing exam:", error);
      }
    };

    initializeExam();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line
  }, [bankId, location.state, navigate]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (text) => {
    setAnswers(prev => ({ ...prev, [questions[currentIndex].id]: text }));
  };

  const toggleMarkForReview = () => {
    setMarkedForReview(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentIndex)) {
        newSet.delete(currentIndex);
      } else {
        newSet.add(currentIndex);
      }
      return newSet;
    });
  };

  const handleSubmit = async (currentQuestions = questions, currentAnswers = answers) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSubmitting(true);
    
    // Save variants to DB if any
    const variantQuestions = currentQuestions.filter(q => q.isVariant);
    for (const vq of variantQuestions) {
       await repository.db.question_variants.add({
         original_question_id: vq.original_id,
         text: vq.text,
         marks: vq.marks,
         created_at: new Date().toISOString()
       });
    }

    // Save Mock Exam Record
    const examRecord = {
      bank_id: parseInt(bankId),
      duration_minutes: location.state?.duration,
      total_questions: currentQuestions.length,
      created_at: new Date().toISOString()
    };
    
    const mockExamId = await repository.db.mock_exams.add(examRecord);

    navigate(`/mock-exam/results/${mockExamId}`, {
      state: { questions: currentQuestions, answers: currentAnswers }
    });
  };

  if (loading) {
    return (
      <div className="mock-exam-loading fullscreen">
        <div className="pulse-loader"></div>
        <p>Generating Exam Environment...</p>
        <small>Including AI variants if selected.</small>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="mock-exam-session">
      {/* Top Navigation Bar */}
      <div className="exam-header">
        <div className="exam-title">Mock Exam</div>
        <div className={`exam-timer ${timeLeft < 300 ? 'danger' : ''}`}>
          <Clock size={20} />
          <span>{formatTime(timeLeft)}</span>
        </div>
        <button 
          className="btn btn-primary finish-btn" 
          onClick={() => {
            if(window.confirm("Are you sure you want to submit your exam?")) {
              handleSubmit();
            }
          }}
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Finish Exam'}
        </button>
      </div>

      <div className="exam-body">
        {/* Main Question Area */}
        <div className="exam-content">
          <div className="question-header">
            <h2>Question {currentIndex + 1} of {questions.length}</h2>
            <span className="marks-badge">{currentQuestion.marks} Marks</span>
          </div>
          
          <div className="question-text">
            {currentQuestion.isVariant && <span className="variant-badge">AI Variant</span>}
            <p>{currentQuestion.text}</p>
          </div>

          <div className="answer-area">
            <textarea
              placeholder="Type your answer here..."
              value={answers[currentQuestion.id] || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
              className="answer-textarea"
            />
          </div>

          <div className="question-actions">
            <label className="mark-review-checkbox">
              <input
                type="checkbox"
                checked={markedForReview.has(currentIndex)}
                onChange={toggleMarkForReview}
              />
              Mark for review
            </label>
            
            <div className="nav-buttons">
              <button 
                className="btn btn-outline"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex(i => i - 1)}
              >
                <ChevronLeft size={20} /> Previous
              </button>
              <button 
                className="btn btn-primary"
                disabled={currentIndex === questions.length - 1}
                onClick={() => setCurrentIndex(i => i + 1)}
              >
                Next <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <div className="exam-sidebar">
          <h3>Question Navigator</h3>
          <div className="question-grid">
            {questions.map((q, index) => {
              const isAnswered = answers[q.id] && answers[q.id].trim().length > 0;
              const isMarked = markedForReview.has(index);
              const isActive = index === currentIndex;
              
              let className = 'grid-item';
              if (isActive) className += ' active';
              else if (isMarked) className += ' marked';
              else if (isAnswered) className += ' answered';
              
              return (
                <button
                  key={q.id}
                  className={className}
                  onClick={() => setCurrentIndex(index)}
                  title={isMarked ? 'Marked for Review' : isAnswered ? 'Answered' : 'Unanswered'}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
          
          <div className="legend">
            <div className="legend-item"><span className="dot answered"></span> Answered</div>
            <div className="legend-item"><span className="dot marked"></span> Marked for Review</div>
            <div className="legend-item"><span className="dot"></span> Unanswered</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockExamSession;
