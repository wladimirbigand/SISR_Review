import { Link, useLocation } from 'react-router-dom';
import { BookOpenCheck, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';

export default function Header({ onReset }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const location = useLocation();
  const onHome = location.pathname === '/';

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/85 backdrop-blur border-b border-border no-print">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 group">
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-white shadow-sm group-hover:rotate-3 transition-transform">
              <BookOpenCheck size={20} />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="font-extrabold text-ink text-base sm:text-lg tracking-tight">
                SISR Review
              </span>
              <span className="text-[11px] sm:text-xs text-ink-soft hidden sm:block">
                Épreuve pratique — Halieutis Sud-Ouest
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            {!onHome && (
              <Link
                to="/"
                className="text-sm text-ink-soft hover:text-ink px-3 py-1.5 rounded-lg hover:bg-bg-page transition-colors"
              >
                Accueil
              </Link>
            )}
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-ink-soft hover:text-primary hover:bg-primary/5 transition-colors"
              title="Réinitialiser ma progression"
            >
              <RotateCcw size={15} />
              <span className="hidden sm:inline">Réinitialiser</span>
            </button>
          </div>
        </div>
      </header>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Réinitialiser ma progression ?"
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
              Annuler
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                onReset?.();
                setConfirmOpen(false);
              }}
            >
              Tout réinitialiser
            </Button>
          </div>
        }
      >
        <p className="text-sm text-ink-soft leading-relaxed">
          Cette action va effacer toutes les étapes lues, les scores de quiz et la progression
          globale. Cette action est irréversible.
        </p>
      </Modal>
    </>
  );
}
