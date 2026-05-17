/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#D70A53',
          dark: '#B00845',
        },
        bg: {
          page: '#F7F7F8',
          card: '#FFFFFF',
          code: '#1E1E2E',
        },
        ink: {
          DEFAULT: '#1A1A2E',
          soft: '#6B7280',
        },
        border: {
          DEFAULT: '#E5E7EB',
        },
        code: {
          fg: '#E2E8F0',
        },
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06)',
        cardHover: '0 10px 25px rgba(16,24,40,0.08), 0 4px 10px rgba(16,24,40,0.05)',
        terminal: '0 10px 30px rgba(0,0,0,0.25)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: 0, transform: 'translateY(4px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 200ms ease-out',
      },
    },
  },
  plugins: [],
};
