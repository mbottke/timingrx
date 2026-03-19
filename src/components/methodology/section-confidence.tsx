"use client";

import { useReducedMotion } from "framer-motion";
import { useMethodology } from "./methodology-provider";
import { ConfidenceGauges } from "./confidence-gauges";
import { AnimatedNumber } from "./animated-number";
import { FormulaBlock, FormulaLine } from "./formula-block";
import { TeachingCallout } from "./teaching-callout";
import { MobileTrackTabs } from "./mobile-track-tabs";
import { hypothesizedInteractions } from "@/data/risk-models/hypothesized-interactions";
import { riskFactorMultipliers } from "@/data/risk-models/risk-factor-multipliers";

const factorMap = new Map(riskFactorMultipliers.map((f) => [f.id, f]));

// ── Section Component ─────────────────────────────────────────────────────────

export function SectionConfidence() {
  const {
    selectedGaCalculation,
    activeFactorIds,
    applyInteractions,
  } = useMethodology();
  const prefersReducedMotion = useReducedMotion();

  const { confidenceScore } = selectedGaCalculation;
  const { breakdown, score, grade, label } = confidenceScore;

  const n = activeFactorIds.length;
  const activeFactors = activeFactorIds
    .map((id) => factorMap.get(id))
    .filter((f) => f !== undefined);

  // Compute hypothesized / published interaction counts (mirrors confidence-scorer.ts)
  let hypothesizedCount = 0;
  let publishedCount = 0;
  if (applyInteractions) {
    const activeIdSet = new Set(activeFactorIds);
    for (const interaction of hypothesizedInteractions) {
      if (
        activeIdSet.has(interaction.factorIds[0]) &&
        activeIdSet.has(interaction.factorIds[1])
      ) {
        if (interaction.isHypothesized) {
          hypothesizedCount++;
        } else {
          publishedCount++;
        }
      }
    }
  }

  // MV polynomial: max(0.40, 1.0 - 0.03n - 0.005n²)
  const mvRaw = 1.0 - 0.03 * n - 0.005 * n * n;
  const mv = Math.max(0.4, mvRaw);

  const animStiffness = prefersReducedMotion ? 10000 : 200;

  return (
    <section id="section-confidence" className="scroll-mt-32 py-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">
          Section 4 — The Confidence Scorer: 5 Lenses of Trust
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          A composite score penalizing evidence gaps, model strain, interaction
          uncertainty, magnitude extremes, and OR→RR assumption validity.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[55%_45%]">
        <MobileTrackTabs
          visual={
            /* ── Visual Track ─────────────────────────────────────────────── */
            <div className="space-y-4">
              <ConfidenceGauges confidenceScore={confidenceScore} />

              {/* Summary badge */}
              <div className="rounded-lg border bg-card p-4 text-center shadow-sm">
                <p className="text-xs text-muted-foreground mb-1">
                  Confidence Score
                </p>
                <p className="text-4xl font-bold" style={{ color: gradeColor(grade) }}>
                  <AnimatedNumber value={score} decimals={0} stiffness={animStiffness} />
                  <span className="ml-1 text-2xl">/ 100</span>
                </p>
                <p className="mt-1 text-sm font-medium" style={{ color: gradeColor(grade) }}>
                  Grade {grade} — {label}
                </p>
                {confidenceScore.explanation && (
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed max-w-prose mx-auto">
                    {confidenceScore.explanation}
                  </p>
                )}
              </div>
            </div>
          }
          math={
            /* ── Math Track ───────────────────────────────────────────────── */
            <div className="space-y-4">
              {/* Top-level formula */}
              <FormulaBlock title="Confidence Score Formula" accentColor="border-primary">
                <FormulaLine>Score = 100 × EQ × MV × IP × MP × RP</FormulaLine>
                <FormulaLine className="text-muted-foreground text-xs mt-1">
                  = 100 ×{" "}
                  <AnimatedNumber value={breakdown.evidenceQuality} decimals={3} stiffness={animStiffness} /> ×{" "}
                  <AnimatedNumber value={breakdown.modelValidity} decimals={3} stiffness={animStiffness} /> ×{" "}
                  <AnimatedNumber value={breakdown.interactionPenalty} decimals={3} stiffness={animStiffness} /> ×{" "}
                  <AnimatedNumber value={breakdown.magnitudePlausibility} decimals={3} stiffness={animStiffness} /> ×{" "}
                  <AnimatedNumber value={breakdown.rareDiseaseValidity} decimals={3} stiffness={animStiffness} />
                </FormulaLine>
                <FormulaLine highlight className="mt-1">
                  = <AnimatedNumber value={score} decimals={0} stiffness={animStiffness} />
                </FormulaLine>
              </FormulaBlock>

              {/* EQ detail */}
              <FormulaBlock title="EQ — Evidence Quality" accentColor="border-blue-500">
                <FormulaLine>
                  EQ = (R_baseline + Σ R_i) / (1 + n)
                </FormulaLine>
                <FormulaLine className="text-muted-foreground text-xs">
                  R_baseline = 0.95
                </FormulaLine>
                {activeFactors.length === 0 ? (
                  <FormulaLine className="text-muted-foreground text-xs">
                    n = 0 → EQ = 0.95 / 1 = 0.950
                  </FormulaLine>
                ) : (
                  <>
                    {activeFactors.map((f) => (
                      <FormulaLine key={f.id} className="text-xs">
                        R_{f.id.slice(0, 8)}… = {f.dataReliability.toFixed(2)}
                      </FormulaLine>
                    ))}
                    <FormulaLine className="text-xs text-muted-foreground">
                      n = {n}, Σ R_i = {activeFactors.reduce((a, f) => a + f.dataReliability, 0).toFixed(3)}
                    </FormulaLine>
                  </>
                )}
                <FormulaLine highlight>
                  EQ = <AnimatedNumber value={breakdown.evidenceQuality} decimals={3} stiffness={animStiffness} />
                </FormulaLine>
              </FormulaBlock>

              {/* MV detail */}
              <FormulaBlock title="MV — Model Validity" accentColor="border-violet-500">
                <FormulaLine>
                  MV = max(0.40, 1.0 − 0.03n − 0.005n²)
                </FormulaLine>
                <FormulaLine className="text-xs text-muted-foreground">
                  n = {n} → 1.0 − {(0.03 * n).toFixed(3)} − {(0.005 * n * n).toFixed(3)} = {mvRaw.toFixed(3)}
                </FormulaLine>
                <FormulaLine className="text-xs text-muted-foreground">
                  {mvRaw < 0.4
                    ? "Clamped to floor 0.400 (extreme model strain)"
                    : n === 0
                      ? "No factors → multiplicative independence holds perfectly"
                      : n <= 2
                        ? "Few factors → multiplicative assumption reasonable"
                        : "Multiple factors → independence assumption increasingly strained"}
                </FormulaLine>
                <FormulaLine highlight>
                  MV = <AnimatedNumber value={breakdown.modelValidity} decimals={3} stiffness={animStiffness} />
                </FormulaLine>
              </FormulaBlock>

              {/* IP detail */}
              <FormulaBlock title="IP — Interaction Penalty" accentColor="border-amber-500">
                <FormulaLine>
                  IP = max(0.75, 1.0 − 0.05H − 0.02P)
                </FormulaLine>
                <FormulaLine className="text-xs text-muted-foreground">
                  H (hypothesized) = {hypothesizedCount}, P (published) = {publishedCount}
                </FormulaLine>
                {!applyInteractions && (
                  <FormulaLine className="text-xs text-muted-foreground">
                    Interactions not applied → IP = 1.000
                  </FormulaLine>
                )}
                <FormulaLine highlight>
                  IP = <AnimatedNumber value={breakdown.interactionPenalty} decimals={3} stiffness={animStiffness} />
                </FormulaLine>
              </FormulaBlock>

              {/* MP detail */}
              <FormulaBlock title="MP — Magnitude Plausibility" accentColor="border-teal-500">
                <FormulaLine>
                  MP = stepwise function of combined multiplier M
                </FormulaLine>
                <FormulaLine className="text-xs text-muted-foreground">
                  M &lt; 4 → 1.00 | 4–8 → 0.93 | 8–15 → 0.85 | 15–25 → 0.78 | &gt;25 → 0.72
                </FormulaLine>
                <FormulaLine className="text-xs text-muted-foreground">
                  Combined multiplier ={" "}
                  {n === 0
                    ? "1.00 (no factors)"
                    : (
                        selectedGaCalculation.adjustedRiskPer1000 /
                        selectedGaCalculation.baselineRiskPer1000
                      ).toFixed(3)}
                </FormulaLine>
                <FormulaLine highlight>
                  MP = <AnimatedNumber value={breakdown.magnitudePlausibility} decimals={3} stiffness={animStiffness} />
                </FormulaLine>
              </FormulaBlock>

              {/* RP detail */}
              <FormulaBlock title="RP — Rare Disease Validity (OR≈RR)" accentColor="border-rose-500">
                <FormulaLine>
                  RP = stepwise function of adjusted risk proportion
                </FormulaLine>
                <FormulaLine className="text-xs text-muted-foreground">
                  &lt;1% → 1.00 | 1–5% → 0.95 | 5–10% → 0.88 | 10–20% → 0.78 | &gt;20% → 0.65
                </FormulaLine>
                <FormulaLine className="text-xs text-muted-foreground">
                  Adjusted risk proportion ={" "}
                  {(selectedGaCalculation.adjustedRiskPer1000 / 10).toFixed(2)}%
                </FormulaLine>
                <FormulaLine highlight>
                  RP = <AnimatedNumber value={breakdown.rareDiseaseValidity} decimals={3} stiffness={animStiffness} />
                </FormulaLine>
              </FormulaBlock>

              {/* Teaching callout */}
              <TeachingCallout
                summary="No other stillbirth calculator quantifies its own uncertainty — this one does."
                variant="insight"
              >
                <p>
                  The <strong>Confidence Scorer</strong> is a novel feature unique to
                  this tool. Standard obstetric risk calculators report a number with no
                  indication of how much to trust it. This scorer evaluates five
                  independent sources of uncertainty:
                </p>
                <ul className="mt-2 list-disc list-inside space-y-1 text-xs">
                  <li>
                    <strong>EQ</strong>: Are the input risk factors backed by
                    high-quality, large studies?
                  </li>
                  <li>
                    <strong>MV</strong>: Is the multiplicative independence assumption
                    valid for this combination?
                  </li>
                  <li>
                    <strong>IP</strong>: Are the interaction adjustments based on
                    published data or hypothesis?
                  </li>
                  <li>
                    <strong>MP</strong>: Is the combined magnitude biologically
                    plausible?
                  </li>
                  <li>
                    <strong>RP</strong>: Does the OR ≈ RR approximation hold at this
                    risk level?
                  </li>
                </ul>
                <p className="mt-2 text-xs text-muted-foreground">
                  The output is not a p-value or CI — it is a calibrated epistemic
                  confidence grade that should inform how much weight to place on the
                  numeric estimate in a shared decision-making conversation.
                </p>
              </TeachingCallout>
            </div>
          }
        />
      </div>
    </section>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function gradeColor(grade: "A" | "B" | "C" | "D" | "F"): string {
  const colors: Record<string, string> = {
    A: "#22c55e",
    B: "#3b82f6",
    C: "#f59e0b",
    D: "#f97316",
    F: "#ef4444",
  };
  return colors[grade] ?? "#64748b";
}
