import { describe, it, expect } from 'vitest';
import {
  isMermaidSource,
  normalizeMermaidMarkdown,
  prepareMermaidSource,
  stripMermaidFence,
} from './mermaidSource';

describe('isMermaidSource', () => {
  it('detects a fenced flowchart', () => {
    expect(isMermaidSource('```mermaid\ngraph TD\n  A --> B\n```')).toBe(true);
  });

  it('detects raw diagram code', () => {
    expect(isMermaidSource('flowchart LR\n  A --> B')).toBe(true);
  });

  it('ignores ordinary prose', () => {
    expect(isMermaidSource('Graph theory studies connections between nodes.')).toBe(false);
  });

  it('ignores prose that starts with a diagram keyword', () => {
    expect(isMermaidSource('Pie charts show how a whole is divided.')).toBe(false);
    expect(isMermaidSource('Timeline of the French Revolution')).toBe(false);
  });
});

describe('normalizeMermaidMarkdown', () => {
  it('wraps a raw diagram in a fence', () => {
    const output = normalizeMermaidMarkdown('graph TD\n  A --> B');
    expect(output).toBe('```mermaid\ngraph TD\n  A --> B\n```');
  });

  it('repairs escaped fences from JSON strings', () => {
    const output = normalizeMermaidMarkdown('\\`\\`\\`mermaid\\ngraph TD\\n  A --> B\\n\\`\\`\\`');
    expect(output).toContain('```mermaid');
    expect(output).not.toContain('\\`');
  });

  it('leaves regular markdown untouched', () => {
    const markdown = '## Heading\n\n- one\n- two';
    expect(normalizeMermaidMarkdown(markdown)).toBe(markdown);
  });

  it('does not wrap a note that merely contains a diagram later', () => {
    const markdown = '## Notes\n\nPie charts show proportions.\n\ngraph TD\n  A --> B';
    expect(normalizeMermaidMarkdown(markdown)).toBe(markdown);
  });

  it('converts tilde fences without losing the language tag', () => {
    expect(normalizeMermaidMarkdown('~~~js\nconst a = 1;\n~~~')).toBe('```js\nconst a = 1;\n```');
  });
});

describe('stripMermaidFence', () => {
  it('removes the surrounding fence', () => {
    expect(stripMermaidFence('```mermaid\ngraph TD\n  A --> B\n```')).toBe('graph TD\n  A --> B');
  });

  it('removes a fence without a language tag', () => {
    expect(stripMermaidFence('```\ngraph TD\n  A --> B\n```')).toBe('graph TD\n  A --> B');
  });
});

describe('prepareMermaidSource', () => {
  it('drops prose before the diagram', () => {
    const source = prepareMermaidSource('Here is the diagram:\n\ngraph TD\n  A --> B');
    expect(source.startsWith('graph TD')).toBe(true);
    expect(source).not.toContain('Here is the diagram');
  });

  it('quotes labels containing parentheses', () => {
    const source = prepareMermaidSource('graph TD\n  A[Start (Step 1)] --> B[End]');
    expect(source).toContain('A["Start (Step 1)"]');
    expect(source).toContain('B[End]');
  });

  it('leaves dedicated double-bracket shapes alone', () => {
    const source = prepareMermaidSource('graph TD\n  A((Circle)) --> B[(Database)]');
    expect(source).toContain('A((Circle))');
    expect(source).toContain('B[(Database)]');
  });

  it('does not touch edge labels', () => {
    const source = prepareMermaidSource('graph TD\n  A -->|Yes (go on)| B');
    expect(source).toContain('|Yes (go on)|');
  });

  it('strips styling directives in aggressive mode', () => {
    const source = prepareMermaidSource(
      'graph TD\n  A[Start] --> B[End]\n  classDef red fill:#f00\n  class A red',
      { aggressive: true }
    );
    expect(source).not.toContain('classDef');
    expect(source).not.toContain('class A red');
    expect(source).toContain('A[Start]');
  });
});
