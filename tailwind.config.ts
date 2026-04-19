import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Sora", "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        background: "#0a0f1a",
        surface: "#0f1629",
        "surface-2": "#141d35",
        border: "#1e2d4a",
        "border-2": "#243353",
        accent: "#3b82f6",
        "accent-2": "#6366f1",
        "accent-glow": "rgba(59,130,246,0.15)",
        muted: "#64748b",
        "muted-2": "#94a3b8",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-hero":
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59,130,246,0.15), transparent)",
        "gradient-card":
          "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
        glow: "0 0 40px rgba(59,130,246,0.2)",
        "glow-sm": "0 0 20px rgba(59,130,246,0.15)",
        card: "0 4px 24px rgba(0,0,0,0.3)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
        "bounce-slow": "bounce 2s ease-in-out infinite",
        typing: "typing 1.2s steps(3) infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        typing: {
          "0%, 100%": { content: "." },
          "33%": { content: ".." },
          "66%": { content: "..." },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
