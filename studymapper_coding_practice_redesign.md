# StudyMapper — Coding Practice UI Redesign Implementation

> **One-shot prompt for Antigravity / AI coding agents.**
> Implement a competitive programming-style coding interface with split-pane layout, problem description panel, code editor, test case runner, hints system, and submission results.

---

## Table of Contents

1. [Project Context](#1-project-context)
2. [Database Schema Updates](#2-database-schema-updates)
3. [File Structure](#3-file-structure)
4. [Shared Components](#4-shared-components)
5. [Coding Practice Page](#5-coding-practice-page)
6. [Left Panel — Problem Description](#6-left-panel--problem-description)
7. [Right Panel — Code Editor](#7-right-panel--code-editor)
8. [Test Case Runner Panel](#8-test-case-runner-panel)
9. [Submission Results Modal](#9-submission-results-modal)
10. [Hints System](#10-hints-system)
11. [Language Selector & Settings](#11-language-selector--settings)
12. [AI Integration (Ask AI)](#12-ai-integration-ask-ai)
13. [CSS Styling](#13-css-styling)
14. [App Integration](#14-app-integration)
15. [Implementation Order](#15-implementation-order)

---

## 1. Project Context

**StudyMapper** is an offline-first, AI-powered learning workspace.
- **Stack:** React 19 + Vite 8, Vanilla CSS, Lucide React icons, Dexie.js (IndexedDB), OpenRouter API (streaming AI)
- **Current Coding Practice:** Basic page with problem statement and simple code editor
- **Target Design:** Competitive programming platform style (like LeetCode, Edabit, HackerRank)
  - Split-pane layout (resizable or fixed 45/55)
  - Left: Problem description with examples, constraints, test cases, hints
  - Right: Monaco-like code editor (use CodeMirror 6 or simple textarea with line numbers), language selector, Run/Submit buttons, test case panel
  - Submission modal with real-time test case status

---

## 2. Database Schema Updates

Update `StudyMapperDB` to **Version 11** in `src/data/db.js`:

```javascript
db.version(11).stores({
  // ... existing tables ...

  // Coding Practice — Enhanced Schema
  coding_problems: 'id, profile_id, language, topic, difficulty, status, title, description, constraints, examples_json, test_cases_json, hints_json, starter_code_json, solution_code, time_limit_ms, memory_limit_mb, created_at',
  coding_submissions: 'id, problem_id, user_id, code, language, status, results_json, score, time_taken_ms, memory_used_kb, submitted_at',
  coding_hints_unlocked: 'id, problem_id, hint_index, points_deducted, unlocked_at',
});
```

**New Fields Explanation:**
- `examples_json`: Array of `{input, output, explanation}`
- `test_cases_json`: Array of `{input, expected_output, is_hidden}`
- `hints_json`: Array of `{text, penalty_points}`
- `starter_code_json`: Object keyed by language `{python: "...", cpp: "...", java: "..."}`
- `solution_code`: Reference solution for AI evaluation
- `time_limit_ms` / `memory_limit_mb`: Execution constraints
- `coding_submissions`: Stores all submission attempts with full results
- `coding_hints_unlocked`: Tracks which hints user has unlocked (with penalty)

---

## 3. File Structure

```
src/
├── pages/
│   └── CodingPractice/
│       ├── CodingPractice.jsx          # Main split-pane layout
│       ├── components/
│       │   ├── ProblemPanel.jsx        # Left panel — description, examples, constraints
│       │   ├── CodeEditorPanel.jsx     # Right panel — editor + toolbar
│       │   ├── TestCasePanel.jsx       # Bottom-right — test case tabs & I/O
│       │   ├── SubmissionModal.jsx     # Full-screen overlay for running tests
│       │   ├── HintsSection.jsx        # Expandable hints with penalty
│       │   ├── LanguageSelector.jsx    # Dropdown for language
│       │   └── EditorToolbar.jsx       # Run, Submit, Reset, Settings, Ask AI
│       └── hooks/
│           ├── useCodeEditor.js        # Editor state management
│           ├── useTestRunner.js        # Test execution logic
│           └── useSubmission.js        # Submission tracking
├── components/
│   └── CodeEditor/
│       ├── CodeEditor.jsx              # Wrapper for CodeMirror or custom textarea
│       └── LineNumbers.jsx             # Line number gutter
└── styles/
    └── coding-practice.css
```

---

## 4. Shared Components

### 4.1 Code Editor (Custom Textarea with Line Numbers)
**File:** `src/components/CodeEditor/CodeEditor.jsx`

Use a lightweight custom implementation (no heavy Monaco dependency). Use `react-simple-code-editor` if acceptable, otherwise build custom.

```jsx
import { useState, useRef, useEffect } from 'react';
import './CodeEditor.css';

export function CodeEditor({ value, onChange, language = 'python', readOnly = false }) {
  const textareaRef = useRef(null);
  const [lineCount, setLineCount] = useState(1);

  useEffect(() => {
    setLineCount(value.split("\n").length);
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newValue = value.substring(0, start) + '    ' + value.substring(end);
      onChange(newValue);
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 4;
      }, 0);
    }
  };

  return (
    <div className="code-editor-wrapper">
      <div className="line-numbers">
        {Array.from({ length: lineCount }, (_, i) => (
          <span key={i + 1}>{i + 1}</span>
        ))}
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        readOnly={readOnly}
        className="code-textarea"
      />
    </div>
  );
}
```

**File:** `src/components/CodeEditor/CodeEditor.css`

```css
.code-editor-wrapper {
  display: flex;
  flex: 1;
  background: #1e1e1e;
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.6;
  overflow: hidden;
}

.line-numbers {
  display: flex;
  flex-direction: column;
  padding: 16px 12px;
  background: #1e1e1e;
  color: #6e7681;
  text-align: right;
  user-select: none;
  border-right: 1px solid #30363d;
  min-width: 48px;
}

.line-numbers span {
  display: block;
  height: 22.4px;
  font-size: 13px;
}

.code-textarea {
  flex: 1;
  padding: 16px;
  background: #1e1e1e;
  color: #e6edf3;
  border: none;
  outline: none;
  resize: none;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  white-space: pre;
  overflow-wrap: normal;
  overflow-x: auto;
  tab-size: 4;
}

.code-textarea::selection {
  background: #264f78;
}
```

---

## 5. Coding Practice Page

### Main Layout Component
**File:** `src/pages/CodingPractice/CodingPractice.jsx`

```jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDocumentTitle } from '../../../hooks/useDocumentTitle';
import { db } from '../../../data/db';
import { ProblemPanel } from './components/ProblemPanel';
import { CodeEditorPanel } from './components/CodeEditorPanel';
import { TestCasePanel } from './components/TestCasePanel';
import { SubmissionModal } from './components/SubmissionModal';
import './CodingPractice.css';

const DEFAULT_PROBLEM = {
  id: 'strings-1',
  title: 'Strings Problem',
  difficulty: 'Easy',
  topic: 'Strings',
  description: `Write a function that takes a string and returns the reverse of it.

You need to handle edge cases like empty strings and single characters.`,
  constraints: [
    '1 <= len(s) <= 10^5',
    'String contains only lowercase English letters',
    'Expected time complexity: O(n)',
    'Expected space complexity: O(1) (excluding output)',
  ],
  examples: [
    {
      input: 'hello',
      output: 'olleh',
      explanation: 'The characters are reversed in order.',
    },
    {
      input: 'world',
      output: 'dlrow',
      explanation: 'Standard string reversal.',
    },
  ],
  testCases: [
    { input: 'hello', expectedOutput: 'olleh', isHidden: false },
    { input: 'a', expectedOutput: 'a', isHidden: false },
    { input: 'abcdef', expectedOutput: 'fedcba', isHidden: true },
    { input: '', expectedOutput: '', isHidden: true },
  ],
  hints: [
    { text: 'Think about iterating from the end of the string.', penalty: 2 },
    { text: 'You can use two pointers approach — one at start, one at end.', penalty: 3 },
    { text: 'Consider using built-in reverse methods if available in your language.', penalty: 5 },
  ],
  starterCode: {
    c: '#include <stdio.h>\n#include <string.h>\n\nchar* reverseString(char* s) {\n    // Complete the code\n    return s;\n}',
    cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nstring reverseString(string s) {\n    // Complete the code\n    return s;\n}',
    python: 'def reverse_string(s):\n    # Complete the code\n    pass',
    java: 'class Solution {\n    public String reverseString(String s) {\n        // Complete the code\n        return s;\n    }\n}',
    javascript: 'function reverseString(s) {\n    // Complete the code\n    return s;\n}',
  },
  timeLimit: 1000,
  memoryLimit: 256,
};

const LANGUAGES = [
  { id: 'c', name: 'C', ext: 'c' },
  { id: 'cpp', name: 'C++', ext: 'cpp' },
  { id: 'python', name: 'Python', ext: 'py' },
  { id: 'java', name: 'Java', ext: 'java' },
  { id: 'javascript', name: 'JavaScript', ext: 'js' },
];

export function CodingPractice() {
  const { problemId } = useParams();
  useDocumentTitle('Coding Practice');

  const [problem, setProblem] = useState(DEFAULT_PROBLEM);
  const [language, setLanguage] = useState('c');
  const [code, setCode] = useState('');
  const [activeTestCase, setActiveTestCase] = useState(0);
  const [testResults, setTestResults] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [editorHeight, setEditorHeight] = useState('60%');

  useEffect(() => {
    loadProblem();
  }, [problemId]);

  useEffect(() => {
    if (problem.starterCode) {
      setCode(problem.starterCode[language] || '');
    }
  }, [language, problem]);

  const loadProblem = async () => {
    if (!problemId) return;
    const stored = await db.coding_problems.get(problemId);
    if (stored) {
      setProblem({
        ...stored,
        examples: JSON.parse(stored.examples_json || '[]'),
        testCases: JSON.parse(stored.test_cases_json || '[]'),
        hints: JSON.parse(stored.hints_json || '[]'),
        starterCode: JSON.parse(stored.starter_code_json || '{}'),
      });
    }
  };

  const handleRun = async () => {
    setTestResults(null);
    // Run only visible test cases
    const visibleTests = problem.testCases.filter(t => !t.isHidden);
    await executeTests(visibleTests, false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setShowSubmissionModal(true);
    await executeTests(problem.testCases, true);
    setIsSubmitting(false);
  };

  const executeTests = async (tests, isSubmission) => {
    const results = [];

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];

      // Simulate execution delay
      await new Promise(r => setTimeout(r, 800 + Math.random() * 1200));

      // AI-based evaluation (since no backend)
      const result = await evaluateWithAI(code, language, test.input, test.expectedOutput, problem);

      results.push({
        ...test,
        actualOutput: result.actualOutput,
        status: result.passed ? 'passed' : 'failed',
        executionTime: result.executionTime || (100 + Math.floor(Math.random() * 400)),
        error: result.error,
      });

      // Update modal in real-time
      if (isSubmission) {
        setTestResults([...results]);
      }
    }

    if (!isSubmission) {
      setTestResults(results);
    }

    // Save submission
    const passedCount = results.filter(r => r.status === 'passed').length;
    await db.coding_submissions.add({
      problem_id: problem.id,
      code,
      language,
      status: passedCount === results.length ? 'accepted' : 'wrong_answer',
      results_json: JSON.stringify(results),
      score: Math.round((passedCount / results.length) * 100),
      submitted_at: new Date().toISOString(),
    });
  };

  const evaluateWithAI = async (userCode, lang, input, expected, prob) => {
    // In production: call OpenRouter with evaluation prompt
    // For now: simple string comparison fallback
    try {
      // Try to extract function output from code (very naive)
      const prompt = `Evaluate this ${lang} code for problem: "${prob.title}"\nInput: ${input}\nExpected: ${expected}\n\nCode:\n${userCode}\n\nReturn ONLY JSON: {\"passed\": boolean, "actualOutput\": string, "error\": string|null}`;

      // Placeholder: replace with actual callOpenRouterStream
      // For demo, do naive check
      const isTrivial = userCode.includes('return') && !userCode.includes('pass') && !userCode.includes('// Complete');

      return {
        passed: isTrivial && Math.random() > 0.3, // Simulate some failures
        actualOutput: isTrivial ? expected : 'undefined',
        error: isTrivial ? null : 'Function not implemented',
        executionTime: 150,
      };
    } catch (e) {
      return { passed: false, actualOutput: '', error: e.message, executionTime: 0 };
    }
  };

  return (
    <div className="coding-practice-page">
      {/* Split Pane Container */}
      <div className="split-pane">
        {/* Left Panel — Problem */}
        <div className="pane-left">
          <ProblemPanel problem={problem} />
        </div>

        {/* Right Panel — Editor + Tests */}
        <div className="pane-right">
          <CodeEditorPanel
            code={code}
            onChange={setCode}
            language={language}
            onLanguageChange={setLanguage}
            languages={LANGUAGES}
            onRun={handleRun}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />

          <TestCasePanel
            testCases={problem.testCases}
            testResults={testResults}
            activeTestCase={activeTestCase}
            onSelectTestCase={setActiveTestCase}
          />
        </div>
      </div>

      {/* Submission Modal */}
      {showSubmissionModal && (
        <SubmissionModal
          results={testResults}
          totalTests={problem.testCases.length}
          isRunning={isSubmitting}
          onClose={() => setShowSubmissionModal(false)}
        />
      )}
    </div>
  );
}
```

---

## 6. Left Panel — Problem Description

**File:** `src/pages/CodingPractice/components/ProblemPanel.jsx`

```jsx
import { useState } from 'react';
import { Zap, Clock, Database, ChevronDown, ChevronRight, Lightbulb } from 'lucide-react';
import { HintsSection } from './HintsSection';

export function ProblemPanel({ problem }) {
  const [expandedExamples, setExpandedExamples] = useState(new Set([0]));

  const toggleExample = (idx) => {
    setExpandedExamples(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const difficultyColors = {
    Easy: { bg: '#dcfce7', text: '#166534', border: '#bbf7d0' },
    Medium: { bg: '#fef9c3', text: '#854d0e', border: '#fde047' },
    Hard: { bg: '#fee2e2', text: '#991b1b', border: '#fecaca' },
  };

  const dc = difficultyColors[problem.difficulty] || difficultyColors.Easy;

  return (
    <div className="problem-panel">
      {/* Problem Header */}
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
          <span className="lang-tag">C</span>
        </div>
      </div>

      {/* Problem Description */}
      <div className="problem-section">
        <div className="section-header">
          <Zap size={16} />
          <span>Problem Statement</span>
        </div>
        <div className="problem-description">
          {problem.description.split('\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </div>

      {/* Examples */}
      <div className="problem-section">
        <div className="section-header">
          <Zap size={16} />
          <span>Examples</span>
        </div>
        {problem.examples.map((ex, idx) => (
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
                  <pre>{ex.output}</pre>
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
      </div>

      {/* Constraints */}
      <div className="problem-section">
        <div className="section-header">
          <Zap size={16} />
          <span>Constraints</span>
        </div>
        <ul className="constraints-list">
          {problem.constraints.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>

      {/* Test Cases Preview */}
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
            {problem.testCases.filter(t => !t.isHidden).map((tc, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td><code>{tc.input}</code></td>
                <td><code className="expected">{tc.expectedOutput}</code></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Hints */}
      <HintsSection hints={problem.hints} problemId={problem.id} />

      {/* Limits Footer */}
      <div className="problem-limits">
        <span><Clock size={14} /> {problem.timeLimit}ms</span>
        <span><Database size={14} /> {problem.memoryLimit}MB</span>
      </div>
    </div>
  );
}
```

---

## 7. Right Panel — Code Editor

**File:** `src/pages/CodingPractice/components/CodeEditorPanel.jsx`

```jsx
import { Play, RotateCcw, Settings, Sparkles, ChevronDown, Check, Loader2 } from 'lucide-react';
import { CodeEditor } from '../../../components/CodeEditor/CodeEditor';

export function CodeEditorPanel({
  code,
  onChange,
  language,
  onLanguageChange,
  languages,
  onRun,
  onSubmit,
  isSubmitting,
}) {
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const currentLang = languages.find(l => l.id === language);

  return (
    <div className="editor-panel">
      {/* Editor Toolbar */}
      <div className="editor-toolbar">
        <div className="toolbar-left">
          {/* Language Selector */}
          <div className="lang-selector">
            <button 
              className="lang-btn"
              onClick={() => setShowLangDropdown(!showLangDropdown)}
            >
              {currentLang?.name || 'C'}
              <ChevronDown size={14} />
            </button>

            {showLangDropdown && (
              <div className="lang-dropdown">
                {languages.map(lang => (
                  <button
                    key={lang.id}
                    className={`lang-option ${lang.id === language ? 'active' : ''}`}
                    onClick={() => {
                      onLanguageChange(lang.id);
                      setShowLangDropdown(false);
                    }}
                  >
                    {lang.id === language && <Check size={14} />}
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="toolbar-btn" title="Reset code">
            <RotateCcw size={16} />
          </button>

          <button className="toolbar-btn" title="Settings">
            <Settings size={16} />
          </button>
        </div>

        <div className="toolbar-right">
          <button className="toolbar-btn ask-ai" title="Ask AI for help">
            <Sparkles size={16} />
            Ask AI
          </button>

          <button 
            className="btn-run"
            onClick={onRun}
            disabled={isSubmitting}
          >
            <Play size={14} fill="currentColor" />
            Run Tests
          </button>

          <button 
            className="btn-submit"
            onClick={onSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <><Loader2 size={14} className="spin" /> Submitting...</>
            ) : (
              <><Check size={14} /> Submit</>
            )}
          </button>
        </div>
      </div>

      {/* Code Editor */}
      <div className="editor-container">
        <CodeEditor value={code} onChange={onChange} language={language} />
      </div>
    </div>
  );
}
```

---

## 8. Test Case Runner Panel

**File:** `src/pages/CodingPractice/components/TestCasePanel.jsx`

```jsx
import { CheckCircle, XCircle, Terminal } from 'lucide-react';

export function TestCasePanel({ testCases, testResults, activeTestCase, onSelectTestCase }) {
  const visibleTests = testCases.filter(t => !t.isHidden);
  const currentResult = testResults?.[activeTestCase];
  const currentTest = visibleTests[activeTestCase];

  return (
    <div className="test-case-panel">
      {/* Test Case Tabs */}
      <div className="test-case-tabs">
        <div className="tabs-header">
          <Terminal size={14} />
          <span>Testcase</span>
        </div>
        <div className="tabs-list">
          {visibleTests.map((tc, idx) => {
            const result = testResults?.[idx];
            return (
              <button
                key={idx}
                className={`test-tab ${activeTestCase === idx ? 'active' : ''} ${result?.status || ''}`}
                onClick={() => onSelectTestCase(idx)}
              >
                Case {idx + 1}
                {result?.status === 'passed' && <CheckCircle size={12} className="tab-status pass" />}
                {result?.status === 'failed' && <XCircle size={12} className="tab-status fail" />}
              </button>
            );
          })}
          <button className="test-tab add-tab">+</button>
        </div>
      </div>

      {/* Test Case Content */}
      <div className="test-case-content">
        {currentTest && (
          <>
            <div className="io-display">
              <div className="io-group">
                <label>input =</label>
                <pre className="io-value">{currentTest.input}</pre>
              </div>

              <div className="io-group">
                <label>Expected Output =</label>
                <pre className="io-value expected">{currentTest.expectedOutput}</pre>
              </div>

              {currentResult && (
                <>
                  <div className="io-group">
                    <label>Your Output =</label>
                    <pre className={`io-value ${currentResult.status === 'passed' ? 'pass' : 'fail'}`}>
                      {currentResult.actualOutput || '(no output)'}
                    </pre>
                  </div>

                  {currentResult.error && (
                    <div className="io-group error">
                      <label>Error:</label>
                      <pre className="io-value error-text">{currentResult.error}</pre>
                    </div>
                  )}
                </>
              )}
            </div>

            {currentResult && (
              <div className="test-case-footer">
                <span className={`result-badge ${currentResult.status}`}>
                  {currentResult.status === 'passed' ? 'Accepted' : 'Wrong Answer'}
                </span>
                <span className="execution-time">{currentResult.executionTime}ms</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
```

---

## 9. Submission Results Modal

**File:** `src/pages/CodingPractice/components/SubmissionModal.jsx`

```jsx
import { X, CheckCircle, XCircle, Loader2, Trophy, Clock } from 'lucide-react';

export function SubmissionModal({ results, totalTests, isRunning, onClose }) {
  const completedCount = results?.length || 0;
  const passedCount = results?.filter(r => r.status === 'passed').length || 0;
  const allPassed = passedCount === totalTests && completedCount === totalTests;

  return (
    <div className="submission-modal-overlay">
      <div className="submission-modal">
        {/* Header */}
        <div className="submission-header">
          <div>
            <h2>
              {isRunning ? (
                <><Loader2 size={20} className="spin" /> Submitting...</>
              ) : allPassed ? (
                <><Trophy size={20} className="success-icon" /> Accepted!</>
              ) : (
                <><XCircle size={20} className="fail-icon" /> {passedCount}/{totalTests} Passed</>
              )}
            </h2>
            {!isRunning && (
              <p>{allPassed ? 'All test cases passed successfully.' : 'Some test cases failed. Review and try again.'}</p>
            )}
            {isRunning && (
              <p>Running testcase {completedCount} of {totalTests}...</p>
            )}
          </div>
          <button onClick={onClose} className="modal-close-btn">
            <X size={18} />
          </button>
        </div>

        {/* Test Case Results Table */}
        <div className="submission-results">
          <table>
            <thead>
              <tr>
                <th>Testcase #</th>
                <th>Status</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: totalTests }, (_, i) => {
                const result = results?.[i];
                return (
                  <tr key={i} className={result?.status || 'pending'}>
                    <td>Testcase #{i + 1}</td>
                    <td>
                      {result ? (
                        result.status === 'passed' ? (
                          <span className="status-pass"><CheckCircle size={14} /> Passed</span>
                        ) : (
                          <span className="status-fail"><XCircle size={14} /> Failed</span>
                        )
                      ) : (
                        <span className="status-pending"><Loader2 size={14} className="spin" /> Running...</span>
                      )}
                    </td>
                    <td>{result ? `${result.executionTime}ms` : '--'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="submission-footer">
          {!isRunning && (
            <div className="submission-stats">
              <span><Clock size={14} /> Total: {results?.reduce((a, r) => a + (r.executionTime || 0), 0)}ms</span>
              <span className={`score ${allPassed ? 'pass' : 'fail'}`}>
                Score: {Math.round((passedCount / totalTests) * 100)}/100
              </span>
            </div>
          )}
          <button onClick={onClose} className="btn btn-primary">
            {isRunning ? 'Running...' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 10. Hints System

**File:** `src/pages/CodingPractice/components/HintsSection.jsx`

```jsx
import { useState, useEffect } from 'react';
import { Lightbulb, ChevronRight, Lock } from 'lucide-react';
import { db } from '../../../data/db';
import { ConfirmDialog } from '../../../components/ConfirmDialog/ConfirmDialog';

export function HintsSection({ hints, problemId }) {
  const [unlockedHints, setUnlockedHints] = useState(new Set());
  const [expandedHint, setExpandedHint] = useState(null);
  const [showConfirm, setShowConfirm] = useState(null);

  useEffect(() => {
    loadUnlockedHints();
  }, [problemId]);

  const loadUnlockedHints = async () => {
    const unlocked = await db.coding_hints_unlocked.where('problem_id').equals(problemId).toArray();
    setUnlockedHints(new Set(unlocked.map(h => h.hint_index)));
  };

  const handleUnlock = async (index, penalty) => {
    await db.coding_hints_unlocked.add({
      problem_id: problemId,
      hint_index: index,
      points_deducted: penalty,
      unlocked_at: new Date().toISOString(),
    });
    setUnlockedHints(prev => new Set([...prev, index]));
    setShowConfirm(null);
  };

  return (
    <div className="problem-section hints-section">
      <div className="section-header">
        <Lightbulb size={16} />
        <span>Hints</span>
      </div>

      {hints.map((hint, idx) => {
        const isUnlocked = unlockedHints.has(idx);
        const isExpanded = expandedHint === idx;

        return (
          <div key={idx} className={`hint-item ${isUnlocked ? 'unlocked' : 'locked'}`}>
            <button 
              className="hint-toggle"
              onClick={() => {
                if (isUnlocked) {
                  setExpandedHint(isExpanded ? null : idx);
                } else {
                  setShowConfirm({ index: idx, penalty: hint.penalty });
                }
              }}
            >
              {isUnlocked ? (
                <ChevronRight size={14} className={isExpanded ? 'expanded' : ''} />
              ) : (
                <Lock size={14} />
              )}
              <span>Hint {idx + 1}</span>
              {!isUnlocked && (
                <span className="hint-penalty">-{hint.penalty} pts</span>
              )}
            </button>

            {isUnlocked && isExpanded && (
              <div className="hint-content">
                <p>{hint.text}</p>
              </div>
            )}
          </div>
        );
      })}

      <ConfirmDialog
        isOpen={!!showConfirm}
        onClose={() => setShowConfirm(null)}
        onConfirm={() => handleUnlock(showConfirm?.index, showConfirm?.penalty)}
        title="Unlock Hint?"
        description={`Revealing this hint will deduct ${showConfirm?.penalty || 0} points from your final score. Use hints wisely!`}
        confirmLabel="Unlock Hint"
        cancelLabel="Keep Hidden"
        variant="warning"
      />
    </div>
  );
}
```

---

## 11. Language Selector & Settings

Already integrated into `CodeEditorPanel`. Add keyboard shortcut support:

```javascript
// In CodeEditorPanel, add useEffect for keyboard shortcuts
useEffect(() => {
  const handleKeyDown = (e) => {
    // Ctrl/Cmd + Enter to run
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onRun();
    }
    // Ctrl/Cmd + Shift + Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
    }
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [onRun, onSubmit]);
```

---

## 12. AI Integration (Ask AI)

Add an "Ask AI" button that opens a chat sidebar for coding help:

```jsx
// Add to CodeEditorPanel toolbar
<button 
  className="toolbar-btn ask-ai" 
  onClick={() => setShowAIChat(true)}
>
  <Sparkles size={16} />
  Ask AI
</button>

// AI Chat Sidebar (simplified)
function AIChatSidebar({ code, problem, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const askAI = async () => {
    const prompt = `I am solving "${problem.title}". Here is my code:\n\n${code}\n\nMy question: ${input}`;
    // Call callOpenRouterStream with prompt
  };

  return (
    <div className="ai-chat-sidebar">
      <div className="ai-chat-header">
        <Sparkles size={16} />
        <span>AI Coding Assistant</span>
        <button onClick={onClose}><X size={16} /></button>
      </div>
      <div className="ai-chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.role}`}>{m.content}</div>
        ))}
      </div>
      <div className="ai-chat-input">
        <input 
          value={input} 
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about your code..."
        />
        <button onClick={askAI}><Send size={14} /></button>
      </div>
    </div>
  );
}
```

---

## 13. CSS Styling

**File:** `src/styles/coding-practice.css`

```css
/* ================================
   CODING PRACTICE — MAIN LAYOUT
   ================================ */

.coding-practice-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
  overflow: hidden;
}

/* Breadcrumb Header */
.coding-practice-page > .breadcrumb {
  padding: 12px 24px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: #64748b;
}

.coding-practice-page > .breadcrumb a {
  color: #334155;
  text-decoration: none;
  font-weight: 500;
}

.coding-practice-page > .breadcrumb span {
  color: #94a3b8;
}

/* Split Pane */
.split-pane {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.pane-left {
  width: 45%;
  min-width: 400px;
  max-width: 600px;
  border-right: 1px solid #e2e8f0;
  overflow-y: auto;
  background: white;
}

.pane-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #1e1e1e;
  min-width: 500px;
}

/* ================================
   PROBLEM PANEL (LEFT)
   ================================ */

.problem-panel {
  padding: 24px;
}

.problem-header {
  margin-bottom: 24px;
}

.problem-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 12px;
}

.problem-meta {
  display: flex;
  gap: 8px;
  align-items: center;
}

.difficulty-pill {
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.topic-tag,
.lang-tag {
  padding: 4px 10px;
  background: #f1f5f9;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  color: #475569;
}

/* Problem Sections */
.problem-section {
  margin-bottom: 28px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.problem-description {
  font-size: 0.9375rem;
  line-height: 1.7;
  color: #334155;
}

.problem-description p {
  margin: 0 0 12px;
}

/* Example Cards */
.example-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  margin-bottom: 12px;
  overflow: hidden;
}

.example-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: none;
  border: none;
  font-size: 0.875rem;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
  text-align: left;
}

.example-toggle:hover {
  background: #f1f5f9;
}

.example-content {
  padding: 0 16px 16px;
}

.io-box {
  margin-bottom: 10px;
}

.io-box label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  margin-bottom: 4px;
}

.io-box pre {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 10px 12px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8125rem;
  color: #334155;
  margin: 0;
  overflow-x: auto;
}

.example-explanation {
  font-size: 0.875rem;
  color: #475569;
  line-height: 1.5;
  margin-top: 10px;
}

/* Constraints */
.constraints-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.constraints-list li {
  position: relative;
  padding-left: 16px;
  margin-bottom: 8px;
  font-size: 0.875rem;
  color: #475569;
  font-family: 'JetBrains Mono', monospace;
}

.constraints-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #94a3b8;
}

/* Test Cases Table */
.test-cases-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8125rem;
}

.test-cases-table th {
  text-align: left;
  padding: 10px 12px;
  background: #f8fafc;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.6875rem;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e2e8f0;
}

.test-cases-table td {
  padding: 10px 12px;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
}

.test-cases-table code {
  font-family: 'JetBrains Mono', monospace;
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
}

.test-cases-table code.expected {
  color: #059669;
  background: #d1fae5;
}

/* Hints */
.hints-section {
  margin-bottom: 28px;
}

.hint-item {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 8px;
  overflow: hidden;
}

.hint-item.locked {
  background: #f8fafc;
}

.hint-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: none;
  border: none;
  font-size: 0.875rem;
  color: #334155;
  cursor: pointer;
  text-align: left;
}

.hint-toggle:hover {
  background: #f1f5f9;
}

.hint-penalty {
  margin-left: auto;
  font-size: 0.75rem;
  font-weight: 600;
  color: #dc2626;
  background: #fee2e2;
  padding: 2px 8px;
  border-radius: 100px;
}

.hint-content {
  padding: 0 16px 16px 44px;
  font-size: 0.875rem;
  color: #475569;
  line-height: 1.6;
}

.hint-content p {
  margin: 0;
}

/* Problem Limits Footer */
.problem-limits {
  display: flex;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
  font-size: 0.75rem;
  color: #94a3b8;
}

.problem-limits span {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* ================================
   EDITOR PANEL (RIGHT)
   ================================ */

.editor-panel {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

/* Toolbar */
.editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: #252526;
  border-bottom: 1px solid #333;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Language Selector */
.lang-selector {
  position: relative;
}

.lang-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #3c3c3c;
  border: 1px solid #555;
  border-radius: 6px;
  color: #cccccc;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.lang-btn:hover {
  background: #4c4c4c;
}

.lang-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  background: #3c3c3c;
  border: 1px solid #555;
  border-radius: 8px;
  padding: 4px;
  min-width: 140px;
  z-index: 100;
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
}

.lang-option {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  background: none;
  border: none;
  border-radius: 6px;
  color: #cccccc;
  font-size: 0.8125rem;
  cursor: pointer;
  text-align: left;
}

.lang-option:hover {
  background: #4c4c4c;
}

.lang-option.active {
  color: #fff;
  background: #094771;
}

/* Toolbar Buttons */
.toolbar-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: #cccccc;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all 0.2s;
}

.toolbar-btn:hover {
  background: #3c3c3c;
  color: #fff;
}

.toolbar-btn.ask-ai {
  color: #f59e0b;
}

.toolbar-btn.ask-ai:hover {
  background: rgba(245, 158, 11, 0.1);
}

/* Run & Submit Buttons */
.btn-run {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #3c3c3c;
  border: 1px solid #555;
  border-radius: 8px;
  color: #fff;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-run:hover {
  background: #4c4c4c;
}

.btn-submit {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  background: #22c55e;
  border: 1px solid #22c55e;
  border-radius: 8px;
  color: white;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-submit:hover {
  background: #16a34a;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Editor Container */
.editor-container {
  flex: 1;
  overflow: hidden;
  display: flex;
}

/* ================================
   TEST CASE PANEL (BOTTOM RIGHT)
   ================================ */

.test-case-panel {
  background: #1e1e1e;
  border-top: 1px solid #333;
  min-height: 200px;
  max-height: 300px;
  display: flex;
  flex-direction: column;
}

.test-case-tabs {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border-bottom: 1px solid #333;
  background: #252526;
}

.tabs-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  color: #cccccc;
  font-size: 0.8125rem;
  font-weight: 600;
  border-right: 1px solid #333;
  margin-right: 8px;
}

.tabs-list {
  display: flex;
  gap: 4px;
  flex: 1;
  overflow-x: auto;
}

.test-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #2d2d2d;
  border: 1px solid #3c3c3c;
  border-radius: 6px;
  color: #cccccc;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.test-tab:hover {
  background: #3c3c3c;
}

.test-tab.active {
  background: #094771;
  border-color: #094771;
  color: #fff;
}

.test-tab.pass {
  border-color: #059669;
}

.test-tab.fail {
  border-color: #dc2626;
}

.tab-status.pass {
  color: #22c55e;
}

.tab-status.fail {
  color: #ef4444;
}

.test-tab.add-tab {
  padding: 6px 10px;
  background: transparent;
  border-style: dashed;
}

/* Test Case Content */
.test-case-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.io-display {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.io-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.io-group label {
  font-size: 0.75rem;
  color: #6e7681;
  font-weight: 500;
}

.io-value {
  background: #2d2d2d;
  border: 1px solid #3c3c3c;
  border-radius: 6px;
  padding: 10px 12px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8125rem;
  color: #e6edf3;
  margin: 0;
  min-height: 36px;
}

.io-value.expected {
  color: #4ade80;
  border-color: rgba(74, 222, 128, 0.3);
}

.io-value.pass {
  color: #4ade80;
  border-color: rgba(74, 222, 128, 0.3);
}

.io-value.fail {
  color: #f87171;
  border-color: rgba(248, 113, 113, 0.3);
}

.io-group.error .io-value {
  color: #f87171;
  background: rgba(248, 113, 113, 0.1);
}

.test-case-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #333;
}

.result-badge {
  padding: 4px 12px;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.result-badge.passed {
  background: rgba(34, 197, 94, 0.15);
  color: #4ade80;
}

.result-badge.failed {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
}

.execution-time {
  font-size: 0.75rem;
  color: #6e7681;
}

/* ================================
   SUBMISSION MODAL
   ================================ */

.submission-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
}

.submission-modal {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 560px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.2);
}

.submission-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px 24px 16px;
  border-bottom: 1px solid #f1f5f9;
}

.submission-header h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 6px;
  color: #0f172a;
}

.submission-header p {
  margin: 0;
  font-size: 0.875rem;
  color: #64748b;
}

.success-icon {
  color: #22c55e;
}

.fail-icon {
  color: #ef4444;
}

.modal-close-btn {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s;
}

.modal-close-btn:hover {
  background: #f1f5f9;
  color: #334155;
}

/* Results Table */
.submission-results {
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px;
}

.submission-results table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.submission-results th {
  text-align: left;
  padding: 10px 12px;
  color: #64748b;
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e2e8f0;
}

.submission-results td {
  padding: 12px;
  border-bottom: 1px solid #f8fafc;
  color: #334155;
}

.submission-results tr.passed td {
  background: rgba(34, 197, 94, 0.03);
}

.submission-results tr.failed td {
  background: rgba(239, 68, 68, 0.03);
}

.status-pass {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #059669;
  font-weight: 600;
}

.status-fail {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #dc2626;
  font-weight: 600;
}

.status-pending {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
}

/* Footer */
.submission-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-top: 1px solid #f1f5f9;
  background: #f8fafc;
}

.submission-stats {
  display: flex;
  gap: 16px;
  font-size: 0.875rem;
  color: #64748b;
}

.submission-stats .score {
  font-weight: 700;
}

.submission-stats .score.pass {
  color: #059669;
}

.submission-stats .score.fail {
  color: #dc2626;
}

/* ================================
   RESPONSIVE
   ================================ */

@media (max-width: 1024px) {
  .split-pane {
    flex-direction: column;
  }

  .pane-left {
    width: 100%;
    max-width: none;
    max-height: 50vh;
    border-right: none;
    border-bottom: 1px solid #e2e8f0;
  }

  .pane-right {
    min-width: auto;
  }
}

@media (max-width: 640px) {
  .editor-toolbar {
    flex-wrap: wrap;
    gap: 8px;
  }

  .toolbar-right {
    width: 100%;
    justify-content: flex-end;
  }

  .problem-panel {
    padding: 16px;
  }
}
```

---

## 14. App Integration

Update `src/App.jsx` routes:

```jsx
import { CodingPractice } from './pages/CodingPractice/CodingPractice';

// Replace existing coding practice route with:
<Route path="/coding-practice/:problemId?" element={<CodingPractice />} />
```

Update sidebar link:
```jsx
// In Sidebar component, update Coding Practice link:
<NavLink to="/coding-practice/strings-1" className={...}>
  <Code size={18} />
  Coding Practice
</NavLink>
```

---

## 15. Implementation Order

| Phase | Feature | Files |
|-------|---------|-------|
| 1 | Database schema update | `src/data/db.js` |
| 2 | CodeEditor component (textarea + line numbers) | `src/components/CodeEditor/` |
| 3 | Main CodingPractice layout (split pane) | `src/pages/CodingPractice/CodingPractice.jsx` |
| 4 | ProblemPanel (left side) | `src/pages/CodingPractice/components/ProblemPanel.jsx` |
| 5 | CodeEditorPanel + LanguageSelector (right top) | `src/pages/CodingPractice/components/CodeEditorPanel.jsx` |
| 6 | TestCasePanel (right bottom) | `src/pages/CodingPractice/components/TestCasePanel.jsx` |
| 7 | SubmissionModal | `src/pages/CodingPractice/components/SubmissionModal.jsx` |
| 8 | HintsSection with penalties | `src/pages/CodingPractice/components/HintsSection.jsx` |
| 9 | CSS styling | `src/styles/coding-practice.css` |
| 10 | AI evaluation integration | Update `evaluateWithAI` in `CodingPractice.jsx` |
| 11 | Route integration | `src/App.jsx` |

---

## KEY FEATURES SUMMARY

| Feature | Description |
|---------|-------------|
| **Split Pane Layout** | 45/55 left-right split, responsive to stacked on mobile |
| **Problem Panel** | Description, expandable examples with I/O boxes, constraints list, test cases table |
| **Code Editor** | Custom textarea with line numbers, tab support, dark theme |
| **Language Selector** | Dropdown for C, C++, Python, Java, JavaScript with starter code per language |
| **Run Tests** | Executes visible test cases only, shows actual vs expected output |
| **Submit** | Runs all tests (including hidden), shows real-time modal with pass/fail per case |
| **Hints System** | 3 expandable hints with point penalties, stored in IndexedDB |
| **Keyboard Shortcuts** | Ctrl+Enter = Run, Ctrl+Shift+Enter = Submit |
| **Ask AI** | Toolbar button for AI coding assistant sidebar |
| **Submission History** | All submissions stored in `coding_submissions` table |

---

## OFFLINE BEHAVIOR

- Problem data cached in IndexedDB after first load
- Code editor works fully offline
- Run/Submit uses AI evaluation (requires internet) — show offline message if no connection
- Hints unlock state persisted locally
- Previous submissions visible offline

---

> **END OF DOCUMENT**
> Feed this entire prompt to Antigravity section by section. Start with Phase 1 (schema + CodeEditor), then Phase 2-3 (layout + panels), then Phase 4-5 (modal + hints), then CSS and integration.
