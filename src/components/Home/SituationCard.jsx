import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Server,
  ArrowRightLeft,
  ShieldCheck,
  Lock,
  FileText,
  Link as LinkIcon,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import Badge from '../UI/Badge';
import ProgressBar from './ProgressBar';

const iconMap = {
  Server,
  ArrowRightLeft,
  ShieldCheck,
  Lock,
  FileText,
  Link: LinkIcon,
};

export default function SituationCard({ situation, progress }) {
  const Icon = iconMap[situation.icon] ?? Server;
  const totalSteps = situation.steps.length;
  const readSteps = progress?.readSteps?.length ?? 0;
  const stepsPct = (readSteps / totalSteps) * 100;
  const completed = progress?.completed;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <Link
        to={`/situation/${situation.id}`}
        className="block bg-bg-card rounded-2xl border border-border shadow-card hover:shadow-cardHover hover:border-primary/30 transition-shadow duration-200 p-6 h-full group relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 -mr-12 -mt-12 rounded-full bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <Icon size={22} strokeWidth={2.2} />
              </div>
              <span className="font-mono text-xs text-ink-soft uppercase tracking-wider">
                Situation {String(situation.number).padStart(2, '0')}
              </span>
            </div>
            {completed && (
              <Badge tone="success" className="shrink-0">
                <CheckCircle2 size={12} strokeWidth={2.6} />
                Complété
              </Badge>
            )}
          </div>
          <h3 className="text-lg font-bold text-ink mb-2 leading-snug">
            {situation.title}
          </h3>
          <p className="text-sm text-ink-soft leading-relaxed mb-5 line-clamp-3">
            {situation.objective}
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-ink-soft">
                {readSteps} / {totalSteps} étapes
              </span>
              {progress?.quizDone && (
                <span className="text-ink-soft">
                  Quiz : <span className="font-semibold text-ink">{progress.quizScore}/5</span>
                </span>
              )}
            </div>
            <ProgressBar
              value={stepsPct}
              size="sm"
              tone={completed ? 'success' : 'primary'}
            />
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-primary text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
            Ouvrir la situation
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
