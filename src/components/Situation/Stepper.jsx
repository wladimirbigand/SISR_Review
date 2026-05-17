import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function Stepper({ total, current, readSet, onJump }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {Array.from({ length: total }).map((_, idx) => {
        const isCurrent = idx === current;
        const isRead = readSet?.has(idx);
        const canJump = isRead || idx < current;
        const base =
          'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all';
        let style;
        if (isCurrent) {
          style = 'bg-primary text-white shadow-sm ring-4 ring-primary/15';
        } else if (isRead) {
          style = 'bg-success text-white hover:bg-success/90 cursor-pointer';
        } else {
          style = 'bg-bg-page text-ink-soft border border-border';
        }
        return (
          <motion.button
            key={idx}
            type="button"
            initial={false}
            whileHover={canJump ? { scale: 1.05 } : {}}
            whileTap={canJump ? { scale: 0.95 } : {}}
            disabled={!canJump}
            onClick={() => canJump && onJump?.(idx)}
            className={`${base} ${style} ${!canJump ? 'cursor-not-allowed' : ''}`}
            aria-label={`Étape ${idx + 1}`}
          >
            {isRead && !isCurrent ? <Check size={15} strokeWidth={3} /> : idx + 1}
          </motion.button>
        );
      })}
    </div>
  );
}
