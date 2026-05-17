const tones = {
  default: 'bg-bg-page text-ink-soft border border-border',
  primary: 'bg-primary/10 text-primary border border-primary/20',
  success: 'bg-success/10 text-success border border-success/20',
  warning: 'bg-warning/10 text-warning border border-warning/30',
  danger: 'bg-danger/10 text-danger border border-danger/20',
  dark: 'bg-ink text-white border border-ink',
};

export default function Badge({ tone = 'default', className = '', children }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
