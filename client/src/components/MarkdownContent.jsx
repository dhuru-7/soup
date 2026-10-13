import React from 'react';

/**
 * Parses inline markdown tokens:
 * - Bold: **text** or __text__
 * - Italic: *text* or _text_
 * - Inline code: `code`
 * - Handles streaming unclosed tokens gracefully
 */
export function parseInlineTokens(text) {
  if (!text) return null;

  // Split by inline markdown tokens: `code`, **bold**, __bold__, *italic*, _italic_
  const tokenRegex = /(`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|(?<!\*)\*[^*]+?\*(?!\*)|(?<!_)_[^_]+?_(?!_))/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Inline code: `code`
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-800 font-mono text-[12px] border border-slate-200/80"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Bold: **text** or __text__
    if (
      (part.startsWith('**') && part.endsWith('**') && part.length >= 4) ||
      (part.startsWith('__') && part.endsWith('__') && part.length >= 4)
    ) {
      const inner = part.slice(2, -2);
      return (
        <strong key={index} className="font-semibold text-slate-900">
          {parseInlineTokens(inner)}
        </strong>
      );
    }

    // Streaming unclosed bold: **text
    if (part.startsWith('**') && !part.endsWith('**') && part.length > 2) {
      return (
        <strong key={index} className="font-semibold text-slate-900">
          {part.slice(2)}
        </strong>
      );
    }

    // Italic: *text* or _text_
    if (
      (part.startsWith('*') && part.endsWith('*') && part.length >= 2) ||
      (part.startsWith('_') && part.endsWith('_') && part.length >= 2)
    ) {
      const inner = part.slice(1, -1);
      return (
        <em key={index} className="italic text-slate-800">
          {inner}
        </em>
      );
    }

    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

/**
 * Premium Markdown Renderer
 * Parses block elements:
 * - Headers (#, ##, ###, ####)
 * - Dividers (---, ***)
 * - Bullet lists (*, -, + with indentation support)
 * - Numbered lists (1., 2.)
 * - Blockquotes (>)
 * - Code blocks (```)
 * - Clean paragraph and line spacing
 */
export default function MarkdownContent({ content, className = '', isStreaming = false }) {
  if (!content) return null;

  const lines = content.split('\n');
  const blocks = [];
  let currentList = null; // { type: 'ul' | 'ol', items: [] }
  let inCodeBlock = false;
  let codeBuffer = [];
  let codeLang = '';

  const flushList = () => {
    if (currentList) {
      if (currentList.type === 'ul') {
        blocks.push(
          <ul key={`ul-${blocks.length}`} className="my-2.5 space-y-1.5 text-slate-800">
            {currentList.items.map((it, i) => (
              <li
                key={i}
                className={`flex items-start gap-2.5 text-[14.5px] leading-relaxed ${
                  it.isSub ? 'ml-5 text-slate-700 text-[13.5px]' : 'text-slate-800'
                }`}
              >
                <span
                  className={`rounded-full shrink-0 mt-2 ${
                    it.isSub ? 'w-1 h-1 bg-slate-400' : 'w-1.5 h-1.5 bg-slate-700'
                  }`}
                />
                <div className="flex-1">{parseInlineTokens(it.text)}</div>
              </li>
            ))}
          </ul>
        );
      } else {
        blocks.push(
          <ol key={`ol-${blocks.length}`} className="my-2.5 space-y-1.5 text-slate-800">
            {currentList.items.map((it, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-[14.5px] leading-relaxed text-slate-800"
              >
                <span className="text-xs font-bold text-slate-500 shrink-0 mt-0.5 w-4">
                  {it.num}.
                </span>
                <div className="flex-1">{parseInlineTokens(it.text)}</div>
              </li>
            ))}
          </ol>
        );
      }
      currentList = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    // Check code blocks
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        // Close code block
        blocks.push(
          <pre
            key={`code-${blocks.length}`}
            className="my-3 p-3.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto border border-slate-800"
          >
            <code>{codeBuffer.join('\n')}</code>
          </pre>
        );
        codeBuffer = [];
        inCodeBlock = false;
      } else {
        flushList();
        inCodeBlock = true;
        codeLang = trimmed.slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(rawLine);
      continue;
    }

    // Dividers: --- or ***
    if (/^(---|---|\*\*\*|___)$/.test(trimmed)) {
      flushList();
      blocks.push(
        <div key={`hr-${blocks.length}`} className="my-3 border-t border-slate-200/90" />
      );
      continue;
    }

    // Headings
    if (trimmed.startsWith('#### ')) {
      flushList();
      blocks.push(
        <h4 key={`h4-${blocks.length}`} className="text-xs font-bold text-slate-900 mt-2 mb-1 leading-snug">
          {parseInlineTokens(trimmed.slice(5))}
        </h4>
      );
      continue;
    }

    if (trimmed.startsWith('### ')) {
      flushList();
      blocks.push(
        <h3 key={`h3-${blocks.length}`} className="text-sm font-bold text-slate-900 mt-3 mb-1 leading-snug">
          {parseInlineTokens(trimmed.slice(4))}
        </h3>
      );
      continue;
    }

    if (trimmed.startsWith('## ')) {
      flushList();
      blocks.push(
        <h2 key={`h2-${blocks.length}`} className="text-base font-bold text-slate-900 mt-3.5 mb-1.5 leading-snug">
          {parseInlineTokens(trimmed.slice(3))}
        </h2>
      );
      continue;
    }

    if (trimmed.startsWith('# ')) {
      flushList();
      blocks.push(
        <h1 key={`h1-${blocks.length}`} className="text-lg font-bold text-slate-950 mt-4 mb-2 leading-snug">
          {parseInlineTokens(trimmed.slice(2))}
        </h1>
      );
      continue;
    }

    // Unordered bullet list: *, -, +
    const bulletMatch = rawLine.match(/^(\s*)([*+-])\s+(.*)$/);
    if (bulletMatch) {
      const indent = bulletMatch[1].length;
      const text = bulletMatch[3];
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push({
        text,
        isSub: indent >= 2
      });
      continue;
    }

    // Ordered list: 1., 2.
    const orderedMatch = rawLine.match(/^(\s*)(\d+)\.\s+(.*)$/);
    if (orderedMatch) {
      const num = orderedMatch[2];
      const text = orderedMatch[3];
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push({ num, text });
      continue;
    }

    // Blockquote: >
    if (trimmed.startsWith('>')) {
      flushList();
      blocks.push(
        <blockquote
          key={`quote-${blocks.length}`}
          className="my-2.5 pl-3 border-l-2 border-slate-300 text-slate-600 italic text-[13.5px] leading-relaxed"
        >
          {parseInlineTokens(trimmed.replace(/^>\s?/, ''))}
        </blockquote>
      );
      continue;
    }

    // Empty line: spacing
    if (!trimmed) {
      flushList();
      blocks.push(<div key={`space-${blocks.length}`} className="h-1.5" />);
      continue;
    }

    // Regular paragraph line
    flushList();
    blocks.push(
      <p key={`p-${blocks.length}`} className="my-1 text-[14.5px] text-slate-800 leading-relaxed font-sans">
        {parseInlineTokens(trimmed)}
      </p>
    );
  }

  // Flush any open code block or list
  if (inCodeBlock && codeBuffer.length > 0) {
    blocks.push(
      <pre
        key={`code-end`}
        className="my-3 p-3.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto border border-slate-800"
      >
        <code>{codeBuffer.join('\n')}</code>
      </pre>
    );
  }
  flushList();

  return (
    <div className={`w-full text-slate-800 font-sans ${className}`}>
      {blocks}
      {isStreaming && (
        <span className="inline-block w-1.5 h-4 ml-0.5 bg-slate-700 animate-pulse align-middle" />
      )}
    </div>
  );
}
