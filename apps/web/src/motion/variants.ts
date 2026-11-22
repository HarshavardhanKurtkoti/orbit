import { Variants } from "framer-motion";
import { motionTokens } from "./tokens";

// Principle 1: Squash and stretch (for buttons, icons, card drops)
export const squashStretchVariant: Variants = {
  idle: { scaleX: 1, scaleY: 1 },
  press: {
    scaleX: 1.08,
    scaleY: 0.92,
    transition: { duration: motionTokens.duration.press, ease: motionTokens.easing.enter },
  },
  release: {
    scaleX: 1,
    scaleY: 1,
    transition: { type: "spring", stiffness: 450, damping: 25 },
  },
};

// Principle 2: Anticipation (pre-flight wind-up before launch)
export const anticipationVariant: Variants = {
  initial: { x: 0, opacity: 1 },
  windup: {
    x: -8,
    transition: { duration: 0.1, ease: "easeIn" },
  },
  launch: {
    x: 120,
    opacity: 0,
    transition: { duration: 0.22, ease: motionTokens.easing.enter },
  },
};

// Principle 3: Stagger (cascade capped under 280ms)
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: motionTokens.duration.staggerDelta,
      delayChildren: 0.02,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: motionTokens.duration.normal, ease: motionTokens.easing.enter },
  },
};

// Principle 4 & 5: Modal & Sheet with Fast Closing (Principle 18)
export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.94,
    y: 8,
    transition: { duration: motionTokens.duration.fastClose, ease: motionTokens.easing.exit },
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: motionTokens.duration.normal, ease: motionTokens.easing.enter },
  },
};

export const inspectorSheetVariants: Variants = {
  hidden: {
    x: "100%",
    opacity: 0.4,
    transition: { duration: motionTokens.duration.fastClose, ease: motionTokens.easing.exit },
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: motionTokens.duration.panel, ease: motionTokens.easing.enter },
  },
};

// Principle 9: Exaggerated Feedback (3-cycle error shake & milestone pop)
export const errorShakeVariants: Variants = {
  idle: { x: 0 },
  shake: {
    x: [0, -8, 8, -6, 6, -2, 2, 0],
    transition: { duration: 0.28, ease: "easeInOut" },
  },
};

export const milestonePopVariants: Variants = {
  initial: { scale: 1 },
  pop: {
    scale: [1, 1.18, 0.96, 1],
    transition: { duration: 0.35, ease: motionTokens.easing.enter },
  },
};

// Principle 10: 3D Depth Card Tilt Helpers
export const cardHover3D = {
  rest: { rotateX: 0, rotateY: 0, scale: 1, zIndex: 1 },
  hover: {
    scale: 1.02,
    zIndex: 10,
    transition: { duration: motionTokens.duration.hover, ease: motionTokens.easing.enter },
  },
};

// Principle 11: Command Palette (Principle 20: Frequency of Use - Ultra lean & zero fluff)
export const commandPaletteVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.98,
    transition: { duration: 0.08, ease: "easeIn" },
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.12, ease: "easeOut" },
  },
};
