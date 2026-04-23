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
        sans:    ["DM Sans", "system-ui", "sans-serif"],
        display: ["Instrument Serif", "Georgia", "serif"],
        body:    ["DM Sans", "system-ui", "sans-serif"],
      },
      colors: {
        background:     "#F7F5F0",
        surface:        "#FFFFFF",
        "bg-blue":      "#F0F5FF",
        "bg-grey":      "#FAFAF8",
        border:         "#E5E2DB",
        "text-primary": "#1A1A2E",
        "text-secondary":"#4A5568",
        "text-muted":   "#94A3B8",
        accent:         "#1B4FD8",
        "accent-light": "#EEF2FF",
        "accent-mid":   "#DBEAFE",
        "accent-warm":  "#E8B84B",
        "accent-warm-light": "#FEF3C7",
        dark:           "#0F172A",
        darker:         "#0A0F1A",
        green:          "#22C55E",
      },
      boxShadow: {
        sm:    "0 2px 4px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)",
        md:    "0 4px 8px rgba(0,0,0,0.04), 0 16px 40px rgba(0,0,0,0.07)",
        lg:    "0 8px 16px rgba(0,0,0,0.05), 0 32px 80px rgba(0,0,0,0.09)",
        phone: "0 40px 80px rgba(0,0,0,0.18), 0 20px 40px rgba(27,79,216,0.12)",
      },
      borderRadius: {
        "2xl": "20px",
        "3xl": "24px",
        "4xl": "32px",
        "5xl": "50px",
      },
      animation: {
        "fade-in":  "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        float:      "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn:  { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: { from: { opacity: "0", transform: "translateY(24px)" }, to: { opacity: "1", transform: "translateY(0)" } },
      },
    },
  },
  plugins: [],
};

export default config;
