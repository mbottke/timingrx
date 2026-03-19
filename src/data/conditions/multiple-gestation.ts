import type { ObstetricCondition } from "../types";
import { w, range, individualize, cite, grade } from "../helpers";

export const multipleGestationConditions: ObstetricCondition[] = [
  {
    id: "dcda_twins",
    name: "DCDA Twins (uncomplicated)",
    category: "multiple_gestation",
    tags: ["twins", "DCDA", "dichorionic", "diamniotic", "di-di twins", "fraternal twins"],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "CO 831", 2021)],
        timing: range(w(38), w(38, 6)),
        route: "either",
        grade: grade("B"),
      },
      {
        citations: [cite("NICE", "NG137", 2019)],
        timing: range(w(37), w(37)),
        route: "either",
        grade: grade("B"),
        notes:
          "NICE recommends delivery at 37w0d for DCDA twins, one week earlier than ACOG. " +
          "This 1-week gap reflects different interpretations of the same evidence base.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "The 1-week gap between NICE (37w0d) and ACOG (38w0d-38w6d) for dichorionic twins " +
      "reflects different interpretations of the same evidence base. The Weitzner et al. " +
      "2023 AJOG review of 28 guidelines from 11 professional societies confirmed that " +
      "delivery timing for twins is a key area of international disagreement.",
    specialConsiderations: [],
    riskData: [
      {
        outcome: "stillbirth at 37 weeks",
        statistic: { type: "absolute_risk", valuePer1000: 1.0 },
        populationDescription: "DCDA twins at 37 weeks",
        citation: cite("ACOG", "CO 831", 2021),
      },
      {
        outcome: "stillbirth at 38 weeks",
        statistic: { type: "absolute_risk", valuePer1000: 1.9 },
        populationDescription: "DCDA twins at 38 weeks (vs singletons)",
        citation: cite("ACOG", "CO 831", 2021),
      },
      {
        outcome: "preterm birth <37 weeks",
        statistic: { type: "incidence", valuePercent: 50 },
        populationDescription: "DCDA twin pregnancies",
        citation: cite("ACOG", "CO 831", 2021),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [
      {
        id: "twin-birth-2013",
        name: "Twin Birth Study",
        year: 2013,
        journalCitation: "NEJM 2013;369:1295-1305",
        sampleSize: 2804,
        summary:
          "International RCT: planned CS vs vaginal for twins ≥32w with cephalic first twin. " +
          "No difference in outcomes.",
        keyFindings: [
          "Composite: 2.2% vs 1.9% (NS)",
          "Planned vaginal delivery safe for cephalic-presenting first twin",
        ],
      },
    ],
    interactions: [],
  },
  {
    id: "mcda_twins",
    name: "MCDA Twins (uncomplicated)",
    category: "multiple_gestation",
    tags: ["twins", "MCDA", "monochorionic", "diamniotic", "mono-di twins", "identical twins"],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "CO 831", 2021)],
        timing: range(w(34), w(37, 6)),
        route: "either",
        grade: grade("B"),
      },
      {
        citations: [cite("NICE", "NG137", 2019)],
        timing: range(w(36), w(36)),
        route: "either",
        grade: grade("B"),
        notes: "NICE specifies 36w0d for uncomplicated MCDA twins.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "ACOG gives a wide range of 34w0d-37w6d while NICE specifies 36w0d. Monochorionic " +
      "twins require close surveillance for TTTS, TAPS, and selective FGR throughout pregnancy.",
    specialConsiderations: [
      {
        type: "monitoring_requirement",
        description:
          "Ultrasound every 2 weeks from 16 weeks for TTTS surveillance " +
          "(deepest vertical pocket discordance, bladder visualization, Dopplers).",
      },
    ],
    riskData: [
      {
        outcome: "twin-to-twin transfusion syndrome (TTTS)",
        statistic: { type: "incidence", valuePercent: 12.5 },
        populationDescription: "MCDA twin pregnancies (range 10–15%)",
        citation: cite("ACOG", "CO 831", 2021),
      },
      {
        outcome: "stillbirth",
        statistic: { type: "relative_risk", value: 2.5, ci95: [2.0, 3.0] },
        populationDescription: "MCDA twins compared to DCDA twins",
        citation: cite("NICE", "NG137", 2019),
      },
      {
        outcome: "fetal death of one twin",
        statistic: { type: "incidence", valuePercent: 13 },
        populationDescription: "MCDA twin pregnancies (range 12–15%)",
        citation: cite("ACOG", "CO 831", 2021),
      },
      {
        outcome: "neurologic injury to surviving twin after single fetal death",
        statistic: { type: "incidence", valuePercent: 25 },
        populationDescription: "MCDA pregnancies with loss of one twin",
        citation: cite("ACOG", "CO 831", 2021),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "mcma_twins",
    name: "MCMA Twins",
    category: "multiple_gestation",
    tags: ["twins", "MCMA", "monoamniotic", "monochorionic monoamniotic", "mono-mono twins"],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "CO 831", 2021), cite("NICE", "NG137", 2019)],
        timing: range(w(32), w(34)),
        route: "cesarean_required",
        grade: grade("B"),
        notes: "Cesarean required due to cord entanglement risk. NICE range 32w0d-33w6d.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "MCMA twins carry significant risk of cord entanglement, mandating cesarean delivery. " +
      "Inpatient monitoring from 24-28 weeks is common practice due to sudden fetal demise risk.",
    specialConsiderations: [
      {
        type: "monitoring_requirement",
        description:
          "Consider inpatient monitoring from 24-28 weeks with continuous or frequent " +
          "fetal heart rate surveillance due to cord entanglement risk.",
      },
      {
        type: "delivery_site_requirement",
        description: "Delivery at center with NICU and experienced neonatal team.",
      },
    ],
    riskData: [
      {
        outcome: "perinatal mortality",
        statistic: { type: "mortality_rate", valuePercent: 12.5 },
        populationDescription: "MCMA twin pregnancies overall (range 10–15%)",
        citation: cite("ACOG", "CO 831", 2021),
      },
      {
        outcome: "cord entanglement",
        statistic: { type: "incidence", valuePercent: 100 },
        populationDescription: "MCMA twin pregnancies",
        citation: cite("ACOG", "CO 831", 2021),
      },
      {
        outcome: "stillbirth after viability",
        statistic: { type: "incidence", valuePercent: 4 },
        populationDescription: "MCMA twin pregnancies after viability (range 3–5%)",
        citation: cite("NICE", "NG137", 2019),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "ttts_post_laser",
    name: "TTTS (post-laser treatment)",
    category: "multiple_gestation",
    tags: [
      "TTTS", "twin-to-twin transfusion", "laser ablation", "fetoscopic laser",
      "twin transfusion", "monochorionic complication",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("SMFM", "#72", 2024)],
        timing: range(w(34), w(37)),
        route: "either",
        grade: grade("C"),
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Post-laser TTTS pregnancies require close surveillance for recurrence, TAPS, " +
      "and preterm labor. Delivery timing is 34w0d-37w0d depending on clinical course.",
    specialConsiderations: [
      {
        type: "monitoring_requirement",
        description:
          "Frequent ultrasound surveillance post-laser for recurrence, TAPS development, " +
          "and growth discordance. Weekly or biweekly Dopplers.",
      },
    ],
    riskData: [
      {
        outcome: "TTTS recurrence after laser",
        statistic: { type: "incidence", valuePercent: 14 },
        populationDescription: "Post-laser TTTS pregnancies (range 10–20%)",
        citation: cite("other", "Senat et al., N Engl J Med 2004", 2004),
      },
      {
        outcome: "development of TAPS post-laser",
        statistic: { type: "incidence", valuePercent: 13 },
        populationDescription: "MC pregnancies after fetoscopic laser (range 2–16%)",
        citation: cite("other", "Slaghekke et al., Lancet 2010", 2010),
      },
      {
        outcome: "perinatal survival of at least one twin after laser",
        statistic: { type: "incidence", valuePercent: 85 },
        populationDescription: "Post-laser TTTS — at least one survivor (range 80–90%)",
        citation: cite("other", "Senat et al., N Engl J Med 2004", 2004),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "taps",
    name: "Twin Anemia-Polycythemia Sequence (TAPS)",
    category: "multiple_gestation",
    tags: ["TAPS", "twin anemia polycythemia", "MCA Doppler", "monochorionic complication"],
    guidelineRecommendations: [
      {
        citations: [cite("SMFM", "#72", 2024)],
        timing: range(w(34), w(37)),
        route: "either",
        grade: grade("C"),
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "TAPS is characterized by large inter-twin hemoglobin differences without amniotic " +
      "fluid discordance. MCA Doppler surveillance is key for diagnosis.",
    specialConsiderations: [
      {
        type: "monitoring_requirement",
        description: "MCA Doppler surveillance for anemia/polycythemia. Neonatal hemoglobin at delivery.",
      },
    ],
    riskData: [
      {
        outcome: "perinatal mortality",
        statistic: { type: "mortality_rate", valuePercent: 12 },
        populationDescription: "Spontaneous TAPS (range 5–17%)",
        citation: cite("other", "Slaghekke et al., Lancet 2010", 2010),
      },
      {
        outcome: "neurodevelopmental impairment in donor twin",
        statistic: { type: "incidence", valuePercent: 20 },
        populationDescription: "TAPS donor twin survivors (range 15–25%)",
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "selective_fgr_mc_type_i",
    name: "Selective FGR in MC Twins, Type I (positive diastolic flow)",
    category: "multiple_gestation",
    tags: [
      "selective FGR", "sFGR", "monochorionic", "growth discordance",
      "type I", "positive diastolic",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("SMFM", "MC twin guidance")],
        timing: range(w(34), w(36)),
        route: "either",
        grade: grade("C"),
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Type I selective FGR with positive end-diastolic flow in the umbilical artery " +
      "has the most favorable prognosis among selective FGR subtypes.",
    specialConsiderations: [
      {
        type: "monitoring_requirement",
        description: "Serial Dopplers and growth every 1-2 weeks. Watch for progression to Type II/III.",
      },
    ],
    riskData: [
      {
        outcome: "perinatal mortality",
        statistic: { type: "mortality_rate", valuePercent: 4 },
        populationDescription: "Selective FGR Type I in MC twins (range 2–6%)",
        citation: cite("other", "Gratacos et al., Ultrasound Obstet Gynecol 2007", 2007),
      },
      {
        outcome: "progression to Type II/III",
        statistic: { type: "incidence", valuePercent: 15 },
        populationDescription: "Type I sFGR managed expectantly",
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "selective_fgr_mc_type_ii",
    name: "Selective FGR in MC Twins, Type II (AEDF/REDF)",
    category: "multiple_gestation",
    tags: [
      "selective FGR", "sFGR", "monochorionic", "AEDF", "REDF",
      "absent end-diastolic flow", "reversed end-diastolic flow", "type II",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("SMFM", "MC twin guidance")],
        timing: range(w(28), w(32)),
        route: "either",
        grade: grade("C"),
        notes: "Persistent AEDF or REDF in the umbilical artery of the FGR twin.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Type II selective FGR with absent or reversed end-diastolic flow carries " +
      "significant risk of co-twin demise and neurological injury. Earlier delivery " +
      "(28-32 weeks) reflects the severity of this pattern.",
    specialConsiderations: [
      {
        type: "delivery_site_requirement",
        description: "Delivery at tertiary center with NICU capable of managing extremely preterm neonates.",
      },
      {
        type: "monitoring_requirement",
        description: "Frequent Doppler surveillance (2-3 times per week). Inpatient monitoring may be indicated.",
      },
    ],
    riskData: [
      {
        outcome: "perinatal mortality (FGR twin)",
        statistic: { type: "mortality_rate", valuePercent: 29 },
        populationDescription: "Selective FGR Type II in MC twins — FGR twin (range 20–40%)",
        citation: cite("other", "Gratacos et al., Ultrasound Obstet Gynecol 2007", 2007),
      },
      {
        outcome: "neurological injury in normal-weight co-twin",
        statistic: { type: "incidence", valuePercent: 18 },
        populationDescription: "Type II sFGR — larger twin after FGR co-twin demise (range 15–25%)",
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "iufd_one_twin_dichorionic",
    name: "IUFD of One Twin (dichorionic)",
    category: "multiple_gestation",
    tags: [
      "IUFD", "single twin demise", "dichorionic", "co-twin death",
      "fetal demise", "twin demise",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "PB 231")],
        timing: range(w(38), w(38, 6)),
        route: "either",
        grade: grade("C"),
        notes:
          "Continue to standard dichorionic timing (38w0d-38w6d). No immediate delivery " +
          "required for the surviving twin in dichorionic pregnancies.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "In dichorionic twins, the surviving twin is not at risk of acute hemodynamic " +
      "instability from co-twin demise (separate placentas). Standard DC delivery " +
      "timing applies.",
    specialConsiderations: [
      {
        type: "monitoring_requirement",
        description: "Enhanced surveillance of surviving twin. Coagulation studies on mother.",
      },
    ],
    riskData: [
      {
        outcome: "adverse outcome in surviving dichorionic co-twin after one demise",
        statistic: { type: "incidence", valuePercent: 5 },
        populationDescription: "Dichorionic pregnancies with single IUFD — surviving twin (range 3–8%)",
        citation: cite("other", "Ong et al., BJOG 2006", 2006),
      },
      {
        outcome: "maternal DIC",
        statistic: { type: "incidence", valuePercent: 10 },
        populationDescription: "Single twin IUFD retained >5 weeks (range 5–15%)",
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "iufd_one_twin_monochorionic",
    name: "IUFD of One Twin (monochorionic)",
    category: "multiple_gestation",
    tags: [
      "IUFD", "single twin demise", "monochorionic", "co-twin death",
      "fetal demise", "twin demise", "MC",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "PB 231")],
        timing: range(w(34), w(36)),
        route: "either",
        grade: grade("C"),
        notes:
          "Delivery at 34-36 weeks with close surveillance. Brain MRI of surviving twin " +
          "at least 3 weeks after demise to assess for ischemic injury.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "In monochorionic twins, co-twin demise causes acute hemodynamic shifts through " +
      "shared placental anastomoses, placing the surviving twin at ~25% risk of neurological " +
      "injury or death. Brain MRI is recommended at least 3 weeks post-demise.",
    specialConsiderations: [
      {
        type: "imaging_surveillance",
        description:
          "Brain MRI of surviving twin at least 3 weeks after co-twin demise to " +
          "assess for ischemic/hemorrhagic injury.",
      },
      {
        type: "monitoring_requirement",
        description: "Intensive fetal surveillance including Dopplers and biophysical profiles.",
      },
    ],
    riskData: [
      {
        outcome: "neurological injury or death of surviving monochorionic co-twin",
        statistic: { type: "incidence", valuePercent: 25 },
        populationDescription: "MC pregnancies after single IUFD (range 20–30%)",
        citation: cite("ACOG", "CO 831", 2021),
      },
      {
        outcome: "death of surviving monochorionic co-twin",
        statistic: { type: "incidence", valuePercent: 12 },
        populationDescription: "MC pregnancies — surviving co-twin death after single IUFD (range 10–15%)",
        citation: cite("other", "Ong et al., BJOG 2006", 2006),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "trichorionic_triplets",
    name: "Trichorionic Triplets",
    category: "multiple_gestation",
    tags: ["triplets", "trichorionic", "triamniotic", "higher order multiples"],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "CO 831", 2021), cite("NICE", "NG137", 2019)],
        timing: range(w(35), w(36)),
        route: "either",
        grade: grade("B"),
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Trichorionic triplets are delivered at 35w0d-36w0d. NICE recommends 35w0d specifically.",
    specialConsiderations: [
      {
        type: "delivery_site_requirement",
        description: "Delivery at center with NICU and team prepared for three neonatal resuscitations.",
      },
    ],
    riskData: [
      {
        outcome: "preterm birth <34 weeks",
        statistic: { type: "incidence", valuePercent: 40 },
        populationDescription: "Trichorionic triplet pregnancies (range 35–50%)",
        citation: cite("other", "Elliott, Am J Obstet Gynecol 2005", 2005),
      },
      {
        outcome: "perinatal mortality",
        statistic: { type: "mortality_rate", valuePercent: 4 },
        populationDescription: "Trichorionic triplets — per fetus mortality (range 3–6%)",
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "dichorionic_triplets",
    name: "Dichorionic Triplets",
    category: "multiple_gestation",
    tags: ["triplets", "dichorionic", "higher order multiples", "monochorionic pair"],
    guidelineRecommendations: [
      {
        citations: [cite("other", "Expert consensus")],
        timing: range(w(34), w(35, 6)),
        route: "either",
        grade: grade("C"),
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Dichorionic triplets (one monochorionic pair plus one singleton) carry additional " +
      "risk from the shared placenta and are delivered earlier than trichorionic triplets.",
    specialConsiderations: [
      {
        type: "monitoring_requirement",
        description:
          "Surveillance for TTTS in the monochorionic pair in addition to standard " +
          "triplet monitoring.",
      },
      {
        type: "delivery_site_requirement",
        description: "Delivery at center with NICU and team prepared for three neonatal resuscitations.",
      },
    ],
    riskData: [
      {
        outcome: "TTTS in the monochorionic pair",
        statistic: { type: "incidence", valuePercent: 15 },
        populationDescription: "Dichorionic triplets with MC pair (range 10–20%)",
        citation: cite("other", "Bajoria et al., Hum Reprod 2006", 2006),
      },
      {
        outcome: "preterm birth <32 weeks",
        statistic: { type: "incidence", valuePercent: 35 },
        populationDescription: "Dichorionic triplets (range 28–42%)",
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
];
