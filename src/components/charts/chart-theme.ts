/**
 * Chart color theme using CSS custom properties.
 *
 * These reference tokens defined in globals.css, which are automatically
 * overridden by the `.chart-dark` class on the chart container.
 * This keeps chart colors in sync with the app's design token system.
 */
export const chartColors = {
  baseline: "var(--chart-baseline)",
  adjusted: "var(--chart-adjusted)",
  ci: "var(--chart-ci)",
  safe: "var(--chart-zone-safe)",
  caution: "var(--chart-zone-caution)",
  danger: "var(--chart-zone-danger)",
  grid: "var(--chart-grid)",
  text: "var(--chart-text)",
  // Semantic colors for specific outcomes (unchanged)
  fluid: "var(--evidence-moderate)",
  meconium: "var(--ga-caution)",
  macrosomia: "var(--ga-safe)",
  stillbirth: "var(--chart-adjusted)",
};

export const chartFont = {
  family: "var(--font-geist-sans), system-ui, sans-serif",
  size: 12,
};
