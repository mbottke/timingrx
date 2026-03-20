import { useCallback, useEffect, useRef, useState } from "react";
import type { GestationalAgeDays } from "@/data/types";
import { w } from "@/data/helpers";

const GA_WEEKS = [w(37), w(38), w(39), w(40), w(41), w(42)] as const;
const SPEEDS = { "1x": 2000, "2x": 1000 } as const;
type PlaybackSpeed = keyof typeof SPEEDS;

interface PlaybackState {
  isPlaying: boolean;
  speed: PlaybackSpeed;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  setSpeed: (speed: PlaybackSpeed) => void;
  stepForward: () => void;
  stepBackward: () => void;
}

export function useTimelinePlayback(
  currentGA: GestationalAgeDays,
  setGA: (ga: GestationalAgeDays) => void
): PlaybackState {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<PlaybackSpeed>("1x");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Track currentGA via ref so the interval callback always has the latest value
  const gaRef = useRef(currentGA);
  gaRef.current = currentGA;

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const play = useCallback(() => {
    // If at the end, restart from 37w
    if (currentGA >= w(42)) {
      setGA(w(37));
    }
    setIsPlaying(true);
  }, [currentGA, setGA]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    clearTimer();
  }, [clearTimer]);

  const togglePlay = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, play, pause]);

  const stepForward = useCallback(() => {
    const idx = GA_WEEKS.findIndex((g) => g === currentGA);
    if (idx < GA_WEEKS.length - 1) {
      setGA(GA_WEEKS[idx + 1]);
    }
  }, [currentGA, setGA]);

  const stepBackward = useCallback(() => {
    const idx = GA_WEEKS.findIndex((g) => g === currentGA);
    if (idx > 0) {
      setGA(GA_WEEKS[idx - 1]);
    }
  }, [currentGA, setGA]);

  // Auto-advance timer using ref to avoid stale closure
  useEffect(() => {
    clearTimer();
    if (!isPlaying) return;

    timerRef.current = setInterval(() => {
      const idx = GA_WEEKS.findIndex((g) => g === gaRef.current);
      if (idx >= GA_WEEKS.length - 1) {
        setIsPlaying(false);
        return;
      }
      setGA(GA_WEEKS[idx + 1]);
    }, SPEEDS[speed]);

    return clearTimer;
  }, [isPlaying, speed, clearTimer, setGA]);

  return {
    isPlaying,
    speed,
    play,
    pause,
    togglePlay,
    setSpeed,
    stepForward,
    stepBackward,
  };
}

export { GA_WEEKS };
