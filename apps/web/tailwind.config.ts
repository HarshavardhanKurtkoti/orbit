import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#080d10",
        background: {
          DEFAULT: "#080d10",
          surface: "#101918",
          subtle: "#0b1312",
          elevated: "#15221e",
          overlay: "rgba(8, 13, 16, 0.85)",
        },
        surface: {
          DEFAULT: "#101918",
          subtle: "#0b1312",
          raised: "#15221e",
          hover: "#1c2e29",
        },
        accent: {
          DEFAULT: "#a7f3d0",
          hover: "#86efac",
          mint: "#a7f3d0",
          signal: "#34d399",
          sky: "#38bdf8",
          amber: "#fbbf24",
          rose: "#f87171",
        },
        border: {
          DEFAULT: "#202e2b",
          line: "#202e2b",
          hairline: "#16221f",
        },
        orbit: {
          border: "#202e2b",
          borderHover: "rgba(167, 243, 208, 0.35)",
          textPrimary: "#f1f5f4",
          textSecondary: "#d6dedc",
          textMuted: "#9aaba8",
          textQuiet: "#6e807d",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["var(--font-geist-mono)", "JetBrains Mono", "ui-monospace", "monospace"],
        serif: ["Georgia", "Cambria", "Times New Roman", "Times", "serif"],
      },
      boxShadow: {
        "glass-sm": "0 2px 8px -2px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)",
        "glass-md": "0 10px 28px -6px rgba(0, 0, 0, 0.65), inset 0 1px 0 0 rgba(255, 255, 255, 0.07)",
        "glass-lg": "0 20px 48px -10px rgba(0, 0, 0, 0.8), inset 0 1px 0 0 rgba(255, 255, 255, 0.09)",
        "mint-subtle": "0 0 20px -3px rgba(167, 243, 208, 0.15)",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(200%)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.97)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        shimmer: "shimmer 2s infinite",
        "fade-in": "fade-in 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "scale-in": "scale-in 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
