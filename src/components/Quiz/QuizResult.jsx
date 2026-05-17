import { motion } from 'framer-motion';
import { Trophy, RefreshCcw, Home, ChevronRight, AlertTriangle, ThumbsUp, Sparkles } from 'lucide-react';
import Button from '../UI/Button';

function getFeedback(score, total) {
  if (score === total) {
    return {
      tone: 'success',
      title: 'Parfait !',
      msg: 'Tu maîtrises cette situation.',
      Icon: Sparkles,
    };
  }
  if (score >= 3) {
    return {
      tone: 'warning',
      title: 'Bien joué',
      msg: 'mais revois les points manqués.',
      Icon: ThumbsUp,
    };
  }
  return {
    tone: 'danger',
    title: 'À retravailler',
    msg: 'Il faut revoir cette situation. Reprends les étapes !',
    Icon: AlertTriangle,
  };
}

const toneColors = {
  success: { ring: 'ring-success/30', bg: 'bg-success/10', text: 'text-success' },
  warning: { ring: 'ring-warning/30', bg: 'bg-warning/10', text: 'text-warning' },
  danger: { ring: 'ring-danger/30', bg: 'bg-danger/10', text: 'text-danger' },
};

export default function QuizResult({ score, total, onRetry, onShowRecap, onGoHome }) {
  const fb = getFeedback(score, total);
  const colors = toneColors[fb.tone];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, type: 'spring' }}
      className="bg-bg-card border border-border rounded-2xl shadow-card p-6 sm:p-10 text-center"
    >
      <div
        className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-5 ring-8 ${colors.ring} ${colors.bg}`}
      >
        <fb.Icon size={36} className={colors.text} strokeWidth={2} />
      </div>
      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink">
        {fb.title}
      </h2>
      <p className="text-ink-soft mt-1">{fb.msg}</p>

      <div className="mt-6 inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-bg-page border border-border">
        <Trophy size={22} className="text-primary" />
        <span className="text-3xl font-extrabold tabular-nums text-ink">
          {score}
        </span>
        <span className="text-ink-soft text-lg">/ {total}</span>
      </div>

      <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
        <Button variant="secondary" onClick={onRetry}>
          <RefreshCcw size={15} />
          Revoir les étapes
        </Button>
        <Button onClick={onShowRecap}>
          Voir le récapitulatif
          <ChevronRight size={15} />
        </Button>
        <Button variant="ghost" onClick={onGoHome}>
          <Home size={15} />
          Accueil
        </Button>
      </div>
    </motion.div>
  );
}
