import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="Fil d'Ariane" className="text-sm text-ink-soft mb-6 flex flex-wrap items-center gap-1.5 no-print">
      {items.map((item, idx) => {
        const last = idx === items.length - 1;
        return (
          <span key={idx} className="inline-flex items-center gap-1.5">
            {item.to && !last ? (
              <Link to={item.to} className="hover:text-primary transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={last ? 'text-ink font-semibold' : ''}>{item.label}</span>
            )}
            {!last && <ChevronRight size={14} className="text-ink-soft/60" />}
          </span>
        );
      })}
    </nav>
  );
}
