import type { ObstetricCondition } from "../types";
import { w, range, individualize, cite, grade } from "../helpers";

export const priorObstetricConditions: ObstetricCondition[] = [
  {
    id: "prior_classical_cesarean",
    name: "Prior Classical (vertical) Cesarean",
    category: "prior_obstetric_history",
    tags: [
      "classical cesarean", "vertical incision", "prior cesarean", "fundal incision",
      "high vertical", "uterine rupture risk",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "CO 831", 2021)],
        timing: range(w(36), w(37)),
        route: "cesarean_required",
        grade: grade("B"),
        notes: "TOLAC contraindicated. Uterine rupture rate 0.6-11.5% with labor.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Prior classical cesarean carries a uterine rupture rate of 0.6-11.5% during labor, " +
      "making TOLAC contraindicated. Planned repeat cesarean at 36w0d-37w0d before labor " +
      "onset is standard. A NICHD study demonstrated that delivery at 36 vs 37 weeks " +
      "significantly increased neonatal RDS/TTN (aOR 2.48) and NICU admission (aOR 1.92), " +
      "justifying the 36w0d-37w0d rather than earlier delivery.",
    riskData: [
      {
        outcome: "uterine rupture during labor",
        statistic: { type: "incidence", valuePercent: 6 },
        populationDescription: "Women with prior classical cesarean undergoing labor (range 0.6-11.5%)",
        citation: cite("ACOG", "CO 831", 2021),
      },
    ],
    specialConsiderations: [
      {
        type: "contraindication",
        description: "TOLAC is contraindicated with prior classical uterine incision.",
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "prior_t_j_incision",
    name: "Prior T-incision or J-incision",
    category: "prior_obstetric_history",
    tags: ["T-incision", "J-incision", "prior cesarean", "uterine incision", "inverted T"],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "CO 831", 2021)],
        timing: range(w(36), w(37)),
        route: "cesarean_required",
        grade: grade("B"),
        notes: "TOLAC contraindicated due to extension into contractile upper segment.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "T-incision and J-incision extensions into the upper uterine segment carry " +
      "similar rupture risk to classical incision. TOLAC is contraindicated.",
    specialConsiderations: [
      {
        type: "contraindication",
        description: "TOLAC is contraindicated with prior T or J uterine incision.",
      },
    ],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "prior_uterine_rupture",
    name: "Prior Uterine Rupture",
    category: "prior_obstetric_history",
    tags: ["uterine rupture", "prior rupture", "ruptured uterus"],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "CO 831", 2021)],
        timing: range(w(36), w(37)),
        route: "cesarean_required",
        grade: grade("B"),
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Prior uterine rupture is an absolute contraindication to TOLAC. " +
      "Planned cesarean delivery at 36w0d-37w0d before labor onset.",
    specialConsiderations: [
      {
        type: "contraindication",
        description: "TOLAC is absolutely contraindicated after prior uterine rupture.",
      },
    ],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "prior_cs_x1_low_transverse",
    name: "Prior Cesarean x1 (low transverse)",
    category: "prior_obstetric_history",
    tags: [
      "prior cesarean", "low transverse", "TOLAC", "VBAC", "trial of labor",
      "repeat cesarean", "one prior cesarean",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "PB 205")],
        timing: range(w(39), w(40, 6)),
        route: "either",
        grade: grade("A"),
        notes:
          ">=39 weeks if elective repeat cesarean. TOLAC at spontaneous labor onset is " +
          "appropriate for candidates.",
      },
    ],
    pastFortyWeeks: "yes",
    clinicalNotes:
      "One prior low transverse cesarean: repeat cesarean at >=39 weeks or TOLAC at " +
      "spontaneous labor onset. TOLAC success rates ~60-80% depending on indication " +
      "for prior cesarean.",
    specialConsiderations: [
      {
        type: "delivery_site_requirement",
        description:
          "TOLAC should be attempted at a facility capable of emergency cesarean delivery.",
        citation: cite("ACOG", "PB 205"),
      },
    ],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "prior_cs_x2_low_transverse",
    name: "Prior Cesarean x2 (low transverse)",
    category: "prior_obstetric_history",
    tags: [
      "prior cesarean", "two prior cesareans", "low transverse", "TOLAC",
      "VBAC", "repeat cesarean",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "PB 205")],
        timing: range(w(39), w(40, 6)),
        route: "either",
        grade: grade("B"),
        notes:
          ">=39 weeks if repeat cesarean. TOLAC acceptable after counseling " +
          "(rupture 0.9% vs 0.7% with one prior).",
      },
    ],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "Two prior low transverse cesareans: TOLAC is acceptable with rupture risk of " +
      "0.9% vs 0.7% for one prior. Shared decision-making is essential.",
    riskData: [
      {
        outcome: "uterine rupture during TOLAC",
        statistic: { type: "incidence", valuePercent: 0.9 },
        populationDescription: "Women with two prior low transverse cesareans attempting TOLAC",
        citation: cite("ACOG", "PB 205"),
      },
    ],
    specialConsiderations: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "prior_cs_x3_plus",
    name: "Prior Cesarean x3+",
    category: "prior_obstetric_history",
    tags: ["multiple prior cesareans", "three cesareans", "repeat cesarean", "high parity cesarean"],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "PB 205")],
        timing: individualize(
          "Increasing surgical morbidity with each repeat cesarean",
          "Placenta accreta spectrum risk rises with each prior cesarean",
          "Individual patient factors and reproductive goals",
        ),
        route: "cesarean_preferred",
        grade: grade("C"),
      },
    ],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "Three or more prior cesareans: individualize based on increasing morbidity " +
      "(adhesive disease, accreta spectrum risk, bladder injury). Repeat cesarean " +
      "generally recommended.",
    specialConsiderations: [
      {
        type: "surgical_planning",
        description:
          "Increased risk of dense adhesions, accreta spectrum, bladder/bowel injury. " +
          "Consider experienced surgical team.",
      },
    ],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "prior_stillbirth_unexplained",
    name: "Prior Stillbirth (unexplained)",
    category: "prior_obstetric_history",
    tags: [
      "stillbirth", "IUFD", "fetal demise", "unexplained stillbirth",
      "prior stillbirth", "recurrent stillbirth",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "CO 831", 2021)],
        timing: range(w(37), w(38, 6)),
        route: "either",
        grade: grade("C"),
        notes:
          "Individualize timing. Early-term delivery at 37w0d-38w6d may be considered " +
          "after shared decision-making.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Prior unexplained stillbirth: timing is individualized. Many providers and " +
      "patients opt for early-term delivery at 37w0d-38w6d. Enhanced antenatal " +
      "surveillance beginning at 32 weeks is standard.",
    specialConsiderations: [
      {
        type: "monitoring_requirement",
        description: "Enhanced antenatal surveillance (weekly or twice-weekly NST/BPP) from 32 weeks.",
      },
    ],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "prior_stillbirth_explained",
    name: "Prior Stillbirth (explained cause)",
    category: "prior_obstetric_history",
    tags: ["stillbirth", "IUFD", "fetal demise", "explained stillbirth"],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "CO 831", 2021)],
        timing: individualize(
          "Manage per underlying condition that caused prior stillbirth",
          "Recurrence risk depends on etiology",
        ),
        route: "either",
        grade: grade("C"),
        notes: "Manage per the underlying condition responsible for prior stillbirth.",
      },
    ],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "When the cause of prior stillbirth is identified, delivery timing is guided " +
      "by the specific underlying condition (e.g., preeclampsia, FGR, diabetes).",
    specialConsiderations: [],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "prior_shoulder_dystocia",
    name: "Prior Shoulder Dystocia",
    category: "prior_obstetric_history",
    tags: ["shoulder dystocia", "brachial plexus", "macrosomia", "birth injury"],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "PB 178")],
        timing: individualize(
          "No specific GA target for delivery",
          "Discuss mode of delivery based on EFW",
          "Cesarean may be offered with EFW >=4,500 g (diabetic) or >=5,000 g (non-diabetic)",
        ),
        route: "individualize",
        grade: grade("C"),
      },
    ],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "No specific gestational age target. Mode of delivery discussion is the key " +
      "consideration: cesarean may be offered with EFW >=4,500 g in diabetic mothers " +
      "or >=5,000 g in non-diabetic mothers.",
    specialConsiderations: [],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "prior_fourth_degree_laceration",
    name: "Prior Fourth-Degree Laceration",
    category: "prior_obstetric_history",
    tags: [
      "fourth degree laceration", "perineal tear", "anal sphincter injury",
      "OASIS", "third degree", "fourth degree",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("other", "Expert consensus")],
        timing: individualize(
          "No specific GA target for delivery",
          "Mode of delivery is the key discussion point",
          "Elective cesarean may be discussed based on symptoms and patient preference",
        ),
        route: "individualize",
        grade: grade("C"),
      },
    ],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "No specific gestational age target. The key consideration is mode of delivery: " +
      "elective cesarean may be discussed, particularly if the patient has ongoing " +
      "fecal incontinence symptoms.",
    specialConsiderations: [],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "prior_ptb_on_progesterone",
    name: "Prior Preterm Birth on Progesterone",
    category: "prior_obstetric_history",
    tags: [
      "preterm birth", "progesterone", "17-OHPC", "makena", "vaginal progesterone",
      "cerclage", "recurrent preterm birth",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "PB 234")],
        timing: range(w(39), w(40, 6)),
        route: "either",
        grade: grade("B"),
        notes: "Standard timing unless recurrence risk triggers earlier delivery.",
      },
    ],
    pastFortyWeeks: "yes",
    clinicalNotes:
      "Follow standard delivery timing unless complications develop that warrant " +
      "earlier delivery. Progesterone supplementation for preterm birth prevention " +
      "does not alter delivery timing.",
    specialConsiderations: [],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "history_precipitous_labor",
    name: "History of Precipitous Labor",
    category: "prior_obstetric_history",
    tags: ["precipitous labor", "rapid labor", "fast delivery", "unplanned delivery"],
    guidelineRecommendations: [
      {
        citations: [cite("other", "Expert consensus")],
        timing: individualize(
          "No specific GA target",
          "Preparedness planning is the key intervention",
          "Proximity to delivery facility considerations",
        ),
        route: "either",
        grade: grade("C"),
        notes: "No specific GA target. Focus on preparedness planning and proximity to facility.",
      },
    ],
    pastFortyWeeks: "yes",
    clinicalNotes:
      "No specific gestational age target for delivery. The primary intervention " +
      "is preparedness planning: proximity to hospital, birth plan, and recognition " +
      "of labor signs.",
    specialConsiderations: [],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
];
