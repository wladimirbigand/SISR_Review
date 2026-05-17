import { Printer, FileCode2, Terminal, FlaskConical, Sparkles, Home } from 'lucide-react';
import Button from '../UI/Button';
import { Link } from 'react-router-dom';

export default function RecapCard({ situation }) {
  const { recap } = situation;
  return (
    <div className="print-area">
      <div className="bg-bg-card border border-border rounded-2xl shadow-card p-6 sm:p-8">
        <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-primary font-bold">
              Récapitulatif — Situation {situation.number}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink mt-1">
              {situation.title}
            </h2>
            <p className="text-ink-soft mt-1 text-sm leading-relaxed max-w-2xl">
              {situation.objective}
            </p>
          </div>
          <div className="flex items-center gap-2 no-print">
            <Button variant="secondary" onClick={() => window.print()}>
              <Printer size={15} />
              Imprimer / Exporter
            </Button>
            <Link to="/" className="hidden sm:inline-flex">
              <Button variant="ghost">
                <Home size={15} />
                Accueil
              </Button>
            </Link>
          </div>
        </div>

        <Section icon={Terminal} title="Commandes clés à exécuter dans l'ordre">
          <ol className="space-y-1.5 list-decimal pl-5">
            {recap.commands.map((cmd, i) => (
              <li key={i} className="text-sm">
                <code className="font-mono bg-bg-code text-code-fg px-2 py-1 rounded text-xs break-all inline-block">
                  {cmd}
                </code>
              </li>
            ))}
          </ol>
        </Section>

        <Section icon={FileCode2} title="Fichiers modifiés">
          <ul className="space-y-2">
            {recap.files.map((f, i) => (
              <li key={i} className="text-sm flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                <code className="font-mono text-primary font-semibold text-xs sm:text-sm whitespace-nowrap">
                  {f.path}
                </code>
                <span className="text-ink-soft">— {f.note}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section icon={FlaskConical} title="Test de recette">
          <div className="bg-bg-code text-code-fg rounded-xl p-4 font-mono text-sm">
            <div className="text-warning mb-1 text-xs uppercase tracking-wider">
              Commande
            </div>
            <div className="mb-3 break-all">{recap.test.command}</div>
            <div className="text-success mb-1 text-xs uppercase tracking-wider">
              Résultat attendu
            </div>
            <div className="break-all">{recap.test.expected}</div>
          </div>
        </Section>

        <Section icon={Sparkles} title="Points clés à retenir" last>
          <ul className="space-y-2">
            {recap.keyPoints.map((p, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <span className="text-ink leading-relaxed">{p}</span>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, children, last }) {
  return (
    <div className={last ? '' : 'mb-7'}>
      <div className="flex items-center gap-2 mb-3">
        <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
          <Icon size={16} />
        </span>
        <h3 className="font-bold text-ink">{title}</h3>
      </div>
      <div className="pl-1 sm:pl-10">{children}</div>
    </div>
  );
}
