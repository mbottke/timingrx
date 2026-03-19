import type { ObstetricCondition } from "../types";
import { w, range, immediate, cite, grade } from "../helpers";
import { chapTrial, hypitatTrial, magpieTrial } from "../trials";

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
        riskData: [
          {
            outcome: "superimposed preeclampsia",
            statistic: { type: "incidence", valuePercent: 17 },
            populationDescription: "Chronic HTN without medications — lower-end estimate (range 17-25%)",
            citation: cite("ACOG", "PB 203", 2019),
          },
          {
            outcome: "placental abruption",
            statistic: { type: "incidence", valuePercent: 1 },
            populationDescription: "Chronic HTN pregnancies (range 0.7-1.5%)",
            citation: cite("ACOG", "PB 203", 2019),
          },
        ],
        riskModifiers: [],
        landmarkTrials: [chapTrial],
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
        riskData: [
          {
            outcome: "superimposed preeclampsia",
            statistic: { type: "incidence", valuePercent: 22 },
            populationDescription: "Chronic HTN on antihypertensive medications — midpoint estimate (range 17-25%)",
            citation: cite("other", "Magee et al., NEJM 2022 (CHAP trial)", 2022),
          },
          {
            outcome: "preterm birth <37 weeks",
            statistic: { type: "incidence", valuePercent: 15 },
            populationDescription: "Chronic HTN on medications, treated to target <140/90 (CHAP trial)",
            citation: cite("other", "Magee et al., NEJM 2022 (CHAP trial)", 2022),
          },
        ],
        riskModifiers: [],
        landmarkTrials: [chapTrial],
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
        riskData: [
          {
            outcome: "superimposed preeclampsia",
            statistic: { type: "incidence", valuePercent: 25 },
            populationDescription: "Chronic HTN with difficult-to-control blood pressure — upper-end estimate",
            citation: cite("ACOG", "PB 203", 2019),
          },
          {
            outcome: "placental abruption",
            statistic: { type: "incidence", valuePercent: 2 },
            populationDescription: "Chronic HTN with severe-range or uncontrolled blood pressure (range 1.5-3%)",
            citation: cite("ACOG", "PB 203", 2019),
          },
          {
            outcome: "fetal growth restriction",
            statistic: { type: "incidence", valuePercent: 15 },
            populationDescription: "Chronic HTN with poor control (range 10-20%)",
            citation: cite("ACOG", "PB 203", 2019),
          },
        ],
        riskModifiers: [],
        landmarkTrials: [chapTrial],
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
    riskData: [
      {
        outcome: "progression to preeclampsia",
        statistic: { type: "incidence", valuePercent: 25 },
        populationDescription: "Women with gestational HTN — lower bound estimate",
        citation: cite("ACOG", "PB 222", 2020),
      },
      {
        outcome: "progression to preeclampsia",
        statistic: { type: "incidence", valuePercent: 50 },
        populationDescription: "Women with gestational HTN — upper bound estimate",
        citation: cite("ACOG", "PB 222", 2020),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [
      {
        id: "hypitat-2009",
        name: "HYPITAT Trial",
        year: 2009,
        journalCitation: "Lancet 2009;374:979-988",
        sampleSize: 756,
        summary:
          "RCT comparing induction of labor vs expectant monitoring in women with " +
          "gestational HTN or mild preeclampsia at 36–41 weeks. Induction reduced " +
          "adverse maternal outcomes without increasing cesarean delivery rates.",
        keyFindings: [
          "Adverse maternal outcomes: 31% induction vs 44% expectant (RR 0.71, 95% CI 0.59-0.86)",
          "No significant difference in cesarean delivery rate",
          "Established evidence base for delivery at 37w for gestational HTN/mild PEC",
        ],
      },
    ],
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
        riskData: [
          {
            outcome: "progression to severe disease",
            statistic: { type: "incidence", valuePercent: 31 },
            populationDescription: "Gestational HTN/mild PEC managed with induction (HYPITAT)",
            citation: cite("other", "Koopmans et al., Lancet 2009", 2009),
          },
          {
            outcome: "progression to severe disease",
            statistic: { type: "incidence", valuePercent: 44 },
            populationDescription: "Gestational HTN/mild PEC managed expectantly (HYPITAT)",
            citation: cite("other", "Koopmans et al., Lancet 2009", 2009),
          },
        ],
        riskModifiers: [],
        landmarkTrials: [hypitatTrial],
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
        riskData: [
          {
            outcome: "progression to eclampsia without MgSO4",
            statistic: { type: "incidence", valuePercent: 1.5 },
            populationDescription: "Gestational HTN with severe-range BP without seizure prophylaxis (range 1-2%)",
            citation: cite("ACOG", "PB 222", 2020),
          },
          {
            outcome: "HELLP syndrome",
            statistic: { type: "incidence", valuePercent: 10 },
            populationDescription: "Gestational HTN with severe features — range 5-15%",
            citation: cite("ACOG", "PB 222", 2020),
          },
        ],
        riskModifiers: [],
        landmarkTrials: [magpieTrial],
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
    riskData: [
      {
        outcome: "eclampsia",
        statistic: { type: "incidence", valuePercent: 0.7 },
        populationDescription: "Women with preeclampsia without severe features — midpoint of reported 0.6–0.8% range",
        citation: cite("ACOG", "PB 222", 2020),
      },
      {
        outcome: "maternal mortality",
        statistic: { type: "mortality_rate", valuePercent: 0.15 },
        populationDescription: "Preeclampsia without severe features — midpoint of 0.1–0.2% range",
        citation: cite("ACOG", "PB 222", 2020),
      },
      {
        outcome: "progression to severe features",
        statistic: { type: "incidence", valuePercent: 25 },
        populationDescription: "Preeclampsia without severe features managed expectantly — midpoint 20–30%",
        citation: cite("ACOG", "PB 222", 2020),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [
      {
        id: "hypitat-2009",
        name: "HYPITAT Trial",
        year: 2009,
        journalCitation: "Lancet 2009;374:979-988",
        sampleSize: 756,
        summary:
          "RCT in women with gestational HTN or mild preeclampsia at 36–41 weeks. " +
          "Induction of labor reduced adverse maternal outcomes vs expectant monitoring " +
          "without increasing cesarean rates. Directly supports 37w delivery for mild PEC.",
        keyFindings: [
          "Adverse maternal outcomes: 31% induction vs 44% expectant (RR 0.71, 95% CI 0.59-0.86)",
          "No significant difference in cesarean delivery rate",
          "Landmark evidence base for ACOG PB 222 recommendation of delivery at 37w0d",
        ],
      },
      {
        id: "magpie-2002",
        name: "Magpie Trial",
        year: 2002,
        journalCitation: "Lancet 2002;359:1877-1890",
        sampleSize: 10141,
        summary:
          "Multinational RCT of magnesium sulfate vs placebo for women with preeclampsia. " +
          "MgSO4 halved the risk of eclampsia and appeared to reduce maternal mortality.",
        keyFindings: [
          "Eclampsia risk: 0.8% MgSO4 vs 1.9% placebo (RR 0.42, 95% CI 0.29-0.60)",
          "Maternal mortality non-significantly reduced (0.8% vs 1.2%)",
          "Established MgSO4 as standard-of-care for seizure prophylaxis in preeclampsia",
        ],
      },
    ],
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
    riskData: [
      {
        outcome: "eclampsia without MgSO4 prophylaxis",
        statistic: { type: "incidence", valuePercent: 1.5 },
        populationDescription: "Women with severe preeclampsia — midpoint of 1–2% range",
        citation: cite("ACOG", "PB 222", 2020),
      },
      {
        outcome: "maternal mortality",
        statistic: { type: "mortality_rate", valuePercent: 0.35 },
        populationDescription: "Preeclampsia with severe features — midpoint of 0.2–0.5% range",
        citation: cite("ACOG", "PB 222", 2020),
      },
      {
        outcome: "HELLP syndrome",
        statistic: { type: "incidence", valuePercent: 15 },
        populationDescription: "Preeclampsia with severe features — midpoint of 10–20% range",
        citation: cite("ACOG", "PB 222", 2020),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [
      {
        id: "phoenix-2019",
        name: "PHOENIX Trial",
        year: 2019,
        journalCitation: "NEJM 2019;380:1589-1601",
        sampleSize: 901,
        summary:
          "RCT of planned delivery vs expectant management for women with preeclampsia " +
          "at 34–36+6 weeks. Planned delivery reduced adverse maternal outcomes without " +
          "significantly worsening neonatal outcomes at this late preterm gestational age.",
        keyFindings: [
          "Adverse maternal outcomes: 41% planned delivery vs 49% expectant (aOR 0.75, 95% CI 0.55-1.02; p=0.06 — near significant)",
          "Serious neonatal morbidity not significantly increased with planned delivery",
          "Supports individualized delivery planning for late preterm severe preeclampsia",
        ],
      },
    ],
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
    riskData: [
      {
        outcome: "maternal mortality (HELLP syndrome)",
        statistic: { type: "mortality_rate", valuePercent: 2 },
        populationDescription: "Women with HELLP syndrome — midpoint of 1–3% range",
        citation: cite("ACOG", "PB 222", 2020),
      },
      {
        outcome: "maternal mortality (eclampsia)",
        statistic: { type: "mortality_rate", valuePercent: 2 },
        populationDescription: "Women with eclampsia — midpoint of 1–3% range",
        citation: cite("ACOG", "PB 222", 2020),
      },
      {
        outcome: "DIC complicating HELLP",
        statistic: { type: "incidence", valuePercent: 20 },
        populationDescription: "Women with HELLP syndrome",
        citation: cite("ACOG", "PB 222", 2020),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [
      {
        id: "magpie-2002",
        name: "Magpie Trial",
        year: 2002,
        journalCitation: "Lancet 2002;359:1877-1890",
        sampleSize: 10141,
        summary:
          "Multinational RCT of magnesium sulfate vs placebo in preeclampsia. " +
          "Established MgSO4 as the definitive treatment for eclampsia prevention " +
          "and cornerstone of management in severe disease and HELLP syndrome.",
        keyFindings: [
          "Eclampsia risk halved: 0.8% MgSO4 vs 1.9% placebo (RR 0.42, 95% CI 0.29-0.60)",
          "Maternal mortality non-significantly reduced (0.8% vs 1.2%)",
          "Benefit consistent across subgroups including severe preeclampsia and HELLP",
          "Standard-of-care basis for MgSO4 in eclampsia/HELLP management globally",
        ],
      },
    ],
    interactions: [],
  },
];
