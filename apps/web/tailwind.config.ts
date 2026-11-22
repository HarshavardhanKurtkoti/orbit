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
        background: {
          DEFAULT: "#070914",
          surface: "#101426",
          elevated: "#171B32",
          overlay: "rgba(7, 9, 20, 0.78)",
        },
        accent: {
          DEFAULT: "#9366FF",
          hover: "#7C3AED",
          blue: "#38BDF8",
          cyan: "#22D3EE",
          emerald: "#34D399",
          glowViolet: "rgba(147, 102, 255, 0.25)",
          glowCyan: "rgba(34, 211, 238, 0.22)",
        },
        orbit: {
          border: "rgba(255, 255, 255, 0.08)",
          borderHover: "rgba(255, 255, 255, 0.16)",
          textPrimary: "#F8FAFC",
          textSecondary: "#A1ABC4",
          textMuted: "#626D8A",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        "glass-sm": "0 2px 10px -2px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)",
        "glass-md": "0 8px 30px -4px rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.12)",
        "glass-lg": "0 20px 48px -8px rgba(0, 0, 0, 0.75), inset 0 1px 0 0 rgba(255, 255, 255, 0.18)",
        "glow-violet": "0 0 35px -5px rgba(147, 102, 255, 0.35)",
        "glow-cyan": "0 0 35px -5px rgba(34, 211, 238, 0.30)",
        "glow-emerald": "0 0 35px -5px rgba(52, 211, 153, 0.30)",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(200%)" },
        },
        dash: {
          to: { "stroke-dashoffset": "-100" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
      },
      animation: {
        shimmer: "shimmer 2s infinite",
        dash: "dash 20s linear infinite",
        "fade-in": "fade-in 0.3s ease-out forwards",
        "scale-in": "scale-in 0.2s ease-out forwards",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
