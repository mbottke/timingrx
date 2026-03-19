import type { ObstetricCondition } from "../types";
import { w, range, immediate, individualize, cite, grade } from "../helpers";

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
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
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
    riskData: [],
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
    riskData: [],
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
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
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
    riskData: [],
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
    riskData: [],
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
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
];
