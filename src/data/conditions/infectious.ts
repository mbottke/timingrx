import type { ObstetricCondition } from "../types";
import { w, range, individualize, cite, grade } from "../helpers";
import { witsCohort, pactg, priorityCohort } from "../evidence-sources";

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
    riskData: [
      {
        outcome: "vertical HIV transmission with ART and viral suppression",
        statistic: { type: "incidence", valuePercent: 0.5 },
        populationDescription: "Women on effective ART with suppressed viral load; range <1%",
        citation: cite("CDC", "HIV in pregnancy guidelines", 2020),
      },
      {
        outcome: "vertical HIV transmission without treatment",
        statistic: { type: "incidence", valuePercent: 20 },
        populationDescription: "Untreated women; range 15-25%",
        citation: cite("ACOG", "CO 831", 2021),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    keyEvidenceSources: [witsCohort, pactg, priorityCohort],
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
        riskData: [
          {
            outcome: "vertical HIV transmission with scheduled cesarean",
            statistic: { type: "incidence", valuePercent: 2 },
            populationDescription: "HIV-positive women with high viral load delivered by scheduled cesarean (range 1-4%)",
            citation: cite("other", "The European Mode of Delivery Collaboration, Lancet 1999", 1999),
          },
          {
            outcome: "vertical HIV transmission with vaginal delivery",
            statistic: { type: "incidence", valuePercent: 10 },
            populationDescription: "HIV-positive women with high viral load, vaginal delivery (range 7-14%)",
            citation: cite("ACOG", "CO 751", 2018),
          },
        ],
        riskModifiers: [],
        landmarkTrials: [],
        keyEvidenceSources: [witsCohort, pactg, priorityCohort],
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
        riskData: [
          {
            outcome: "vertical HIV transmission with suppressed viral load on ART",
            statistic: { type: "incidence", valuePercent: 0.1 },
            populationDescription: "Women with HIV viral load <50 copies/mL on effective ART (range <0.5%)",
            citation: cite("CDC", "HIV in pregnancy guidelines", 2020),
          },
        ],
        riskModifiers: [],
        landmarkTrials: [],
        keyEvidenceSources: [witsCohort, pactg, priorityCohort],
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
    keyEvidenceSources: [witsCohort, pactg, priorityCohort],
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
        riskData: [
          {
            outcome: "neonatal HSV infection with active lesions at vaginal delivery",
            statistic: { type: "incidence", valuePercent: 40 },
            populationDescription: "Neonates born vaginally to mothers with active HSV lesions at delivery",
            citation: cite("ACOG", "PB 220", 2020),
          },
          {
            outcome: "neonatal HSV mortality (untreated disseminated disease)",
            statistic: { type: "mortality_rate", valuePercent: 60 },
            populationDescription: "Neonates with untreated disseminated neonatal HSV infection",
            citation: cite("ACOG", "PB 220", 2020),
          },
        ],
        riskModifiers: [],
        landmarkTrials: [],
        keyEvidenceSources: [witsCohort, pactg, priorityCohort],
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
        riskData: [
          {
            outcome: "neonatal HSV transmission with recurrent HSV, no active lesions",
            statistic: { type: "absolute_risk", valuePer1000: 2 },
            populationDescription: "Neonates of women with recurrent HSV history, no visible lesions at delivery",
            citation: cite("ACOG", "PB 220", 2020),
          },
          {
            outcome: "recurrence at delivery reduced by suppressive acyclovir from 36 wk",
            statistic: { type: "relative_risk", value: 0.5 },
            populationDescription: "Reduction in recurrence rate with suppressive therapy vs no therapy",
            citation: cite("other", "Hollier & Wendel, Cochrane 2008", 2008),
          },
        ],
        riskModifiers: [],
        landmarkTrials: [],
        keyEvidenceSources: [witsCohort, pactg, priorityCohort],
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
        riskData: [
          {
            outcome: "neonatal HSV transmission (primary outbreak at delivery)",
            statistic: { type: "incidence", valuePercent: 40 },
            populationDescription: "Neonates born to mothers with primary HSV outbreak at time of delivery (range 30-50%)",
            citation: cite("ACOG", "PB 220", 2020),
          },
          {
            outcome: "asymptomatic viral shedding after recent primary HSV",
            statistic: { type: "incidence", valuePercent: 30 },
            populationDescription: "Women with primary HSV in the weeks preceding delivery — shedding may persist without visible lesions",
            citation: cite("ACOG", "PB 220", 2020),
          },
        ],
        riskModifiers: [],
        landmarkTrials: [],
        keyEvidenceSources: [witsCohort, pactg, priorityCohort],
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
    riskData: [
      {
        outcome: "vertical transmission without prophylaxis (HBeAg-positive, high viral load)",
        statistic: { type: "incidence", valuePercent: 90 },
        populationDescription: "HBeAg-positive mothers with HBV DNA >200,000 IU/mL, no neonatal prophylaxis",
        citation: cite("CDC", "Hepatitis B in Pregnancy", 2023),
      },
      {
        outcome: "vertical transmission with HBIG + vaccine (without maternal antiviral)",
        statistic: { type: "incidence", valuePercent: 9 },
        populationDescription: "High viral load mothers receiving neonatal HBIG + vaccine only, without maternal TDF (range 5-15%)",
        citation: cite("AASLD", "HBV guidance", 2023),
      },
      {
        outcome: "vertical transmission with maternal TDF + neonatal HBIG + vaccine",
        statistic: { type: "incidence", valuePercent: 1 },
        populationDescription: "High viral load mothers on tenofovir from 28 wk + neonatal prophylaxis (range <2%)",
        citation: cite("AASLD", "HBV guidance", 2023),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    keyEvidenceSources: [witsCohort, pactg, priorityCohort],
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
    riskData: [
      {
        outcome: "vertical (perinatal) HCV transmission",
        statistic: { type: "incidence", valuePercent: 6 },
        populationDescription: "HCV RNA-positive mothers without HIV co-infection (range 5-8%)",
        citation: cite("SMFM", "#56", 2024),
      },
      {
        outcome: "vertical HCV transmission with HIV co-infection",
        statistic: { type: "incidence", valuePercent: 20 },
        populationDescription: "HCV-positive mothers with HIV co-infection (range 15-25%)",
        citation: cite("SMFM", "#56", 2024),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    keyEvidenceSources: [witsCohort, pactg, priorityCohort],
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
    riskData: [
      {
        outcome: "preterm birth",
        statistic: { type: "relative_risk", value: 2.5 },
        populationDescription: "Active pulmonary TB in pregnancy vs non-infected pregnancies (range 2-3x)",
        citation: cite("other", "Mathad & Gupta, Clin Infect Dis 2012", 2012),
      },
      {
        outcome: "low birth weight (<2500g)",
        statistic: { type: "incidence", valuePercent: 28 },
        populationDescription: "Pregnancies with untreated or late-treated active TB (range 20-40%)",
        citation: cite("other", "Mathad & Gupta, Clin Infect Dis 2012", 2012),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    keyEvidenceSources: [witsCohort, pactg, priorityCohort],
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
    riskData: [
      {
        outcome: "ICU admission compared to non-pregnant adults",
        statistic: { type: "relative_risk", value: 7, ci95: [5, 10] },
        populationDescription: "Pregnant women with COVID-19 versus general population; range 5-10x",
        citation: cite("other", "PRIORITY cohort; Allotey et al BMJ 2020"),
      },
      {
        outcome: "preterm birth",
        statistic: { type: "odds_ratio", value: 2.0, ci95: [1.6, 3.0] },
        populationDescription: "Pregnant women with COVID-19",
        citation: cite("other", "Allotey et al BMJ 2020"),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    keyEvidenceSources: [witsCohort, pactg, priorityCohort],
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
    riskData: [
      {
        outcome: "fetal CMV transmission with primary maternal infection",
        statistic: { type: "incidence", valuePercent: 35 },
        populationDescription: "Women with primary CMV infection during pregnancy; range 30-40%",
        citation: cite("ACOG", "CMV guidance", 2023),
      },
      {
        outcome: "fetal CMV transmission with recurrent maternal infection",
        statistic: { type: "incidence", valuePercent: 1.5 },
        populationDescription: "Women with recurrent (non-primary) CMV during pregnancy; range 1-2%",
        citation: cite("ACOG", "CMV guidance", 2023),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    keyEvidenceSources: [witsCohort, pactg, priorityCohort],
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
    riskData: [
      {
        outcome: "congenital Zika syndrome with first trimester maternal infection",
        statistic: { type: "incidence", valuePercent: 10 },
        populationDescription: "Pregnant women with confirmed Zika in the first trimester; range 5-15%",
        citation: cite("CDC", "Zika guidance", 2018),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    keyEvidenceSources: [witsCohort, pactg, priorityCohort],
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
    riskData: [
      {
        outcome: "fetal hydrops with maternal parvovirus B19 infection",
        statistic: { type: "incidence", valuePercent: 3 },
        populationDescription: "Maternal parvovirus B19 infection overall (range 1-5%); higher in first half of pregnancy",
        citation: cite("ACOG", "parvovirus guidance", 2023),
      },
      {
        outcome: "fetal loss with hydrops fetalis",
        statistic: { type: "incidence", valuePercent: 30 },
        populationDescription: "Parvovirus B19-associated hydrops fetalis without intrauterine transfusion (range 20-40%)",
        citation: cite("ACOG", "parvovirus guidance", 2023),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    keyEvidenceSources: [witsCohort, pactg, priorityCohort],
    interactions: [],
  },
  {
    id: "group_b_strep",
    name: "Group B Streptococcus (GBS)",
    category: "infectious",
    tags: [
      "GBS", "group B strep", "group B streptococcus", "Streptococcus agalactiae",
      "neonatal sepsis", "intrapartum antibiotic prophylaxis", "IAP",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("CDC", "GBS prevention guidelines", 2020), cite("ACOG", "CO 797", 2020)],
        timing: range(w(39), w(40, 6)),
        route: "either",
        grade: grade("A"),
        notes:
          "Term delivery. GBS colonization does not alter delivery timing. Intrapartum " +
          "antibiotic prophylaxis (penicillin G) for GBS-positive patients reduces " +
          "early-onset neonatal sepsis from ~1.8/1000 to ~0.5/1000.",
      },
    ],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "GBS colonization (10-30% of pregnant women) does not alter delivery timing. " +
      "Universal screening at 35-37 weeks with rectovaginal culture is recommended. " +
      "Intrapartum antibiotic prophylaxis with penicillin G (or ampicillin) is given " +
      "to GBS-positive patients, those with unknown status and risk factors, or those " +
      "with prior GBS bacteriuria in the current pregnancy. Clindamycin is used for " +
      "penicillin-allergic patients with susceptible isolates.",
    specialConsiderations: [
      {
        type: "medication_continuation",
        description:
          "Intrapartum penicillin G 5 million units IV, then 2.5-3 million units IV q4h " +
          "until delivery. Alternative: ampicillin 2g IV load then 1g IV q4h. " +
          "For penicillin allergy: clindamycin (if susceptible) or vancomycin.",
        citation: cite("CDC", "GBS prevention guidelines", 2020),
      },
    ],
    riskData: [
      {
        outcome: "early-onset neonatal GBS sepsis without intrapartum antibiotic prophylaxis",
        statistic: { type: "absolute_risk", valuePer1000: 1.8 },
        populationDescription: "Neonates born to GBS-positive mothers without IAP",
        citation: cite("CDC", "GBS prevention guidelines", 2020),
      },
      {
        outcome: "early-onset neonatal GBS sepsis with intrapartum antibiotic prophylaxis",
        statistic: { type: "absolute_risk", valuePer1000: 0.5 },
        populationDescription: "Neonates born to GBS-positive mothers receiving IAP",
        citation: cite("CDC", "GBS prevention guidelines", 2020),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    keyEvidenceSources: [witsCohort, pactg, priorityCohort],
    interactions: [],
  },
];
