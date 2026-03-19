"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { PipeSegment } from "./pipeline-types";

// ── CSS for flowing dash animation ────────────────────────────────────────────
// Injected once into the document head. Uses a keyframe that offsets
// stroke-dashoffset so the dashes appear to flow downward.

const FLOW_ANIMATION_CSS = `
@keyframes pipelineDashFlow {
  from { stroke-dashoffset: 0; }
  to   { stroke-dashoffset: -24; }
}
.pipeline-pipe-flowing {
  animation: pipelineDashFlow 0.9s linear infinite;
}
`;

let cssInjected = false;

function ensureFlowCSSInjected() {
  if (cssInjected || typeof document === "undefined") return;
  const style = document.createElement("style");
  style.textContent = FLOW_ANIMATION_CSS;
  document.head.appendChild(style);
  cssInjected = true;
}

// ── Single pipe path ──────────────────────────────────────────────────────────

interface PipePathProps {
  pipe: PipeSegment;
  reducedMotion: boolean;
}

function PipePath({ pipe, reducedMotion }: PipePathProps) {
  if (!reducedMotion) {
    ensureFlowCSSInjected();
  }

  const isFiltered = pipe.strokeWidth < 2;

  return (
    <g aria-hidden="true">
      {/* Base path (always rendered) */}
      {reducedMotion ? (
        <path
          d={pipe.path}
          stroke={pipe.color}
          strokeWidth={pipe.strokeWidth}
          fill="none"
          opacity={0.6}
        />
      ) : (
        <motion.path
          d={pipe.path}
          stroke={pipe.color}
          strokeWidth={pipe.strokeWidth}
          fill="none"
          opacity={0.6}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 0.5,
            ease: "easeOut",
            delay: 0.05,
          }}
        />
      )}

      {/* Flowing dash overlay for filter/output pipes (thin ones) */}
      {!reducedMotion && isFiltered && (
        <path
          d={pipe.path}
          stroke={pipe.color}
          strokeWidth={pipe.strokeWidth}
          fill="none"
          opacity={0.35}
          strokeDasharray="4 4"
          className="pipeline-pipe-flowing"
        />
      )}
    </g>
  );
}

// ── PipelinePipes ─────────────────────────────────────────────────────────────

export interface PipelinePipesProps {
  pipes: PipeSegment[];
}

export function PipelinePipes({ pipes }: PipelinePipesProps) {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <>
      {pipes.map((pipe) => (
        <PipePath key={pipe.id} pipe={pipe} reducedMotion={reducedMotion} />
      ))}
    </>
  );
}
