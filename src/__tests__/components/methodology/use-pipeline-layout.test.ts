import { describe, it, expect } from "vitest";
import { computePipelineLayout } from "@/components/methodology/pipeline/use-pipeline-layout";
import { calculateRisk } from "@/lib/calculator/risk-engine";
import { w } from "@/data/helpers";
import type { StepBreakdown } from "@/components/methodology/methodology-provider";

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeCalc(factorIds: string[] = []) {
  return calculateRisk({
    ga: w(39),
    activeFactorIds: factorIds,
    applyInteractions: false,
  });
}

const CONTAINER_WIDTH = 600;

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("computePipelineLayout", () => {
  describe("no factors", () => {
    const calc = makeCalc();
    const layout = computePipelineLayout(CONTAINER_WIDTH, [], calc);

    it("produces 8 stages: muglu + ci + 5 filters + output", () => {
      expect(layout.stages).toHaveLength(8);
    });

    it("stage types are in correct order", () => {
      const types = layout.stages.map((s) => s.type);
      expect(types[0]).toBe("muglu");
      expect(types[1]).toBe("ci");
      // 5 filters
      expect(types.slice(2, 7)).toEqual([
        "filter",
        "filter",
        "filter",
        "filter",
        "filter",
      ]);
      expect(types[7]).toBe("output");
    });

    it("totalHeight is positive", () => {
      expect(layout.totalHeight).toBeGreaterThan(0);
    });

    it("stages are ordered top-to-bottom (non-decreasing y)", () => {
      // Skip comparing filters to each other (they're at the same y)
      const mainStages = layout.stages.filter(
        (s) => s.type !== "filter"
      );
      for (let i = 1; i < mainStages.length; i++) {
        expect(mainStages[i].y).toBeGreaterThanOrEqual(mainStages[i - 1].y);
      }
    });

    it("all stages are centered horizontally", () => {
      const cx = CONTAINER_WIDTH / 2;
      const nonFilters = layout.stages.filter((s) => s.type !== "filter");
      for (const stage of nonFilters) {
        const stageCenterX = stage.x + stage.width / 2;
        expect(stageCenterX).toBeCloseTo(cx, 5);
      }
    });

    it("produces pipe segments", () => {
      expect(layout.pipes.length).toBeGreaterThan(0);
    });

    it("has muglu→ci pipe", () => {
      const pipe = layout.pipes.find(
        (p) => p.fromStageId === "muglu" && p.toStageId === "ci"
      );
      expect(pipe).toBeDefined();
    });

    it("has ci→filter pipes (5 of them)", () => {
      const ciToFilter = layout.pipes.filter((p) => p.fromStageId === "ci");
      expect(ciToFilter).toHaveLength(5);
    });

    it("has filter→output pipes (5 of them)", () => {
      const filterToOutput = layout.pipes.filter(
        (p) => p.toStageId === "output"
      );
      expect(filterToOutput).toHaveLength(5);
    });

    it("has no direct ci→output pipe", () => {
      const direct = layout.pipes.find(
        (p) => p.fromStageId === "ci" && p.toStageId === "output"
      );
      expect(direct).toBeUndefined();
    });
  });

  describe("with 2 factors", () => {
    const calc = makeCalc(["age_gte_40", "smoking"]);

    const steps: StepBreakdown[] = [
      {
        factorId: "age_gte_40",
        label: "Maternal age ≥40",
        multiplier: 1.88,
        riskBefore: calc.baselineRiskPer1000,
        riskAfter: calc.baselineRiskPer1000 * 1.88,
        color: "#f97316",
        isInteraction: false,
      },
      {
        factorId: "smoking",
        label: "Current smoking",
        multiplier: 1.6,
        riskBefore: calc.baselineRiskPer1000 * 1.88,
        riskAfter: calc.baselineRiskPer1000 * 1.88 * 1.6,
        color: "#6366f1",
        isInteraction: false,
      },
    ];

    const layout = computePipelineLayout(CONTAINER_WIDTH, steps, calc);

    it("inserts 2 gate stages", () => {
      const gates = layout.stages.filter((s) => s.type === "gate");
      expect(gates).toHaveLength(2);
    });

    it("produces 10 stages total: muglu + 2 gates + ci + 5 filters + output", () => {
      expect(layout.stages).toHaveLength(10);
    });

    it("gate stages carry correct multipliers", () => {
      const gates = layout.stages.filter((s) => s.type === "gate");
      expect(gates[0].multiplier).toBeCloseTo(1.88, 5);
      expect(gates[1].multiplier).toBeCloseTo(1.6, 5);
    });

    it("gate stages use step color", () => {
      const gates = layout.stages.filter((s) => s.type === "gate");
      expect(gates[0].color).toBe("#f97316");
      expect(gates[1].color).toBe("#6366f1");
    });

    it("has muglu→gate_0 pipe", () => {
      const gateId = layout.stages.filter((s) => s.type === "gate")[0].id;
      const pipe = layout.pipes.find(
        (p) => p.fromStageId === "muglu" && p.toStageId === gateId
      );
      expect(pipe).toBeDefined();
    });

    it("has gate_1→ci pipe", () => {
      const gateId = layout.stages.filter((s) => s.type === "gate")[1].id;
      const pipe = layout.pipes.find(
        (p) => p.fromStageId === gateId && p.toStageId === "ci"
      );
      expect(pipe).toBeDefined();
    });

    it("totalHeight is larger than no-factor layout", () => {
      const baseLayout = computePipelineLayout(CONTAINER_WIDTH, [], makeCalc());
      expect(layout.totalHeight).toBeGreaterThan(baseLayout.totalHeight);
    });
  });

  describe("interaction gate", () => {
    const calc = makeCalc(["preexisting_diabetes", "bmi_gte_40"]);

    const interactionStep: StepBreakdown = {
      factorId: "interaction_preexisting_diabetes_bmi_gte_40",
      label: "Interaction: Diabetes + BMI ≥40",
      multiplier: 0.85,
      riskBefore: 1.0,
      riskAfter: 0.85,
      color: "#f97316",
      isInteraction: true,
    };

    const layout = computePipelineLayout(CONTAINER_WIDTH, [interactionStep], calc);

    it("uses interaction stage type for isInteraction steps", () => {
      const interactionStages = layout.stages.filter(
        (s) => s.type === "interaction"
      );
      expect(interactionStages).toHaveLength(1);
    });

    it("interaction gate is narrower (160px wide)", () => {
      const interactionStage = layout.stages.find(
        (s) => s.type === "interaction"
      );
      expect(interactionStage?.width).toBe(160);
    });

    it("interaction gate uses INTERACTION_COLOR", () => {
      const interactionStage = layout.stages.find(
        (s) => s.type === "interaction"
      );
      expect(interactionStage?.color).toBe("#64748b");
    });
  });

  describe("output node", () => {
    it("output node color matches grade color", () => {
      const calc = makeCalc();
      const layout = computePipelineLayout(CONTAINER_WIDTH, [], calc);
      const output = layout.stages.find((s) => s.type === "output");
      expect(output).toBeDefined();
      // Grade A → green
      expect(output?.color).toBe("#22c55e");
    });
  });

  describe("filter stage values", () => {
    it("filter stages carry confidence breakdown values", () => {
      const calc = makeCalc();
      const layout = computePipelineLayout(CONTAINER_WIDTH, [], calc);
      const filters = layout.stages.filter((s) => s.type === "filter");
      expect(filters).toHaveLength(5);
      for (const f of filters) {
        expect(f.value).toBeGreaterThan(0);
        expect(f.value).toBeLessThanOrEqual(1);
      }
    });
  });

  describe("y-ordering", () => {
    it("muglu appears before any gate", () => {
      const calc = makeCalc(["age_gte_40"]);
      const steps: StepBreakdown[] = [
        {
          factorId: "age_gte_40",
          label: "Age ≥40",
          multiplier: 1.88,
          riskBefore: 0.4,
          riskAfter: 0.752,
          color: "#f97316",
          isInteraction: false,
        },
      ];
      const layout = computePipelineLayout(CONTAINER_WIDTH, steps, calc);
      const muglu = layout.stages.find((s) => s.type === "muglu")!;
      const gate = layout.stages.find((s) => s.type === "gate")!;
      expect(muglu.y).toBeLessThan(gate.y);
    });

    it("ci appears before filters", () => {
      const calc = makeCalc();
      const layout = computePipelineLayout(CONTAINER_WIDTH, [], calc);
      const ci = layout.stages.find((s) => s.type === "ci")!;
      const filters = layout.stages.filter((s) => s.type === "filter");
      for (const f of filters) {
        expect(ci.y).toBeLessThan(f.y);
      }
    });

    it("filters appear before output", () => {
      const calc = makeCalc();
      const layout = computePipelineLayout(CONTAINER_WIDTH, [], calc);
      const filters = layout.stages.filter((s) => s.type === "filter");
      const output = layout.stages.find((s) => s.type === "output")!;
      for (const f of filters) {
        expect(f.y).toBeLessThan(output.y);
      }
    });
  });
});
