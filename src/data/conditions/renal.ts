import type { ObstetricCondition } from "../types";
import { w, range, individualize, cite, grade } from "../helpers";

export const renalConditions: ObstetricCondition[] = [
  {
    id: "ckd_stages_1_3",
    name: "CKD Stages 1-3, stable function, no complications",
    category: "renal",
    tags: ["CKD", "chronic kidney disease", "renal", "stage 1", "stage 2", "stage 3", "stable"],
    guidelineRecommendations: [
      {
        citations: [cite("KDIGO", "CKD in Pregnancy", 2017)],
        timing: range(w(39), w(40)),
        route: "either",
        grade: grade("C"),
        notes: "Standard timing; delivery driven by obstetric indications, not CKD stage alone.",
      },
    ],
    pastFortyWeeks: "borderline",
    clinicalNotes:
      "CKD stages 1-3 with stable renal function and no superimposed complications (proteinuria, " +
      "HTN) can generally be managed expectantly to term. Risk of preeclampsia is increased even " +
      "in early-stage CKD. Low-dose aspirin from 12 weeks is recommended for preeclampsia prevention.",
    physiologyExplanation:
      "In normal pregnancy, GFR increases 40-50% by the second trimester, and serum creatinine falls. " +
      "In CKD, this hyperfiltration response is blunted or absent, and proteinuria may worsen due to " +
      "increased glomerular pressure. The distinction between worsening CKD and superimposed " +
      "preeclampsia can be diagnostically challenging in later gestation.",
    specialConsiderations: [
      {
        type: "monitoring_requirement",
        description:
          "Monthly serum creatinine, urine protein/creatinine ratio, and BP monitoring. " +
          "Growth ultrasound every 4 weeks from 28 wk. Antenatal surveillance from 32-34 wk.",
        citation: cite("KDIGO", "CKD in Pregnancy", 2017),
      },
    ],
    riskData: [
      {
        outcome: "preeclampsia",
        statistic: { type: "incidence", valuePercent: 30 },
        populationDescription: "Women with CKD stages 1-3 (range 20-40%; lower risk than stages 4-5)",
        citation: cite("KDIGO", "CKD in Pregnancy", 2017),
      },
      {
        outcome: "preterm birth",
        statistic: { type: "incidence", valuePercent: 25 },
        populationDescription: "Women with CKD stages 1-3 (range 20-30%)",
        citation: cite("KDIGO", "CKD in Pregnancy", 2017),
      },
    ],
    riskModifiers: [
      {
        factor: "disease_severity",
        effect: "Progression to higher CKD stage or development of heavy proteinuria shifts timing earlier.",
      },
    ],
    landmarkTrials: [],
    interactions: [
      {
        interactingConditionId: "chronic_htn",
        interactionType: "additive_risk",
        description:
          "Coexistent chronic HTN with CKD significantly increases preeclampsia risk and may " +
          "necessitate earlier delivery (37-39 wk depending on control).",
      },
    ],
  },
  {
    id: "ckd_stages_4_5",
    name: "CKD Stages 4-5, non-dialysis",
    category: "renal",
    tags: ["CKD", "chronic kidney disease", "renal", "stage 4", "stage 5", "advanced", "non-dialysis"],
    guidelineRecommendations: [
      {
        citations: [cite("KDIGO", "CKD in Pregnancy", 2017)],
        timing: individualize(
          "Worsening renal function (rising creatinine)",
          "Superimposed preeclampsia",
          "Uncontrollable hypertension",
          "Severe proteinuria with complications",
          "Fetal growth restriction",
        ),
        route: "either",
        grade: grade("C"),
        notes:
          "No fixed GA target. Delivery timing driven by maternal renal function trajectory, " +
          "BP control, and fetal status.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Advanced CKD (stages 4-5, non-dialysis) pregnancies carry high complication rates: " +
      "preeclampsia in up to 40-60%, preterm birth >50%, and FGR in ~30%. Baseline creatinine " +
      ">1.4 mg/dL is associated with accelerated loss of renal function during pregnancy. " +
      "Multidisciplinary management with nephrology is essential.",
    physiologyExplanation:
      "Severely reduced nephron mass cannot accommodate the hemodynamic demands of pregnancy. " +
      "Hyperfiltration of remaining nephrons accelerates glomerular injury. Inadequate erythropoietin " +
      "production worsens anemia, and impaired phosphate/calcium homeostasis compounds fetal bone " +
      "development concerns.",
    specialConsiderations: [
      {
        type: "monitoring_requirement",
        description:
          "Biweekly renal function panels and urine protein quantification. Weekly BP monitoring. " +
          "Growth ultrasound every 3-4 weeks from 24 wk. Antenatal surveillance from 28-32 wk.",
        citation: cite("KDIGO", "CKD in Pregnancy", 2017),
      },
      {
        type: "medication_adjustment",
        description:
          "ACE inhibitors and ARBs contraindicated. Erythropoietin-stimulating agents may be " +
          "needed for anemia (target Hb 10-11 g/dL). Consider dialysis initiation if BUN >45-50 mg/dL.",
      },
    ],
    riskData: [
      {
        outcome: "preeclampsia",
        statistic: { type: "incidence", valuePercent: 50 },
        populationDescription: "Women with CKD stages 4-5",
        citation: cite("KDIGO", "CKD in Pregnancy", 2017),
      },
    ],
    riskModifiers: [
      {
        factor: "disease_severity",
        effect: "Higher baseline creatinine correlates with earlier delivery and worse outcomes.",
      },
    ],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "hemodialysis_dependent",
    name: "Hemodialysis-dependent CKD",
    category: "renal",
    tags: ["hemodialysis", "dialysis", "HD", "ESRD", "end-stage renal disease", "renal failure"],
    guidelineRecommendations: [
      {
        citations: [cite("other", "Kidney Medicine 2024", 2024)],
        timing: range(w(33), w(38)),
        route: "either",
        grade: grade("C"),
        notes:
          "Median delivery ~33 wk historically. With intensive HD (>=36 hr/wk), gestational age " +
          "at delivery can extend up to 38 wk.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Intensive hemodialysis (>=36 hours/week) targeting pre-dialysis BUN <35 mg/dL significantly " +
      "improves gestational age at delivery and birth weight. Dialysis initiation is strongly " +
      "considered when BUN exceeds 45-50 mg/dL before 34 weeks. Common delivery triggers include " +
      "superimposed preeclampsia (17%), spontaneous preterm labor (8%), and IUGR (7%).",
    physiologyExplanation:
      "Dialysis-dependent patients lack endogenous renal function to clear uremic toxins and " +
      "maintain fluid/electrolyte balance. Intensive HD more closely mimics physiologic clearance, " +
      "reducing uremic toxin exposure to the fetus and improving placental function. Polyhydramnios " +
      "from osmotic diuresis is common and may trigger preterm labor.",
    specialConsiderations: [
      {
        type: "monitoring_requirement",
        description:
          "Pre- and post-dialysis electrolytes including potassium, calcium, and phosphorus. " +
          "Continuous fetal monitoring during dialysis sessions. Weekly growth scans from 24 wk.",
      },
      {
        type: "medication_adjustment",
        description:
          "Increase dialysis frequency to >=36 hr/wk (nocturnal or short daily HD). Target " +
          "pre-dialysis BUN <35 mg/dL. Adjust dry weight frequently as pregnancy progresses. " +
          "EPO doses typically increase 50-100%.",
      },
    ],
    riskData: [
      {
        outcome: "superimposed preeclampsia",
        statistic: { type: "incidence", valuePercent: 17 },
        populationDescription: "Hemodialysis-dependent pregnant women",
        citation: cite("other", "Kidney Medicine 2024", 2024),
      },
    ],
    riskModifiers: [
      {
        factor: "disease_severity",
        effect:
          "Intensive HD (>=36 hr/wk) improves outcomes and extends GA at delivery compared " +
          "to conventional HD schedules.",
      },
    ],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "renal_transplant",
    name: "Renal transplant recipient",
    category: "renal",
    tags: ["renal transplant", "kidney transplant", "transplant", "immunosuppression", "graft"],
    guidelineRecommendations: [
      {
        citations: [cite("SMFM", "#66", 2023)],
        timing: range(w(37), w(39, 6)),
        route: "either",
        grade: grade("2B"),
        notes:
          "Cesarean rate ~50% in practice, but transplant alone is not an indication for cesarean. " +
          "Route determined by obstetric indications.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Renal transplant pregnancies carry a 43% preterm birth rate across 6,712 pregnancies in " +
      "meta-analysis. Mycophenolate mofetil must be stopped >=6 weeks before conception " +
      "(42-52% miscarriage rate, 16-23% birth defect rate if continued). Pregnancy does not " +
      "significantly accelerate graft loss when baseline function is excellent.",
    physiologyExplanation:
      "The transplanted kidney in the iliac fossa is not obstructed by the gravid uterus as native " +
      "kidneys may be. However, immunosuppression must be carefully balanced: calcineurin inhibitors " +
      "(tacrolimus, cyclosporine) and azathioprine are continued, while mycophenolate and mTOR " +
      "inhibitors are teratogenic and must be discontinued preconception.",
    specialConsiderations: [
      {
        type: "medication_continuation",
        description:
          "Continue tacrolimus or cyclosporine (monitor trough levels monthly — volume expansion " +
          "of pregnancy lowers levels). Continue azathioprine and prednisone. Mycophenolate and " +
          "sirolimus/everolimus must be stopped preconception.",
        citation: cite("SMFM", "#66", 2023),
      },
      {
        type: "monitoring_requirement",
        description:
          "Monthly renal function (creatinine, BUN, urine protein), immunosuppressant drug levels, " +
          "and screening for rejection. Growth ultrasound every 4 weeks from 24 wk. Antenatal " +
          "surveillance from 32 wk.",
      },
    ],
    riskData: [
      {
        outcome: "preterm birth",
        statistic: { type: "incidence", valuePercent: 43 },
        populationDescription: "Renal transplant recipients (meta-analysis, n=6,712)",
        citation: cite("SMFM", "#66", 2023),
      },
    ],
    riskModifiers: [
      {
        factor: "disease_severity",
        effect:
          "Baseline graft function (creatinine >1.5 mg/dL) and proteinuria predict worse outcomes " +
          "and may shift timing earlier within the range.",
      },
    ],
    landmarkTrials: [],
    interactions: [
      {
        interactingConditionId: "chronic_htn",
        interactionType: "additive_risk",
        description:
          "Chronic HTN is common post-transplant and compounds preeclampsia risk. " +
          "May shift delivery timing toward earlier end of 37-39w6d range.",
      },
    ],
  },
  {
    id: "nephrotic_syndrome",
    name: "Nephrotic syndrome",
    category: "renal",
    tags: ["nephrotic", "proteinuria", "hypoalbuminemia", "edema", "nephrosis"],
    guidelineRecommendations: [
      {
        citations: [cite("other", "Expert consensus", 2023)],
        timing: individualize(
          "Severity of proteinuria and hypoalbuminemia",
          "Underlying etiology (membranous, FSGS, minimal change)",
          "Thromboembolic complications",
          "Superimposed preeclampsia",
          "Fetal growth restriction",
        ),
        route: "either",
        grade: grade("C"),
        notes: "No fixed GA target. Management driven by etiology and complications.",
      },
    ],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "Nephrotic syndrome in pregnancy is managed by its underlying cause. Heavy proteinuria " +
      "(>3.5 g/day) increases VTE risk substantially — prophylactic anticoagulation is often " +
      "indicated when albumin <2.5 g/dL. Distinguishing nephrotic flare from preeclampsia " +
      "requires serial labs and clinical judgment.",
    specialConsiderations: [
      {
        type: "anticoagulation_bridging",
        description:
          "Prophylactic LMWH recommended when serum albumin <2.5 g/dL due to high VTE risk " +
          "(loss of antithrombin III in urine). Coordinate anticoagulation bridging for delivery.",
      },
      {
        type: "monitoring_requirement",
        description:
          "Serial urine protein quantification, serum albumin, renal function panels. " +
          "Growth ultrasound every 3-4 weeks. Antenatal surveillance from 32 wk.",
      },
    ],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "lupus_nephritis_active",
    name: "Lupus nephritis, active",
    category: "renal",
    tags: ["lupus", "SLE", "lupus nephritis", "nephritis", "autoimmune", "glomerulonephritis"],
    guidelineRecommendations: [
      {
        citations: [cite("SMFM", "#64", 2023)],
        timing: individualize(
          "Active nephritis flare unresponsive to treatment",
          "Superimposed preeclampsia (difficult to distinguish from flare)",
          "Rapidly worsening renal function",
          "Uncontrollable hypertension",
          "Fetal growth restriction or abnormal surveillance",
        ),
        route: "either",
        grade: grade("C"),
        notes: "Often delivers earlier due to superimposed preeclampsia or lupus flare.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Active lupus nephritis in pregnancy carries the highest risk among SLE subphenotypes. " +
      "Distinguishing lupus nephritis flare from preeclampsia is a critical and challenging " +
      "clinical distinction: complement levels (C3, C4), anti-dsDNA titers, and urine sediment " +
      "help differentiate. Hydroxychloroquine should be continued throughout pregnancy (SMFM #64, " +
      "Grade 1B). Low-dose aspirin from 12 weeks is recommended.",
    physiologyExplanation:
      "Lupus nephritis involves immune complex deposition in the glomeruli, causing inflammation " +
      "and progressive renal damage. Pregnancy-associated immunomodulation may trigger flares, " +
      "particularly in the second trimester and postpartum. The complement consumption of active " +
      "lupus (low C3/C4) can help distinguish it from preeclampsia (where complement is typically " +
      "normal or elevated).",
    specialConsiderations: [
      {
        type: "medication_continuation",
        description:
          "Continue hydroxychloroquine (reduces flare risk by 50%). Azathioprine and calcineurin " +
          "inhibitors are safe in pregnancy. Mycophenolate and cyclophosphamide are contraindicated.",
        citation: cite("SMFM", "#64", 2023),
      },
      {
        type: "monitoring_requirement",
        description:
          "Monthly complement levels (C3, C4), anti-dsDNA, renal function, urine protein. " +
          "Growth ultrasound every 3-4 weeks. Weekly surveillance from 32 wk.",
        citation: cite("SMFM", "#64", 2023),
      },
    ],
    riskData: [],
    riskModifiers: [
      {
        factor: "disease_severity",
        effect:
          "Active nephritis at conception (vs. quiescent >6 months) dramatically increases " +
          "adverse outcomes and typically leads to earlier delivery.",
      },
    ],
    landmarkTrials: [],
    interactions: [
      {
        interactingConditionId: "preeclampsia_without_severe",
        interactionType: "additive_risk",
        description:
          "Superimposed preeclampsia on lupus nephritis is common and may be clinically " +
          "indistinguishable from nephritis flare. Both mandate close surveillance and often " +
          "earlier delivery.",
      },
    ],
  },
];
