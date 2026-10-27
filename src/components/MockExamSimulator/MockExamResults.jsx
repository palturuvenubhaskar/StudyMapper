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

  const analyzeResults = useCallback(async () => {
    const state = location.state;
    if (!state || !state.questions || !state.answers) {
      setError('Missing exam data to analyze.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { questions, answers } = state;
      const result = await analyzeMockExamPerformance(questions, answers);
      setAnalysis(result);
      
      // Save the AI analysis back to the mock exam record
      if (examId) {
        await repository.db.mock_exams.update(parseInt(examId), {
          ai_analysis: result
        });
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

  const questions = location.state?.questions || [];
  const answers = location.state?.answers || {};

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
              onRetry={location.state?.questions ? analyzeResults : undefined}
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
