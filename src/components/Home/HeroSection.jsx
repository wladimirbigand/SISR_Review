import { useState } from 'react';
import { motion } from 'framer-motion';
import { Info, Terminal } from 'lucide-react';
import Button from '../UI/Button';
import Modal from '../UI/Modal';
import { context } from '../../data/situations';

export default function HeroSection() {
  const [open, setOpen] = useState(false);
  return (
    <section className="pt-10 pb-12 sm:pt-14 sm:pb-16">
      <div className="max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4"
        >
          <Terminal size={13} />
          BTS SIO · option SISR
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-ink mb-4 leading-[1.1]"
        >
          Prépare ton épreuve pratique,{' '}
          <span className="text-primary">étape par étape</span>.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-base sm:text-lg text-ink-soft leading-relaxed mb-6"
        >
          Halieutis Sud-Ouest modernise son infrastructure sur Debian 13 mutualisé.
          Six techniciens, six lots de configuration : Apache, Nginx, HTTPS, authentification,
          logs et réécriture d'URL. Révise chaque situation au calme avant le jour J.
        </motion.p>
        <Button variant="secondary" onClick={() => setOpen(true)}>
          <Info size={16} />
          En savoir plus sur le contexte
        </Button>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Contexte complet de l'épreuve">
        <div className="space-y-5 text-sm text-ink leading-relaxed">
          <div>
            <h4 className="font-bold text-ink mb-1">Organisation</h4>
            <p className="text-ink-soft">{context.organization}</p>
          </div>
          <div>
            <h4 className="font-bold text-ink mb-1">Mission</h4>
            <p className="text-ink-soft">{context.mission}</p>
          </div>
          <div>
            <h4 className="font-bold text-ink mb-1">Scénario</h4>
            <p className="text-ink-soft">{context.scenario}</p>
          </div>
          <div>
            <h4 className="font-bold text-ink mb-1">Environnement technique</h4>
            <ul className="list-disc pl-5 text-ink-soft space-y-1">
              {context.environment.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-ink mb-1">Contraintes</h4>
            <ul className="list-disc pl-5 text-ink-soft space-y-1">
              {context.constraints.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-ink mb-1">Organisation de l'épreuve</h4>
            <p className="text-ink-soft">{context.exam}</p>
          </div>
        </div>
      </Modal>
    </section>
  );
}
