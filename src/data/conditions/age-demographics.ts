import type { ObstetricCondition } from "../types";
import { w, range, individualize, cite, grade } from "../helpers";
import { reddyStudy, flenadyMeta } from "../trials";

export const ageDemographicsConditions: ObstetricCondition[] = [
  {
    id: "ama_35_39",
    name: "Advanced Maternal Age 35-39",
    category: "age_demographics",
    tags: ["AMA", "advanced maternal age", "age 35", "maternal age", "elderly gravida"],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "OCC #11", 2022), cite("SMFM", "OCC #11", 2022)],
        timing: individualize(
          "No mandatory early induction",
          "Enhanced counseling regarding stillbirth risk",
          "Shared decision-making about 39-week induction",
        ),
        route: "either",
        grade: grade("C"),
        notes:
          "Insufficient evidence for specific timing beyond routine. Enhanced counseling " +
          "recommended. Stillbirth risk RR 1.32 (1 in 382 pregnancies at 37-41 weeks).",
      },
    ],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "ACOG/SMFM OCC #11 (2022) finds insufficient evidence for a specific delivery " +
      "timing recommendation at ages 35-39. Stillbirth risk is RR 1.32 vs <35 " +
      "(1 in 382 pregnancies at 37-41 weeks). Enhanced counseling and shared " +
      "decision-making are recommended.",
    riskData: [
      {
        outcome: "stillbirth at 37-41 weeks",
        statistic: { type: "relative_risk", value: 1.32 },
        populationDescription: "Women age 35-39 vs <35",
        citation: cite("ACOG", "OCC #11", 2022),
      },
      {
        outcome: "stillbirth at 37-41 weeks",
        statistic: { type: "absolute_risk", valuePer1000: 2.62 },
        populationDescription: "Women age 35-39 (1 in 382)",
        citation: cite("ACOG", "OCC #11", 2022),
      },
    ],
    specialConsiderations: [],
    riskModifiers: [],
    landmarkTrials: [reddyStudy, flenadyMeta],
    interactions: [],
  },
  {
    id: "ama_40_plus",
    name: "Advanced Maternal Age >=40",
    category: "age_demographics",
    tags: ["AMA", "advanced maternal age", "age 40", "maternal age", "elderly gravida"],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "OCC #11", 2022), cite("SMFM", "OCC #11", 2022)],
        timing: range(w(39), w(39, 6)),
        route: "either",
        grade: grade("2C"),
        notes:
          "Delivery at 39w0d-39w6d should be considered (Grade 2C: weak recommendation, " +
          "low-quality evidence). Stillbirth risk RR 1.88 (1 in 267 pregnancies).",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "ACOG/SMFM OCC #11 (2022) recommends considering delivery at 39w0d-39w6d for " +
      "women >=40. This is graded 2C (weak recommendation, low-quality evidence). " +
      "Stillbirth risk at 37-41 weeks is 1 in 267 (RR 1.88 vs <35). Antenatal " +
      "surveillance starting between 32-36 weeks is reasonable.",
    riskData: [
      {
        outcome: "stillbirth at 37-41 weeks",
        statistic: { type: "relative_risk", value: 1.88 },
        populationDescription: "Women age >=40 vs <35",
        citation: cite("ACOG", "OCC #11", 2022),
      },
      {
        outcome: "stillbirth at 37-41 weeks",
        statistic: { type: "absolute_risk", valuePer1000: 3.75 },
        populationDescription: "Women age >=40 (1 in 267)",
        citation: cite("ACOG", "OCC #11", 2022),
      },
    ],
    specialConsiderations: [
      {
        type: "monitoring_requirement",
        description: "Antenatal surveillance starting between 32-36 weeks is reasonable for age >=40.",
      },
    ],
    riskModifiers: [],
    landmarkTrials: [reddyStudy, flenadyMeta],
    interactions: [],
  },
  {
    id: "ama_45_plus",
    name: "Advanced Maternal Age >=45",
    category: "age_demographics",
    tags: ["AMA", "very advanced maternal age", "age 45", "maternal age"],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "OCC #11", 2022), cite("SMFM", "OCC #11", 2022)],
        timing: range(w(39), w(39, 6)),
        route: "either",
        grade: grade("C"),
        notes: "Same recommendation as age >=40: delivery at 39w0d-39w6d should be considered.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "ACOG/SMFM OCC #11 applies the same 39w0d-39w6d recommendation for >=45 as " +
      "for >=40. Risk profile is further elevated with additional comorbidities " +
      "common at this age.",
    specialConsiderations: [
      {
        type: "monitoring_requirement",
        description: "Antenatal surveillance starting at 32-36 weeks. Higher vigilance for comorbidities.",
      },
    ],
    riskData: [
      {
        outcome: "stillbirth at 37-41 weeks",
        statistic: { type: "relative_risk", value: 2.2 },
        populationDescription: "Women age ≥45 vs <35; further elevated above ≥40 group",
        citation: cite("ACOG", "OCC #11", 2022),
      },
      {
        outcome: "gestational diabetes mellitus",
        statistic: { type: "incidence", valuePercent: 20 },
        populationDescription: "Women age ≥45 (range 15-25%; markedly elevated vs. younger cohorts)",
        citation: cite("SMFM", "OCC #11", 2022),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [reddyStudy, flenadyMeta],
    interactions: [],
  },
  {
    id: "ivf_autologous",
    name: "IVF Pregnancy (autologous oocytes)",
    category: "age_demographics",
    tags: ["IVF", "in vitro fertilization", "ART", "assisted reproduction", "autologous"],
    guidelineRecommendations: [
      {
        citations: [cite("SMFM", "#60", 2022)],
        timing: individualize(
          "No specific altered timing",
          "Shared decision-making regarding 39-week induction",
          "Use transfer-based dating for GA calculation",
        ),
        route: "either",
        grade: grade("C"),
        notes: "No altered timing. Use transfer-based dating rather than LMP.",
      },
    ],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "IVF with autologous oocytes does not independently alter delivery timing. " +
      "Gestational age should be calculated from the known transfer date rather than LMP. " +
      "Shared decision-making about 39-week induction is appropriate.",
    specialConsiderations: [],
    riskData: [
      {
        outcome: "preeclampsia",
        statistic: { type: "odds_ratio", value: 1.5 },
        populationDescription: "IVF (autologous) pregnancies vs. spontaneous conception, after adjusting for AMA",
        citation: cite("SMFM", "#60", 2022),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "donor_oocyte",
    name: "Donor Oocyte Pregnancy",
    category: "age_demographics",
    tags: ["donor egg", "donor oocyte", "oocyte donation", "egg donation", "ART"],
    guidelineRecommendations: [
      {
        citations: [cite("SMFM", "#60", 2022)],
        timing: individualize(
          "No specific GA target",
          "High preeclampsia risk (2.5-4.5x increased)",
          "Manage by complications that develop",
        ),
        route: "either",
        grade: grade("C"),
        notes:
          "No specific GA target for donor oocyte alone. High preeclampsia risk " +
          "(2.5-4.5x increased) drives clinical decisions.",
      },
    ],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "Donor oocyte pregnancies carry a 2.5-4.5x increased risk of preeclampsia " +
      "due to immunologic factors (fetal semi-allogenicity). Delivery timing is " +
      "driven by complications that develop, particularly preeclampsia.",
    riskData: [
      {
        outcome: "preeclampsia",
        statistic: { type: "relative_risk", value: 3.5 },
        populationDescription: "Donor oocyte vs autologous IVF (range 2.5-4.5x)",
        citation: cite("SMFM", "#60", 2022),
      },
    ],
    specialConsiderations: [
      {
        type: "monitoring_requirement",
        description:
          "Enhanced preeclampsia surveillance. Low-dose aspirin from 12 weeks. " +
          "Serial BP monitoring and labs as indicated.",
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "adolescent_under_18",
    name: "Adolescent Pregnancy (<18)",
    category: "age_demographics",
    tags: ["adolescent", "teen pregnancy", "young maternal age", "under 18"],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "Clinical guidance")],
        timing: individualize(
          "No altered timing",
          "Standard obstetric management",
        ),
        route: "either",
        grade: grade("C"),
        notes: "No altered delivery timing for adolescent age alone.",
      },
    ],
    pastFortyWeeks: "yes",
    clinicalNotes:
      "Adolescent age alone does not alter delivery timing. Standard obstetric " +
      "management applies. Higher rates of preeclampsia, anemia, and preterm birth " +
      "may be observed but are managed per those specific conditions.",
    specialConsiderations: [],
    riskData: [
      {
        outcome: "preeclampsia",
        statistic: { type: "relative_risk", value: 1.5 },
        populationDescription: "Adolescent pregnancies (<18) vs. adult pregnancies; higher risk likely driven by social determinants",
        citation: cite("ACOG", "Clinical guidance"),
      },
      {
        outcome: "preterm birth <37 weeks",
        statistic: { type: "relative_risk", value: 1.3 },
        populationDescription: "Adolescent pregnancies (<18) vs. women age 20-35",
        citation: cite("ACOG", "Clinical guidance"),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "grand_multiparity",
    name: "Grand Multiparity (>=5)",
    category: "age_demographics",
    tags: ["grand multiparity", "high parity", "multipara", "grand multip"],
    guidelineRecommendations: [
      {
        citations: [cite("other", "Expert consensus")],
        timing: individualize(
          "No altered timing",
          "NOT an independent risk factor for rupture during TOLAC",
        ),
        route: "either",
        grade: grade("C"),
        notes: "No specific altered delivery timing. Not an independent risk factor for uterine rupture during TOLAC.",
      },
    ],
    pastFortyWeeks: "yes",
    clinicalNotes:
      "Grand multiparity alone does not alter delivery timing and is not an " +
      "independent risk factor for uterine rupture during TOLAC.",
    specialConsiderations: [],
    riskData: [
      {
        outcome: "postpartum hemorrhage",
        statistic: { type: "relative_risk", value: 1.6 },
        populationDescription: "Grand multiparous women (≥5 deliveries) vs. women with 1-4 prior deliveries; uterine atony risk increases with parity",
        citation: cite("other", "Expert consensus"),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
];
