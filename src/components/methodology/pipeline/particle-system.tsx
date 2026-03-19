"use client";

import { useEffect, useRef, useCallback } from "react";
import { useReducedMotion } from "framer-motion";
import type { StageLayout } from "./pipeline-types";
import type { ConfidenceScore } from "@/data/types";
import { lerpColor, gradeToColor, FILTER_CONFIG } from "./pipeline-utils";

// ── Props ─────────────────────────────────────────────────────────────────────

export interface ParticleSystemProps {
  stages: StageLayout[];
  centerX: number;
  totalHeight: number;
  combinedMultiplier: number;
  activeFactorCount: number;
  grade: ConfidenceScore["grade"];
  containerWidth: number;
}

// ── Internal particle state ───────────────────────────────────────────────────

interface LiveParticle {
  id: number;
  x: number;
  y: number;
  speed: number;
  color: string;
  history: Array<{ x: number; y: number }>;
  waypointIndex: number;
  /** 0–1 progress from current waypoint to next */
  waypointProgress: number;
}

// ── Waypoint builder ──────────────────────────────────────────────────────────

function buildWaypoints(
  stages: StageLayout[],
  centerX: number
): Array<{ x: number; y: number; color: string }> {
  const waypoints: Array<{ x: number; y: number; color: string }> = [];

  // Compute average Y of filter stages for the waypoint that passes through them
  const filterStages = stages.filter((s) => s.type === "filter");
  const avgFilterY =
    filterStages.length > 0
      ? filterStages.reduce((sum, s) => sum + s.y + s.height / 2, 0) /
        filterStages.length
      : 0;

  for (const stage of stages) {
    if (stage.type === "filter") continue; // filters handled as a single waypoint

    const wx = stage.x + stage.width / 2;
    const wy = stage.y + stage.height / 2;

    if (stage.type === "ci") {
      // After CI, insert the filter waypoint before the output
      waypoints.push({ x: wx, y: wy, color: stage.color ?? "#94a3b8" });
      if (filterStages.length > 0) {
        waypoints.push({ x: centerX, y: avgFilterY, color: "#a855f7" });
      }
    } else {
      waypoints.push({ x: wx, y: wy, color: stage.color ?? "#94a3b8" });
    }
  }

  return waypoints;
}

// ── Reduced-motion fallback (SVG dots) ───────────────────────────────────────

function StaticDots({
  stages,
  containerWidth,
  totalHeight,
}: {
  stages: StageLayout[];
  containerWidth: number;
  totalHeight: number;
}) {
  const nonFilterStages = stages.filter((s) => s.type !== "filter");
  return (
    <svg
      aria-hidden="true"
      width={containerWidth}
      height={totalHeight}
      style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
    >
      {nonFilterStages.map((stage) => (
        <circle
          key={stage.id}
          cx={stage.x + stage.width / 2}
          cy={stage.y + stage.height / 2}
          r={4}
          fill={stage.color ?? "#94a3b8"}
          opacity={0.6}
        />
      ))}
    </svg>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function ParticleSystem({
  stages,
  centerX,
  totalHeight,
  combinedMultiplier,
  activeFactorCount,
  grade,
  containerWidth,
}: ParticleSystemProps) {
  const reducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<LiveParticle[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const nextSpawnRef = useRef<number>(0);
  const idCounterRef = useRef<number>(0);

  // Derived animation parameters
  const speed = Math.min(250, 60 + (combinedMultiplier - 1) * 20);
  const spawnInterval = Math.max(200, 800 - activeFactorCount * 100);
  const glowRadius = 2 + Math.min(2, (combinedMultiplier - 1) * 0.5);

  const waypointsRef = useRef<Array<{ x: number; y: number; color: string }>>(
    []
  );

  // Recompute waypoints when stages change
  useEffect(() => {
    waypointsRef.current = buildWaypoints(stages, centerX);
  }, [stages, centerX]);

  const gradeColor = gradeToColor(grade);

  const drawFrame = useCallback(
    (timestamp: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.1); // seconds, capped
      lastTimeRef.current = timestamp;

      const waypoints = waypointsRef.current;
      if (waypoints.length < 2) {
        rafRef.current = requestAnimationFrame(drawFrame);
        return;
      }

      // Spawn new particle
      if (
        timestamp >= nextSpawnRef.current &&
        particlesRef.current.length < 30
      ) {
        const spawn = waypoints[0];
        particlesRef.current.push({
          id: idCounterRef.current++,
          x: spawn.x,
          y: spawn.y,
          speed,
          color: "#94a3b8",
          history: [],
          waypointIndex: 0,
          waypointProgress: 0,
        });
        nextSpawnRef.current = timestamp + spawnInterval;
      }

      // Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update + draw particles
      const surviving: LiveParticle[] = [];

      for (const p of particlesRef.current) {
        // Advance waypoint progress
        const from = waypoints[p.waypointIndex];
        const to = waypoints[p.waypointIndex + 1];
        if (!from || !to) continue; // reached end, drop

        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const travel = dist > 0 ? (p.speed * dt) / dist : 0;
        p.waypointProgress += travel;

        // Advance through waypoints
        while (p.waypointProgress >= 1 && p.waypointIndex < waypoints.length - 2) {
          p.waypointProgress -= 1;
          p.waypointIndex++;
        }

        // If reached final waypoint, drop particle
        if (p.waypointIndex >= waypoints.length - 1) continue;

        const curFrom = waypoints[p.waypointIndex];
        const curTo = waypoints[p.waypointIndex + 1];
        const t = Math.min(p.waypointProgress, 1);

        p.x = curFrom.x + (curTo.x - curFrom.x) * t;
        p.y = curFrom.y + (curTo.y - curFrom.y) * t;

        // Color blending: 30% toward current stage color
        const stageColor = curTo.color;
        const isOutput = p.waypointIndex >= waypoints.length - 2;
        const targetColor = isOutput ? gradeColor : stageColor;
        p.color = lerpColor(p.color, targetColor, 0.3 * dt * 4);

        // Record trail history (last 6 positions)
        p.history.push({ x: p.x, y: p.y });
        if (p.history.length > 6) p.history.shift();

        // Draw trail
        if (p.history.length >= 2) {
          for (let i = 1; i < p.history.length; i++) {
            const trailOpacity = (i / p.history.length) * 0.5;
            ctx.beginPath();
            ctx.moveTo(p.history[i - 1].x, p.history[i - 1].y);
            ctx.lineTo(p.history[i].x, p.history[i].y);
            ctx.strokeStyle = p.color.startsWith("rgb")
              ? p.color.replace("rgb(", "rgba(").replace(")", `, ${trailOpacity})`)
              : p.color;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        }

        // Draw particle dot with glow
        ctx.save();
        ctx.shadowBlur = glowRadius;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.restore();

        surviving.push(p);
      }

      particlesRef.current = surviving;

      if (!document.hidden) {
        rafRef.current = requestAnimationFrame(drawFrame);
      }
    },
    [speed, spawnInterval, glowRadius, gradeColor]
  );

  // Start/stop animation loop
  useEffect(() => {
    if (reducedMotion) return;

    const handleVisibility = () => {
      if (!document.hidden && !rafRef.current) {
        lastTimeRef.current = performance.now();
        rafRef.current = requestAnimationFrame(drawFrame);
      } else if (document.hidden && rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    lastTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(drawFrame);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [drawFrame, reducedMotion]);

  if (reducedMotion) {
    return (
      <StaticDots
        stages={stages}
        containerWidth={containerWidth}
        totalHeight={totalHeight}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      width={containerWidth}
      height={totalHeight}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
      }}
    />
  );
}
