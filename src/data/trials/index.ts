import type { LandmarkTrial } from "../types";
import { cite } from "../helpers";

export const hannahTrial: LandmarkTrial = {
  id: "hannah-1992",
  name: "Hannah",
  year: 1992,
  journalCitation: "NEJM 1992;326:1587-1592",
  sampleSize: 3407,
  summary:
    "First major RCT comparing induction vs expectant management at \u226541w. " +
    "Demonstrated lower cesarean rate with induction.",
  keyFindings: [
    "Cesarean: 21.2% (induction) vs 24.5% (expectant), P=0.03",
    "0 vs 2 perinatal deaths",
    "Pre-prostaglandin era ripening; single country",
  ],
};

export const arriveTrial: LandmarkTrial = {
  id: "arrive-2018",
  name: "ARRIVE",
  year: 2018,
  journalCitation: "NEJM 2018;379:513-523",
  sampleSize: 6106,
  summary:
    "Multicenter RCT: elective induction at 39w vs expectant in low-risk nulliparous. " +
    "Reduced cesarean rate (NNT 28) and gestational HTN, no neonatal difference.",
  keyFindings: [
    "Cesarean: 18.6% vs 22.2%, RR 0.84, P=0.002, NNT 28",
    "Gestational HTN: 9.1% vs 14.1%, RR 0.64",
    "Perinatal death: 0 vs 0 (not powered for mortality)",
    "27% enrollment rate; academic centers only",
  ],
  relevantRiskData: [
    {
      outcome: "cesarean delivery",
      statistic: { type: "relative_risk", value: 0.84, ci95: [0.76, 0.93] },
      populationDescription: "Low-risk nulliparous, 39w induction vs expectant",
    },
    {
      outcome: "gestational hypertension",
      statistic: { type: "relative_risk", value: 0.64, ci95: [0.56, 0.74] },
      populationDescription: "Low-risk nulliparous, 39w induction vs expectant",
    },
  ],
};

export const swepisTrial: LandmarkTrial = {
  id: "swepis-2019",
  name: "SWEPIS",
  year: 2019,
  journalCitation: "BMJ 2019;367:l6131",
  sampleSize: 2760,
  summary:
    "Swedish RCT: induction at 41w vs expectant to 42w. Stopped early due to " +
    "6 perinatal deaths in expectant vs 0 in induction group.",
  keyFindings: [
    "Perinatal death: 0% vs 0.44%, P=0.03",
    "NNT 230 to prevent 1 perinatal death",
    "Cesarean: 10.8% vs 10.9% (no difference)",
    "Stopped early at 27% enrollment; possible overestimated effect",
  ],
};

export const indexTrial: LandmarkTrial = {
  id: "index-2019",
  name: "INDEX",
  year: 2019,
  journalCitation: "BMJ 2019;364:l344",
  sampleSize: 1801,
  summary:
    "Dutch non-inferiority RCT: induction at 41w vs expectant to 42w. " +
    "Failed to demonstrate non-inferiority of expectant management.",
  keyFindings: [
    "Composite adverse outcome: 1.7% (induction) vs 3.1% (expectant)",
    "Perinatal death: 0.06% vs 0.17%",
    "Non-inferiority design; not powered for mortality",
  ],
};

export const alkmarkMeta: LandmarkTrial = {
  id: "alkmark-2020",
  name: "Alkmark IPD Meta-analysis",
  year: 2020,
  journalCitation: "PLOS Medicine 2020",
  sampleSize: 5161,
  summary:
    "Individual patient data meta-analysis pooling INDEX + SWEPIS + Gelisen. " +
    "Benefit of 41w induction concentrated in nulliparous women.",
  keyFindings: [
    "Perinatal death: 1 (induction) vs 8 (expectant), NNT 326",
    "Severe composite outcome NNT 175",
    "Benefit concentrated in nulliparous women: NNT 79",
    "Dominated by SWEPIS early stop; limited multiparous data",
  ],
};

export const chapTrial: LandmarkTrial = {
  id: "chap-2022",
  name: "CHAP Trial",
  year: 2022,
  journalCitation: "NEJM 2022;386:1781-1792",
  sampleSize: 2408,
  summary:
    "Treatment of mild chronic HTN to target <140/90 vs standard care reduced " +
    "preeclampsia and composite perinatal outcome without increasing SGA.",
  keyFindings: [
    "Primary composite: 30.2% vs 37.0% (aRR 0.82, 95% CI 0.74-0.92)",
    "Preeclampsia with severe features: 23.3% vs 29.1%",
    "SGA <10th percentile: No significant increase",
    "Changed ACOG practice: treat mild chronic HTN in pregnancy",
  ],
};

export const ovadiaTrial: LandmarkTrial = {
  id: "ovadia-2019",
  name: "Ovadia 2019 (ICP)",
  year: 2019,
  journalCitation: "Lancet 2019;393:899-909",
  sampleSize: 5269,
  summary:
    "IPD meta-analysis establishing bile-acid-stratified stillbirth risk " +
    "that now drives ICP delivery timing worldwide.",
  keyFindings: [
    "Stillbirth 0.13% at bile acids <40 \u00b5mol/L",
    "Stillbirth 0.28% at bile acids 40\u201399 \u00b5mol/L",
    "Stillbirth 3.44% at bile acids \u2265100 \u00b5mol/L",
    "No significant risk increase below 100 after adjusting for confounders",
  ],
  relevantRiskData: [
    {
      outcome: "stillbirth",
      statistic: { type: "absolute_risk", valuePer1000: 1.3 },
      populationDescription: "Bile acids <40 \u00b5mol/L",
      citation: cite("other", "Ovadia, Lancet 2019", 2019),
    },
    {
      outcome: "stillbirth",
      statistic: { type: "absolute_risk", valuePer1000: 2.8 },
      populationDescription: "Bile acids 40\u201399 \u00b5mol/L",
    },
    {
      outcome: "stillbirth",
      statistic: { type: "absolute_risk", valuePer1000: 34.4 },
      populationDescription: "Bile acids \u2265100 \u00b5mol/L",
    },
  ],
};

export const cochraneMiddleton: LandmarkTrial = {
  id: "cochrane-middleton-2020",
  name: "Cochrane: Induction vs Expectant Management",
  year: 2020,
  journalCitation: "Cochrane Database Syst Rev 2020;7:CD004945",
  sampleSize: undefined,
  summary:
    "Systematic review of 34 RCTs. Induction at \u226537w reduces perinatal death " +
    "(RR 0.31) and cesarean (RR 0.90) with HIGH certainty.",
  keyFindings: [
    "Perinatal death: RR 0.31 (95% CI 0.15-0.64), HIGH certainty",
    "Cesarean: RR 0.90 (95% CI 0.85-0.95)",
    "NNT 544 to prevent 1 death",
    "34 RCTs included; strongest meta-analytic evidence available",
  ],
  relevantRiskData: [
    {
      outcome: "perinatal death",
      statistic: { type: "relative_risk", value: 0.31, ci95: [0.15, 0.64] },
      populationDescription: "Induction \u226537w vs expectant management",
      citation: cite("Cochrane", "CD004945", 2020),
    },
  ],
};

export const allTrials: LandmarkTrial[] = [
  hannahTrial,
  arriveTrial,
  swepisTrial,
  indexTrial,
  alkmarkMeta,
  chapTrial,
  ovadiaTrial,
  cochraneMiddleton,
];

export const trialById = new Map(allTrials.map((t) => [t.id, t]));
