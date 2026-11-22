export const motionTokens = {
  duration: {
    instant: 0,
    press: 0.09,          // 90ms (Principle 8: Snappy timing)
    hover: 0.12,          // 120ms
    fastClose: 0.13,      // 130ms (Principle 18: Fast closing)
    normal: 0.22,         // 220ms (Standard transitions)
    panel: 0.28,          // 280ms (Large sheets/inspectors)
    staggerDelta: 0.035,  // 35ms between items (Principle 3)
    maxCascade: 0.28,     // 280ms maximum cascade cap
  },
  easing: {
    enter: [0.16, 1, 0.3, 1] as const,     // Slow in, slow out (Principle 5)
    exit: [0.7, 0, 0.84, 0] as const,       // Fast leaving
    move: [0.65, 0, 0.35, 1] as const,      // Mid-flight
    linear: [0, 0, 1, 1] as const,
  },
  spring: {
    snappy: { type: "spring", stiffness: 450, damping: 30, mass: 0.8 },
    gentle: { type: "spring", stiffness: 220, damping: 25, mass: 1 },
    bouncy: { type: "spring", stiffness: 380, damping: 18, mass: 1 },       // Follow-through (Principle 4)
    settling: { type: "spring", stiffness: 300, damping: 24, mass: 0.9 },    // Node release
  },
} as const;
