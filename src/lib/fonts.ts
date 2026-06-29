import localFont from "next/font/local";

/**
 * Self-hosted variable fonts (Fontshare → /public/fonts), VPS-ready.
 * Clash Display: kinetic premium grotesque - its weight axis (200–700)
 * drives the scroll-reactive headline (the "Energy" value, made literal).
 * Switzer: neutral, highly legible grotesque for all running text + UI.
 */
export const clashDisplay = localFont({
  src: "../../public/fonts/ClashDisplay-Variable.woff2",
  variable: "--font-display",
  weight: "200 700",
  display: "swap",
  preload: true,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const switzer = localFont({
  src: "../../public/fonts/Switzer-Variable.woff2",
  variable: "--font-body",
  weight: "100 900",
  display: "swap",
  preload: true,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});
