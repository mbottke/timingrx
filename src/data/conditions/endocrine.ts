import type { ObstetricCondition } from "../types";
import { w, range, individualize, cite, grade } from "../helpers";

export const endocrineConditions: ObstetricCondition[] = [
  {
    id: "graves_well_controlled",
    name: "Graves Disease, well-controlled",
    category: "endocrine",
    tags: [
      "Graves",
      "hyperthyroidism",
      "thyroid",
      "thyrotoxicosis",
      "PTU",
      "methimazole",
      "well-controlled",
      "ATA",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("ATA", "2017 Guidelines", 2017), cite("ACOG", "PB 223", 2020)],
        timing: range(w(39), w(40, 6)),
        route: "either",
        grade: grade("C"),
        notes: "No specific early delivery indicated when well-controlled. Standard obstetric timing.",
      },
    ],
    pastFortyWeeks: "yes",
    clinicalNotes:
      "Well-controlled Graves disease does not mandate early delivery. PTU is preferred in the " +
      "first trimester (methimazole associated with embryopathy); switch to methimazole in the " +
      "second trimester if possible. Monitor TSH receptor antibodies (TRAb) as they cross the " +
      "placenta and can cause fetal/neonatal thyrotoxicosis.",
    specialConsiderations: [
      {
        type: "medication_adjustment",
        description:
          "PTU in first trimester, consider switching to methimazole in second trimester. " +
          "Use lowest effective dose to maintain free T4 at or just above the upper limit of normal.",
        citation: cite("ATA", "2017 Guidelines", 2017),
      },
      {
        type: "neonatal_consideration",
        description:
          "Measure TRAb in the third trimester. Elevated levels (>3x upper limit of normal) " +
          "warrant neonatal thyroid function monitoring for fetal/neonatal Graves disease.",
      },
    ],
    riskData: [
      {
        outcome: "fetal/neonatal thyrotoxicosis (elevated maternal TRAb)",
        statistic: { type: "incidence", valuePercent: 5 },
        populationDescription: "Neonates born to mothers with TRAb >3x upper limit of normal at 30-36 weeks",
        citation: cite("ATA", "2017 Guidelines", 2017),
      },
    ],
    riskModifiers: [
      {
        factor: "disease_severity",
        effect: "Poorly controlled disease shifts to earlier, individualized timing with significantly increased preterm risk.",
      },
    ],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "graves_poorly_controlled",
    name: "Graves Disease, poorly controlled",
    category: "endocrine",
    tags: [
      "Graves",
      "hyperthyroidism",
      "thyroid",
      "thyrotoxicosis",
      "poorly controlled",
      "thyroid storm",
      "uncontrolled",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("ATA", "2017 Guidelines", 2017)],
        timing: individualize(
          "Thyroid storm or refractory thyrotoxicosis",
          "Preterm labor (16.5x increased preterm risk with poorly controlled disease)",
          "Fetal tachycardia or fetal goiter on ultrasound",
          "Development of heart failure or severe maternal tachycardia",
          "Superimposed preeclampsia",
        ),
        route: "either",
        grade: grade("C"),
        notes:
          "Often delivers preterm due to complications. Poorly controlled hyperthyroidism " +
          "carries a 16.5x increased preterm birth risk.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Poorly controlled Graves disease carries a 16.5x increased risk of preterm birth. " +
      "Thyroid storm in pregnancy is a medical emergency with significant maternal mortality. " +
      "Delivery timing is driven by complications rather than a fixed GA target.",
    specialConsiderations: [
      {
        type: "monitoring_requirement",
        description:
          "Frequent thyroid function testing (every 2-4 weeks). Fetal ultrasound for goiter, " +
          "tachycardia, hydrops, and growth. Antenatal surveillance from 32 weeks.",
      },
      {
        type: "medication_adjustment",
        description:
          "Aggressive antithyroid medication titration. Beta-blockers (propranolol) for symptomatic " +
          "control. Thyroid storm requires ICU management with PTU, iodine, steroids, and beta-blockade.",
      },
    ],
    riskData: [
      {
        outcome: "preterm birth",
        statistic: { type: "relative_risk", value: 16.5 },
        populationDescription: "Poorly controlled Graves disease in pregnancy",
        citation: cite("ATA", "2017 Guidelines", 2017),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "hypothyroidism_well_controlled",
    name: "Hypothyroidism, well-controlled",
    category: "endocrine",
    tags: [
      "hypothyroidism",
      "thyroid",
      "levothyroxine",
      "Hashimoto",
      "TSH",
      "well-controlled",
      "ATA",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("ATA", "2017 Guidelines", 2017), cite("ACOG", "PB 223", 2020)],
        timing: range(w(39), w(40, 6)),
        route: "either",
        grade: grade("C"),
        notes: "No specific early delivery indicated when well-controlled on levothyroxine.",
      },
    ],
    pastFortyWeeks: "yes",
    clinicalNotes:
      "Well-controlled hypothyroidism on levothyroxine does not alter delivery timing. " +
      "Levothyroxine dose typically increases 30-50% during pregnancy due to increased " +
      "TBG and expanded plasma volume. TSH should be maintained <2.5 mIU/L in the first " +
      "trimester and <3.0 mIU/L in the second and third trimesters (per ATA guidelines).",
    specialConsiderations: [
      {
        type: "medication_continuation",
        description:
          "Continue levothyroxine throughout pregnancy and peripartum. Do not hold for labor " +
          "and delivery. Dose typically needs to increase by 30-50% beginning in early pregnancy.",
        citation: cite("ATA", "2017 Guidelines", 2017),
      },
      {
        type: "postpartum_management",
        description:
          "Reduce levothyroxine to pre-pregnancy dose immediately postpartum and recheck TSH " +
          "at 6 weeks. Postpartum thyroiditis occurs in 5-10% and may mimic hypothyroidism.",
      },
    ],
    riskData: [
      {
        outcome: "preeclampsia (if untreated/inadequately treated)",
        statistic: { type: "odds_ratio", value: 1.6 },
        populationDescription: "Hypothyroid pregnancies with subtherapeutic levothyroxine vs. euthyroid",
        citation: cite("ATA", "2017 Guidelines", 2017),
      },
      {
        outcome: "preterm birth (if untreated/inadequately treated)",
        statistic: { type: "odds_ratio", value: 1.7 },
        populationDescription: "Hypothyroid pregnancies with subtherapeutic levothyroxine vs. euthyroid",
        citation: cite("ATA", "2017 Guidelines", 2017),
      },
      {
        outcome: "placental abruption (if untreated/inadequately treated)",
        statistic: { type: "odds_ratio", value: 2.0 },
        populationDescription: "Hypothyroid pregnancies with subtherapeutic levothyroxine vs. euthyroid",
        citation: cite("ATA", "2017 Guidelines", 2017),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "pheochromocytoma",
    name: "Pheochromocytoma",
    category: "endocrine",
    tags: [
      "pheochromocytoma",
      "catecholamine",
      "adrenal",
      "alpha-blockade",
      "phenoxybenzamine",
      "hypertensive crisis",
      "paraganglioma",
      "cesarean",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("AHA", "Scientific Statement", 2020)],
        timing: individualize(
          "If diagnosed <24 weeks: laparoscopic adrenalectomy in second trimester preferred, then continue to term",
          "If diagnosed >24 weeks: medical management with alpha-blockade bridging to delivery",
          "Hemodynamic instability or hypertensive crisis despite medical management",
          "Adequate alpha-blockade achieved (typically 10-14 days of phenoxybenzamine or doxazosin)",
        ),
        route: "cesarean_preferred",
        grade: grade("C"),
        notes:
          "Cesarean is the preferred delivery mode to avoid catecholamine surges during " +
          "labor and Valsalva. This is one of the only conditions in obstetrics where " +
          "cesarean is preferred for the condition itself.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Pheochromocytoma is unique in that cesarean is the preferred delivery mode to avoid " +
      "catecholamine surges during labor and Valsalva. Untreated pheochromocytoma carries up " +
      "to 58% maternal-fetal mortality; with recognition and alpha-blockade, mortality drops " +
      "to <10%. If diagnosed before 24 weeks, laparoscopic adrenalectomy in the second trimester " +
      "is preferred, allowing pregnancy to continue to term. If diagnosed after 24 weeks, medical " +
      "management with alpha-blockade (phenoxybenzamine or doxazosin) bridges to delivery.",
    specialConsiderations: [
      {
        type: "medication_adjustment",
        description:
          "Alpha-blockade must be established before any beta-blocker is given (unopposed " +
          "alpha stimulation risk). Phenoxybenzamine or doxazosin for 10-14 days minimum " +
          "before surgical intervention or planned delivery.",
      },
      {
        type: "anesthesia_consideration",
        description:
          "General anesthesia with arterial line and central venous monitoring. Avoid drugs " +
          "that provoke catecholamine release (ketamine, morphine, droperidol). " +
          "Phentolamine and nitroprusside should be available for intraoperative hypertensive crisis.",
      },
      {
        type: "monitoring_requirement",
        description:
          "Continuous maternal hemodynamic monitoring. Invasive arterial BP monitoring " +
          "during delivery. ICU admission peripartum.",
      },
    ],
    riskData: [
      {
        outcome: "maternal-fetal mortality (untreated)",
        statistic: { type: "mortality_rate", valuePercent: 58 },
        populationDescription: "Untreated/unrecognized pheochromocytoma in pregnancy",
      },
      {
        outcome: "maternal-fetal mortality (treated with alpha-blockade)",
        statistic: { type: "mortality_rate", valuePercent: 10 },
        populationDescription: "Pheochromocytoma recognized and treated with alpha-blockade",
      },
    ],
    riskModifiers: [
      {
        factor: "gestational_age_at_diagnosis",
        effect:
          "Diagnosis <24 weeks allows second-trimester adrenalectomy. Diagnosis >24 weeks " +
          "requires medical management bridging to delivery.",
      },
    ],
    landmarkTrials: [],
    interactions: [
      {
        interactingConditionId: "preeclampsia_severe",
        interactionType: "monitoring_change",
        description:
          "Pheochromocytoma may be misdiagnosed as preeclampsia with severe features. " +
          "Consider screening (plasma metanephrines) for refractory or paroxysmal hypertension.",
      },
    ],
  },
  {
    id: "cushing_syndrome",
    name: "Cushing Syndrome",
    category: "endocrine",
    tags: [
      "Cushing",
      "hypercortisolism",
      "adrenal",
      "cortisol",
      "ACTH",
      "pituitary",
      "adrenal adenoma",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("other", "Expert consensus", 2023)],
        timing: individualize(
          "Severe hypertension refractory to treatment",
          "Uncontrolled gestational diabetes or diabetic ketoacidosis",
          "Preeclampsia",
          "Preterm labor (often preterm due to complications)",
          "Maternal heart failure or metabolic decompensation",
        ),
        route: "either",
        grade: grade("C"),
        notes: "Often delivers preterm due to complications. No fixed GA target exists.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Cushing syndrome in pregnancy is rare and often difficult to diagnose due to " +
      "physiologic hypercortisolism of pregnancy. Complications include gestational diabetes " +
      "(25-70%), hypertension (40-80%), preeclampsia (10-25%), and preterm delivery (40-60%). " +
      "Most cases deliver preterm due to maternal or fetal complications rather than by plan.",
    specialConsiderations: [
      {
        type: "monitoring_requirement",
        description:
          "Close monitoring of blood pressure, glucose, electrolytes (hypokalemia), and " +
          "wound healing. Growth ultrasounds for FGR.",
      },
      {
        type: "medication_adjustment",
        description:
          "If surgical treatment is indicated, second-trimester transsphenoidal or laparoscopic " +
          "adrenalectomy may be considered. Metyrapone is the most commonly used medical therapy " +
          "in pregnancy; ketoconazole is relatively contraindicated.",
      },
    ],
    riskData: [
      {
        outcome: "preterm delivery",
        statistic: { type: "incidence", valuePercent: 50 },
        populationDescription: "Pregnancies complicated by Cushing syndrome",
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "addison_disease",
    name: "Addison Disease (Primary Adrenal Insufficiency)",
    category: "endocrine",
    tags: [
      "Addison",
      "adrenal insufficiency",
      "cortisol",
      "hydrocortisone",
      "fludrocortisone",
      "adrenal crisis",
      "stress dose steroids",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("other", "European J Endocrinol", 2022)],
        timing: range(w(39), w(40, 6)),
        route: "vaginal_preferred",
        grade: grade("C"),
        notes:
          "Term or post-term delivery; do NOT induce early. Addison disease is not an " +
          "indication for early delivery. Stress-dose hydrocortisone during labor is essential.",
      },
    ],
    pastFortyWeeks: "yes",
    clinicalNotes:
      "Addison disease does not require early delivery. The key peripartum concern is " +
      "adrenal crisis prevention with stress-dose steroids. Labor and delivery require " +
      "hydrocortisone 100 mg IV bolus followed by continuous infusion or 100 mg every 6-8 " +
      "hours, with close electrolyte and glucose monitoring.",
    specialConsiderations: [
      {
        type: "medication_continuation",
        description:
          "Continue maintenance hydrocortisone and fludrocortisone throughout pregnancy. " +
          "Hydrocortisone dose may need to increase in the third trimester.",
      },
      {
        type: "medication_adjustment",
        description:
          "Stress-dose steroids for labor: hydrocortisone 100 mg IV bolus at onset of active " +
          "labor or before cesarean, then 100 mg IV every 6-8 hours or continuous infusion. " +
          "Taper over 24-48 hours postpartum back to maintenance dosing.",
        citation: cite("other", "European J Endocrinol", 2022),
      },
      {
        type: "monitoring_requirement",
        description:
          "Close monitoring of electrolytes (sodium, potassium) and glucose during labor. " +
          "IV normal saline with dextrose to prevent hypoglycemia and hyponatremia.",
      },
    ],
    riskData: [
      {
        outcome: "adrenal crisis during labor (without stress-dose steroids)",
        statistic: { type: "incidence", valuePercent: 50 },
        populationDescription: "Women with Addison disease during labor who do not receive stress-dose hydrocortisone",
        citation: cite("other", "European J Endocrinol", 2022),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "hyperparathyroidism",
    name: "Hyperparathyroidism",
    category: "endocrine",
    tags: [
      "hyperparathyroidism",
      "calcium",
      "PTH",
      "parathyroid",
      "hypercalcemia",
      "parathyroidectomy",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("other", "Expert consensus", 2023)],
        timing: individualize(
          "Severe hypercalcemia (>12 mg/dL) refractory to medical management",
          "Pancreatitis secondary to hypercalcemia",
          "Nephrolithiasis with obstruction",
          "Preeclampsia or other obstetric complications",
          "Fetal complications (polyhydramnios, FGR)",
        ),
        route: "either",
        grade: grade("C"),
        notes:
          "No fixed GA target. Parathyroidectomy in the second trimester is preferred for " +
          "symptomatic or severe disease. Mild cases may continue to term.",
      },
    ],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "Primary hyperparathyroidism in pregnancy is rare. Mild, asymptomatic disease may " +
      "be managed conservatively with hydration and monitoring, allowing delivery at term. " +
      "Severe hypercalcemia (>12 mg/dL) requires active management; parathyroidectomy in " +
      "the second trimester is the definitive treatment. Neonatal hypocalcemia may occur " +
      "due to suppression of fetal parathyroid glands from chronic maternal hypercalcemia.",
    specialConsiderations: [
      {
        type: "monitoring_requirement",
        description:
          "Serial calcium and PTH levels. Monitor for complications: nephrolithiasis, " +
          "pancreatitis, hyperemesis, and preeclampsia.",
      },
      {
        type: "neonatal_consideration",
        description:
          "Neonatal hypocalcemia may occur from chronic suppression of fetal parathyroid glands. " +
          "Monitor neonatal calcium levels after delivery.",
      },
    ],
    riskData: [
      {
        outcome: "neonatal hypocalcemia (symptomatic)",
        statistic: { type: "incidence", valuePercent: 25 },
        populationDescription: "Neonates born to mothers with untreated or undertreated primary hyperparathyroidism; suppression of fetal PTH leads to neonatal hypocalcemia",
        citation: cite("other", "Expert consensus", 2023),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
];
