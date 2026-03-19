import type { RiskStatistic } from "@/data/types";

/**
 * Formats a RiskStatistic discriminated union into a display string.
 *
 * relative_risk  → "RR {value}"
 * odds_ratio     → "OR {value}"
 * absolute_risk  → "{valuePer1000} per 1,000"
 * incidence      → "{valuePercent}%"
 * mortality_rate → "{valuePercent}% mortality"
 */
export function formatRiskStatistic(stat: RiskStatistic): string {
  switch (stat.type) {
    case "relative_risk":
      return `RR ${stat.value}`;
    case "odds_ratio":
      return `OR ${stat.value}`;
    case "absolute_risk":
      return `${stat.valuePer1000} per 1,000`;
    case "incidence":
      return `${stat.valuePercent}%`;
    case "mortality_rate":
      return `${stat.valuePercent}% mortality`;
  }
}

/**
 * Returns severity level for color-coding risk statistics.
 *
 * Thresholds:
 * - high: incidence/mortality ≥10%, RR/OR ≥2.0, absolute ≥100/1000
 * - moderate: incidence/mortality 2-10%, RR/OR 1.5-2.0, absolute 20-100/1000
 * - default: below those thresholds
 */
export type RiskSeverity = "high" | "moderate" | "default";

export function getRiskSeverity(stat: RiskStatistic): RiskSeverity {
  switch (stat.type) {
    case "relative_risk":
    case "odds_ratio": {
      const v = stat.value;
      if (v >= 2.0) return "high";
      if (v >= 1.5) return "moderate";
      return "default";
    }
    case "incidence":
    case "mortality_rate": {
      const v = stat.valuePercent;
      if (v >= 10) return "high";
      if (v >= 2) return "moderate";
      return "default";
    }
    case "absolute_risk": {
      const v = stat.valuePer1000;
      if (v >= 100) return "high";
      if (v >= 20) return "moderate";
      return "default";
    }
  }
}

/** CSS class for severity color. Uses existing --risk-high / --risk-moderate tokens. */
export function severityColorClass(severity: RiskSeverity): string {
  switch (severity) {
    case "high":
      return "text-[var(--risk-high)] font-semibold";
    case "moderate":
      return "text-[var(--risk-moderate)] font-semibold";
    case "default":
      return "";
  }
}

/**
 * Formats ci95 tuple as display string. Returns "—" if absent.
 * Only relative_risk, odds_ratio, and absolute_risk can have ci95.
 */
export function formatCI95(stat: RiskStatistic): string {
  if ("ci95" in stat && stat.ci95) {
    return `${stat.ci95[0]}–${stat.ci95[1]}`;
  }
  return "—";
}

/**
 * Generates a plain-English teaching interpretation for a risk statistic.
 * Appends populationDescription when provided.
 */
export function generateTeachingInterpretation(
  stat: RiskStatistic,
  populationDescription?: string,
): string {
  let text: string;

  switch (stat.type) {
    case "relative_risk": {
      text = `A relative risk of ${stat.value} means this outcome is ${stat.value}× more likely than in the reference population.`;
      if (stat.ci95) {
        text += ` The 95% confidence interval (${stat.ci95[0]}–${stat.ci95[1]}) indicates the true risk ratio likely falls within this range.`;
      }
      break;
    }
    case "odds_ratio": {
      text = `An odds ratio of ${stat.value} means ${stat.value}× the odds compared to unexposed.`;
      if (stat.ci95) {
        text += ` 95% CI: ${stat.ci95[0]}–${stat.ci95[1]}.`;
      }
      break;
    }
    case "absolute_risk": {
      const oneInN = Math.round(1000 / stat.valuePer1000);
      text = `${stat.valuePer1000} per 1,000 pregnancies — approximately 1 in ${oneInN}.`;
      if (stat.ci95) {
        text += ` 95% CI: ${stat.ci95[0]}–${stat.ci95[1]} per 1,000.`;
      }
      break;
    }
    case "incidence": {
      const oneInN = Math.round(100 / stat.valuePercent);
      text = `${stat.valuePercent}% — approximately 1 in ${oneInN} pregnancies in this population.`;
      break;
    }
    case "mortality_rate": {
      text = `Mortality rate of ${stat.valuePercent}% in this population.`;
      break;
    }
  }

  if (populationDescription) {
    text += ` Population: ${populationDescription}.`;
  }

  return text;
}
