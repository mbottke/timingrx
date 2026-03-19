import type { EvidenceSourceType } from "@/data/types";

/** Display labels for evidence source types. */
export const EVIDENCE_SOURCE_LABELS: Record<EvidenceSourceType, string> = {
  guideline_derived: "Guideline",
  case_series: "Case Series",
  protocol: "Protocol",
  cohort: "Cohort",
  surveillance: "Surveillance",
  registry: "Registry",
};

/** CSS custom property name for each evidence source type. */
const CSS_TOKEN: Record<EvidenceSourceType, string> = {
  guideline_derived: "--evidence-source-guideline",
  case_series: "--evidence-source-case-series",
  protocol: "--evidence-source-protocol",
  cohort: "--evidence-source-cohort",
  surveillance: "--evidence-source-surveillance",
  registry: "--evidence-source-registry",
};

/** Returns Tailwind class string for badge background + white text. */
export function evidenceSourceColorClass(type: EvidenceSourceType): string {
  return `bg-[var(${CSS_TOKEN[type]})] text-white`;
}

/** Returns the display label for an evidence source type. */
export function evidenceSourceLabel(type: EvidenceSourceType): string {
  return EVIDENCE_SOURCE_LABELS[type];
}
