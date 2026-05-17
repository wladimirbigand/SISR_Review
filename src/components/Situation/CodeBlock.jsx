import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import HelpTooltip from '../UI/HelpTooltip';

// Split a line of text into segments, marking exact substring matches from `tooltips`.
// Longer matches are processed first so shorter ones don't break them.
function splitWithTooltips(line, tooltips) {
  if (!tooltips || tooltips.length === 0) return [{ text: line }];
  const sorted = [...tooltips].sort((a, b) => b.match.length - a.match.length);
  let segments = [{ text: line }];
  for (const t of sorted) {
    if (!t.match) continue;
    const next = [];
    for (const seg of segments) {
      if (seg.tooltip || !seg.text.includes(t.match)) {
        next.push(seg);
        continue;
      }
      const parts = seg.text.split(t.match);
      for (let i = 0; i < parts.length; i++) {
        if (parts[i]) next.push({ text: parts[i] });
        if (i < parts.length - 1)
          next.push({ text: t.match, tooltip: t.text });
      }
    }
    segments = next;
  }
  return segments;
}

// Very light syntax highlighting for plain text segments (no tooltip).
// Returns an array of React-friendly tokens.
function highlightSegment(text, language) {
  if (!text) return [{ text: '' }];
  // Generic regex: strings, then numbers, then comments handled by language switch.
  const tokens = [];
  let i = 0;

  // Patterns ordered by priority
  const patterns = [];
  if (language === 'bash') {
    patterns.push({ re: /#.*$/, cls: 'code-token-comment' });
  }
  if (language === 'apache' || language === 'nginx') {
    patterns.push({ re: /#.*$/, cls: 'code-token-comment' });
    patterns.push({ re: /<\/?[A-Za-z][^>]*>/, cls: 'code-token-tag' });
  }
  patterns.push({ re: /"[^"]*"/, cls: 'code-token-string' });
  patterns.push({ re: /'[^']*'/, cls: 'code-token-string' });

  while (i < text.length) {
    let matched = null;
    let matchedIdx = text.length;
    let matchedPattern = null;
    for (const p of patterns) {
      const sub = text.slice(i);
      const m = sub.match(p.re);
      if (m && m.index !== undefined) {
        const absoluteIdx = i + m.index;
        if (absoluteIdx < matchedIdx) {
          matched = m[0];
          matchedIdx = absoluteIdx;
          matchedPattern = p;
        }
      }
    }
    if (matched) {
      if (matchedIdx > i) tokens.push({ text: text.slice(i, matchedIdx) });
      tokens.push({ text: matched, cls: matchedPattern.cls });
      i = matchedIdx + matched.length;
    } else {
      tokens.push({ text: text.slice(i) });
      break;
    }
  }
  return tokens;
}

function renderLine(line, tooltips, language) {
  const segments = splitWithTooltips(line, tooltips);
  return segments.map((seg, idx) => {
    if (seg.tooltip) {
      return (
        <span
          key={idx}
          className="inline-flex items-center gap-1.5 bg-primary/20 text-white px-1.5 py-0.5 rounded-md align-middle"
          style={{ outline: '1px solid rgba(215,10,83,0.55)' }}
        >
          <span className="font-mono">{seg.text}</span>
          <HelpTooltip text={seg.tooltip} size={14} />
        </span>
      );
    }
    const tokens = highlightSegment(seg.text, language);
    return (
      <span key={idx}>
        {tokens.map((tk, j) =>
          tk.cls ? (
            <span key={j} className={tk.cls}>
              {tk.text}
            </span>
          ) : (
            <span key={j}>{tk.text}</span>
          ),
        )}
      </span>
    );
  });
}

export default function CodeBlock({
  code,
  title = 'Terminal',
  language = 'bash',
  tooltips = [],
  showCopy = true,
}) {
  const [copied, setCopied] = useState(false);
  const lines = code.split('\n');

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="rounded-xl overflow-hidden shadow-terminal border border-black/30 my-3">
      <div className="flex items-center justify-between px-4 py-2 bg-[#2a2a3a] border-b border-black/30">
        <div className="flex items-center gap-1.5">
          <span className="terminal-dot" style={{ background: '#ff5f57' }} />
          <span className="terminal-dot" style={{ background: '#febc2e' }} />
          <span className="terminal-dot" style={{ background: '#28c840' }} />
        </div>
        <span className="text-xs font-mono text-code-fg/80 truncate ml-3">
          {title}
        </span>
        {showCopy && (
          <button
            type="button"
            onClick={onCopy}
            className="ml-3 inline-flex items-center gap-1.5 text-xs font-mono text-code-fg/70 hover:text-code-fg px-2 py-1 rounded hover:bg-white/5 transition-colors"
            aria-label="Copier"
          >
            {copied ? (
              <motion.span
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-1.5 text-success"
              >
                <Check size={13} strokeWidth={2.8} />
                Copié
              </motion.span>
            ) : (
              <>
                <Copy size={13} />
                Copier
              </>
            )}
          </button>
        )}
      </div>
      <pre className="code-block px-4 py-3 overflow-x-auto whitespace-pre m-0">
        {lines.map((line, idx) => (
          <div key={idx} className="leading-6">
            {renderLine(line, tooltips, language) /* line could be empty */ }
            {line === '' && ' '}
          </div>
        ))}
      </pre>
    </div>
  );
}
