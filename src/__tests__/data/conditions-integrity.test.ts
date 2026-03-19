import { describe, it, expect } from "vitest";
import { allConditions, conditionGroups } from "@/data/conditions";

describe("Condition data integrity", () => {
  it("has at least 5 conditions (grows as we add files)", () => {
    expect(allConditions.length).toBeGreaterThanOrEqual(5);
  });

  it("every condition has a unique id", () => {
    const ids = allConditions.map((c) => c.id);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);
  });

  it("every condition has a name", () => {
    for (const c of allConditions) {
      expect(c.name, `Condition ${c.id} missing name`).toBeTruthy();
    }
  });

  it("every condition has a category", () => {
    for (const c of allConditions) {
      expect(c.category, `Condition ${c.id} missing category`).toBeTruthy();
    }
  });

  it("every condition has tags for search", () => {
    for (const c of allConditions) {
      expect(c.tags.length, `Condition ${c.id} has no tags`).toBeGreaterThan(0);
    }
  });

  it("every condition has pastFortyWeeks status", () => {
    for (const c of allConditions) {
      expect(c.pastFortyWeeks, `Condition ${c.id} missing pastFortyWeeks`).toBeTruthy();
    }
  });

  it("conditions with guidelineRecommendations have valid timing", () => {
    for (const c of allConditions) {
      for (const rec of c.guidelineRecommendations) {
        expect(
          ["range", "individualize", "immediate"].includes(rec.timing.type),
          `Condition ${c.id} has invalid timing type: ${rec.timing.type}`
        ).toBe(true);

        if (rec.timing.type === "range") {
          expect(
            rec.timing.range.earliest,
            `Condition ${c.id}: earliest GA must be positive`
          ).toBeGreaterThan(0);
          expect(
            rec.timing.range.earliest <= rec.timing.range.latest,
            `Condition ${c.id}: earliest > latest`
          ).toBe(true);
        }
      }
    }
  });

  it("all citations have body and documentId", () => {
    for (const c of allConditions) {
      for (const rec of c.guidelineRecommendations) {
        for (const cit of rec.citations) {
          expect(cit.body, `Condition ${c.id}: citation missing body`).toBeTruthy();
          expect(cit.documentId, `Condition ${c.id}: citation missing documentId`).toBeTruthy();
        }
      }
    }
  });

  it("sub-variants reference their parent", () => {
    for (const c of conditionGroups) {
      if (c.subVariants) {
        for (const sv of c.subVariants) {
          expect(
            sv.parentConditionId,
            `Sub-variant ${sv.id} missing parentConditionId`
          ).toBe(c.id);
        }
      }
    }
  });
});
