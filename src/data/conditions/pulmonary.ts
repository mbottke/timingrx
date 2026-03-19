import type { ObstetricCondition } from "../types";
import { w, range, individualize, cite, grade } from "../helpers";

export const pulmonaryConditions: ObstetricCondition[] = [
  {
    id: "severe_asthma_poorly_controlled",
    name: "Severe Asthma, poorly controlled",
    category: "pulmonary",
    tags: ["asthma", "severe asthma", "poorly controlled", "reactive airway", "bronchospasm"],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "PB 90"), cite("other", "NAEPP guidelines")],
        timing: individualize(
          "Recurrent severe exacerbations requiring hospitalization",
          "Oral corticosteroid dependence",
          "ICU admission during pregnancy",
          "FGR from chronic hypoxia",
        ),
        route: "either",
        grade: grade("C"),
        notes:
          "Term delivery if stable. Individualize if poorly controlled with recurrent " +
          "exacerbations. Maintain controller medications throughout pregnancy.",
      },
    ],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "Asthma affects 4-8% of pregnancies. Poorly controlled asthma increases risks of " +
      "preeclampsia, preterm birth, and FGR. Controller medications (inhaled corticosteroids, " +
      "LABAs) should be continued — the risk of uncontrolled asthma far outweighs medication " +
      "risks. Approximately one-third of asthmatic women improve, one-third worsen, and " +
      "one-third remain unchanged during pregnancy.",
    specialConsiderations: [
      {
        type: "medication_continuation",
        description:
          "Continue all controller medications (inhaled corticosteroids, LABAs, " +
          "leukotriene receptor antagonists). Step-up therapy as needed. Systemic " +
          "corticosteroids for exacerbations are appropriate regardless of trimester.",
      },
      {
        type: "anesthesia_consideration",
        description:
          "Regional anesthesia preferred — avoids airway manipulation. If general " +
          "anesthesia needed, avoid histamine-releasing agents. Ketamine is a safe " +
          "induction agent (bronchodilator).",
      },
    ],
    riskData: [
      {
        outcome: "preeclampsia",
        statistic: { type: "odds_ratio", value: 1.75, ci95: [1.5, 2.0] },
        populationDescription: "Pregnancies with severe asthma vs. no asthma",
        citation: cite("ACOG", "PB 90"),
      },
      {
        outcome: "preterm birth",
        statistic: { type: "odds_ratio", value: 1.4, ci95: [1.3, 1.5] },
        populationDescription: "Pregnancies with severe asthma vs. no asthma",
        citation: cite("ACOG", "PB 90"),
      },
      {
        outcome: "small for gestational age (SGA)",
        statistic: { type: "odds_ratio", value: 1.3, ci95: [1.2, 1.4] },
        populationDescription: "Pregnancies with severe asthma vs. no asthma",
        citation: cite("ACOG", "PB 90"),
      },
    ],
    riskModifiers: [
      {
        factor: "disease_severity",
        effect:
          "Poorly controlled asthma (FEV1 <60%, frequent exacerbations) associated with " +
          "2-3x risk of preeclampsia and preterm birth vs. well-controlled asthma.",
      },
    ],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "cystic_fibrosis",
    name: "Cystic Fibrosis (FEV1 ≥50% predicted)",
    category: "pulmonary",
    tags: ["cystic fibrosis", "CF", "CFTR", "FEV1", "pulmonary", "pancreatic insufficiency"],
    guidelineRecommendations: [
      {
        citations: [cite("CFF", "Consensus guidelines")],
        timing: individualize(
          "Declining FEV1 or pulmonary exacerbation",
          "Maternal weight loss or nutritional failure",
          "Pulmonary hypertension",
          "FGR",
          "Cor pulmonale",
        ),
        route: "vaginal_preferred",
        grade: grade("C"),
        notes:
          "No fixed GA target. Delivery timing determined by maternal pulmonary function, " +
          "nutritional status, and fetal growth. FEV1 ≥50% predicted is the recommended " +
          "threshold before pregnancy.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "FEV1 ≥50% predicted is the recommended threshold before attempting pregnancy. " +
      "No fixed GA target exists; delivery timing is determined by maternal pulmonary " +
      "function, nutritional status, and fetal growth. Multidisciplinary management " +
      "with pulmonology is essential. CFTR modulators (elexacaftor/tezacaftor/ivacaftor) " +
      "have dramatically improved outcomes — pregnancy data are emerging but limited.",
    specialConsiderations: [
      {
        type: "monitoring_requirement",
        description:
          "Monthly pulmonary function tests. Sputum cultures every trimester. " +
          "Nutritional assessment with CF dietitian. Serial growth ultrasounds. " +
          "Screen for gestational diabetes (CF-related diabetes is common).",
      },
      {
        type: "anesthesia_consideration",
        description:
          "Regional anesthesia preferred to avoid airway manipulation. If general " +
          "anesthesia needed, avoid medications that increase mucus viscosity. " +
          "Chest physiotherapy should continue through labor.",
      },
    ],
    riskData: [
      {
        outcome: "maternal mortality within 2 years of pregnancy",
        statistic: { type: "mortality_rate", valuePercent: 5 },
        populationDescription: "CF patients with FEV1 <60% predicted (range 2-8%)",
        citation: cite("other", "CFF Consensus guidelines"),
      },
    ],
    riskModifiers: [
      {
        factor: "disease_severity",
        effect:
          "FEV1 <50% associated with significantly higher maternal and fetal morbidity. " +
          "Prepregnancy BMI <18.5 is an additional poor prognostic indicator.",
      },
    ],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "lung_transplant",
    name: "Lung Transplant Recipient",
    category: "pulmonary",
    tags: ["lung transplant", "transplant", "solid organ transplant", "post-transplant"],
    guidelineRecommendations: [
      {
        citations: [cite("CFF", "Consensus guidelines"), cite("ISHLT", "Transplant guidelines")],
        timing: individualize(
          "Graft dysfunction or declining FEV1",
          "Acute rejection episode",
          "Infection complicating immunosuppression",
          "Preeclampsia",
          "FGR",
        ),
        route: "either",
        grade: grade("C"),
        notes:
          "Often preterm due to complications. Wait ≥2-3 years post-transplant before " +
          "attempting pregnancy. Vaginal delivery is encouraged when feasible.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Lung transplant recipients face the highest complication rates of all solid organ " +
      "transplant pregnancies. Recommended interval is ≥2-3 years post-transplant with " +
      "stable graft function. Post-lung transplant CF patients should wait ≥3 years, " +
      "with ≥3-year transplant-to-pregnancy intervals showing the best outcomes. " +
      "Immunosuppression must be maintained — mycophenolate must be converted to " +
      "azathioprine before conception.",
    specialConsiderations: [
      {
        type: "medication_continuation",
        description:
          "Maintain immunosuppression: tacrolimus, azathioprine, and prednisone are " +
          "pregnancy-compatible. Mycophenolate must be stopped ≥6 weeks before " +
          "conception. Monitor tacrolimus levels closely — volume changes in pregnancy " +
          "alter pharmacokinetics.",
      },
      {
        type: "monitoring_requirement",
        description:
          "Monthly pulmonary function tests and surveillance bronchoscopy per transplant " +
          "protocol. Renal function monitoring (calcineurin inhibitor nephrotoxicity). " +
          "Serial growth ultrasounds. Screen for gestational diabetes and preeclampsia.",
      },
      {
        type: "delivery_site_requirement",
        description:
          "Deliver at a center with transplant medicine, pulmonology, MFM, and NICU.",
      },
    ],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "pulmonary_embolism_current",
    name: "Pulmonary Embolism in Current Pregnancy",
    category: "pulmonary",
    tags: [
      "pulmonary embolism", "PE", "VTE", "venous thromboembolism",
      "anticoagulation", "LMWH", "heparin",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "PB 196")],
        timing: range(w(39), w(40, 6)),
        route: "either",
        grade: grade("B"),
        notes:
          "No specific altered timing for delivery. Coordinate anticoagulation bridging: " +
          "hold therapeutic LMWH 24 hours before planned delivery.",
      },
    ],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "PE in the current pregnancy does not mandate early delivery. The key management " +
      "issue is coordination of anticoagulation around delivery. Therapeutic LMWH is " +
      "held 24 hours before planned delivery; prophylactic LMWH is held 12 hours. " +
      "Neuraxial anesthesia requires appropriate LMWH washout intervals.",
    specialConsiderations: [
      {
        type: "anticoagulation_bridging",
        description:
          "Therapeutic LMWH held 24 hours before planned delivery. Prophylactic LMWH " +
          "held 12 hours before. Restart 4-6 hours post-vaginal or 6-12 hours " +
          "post-cesarean delivery. Continue anticoagulation for at least 6 weeks " +
          "postpartum (minimum 3 months total treatment).",
      },
      {
        type: "anesthesia_consideration",
        description:
          "Neuraxial anesthesia requires ≥24 hours since last therapeutic LMWH dose " +
          "or ≥12 hours since prophylactic dose. If neuraxial timing is not feasible, " +
          "general anesthesia may be needed for cesarean.",
      },
    ],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "restrictive_lung_disease",
    name: "Restrictive Lung Disease",
    category: "pulmonary",
    tags: [
      "restrictive lung disease", "interstitial lung disease", "ILD",
      "pulmonary fibrosis", "sarcoidosis", "kyphoscoliosis",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("other", "Expert consensus")],
        timing: individualize(
          "Declining respiratory reserve or oxygen requirement",
          "FVC <1L or progressive decline",
          "Pulmonary hypertension",
          "Maternal hypoxemia (SpO2 <95%)",
          "FGR from chronic hypoxia",
        ),
        route: "either",
        grade: grade("C"),
        notes: "Individualize by respiratory reserve. No fixed GA target.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Restrictive lung disease encompasses interstitial lung disease, pulmonary fibrosis, " +
      "sarcoidosis, and severe kyphoscoliosis. Pregnancy increases oxygen consumption by " +
      "20% and tidal volume by 30-40%, which may be poorly tolerated with limited " +
      "respiratory reserve. Delivery timing depends on maternal respiratory status " +
      "and fetal growth.",
    specialConsiderations: [
      {
        type: "monitoring_requirement",
        description:
          "Serial pulmonary function tests and pulse oximetry. ABG if symptomatic. " +
          "Supplemental oxygen to maintain SpO2 ≥95%. Serial growth ultrasounds " +
          "to assess for FGR from chronic hypoxia.",
      },
      {
        type: "anesthesia_consideration",
        description:
          "Regional anesthesia preferred to avoid mechanical ventilation challenges. " +
          "If general anesthesia required, anticipate difficult ventilation with " +
          "reduced compliance. Low tidal volume ventilation strategy.",
      },
    ],
    riskData: [],
    riskModifiers: [
      {
        factor: "disease_severity",
        effect:
          "FVC <1L or significant baseline oxygen requirement is associated with " +
          "high maternal morbidity. Prepregnancy counseling essential.",
      },
    ],
    landmarkTrials: [],
    interactions: [],
  },
];
