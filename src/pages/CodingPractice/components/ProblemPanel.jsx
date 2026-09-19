import MarkdownRenderer from '../../../components/MarkdownRenderer/MarkdownRenderer';
import remarkGfm from 'remark-gfm';
import { ChevronDown, ChevronRight, Loader, Sparkles, Zap, CheckCircle2, Clock, Database, Lightbulb, FileText } from 'lucide-react';
import { useState } from 'react';
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
function Section({ title, hasContent, isGenerating, children, skeletonLines = 3, className = "problem-section" }) {
  const done = hasContent && !isGenerating;
  return (
    <div className={className} style={{ position: 'relative' }}>
      <div className="section-header" style={{ justifyContent: 'flex-start' }}>
        <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
          {title}
        </h3>
      </div>

      {hasContent ? (
        <div style={{ animation: 'fadeSlideIn 0.4s ease' }}>{children}</div>
      ) : isGenerating ? (
        <SkeletonBlock lines={skeletonLines} />
      ) : null}
    </div>
  );
}

/* ── Main ProblemPanel ────────────────────────────────────── */
export default function ProblemPanel({ problem, isGenerating = false }) {
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
  const completedCount = sections.filter(s => has(s) || (s === 'examples' && (has('examples_json') || has('sample_input'))) || (s === 'hints' && has('hints_json'))).length;
  const progress = isGenerating ? (completedCount / sections.length) * 100 : 100;

  const difficultyColors = {
    Easy: { bg: 'var(--success-soft)', text: 'var(--success)', border: 'var(--success-soft)' },
    Medium: { bg: 'var(--warning-soft)', text: 'var(--warning)', border: 'var(--warning-soft)' },
    Hard: { bg: 'var(--danger-soft)', text: 'var(--danger)', border: 'var(--danger-soft)' },
  };

  const dc = difficultyColors[problem.difficulty] || difficultyColors.Easy;

  // Handle both legacy string constraints and new array format
  let constraints = [];
  if (Array.isArray(problem.constraints)) {
    constraints = problem.constraints;
  } else if (typeof problem.constraints === 'string' && problem.constraints.trim().length > 0) {
    // Basic heuristic to split by newline if it looks like a list
    constraints = problem.constraints.split('\n').filter(s => s.trim().length > 0);
  }

  // Handle both legacy sample_input/output and new examples_json format
  let examples = [];
  if (problem.examples) {
    examples = problem.examples;
  } else if (problem.examples_json) {
    try {
      examples = typeof problem.examples_json === 'string' ? JSON.parse(problem.examples_json) : problem.examples_json;
    } catch (e) {
      console.error(e);
    }
  } else if (has('sample_input')) {
    examples = [{
      input: problem.sample_input,
      output: problem.sample_output,
      explanation: problem.explanation
    }];
  }

  // Determine hints
  let hints = [];
  if (problem.hints_json) {
    try {
      hints = typeof problem.hints_json === 'string' ? JSON.parse(problem.hints_json) : problem.hints_json;
    } catch (e) { console.error(e); }
  } else if (problem.hints) {
    hints = problem.hints;
  }

  // Test cases for the table
  let testCases = [];
  if (problem.testCases) {
    testCases = problem.testCases;
  } else if (problem.test_cases_json) {
    try {
      testCases = typeof problem.test_cases_json === 'string' ? JSON.parse(problem.test_cases_json) : problem.test_cases_json;
    } catch (e) { console.error(e); }
  } else if (problem.publicTestCases) {
    testCases = problem.publicTestCases;
  }

  return (
    <div className="problem-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', padding: 0 }}>
      {/* ─── Top Tabs (Description / Submissions) ─── */}
      <div style={{ display: 'flex', gap: '24px', padding: '16px 24px', borderBottom: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>
          <FileText size={16} color="var(--accent-brand)" /> Description
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.875rem', cursor: 'pointer' }}>
          <Clock size={16} /> Submissions
        </div>
      </div>

      <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
        {/* ─── Generating banner ─── */}
        {isGenerating && (
          <div className="generating-banner">
            <div className="generating-banner-icon">
              <Sparkles size={18} color="#fff" className="spin-icon" />
            </div>
            <div className="generating-banner-content">
              <div className="generating-banner-title">
                Generating Problem
                <span className="generating-dots"><span>.</span><span>.</span><span>.</span></span>
              </div>
              <div className="generating-progress-track">
                <div className="generating-progress-fill" style={{ width: `${progress}%` }} />
                <div className="generating-progress-shimmer" />
              </div>
              <div className="generating-banner-status">
                {completedCount} of {sections.length} sections ready
              </div>
            </div>
          </div>
        )}

        {/* ─── Problem Header ─── */}
        <div className="problem-header">
          <h1>{problem.title}</h1>
        <div className="problem-meta">
          <span 
            className="difficulty-pill"
            style={{ background: dc.bg, color: dc.text, border: `1px solid ${dc.border}` }}
          >
            {problem.difficulty}
          </span>
          <span className="topic-tag">{problem.topic}</span>
          {problem.language && (
            <span className="lang-tag">{problem.language}</span>
          )}
        </div>
      </div>

      {/* ─── Problem Statement ─── */}
      <Section title="Problem Statement" icon={Zap} hasContent={has('statement') || has('description')} isGenerating={isGenerating} skeletonLines={5}>
        <div className="problem-description markdown-body">
          <MarkdownRenderer remarkPlugins={[remarkGfm]}>{problem.statement || problem.description}</MarkdownRenderer>
        </div>
      </Section>

      {/* ─── Examples ─── */}
      <Section title="Examples" icon={Zap} hasContent={examples.length > 0} isGenerating={isGenerating} skeletonLines={4}>
        {examples.map((ex, idx) => (
          <div key={idx} className="example-card">
            <button 
              className="example-toggle"
              onClick={() => toggleExample(idx)}
            >
              {expandedExamples.has(idx) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <span>Example {idx + 1}:</span>
            </button>

            {expandedExamples.has(idx) && (
              <div className="example-content">
                <div className="io-box">
                  <label>Input:</label>
                  <pre>{ex.input}</pre>
                </div>
                <div className="io-box">
                  <label>Output:</label>
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
      <Section title="Constraints" icon={Zap} hasContent={constraints.length > 0} isGenerating={isGenerating} skeletonLines={2}>
        {constraints.length > 0 && Array.isArray(constraints) && constraints[0].trim().startsWith('-') ? (
          <div className="problem-description markdown-body">
            <MarkdownRenderer remarkPlugins={[remarkGfm]}>{typeof problem.constraints === 'string' ? problem.constraints : constraints.join('\n')}</MarkdownRenderer>
          </div>
        ) : (
          <ul className="constraints-list">
            {constraints.map((c, i) => {
              const text = c.replace(/^[-\*•]\s*/, '');
              return <li key={i}>{text}</li>;
            })}
          </ul>
        )}
      </Section>

      {/* ─── Test Cases Preview ─── */}
      {testCases && testCases.length > 0 && (
        <div className="problem-section">
          <div className="section-header">
            <Zap size={16} />
            <span>Test Cases</span>
          </div>
          <table className="test-cases-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Input</th>
                <th>Expected Output</th>
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
      )}

      {/* ─── Hints ─── */}
      {(hints.length > 0 || isGenerating) && (
        <div style={{ position: 'relative' }}>
          {hints.length === 0 && isGenerating ? (
            <Section title="Hints" icon={Lightbulb} hasContent={false} isGenerating={true} skeletonLines={2} />
          ) : (
            <HintsSection hints={hints} problemId={problem.id} />
          )}
        </div>
      )}

      {/* ─── Limits Footer ─── */}
      <div className="problem-limits">
        <span><Clock size={14} /> {problem.timeLimit || problem.time_limit_ms || 2000}ms</span>
        <span><Database size={14} /> {problem.memoryLimit || problem.memory_limit_mb || 256}MB</span>
      </div>
      </div>
    </div>
  );
}
