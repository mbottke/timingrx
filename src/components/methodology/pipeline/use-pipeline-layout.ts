import { useMemo } from "react";
import type { StageLayout, PipeSegment } from "./pipeline-types";
import type { StepBreakdown } from "@/components/methodology/methodology-provider";
import type { RiskCalculation } from "@/data/types";
import { FILTER_CONFIG, INTERACTION_COLOR, gradeToColor } from "./pipeline-utils";

// ── Layout constants ───────────────────────────────────────────────────────────

const MUGLU_W = 200;
const MUGLU_H = 60;

const GATE_W = 200;
const GATE_INTERACTION_W = 160;
const GATE_H = 50;

const CI_W = 240;
const CI_H = 70;

const FILTER_W = 40;
const FILTER_H = 80;
const FILTER_GAP = 20;

const OUTPUT_W = 220;
const OUTPUT_H = 80;

const VERTICAL_GAP = 80;
const FILTER_SECTION_GAP = 60;

// ── Pure layout computation ────────────────────────────────────────────────────

export interface PipelineLayout {
  stages: StageLayout[];
  pipes: PipeSegment[];
  totalHeight: number;
}

export function computePipelineLayout(
  containerWidth: number,
  steps: StepBreakdown[],
  calc: RiskCalculation
): PipelineLayout {
  const centerX = containerWidth / 2;
  const stages: StageLayout[] = [];
  let y = 20;

  // ── Stage 0: Muglu node ─────────────────────────────────────────────────────
  const mugluX = centerX - MUGLU_W / 2;
  const mugluStage: StageLayout = {
    id: "muglu",
    type: "muglu",
    x: mugluX,
    y,
    width: MUGLU_W,
    height: MUGLU_H,
    pipeInY: y,
    pipeOutY: y + MUGLU_H,
    label: "Muglu 2019",
    value: calc.baselineRiskPer1000,
  };
  stages.push(mugluStage);
  y += MUGLU_H + VERTICAL_GAP;

  // ── Stage 1..N: Gate nodes (one per step) ───────────────────────────────────
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const isInteraction = step.isInteraction ?? false;
    const w = isInteraction ? GATE_INTERACTION_W : GATE_W;
    const gateX = centerX - w / 2;
    const gateStage: StageLayout = {
      id: `gate_${i}_${step.factorId}`,
      type: isInteraction ? "interaction" : "gate",
      x: gateX,
      y,
      width: w,
      height: GATE_H,
      color: isInteraction ? INTERACTION_COLOR : step.color,
      pipeInY: y,
      pipeOutY: y + GATE_H,
      label: step.label,
      value: step.riskAfter,
      multiplier: step.multiplier,
      cumulativeRisk: step.riskAfter,
      isInteraction,
    };
    stages.push(gateStage);
    y += GATE_H + VERTICAL_GAP;
  }

  // ── CI Chamber ──────────────────────────────────────────────────────────────
  const ciX = centerX - CI_W / 2;
  const ciStage: StageLayout = {
    id: "ci",
    type: "ci",
    x: ciX,
    y,
    width: CI_W,
    height: CI_H,
    pipeInY: y,
    pipeOutY: y + CI_H,
    label: "95% Confidence Interval",
    value: calc.adjustedRiskPer1000,
  };
  stages.push(ciStage);
  y += CI_H + FILTER_SECTION_GAP;

  // ── 5 Filters ───────────────────────────────────────────────────────────────
  const filterCount = FILTER_CONFIG.length;
  const totalFilterWidth =
    filterCount * FILTER_W + (filterCount - 1) * FILTER_GAP;
  const filterGroupX = centerX - totalFilterWidth / 2;
  const filterY = y;

  for (let i = 0; i < filterCount; i++) {
    const cfg = FILTER_CONFIG[i];
    const filterX = filterGroupX + i * (FILTER_W + FILTER_GAP);
    const breakdownValue =
      calc.confidenceScore.breakdown[cfg.key];
    const filterStage: StageLayout = {
      id: `filter_${cfg.key}`,
      type: "filter",
      x: filterX,
      y: filterY,
      width: FILTER_W,
      height: FILTER_H,
      color: cfg.color,
      label: cfg.abbr,
      value: breakdownValue,
    };
    stages.push(filterStage);
  }
  y += FILTER_H + FILTER_SECTION_GAP;

  // ── Output node ─────────────────────────────────────────────────────────────
  const outputX = centerX - OUTPUT_W / 2;
  const grade = calc.confidenceScore.grade;
  const outputColor = gradeToColor(grade);
  const outputStage: StageLayout = {
    id: "output",
    type: "output",
    x: outputX,
    y,
    width: OUTPUT_W,
    height: OUTPUT_H,
    color: outputColor,
    pipeInY: y,
    pipeOutY: y + OUTPUT_H,
    label: grade,
    value: calc.adjustedRiskPer1000,
  };
  stages.push(outputStage);
  y += OUTPUT_H;

  // ── Pipe segments ────────────────────────────────────────────────────────────

  const pipes: PipeSegment[] = [];

  // Helper: find stage by id
  const findStage = (id: string) => stages.find((s) => s.id === id);

  // Build the ordered "main column" stage ids (muglu → gates → ci)
  // We skip ci→output direct pipe; filters bridge them.
  const mainColumnIds: string[] = [
    "muglu",
    ...steps.map((_, i) => `gate_${i}_${steps[i].factorId}`),
    "ci",
  ];

  // Straight vertical pipes between consecutive main stages
  for (let i = 0; i < mainColumnIds.length - 1; i++) {
    const fromId = mainColumnIds[i];
    const toId = mainColumnIds[i + 1];
    const from = findStage(fromId);
    const to = findStage(toId);
    if (!from || !to) continue;

    const x1 = from.x + from.width / 2;
    const y1 = from.pipeOutY ?? from.y + from.height;
    const y2 = to.pipeInY ?? to.y;

    pipes.push({
      id: `pipe_${fromId}_${toId}`,
      fromStageId: fromId,
      toStageId: toId,
      path: `M ${x1} ${y1} L ${x1} ${y2}`,
      strokeWidth: 3,
      color: "#94a3b8",
    });
  }

  // Bezier curves from CI to each filter
  const ciStageRef = findStage("ci");
  for (let i = 0; i < filterCount; i++) {
    const cfg = FILTER_CONFIG[i];
    const filterId = `filter_${cfg.key}`;
    const filterStage = findStage(filterId);
    if (!ciStageRef || !filterStage) continue;

    const fromX = ciStageRef.x + ciStageRef.width / 2;
    const fromY = ciStageRef.pipeOutY ?? ciStageRef.y + ciStageRef.height;
    const toX = filterStage.x + filterStage.width / 2;
    const toY = filterStage.y;

    // Cubic bezier: control points midway in Y
    const midY = (fromY + toY) / 2;
    const path = `M ${fromX} ${fromY} C ${fromX} ${midY}, ${toX} ${midY}, ${toX} ${toY}`;

    pipes.push({
      id: `pipe_ci_${filterId}`,
      fromStageId: "ci",
      toStageId: filterId,
      path,
      strokeWidth: 1.5,
      color: cfg.color,
    });
  }

  // Bezier curves from each filter to output
  const outputStageRef = findStage("output");
  for (let i = 0; i < filterCount; i++) {
    const cfg = FILTER_CONFIG[i];
    const filterId = `filter_${cfg.key}`;
    const filterStage = findStage(filterId);
    if (!filterStage || !outputStageRef) continue;

    const fromX = filterStage.x + filterStage.width / 2;
    const fromY = filterStage.y + filterStage.height;
    const toX = outputStageRef.x + outputStageRef.width / 2;
    const toY = outputStageRef.pipeInY ?? outputStageRef.y;

    const midY = (fromY + toY) / 2;
    const path = `M ${fromX} ${fromY} C ${fromX} ${midY}, ${toX} ${midY}, ${toX} ${toY}`;

    pipes.push({
      id: `pipe_${filterId}_output`,
      fromStageId: filterId,
      toStageId: "output",
      path,
      strokeWidth: 1.5,
      color: cfg.color,
    });
  }

  return { stages, pipes, totalHeight: y };
}

// ── React hook wrapper ─────────────────────────────────────────────────────────

export function usePipelineLayout(
  containerWidth: number,
  steps: StepBreakdown[],
  calc: RiskCalculation
): PipelineLayout {
  return useMemo(
    () => computePipelineLayout(containerWidth, steps, calc),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [containerWidth, steps, calc]
  );
}
