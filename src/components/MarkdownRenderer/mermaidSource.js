/**
 * Helpers for turning AI-generated Mermaid text into something Mermaid can render.
 *
 * Models regularly return diagrams as:
 *  - a fenced block with the wrong (or missing) language tag
 *  - raw diagram code with no fence at all
 *  - fences escaped with backslashes because they were embedded in JSON
 *  - node labels containing brackets/parentheses that break the parser
 *
 * These helpers normalise all of those cases before the diagram reaches
 * `mermaid.render`.
 */

const DIRECTIVE_RE =
  /^(?:graph\s+(?:TD|TB|BT|RL|LR)\b|flowchart(?:\s+(?:TD|TB|BT|RL|LR))?\b|sequenceDiagram\b|classDiagram(?:-v2)?\b|stateDiagram(?:-v2)?\b|erDiagram\b|journey\b|gantt\b|pie\b|mindmap\b|timeline\b|gitGraph\b|quadrantChart\b|requirementDiagram\b|C4(?:Context|Container|Component|Dynamic|Deployment)\b|sankey-beta\b|xychart-beta\b|block-beta\b|packet-beta\b|architecture-beta\b)/i;

/**
 * Stricter form used for detection: the whole line must be a directive, so
 * prose such as "Pie charts are useful" is not mistaken for a diagram.
 */
const DIRECTIVE_LINE_RE =
  /^(?:graph\s+(?:TD|TB|BT|RL|LR)(?:\s*;.*)?|flowchart(?:\s+(?:TD|TB|BT|RL|LR))?(?:\s*;.*)?|sequenceDiagram|classDiagram(?:-v2)?|stateDiagram(?:-v2)?|erDiagram|journey|gantt|pie(?:\s+title\b.*)?|mindmap|timeline|gitGraph(?:\s+(?:LR|TB|BT))?:?|quadrantChart|requirementDiagram|C4(?:Context|Container|Component|Dynamic|Deployment)|sankey-beta|xychart-beta|block-beta|packet-beta|architecture-beta)$/i;

const FLOWCHART_RE = /^\s*(?:graph|flowchart)\b/im;

const FENCE_RE = /^\s*(?:`{3,}|~{3,})\s*[\w-]*\s*$/;

const SKIP_LINE_RE =
  /^(?:classDef|class|style|linkStyle|click|subgraph|end|direction|accTitle|accDescr)\b/i;

/** Remove a surrounding markdown fence (of any language) and escaped backticks. */
export function stripMermaidFence(input) {
  let text = String(input ?? '').replace(/\r\n?/g, '\n').trim();
  if (!text) return '';

  // Models that emit JSON sometimes escape every backtick.
  text = text.replace(/\\`/g, '`');

  const lines = text.split('\n');
  if (FENCE_RE.test(lines[0])) {
    lines.shift();
    for (let i = lines.length - 1; i >= 0; i--) {
      if (FENCE_RE.test(lines[i])) {
        lines.splice(i, 1);
        break;
      }
    }
  }

  return lines.join('\n').trim();
}

/** True when the text (fenced or not) contains a line that is a diagram directive. */
export function isMermaidSource(input) {
  const text = stripMermaidFence(input);
  if (!text) return false;

  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('%%')) continue; // comments / init directives
    if (DIRECTIVE_LINE_RE.test(trimmed)) return true;
  }
  return false;
}

/** True when the first meaningful line of the text is a diagram directive. */
function startsWithMermaidDirective(text) {
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('%%')) continue;
    return DIRECTIVE_LINE_RE.test(trimmed);
  }
  return false;
}

/**
 * Repair common syntax problems in AI-written Mermaid.
 * `aggressive` also drops styling statements that frequently fail to parse.
 */
export function prepareMermaidSource(input, { aggressive = false } = {}) {
  let text = stripMermaidFence(input);
  if (!text) return '';

  // Drop any prose the model wrote before the diagram.
  const lines = text.split('\n');
  const startIdx = lines.findIndex((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('%%')) return false;
    return DIRECTIVE_RE.test(trimmed);
  });
  if (startIdx > 0) text = lines.slice(startIdx).join('\n');

  // Mermaid's parser is happier without tabs and unclosed <br> tags.
  text = text.replace(/\t/g, '  ').replace(/<br\s*\/?>/gi, '<br/>');

  if (FLOWCHART_RE.test(text)) {
    text = quoteFlowchartLabels(text);
  }

  if (aggressive) {
    text = text
      .replace(/^\s*(?:classDef|class|style|linkStyle|click)\s+.*$/gim, '')
      .replace(/:::[\w-]+/g, '');
  }

  return text.trim();
}

/**
 * Wrap raw Mermaid text in a fenced block so markdown parsers treat it as a
 * diagram instead of a paragraph of plain text. Fenced content is untouched.
 */
export function normalizeMermaidMarkdown(markdown) {
  if (typeof markdown !== 'string' || !markdown) return markdown;

  let text = markdown.replace(/\r\n?/g, '\n');

  if (text.includes('\\`')) text = text.replace(/\\`/g, '`');
  // Convert tilde fences to backtick fences, keeping any language tag.
  text = text.replace(
    /^(\s*)~~~+\s*([\w-]*)\s*$/gim,
    (_, indent, language) => `${indent}\`\`\`${language}`
  );

  const trimmed = text.trim();
  if (
    trimmed &&
    !trimmed.includes('```') &&
    !trimmed.includes('\n\n') &&
    startsWithMermaidDirective(trimmed)
  ) {
    return '```mermaid\n' + trimmed + '\n```';
  }

  return text;
}

/* ── Flowchart label quoting ─────────────────────────────── */

function quoteFlowchartLabels(text) {
  return text
    .split('\n')
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('%%')) return line;
      if (SKIP_LINE_RE.test(trimmed)) return line;
      return quoteShapes(line);
    })
    .join('\n');
}

function quoteShapes(line) {
  let out = '';
  let i = 0;

  while (i < line.length) {
    const ch = line[i];

    if (ch === '"') {
      const end = line.indexOf('"', i + 1);
      if (end === -1) {
        out += line.slice(i);
        break;
      }
      out += line.slice(i, end + 1);
      i = end + 1;
      continue;
    }

    if (ch === '[' || ch === '{' || ch === '(') {
      const close = ch === '[' ? ']' : ch === '{' ? '}' : ')';

      // `(( ))`, `[[ ]]`, `{{ }}` and friends are dedicated node shapes —
      // leave them exactly as the model wrote them.
      if (line[i + 1] === ch) {
        const end = findMatching(line, i, ch, close);
        if (end !== -1) {
          out += line.slice(i, end + 1);
          i = end + 1;
          continue;
        }
      }

      const end = findMatching(line, i, ch, close);
      if (end !== -1) {
        const raw = line.slice(i + 1, end);
        const label = raw.trim();
        const alreadyQuoted = label.startsWith('"') && label.endsWith('"');
        const compoundShape =
          (label.startsWith('(') && label.endsWith(')')) ||
          (label.startsWith('[') && label.endsWith(']')) ||
          (label.startsWith('{') && label.endsWith('}'));

        // Parentheses/brackets inside a label are the most common parse error.
        const needsQuotes =
          label.length > 0 &&
          !alreadyQuoted &&
          !compoundShape &&
          /[()[\]{}]/.test(label);

        if (needsQuotes) {
          out += ch + '"' + label.replace(/"/g, '&quot;') + '"' + close;
          i = end + 1;
          continue;
        }

        out += line.slice(i, end + 1);
        i = end + 1;
        continue;
      }
    }

    out += ch;
    i += 1;
  }

  return out;
}

function findMatching(line, start, open, close) {
  let depth = 0;

  for (let i = start; i < line.length; i++) {
    const ch = line[i];

    if (ch === '"') {
      const end = line.indexOf('"', i + 1);
      if (end === -1) return -1;
      i = end;
      continue;
    }

    if (ch === open) depth += 1;
    else if (ch === close) {
      depth -= 1;
      if (depth === 0) return i;
    }
  }

  return -1;
}
