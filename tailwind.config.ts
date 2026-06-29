import type { Config } from "tailwindcss";

/**
 * Atlantic Connect Marketing — design tokens.
 * Anchored to the real logo: Atlantic ocean blue + liquid chrome on deep navy.
 * "Two temperatures, one world": client surfaces lean cool (silver chrome),
 * talent surfaces warm the same navy with brighter azure + champagne/gold.
 * Values mirror src/app/globals.css CSS variables — keep them in sync.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Ground & surface
        bg: "var(--bg)",
        "bg-elev": "var(--bg-elev)",
        "bg-deep": "var(--bg-deep)",
        line: "var(--line)",
        // Brand light
        brand: "var(--brand)",
        "brand-bright": "var(--brand-bright)",
        "brand-deep": "var(--brand-deep)",
        // Text
        ink: "var(--ink)",
        muted: "var(--muted)",
        subtle: "var(--subtle)",
        // Metals (decoration / large-display only)
        "chrome-hi": "#F2F4F6",
        "chrome-mid": "#AEB7BF",
        "chrome-lo": "#4A5158",
        "gold-hi": "#F3E2BE",
        "gold-mid": "#E8C98A",
        "gold-lo": "#7A5E2E",
      },
      fontFamily: {
        // Headlines use Switzer (the neutral grotesque) for a cleaner, more
        // modern "dark-tech minimal" voice — hierarchy comes from weight/size/
        // tracking, not a stylised display face. (Clash Display retired from UI.)
        display: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        display: "-0.03em", // Clash Display floor — never tighter
      },
      borderRadius: {
        // Sharp, premium: structural panels 0–4px, cards/inputs 8–12px.
        panel: "4px",
        card: "12px",
      },
      maxWidth: {
        shell: "1440px",
        container: "1280px",
        prose: "68ch",
      },
      fontSize: {
        // Fluid display scale (clamp) — variable-weight kinetic headlines.
        "display-xl": ["clamp(2.75rem, 7vw, 6rem)", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(2.25rem, 5vw, 4.25rem)", { lineHeight: "1.08", letterSpacing: "-0.03em" }],
        "display-md": ["clamp(1.75rem, 3.4vw, 2.75rem)", { lineHeight: "1.12", letterSpacing: "-0.02em" }],
        eyebrow: ["0.8125rem", { lineHeight: "1.2", letterSpacing: "0.18em" }],
      },
      transitionTimingFunction: {
        // Reveal ease from the spec.
        reveal: "cubic-bezier(0.22, 1, 0.36, 1)",
        "expo-out": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      boxShadow: {
        // Used sparingly (never animated on many nodes). A defined cast, not a
        // soft "ghost-card" halo — these frames already carry a 1px border.
        lift: "0 18px 44px -22px rgba(2, 8, 16, 0.85)",
        glow: "0 0 40px -6px rgba(46, 151, 230, 0.45)",
      },
      keyframes: {
        "chrome-pan": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        // doubled-track marquee: -50% lands exactly on the second copy → seamless
        "team-marquee": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "chrome-pan": "chrome-pan 8s linear infinite",
        "fade-in": "fade-in 0.6s var(--ease-reveal, cubic-bezier(0.22,1,0.36,1)) both",
        "team-marquee": "team-marquee 32s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
