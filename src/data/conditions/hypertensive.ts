import type { ObstetricCondition } from "../types";
import { w, range, immediate, cite, grade } from "../helpers";

export const hypertensiveConditions: ObstetricCondition[] = [
  {
    id: "chronic_htn",
    name: "Chronic Hypertension",
    category: "hypertensive",
    tags: ["hypertension", "HTN", "blood pressure", "chronic", "essential hypertension", "CHAP"],
    stratificationAxis: "medication status and control",
    guidelineRecommendations: [],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Chronic HTN affects 1-5% of pregnancies. The CHAP trial (2022) demonstrated that " +
      "treating mild chronic HTN (target <140/90) with first-line agents reduces preeclampsia " +
      "(RR 0.81), preterm birth, and placental abruption without increasing SGA neonates.",
    physiologyExplanation:
      "Chronic hypertension impairs spiral artery remodeling in early pregnancy, reducing " +
      "uteroplacental perfusion. This inadequate remodeling is the shared pathophysiology " +
      "with superimposed preeclampsia, which occurs in 17-25% of chronic HTN pregnancies. " +
      "Progressive endothelial dysfunction, oxidative stress, and placental ischemia create " +
      "a self-reinforcing cycle that worsens with advancing gestational age.",
    specialConsiderations: [
      {
        type: "medication_continuation",
        description:
          "Continue antihypertensives through delivery. Labetalol, nifedipine, and methyldopa " +
          "are first-line. ACE inhibitors and ARBs are contraindicated in pregnancy.",
        citation: cite("ACOG", "PB 203", 2019),
      },
      {
        type: "monitoring_requirement",
        description:
          "Baseline labs: CBC, CMP, urine protein/creatinine ratio. Repeat if symptoms " +
          "of superimposed preeclampsia develop. Growth ultrasound every 4 weeks from 28 wk.",
      },
    ],
    riskData: [
      {
        outcome: "superimposed preeclampsia",
        statistic: { type: "incidence", valuePercent: 25 },
        populationDescription: "Women with chronic HTN",
        citation: cite("ACOG", "PB 203", 2019),
      },
    ],
    riskModifiers: [
      {
        factor: "disease_severity",
        effect: "Poorly controlled HTN shifts timing 1-2 weeks earlier.",
      },
      {
        factor: "maternal_age",
        effect: "AMA ≥40 compounds stillbirth risk; consider earlier end of range.",
      },
    ],
    landmarkTrials: [
      {
        id: "chap-2022",
        name: "CHAP Trial",
        year: 2022,
        journalCitation: "NEJM 2022;386:1781-1792",
        sampleSize: 2408,
        summary:
          "Treatment of mild chronic HTN to target <140/90 vs standard care (<160/105) " +
          "reduced preeclampsia with severe features and composite perinatal outcome, " +
          "without increasing SGA.",
        keyFindings: [
          "Primary composite: 30.2% vs 37.0% (aRR 0.82, 95% CI 0.74-0.92)",
          "Preeclampsia with severe features: 23.3% vs 29.1%",
          "SGA <10th percentile: No significant increase (11.2% vs 10.4%)",
          "Changed ACOG practice: treat mild chronic HTN in pregnancy",
        ],
      },
    ],
    interactions: [],
    subVariants: [
      {
        id: "chronic_htn_no_meds",
        name: "Chronic HTN, uncomplicated, no medications",
        category: "hypertensive",
        tags: ["hypertension", "HTN", "mild", "uncomplicated", "no meds"],
        parentConditionId: "chronic_htn",
        guidelineRecommendations: [
          {
            citations: [cite("ACOG", "CO 831", 2021)],
            timing: range(w(38), w(39, 6)),
            route: "either",
            grade: grade("B"),
          },
        ],
        pastFortyWeeks: "no",
        specialConsiderations: [],
        riskData: [],
        riskModifiers: [],
        landmarkTrials: [],
        interactions: [],
      },
      {
        id: "chronic_htn_controlled_meds",
        name: "Chronic HTN, controlled on medications",
        category: "hypertensive",
        tags: ["hypertension", "HTN", "controlled", "medications", "labetalol", "nifedipine"],
        parentConditionId: "chronic_htn",
        guidelineRecommendations: [
          {
            citations: [cite("ACOG", "CO 831", 2021)],
            timing: range(w(37), w(39, 6)),
            route: "either",
            grade: grade("B"),
          },
          {
            citations: [cite("NICE", "NG133", 2019)],
            timing: range(w(37), w(37)),
            route: "either",
            grade: grade("B"),
            notes: "NICE recommends delivery by 37w0d for chronic HTN on medication.",
          },
        ],
        pastFortyWeeks: "no",
        specialConsiderations: [],
        riskData: [],
        riskModifiers: [],
        landmarkTrials: [],
        interactions: [],
      },
      {
        id: "chronic_htn_difficult_control",
        name: "Chronic HTN, difficult to control",
        category: "hypertensive",
        tags: ["hypertension", "HTN", "severe", "difficult to control", "resistant", "refractory"],
        parentConditionId: "chronic_htn",
        guidelineRecommendations: [
          {
            citations: [cite("ACOG", "CO 831", 2021)],
            timing: range(w(36), w(37, 6)),
            route: "either",
            grade: grade("B"),
          },
        ],
        pastFortyWeeks: "no",
        specialConsiderations: [],
        riskData: [],
        riskModifiers: [],
        landmarkTrials: [],
        interactions: [],
      },
    ],
  },
  {
    id: "gestational_htn",
    name: "Gestational Hypertension",
    category: "hypertensive",
    tags: ["gestational hypertension", "gHTN", "PIH", "pregnancy-induced hypertension"],
    stratificationAxis: "severity (with or without severe features)",
    guidelineRecommendations: [],
    pastFortyWeeks: "no",
    clinicalNotes:
      "New-onset hypertension ≥140/90 after 20 weeks without proteinuria or other features " +
      "of preeclampsia. Up to 50% progress to preeclampsia.",
    physiologyExplanation:
      "Unlike chronic HTN, gestational HTN reflects a pregnancy-specific vascular maladaptation. " +
      "The absence of proteinuria distinguishes it from preeclampsia, but the pathophysiology of " +
      "endothelial dysfunction and increased vascular reactivity overlaps substantially. The high " +
      "progression rate to preeclampsia (25-50%) reflects this shared mechanism.",
    specialConsiderations: [],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
    subVariants: [
      {
        id: "gestational_htn_no_severe",
        name: "Gestational HTN without severe features",
        category: "hypertensive",
        tags: ["gestational hypertension", "gHTN", "mild", "no severe features"],
        parentConditionId: "gestational_htn",
        guidelineRecommendations: [
          {
            citations: [cite("ACOG", "CO 831", 2021), cite("SMFM", "CHAP guidance", 2022)],
            timing: range(w(37), w(37)),
            route: "either",
            grade: grade("A"),
            notes: "At 37w0d or at diagnosis if later.",
          },
        ],
        pastFortyWeeks: "no",
        specialConsiderations: [],
        riskData: [],
        riskModifiers: [],
        landmarkTrials: [],
        interactions: [],
      },
      {
        id: "gestational_htn_severe",
        name: "Gestational HTN with severe features",
        category: "hypertensive",
        tags: ["gestational hypertension", "gHTN", "severe", "severe range BP"],
        parentConditionId: "gestational_htn",
        guidelineRecommendations: [
          {
            citations: [cite("ACOG", "CO 831", 2021)],
            timing: range(w(34), w(34)),
            route: "either",
            grade: grade("B"),
            notes: "At 34w0d or at diagnosis if later.",
          },
        ],
        pastFortyWeeks: "no",
        specialConsiderations: [],
        riskData: [],
        riskModifiers: [],
        landmarkTrials: [],
        interactions: [],
      },
    ],
  },
  {
    id: "preeclampsia_without_severe",
    name: "Preeclampsia without severe features",
    category: "hypertensive",
    tags: ["preeclampsia", "PEC", "PE", "toxemia", "proteinuria", "hypertension"],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "PB 222", 2020)],
        timing: range(w(37), w(37)),
        route: "either",
        grade: grade("A"),
        notes: "At 37w0d or at diagnosis if later.",
      },
      {
        citations: [cite("NICE", "NG133", 2019)],
        timing: range(w(37), w(37)),
        route: "either",
        grade: grade("B"),
        notes: "NICE aligns with ACOG on 37w0d for preeclampsia without severe features.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "BP ≥140/90 + proteinuria (≥300 mg/24h or P/C ratio ≥0.3) after 20 weeks. " +
      "Delivery at 37w0d is supported by the HYPITAT trial and ACOG PB 222.",
    physiologyExplanation:
      "Preeclampsia originates from defective trophoblast invasion of spiral arteries in " +
      "the first trimester. This leads to placental ischemia, release of anti-angiogenic " +
      "factors (sFlt-1, soluble endoglin), and systemic endothelial dysfunction. The resulting " +
      "vasospasm, increased vascular permeability, and end-organ damage are progressive and " +
      "only cured by delivery (removal of the placenta).",
    specialConsiderations: [
      {
        type: "monitoring_requirement",
        description:
          "Twice-weekly BP monitoring, weekly labs (CBC, CMP, LDH), and weekly BPP/NST. " +
          "Assess for progression to severe features at each visit.",
      },
      {
        type: "medication_adjustment",
        description:
          "Magnesium sulfate for seizure prophylaxis during labor and 24h postpartum. " +
          "Antihypertensives for severe-range BPs (≥160/110).",
      },
    ],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [
      {
        interactingConditionId: "chronic_htn",
        interactionType: "timing_shift",
        description:
          "Superimposed preeclampsia on chronic HTN may necessitate earlier delivery " +
          "depending on severity.",
      },
    ],
  },
  {
    id: "preeclampsia_severe",
    name: "Preeclampsia with severe features, stable",
    category: "hypertensive",
    tags: ["preeclampsia", "severe", "severe features", "BP 160/110"],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "PB 222", 2020)],
        timing: range(w(34), w(34)),
        route: "either",
        grade: grade("B"),
        notes: "At 34w0d or at diagnosis if later. Expectant management 24-34w at tertiary center.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Severe features: BP ≥160/110 twice, thrombocytopenia (<100K), transaminases >2× normal, " +
      "creatinine >1.1 or doubling, pulmonary edema, new-onset headache/visual symptoms.",
    specialConsiderations: [
      {
        type: "medication_adjustment",
        description: "Magnesium sulfate for seizure prophylaxis. IV labetalol or hydralazine for acute severe HTN.",
      },
      {
        type: "delivery_site_requirement",
        description: "Expectant management <34w should only occur at centers with NICU.",
      },
    ],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "hellp_eclampsia",
    name: "HELLP syndrome / Eclampsia / Unstable severe preeclampsia",
    category: "hypertensive",
    tags: ["HELLP", "eclampsia", "hemolysis", "elevated liver enzymes", "low platelets", "seizure"],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "PB 222", 2020)],
        timing: immediate("After maternal stabilization, any GA. Delivery within 24-48h at ≥34w."),
        route: "either",
        grade: grade("C"),
        notes:
          "≥34w: corticosteroids + deliver 24-48h. 27-34w: betamethasone + deliver 48h. " +
          "<27w: expectant 48-72h controversial, tertiary only.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "HELLP = Hemolysis + Elevated Liver enzymes + Low Platelets. Eclampsia = seizures. " +
      "Both require immediate stabilization and delivery.",
    specialConsiderations: [
      {
        type: "medication_adjustment",
        description: "MgSO4: 4-6g IV load, then 1-2g/hr. Monitor for toxicity (reflexes, RR, urine output).",
      },
    ],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
];
