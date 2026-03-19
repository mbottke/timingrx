import type { ConfidenceScore } from "@/data/types";

// ── Color helpers ─────────────────────────────────────────────────────────────

interface Rgb {
  r: number;
  g: number;
  b: number;
}

/**
 * Parse a color string into RGB components.
 * Accepts both hex format ("#ff0000" or "ff0000") and "rgb(255,0,0)" format.
 */
export function hexToRgb(color: string): Rgb {
  // Detect rgb(...) format first
  const rgbMatch = color.match(/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1], 10),
      g: parseInt(rgbMatch[2], 10),
      b: parseInt(rgbMatch[3], 10),
    };
  }

  // Hex format — strip leading # if present
  const hex = color.replace(/^#/, "");
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
  };
}

/**
 * Linearly interpolate between two colors (hex or rgb() strings).
 * Returns an "rgb(r, g, b)" string.
 * t=0 → colorA, t=1 → colorB.
 */
export function lerpColor(colorA: string, colorB: string, t: number): string {
  const a = hexToRgb(colorA);
  const b = hexToRgb(colorB);

  const r = Math.round(a.r + (b.r - a.r) * t);
  const g = Math.round(a.g + (b.g - a.g) * t);
  const bv = Math.round(a.b + (b.b - a.b) * t);

  return `rgb(${r}, ${g}, ${bv})`;
}

// ── Grade → color ─────────────────────────────────────────────────────────────

const GRADE_COLOR_MAP: Record<ConfidenceScore["grade"], string> = {
  A: "#22c55e",
  B: "#3b82f6",
  C: "#f59e0b",
  D: "#f97316",
  F: "#ef4444",
};

/** Map a confidence grade letter to its hex color. */
export function gradeToColor(grade: ConfidenceScore["grade"]): string {
  return GRADE_COLOR_MAP[grade];
}

// ── Filter configuration ──────────────────────────────────────────────────────

export interface FilterConfigEntry {
  key: keyof ConfidenceScore["breakdown"];
  abbr: string;
  color: string;
}

/**
 * Ordered configuration for the 5 confidence components that appear as
 * filter stages in the pipeline visualization.
 */
export const FILTER_CONFIG: FilterConfigEntry[] = [
  { key: "evidenceQuality",       abbr: "EQ", color: "#6366f1" },
  { key: "modelValidity",         abbr: "MV", color: "#8b5cf6" },
  { key: "interactionPenalty",    abbr: "IP", color: "#a855f7" },
  { key: "magnitudePlausibility", abbr: "MP", color: "#c084fc" },
  { key: "rareDiseaseValidity",   abbr: "RP", color: "#e879f9" },
];

// ── Interaction color ─────────────────────────────────────────────────────────

export const INTERACTION_COLOR = "#64748b";
