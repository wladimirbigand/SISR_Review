import { motion } from 'framer-motion';
import HeroSection from '../components/Home/HeroSection';
import SituationCard from '../components/Home/SituationCard';
import ProgressBar from '../components/Home/ProgressBar';
import { situations } from '../data/situations';
import { Trophy } from 'lucide-react';

export default function Home({ progress }) {
  const completed = situations.filter(
    (s) => progress.getSituationProgress(s.id).completed,
  ).length;

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6">
      <HeroSection />

      <section className="mb-8">
        <div className="bg-bg-card rounded-2xl border border-border shadow-card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Trophy size={18} className="text-primary" />
              <h2 className="font-bold text-ink">Progression globale</h2>
            </div>
            <span className="text-sm text-ink-soft">
              <span className="font-bold text-ink tabular-nums">{completed}</span> / {situations.length}{' '}
              situations complétées
            </span>
          </div>
          <ProgressBar
            value={progress.globalProgressPercent}
            tone={progress.globalProgressPercent === 100 ? 'success' : 'primary'}
            size="lg"
          />
        </div>
      </section>

      <section className="mb-12">
        <div className="flex items-baseline justify-between mb-6 flex-wrap gap-2">
          <h2 className="text-xl sm:text-2xl font-extrabold text-ink tracking-tight">
            Les 6 situations à maîtriser
          </h2>
          <span className="text-sm text-ink-soft">
            Choisis une situation pour démarrer
          </span>
        </div>
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.05 } },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {situations.map((s) => (
            <motion.div
              key={s.id}
              variants={{
                hidden: { opacity: 0, y: 12 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <SituationCard
                situation={s}
                progress={progress.getSituationProgress(s.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      </section>
    </main>
  );
}
