import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MarkdownRenderer from './MarkdownRenderer';

describe('MarkdownRenderer mermaid integration', () => {
  it('turns a fenced mermaid block into a diagram instead of a code block', async () => {
    const { container } = render(
      <MarkdownRenderer>{'```mermaid\ngraph TD\n  A --> B\n```'}</MarkdownRenderer>
    );

    // The raw code must not be rendered as a normal <pre><code> block.
    expect(container.querySelector('pre code.language-mermaid')).toBeNull();
    // Either the diagram renders or the fallback card appears — both mean it
    // was treated as a diagram, not as plain text.
    const diagram = await screen.findByText(/Drawing diagram|This diagram could not be drawn/);
    expect(diagram).toBeTruthy();
  });

  it('turns raw mermaid text into a diagram', async () => {
    render(<MarkdownRenderer>{'graph TD\n  A --> B'}</MarkdownRenderer>);
    const diagram = await screen.findByText(/Drawing diagram|This diagram could not be drawn/);
    expect(diagram).toBeTruthy();
  });

  it('turns an untagged mermaid fence into a diagram', async () => {
    const { container } = render(
      <MarkdownRenderer>{'```\ngraph TD\n  A --> B\n```'}</MarkdownRenderer>
    );

    expect(container.querySelector('pre code')).toBeNull();
    const diagram = await screen.findByText(/Drawing diagram|This diagram could not be drawn/);
    expect(diagram).toBeTruthy();
  });

  it('still renders ordinary code blocks as code', () => {
    const { container } = render(
      <MarkdownRenderer>{'```js\nconst a = 1;\n```'}</MarkdownRenderer>
    );
    expect(container.querySelector('pre code')).toBeTruthy();
  });

  it('keeps inline code visible even when it looks like mermaid', () => {
    const { container } = render(<MarkdownRenderer>{'Use `graph TD` to start.'}</MarkdownRenderer>);
    expect(container.querySelector('code')?.textContent).toBe('graph TD');
  });

  it('accepts markdown through the content prop', () => {
    render(<MarkdownRenderer content={'# Heading'} />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Heading');
  });
});
