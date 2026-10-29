import MarkdownRenderer from '../../../components/MarkdownRenderer/MarkdownRenderer';
import { GeneratingDots } from '../../../components/GeneratingState/GeneratingState';
import GenerationError from '../../../components/GenerationError/GenerationError';
import remarkGfm from 'remark-gfm';
import { ChevronDown, ChevronRight, Sparkles, Zap, Clock, Database, FileText } from 'lucide-react';
import { useState, useMemo } from 'react';
import { HintsSection } from './HintsSection';

/* ── Skeleton shimmer bar ────────────────────────────────── */
function SkeletonLine({ width = '100%', height = '14px', style }) {
  return (
    <div
      className="skeleton-shimmer"
      style={{
        height,
        borderRadius: '6px',
        marginBottom: '10px',
        width,
        ...style,
      }}
    />
  );
}

function SkeletonBlock({ lines = 3 }) {
  const widths = ['92%', '100%', '88%', '95%', '60%'];
  return (
    <div>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine key={i} width={widths[i % widths.length]} />
      ))}
    </div>
  );
}

/* ── Section wrapper: shows content OR skeleton OR nothing ─ */
function Section({ title, hasContent, isGenerating, children, skeletonLines = 3 }) {
  return (
    <div className="practice-section">
      <div className="practice-section-head">
        <h3 className="practice-section-title">{title}</h3>
      </div>

      {hasContent ? (
        <div className="practice-section-content">{children}</div>
      ) : isGenerating ? (
        <SkeletonBlock lines={skeletonLines} />
      ) : null}
    </div>
  );
}

/* ── Main ProblemPanel ────────────────────────────────────── */
export default function ProblemPanel({ problem, isGenerating = false, generationError = null, onRetry }) {
  const [expandedExamples, setExpandedExamples] = useState(new Set([0]));

  const toggleExample = (idx) => {
    setExpandedExamples(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const has = (field) => {
    const val = problem[field];
    if (Array.isArray(val)) return val.length > 0;
    return val && String(val).trim().length > 0;
  };

  /* Count completed sections for progress */
  // Use legacy fields or new json fields
  const sections = ['statement', 'constraints', 'examples', 'hints'];
  const sectionLabels = {
    statement: 'problem statement',
    constraints: 'constraints',
    examples: 'examples',
    hints: 'hints',
  };
  const isSectionDone = (s) =>
    has(s) ||
    (s === 'examples' && (has('examples_json') || has('sample_input'))) ||
    (s === 'hints' && has('hints_json'));

  const completedCount = sections.filter(isSectionDone).length;
  const pendingSection = sections.find(s => !isSectionDone(s));
  const progress = isGenerating ? (completedCount / sections.length) * 100 : 100;

  const difficultyClass = (problem.difficulty || 'easy').toLowerCase();

  // Handle both legacy string constraints and new array format
  let constraints = [];
  if (Array.isArray(problem.constraints)) {
    constraints = problem.constraints;
  } else if (typeof problem.constraints === 'string' && problem.constraints.trim().length > 0) {
    // Basic heuristic to split by newline if it looks like a list
    constraints = problem.constraints.split('\n').filter(s => s.trim().length > 0);
  }

  // Handle both legacy sample_input/output and new examples_json format
  const examples = useMemo(() => {
    if (problem.examples) return problem.examples;
    if (problem.examples_json) {
      try {
        return typeof problem.examples_json === 'string' ? JSON.parse(problem.examples_json) : problem.examples_json;
      } catch (e) {
        console.error(e);
        return [];
      }
    }
    if (problem.sample_input && String(problem.sample_input).trim().length > 0) {
      return [{
        input: problem.sample_input,
        output: problem.sample_output,
        explanation: problem.explanation
      }];
    }
    return [];
  }, [problem]);

  // Determine hints
  const hints = useMemo(() => {
    if (problem.hints_json) {
      try {
        return typeof problem.hints_json === 'string' ? JSON.parse(problem.hints_json) : problem.hints_json;
      } catch (e) { console.error(e); }
    }
    return problem.hints || [];
  }, [problem]);

  // Test cases for the table
  const testCases = useMemo(() => {
    if (problem.testCases) return problem.testCases;
    if (problem.test_cases_json) {
      try {
        return typeof problem.test_cases_json === 'string' ? JSON.parse(problem.test_cases_json) : problem.test_cases_json;
      } catch (e) { console.error(e); }
    }
    return problem.publicTestCases || [];
  }, [problem]);

  return (
    <section className="practice-pane practice-problem" aria-label="Problem details">
      {/* ─── Pane head: label + problem facts ─── */}
      <div className="practice-pane-head">
        <span className="practice-pane-title">
          <FileText size={15} /> Problem
        </span>
        <div className="practice-pane-meta">
          <span className={`practice-difficulty is-${difficultyClass}`}>
            {problem.difficulty || 'Easy'}
          </span>
          {problem.topic && (
            <span className="practice-chip">{problem.topic}</span>
          )}
          {problem.language && (
            <span className="practice-chip">{problem.language}</span>
          )}
        </div>
      </div>

      <div className="practice-problem-body">
        {/* ─── Generating banner ─── */}
        {isGenerating && (
          <div className="generating-banner" role="status" aria-live="polite">
            <div className="generating-banner-icon" aria-hidden="true">
              <Sparkles size={17} strokeWidth={2.2} />
            </div>

            <div className="generating-banner-content">
              <div className="generating-banner-head">
                <span className="generating-banner-title">Generating problem</span>
                <GeneratingDots size="sm" />
                <span className="generating-banner-count">
                  {completedCount}<span className="generating-banner-count-total">/{sections.length}</span>
                </span>
              </div>

              <div
                className="generating-progress-track"
                role="progressbar"
                aria-label="Problem generation progress"
                aria-valuemin={0}
                aria-valuemax={sections.length}
                aria-valuenow={completedCount}
              >
                <div className="generating-progress-fill" style={{ width: `${progress}%` }} />
              </div>

              <div className="generating-banner-status">
                {pendingSection
                  ? `Writing ${sectionLabels[pendingSection]}…`
                  : 'Finishing up…'}
              </div>
            </div>
          </div>
        )}

        {/* ─── Generation failed ─── */}
        {generationError && !isGenerating && (
          <GenerationError
            title="Couldn't generate this problem"
            message={generationError}
            onRetry={onRetry}
            className="problem-generation-error"
          />
        )}

        {/* ─── Problem Statement ─── */}
        <Section title="Problem statement" hasContent={has('statement') || has('description')} isGenerating={isGenerating} skeletonLines={5}>
          <div className="problem-description markdown-body">
            <MarkdownRenderer remarkPlugins={[remarkGfm]}>{problem.statement || problem.description}</MarkdownRenderer>
          </div>
        </Section>

        {/* ─── Examples ─── */}
        <Section title="Examples" hasContent={examples.length > 0} isGenerating={isGenerating} skeletonLines={4}>
          {examples.map((ex, idx) => (
            <div key={idx} className="example-card">
              <button
                type="button"
                className="example-toggle"
                onClick={() => toggleExample(idx)}
                aria-expanded={expandedExamples.has(idx)}
              >
                {expandedExamples.has(idx) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                <span>Example {idx + 1}</span>
              </button>

              {expandedExamples.has(idx) && (
                <div className="example-content">
                  <div className="io-box">
                    <label>Input</label>
                    <pre>{ex.input}</pre>
                  </div>
                  <div className="io-box">
                    <label>Output</label>
                    <pre>{ex.output || ex.expected_output}</pre>
                  </div>
                  {ex.explanation && (
                    <div className="example-explanation">
                      <strong>Explanation:</strong> {ex.explanation}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </Section>

        {/* ─── Constraints ─── */}
        <Section title="Constraints" hasContent={constraints.length > 0} isGenerating={isGenerating} skeletonLines={2}>
          {constraints.length > 0 && Array.isArray(constraints) && constraints[0].trim().startsWith('-') ? (
            <div className="problem-description markdown-body">
              <MarkdownRenderer remarkPlugins={[remarkGfm]}>{typeof problem.constraints === 'string' ? problem.constraints : constraints.join('\n')}</MarkdownRenderer>
            </div>
          ) : (
            <ul className="constraints-list">
              {constraints.map((c, i) => {
                const text = c.replace(/^[-*•]\s*/, '');
                return <li key={i}>{text}</li>;
              })}
            </ul>
          )}
        </Section>

        {/* ─── Test Cases Preview ─── */}
        {testCases && testCases.length > 0 && (
          <div className="practice-section">
            <div className="practice-section-head">
              <Zap size={14} />
              <h3 className="practice-section-title">Test cases</h3>
            </div>
            <div className="test-cases-wrap">
              <table className="test-cases-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Input</th>
                    <th>Expected output</th>
                  </tr>
                </thead>
                <tbody>
                  {testCases.filter(t => !t.isHidden && !t.is_hidden).map((tc, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td><code>{JSON.stringify(tc.input)}</code></td>
                      <td><code className="expected">{JSON.stringify(tc.expectedOutput || tc.expected_output || tc.expected)}</code></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── Hints ─── */}
        {(hints.length > 0 || isGenerating) && (
          <div className="practice-hints">
            {hints.length === 0 && isGenerating ? (
              <Section title="Hints" hasContent={false} isGenerating={true} skeletonLines={2} />
            ) : (
              <HintsSection hints={hints} problemId={problem.id} />
            )}
          </div>
        )}

        {/* ─── Limits Footer ─── */}
        <div className="problem-limits">
          <span><Clock size={13} /> {problem.timeLimit || problem.time_limit_ms || 2000} ms</span>
          <span><Database size={13} /> {problem.memoryLimit || problem.memory_limit_mb || 256} MB</span>
        </div>
      </div>
    </section>
  );
}
