import type { ObstetricCondition } from "../types";
import { w, range, individualize, cite, grade } from "../helpers";
import { digitatTrial, flenadyMeta } from "../trials";
import { nrnNetwork } from "../evidence-sources";

export const fetalGrowthFluidConditions: ObstetricCondition[] = [
  {
    id: "fgr",
    name: "Fetal Growth Restriction (FGR)",
    category: "fetal_growth_fluid",
    tags: [
      "FGR",
      "IUGR",
      "fetal growth restriction",
      "intrauterine growth restriction",
      "small for gestational age",
      "SGA",
      "Doppler",
      "umbilical artery",
    ],
    stratificationAxis: "Doppler findings and EFW percentile",
    guidelineRecommendations: [],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Fetal growth restriction is stratified by estimated fetal weight percentile and " +
      "umbilical artery Doppler findings. Delivery timing depends on severity: the worse " +
      "the Doppler pattern, the earlier delivery is indicated. FIGO 2021 FGR initiative " +
      "aligns closely with ACOG/SMFM but recommends slightly earlier delivery for absent " +
      "end-diastolic velocity (32 wk vs ACOG 33-34 wk).",
    physiologyExplanation:
      "FGR results from placental insufficiency leading to inadequate nutrient and oxygen " +
      "delivery. Progressive Doppler changes reflect worsening placental vascular resistance: " +
      "elevated S/D ratio, then absent end-diastolic velocity (AEDV), then reversed " +
      "end-diastolic velocity (REDV). REDV indicates severe placental failure with risk " +
      "of acidemia and stillbirth.",
    specialConsiderations: [
      {
        type: "monitoring_requirement",
        description:
          "Serial Doppler assessment of umbilical artery, MCA, and ductus venosus. " +
          "Frequency depends on severity: weekly for mild, twice-weekly or more for " +
          "AEDV/REDV. BPP or modified BPP as adjunct.",
      },
    ],
    riskData: [
      {
        outcome: "stillbirth",
        statistic: { type: "odds_ratio", value: 3.5, ci95: [2.6, 4.8] },
        populationDescription: "SGA <10th percentile",
        citation: cite("other", "Flenady et al., Lancet 2011", 2011),
      },
      {
        outcome: "perinatal mortality",
        statistic: { type: "mortality_rate", valuePercent: 1.5 },
        populationDescription: "FGR pregnancies overall",
      },
    ],
    riskModifiers: [],
    landmarkTrials: [
      {
        id: "digitat-2010",
        name: "DIGITAT",
        year: 2010,
        journalCitation: "BMJ 2010;341:c7087",
        sampleSize: 650,
        summary:
          "Dutch RCT: induction vs expectant for suspected FGR at 36-41w. No difference in composite neonatal outcome. Preeclampsia lower with induction.",
        keyFindings: [
          "Composite neonatal: 5.3% vs 6.1% (NS)",
          "Birthweight: 2208g vs 2326g",
          "Cesarean: 14% vs 14%",
          "Preeclampsia: 3.7% vs 7.9% (P=0.03)",
        ],
      },
    ],
    keyEvidenceSources: [nrnNetwork],
    interactions: [],
    subVariants: [
      {
        id: "fgr_3rd_10th",
        name: "FGR, EFW 3rd-10th Percentile",
        category: "fetal_growth_fluid",
        tags: ["FGR", "SGA", "3rd percentile", "10th percentile", "mild FGR"],
        parentConditionId: "fgr",
        guidelineRecommendations: [
          {
            citations: [
              cite("ACOG", "CO 831", 2021),
              cite("SMFM", "Consult Series #52"),
            ],
            timing: range(w(38), w(39)),
            route: "either",
            grade: grade("B"),
          },
        ],
        pastFortyWeeks: "no",
        specialConsiderations: [],
        riskData: [
          {
            outcome: "stillbirth",
            statistic: { type: "odds_ratio", value: 1.6, ci95: [1.1, 2.4] },
            populationDescription: "SGA 3rd–10th percentile vs. AGA",
            citation: cite("other", "Flenady et al., Lancet 2011", 2011),
          },
          {
            outcome: "neonatal intensive care admission",
            statistic: { type: "incidence", valuePercent: 15 },
            populationDescription: "FGR EFW 3rd–10th percentile (range 10–20%)",
          },
        ],
        riskModifiers: [],
        landmarkTrials: [digitatTrial, flenadyMeta],
        keyEvidenceSources: [nrnNetwork],
    interactions: [],
      },
      {
        id: "fgr_less_3rd",
        name: "FGR, EFW <3rd Percentile",
        category: "fetal_growth_fluid",
        tags: ["FGR", "severe FGR", "less than 3rd percentile", "SGA"],
        parentConditionId: "fgr",
        guidelineRecommendations: [
          {
            citations: [cite("ACOG", "CO 831", 2021)],
            timing: range(w(37), w(37)),
            route: "either",
            grade: grade("B"),
          },
        ],
        pastFortyWeeks: "no",
        specialConsiderations: [],
        riskData: [
          {
            outcome: "stillbirth",
            statistic: { type: "odds_ratio", value: 4.7, ci95: [3.1, 7.1] },
            populationDescription: "SGA <3rd percentile vs. AGA",
            citation: cite("other", "Flenady et al., Lancet 2011", 2011),
          },
          {
            outcome: "perinatal mortality",
            statistic: { type: "incidence", valuePercent: 3.5 },
            populationDescription: "FGR EFW <3rd percentile (range 2.5–5%)",
          },
        ],
        riskModifiers: [],
        landmarkTrials: [digitatTrial, flenadyMeta],
        keyEvidenceSources: [nrnNetwork],
    interactions: [],
      },
      {
        id: "fgr_aedv",
        name: "FGR, Absent End-Diastolic Velocity",
        category: "fetal_growth_fluid",
        tags: [
          "FGR",
          "AEDV",
          "absent end-diastolic velocity",
          "umbilical artery Doppler",
        ],
        parentConditionId: "fgr",
        guidelineRecommendations: [
          {
            citations: [cite("ACOG", "CO 831", 2021)],
            timing: range(w(33), w(34)),
            route: "either",
            grade: grade("B"),
            notes:
              "ACOG recommends 33w0d-34w0d. FIGO 2021 recommends 32 weeks.",
          },
          {
            citations: [cite("FIGO", "FGR Initiative", 2021)],
            timing: range(w(32), w(32)),
            route: "either",
            grade: grade("B"),
            notes: "FIGO gives slightly earlier target of 32 weeks for AEDV.",
          },
        ],
        pastFortyWeeks: "no",
        specialConsiderations: [],
        riskData: [
          {
            outcome: "perinatal mortality",
            statistic: { type: "incidence", valuePercent: 12.5 },
            populationDescription:
              "FGR with AEDV managed expectantly (range 10-15%)",
          },
          {
            outcome: "stillbirth",
            statistic: { type: "absolute_risk", valuePer1000: 25 },
            populationDescription:
              "FGR with AEDV — approximate weekly stillbirth risk without delivery",
          },
        ],
        riskModifiers: [],
        landmarkTrials: [
          {
            id: "truffle-2015",
            name: "TRUFFLE",
            year: 2015,
            journalCitation: "Ultrasound Obstet Gynecol 2015",
            sampleSize: 503,
            summary:
              "European RCT for early FGR with abnormal UA Doppler. DV-based timing improved 2-year outcomes.",
            keyFindings: [
              "Survival without impairment: 85% (late DV) vs 77% (cCTG)",
              "Perinatal survival 92%",
            ],
          },
        ],
        keyEvidenceSources: [nrnNetwork],
    interactions: [],
      },
      {
        id: "fgr_redv",
        name: "FGR, Reversed End-Diastolic Velocity",
        category: "fetal_growth_fluid",
        tags: [
          "FGR",
          "REDV",
          "reversed end-diastolic velocity",
          "umbilical artery Doppler",
          "severe",
        ],
        parentConditionId: "fgr",
        guidelineRecommendations: [
          {
            citations: [cite("ACOG", "CO 831", 2021)],
            timing: range(w(30), w(32)),
            route: "either",
            grade: grade("B"),
          },
        ],
        pastFortyWeeks: "no",
        specialConsiderations: [],
        riskData: [
          {
            outcome: "perinatal mortality",
            statistic: { type: "incidence", valuePercent: 35 },
            populationDescription:
              "FGR with REDV managed without delivery (range 30-40%)",
          },
          {
            outcome: "stillbirth",
            statistic: { type: "absolute_risk", valuePer1000: 50 },
            populationDescription:
              "FGR with REDV — approximate weekly stillbirth risk without delivery",
          },
        ],
        riskModifiers: [],
        landmarkTrials: [
          {
            id: "grit-2004",
            name: "GRIT",
            year: 2004,
            journalCitation: "Lancet 2004;364:513-520",
            sampleSize: 588,
            summary:
              "International RCT for compromised FGR. No clear advantage of immediate vs delayed delivery.",
            keyFindings: [
              "Death/disability at 2y: 19% vs 16% (NS)",
              "Mean GA: 31.1w vs 32.5w",
            ],
          },
        ],
        keyEvidenceSources: [nrnNetwork],
    interactions: [],
      },
    ],
  },
  {
    id: "isolated_oligohydramnios",
    name: "Isolated Oligohydramnios (DVP <2 cm)",
    category: "fetal_growth_fluid",
    tags: [
      "oligohydramnios",
      "low fluid",
      "DVP",
      "deepest vertical pocket",
      "AFI",
      "amniotic fluid",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "CO 831", 2021)],
        timing: range(w(36), w(37, 6)),
        route: "either",
        grade: grade("B"),
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Isolated oligohydramnios defined as DVP <2 cm without FGR or ruptured membranes. " +
      "DVP is preferred over AFI for fluid assessment as AFI overdiagnoses oligohydramnios.",
    specialConsiderations: [],
    riskData: [
      {
        outcome: "stillbirth",
        statistic: { type: "relative_risk", value: 2.2, ci95: [1.4, 3.4] },
        populationDescription: "Isolated oligohydramnios (DVP <2 cm) vs. normal fluid",
        citation: cite("other", "Chauhan et al., Am J Obstet Gynecol 1999", 1999),
      },
      {
        outcome: "intrapartum fetal heart rate abnormality",
        statistic: { type: "incidence", valuePercent: 35 },
        populationDescription: "Isolated oligohydramnios at term (range 30–40%)",
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    keyEvidenceSources: [nrnNetwork],
    interactions: [],
  },
  {
    id: "polyhydramnios_uncomplicated",
    name: "Polyhydramnios (Uncomplicated)",
    category: "fetal_growth_fluid",
    tags: [
      "polyhydramnios",
      "high fluid",
      "excess amniotic fluid",
      "AFI",
      "DVP",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "CO 831", 2021)],
        timing: range(w(39), w(39, 6)),
        route: "either",
        grade: grade("B"),
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Uncomplicated polyhydramnios without identified fetal anomaly or diabetes. " +
      "Evaluate for fetal anomalies (esophageal atresia, CNS abnormalities) and " +
      "maternal diabetes. Amnioreduction may be considered for symptomatic relief.",
    specialConsiderations: [],
    riskData: [
      {
        outcome: "preterm birth <37 weeks",
        statistic: { type: "incidence", valuePercent: 20 },
        populationDescription: "Uncomplicated polyhydramnios (range 15–26%)",
        citation: cite("other", "Magann et al., Obstet Gynecol 2010", 2010),
      },
      {
        outcome: "cord prolapse",
        statistic: { type: "relative_risk", value: 2.4, ci95: [1.3, 4.3] },
        populationDescription: "Polyhydramnios vs. normal fluid at labor",
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    keyEvidenceSources: [nrnNetwork],
    interactions: [],
  },
  {
    id: "alloimmunization_no_iut",
    name: "Alloimmunization (No IUT Needed)",
    category: "fetal_growth_fluid",
    tags: [
      "alloimmunization",
      "Rh disease",
      "Kell",
      "anti-D",
      "anti-K",
      "hemolytic disease",
      "isoimmunization",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "CO 831", 2021)],
        timing: range(w(37), w(38, 6)),
        route: "either",
        grade: grade("B"),
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Red cell alloimmunization without need for intrauterine transfusion, indicating " +
      "mild to moderate disease. Serial MCA Doppler monitoring for fetal anemia.",
    specialConsiderations: [
      {
        type: "monitoring_requirement",
        description:
          "Serial middle cerebral artery peak systolic velocity (MCA-PSV) every 1-2 weeks. " +
          "MCA-PSV >1.5 MoM suggests moderate-severe fetal anemia requiring IUT.",
      },
    ],
    riskData: [
      {
        outcome: "progression to severe fetal anemia requiring IUT",
        statistic: { type: "incidence", valuePercent: 25 },
        populationDescription: "Alloimmunization without initial IUT requirement (range 20–30%)",
        citation: cite("other", "Moise, N Engl J Med 2002", 2002),
      },
      {
        outcome: "hydrops fetalis",
        statistic: { type: "incidence", valuePercent: 10 },
        populationDescription: "Red cell alloimmunization — untreated moderate-severe disease",
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    keyEvidenceSources: [nrnNetwork],
    interactions: [],
  },
  {
    id: "hydrops_fetalis_nonimmune",
    name: "Hydrops Fetalis (Nonimmune)",
    category: "fetal_growth_fluid",
    tags: [
      "hydrops",
      "nonimmune hydrops",
      "NIHF",
      "fetal hydrops",
      "mirror syndrome",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("SMFM", "Clinical Guideline #7")],
        timing: individualize(
          "Mirror syndrome (maternal edema, hypertension)",
          "Obstetric indications for delivery",
          "Worsening fetal status despite treatment of underlying cause",
        ),
        route: "either",
        grade: grade("C"),
        notes:
          "Deliver for mirror syndrome or obstetric indications; otherwise individualize " +
          "based on etiology and response to treatment.",
      },
    ],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "Nonimmune hydrops has diverse etiologies including cardiac, chromosomal, infectious, " +
      "and hematologic causes. Management depends on identifying and treating the underlying " +
      "cause. Mirror syndrome (maternal edema and hypertension mirroring fetal hydrops) " +
      "is an indication for delivery.",
    specialConsiderations: [],
    riskData: [
      {
        outcome: "perinatal mortality",
        statistic: { type: "mortality_rate", valuePercent: 50 },
        populationDescription: "Nonimmune hydrops fetalis overall (range 40–75%)",
        citation: cite("other", "Bellini et al., J Matern Fetal Neonatal Med 2009", 2009),
      },
      {
        outcome: "identifiable underlying etiology",
        statistic: { type: "incidence", valuePercent: 75 },
        populationDescription: "NIHF cases with systematic workup",
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    keyEvidenceSources: [nrnNetwork],
    interactions: [],
  },
  {
    id: "trisomy_21_uncomplicated",
    name: "Trisomy 21 (Without Complications)",
    category: "fetal_growth_fluid",
    tags: [
      "trisomy 21",
      "Down syndrome",
      "T21",
      "aneuploidy",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("other", "Expert consensus")],
        timing: range(w(39), w(41, 6)),
        route: "either",
        grade: grade("C"),
        notes: "Standard timing unless complications (cardiac defect, FGR) alter management.",
      },
    ],
    pastFortyWeeks: "yes",
    clinicalNotes:
      "Trisomy 21 without associated complications (cardiac defects, FGR, polyhydramnios) " +
      "follows standard delivery timing. If a cardiac defect is present, manage per fetal " +
      "cardiac guidelines.",
    specialConsiderations: [],
    riskData: [
      {
        outcome: "congenital heart defect",
        statistic: { type: "incidence", valuePercent: 44 },
        populationDescription: "Trisomy 21 pregnancies (range 40–50%)",
        citation: cite("other", "Freeman et al., Pediatrics 1998", 1998),
      },
      {
        outcome: "duodenal atresia or GI anomaly",
        statistic: { type: "incidence", valuePercent: 8 },
        populationDescription: "Trisomy 21 — gastrointestinal malformations",
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    keyEvidenceSources: [nrnNetwork],
    interactions: [
      {
        interactingConditionId: "fetal_chd_ductal_dependent",
        interactionType: "timing_shift",
        description:
          "If associated CHD is present, delivery timing shifts to fetal cardiac guidelines.",
      },
    ],
  },
  {
    id: "trisomy_18_13_continuing",
    name: "Trisomy 18 / Trisomy 13 (Continuing Pregnancy)",
    category: "fetal_growth_fluid",
    tags: [
      "trisomy 18",
      "trisomy 13",
      "Edwards syndrome",
      "Patau syndrome",
      "aneuploidy",
      "lethal aneuploidy",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("other", "Expert consensus")],
        timing: individualize(
          "Family goals of care",
          "Fetal or maternal complications",
          "Comfort-focused birth plan",
        ),
        route: "individualize",
        grade: grade("C"),
        notes: "Individualize per family goals of care. Palliative care planning.",
      },
    ],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "For families continuing pregnancies with trisomy 18 or 13, delivery timing and " +
      "route are individualized based on family goals of care. Palliative care consultation " +
      "and birth planning are essential components of management.",
    specialConsiderations: [],
    riskData: [
      {
        outcome: "stillbirth before delivery",
        statistic: { type: "incidence", valuePercent: 30 },
        populationDescription: "Trisomy 18 continuing pregnancies after 20 weeks (range 20–40%)",
        citation: cite("other", "Peroos et al., Arch Dis Child Fetal Neonatal Ed 2012", 2012),
      },
      {
        outcome: "neonatal death within first week",
        statistic: { type: "incidence", valuePercent: 50 },
        populationDescription: "Liveborn trisomy 18 or 13 neonates",
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    keyEvidenceSources: [nrnNetwork],
    interactions: [],
  },
  {
    id: "skeletal_dysplasia_lethal",
    name: "Skeletal Dysplasia (Lethal)",
    category: "fetal_growth_fluid",
    tags: [
      "skeletal dysplasia",
      "lethal skeletal dysplasia",
      "thanatophoric dysplasia",
      "osteogenesis imperfecta type II",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("other", "Expert consensus")],
        timing: individualize(
          "Family goals of care",
          "Comfort-focused birth plan",
          "Maternal complications",
        ),
        route: "individualize",
        grade: grade("C"),
        notes: "Individualize per family goals of care.",
      },
    ],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "Lethal skeletal dysplasias (e.g., thanatophoric dysplasia, OI type II) are managed " +
      "with palliative care planning. Delivery timing and route are guided by family goals.",
    specialConsiderations: [],
    riskData: [
      {
        outcome: "neonatal death due to pulmonary hypoplasia",
        statistic: { type: "mortality_rate", valuePercent: 99 },
        populationDescription: "Thanatophoric dysplasia and homozygous achondroplasia — virtually universal",
        citation: cite("other", "Witters et al., Eur J Pediatr 2002", 2002),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    keyEvidenceSources: [nrnNetwork],
    interactions: [],
  },
  {
    id: "skeletal_dysplasia_non_lethal",
    name: "Skeletal Dysplasia (Non-Lethal)",
    category: "fetal_growth_fluid",
    tags: [
      "skeletal dysplasia",
      "non-lethal",
      "achondroplasia",
      "osteogenesis imperfecta",
      "short-limbed dwarfism",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("other", "Expert consensus")],
        timing: range(w(39), w(41, 6)),
        route: "individualize",
        grade: grade("C"),
        notes:
          "Term delivery. Cesarean may be needed for macrocephaly or other obstetric indications.",
      },
    ],
    pastFortyWeeks: "yes",
    clinicalNotes:
      "Non-lethal skeletal dysplasias (e.g., achondroplasia) are delivered at term. " +
      "Cesarean may be indicated for macrocephaly, which is common in achondroplasia. " +
      "Route of delivery is individualized based on head size and pelvic adequacy.",
    specialConsiderations: [],
    riskData: [
      {
        outcome: "cesarean delivery",
        statistic: { type: "incidence", valuePercent: 70 },
        populationDescription: "Achondroplasia — cesarean rate due to macrocephaly (range 60–80%)",
        citation: cite("other", "Wynn et al., Am J Med Genet 2007", 2007),
      },
      {
        outcome: "cervicomedullary compression in neonate",
        statistic: { type: "incidence", valuePercent: 20 },
        populationDescription: "Achondroplasia neonates — clinically significant stenosis",
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    keyEvidenceSources: [nrnNetwork],
    interactions: [],
  },
  {
    id: "macrosomia_non_diabetic",
    name: "Macrosomia (Non-Diabetic, EFW >4,000-4,999 g)",
    category: "fetal_growth_fluid",
    tags: [
      "macrosomia",
      "LGA",
      "large for gestational age",
      "fetal macrosomia",
      "big baby",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "PB 216", 2020)],
        timing: range(w(39), w(41, 6)),
        route: "either",
        grade: grade("B"),
        notes:
          "Macrosomia with EFW >4,000-4,999 g is NOT an indication for delivery before 39 weeks.",
      },
    ],
    pastFortyWeeks: "yes",
    clinicalNotes:
      "Suspected fetal macrosomia (EFW >4,000-4,999 g) in a non-diabetic patient is not " +
      "an indication for early delivery or prophylactic cesarean. Ultrasound estimation of " +
      "fetal weight has a margin of error of 15-20%.",
    specialConsiderations: [],
    riskData: [
      {
        outcome: "shoulder dystocia",
        statistic: { type: "incidence", valuePercent: 5 },
        populationDescription: "Non-diabetic, birthweight 4,000–4,499 g (range 4–6%)",
        citation: cite("ACOG", "PB 216", 2020),
      },
      {
        outcome: "cesarean delivery",
        statistic: { type: "incidence", valuePercent: 35 },
        populationDescription: "Suspected macrosomia EFW >4,000 g, non-diabetic (range 30–40%)",
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    keyEvidenceSources: [nrnNetwork],
    interactions: [],
  },
  {
    id: "macrosomia_non_diabetic_5000",
    name: "Macrosomia (Non-Diabetic, EFW >=5,000 g)",
    category: "fetal_growth_fluid",
    tags: [
      "macrosomia",
      "extreme macrosomia",
      "EFW 5000",
      "LGA",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "PB 216", 2020)],
        timing: individualize(
          "EFW >=5,000 g on ultrasound",
          "Cesarean delivery may be offered",
        ),
        route: "cesarean_preferred",
        grade: grade("C"),
        notes: "Cesarean may be offered for EFW >=5,000 g in non-diabetic patients.",
      },
    ],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "For non-diabetic patients with EFW >=5,000 g, cesarean delivery may be offered. " +
      "This threshold is higher than for diabetic patients (>=4,500 g) given the " +
      "additional risk of shoulder dystocia with diabetes.",
    specialConsiderations: [],
    riskData: [
      {
        outcome: "shoulder dystocia",
        statistic: { type: "incidence", valuePercent: 14 },
        populationDescription: "Non-diabetic, birthweight ≥5,000 g (range 10–18%)",
        citation: cite("ACOG", "PB 216", 2020),
      },
      {
        outcome: "brachial plexus injury",
        statistic: { type: "absolute_risk", valuePer1000: 25 },
        populationDescription: "Births complicated by shoulder dystocia (range 20–30 per 1000)",
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    keyEvidenceSources: [nrnNetwork],
    interactions: [],
  },
  {
    id: "macrosomia_diabetic_4500",
    name: "Macrosomia (Diabetic, EFW >=4,500 g)",
    category: "fetal_growth_fluid",
    tags: [
      "macrosomia",
      "diabetic macrosomia",
      "EFW 4500",
      "GDM",
      "diabetes",
      "shoulder dystocia",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "PB 216", 2020)],
        timing: individualize(
          "EFW >=4,500 g with maternal diabetes",
          "Cesarean delivery may be offered",
        ),
        route: "cesarean_preferred",
        grade: grade("C"),
        notes:
          "Cesarean may be offered for EFW >=4,500 g in diabetic patients due to " +
          "increased shoulder dystocia risk.",
      },
    ],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "Diabetic patients with EFW >=4,500 g have increased risk of shoulder dystocia " +
      "compared to non-diabetic patients of the same weight. Cesarean delivery may be " +
      "offered. The lower threshold (4,500 vs 5,000 g) reflects the additional risk " +
      "conferred by diabetes on shoulder dystocia.",
    specialConsiderations: [],
    riskData: [
      {
        outcome: "shoulder dystocia",
        statistic: { type: "incidence", valuePercent: 20 },
        populationDescription: "Diabetic, birthweight ≥4,500 g (range 15–25%)",
        citation: cite("ACOG", "PB 216", 2020),
      },
      {
        outcome: "shoulder dystocia vs. non-diabetic at same weight",
        statistic: { type: "relative_risk", value: 2.2, ci95: [1.5, 3.2] },
        populationDescription: "Diabetic vs. non-diabetic with EFW 4,000–4,499 g",
        citation: cite("ACOG", "PB 216", 2020),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    keyEvidenceSources: [nrnNetwork],
    interactions: [],
  },
];
