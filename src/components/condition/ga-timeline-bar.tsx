interface Props {
  earliestGA: number; // GestationalAgeDays
  latestGA: number;
}

export function GATimelineBar({ earliestGA, latestGA }: Props) {
  const minGA = 34 * 7; // 238 days
  const maxGA = 42 * 7; // 294 days
  const range = maxGA - minGA;

  const leftPercent = Math.max(0, ((earliestGA - minGA) / range) * 100);
  const rightPercent = Math.min(100, ((latestGA - minGA) / range) * 100);
  const widthPercent = rightPercent - leftPercent;

  return (
    <div className="relative h-1 w-full bg-muted rounded-full overflow-hidden">
      <div
        className="absolute top-0 h-full rounded-full"
        style={{
          left: `${leftPercent}%`,
          width: `${widthPercent}%`,
          background: "var(--kairos-gradient)",
        }}
      />
    </div>
  );
}
