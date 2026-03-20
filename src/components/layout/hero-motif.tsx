/**
 * Decorative background SVG — faint pair of diverging risk curves
 * echoing the Kairos logo mark. Purely decorative, placed behind
 * hero sections via absolute positioning.
 */
export function HeroMotif({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 800 200"
      fill="none"
      className={className}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="motif-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--brand-blue, #6b93ef)" />
          <stop offset="50%" stopColor="var(--brand-purple, #b055f7)" />
          <stop offset="100%" stopColor="var(--brand-pink, #e04cb0)" />
        </linearGradient>
      </defs>
      {/* Lower curve — gentle rise (baseline population risk) */}
      <path
        d="M0 160 C200 155, 400 140, 600 120 S750 95, 800 80"
        stroke="url(#motif-grad)"
        strokeWidth="1.5"
        opacity="0.12"
      />
      {/* Upper curve — steeper rise (adjusted/elevated risk) */}
      <path
        d="M0 155 C200 140, 350 100, 500 60 S680 15, 800 5"
        stroke="url(#motif-grad)"
        strokeWidth="1.5"
        opacity="0.12"
      />
      {/* Decision node — where curves diverge */}
      <circle
        cx="200"
        cy="148"
        r="3"
        fill="url(#motif-grad)"
        opacity="0.15"
      />
    </svg>
  );
}
