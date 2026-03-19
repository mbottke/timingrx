import type { ObstetricCondition } from "../types";
import { w, range, individualize, cite, grade } from "../helpers";

export const autoimmuneConditions: ObstetricCondition[] = [
  {
    id: "sle",
    name: "Systemic Lupus Erythematosus (SLE)",
    category: "autoimmune_rheumatologic",
    tags: ["SLE", "lupus", "systemic lupus erythematosus", "autoimmune", "connective tissue"],
    stratificationAxis: "disease activity and complications",
    guidelineRecommendations: [],
    pastFortyWeeks: "no",
    clinicalNotes:
      "SMFM Consult Series #64 (2023, reaffirmed 2025) is the most authoritative source for SLE " +
      "in pregnancy. Key recommendations include continuing hydroxychloroquine throughout pregnancy " +
      "(Grade 1B), starting low-dose aspirin at 12 weeks (Grade 1B), and weekly antenatal " +
      "surveillance from 32 weeks for uncomplicated SLE. A decision-analytic model in AJOG " +
      "suggested 37 weeks as optimal delivery for SLE to balance preeclampsia, IUGR, and " +
      "stillbirth risks, though this derives from modeling rather than trial data.",
    physiologyExplanation:
      "SLE involves dysregulated adaptive immunity with autoantibody production targeting " +
      "multiple organ systems. In pregnancy, immune complex deposition in the placenta " +
      "impairs trophoblast invasion and spiral artery remodeling, increasing risks of " +
      "preeclampsia, FGR, and stillbirth. Anti-Ro/La antibodies can cross the placenta " +
      "and cause neonatal lupus or congenital heart block. Antiphospholipid antibodies " +
      "promote thrombosis in the uteroplacental vasculature.",
    specialConsiderations: [
      {
        type: "medication_continuation",
        description:
          "Continue hydroxychloroquine throughout pregnancy — discontinuation increases flare " +
          "risk. Azathioprine and tacrolimus are compatible with pregnancy. Mycophenolate, " +
          "methotrexate, and cyclophosphamide are contraindicated.",
        citation: cite("SMFM", "#64", 2023),
      },
      {
        type: "monitoring_requirement",
        description:
          "Weekly antenatal surveillance from 32 weeks. Serial growth ultrasounds every " +
          "3-4 weeks. Monitor complement levels (C3, C4) and anti-dsDNA titers for flare. " +
          "Baseline labs: CBC, CMP, urinalysis, urine protein/creatinine ratio, anti-Ro/La, " +
          "antiphospholipid antibodies.",
        citation: cite("SMFM", "#64", 2023),
      },
      {
        type: "medication_adjustment",
        description:
          "Start low-dose aspirin (81 mg) by 12 weeks for preeclampsia prophylaxis.",
        citation: cite("SMFM", "#64", 2023),
      },
    ],
    riskData: [
      {
        outcome: "preeclampsia",
        statistic: { type: "incidence", valuePercent: 20 },
        populationDescription: "Pregnant women with SLE; range 15-25%",
        citation: cite("SMFM", "#64", 2023),
      },
      {
        outcome: "fetal growth restriction",
        statistic: { type: "incidence", valuePercent: 20 },
        populationDescription: "Pregnant women with SLE; range 10-30%",
        citation: cite("SMFM", "#64", 2023),
      },
      {
        outcome: "preterm birth",
        statistic: { type: "incidence", valuePercent: 30 },
        populationDescription: "Pregnant women with SLE; range 20-40%",
        citation: cite("SMFM", "#64", 2023),
      },
      {
        outcome: "disease flare during pregnancy",
        statistic: { type: "incidence", valuePercent: 40 },
        populationDescription: "Pregnant women with SLE; range 25-65% depending on disease activity",
        citation: cite("ACR", "Reproductive health guideline", 2020),
      },
    ],
    riskModifiers: [
      {
        factor: "disease_severity",
        effect:
          "Active disease at conception or during pregnancy significantly increases risks " +
          "of preeclampsia, FGR, preterm birth, and stillbirth. Quiescent disease for " +
          "≥6 months before conception is strongly recommended.",
      },
    ],
    landmarkTrials: [],
    interactions: [],
    subVariants: [
      {
        id: "sle_uncomplicated",
        name: "SLE, uncomplicated",
        category: "autoimmune_rheumatologic",
        tags: ["SLE", "lupus", "uncomplicated", "quiescent", "stable"],
        parentConditionId: "sle",
        guidelineRecommendations: [
          {
            citations: [cite("SMFM", "#64", 2023)],
            timing: range(w(39), w(40, 6)),
            route: "either",
            grade: grade("C"),
          },
        ],
        pastFortyWeeks: "case_by_case",
        specialConsiderations: [],
        riskData: [
          {
            outcome: "preeclampsia",
            statistic: { type: "incidence", valuePercent: 15 },
            populationDescription: "Uncomplicated SLE in pregnancy (quiescent disease ≥6 months before conception); lower bound of SLE preeclampsia risk",
            citation: cite("SMFM", "#64", 2023),
          },
        ],
        riskModifiers: [],
        landmarkTrials: [],
        interactions: [],
      },
      {
        id: "sle_complicated",
        name: "SLE, complicated (active nephritis, aPL+, anti-Ro/La+, thrombosis)",
        category: "autoimmune_rheumatologic",
        tags: [
          "SLE", "lupus", "complicated", "nephritis", "lupus nephritis",
          "antiphospholipid", "aPL", "anti-Ro", "anti-La", "thrombosis",
        ],
        parentConditionId: "sle",
        guidelineRecommendations: [
          {
            citations: [cite("SMFM", "#64", 2023)],
            timing: individualize(
              "Active lupus nephritis or renal flare",
              "Positive antiphospholipid antibodies with prior thrombosis",
              "Anti-Ro/La positivity with fetal heart block surveillance",
              "Superimposed preeclampsia",
              "FGR or abnormal Dopplers",
            ),
            route: "either",
            grade: grade("C"),
            notes:
              "Earlier delivery based on specific complications. Lupus nephritis may " +
              "mimic or coexist with preeclampsia — differentiation guides management.",
          },
        ],
        pastFortyWeeks: "no",
        specialConsiderations: [
          {
            type: "neonatal_consideration",
            description:
              "Anti-Ro/La+ pregnancies: fetal echocardiography weekly from 16-26 weeks " +
              "to monitor for congenital heart block (1-2% risk; 15-20% recurrence).",
          },
        ],
        riskData: [
          {
            outcome: "congenital heart block (anti-Ro/La+ mothers)",
            statistic: { type: "incidence", valuePercent: 2 },
            populationDescription: "Anti-Ro or anti-La antibody-positive SLE pregnancies; recurrence risk 15-20% in subsequent pregnancies",
            citation: cite("SMFM", "#64", 2023),
          },
          {
            outcome: "preterm birth",
            statistic: { type: "incidence", valuePercent: 45 },
            populationDescription: "Complicated SLE (active nephritis, aPL+, prior preeclampsia)",
            citation: cite("SMFM", "#64", 2023),
          },
        ],
        riskModifiers: [],
        landmarkTrials: [],
        interactions: [],
      },
    ],
  },
  {
    id: "antiphospholipid_syndrome",
    name: "Antiphospholipid Syndrome",
    category: "autoimmune_rheumatologic",
    tags: [
      "antiphospholipid", "APS", "aPL", "lupus anticoagulant",
      "anticardiolipin", "beta-2 glycoprotein", "thrombophilia",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("ACR", "2020 guidelines", 2020), cite("ACOG", "PB 118", 2011)],
        timing: individualize(
          "Prior thrombotic event or recurrent pregnancy loss",
          "Superimposed preeclampsia",
          "FGR or abnormal surveillance",
          "Placental insufficiency",
        ),
        route: "either",
        grade: grade("C"),
        notes: "Surveillance from 32 weeks. No fixed GA target; delivery driven by complications.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "APS is defined by thrombotic events or obstetric morbidity in the presence of persistent " +
      "antiphospholipid antibodies. Treatment in pregnancy includes low-dose aspirin and " +
      "prophylactic or therapeutic heparin depending on history. Triple-positive aPL (lupus " +
      "anticoagulant + anticardiolipin + anti-beta-2 glycoprotein I) carries the highest risk.",
    specialConsiderations: [
      {
        type: "anticoagulation_bridging",
        description:
          "Prophylactic or therapeutic LMWH depending on thrombotic history. Hold LMWH " +
          "12h (prophylactic) or 24h (therapeutic) before planned delivery. Restart " +
          "4-6h post-vaginal or 6-12h post-cesarean delivery.",
      },
      {
        type: "monitoring_requirement",
        description:
          "Antenatal surveillance from 32 weeks. Serial growth ultrasounds. " +
          "Uterine artery Doppler assessment in mid-trimester may identify placental insufficiency.",
      },
    ],
    riskData: [
      {
        outcome: "recurrent pregnancy loss (untreated)",
        statistic: { type: "incidence", valuePercent: 65 },
        populationDescription: "Women with APS and no anticoagulation; range 50-80%",
        citation: cite("ACR", "2020 guidelines", 2020),
      },
      {
        outcome: "live birth rate with treatment (LMWH + low-dose aspirin)",
        statistic: { type: "incidence", valuePercent: 75 },
        populationDescription: "Women with APS on LMWH + aspirin; range 70-80%",
        citation: cite("ACR", "2020 guidelines", 2020),
      },
      {
        outcome: "preeclampsia",
        statistic: { type: "incidence", valuePercent: 30 },
        populationDescription: "Pregnant women with APS; range 10-50%",
        citation: cite("ACOG", "PB 118", 2011),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [
      {
        interactingConditionId: "sle",
        interactionType: "additive_risk",
        description:
          "SLE + APS carries higher risk than either alone. Superimposed preeclampsia " +
          "rate is significantly increased.",
      },
    ],
  },
  {
    id: "systemic_sclerosis",
    name: "Systemic Sclerosis / Scleroderma",
    category: "autoimmune_rheumatologic",
    tags: ["systemic sclerosis", "scleroderma", "SSc", "connective tissue", "autoimmune"],
    guidelineRecommendations: [
      {
        citations: [cite("other", "Expert consensus")],
        timing: individualize(
          "Scleroderma renal crisis",
          "Severe pulmonary involvement or declining PFTs",
          "Severe cardiac involvement",
          "Superimposed preeclampsia",
          "FGR",
        ),
        route: "either",
        grade: grade("C"),
        notes: "Often preterm due to complications. No fixed GA target.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Systemic sclerosis pregnancies are high-risk with increased rates of preterm birth, " +
      "FGR, and preeclampsia. Scleroderma renal crisis is the most feared complication. " +
      "ACE inhibitors are contraindicated in pregnancy but are the treatment of choice for " +
      "renal crisis — this creates a management dilemma requiring multidisciplinary input.",
    specialConsiderations: [
      {
        type: "monitoring_requirement",
        description:
          "Monitor renal function closely (creatinine, urinalysis). Serial growth " +
          "ultrasounds. Pulmonary function testing if pulmonary involvement present.",
      },
    ],
    riskData: [
      {
        outcome: "preterm birth",
        statistic: { type: "incidence", valuePercent: 35 },
        populationDescription: "Pregnancies with systemic sclerosis; range 25-45%",
        citation: cite("other", "Expert consensus"),
      },
      {
        outcome: "fetal growth restriction",
        statistic: { type: "incidence", valuePercent: 25 },
        populationDescription: "Pregnancies with systemic sclerosis; related to vascular disease and placental insufficiency",
        citation: cite("other", "Expert consensus"),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "myasthenia_gravis",
    name: "Myasthenia Gravis",
    category: "autoimmune_rheumatologic",
    tags: ["myasthenia gravis", "MG", "neuromuscular", "autoimmune", "acetylcholine receptor"],
    guidelineRecommendations: [
      {
        citations: [cite("other", "MGFA; expert consensus")],
        timing: range(w(39), w(40, 6)),
        route: "vaginal_preferred",
        grade: grade("C"),
        notes:
          "Term delivery; no specific early delivery indicated. Second stage may be " +
          "prolonged due to striated muscle weakness — assisted delivery may be needed.",
      },
    ],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "The uterus (smooth muscle) functions normally in MG. The second stage of labor may " +
      "be prolonged due to striated muscle fatigue, potentially requiring assisted vaginal " +
      "delivery. Transient neonatal myasthenia gravis occurs in 10-20% of neonates due to " +
      "transplacental transfer of anti-AChR antibodies; symptoms typically resolve within " +
      "2-4 weeks.",
    specialConsiderations: [
      {
        type: "contraindication",
        description:
          "AVOID magnesium sulfate — it impairs neuromuscular transmission and can " +
          "precipitate myasthenic crisis. If seizure prophylaxis is needed for concurrent " +
          "preeclampsia, use levetiracetam or phenytoin instead.",
      },
      {
        type: "anesthesia_consideration",
        description:
          "Regional anesthesia is safe and preferred. Avoid or minimize depolarizing " +
          "neuromuscular blocking agents. Non-depolarizing agents require reduced doses.",
      },
      {
        type: "neonatal_consideration",
        description:
          "Transient neonatal MG occurs in 10-20% of neonates. Monitor for hypotonia, " +
          "weak cry, feeding difficulty, and respiratory insufficiency for 48-72 hours.",
      },
    ],
    riskData: [
      {
        outcome: "transient neonatal myasthenia gravis",
        statistic: { type: "incidence", valuePercent: 15 },
        populationDescription: "Neonates born to mothers with MG",
      },
    ],
    riskModifiers: [
      {
        factor: "disease_severity",
        effect:
          "Exacerbation risk is highest in the first trimester and postpartum. " +
          "Continue pyridostigmine and immunosuppression throughout pregnancy.",
      },
    ],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "multiple_sclerosis_autoimmune",
    name: "Multiple Sclerosis",
    category: "autoimmune_rheumatologic",
    tags: ["multiple sclerosis", "MS", "demyelinating", "autoimmune", "neurologic"],
    guidelineRecommendations: [
      {
        citations: [cite("AAN", "Practice guideline", 2019)],
        timing: range(w(39), w(40, 6)),
        route: "either",
        grade: grade("C"),
        notes: "MS does not influence delivery timing or mode. Relapse rate decreases in " +
          "pregnancy (especially 3rd trimester) but increases postpartum.",
      },
    ],
    pastFortyWeeks: "yes",
    clinicalNotes:
      "MS does not influence delivery timing or mode. Relapse rate decreases during pregnancy " +
      "(especially in the third trimester) but increases in the first 3-6 months postpartum. " +
      "Disease-modifying therapies should be reviewed preconception — some require washout periods.",
    specialConsiderations: [
      {
        type: "anesthesia_consideration",
        description:
          "Epidural and spinal anesthesia are safe in MS. Historical concerns about " +
          "neuraxial anesthesia worsening MS are unfounded.",
      },
      {
        type: "postpartum_management",
        description:
          "Postpartum relapse risk is increased (20-40% in the first 3 months). " +
          "Discuss resumption of disease-modifying therapy and breastfeeding compatibility.",
      },
    ],
    riskData: [
      {
        outcome: "postpartum relapse in first 3-6 months",
        statistic: { type: "incidence", valuePercent: 30 },
        populationDescription: "Women with MS in first 3 months postpartum; range 20-40%",
        citation: cite("AAN", "Practice guideline", 2019),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "rheumatoid_arthritis",
    name: "Rheumatoid Arthritis",
    category: "autoimmune_rheumatologic",
    tags: ["rheumatoid arthritis", "RA", "autoimmune", "joint", "inflammatory arthritis"],
    guidelineRecommendations: [
      {
        citations: [cite("ACR", "Reproductive health guideline", 2020)],
        timing: range(w(39), w(40, 6)),
        route: "either",
        grade: grade("C"),
        notes: "Term delivery; no specific early delivery indicated.",
      },
    ],
    pastFortyWeeks: "yes",
    clinicalNotes:
      "RA often improves during pregnancy (up to 75% of patients) due to immunomodulatory " +
      "changes, but flares are common postpartum. Pregnancy-compatible DMARDs include " +
      "hydroxychloroquine, sulfasalazine, and azathioprine. Methotrexate and leflunomide " +
      "are contraindicated.",
    specialConsiderations: [
      {
        type: "medication_continuation",
        description:
          "Continue pregnancy-compatible DMARDs (hydroxychloroquine, sulfasalazine, " +
          "azathioprine). Discontinue methotrexate ≥3 months and leflunomide ≥2 years " +
          "(or after cholestyramine washout) before conception.",
      },
    ],
    riskData: [
      {
        outcome: "disease remission or improvement during pregnancy",
        statistic: { type: "incidence", valuePercent: 70 },
        populationDescription: "Women with RA during pregnancy; range 60-80%",
        citation: cite("ACR", "Reproductive health guideline", 2020),
      },
      {
        outcome: "postpartum flare",
        statistic: { type: "incidence", valuePercent: 85 },
        populationDescription: "Women with RA in the first 6 months postpartum; range 80-90%",
        citation: cite("ACR", "Reproductive health guideline", 2020),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
];
