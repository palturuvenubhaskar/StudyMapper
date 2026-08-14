import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default function MarkdownRenderer({ children, remarkPlugins = [], rehypePlugins = [], ...props }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath, ...remarkPlugins]}
      rehypePlugins={[rehypeKatex, ...rehypePlugins]}
      {...props}
    >
      {children}
    </ReactMarkdown>
  );
}
