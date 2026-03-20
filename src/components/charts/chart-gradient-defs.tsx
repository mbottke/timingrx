/**
 * SVG <defs> for chart gradients.
 * Render as a child of any Recharts chart component (ComposedChart, LineChart, etc.)
 * to enable gradient strokes/fills via url(#kairos-chart-baseline), etc.
 */
export function ChartGradientDefs() {
  return (
    <defs>
      <linearGradient id="kairos-chart-baseline" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="var(--brand-blue)" />
        <stop offset="100%" stopColor="var(--brand-purple)" />
      </linearGradient>
      <linearGradient id="kairos-chart-adjusted" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="var(--brand-purple)" />
        <stop offset="100%" stopColor="var(--brand-pink)" />
      </linearGradient>
      <linearGradient id="kairos-chart-ci" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="var(--brand-purple)" stopOpacity="0.15" />
        <stop offset="100%" stopColor="var(--brand-pink)" stopOpacity="0.15" />
      </linearGradient>
    </defs>
  );
}
