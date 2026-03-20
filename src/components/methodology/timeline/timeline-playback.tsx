"use client";

import type { GestationalAgeDays } from "@/data/types";
import { gaToWeeksAndDays } from "@/lib/utils/ga-format";
import { GA_WEEKS, useTimelinePlayback } from "./use-timeline-playback";

interface TimelinePlaybackProps {
  currentGA: GestationalAgeDays;
  setGA: (ga: GestationalAgeDays) => void;
}

export function TimelinePlayback({ currentGA, setGA }: TimelinePlaybackProps) {
  const {
    isPlaying,
    speed,
    togglePlay,
    setSpeed,
    stepForward,
    stepBackward,
  } = useTimelinePlayback(currentGA, setGA);

  const { weeks, days } = gaToWeeksAndDays(currentGA);
  const currentIndex = GA_WEEKS.indexOf(
    currentGA as (typeof GA_WEEKS)[number]
  );

  return (
    <div
      className="flex items-center justify-center gap-4 py-3"
      role="toolbar"
      aria-label="Timeline playback controls"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          stepForward();
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          stepBackward();
        } else if (e.key === " ") {
          e.preventDefault();
          togglePlay();
        }
      }}
      tabIndex={0}
    >
      {/* Play/Pause */}
      <button
        onClick={togglePlay}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform hover:scale-105 active:scale-95"
        aria-label={isPlaying ? "Pause playback" : "Play timeline"}
      >
        <span className="text-sm">{isPlaying ? "⏸" : "▶"}</span>
      </button>

      {/* Current week */}
      <span className="text-sm font-semibold tabular-nums min-w-[5rem] text-center">
        {weeks}w{days}d
      </span>

      {/* Progress dots */}
      <div className="flex items-center gap-1.5" aria-hidden="true">
        {GA_WEEKS.map((ga, i) => (
          <button
            key={ga}
            onClick={() => setGA(ga)}
            className={`h-2.5 w-2.5 rounded-full transition-all duration-200 ${
              i <= currentIndex
                ? "bg-primary scale-100"
                : "bg-muted-foreground/25 scale-90"
            } ${ga === currentGA ? "ring-2 ring-primary/30 scale-110" : ""}`}
            aria-label={`Go to ${Math.floor(ga / 7)} weeks`}
          />
        ))}
      </div>

      {/* Speed toggle */}
      <button
        onClick={() => setSpeed(speed === "1x" ? "2x" : "1x")}
        className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors px-1.5 py-0.5 rounded border"
        aria-label={`Playback speed: ${speed}`}
      >
        {speed}
      </button>
    </div>
  );
}
