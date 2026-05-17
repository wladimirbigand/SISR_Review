import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Lock,
  AlertTriangle,
  CheckCircle2,
  Wrench,
} from 'lucide-react';
import CodeBlock from './CodeBlock';
import HelpTooltip from '../UI/HelpTooltip';
import Button from '../UI/Button';

const READ_TIMER_SECONDS = 5;

function DirectivesList({ title, items }) {
  return (
    <div className="bg-bg-page/70 border border-border rounded-xl p-4">
      {title && (
        <h4 className="text-sm font-bold text-ink mb-2 uppercase tracking-wide">
          {title}
        </h4>
      )}
      <ul className="space-y-2 text-sm">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="font-mono text-primary font-semibold whitespace-nowrap">
              {it.name}
            </span>
            <span className="text-ink-soft">: {it.desc}</span>
            {it.tooltip && (
              <span className="shrink-0 inline-flex items-center self-center">
                <HelpTooltip text={it.tooltip} size={16} />
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Note({ kind = 'info', text }) {
  const styles = {
    warning: {
      cls: 'border-warning/40 bg-warning/10 text-ink',
      icon: <AlertTriangle size={16} className="text-warning shrink-0 mt-0.5" />,
    },
    info: {
      cls: 'border-primary/20 bg-primary/5 text-ink',
      icon: <Wrench size={16} className="text-primary shrink-0 mt-0.5" />,
    },
  };
  const s = styles[kind] ?? styles.info;
  return (
    <div className={`flex gap-2 items-start border rounded-xl px-4 py-3 text-sm ${s.cls}`}>
      {s.icon}
      <p className="leading-relaxed">{text}</p>
    </div>
  );
}

function ExpectedBlock({ text }) {
  return (
    <div className="flex gap-2 items-start border border-success/30 bg-success/5 rounded-xl px-4 py-3 text-sm">
      <CheckCircle2 size={16} className="text-success shrink-0 mt-0.5" />
      <div className="text-ink leading-relaxed">
        <span className="font-bold text-success">Résultat attendu : </span>
        <span className="font-mono break-all">{text}</span>
      </div>
    </div>
  );
}

function languageFromCommand(code) {
  // bash command always single-line / shell-like
  return 'bash';
}

function renderBlock(block, idx) {
  switch (block.type) {
    case 'command':
      return (
        <CodeBlock
          key={idx}
          code={block.code}
          title={block.title ?? 'Terminal'}
          tooltips={block.tooltips}
          language={languageFromCommand(block.code)}
        />
      );
    case 'config':
      return (
        <CodeBlock
          key={idx}
          code={block.code}
          title={block.filename}
          tooltips={block.tooltips}
          language={block.language ?? 'apache'}
        />
      );
    case 'explanation':
      return (
        <p key={idx} className="text-sm text-ink-soft leading-relaxed">
          {block.text}
        </p>
      );
    case 'action':
      return (
        <p key={idx} className="text-sm font-semibold text-ink leading-relaxed">
          {block.text}
        </p>
      );
    case 'directives':
      return <DirectivesList key={idx} title={block.title} items={block.items} />;
    case 'note':
      return <Note key={idx} kind={block.kind} text={block.text} />;
    case 'expected':
      return <ExpectedBlock key={idx} text={block.text} />;
    default:
      return null;
  }
}

export default function StepViewer({
  step,
  stepIndex,
  totalSteps,
  onPrev,
  onNext,
  onMarkRead,
}) {
  const [secondsLeft, setSecondsLeft] = useState(READ_TIMER_SECONDS);
  const timerRef = useRef(null);

  useEffect(() => {
    // Reset timer on step change
    setSecondsLeft(READ_TIMER_SECONDS);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [stepIndex]);

  const unlocked = secondsLeft === 0;
  const isLast = stepIndex === totalSteps - 1;

  return (
    <div>
      <AnimatePresence mode="wait">
        <motion.div
          key={stepIndex}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22 }}
        >
          <div className="bg-bg-card border border-border rounded-2xl shadow-card p-5 sm:p-7">
            <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-primary font-semibold">
                Étape {stepIndex + 1} / {totalSteps}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-ink mb-5 tracking-tight">
              {step.title}
            </h2>
            <div className="space-y-4">{step.blocks.map((b, i) => renderBlock(b, i))}</div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex items-center justify-between gap-3 flex-wrap">
        <Button
          variant="secondary"
          onClick={onPrev}
          disabled={stepIndex === 0}
        >
          <ChevronLeft size={16} />
          Étape précédente
        </Button>

        <div className="flex items-center gap-3 flex-wrap justify-end">
          {!unlocked && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-ink-soft inline-flex items-center gap-1.5"
            >
              <Lock size={13} />
              Prenez le temps de lire... ({secondsLeft}s)
            </motion.span>
          )}
          <Button
            variant="primary"
            disabled={!unlocked}
            onClick={() => {
              onMarkRead?.();
              onNext?.();
            }}
          >
            {isLast ? "Passer au quiz" : "Étape suivante"}
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
