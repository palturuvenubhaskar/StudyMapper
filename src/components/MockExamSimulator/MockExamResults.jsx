import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { analyzeMockExamPerformance } from '../../core/api/aiService';
import MarkdownRenderer from '../MarkdownRenderer/MarkdownRenderer';
import GeneratingState from '../GeneratingState/GeneratingState';
import GenerationError from '../GenerationError/GenerationError';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import * as repository from '../../data/repository';
import './MockExam.css';

const MockExamResults = () => {
  const { examId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paper, setPaper] = useState(() => {
    const state = location.state;
    return state && state.questions && state.answers
      ? { questions: state.questions, answers: state.answers }
      : null;
  });

  const analyzeResults = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Results are passed through router state for the normal flow, but a
    // refresh (or reopening from history) has no state — rebuild from IndexedDB.
    let questions = location.state?.questions;
    let answers = location.state?.answers;
    let savedAnalysis = '';

    if (!questions || !answers) {
      const examIdNum = Number(examId);
      const record = Number.isFinite(examIdNum)
        ? await repository.db.mock_exams.get(examIdNum)
        : null;

      if (!record) {
        setError('Missing exam data to analyze.');
        setLoading(false);
        return;
      }

      try {
        questions = record.questions_json ? JSON.parse(record.questions_json) : [];
        answers = record.answers_json ? JSON.parse(record.answers_json) : {};
      } catch {
        questions = [];
        answers = {};
      }
      savedAnalysis = record.ai_analysis || '';
    }

    if (!questions || questions.length === 0) {
      setError('Missing exam data to analyze.');
      setLoading(false);
      return;
    }

    setPaper({ questions, answers: answers || {} });

    if (savedAnalysis) {
      setAnalysis(savedAnalysis);
      setLoading(false);
      return;
    }

    try {
      const result = await analyzeMockExamPerformance(questions, answers || {});
      setAnalysis(result);
      
      // Save the AI analysis back to the mock exam record
      if (examId) {
        await repository.db.mock_exams.update(Number(examId), {
          ai_analysis: result
        }).catch(() => {});
      }
    } catch (err) {
      console.error("Analysis failed", err);
      setError('The AI service did not respond. This is usually temporary.');
    } finally {
      setLoading(false);
    }
  }, [examId, location.state]);

  useEffect(() => {
    analyzeResults();
  }, [analyzeResults]);

  const questions = paper?.questions || [];
  const answers = paper?.answers || {};

  return (
    <div className="mock-exam-results-container">
      <div className="results-header">
        <button className="btn btn-outline" onClick={() => navigate('/')}>
          <ArrowLeft size={18} /> Back to Dashboard
        </button>
        <h1>Mock Exam Results</h1>
      </div>

      <div className="results-grid">
        {/* Left Column: AI Analysis */}
        <div className="results-analysis">
          <h2><CheckCircle size={24} className="icon-success" /> Performance Analysis</h2>
          {loading ? (
            <div className="analysis-loading">
              <GeneratingState
                label="Grading your exam"
                hint="Reviewing each answer and spotting patterns."
              />
            </div>
          ) : error ? (
            <GenerationError
              title="Couldn't analyze this exam"
              message={error}
              onRetry={analyzeResults}
              retrying={loading}
            />
          ) : (
            <div className="analysis-content">
              <MarkdownRenderer content={analysis} />
            </div>
          )}
        </div>

        {/* Right Column: Submitted Answers Review */}
        <div className="results-review">
          <h2>Submitted Answers</h2>
          <div className="review-list">
            {questions.map((q, i) => (
              <div key={q.id} className="review-item">
                <div className="review-question">
                  <strong>Q{i + 1}:</strong> {q.text} <span className="marks-badge">({q.marks} Marks)</span>
                </div>
                <div className="review-answer">
                  <strong>Your Answer:</strong>
                  <p>{answers[q.id] || <span className="no-answer">Not Answered</span>}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockExamResults;
