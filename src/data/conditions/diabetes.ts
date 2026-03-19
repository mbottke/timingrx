import type { ObstetricCondition } from "../types";
import { w, range, individualize, cite, grade } from "../helpers";
import { hapoStudy, landonMfmuGdm, achoisTrial, flenadyMeta } from "../trials";

export const diabetesConditions: ObstetricCondition[] = [
  {
    id: "pregestational_dm",
    name: "Pregestational Diabetes Mellitus",
    category: "diabetes",
    tags: [
      "diabetes",
      "pregestational",
      "type 1",
      "type 2",
      "T1DM",
      "T2DM",
      "insulin",
      "DM",
      "hyperglycemia",
    ],
    stratificationAxis: "control and vascular status",
    guidelineRecommendations: [],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Pregestational diabetes (Type 1 or Type 2) carries risks of macrosomia, congenital " +
      "anomalies (4-10% with poor periconception control), preeclampsia (15-20%), stillbirth, " +
      "and neonatal hypoglycemia. NICE NG3 (2020) diverges from ACOG by recommending delivery " +
      "at 37w0d-38w6d regardless of control status, notably 1-2 weeks earlier than ACOG's " +
      "recommendation for well-controlled patients.",
    physiologyExplanation:
      "Chronic hyperglycemia causes fetal hyperinsulinemia via placental glucose transfer, " +
      "driving macrosomia (Pedersen hypothesis). Vascular disease impairs uteroplacental " +
      "perfusion, paradoxically increasing FGR risk in the same population at risk for " +
      "macrosomia. Advanced glycation end products damage placental vasculature progressively, " +
      "and the combination of metabolic and vascular insults increases stillbirth risk with " +
      "advancing gestational age, particularly beyond 39 weeks.",
    specialConsiderations: [
      {
        type: "monitoring_requirement",
        description:
          "Antenatal surveillance with weekly or twice-weekly NST/BPP starting at 32-34 weeks. " +
          "Growth ultrasound every 4 weeks from 28 weeks to assess for macrosomia or FGR.",
        citation: cite("ACOG", "PB 201", 2018),
      },
      {
        type: "neonatal_consideration",
        description:
          "Neonatal hypoglycemia monitoring is required for all infants of diabetic mothers. " +
          "Risk of RDS is increased even at term due to delayed surfactant maturation from " +
          "fetal hyperinsulinemia.",
      },
    ],
    riskData: [
      {
        outcome: "congenital anomalies",
        statistic: { type: "incidence", valuePercent: 8 },
        populationDescription: "Pregestational DM with HbA1c >8% in first trimester",
        citation: cite("ACOG", "PB 201", 2018),
      },
      {
        outcome: "preeclampsia",
        statistic: { type: "incidence", valuePercent: 18 },
        populationDescription: "Women with pregestational diabetes",
      },
      {
        outcome: "stillbirth",
        statistic: { type: "odds_ratio", value: 2.9, ci95: [2.05, 4.1] },
        populationDescription: "Pregestational diabetes vs general obstetric population",
        citation: cite("other", "Flenady et al., Lancet 2011", 2011),
      },
      {
        outcome: "macrosomia",
        statistic: { type: "incidence", valuePercent: 33 },
        populationDescription:
          "Pregestational DM pregnancies (range 25-42%)",
      },
    ],
    riskModifiers: [
      {
        factor: "disease_severity",
        effect: "Vascular complications (nephropathy, retinopathy) or poor glycemic control shift timing 1-3 weeks earlier.",
      },
      {
        factor: "prior_stillbirth",
        effect: "Prior stillbirth in the setting of diabetes may prompt earlier delivery within the recommended range.",
      },
    ],
    landmarkTrials: [flenadyMeta],
    interactions: [
      {
        interactingConditionId: "chronic_htn",
        interactionType: "additive_risk",
        description:
          "Concurrent chronic HTN and pregestational DM significantly increases preeclampsia " +
          "and FGR risk; delivery timing follows the more restrictive condition.",
      },
    ],
    subVariants: [
      {
        id: "pregestational_dm_well_controlled",
        name: "Pregestational DM, well-controlled",
        category: "diabetes",
        tags: ["diabetes", "pregestational", "well-controlled", "T1DM", "T2DM", "insulin", "good control"],
        parentConditionId: "pregestational_dm",
        guidelineRecommendations: [
          {
            citations: [cite("ACOG", "CO 831", 2021)],
            timing: range(w(39), w(39, 6)),
            route: "either",
            grade: grade("B"),
          },
          {
            citations: [cite("NICE", "NG3", 2020)],
            timing: range(w(37), w(38, 6)),
            route: "either",
            grade: grade("B"),
            notes:
              "NICE recommends 37w0d-38w6d for all pregestational DM regardless of control, " +
              "notably 1-2 weeks earlier than ACOG for well-controlled patients.",
          },
        ],
        pastFortyWeeks: "no",
        specialConsiderations: [],
        riskData: [
          {
            outcome: "macrosomia (EFW >4000g)",
            statistic: { type: "incidence", valuePercent: 20 },
            populationDescription: "Well-controlled pregestational DM (range 15-25%)",
            citation: cite("ACOG", "PB 201", 2018),
          },
          {
            outcome: "preeclampsia",
            statistic: { type: "incidence", valuePercent: 15 },
            populationDescription: "Well-controlled pregestational DM (range 12-18%)",
            citation: cite("ACOG", "PB 201", 2018),
          },
        ],
        riskModifiers: [],
        landmarkTrials: [],
        interactions: [],
      },
      {
        id: "pregestational_dm_vascular_poor_control",
        name: "Pregestational DM, vascular disease or poor control",
        category: "diabetes",
        tags: [
          "diabetes",
          "pregestational",
          "vascular",
          "poor control",
          "nephropathy",
          "retinopathy",
          "prior stillbirth",
        ],
        parentConditionId: "pregestational_dm",
        guidelineRecommendations: [
          {
            citations: [cite("ACOG", "CO 831", 2021)],
            timing: range(w(36), w(38, 6)),
            route: "either",
            grade: grade("B"),
          },
          {
            citations: [cite("NICE", "NG3", 2020)],
            timing: range(w(37), w(38, 6)),
            route: "either",
            grade: grade("B"),
            notes:
              "NICE recommends 37w0d-38w6d for all pregestational DM regardless of control.",
          },
        ],
        pastFortyWeeks: "no",
        specialConsiderations: [],
        riskData: [
          {
            outcome: "stillbirth",
            statistic: { type: "odds_ratio", value: 4.7, ci95: [2.1, 10.5] },
            populationDescription: "Pregestational DM with vascular complications vs non-diabetic pregnancies",
            citation: cite("ACOG", "PB 201", 2018),
          },
          {
            outcome: "fetal growth restriction",
            statistic: { type: "incidence", valuePercent: 20 },
            populationDescription: "Pregestational DM with nephropathy or vascular disease (range 15-25%)",
            citation: cite("ACOG", "PB 201", 2018),
          },
          {
            outcome: "preeclampsia",
            statistic: { type: "incidence", valuePercent: 30 },
            populationDescription: "Pregestational DM with vascular disease (range 25-35%)",
            citation: cite("ACOG", "PB 201", 2018),
          },
        ],
        riskModifiers: [],
        landmarkTrials: [flenadyMeta],
        interactions: [],
      },
    ],
  },
  {
    id: "gdm",
    name: "Gestational Diabetes Mellitus",
    category: "diabetes",
    tags: [
      "GDM",
      "gestational diabetes",
      "glucose intolerance",
      "A1GDM",
      "A2GDM",
      "diet-controlled",
      "insulin",
      "metformin",
      "glyburide",
    ],
    stratificationAxis: "treatment modality",
    guidelineRecommendations: [],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "GDM affects 6-9% of pregnancies. Diet-controlled GDM (A1GDM) carries lower risk than " +
      "medication-controlled (A2GDM). NICE NG3 (2020) allows uncomplicated GDM pregnancies to " +
      "continue to 40w6d without earlier induction, aligning with ACOG for diet-controlled GDM. " +
      "Poorly controlled GDM requires individualization based on glycemic trends, fetal growth, " +
      "and comorbidities.",
    physiologyExplanation:
      "GDM reflects pregnancy-induced insulin resistance exceeding pancreatic beta-cell " +
      "compensatory capacity. Placental hormones (human placental lactogen, progesterone, " +
      "cortisol) drive progressive insulin resistance peaking in the third trimester. " +
      "Fetal exposure to maternal hyperglycemia drives fetal hyperinsulinemia, promoting " +
      "macrosomia and increasing oxygen consumption, which raises the risk of intrauterine " +
      "hypoxia and stillbirth at later gestational ages.",
    specialConsiderations: [
      {
        type: "monitoring_requirement",
        description:
          "Antenatal surveillance for medication-controlled GDM: weekly NST/BPP from 32-34 weeks. " +
          "Diet-controlled GDM may not require routine antenatal testing beyond standard care.",
        citation: cite("ACOG", "PB 190", 2018),
      },
      {
        type: "postpartum_management",
        description:
          "Postpartum glucose testing (75g OGTT) at 4-12 weeks to screen for persistent diabetes. " +
          "Lifetime risk of Type 2 DM is 50-70% after GDM.",
      },
    ],
    riskData: [
      {
        outcome: "macrosomia (>4000g)",
        statistic: { type: "incidence", valuePercent: 20 },
        populationDescription: "GDM pregnancies overall (range 15-25%)",
      },
      {
        outcome: "shoulder dystocia",
        statistic: { type: "incidence", valuePercent: 3 },
        populationDescription: "GDM pregnancies (range 2-4%)",
      },
      {
        outcome: "cesarean delivery",
        statistic: { type: "relative_risk", value: 1.3 },
        populationDescription:
          "GDM vs non-diabetic pregnancies (~30% increased risk)",
      },
      {
        outcome: "stillbirth",
        statistic: { type: "incidence", valuePercent: 0.4 },
        populationDescription:
          "Well-controlled GDM — stillbirth risk not significantly elevated above background rate",
      },
    ],
    riskModifiers: [
      {
        factor: "medication_control_status",
        effect: "Need for medication (insulin, metformin, glyburide) indicates more severe disease; shifts timing earlier.",
      },
      {
        factor: "bmi",
        effect: "Obesity compounds macrosomia risk and may influence decision to deliver at the earlier end of the range.",
      },
    ],
    landmarkTrials: [hapoStudy, landonMfmuGdm, achoisTrial],
    interactions: [],
    subVariants: [
      {
        id: "gdm_diet_controlled",
        name: "GDM, diet-controlled (A1GDM)",
        category: "diabetes",
        tags: ["GDM", "gestational diabetes", "diet-controlled", "A1GDM", "lifestyle", "uncomplicated"],
        parentConditionId: "gdm",
        guidelineRecommendations: [
          {
            citations: [cite("ACOG", "CO 831", 2021)],
            timing: range(w(39), w(40, 6)),
            route: "either",
            grade: grade("B"),
          },
        ],
        pastFortyWeeks: "yes",
        specialConsiderations: [],
        riskData: [
          {
            outcome: "macrosomia (EFW >4000g)",
            statistic: { type: "incidence", valuePercent: 12 },
            populationDescription: "Diet-controlled GDM (A1GDM) — lower macrosomia risk than medication-requiring disease",
            citation: cite("ACOG", "PB 190", 2018),
          },
          {
            outcome: "stillbirth",
            statistic: { type: "incidence", valuePercent: 0.4 },
            populationDescription: "Well-controlled diet-only GDM — not significantly elevated above background rate",
            citation: cite("ACOG", "PB 190", 2018),
          },
        ],
        riskModifiers: [],
        landmarkTrials: [landonMfmuGdm, achoisTrial],
        interactions: [],
      },
      {
        id: "gdm_medication_controlled",
        name: "GDM, medication-controlled (A2GDM)",
        category: "diabetes",
        tags: [
          "GDM",
          "gestational diabetes",
          "medication-controlled",
          "A2GDM",
          "insulin",
          "metformin",
          "glyburide",
        ],
        parentConditionId: "gdm",
        guidelineRecommendations: [
          {
            citations: [cite("ACOG", "CO 831", 2021)],
            timing: range(w(39), w(39, 6)),
            route: "either",
            grade: grade("B"),
          },
        ],
        pastFortyWeeks: "no",
        specialConsiderations: [],
        riskData: [
          {
            outcome: "macrosomia (EFW >4000g)",
            statistic: { type: "incidence", valuePercent: 22 },
            populationDescription: "Medication-controlled GDM (A2GDM) — higher macrosomia risk vs diet-controlled",
            citation: cite("ACOG", "PB 190", 2018),
          },
          {
            outcome: "shoulder dystocia",
            statistic: { type: "incidence", valuePercent: 4 },
            populationDescription: "Medication-controlled GDM (range 3-6%)",
            citation: cite("ACOG", "PB 190", 2018),
          },
          {
            outcome: "neonatal hypoglycemia",
            statistic: { type: "incidence", valuePercent: 15 },
            populationDescription: "Infants of A2GDM mothers (range 10-20%)",
            citation: cite("ACOG", "PB 190", 2018),
          },
        ],
        riskModifiers: [],
        landmarkTrials: [landonMfmuGdm],
        interactions: [],
      },
      {
        id: "gdm_poorly_controlled",
        name: "GDM, poorly controlled",
        category: "diabetes",
        tags: ["GDM", "gestational diabetes", "poorly controlled", "uncontrolled", "hyperglycemia"],
        parentConditionId: "gdm",
        guidelineRecommendations: [
          {
            citations: [cite("ACOG", "CO 831", 2021)],
            timing: individualize(
              "Persistent fasting glucose >95 mg/dL or postprandial >120 mg/dL despite medication adjustment",
              "Macrosomia (EFW >90th percentile) or accelerating growth trajectory",
              "Polyhydramnios",
              "Comorbidities (hypertension, obesity) compounding risk",
            ),
            route: "either",
            grade: grade("C"),
          },
        ],
        pastFortyWeeks: "no",
        specialConsiderations: [],
        riskData: [
          {
            outcome: "macrosomia (EFW >4500g)",
            statistic: { type: "incidence", valuePercent: 18 },
            populationDescription: "Poorly controlled GDM with persistent hyperglycemia despite medication (range 12-25%)",
            citation: cite("ACOG", "PB 190", 2018),
          },
          {
            outcome: "shoulder dystocia",
            statistic: { type: "incidence", valuePercent: 6 },
            populationDescription: "Poorly controlled GDM with macrosomia (range 4-10%)",
            citation: cite("ACOG", "PB 190", 2018),
          },
          {
            outcome: "intrauterine fetal demise",
            statistic: { type: "relative_risk", value: 2.5 },
            populationDescription: "Uncontrolled GDM vs well-controlled GDM (range 2-3x baseline)",
            citation: cite("ACOG", "PB 190", 2018),
          },
        ],
        riskModifiers: [],
        landmarkTrials: [],
        interactions: [],
      },
    ],
  },
];
