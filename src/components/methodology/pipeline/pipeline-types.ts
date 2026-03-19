// ── Stage types ───────────────────────────────────────────────────────────────

export type StageType =
  | "muglu"
  | "gate"
  | "interaction"
  | "ci"
  | "filter"
  | "output";

// ── Stage layout ──────────────────────────────────────────────────────────────

export interface StageLayout {
  id: string;
  type: StageType;
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  pipeInY?: number;
  pipeOutY?: number;
  label?: string;
  value?: number;
  multiplier?: number;
  cumulativeRisk?: number;
  isInteraction?: boolean;
}

// ── Particle ──────────────────────────────────────────────────────────────────

export interface Particle {
  id: string;
  x: number;
  y: number;
  speed: number;
  size: number;
  color: string;
  trailOpacity: number;
  glowRadius: number;
  progress: number;
  history: Array<{ x: number; y: number }>;
  currentStageIndex: number;
}

// ── Pipe segment ──────────────────────────────────────────────────────────────

export interface PipeSegment {
  id: string;
  fromStageId: string;
  toStageId: string;
  /** SVG path d attribute */
  path: string;
  strokeWidth: number;
  color: string;
}
