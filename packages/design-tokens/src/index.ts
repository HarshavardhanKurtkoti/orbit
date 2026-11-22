export const colors = {
  background: {
    base: '#070914',
    surface: '#101426',
    elevated: '#171B32',
    overlay: 'rgba(7, 9, 20, 0.78)',
  },
  accent: {
    violet: '#9366FF',
    violetHover: '#7C3AED',
    blue: '#38BDF8',
    cyan: '#22D3EE',
    glowViolet: 'rgba(147, 102, 255, 0.25)',
    glowCyan: 'rgba(34, 211, 238, 0.22)',
  },
  text: {
    primary: '#F8FAFC',
    secondary: '#A1ABC4',
    muted: '#626D8A',
    inverse: '#070914',
  },
  border: {
    subtle: 'rgba(255, 255, 255, 0.07)',
    medium: 'rgba(255, 255, 255, 0.12)',
    highlight: 'rgba(255, 255, 255, 0.22)',
    active: 'rgba(147, 102, 255, 0.55)',
  },
  glass: {
    subtle: {
      bg: 'rgba(16, 20, 38, 0.55)',
      border: 'rgba(255, 255, 255, 0.08)',
      blur: '12px',
      highlight: 'rgba(255, 255, 255, 0.06)',
    },
    standard: {
      bg: 'rgba(16, 20, 38, 0.72)',
      border: 'rgba(255, 255, 255, 0.12)',
      blur: '20px',
      highlight: 'rgba(255, 255, 255, 0.10)',
    },
    elevated: {
      bg: 'rgba(23, 27, 50, 0.85)',
      border: 'rgba(255, 255, 255, 0.18)',
      blur: '28px',
      highlight: 'rgba(255, 255, 255, 0.16)',
    },
  },
  status: {
    success: '#34D399',
    warning: '#FBBF24',
    error: '#FB7185',
    info: '#38BDF8',
  },
} as const;

export const typography = {
  fontFamily: {
    sans: 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
  },
} as const;

export const motionTokens = {
  duration: {
    instant: 0,
    press: 90,        // 80-150ms (Principle 8)
    hover: 120,       // 100-150ms
    fastClose: 130,   // Fast closing (Principle 18)
    normal: 220,      // Standard UI transitions (150-300ms)
    panel: 280,       // Large panels / sheets (250-400ms)
    staggerCascade: 280, // Max list cascade (Principle 3)
  },
  easing: {
    enter: [0.16, 1, 0.3, 1] as const,     // Slow in, slow out entrance (Principle 5)
    exit: [0.7, 0, 0.84, 0] as const,       // Fast exit (Principle 5 & 18)
    move: [0.65, 0, 0.35, 1] as const,      // Between spots (Principle 5)
    linear: [0, 0, 1, 1] as const,
  },
  spring: {
    snappy: { stiffness: 400, damping: 28, mass: 0.8 },
    gentle: { stiffness: 200, damping: 24, mass: 1 },
    bouncy: { stiffness: 350, damping: 18, mass: 1 }, // Follow-through (Principle 4)
    settling: { stiffness: 280, damping: 22, mass: 0.9 }, // Canvas node drop
  },
} as const;

export const spacing = {
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
} as const;

export const radius = {
  sm: '0.375rem', // 6px
  md: '0.5rem',   // 8px
  lg: '0.75rem',  // 12px
  xl: '1rem',     // 16px
  '2xl': '1.25rem', // 20px
  '3xl': '1.5rem', // 24px
  full: '9999px',
} as const;
