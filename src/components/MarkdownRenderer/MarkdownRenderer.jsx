import React, { Suspense, isValidElement, lazy, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { isMermaidSource, normalizeMermaidMarkdown } from './mermaidSource';

// Mermaid is heavy; only download it when a diagram is actually on screen.
const MermaidRenderer = lazy(() => import('./MermaidRenderer'));

function Diagram({ chart }) {
  return (
    <Suspense
      fallback={
        <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0', color: '#6b7280' }}>
          <div className="spinner spinner-sm" style={{ marginRight: '10px' }}></div>
          <span>Drawing diagram...</span>
        </div>
      }
    >
      <MermaidRenderer chart={chart} />
    </Suspense>
  );
}

/** Flatten a React children tree down to its text content. */
function toText(children) {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(toText).join('');
  if (isValidElement(children)) return toText(children.props?.children);
  return children == null ? '' : String(children);
}

function MermaidCode({ node: _node, className, children, ...props }) {
  return (
    <code className={className} {...props}>
      {children}
    </code>
  );
}

/**
 * A fenced block is a diagram when it is tagged `mermaid` or has no language
 * tag but its content is diagram source. Explicitly tagged code (js, python,
 * …) always stays code.
 */
function getDiagramSource(codeElement) {
  const text = toText(codeElement.props.children).replace(/\n$/, '');
  const language = /language-([\w-]+)/.exec(codeElement.props.className || '')?.[1]?.toLowerCase();

  if (language && language !== 'mermaid') return null;
  return (language === 'mermaid' || isMermaidSource(text)) ? text : null;
}

function MermaidPre({ node: _node, children, ...props }) {
  const elements = Array.isArray(children) ? children : [children];

  // react-markdown passes the `code` component element itself to `pre`, so we
  // inspect its props before it renders.
  const codeElement = elements.find(
    (child) => isValidElement(child) && child.type === MermaidCode
  );
  const chart = codeElement ? getDiagramSource(codeElement) : null;

  if (chart) {
    return <Diagram chart={chart} />;
  }

  return <pre {...props}>{children}</pre>;
}

/** Catch raw Mermaid that the model wrote without a code fence. */
function MermaidParagraph({ node: _node, children, ...props }) {
  const text = toText(children);

  if (isMermaidSource(text)) {
    return <Diagram chart={text} />;
  }

  return <p {...props}>{children}</p>;
}

const DEFAULT_COMPONENTS = {
  pre: MermaidPre,
  code: MermaidCode,
  p: MermaidParagraph,
};

export default function MarkdownRenderer({
  children,
  content,
  remarkPlugins = [],
  rehypePlugins = [],
  components,
  ...props
}) {
  // Some call sites pass the markdown through `content` instead of children.
  const source = children ?? content ?? '';
  const normalized = useMemo(() => normalizeMermaidMarkdown(source), [source]);

  const mergedComponents = useMemo(
    () => ({ ...DEFAULT_COMPONENTS, ...components }),
    [components]
  );

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath, ...remarkPlugins]}
      rehypePlugins={[rehypeKatex, ...rehypePlugins]}
      components={mergedComponents}
      {...props}
    >
      {normalized}
    </ReactMarkdown>
  );
}
