import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Play, Clock, FileQuestion, BookOpen, AlertCircle } from 'lucide-react';
import * as repository from '../../data/repository';
import './MockExam.css';

const MockExamSetup = () => {
  const { bankId } = useParams();
  const navigate = useNavigate();
  const [bank, setBank] = useState(null);
  const [availableQuestions, setAvailableQuestions] = useState(0);
  const [loading, setLoading] = useState(true);

  // Form State
  const [duration, setDuration] = useState(60); // minutes
  const [questionCount, setQuestionCount] = useState(10);
  const [includeVariants, setIncludeVariants] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const banks = await repository.getAllQuestionBanks();
        const currentBank = banks.find(b => b.id === parseInt(bankId));
        setBank(currentBank);
        if (currentBank) {
          const questions = await repository.getQuestionsForBank(currentBank.id);
          setAvailableQuestions(questions.length);
          setQuestionCount(Math.min(10, questions.length));
        }
      } catch (error) {
        console.error("Failed to load bank data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [bankId]);

  const handleStart = () => {
    navigate(`/mock-exam/session/${bankId}`, {
      state: {
        duration,
        questionCount,
        includeVariants
      }
    });
  };

  if (loading) {
    return <div className="mock-exam-loading">Loading configuration...</div>;
  }

  if (!bank) {
    return (
      <div className="mock-exam-error">
        <AlertCircle size={48} />
        <h2>Question Bank Not Found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/')}>Return Home</button>
      </div>
    );
  }

  if (availableQuestions === 0) {
    return (
      <div className="mock-exam-empty">
        <FileQuestion size={48} />
        <h2>No Questions Available</h2>
        <p>This question bank doesn't have any questions yet. Add some questions before starting a mock exam.</p>
        <button className="btn btn-primary" onClick={() => navigate(`/question-bank/${bankId}`)}>
          Go to Question Bank
        </button>
      </div>
    );
  }

  return (
    <div className="mock-exam-setup-container">
      <div className="mock-exam-setup-card">
        <div className="setup-header">
          <BookOpen className="setup-icon" size={32} />
          <h1>Configure Mock Exam</h1>
          <p className="setup-subtitle">{bank.title}</p>
        </div>

        <div className="setup-form">
          <div className="form-group">
            <label>
              <Clock size={18} /> Exam Duration
            </label>
            <div className="duration-options">
              {[15, 30, 60, 90, 120].map(time => (
                <button
                  key={time}
                  type="button"
                  className={`duration-btn ${duration === time ? 'active' : ''}`}
                  onClick={() => setDuration(time)}
                >
                  {time} min
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>
              <FileQuestion size={18} /> Number of Questions
            </label>
            <div className="range-slider-container">
              <input
                type="range"
                min="1"
                max={availableQuestions}
                value={questionCount}
                onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                className="question-slider"
              />
              <span className="slider-value">{questionCount} / {availableQuestions}</span>
            </div>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={includeVariants}
                onChange={(e) => setIncludeVariants(e.target.checked)}
              />
              <span>Include AI Generated Variants</span>
            </label>
            <small className="help-text">Mixes in dynamically generated variations of questions to prevent memorization.</small>
          </div>

          <div className="setup-actions">
            <button className="btn btn-outline" onClick={() => navigate(`/question-bank/${bankId}`)}>
              Cancel
            </button>
            <button className="btn btn-primary btn-large" onClick={handleStart}>
              <Play size={20} /> Start Exam Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockExamSetup;
