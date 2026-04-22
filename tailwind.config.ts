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
        sans: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      colors: {
        background: "#FAFAF8",
        surface: "#FFFFFF",
        border: "#E8E8E4",
        "text-primary": "#1A1A2E",
        "text-secondary": "#4A5568",
        accent: "#1B4FD8",
        "accent-warm": "#E8B84B",
        "accent-light": "#EEF2FF",
        muted: "#718096",
        "muted-2": "#A0AEC0",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-hero":
          "radial-gradient(ellipse 80% 60% at 60% 40%, #EEF2FF 0%, #FAFAF8 70%)",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
        "card-lg": "0 4px 12px rgba(0,0,0,0.08), 0 12px 32px rgba(0,0,0,0.07)",
        "phone": "0 24px 64px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.12)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "pulse-slow": "pulse 3s ease-in-out infinite",
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
      },
    },
  },
  plugins: [],
};

export default config;
