import type { ObstetricCondition } from "../types";
import { w, range, individualize, cite, grade } from "../helpers";

export const placentalUterineConditions: ObstetricCondition[] = [
  {
    id: "placenta_previa_uncomplicated",
    name: "Placenta Previa (uncomplicated)",
    category: "placental_uterine",
    tags: ["placenta previa", "previa", "low-lying placenta", "placental location"],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "CO 831", 2021)],
        timing: range(w(36), w(37, 6)),
        route: "cesarean_required",
        grade: grade("B"),
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Complete placenta previa requires cesarean delivery. Uncomplicated previa delivers " +
      "at 36w0d-37w6d; earlier delivery if significant bleeding episodes occur.",
    specialConsiderations: [
      {
        type: "surgical_planning",
        description:
          "Type and screen on admission. Blood bank availability required. " +
          "Antenatal corticosteroids if delivery anticipated before 37w0d.",
      },
    ],
    riskData: [
      {
        outcome: "maternal hemorrhage requiring transfusion",
        statistic: { type: "incidence", valuePercent: 22.5 },
        populationDescription: "Placenta previa at delivery (range 20–25%)",
        citation: cite("ACOG", "CO 831", 2021),
      },
      {
        outcome: "hysterectomy",
        statistic: { type: "incidence", valuePercent: 6 },
        populationDescription: "Placenta previa without accreta spectrum (range 5–7%)",
        citation: cite("ACOG", "CO 831", 2021),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "placenta_accreta_spectrum",
    name: "Placenta Accreta Spectrum (uncomplicated)",
    category: "placental_uterine",
    tags: [
      "accreta", "increta", "percreta", "placenta accreta spectrum",
      "PAS", "morbidly adherent placenta",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "CO 831", 2021), cite("SMFM", "#17", 2017)],
        timing: range(w(34), w(35, 6)),
        route: "cesarean_required",
        grade: grade("B"),
        notes: "Planned cesarean with hysterectomy planning at accreta center.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Placenta accreta spectrum delivers earlier (34-35w6d) than uncomplicated previa " +
      "because hemorrhage risk from abnormal placentation outweighs neonatal prematurity " +
      "risk by 34 weeks. Delivery must occur at a center with blood bank, IR, gynecologic " +
      "oncology or experienced pelvic surgeon, and ICU availability.",
    specialConsiderations: [
      {
        type: "surgical_planning",
        description:
          "Planned cesarean hysterectomy. Multidisciplinary team: MFM, gynecologic oncology, " +
          "interventional radiology, anesthesia, blood bank, NICU. Massive transfusion " +
          "protocol on standby.",
      },
      {
        type: "delivery_site_requirement",
        description: "Accreta center of excellence with IR, blood bank, ICU, and surgical expertise.",
      },
    ],
    riskData: [
      {
        outcome: "hysterectomy",
        statistic: { type: "incidence", valuePercent: 85 },
        populationDescription: "Placenta accreta spectrum at delivery (range 80–90%)",
        citation: cite("SMFM", "#17", 2017),
      },
      {
        outcome: "massive hemorrhage (>2L estimated blood loss)",
        statistic: { type: "incidence", valuePercent: 65 },
        populationDescription: "Placenta accreta spectrum (range 60–70%)",
        citation: cite("SMFM", "#17", 2017),
      },
      {
        outcome: "maternal mortality",
        statistic: { type: "mortality_rate", valuePercent: 5 },
        populationDescription: "Placenta accreta spectrum (range 3–7%)",
        citation: cite("SMFM", "#17", 2017),
      },
      {
        outcome: "ICU admission",
        statistic: { type: "incidence", valuePercent: 35 },
        populationDescription: "Placenta accreta spectrum (range 30–40%)",
        citation: cite("SMFM", "#17", 2017),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "vasa_previa",
    name: "Vasa Previa",
    category: "placental_uterine",
    tags: ["vasa previa", "velamentous insertion", "fetal vessel", "cord insertion"],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "CO 831", 2021)],
        timing: range(w(34), w(37)),
        route: "cesarean_required",
        grade: grade("B"),
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Vasa previa carries risk of fetal exsanguination with membrane rupture. " +
      "Prenatal diagnosis with planned cesarean delivery dramatically improves survival.",
    specialConsiderations: [
      {
        type: "monitoring_requirement",
        description: "Consider inpatient management from 30-34 weeks given catastrophic risk of rupture.",
      },
    ],
    riskData: [
      {
        outcome: "fetal mortality if undiagnosed (emergency rupture)",
        statistic: { type: "mortality_rate", valuePercent: 64 },
        populationDescription: "Vasa previa — undiagnosed cases (range 33–95%)",
        citation: cite("ACOG", "CO 831", 2021),
      },
      {
        outcome: "fetal mortality with antenatal diagnosis and planned cesarean",
        statistic: { type: "mortality_rate", valuePercent: 3 },
        populationDescription: "Vasa previa diagnosed prenatally with planned CS (<3%)",
        citation: cite("ACOG", "CO 831", 2021),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "velamentous_cord_insertion",
    name: "Velamentous Cord Insertion (without vasa previa)",
    category: "placental_uterine",
    tags: ["velamentous", "cord insertion", "umbilical cord", "marginal insertion"],
    guidelineRecommendations: [
      {
        citations: [cite("other", "Expert consensus")],
        timing: range(w(39), w(40, 6)),
        route: "either",
        grade: grade("C"),
        notes: "Term delivery if fetal growth is normal.",
      },
    ],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "Velamentous cord insertion without vasa previa does not mandate early delivery " +
      "if fetal growth is normal. Serial growth surveillance is recommended.",
    specialConsiderations: [
      {
        type: "imaging_surveillance",
        description: "Serial growth ultrasounds to confirm normal fetal growth trajectory.",
      },
    ],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "single_umbilical_artery_isolated",
    name: "Single Umbilical Artery (isolated)",
    category: "placental_uterine",
    tags: ["single umbilical artery", "SUA", "two-vessel cord"],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "Clinical guidance")],
        timing: range(w(39), w(40, 6)),
        route: "either",
        grade: grade("C"),
        notes: "Term delivery. Serial growth scans from 28 weeks.",
      },
    ],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "Isolated single umbilical artery (no other anomalies) does not mandate early " +
      "delivery. Serial growth ultrasound from 28 weeks to monitor for FGR.",
    specialConsiderations: [
      {
        type: "imaging_surveillance",
        description: "Serial growth ultrasound every 4 weeks starting at 28 weeks.",
      },
    ],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "circumvallate_placenta",
    name: "Circumvallate Placenta",
    category: "placental_uterine",
    tags: ["circumvallate", "placental shape", "placental margin"],
    guidelineRecommendations: [
      {
        citations: [cite("other", "Expert consensus")],
        timing: individualize(
          "Abruption or hemorrhage",
          "Preterm labor",
          "FGR",
        ),
        route: "either",
        grade: grade("C"),
        notes: "Individualize by complications (abruption, FGR, preterm labor).",
      },
    ],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "Circumvallate placenta is associated with increased risk of abruption, preterm " +
      "birth, and FGR. No fixed GA target; delivery timing driven by complications.",
    specialConsiderations: [],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "uterine_fibroids_large_obstructing",
    name: "Uterine Fibroids (large, obstructing)",
    category: "placental_uterine",
    tags: ["fibroids", "leiomyoma", "myoma", "uterine fibroid", "obstructing"],
    guidelineRecommendations: [
      {
        citations: [cite("other", "Expert consensus")],
        timing: individualize(
          "Lower segment obstruction requiring cesarean",
          "Fibroid degeneration causing pain or preterm labor",
          "FGR from placental compromise",
        ),
        route: "individualize",
        grade: grade("C"),
        notes: "Cesarean if lower segment obstruction; otherwise individualize.",
      },
    ],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "Large obstructing fibroids may necessitate cesarean delivery. Timing is " +
      "individualized based on fibroid location, size, and complications.",
    specialConsiderations: [],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "cervical_cerclage_transvaginal",
    name: "Cervical Cerclage (transvaginal McDonald)",
    category: "placental_uterine",
    tags: ["cerclage", "cervical cerclage", "McDonald cerclage", "transvaginal cerclage"],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "PB 142")],
        timing: range(w(36), w(37)),
        route: "either",
        grade: grade("B"),
        notes: "Remove cerclage at 36w0d-37w0d; delivery follows per obstetric indications.",
      },
    ],
    pastFortyWeeks: "yes",
    clinicalNotes:
      "Transvaginal cerclage is removed at 36w0d-37w0d. After removal, delivery timing " +
      "follows standard obstetric indications. Vaginal delivery is appropriate.",
    specialConsiderations: [],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "transabdominal_cerclage",
    name: "Transabdominal Cerclage",
    category: "placental_uterine",
    tags: ["transabdominal cerclage", "TAC", "abdominal cerclage"],
    guidelineRecommendations: [
      {
        citations: [cite("SMFM", "#65")],
        timing: range(w(37), w(39)),
        route: "cesarean_required",
        grade: grade("C"),
        notes: "Cesarean delivery at 37w0d-39w0d; cerclage left in situ for future pregnancies.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Transabdominal cerclage cannot be removed vaginally and requires cesarean delivery. " +
      "The cerclage is typically left in situ for use in subsequent pregnancies.",
    specialConsiderations: [
      {
        type: "surgical_planning",
        description: "Cerclage left in situ at cesarean for future fertility preservation.",
      },
    ],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "prior_myomectomy_transmural",
    name: "Prior Myomectomy (transmural)",
    category: "placental_uterine",
    tags: ["myomectomy", "transmural", "prior myomectomy", "uterine surgery"],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "CO 831", 2021)],
        timing: range(w(37), w(38, 6)),
        route: "cesarean_preferred",
        grade: grade("C"),
        notes: "Cesarean delivery; individualize based on surgical details (cavity entry, repair technique).",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Transmural myomectomy with endometrial cavity entry is generally managed similarly " +
      "to prior classical cesarean regarding labor avoidance, though evidence is limited. " +
      "Delivery route individualized by operative details.",
    specialConsiderations: [],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "prior_myomectomy_superficial",
    name: "Prior Myomectomy (superficial / non-transmural)",
    category: "placental_uterine",
    tags: ["myomectomy", "superficial", "non-transmural", "subserosal"],
    guidelineRecommendations: [
      {
        citations: [cite("other", "Expert consensus")],
        timing: range(w(39), w(40, 6)),
        route: "either",
        grade: grade("C"),
        notes: "Term delivery. TOLAC may be appropriate based on surgical details.",
      },
    ],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "Superficial or non-transmural myomectomy without cavity entry may allow trial " +
      "of labor. Decision should be individualized based on operative report details.",
    specialConsiderations: [],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "uterine_anomalies",
    name: "Uterine Anomalies (bicornuate, unicornuate, didelphys, septate)",
    category: "placental_uterine",
    tags: [
      "uterine anomaly", "bicornuate", "unicornuate", "didelphys", "septate",
      "mullerian anomaly", "uterine malformation",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("other", "Expert consensus")],
        timing: individualize(
          "Malpresentation requiring cesarean",
          "Preterm labor (~40% PTB rate)",
          "FGR",
          "Cervical insufficiency",
        ),
        route: "individualize",
        grade: grade("C"),
        notes:
          "No specific early delivery recommendation. ~40% preterm birth rate. " +
          "Cesarean for malpresentation.",
      },
    ],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "Uterine anomalies carry approximately 40% preterm birth rate but do not have " +
      "a specific GA target for delivery. Cesarean is indicated for malpresentation, " +
      "which is common with these anomalies.",
    riskData: [
      {
        outcome: "preterm birth",
        statistic: { type: "incidence", valuePercent: 40 },
        populationDescription: "Women with uterine anomalies",
      },
    ],
    specialConsiderations: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
];
