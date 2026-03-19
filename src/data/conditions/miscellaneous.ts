import type { ObstetricCondition } from "../types";
import { w, range, immediate, individualize, cite, grade } from "../helpers";
import { termBreechTrial, oracleITrial, beamTrial, robertsDalzielCochrane } from "../trials";

export const miscellaneousConditions: ObstetricCondition[] = [
  {
    id: "breech_persistent",
    name: "Breech Presentation (persistent)",
    category: "miscellaneous_obstetric",
    tags: ["breech", "malpresentation", "ECV", "external cephalic version", "frank breech"],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "PB 221", 2020)],
        timing: range(w(39), w(39)),
        route: "cesarean_preferred",
        grade: grade("A"),
        notes:
          "ECV offered at >=37 weeks. If breech persists, planned cesarean at 39w0d.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "External cephalic version (ECV) should be offered at >=37 weeks for persistent " +
      "breech. If breech persists after ECV attempt or ECV is declined/contraindicated, " +
      "planned cesarean at 39w0d is recommended.",
    specialConsiderations: [
      {
        type: "other",
        description:
          "ECV success rate ~50-60%. Contraindications include placenta previa, " +
          "non-reassuring fetal status, multiple gestation, ruptured membranes.",
      },
    ],
    riskData: [
      {
        outcome: "ECV success (cephalic version achieved)",
        statistic: { type: "incidence", valuePercent: 58 },
        populationDescription: "Singleton breech pregnancies >=36 weeks undergoing ECV attempt",
        citation: cite("other", "Impey et al., BJOG 2017", 2017),
      },
      {
        outcome: "perinatal morbidity/mortality with planned vaginal breech vs cesarean",
        statistic: { type: "relative_risk", value: 3.96, ci95: [2.18, 7.19] },
        populationDescription: "Term breech; planned vaginal vs planned cesarean delivery (Term Breech Trial)",
        citation: cite("other", "Hannah et al., Lancet 2000", 2000),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [termBreechTrial],
    interactions: [],
  },
  {
    id: "transverse_lie",
    name: "Transverse Lie at Term",
    category: "miscellaneous_obstetric",
    tags: ["transverse lie", "malpresentation", "oblique lie", "ECV"],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "Clinical guidance")],
        timing: range(w(39), w(39)),
        route: "cesarean_preferred",
        grade: grade("C"),
        notes: "ECV may be attempted at 39 weeks. Cesarean if unresolved.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Transverse lie at term: ECV may be attempted. If unsuccessful or if lie is " +
      "unstable, cesarean delivery is indicated. Labor with transverse lie risks " +
      "cord prolapse and obstructed labor.",
    specialConsiderations: [],
    riskData: [
      {
        outcome: "cord prolapse at membrane rupture with transverse lie",
        statistic: { type: "incidence", valuePercent: 20 },
        populationDescription: "Pregnancies with transverse lie at membrane rupture (estimated from case series)",
        citation: cite("other", "Boyle & Katz, Obstet Gynecol 2005", 2005),
      },
      {
        outcome: "perinatal mortality with undelivered transverse lie at term",
        statistic: { type: "relative_risk", value: 5.0 },
        populationDescription: "Transverse lie at term vs cephalic presentation if labor allowed to proceed",
        citation: cite("other", "Expert consensus and obstetric textbook data", 2020),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "unstable_lie",
    name: "Unstable Lie",
    category: "miscellaneous_obstetric",
    tags: ["unstable lie", "malpresentation", "changing presentation", "variable lie"],
    guidelineRecommendations: [
      {
        citations: [cite("other", "Expert consensus")],
        timing: range(w(37), w(38)),
        route: "cesarean_preferred",
        grade: grade("C"),
        notes: "Planned stabilization or cesarean at 37-38 weeks.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Unstable lie (presentation changes repeatedly) carries risk of cord prolapse " +
      "with membrane rupture. Planned delivery at 37-38 weeks with stabilization " +
      "attempt or cesarean.",
    specialConsiderations: [
      {
        type: "other",
        description:
          "Consider inpatient management near term due to cord prolapse risk if " +
          "membranes rupture with non-cephalic presentation.",
      },
    ],
    riskData: [
      {
        outcome: "cord prolapse with unstable/non-longitudinal lie at membrane rupture",
        statistic: { type: "incidence", valuePercent: 10 },
        populationDescription: "Pregnancies with unstable lie presenting with membrane rupture (expert estimation from series)",
        citation: cite("other", "Expert consensus; Impey & Greenwood, Obstet Gynaecol 2010", 2010),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "pprom_less_than_34",
    name: "PPROM (<34 weeks, expectant management)",
    category: "miscellaneous_obstetric",
    tags: [
      "PPROM", "preterm PROM", "premature rupture of membranes",
      "ruptured membranes", "preterm",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "PB 217"), cite("ACOG", "CO 831", 2021)],
        timing: range(w(34), w(36, 6)),
        route: "either",
        grade: grade("B"),
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "PPROM before 34 weeks: expectant management with antibiotics (latency regimen) " +
      "and antenatal corticosteroids. Delivery at 34w0d-36w6d depending on clinical course. " +
      "Earlier delivery for chorioamnionitis, non-reassuring fetal status, or abruption.",
    specialConsiderations: [
      {
        type: "medication_adjustment",
        description:
          "Latency antibiotics (ampicillin + erythromycin or azithromycin). " +
          "Antenatal corticosteroids if <34 weeks. GBS prophylaxis.",
      },
      {
        type: "monitoring_requirement",
        description:
          "Inpatient monitoring. Daily temperature, fetal heart rate assessment. " +
          "Serial CBC and CRP for chorioamnionitis surveillance.",
      },
    ],
    riskData: [
      {
        outcome: "chorioamnionitis with PPROM <34 weeks on expectant management",
        statistic: { type: "incidence", valuePercent: 15 },
        populationDescription: "PPROM <34 weeks managed expectantly (pooled cohort data)",
        citation: cite("other", "Mercer et al., Am J Obstet Gynecol 2003", 2003),
      },
      {
        outcome: "latency (days to delivery) with PPROM at 24-32 weeks",
        statistic: { type: "absolute_risk", valuePer1000: 0 },
        populationDescription: "Median latency ~7 days; 50% deliver within 1 week of PPROM",
        citation: cite("other", "Mercer et al., Am J Obstet Gynecol 2003", 2003),
      },
      {
        outcome: "neonatal sepsis after expectant management of PPROM",
        statistic: { type: "incidence", valuePercent: 5 },
        populationDescription: "Neonates born after PPROM <34 weeks with latency antibiotics",
        citation: cite("other", "Mercer et al., Am J Obstet Gynecol 2003", 2003),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [oracleITrial, beamTrial, robertsDalzielCochrane],
    interactions: [],
  },
  {
    id: "term_prom",
    name: "PPROM >=37 weeks (term PROM)",
    category: "miscellaneous_obstetric",
    tags: ["PROM", "term PROM", "ruptured membranes", "prelabor rupture"],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "CO 831", 2021)],
        timing: immediate("At time of diagnosis. Delivery recommended promptly after term PROM."),
        route: "either",
        grade: grade("A"),
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Term PROM (>=37 weeks): delivery at time of diagnosis. Induction of labor " +
      "is recommended if spontaneous labor does not ensue promptly, to reduce " +
      "chorioamnionitis risk.",
    specialConsiderations: [
      {
        type: "medication_adjustment",
        description: "GBS prophylaxis per protocol if indicated.",
      },
    ],
    riskData: [
      {
        outcome: "chorioamnionitis with term PROM managed expectantly (>12h)",
        statistic: { type: "incidence", valuePercent: 10 },
        populationDescription: "Women with term PROM randomized to expectant management >12 hours (TermPROM trial)",
        citation: cite("other", "Hannah et al., Lancet 1996", 1996),
      },
      {
        outcome: "neonatal infection (GBS or non-GBS) with term PROM",
        statistic: { type: "incidence", valuePercent: 2 },
        populationDescription: "Neonates of GBS-positive mothers with term PROM without prophylaxis",
        citation: cite("other", "Hannah et al., Lancet 1996", 1996),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "previable_pprom_expectant",
    name: "Previable PPROM (expectant management)",
    category: "miscellaneous_obstetric",
    tags: [
      "previable PPROM", "periviable PROM", "early PPROM",
      "second trimester PROM", "midtrimester PROM",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "PB 217")],
        timing: individualize(
          "Delivery by 34 weeks if ongoing expectant management",
          "Chorioamnionitis or maternal sepsis",
          "Non-reassuring fetal status",
          "Patient preference after counseling on prognosis",
        ),
        route: "either",
        grade: grade("C"),
        notes: "Individualize. If expectant management continues, delivery by 34 weeks.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Previable PPROM carries high risk of infection, pulmonary hypoplasia, and " +
      "neonatal mortality. Expectant management is individualized based on GA at " +
      "rupture, patient goals, and clinical course. If pregnancy continues, " +
      "delivery by 34 weeks.",
    specialConsiderations: [
      {
        type: "neonatal_consideration",
        description:
          "Pulmonary hypoplasia risk highest with PPROM before 22-24 weeks. " +
          "Neonatal survival and outcomes depend heavily on GA at rupture and delivery.",
      },
    ],
    riskData: [
      {
        outcome: "pulmonary hypoplasia with PPROM at <22 weeks",
        statistic: { type: "incidence", valuePercent: 26 },
        populationDescription: "Previable PPROM <22 weeks managed expectantly (systematic review)",
        citation: cite("other", "Muris et al., Obstet Gynecol 2007", 2007),
      },
      {
        outcome: "perinatal survival with previable PPROM and expectant management",
        statistic: { type: "incidence", valuePercent: 21 },
        populationDescription: "PPROM before 24 weeks with ongoing expectant management (cohort data)",
        citation: cite("other", "van Teeffelen et al., BJOG 2012", 2012),
      },
      {
        outcome: "chorioamnionitis with previable PPROM",
        statistic: { type: "incidence", valuePercent: 39 },
        populationDescription: "Pregnancies with PPROM <24 weeks on expectant management",
        citation: cite("other", "van Teeffelen et al., BJOG 2012", 2012),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "solid_organ_transplant",
    name: "Solid Organ Transplant (any)",
    category: "miscellaneous_obstetric",
    tags: [
      "transplant", "solid organ transplant", "kidney transplant", "liver transplant",
      "heart transplant", "lung transplant", "immunosuppression",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("SMFM", "#66", 2023)],
        timing: range(w(37), w(39, 6)),
        route: "either",
        grade: grade("2B"),
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "SMFM Consult Series #66 (2023) recommends delivery at 37w0d-39w6d for solid " +
      "organ transplant recipients. Timing within this range depends on graft function, " +
      "immunosuppression stability, and pregnancy complications. Immunosuppressive " +
      "medications should be continued throughout pregnancy.",
    specialConsiderations: [
      {
        type: "medication_continuation",
        description:
          "Continue immunosuppression throughout pregnancy. Calcineurin inhibitors " +
          "(tacrolimus, cyclosporine), azathioprine, and corticosteroids are acceptable. " +
          "Mycophenolate must be stopped >=6 weeks before conception.",
      },
      {
        type: "monitoring_requirement",
        description:
          "Monitor drug levels, graft function, and screen for preeclampsia and FGR. " +
          "Coordinate with transplant medicine team.",
      },
    ],
    riskData: [
      {
        outcome: "preeclampsia in solid organ transplant recipients",
        statistic: { type: "incidence", valuePercent: 27 },
        populationDescription: "Kidney transplant recipients in pregnancy (systematic review and meta-analysis)",
        citation: cite("other", "Deshpande et al., Am J Transplant 2011", 2011),
      },
      {
        outcome: "preterm birth <37 weeks in kidney transplant recipients",
        statistic: { type: "incidence", valuePercent: 46 },
        populationDescription: "Kidney transplant recipients (systematic review)",
        citation: cite("other", "Deshpande et al., Am J Transplant 2011", 2011),
      },
      {
        outcome: "fetal growth restriction in solid organ transplant recipients",
        statistic: { type: "incidence", valuePercent: 22 },
        populationDescription: "Liver and kidney transplant recipients in pregnancy",
        citation: cite("SMFM", "#66", 2023),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
];
