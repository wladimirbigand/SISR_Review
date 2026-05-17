import { motion } from 'framer-motion';

const variants = {
  primary:
    'bg-primary text-white hover:bg-primary-dark shadow-sm disabled:bg-primary/40 disabled:cursor-not-allowed',
  secondary:
    'bg-white text-ink border border-border hover:border-ink/30 hover:bg-bg-page disabled:opacity-50 disabled:cursor-not-allowed',
  ghost:
    'bg-transparent text-ink hover:bg-bg-page disabled:opacity-40 disabled:cursor-not-allowed',
  danger:
    'bg-danger text-white hover:bg-danger/90 disabled:opacity-50 disabled:cursor-not-allowed',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-4 py-2 text-sm rounded-xl',
  lg: 'px-5 py-3 text-base rounded-xl',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: props.disabled ? 1 : 1.02 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-colors ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
