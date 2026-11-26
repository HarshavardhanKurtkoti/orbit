export const colors = {
  canvas: '#080d10',
  background: {
    base: '#080d10',
    surface: '#101918',
    surfaceSubtle: '#0b1312',
    elevated: '#15221e',
    elevatedHover: '#1c2e29',
    overlay: 'rgba(8, 13, 16, 0.85)',
  },
  accent: {
    mint: '#a7f3d0',
    mintHover: '#86efac',
    mintSubtle: 'rgba(167, 243, 208, 0.08)',
    mintBorder: 'rgba(167, 243, 208, 0.22)',
    signal: '#34d399',
    signalSubtle: 'rgba(52, 211, 153, 0.12)',
    sky: '#38bdf8',
    skySubtle: 'rgba(56, 189, 248, 0.12)',
    amber: '#fbbf24',
    amberSubtle: 'rgba(251, 191, 36, 0.12)',
    rose: '#f87171',
    roseSubtle: 'rgba(248, 113, 113, 0.12)',
  },
  text: {
    primary: '#f1f5f4',
    secondary: '#d6dedc',
    muted: '#9aaba8',
    quiet: '#6e807d',
    inverse: '#080d10',
  },
  border: {
    line: '#202e2b',
    hairline: '#16221f',
    subtle: 'rgba(32, 46, 43, 0.6)',
    highlight: 'rgba(255, 255, 255, 0.08)',
    active: 'rgba(167, 243, 208, 0.35)',
  },
  glass: {
    subtle: {
      bg: 'rgba(16, 25, 24, 0.55)',
      border: '#16221f',
      blur: '12px',
      highlight: 'rgba(255, 255, 255, 0.04)',
    },
    standard: {
      bg: 'rgba(16, 25, 24, 0.75)',
      border: '#202e2b',
      blur: '18px',
      highlight: 'rgba(255, 255, 255, 0.06)',
    },
    elevated: {
      bg: 'rgba(21, 34, 30, 0.88)',
      border: '#2a3d38',
      blur: '24px',
      highlight: 'rgba(255, 255, 255, 0.09)',
    },
  },
  status: {
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#38bdf8',
  },
  node: {
    project: '#a7f3d0',
    task: '#38bdf8',
    note: '#fbbf24',
    goal: '#34d399',
  },
} as const;

export const typography = {
  fontFamily: {
    sans: 'var(--font-geist-sans), system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'var(--font-geist-mono), "JetBrains Mono", Consolas, monospace',
    serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
  },
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
  },
} as const;

export const motionTokens = {
  duration: {
    instant: 0,
    press: 90,           // 80-150ms (Principle 8: Snappy timing)
    hover: 120,          // 100-150ms
    fastClose: 130,      // Fast closing (Principle 18)
    normal: 220,         // Standard UI transitions (150-300ms)
    panel: 280,          // Large panels / sheets (250-400ms)
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
    bouncy: { stiffness: 350, damping: 18, mass: 1 },     // Follow-through (Principle 4)
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
  full: '9999px',
} as const;
