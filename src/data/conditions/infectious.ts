import type { ObstetricCondition } from "../types";
import { w, range, individualize, cite, grade } from "../helpers";

export const infectiousConditions: ObstetricCondition[] = [
  {
    id: "hiv",
    name: "HIV in Pregnancy",
    category: "infectious",
    tags: ["HIV", "human immunodeficiency virus", "viral load", "ART", "antiretroviral"],
    stratificationAxis: "viral load and ART status",
    guidelineRecommendations: [],
    pastFortyWeeks: "no",
    clinicalNotes:
      "HIV delivery management is stratified by viral load. Cesarean at 38w0d is required when " +
      "viral load is >=1,000 copies/mL or unknown near delivery. When viral load is suppressed " +
      "(<1,000) on ART, vaginal delivery at >=39w0d is appropriate.",
    physiologyExplanation:
      "Vertical HIV transmission occurs primarily during labor and delivery via exposure to " +
      "maternal blood and genital secretions. Scheduled cesarean before labor onset and membrane " +
      "rupture reduces intrapartum viral exposure. Effective ART suppresses viral replication, " +
      "reducing plasma and genital tract viral load to levels where vaginal delivery carries " +
      "minimal additional transmission risk.",
    specialConsiderations: [
      {
        type: "medication_continuation",
        description:
          "Continue ART throughout labor and delivery. Intravenous zidovudine is recommended " +
          "during labor for women with viral load >=1,000 copies/mL or unknown viral load.",
        citation: cite("ACOG", "CO 831", 2021),
      },
      {
        type: "neonatal_consideration",
        description:
          "Neonatal antiretroviral prophylaxis should be initiated within 6 hours of birth. " +
          "Regimen is determined by maternal viral load and ART adherence.",
      },
    ],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
    subVariants: [
      {
        id: "hiv_high_vl",
        name: "HIV, viral load >=1,000 copies/mL or unknown",
        category: "infectious",
        tags: ["HIV", "high viral load", "unknown viral load", "cesarean"],
        parentConditionId: "hiv",
        guidelineRecommendations: [
          {
            citations: [cite("ACOG", "CO 831", 2021)],
            timing: range(w(38), w(38)),
            route: "cesarean_required",
            grade: grade("A"),
            notes:
              "Scheduled cesarean at 38w0d to minimize risk of labor onset or membrane rupture. " +
              "Intravenous zidovudine should be administered during delivery.",
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
        id: "hiv_low_vl",
        name: "HIV, viral load <1,000 on ART",
        category: "infectious",
        tags: ["HIV", "suppressed", "low viral load", "ART", "antiretroviral"],
        parentConditionId: "hiv",
        guidelineRecommendations: [
          {
            citations: [cite("ACOG", "CO 831", 2021)],
            timing: range(w(39), w(40, 6)),
            route: "either",
            grade: grade("A"),
            notes: "Standard obstetric timing >=39w0d. HIV with suppressed VL is not an indication for cesarean.",
          },
        ],
        pastFortyWeeks: "case_by_case",
        specialConsiderations: [],
        riskData: [],
        riskModifiers: [],
        landmarkTrials: [],
        interactions: [],
      },
    ],
  },
  {
    id: "hsv",
    name: "Herpes Simplex Virus (HSV) in Pregnancy",
    category: "infectious",
    tags: ["HSV", "herpes", "genital herpes", "HSV-1", "HSV-2"],
    stratificationAxis: "lesion status and outbreak type (primary vs recurrent)",
    guidelineRecommendations: [],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "HSV management in pregnancy depends on lesion status at labor and whether the infection " +
      "is primary or recurrent. Neonatal herpes transmission risk is 30-50% with a primary " +
      "outbreak at delivery versus <1% with recurrent disease. Suppressive therapy with " +
      "acyclovir or valacyclovir from 36 weeks is recommended for all women with recurrent " +
      "genital herpes.",
    physiologyExplanation:
      "Neonatal HSV transmission occurs primarily through direct contact with viral shedding " +
      "in the genital tract during vaginal delivery. Primary infections produce higher viral " +
      "loads and lack protective maternal antibodies, resulting in transmission rates of 30-50%. " +
      "Recurrent episodes have lower viral shedding and are partially attenuated by maternal " +
      "IgG crossing the placenta, reducing transmission to <1%.",
    specialConsiderations: [
      {
        type: "medication_continuation",
        description:
          "Suppressive therapy (acyclovir 400 mg TID or valacyclovir 500 mg BID) from 36 weeks " +
          "reduces recurrence at delivery and viral shedding.",
        citation: cite("ACOG", "PB 220", 2020),
      },
    ],
    riskData: [
      {
        outcome: "neonatal HSV transmission (primary outbreak at delivery)",
        statistic: { type: "incidence", valuePercent: 40 },
        populationDescription: "Women with primary HSV outbreak at time of delivery",
        citation: cite("ACOG", "PB 220", 2020),
      },
      {
        outcome: "neonatal HSV transmission (recurrent HSV at delivery)",
        statistic: { type: "incidence", valuePercent: 1 },
        populationDescription: "Women with recurrent HSV at time of delivery",
        citation: cite("ACOG", "PB 220", 2020),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
    subVariants: [
      {
        id: "hsv_active_lesions",
        name: "HSV, active genital lesions at delivery",
        category: "infectious",
        tags: ["HSV", "herpes", "active lesions", "cesarean"],
        parentConditionId: "hsv",
        guidelineRecommendations: [
          {
            citations: [cite("ACOG", "PB 220", 2020)],
            timing: individualize("At labor onset or when delivery is indicated"),
            route: "cesarean_required",
            grade: grade("A"),
            notes:
              "Cesarean delivery is indicated when active genital lesions or prodromal symptoms " +
              "are present at the time of labor.",
          },
        ],
        pastFortyWeeks: "case_by_case",
        specialConsiderations: [],
        riskData: [],
        riskModifiers: [],
        landmarkTrials: [],
        interactions: [],
      },
      {
        id: "hsv_recurrent_no_lesions",
        name: "HSV, recurrent, no active lesions + suppressive therapy from 36 wk",
        category: "infectious",
        tags: ["HSV", "herpes", "recurrent", "no lesions", "suppressive therapy"],
        parentConditionId: "hsv",
        guidelineRecommendations: [
          {
            citations: [cite("ACOG", "PB 220", 2020)],
            timing: range(w(39), w(40, 6)),
            route: "vaginal_preferred",
            grade: grade("A"),
            notes:
              "Term delivery with vaginal route preferred. Prior HSV history alone without " +
              "active lesions is not an indication for cesarean.",
          },
        ],
        pastFortyWeeks: "case_by_case",
        specialConsiderations: [],
        riskData: [],
        riskModifiers: [],
        landmarkTrials: [],
        interactions: [],
      },
      {
        id: "hsv_primary_3rd_trimester",
        name: "HSV, primary outbreak in 3rd trimester",
        category: "infectious",
        tags: ["HSV", "herpes", "primary", "third trimester", "new infection"],
        parentConditionId: "hsv",
        guidelineRecommendations: [
          {
            citations: [cite("ACOG", "PB 220", 2020)],
            timing: individualize(
              "Primary HSV in 3rd trimester",
              "High neonatal transmission risk (30-50%)",
              "Cesarean may be offered even without active lesions at delivery",
            ),
            route: "cesarean_preferred",
            grade: grade("B"),
            notes:
              "Cesarean may be offered even without visible active lesions at delivery due to " +
              "high risk of asymptomatic shedding following recent primary infection.",
          },
        ],
        pastFortyWeeks: "case_by_case",
        specialConsiderations: [],
        riskData: [],
        riskModifiers: [],
        landmarkTrials: [],
        interactions: [],
      },
    ],
  },
  {
    id: "hepatitis_b",
    name: "Chronic Hepatitis B (high viral load)",
    category: "infectious",
    tags: ["hepatitis B", "HBV", "viral hepatitis", "tenofovir"],
    guidelineRecommendations: [
      {
        citations: [cite("AASLD", "HBV guidance", 2023), cite("ACOG", "HBV screening", 2023)],
        timing: range(w(39), w(40, 6)),
        route: "either",
        grade: grade("1B"),
        notes:
          "Term delivery. Cesarean is NOT recommended solely for HBV. Tenofovir from 28 weeks " +
          "reduces vertical transmission in women with high viral load.",
      },
    ],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "Tenofovir antiviral therapy starting at 28 weeks is recommended for women with high " +
      "HBV viral load to reduce perinatal transmission. Cesarean delivery does not reduce " +
      "HBV transmission and is not indicated for HBV alone.",
    specialConsiderations: [
      {
        type: "medication_continuation",
        description:
          "Tenofovir from 28 weeks for high viral load. Hepatitis B immunoglobulin (HBIG) " +
          "and HBV vaccine for the neonate within 12 hours of birth.",
        citation: cite("AASLD", "HBV guidance", 2023),
      },
      {
        type: "neonatal_consideration",
        description:
          "Neonatal HBIG + HBV vaccine within 12 hours of birth regardless of delivery mode.",
      },
    ],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "hepatitis_c",
    name: "Chronic Hepatitis C",
    category: "infectious",
    tags: ["hepatitis C", "HCV", "viral hepatitis"],
    guidelineRecommendations: [
      {
        citations: [cite("SMFM", "#56", 2024), cite("ACOG", "HCV guidance", 2023)],
        timing: range(w(39), w(40, 6)),
        route: "either",
        grade: grade("1B"),
        notes: "Term delivery. Cesarean is NOT recommended solely for HCV.",
      },
    ],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "HCV vertical transmission rate is approximately 5-8%. Cesarean delivery has not been " +
      "shown to reduce transmission and is not indicated for HCV alone. Avoid prolonged " +
      "rupture of membranes and invasive fetal monitoring when possible.",
    specialConsiderations: [],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "active_tuberculosis",
    name: "Active Tuberculosis",
    category: "infectious",
    tags: ["tuberculosis", "TB", "mycobacterium"],
    guidelineRecommendations: [
      {
        citations: [cite("CDC", "TB guidelines", 2020), cite("ACOG", "TB guidance", 2020)],
        timing: range(w(39), w(40, 6)),
        route: "either",
        grade: grade("C"),
        notes: "Term delivery. No altered timing for TB. Continue anti-TB therapy through delivery.",
      },
    ],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "Active TB does not alter delivery timing. Continue multidrug TB therapy through " +
      "pregnancy and delivery. Neonatal separation and BCG vaccination decisions depend on " +
      "maternal sputum status.",
    specialConsiderations: [
      {
        type: "medication_continuation",
        description:
          "Continue isoniazid, rifampin, and ethambutol through delivery. Streptomycin is " +
          "contraindicated (ototoxicity). Pyridoxine supplementation with isoniazid.",
        citation: cite("CDC", "TB guidelines", 2020),
      },
    ],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "covid_severe",
    name: "COVID-19, Acute Severe Illness",
    category: "infectious",
    tags: ["COVID-19", "SARS-CoV-2", "coronavirus", "pneumonia"],
    guidelineRecommendations: [
      {
        citations: [cite("SMFM", "COVID guidance", 2020)],
        timing: individualize(
          "Delivery not dictated by infection alone",
          "Follow maternal and fetal indications",
          "Severe maternal respiratory failure may necessitate delivery for maternal benefit",
        ),
        route: "either",
        grade: grade("C"),
        notes:
          "Delivery timing follows maternal/fetal indications, not COVID-19 diagnosis alone. " +
          "Severe maternal illness may warrant delivery for maternal respiratory benefit.",
      },
    ],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "COVID-19 infection alone does not dictate delivery timing. Acute severe illness " +
      "(requiring ICU, mechanical ventilation) may prompt delivery consideration for maternal " +
      "benefit, particularly in the third trimester when delivery can improve respiratory " +
      "mechanics.",
    specialConsiderations: [],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "cmv_congenital",
    name: "CMV (Congenital)",
    category: "infectious",
    tags: ["CMV", "cytomegalovirus", "congenital infection"],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "CMV guidance", 2023)],
        timing: range(w(39), w(40, 6)),
        route: "either",
        grade: grade("C"),
        notes: "Term delivery. No altered timing for congenital CMV.",
      },
    ],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "Congenital CMV does not alter delivery timing. Delivery follows standard obstetric " +
      "indications. Neonatal evaluation for hearing loss, neuroimaging, and viral load at " +
      "birth is indicated.",
    specialConsiderations: [
      {
        type: "neonatal_consideration",
        description:
          "Neonatal urine CMV PCR within 21 days of birth for definitive diagnosis. " +
          "Hearing screening and cranial imaging. Consider valganciclovir for symptomatic neonates.",
      },
    ],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "zika",
    name: "Zika Virus",
    category: "infectious",
    tags: ["Zika", "ZIKV", "microcephaly", "congenital Zika"],
    guidelineRecommendations: [
      {
        citations: [cite("CDC", "Zika guidance", 2018)],
        timing: range(w(39), w(40, 6)),
        route: "either",
        grade: grade("C"),
        notes: "Term delivery. No altered timing for Zika virus infection.",
      },
    ],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "Zika virus infection does not alter delivery timing. Serial ultrasound for fetal " +
      "head circumference and neuroanatomy is recommended following maternal Zika infection.",
    specialConsiderations: [],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "parvovirus_b19_hydrops",
    name: "Parvovirus B19 with Hydrops",
    category: "infectious",
    tags: ["parvovirus", "B19", "fifth disease", "hydrops", "fetal anemia"],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "parvovirus guidance", 2023)],
        timing: individualize(
          "Intrauterine transfusion (IUT) if fetal anemia/hydrops is present",
          "Delivery for obstetric indications",
          "Hydrops may resolve with IUT, allowing continued pregnancy",
        ),
        route: "either",
        grade: grade("C"),
        notes:
          "No specific delivery GA target. Intrauterine transfusion if indicated for fetal " +
          "anemia. Deliver for obstetric indications.",
      },
    ],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "Parvovirus B19 can cause severe fetal anemia and hydrops fetalis via suppression of " +
      "fetal erythropoiesis. Intrauterine transfusion is the treatment for significant fetal " +
      "anemia. Hydrops may resolve following successful IUT, and pregnancy can continue to " +
      "term. Delivery timing is based on obstetric indications rather than infection alone.",
    specialConsiderations: [
      {
        type: "monitoring_requirement",
        description:
          "Serial MCA Doppler (peak systolic velocity) to monitor for fetal anemia following " +
          "maternal parvovirus B19 infection. Monitor for 8-12 weeks after maternal infection.",
      },
    ],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
];
