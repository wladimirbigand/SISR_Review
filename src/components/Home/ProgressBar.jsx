import { motion } from 'framer-motion';

export default function ProgressBar({
  value,
  max = 100,
  showLabel = false,
  size = 'md',
  tone = 'primary',
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const heights = { sm: 'h-1.5', md: 'h-2', lg: 'h-3' };
  const tones = {
    primary: 'bg-primary',
    success: 'bg-success',
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5 text-xs text-ink-soft">
          <span>Progression</span>
          <span className="font-semibold text-ink tabular-nums">{Math.round(pct)}%</span>
        </div>
      )}
      <div className={`w-full ${heights[size]} bg-border/70 rounded-full overflow-hidden`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`${heights[size]} ${tones[tone]} rounded-full`}
        />
      </div>
    </div>
  );
}
