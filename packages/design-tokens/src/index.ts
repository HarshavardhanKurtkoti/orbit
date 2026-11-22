export const colors = {
  background: {
    primary: '#08090D',
    secondary: '#11131A',
    elevated: '#191C26',
    overlay: 'rgba(8, 9, 13, 0.75)',
  },
  accent: {
    primary: '#8B5CF6',     // Violet 500
    primaryHover: '#7C3AED',// Violet 600
    secondary: '#38BDF8',   // Sky 400
    secondaryHover: '#0EA5E9',
    glow: 'rgba(139, 92, 246, 0.25)',
  },
  text: {
    primary: '#F8FAFC',     // Slate 50
    secondary: '#94A3B8',   // Slate 400
    muted: '#64748B',       // Slate 500
    inverse: '#08090D',
  },
  border: {
    subtle: 'rgba(255, 255, 255, 0.08)',
    medium: 'rgba(255, 255, 255, 0.14)',
    active: 'rgba(139, 92, 246, 0.5)',
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
  full: '9999px',
} as const;
