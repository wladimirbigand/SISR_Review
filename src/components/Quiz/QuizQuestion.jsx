import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import Button from '../UI/Button';

function normalize(str) {
  return (str ?? '').trim().toLowerCase();
}

function isCorrect(question, answer) {
  if (question.type === 'mcq') return answer === question.answer;
  if (question.type === 'tf') return answer === question.answer;
  if (question.type === 'fill')
    return normalize(answer) === normalize(question.answer);
  return false;
}

export default function QuizQuestion({
  question,
  index,
  total,
  onValidate,
  onNext,
}) {
  const [selection, setSelection] = useState(null);
  const [fillValue, setFillValue] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const answer = question.type === 'fill' ? fillValue : selection;
  const correct = submitted && isCorrect(question, answer);
  const hasAnswered =
    question.type === 'fill'
      ? fillValue.trim().length > 0
      : selection !== null;

  const handleSubmit = () => {
    if (!hasAnswered || submitted) return;
    const right = isCorrect(question, answer);
    setSubmitted(true);
    onValidate?.(right);
  };

  const handleNext = () => {
    onNext?.();
    setSelection(null);
    setFillValue('');
    setSubmitted(false);
  };

  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-bg-card border border-border rounded-2xl shadow-card p-5 sm:p-7"
    >
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <span className="text-xs font-mono uppercase tracking-wider text-primary font-semibold">
          Question {index + 1} / {total}
        </span>
        <span className="text-xs text-ink-soft uppercase tracking-wider">
          {question.type === 'mcq' && 'QCM'}
          {question.type === 'tf' && 'Vrai / Faux'}
          {question.type === 'fill' && 'Compléter la commande'}
        </span>
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-ink mb-5 leading-snug">
        {question.question}
      </h3>

      {question.type === 'mcq' && (
        <div className="space-y-2">
          {question.choices.map((choice, i) => {
            const isPicked = selection === i;
            const isRight = submitted && i === question.answer;
            const isWrongPicked = submitted && isPicked && i !== question.answer;
            return (
              <button
                key={i}
                type="button"
                disabled={submitted}
                onClick={() => setSelection(i)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all flex items-center gap-3 ${
                  isRight
                    ? 'border-success bg-success/10'
                    : isWrongPicked
                      ? 'border-danger bg-danger/10'
                      : isPicked
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-bg-page hover:border-ink/30 hover:bg-bg-card'
                } ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <span
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 ${
                    isRight
                      ? 'border-success bg-success text-white'
                      : isWrongPicked
                        ? 'border-danger bg-danger text-white'
                        : isPicked
                          ? 'border-primary bg-primary text-white'
                          : 'border-ink-soft/40 text-ink-soft'
                  }`}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-sm text-ink">{choice}</span>
              </button>
            );
          })}
        </div>
      )}

      {question.type === 'tf' && (
        <div className="grid grid-cols-2 gap-3">
          {[
            { val: true, label: 'Vrai' },
            { val: false, label: 'Faux' },
          ].map(({ val, label }) => {
            const isPicked = selection === val;
            const isRight = submitted && val === question.answer;
            const isWrongPicked =
              submitted && isPicked && val !== question.answer;
            return (
              <button
                key={label}
                type="button"
                disabled={submitted}
                onClick={() => setSelection(val)}
                className={`px-4 py-4 rounded-xl border-2 font-bold text-base transition-all ${
                  isRight
                    ? 'border-success bg-success/10 text-success'
                    : isWrongPicked
                      ? 'border-danger bg-danger/10 text-danger'
                      : isPicked
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border bg-bg-page text-ink hover:border-ink/30'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      {question.type === 'fill' && (
        <div className="font-mono text-sm bg-bg-code text-code-fg rounded-xl px-4 py-3 flex flex-wrap items-center gap-1">
          <span>{question.prefix}</span>
          <input
            type="text"
            value={fillValue}
            disabled={submitted}
            onChange={(e) => setFillValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (!submitted) handleSubmit();
                else handleNext();
              }
            }}
            placeholder="…"
            className={`bg-transparent border-b-2 px-1 outline-none min-w-[120px] text-center ${
              submitted
                ? isCorrect(question, fillValue)
                  ? 'border-success text-success'
                  : 'border-danger text-danger'
                : 'border-primary text-white'
            }`}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
          />
          <span>{question.suffix}</span>
        </div>
      )}

      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mt-5 flex items-start gap-2 rounded-xl px-4 py-3 text-sm border ${
              correct
                ? 'border-success/30 bg-success/10'
                : 'border-danger/30 bg-danger/10'
            }`}
          >
            {correct ? (
              <CheckCircle2 size={18} className="text-success shrink-0 mt-0.5" />
            ) : (
              <XCircle size={18} className="text-danger shrink-0 mt-0.5" />
            )}
            <div>
              <p className={`font-bold ${correct ? 'text-success' : 'text-danger'}`}>
                {correct ? 'Bonne réponse !' : 'Mauvaise réponse'}
              </p>
              <p className="text-ink-soft mt-0.5 leading-relaxed">
                {question.explanation}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 flex justify-end">
        {!submitted ? (
          <Button onClick={handleSubmit} disabled={!hasAnswered}>
            Valider
          </Button>
        ) : (
          <Button onClick={handleNext}>
            {index === total - 1 ? 'Voir le score' : 'Question suivante'}
            <ArrowRight size={15} />
          </Button>
        )}
      </div>
    </motion.div>
  );
}
