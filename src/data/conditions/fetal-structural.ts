import type { ObstetricCondition } from "../types";
import { w, range, individualize, cite, grade } from "../helpers";

export const fetalStructuralConditions: ObstetricCondition[] = [
  {
    id: "gastroschisis",
    name: "Gastroschisis",
    category: "fetal_abdominal_wall",
    tags: [
      "gastroschisis",
      "abdominal wall defect",
      "bowel herniation",
      "fetal anomaly",
    ],
    guidelineRecommendations: [
      {
        citations: [
          cite("other", "Expert consensus"),
          cite("other", "PMC cost-effectiveness study"),
        ],
        timing: range(w(37), w(38, 6)),
        route: "vaginal_preferred",
        grade: grade("C"),
        notes:
          "37-38 weeks based on cost-effectiveness analysis. Close surveillance after 34 weeks.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Gastroschisis requires delivery at a center with pediatric surgery. Vaginal delivery " +
      "is preferred as it does not worsen outcomes compared with cesarean. Close fetal " +
      "surveillance after 34 weeks due to increased risk of bowel injury and stillbirth.",
    specialConsiderations: [
      {
        type: "delivery_site_requirement",
        description:
          "Deliver at a center with pediatric surgery and NICU capability.",
      },
      {
        type: "monitoring_requirement",
        description:
          "Close surveillance after 34 weeks with serial growth and fluid assessment. " +
          "Watch for bowel dilation, wall thickening, or decreased fluid.",
      },
    ],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "omphalocele_small_isolated",
    name: "Omphalocele (Small, Isolated)",
    category: "fetal_abdominal_wall",
    tags: [
      "omphalocele",
      "abdominal wall defect",
      "small omphalocele",
      "isolated",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("other", "Expert consensus")],
        timing: range(w(39), w(41, 6)),
        route: "either",
        grade: grade("C"),
        notes: "Deliver at >=39 weeks for small, isolated omphalocele.",
      },
    ],
    pastFortyWeeks: "yes",
    clinicalNotes:
      "Small isolated omphalocele without liver herniation can be delivered at term. " +
      "Karyotype and genetic evaluation are important, as omphalocele is associated " +
      "with trisomies and Beckwith-Wiedemann syndrome.",
    specialConsiderations: [
      {
        type: "delivery_site_requirement",
        description: "Deliver at a center with pediatric surgery.",
      },
    ],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "omphalocele_giant",
    name: "Omphalocele (Giant, Liver-Containing)",
    category: "fetal_abdominal_wall",
    tags: [
      "omphalocele",
      "giant omphalocele",
      "liver-containing",
      "abdominal wall defect",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("other", "Expert consensus")],
        timing: range(w(37), w(39, 6)),
        route: "cesarean_preferred",
        grade: grade("C"),
        notes:
          "37-39 weeks. Cesarean preferred due to sac rupture risk with giant omphalocele.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Giant liver-containing omphalocele carries risk of sac rupture during labor, " +
      "making cesarean delivery preferred. Staged surgical repair (silo placement) " +
      "is often required postnatally.",
    specialConsiderations: [
      {
        type: "delivery_site_requirement",
        description:
          "Deliver at a center with pediatric surgery and NICU capability.",
      },
      {
        type: "neonatal_consideration",
        description:
          "Staged closure with silo is often necessary. Risk of pulmonary hypoplasia " +
          "with very large defects.",
      },
    ],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "cdh",
    name: "Congenital Diaphragmatic Hernia (CDH)",
    category: "fetal_structural",
    tags: [
      "CDH",
      "congenital diaphragmatic hernia",
      "diaphragmatic hernia",
      "Bochdalek",
      "pulmonary hypoplasia",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("other", "Expert consensus")],
        timing: range(w(37), w(39, 6)),
        route: "vaginal_preferred",
        grade: grade("C"),
        notes:
          ">=37-39 weeks. Vaginal preferred; cesarean does not improve outcomes.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "CDH requires delivery at a center with ECMO capability, pediatric surgery, and " +
      "neonatal ICU. Cesarean delivery does not improve outcomes. Severity depends on " +
      "observed/expected lung-to-head ratio (o/e LHR) and liver herniation.",
    specialConsiderations: [
      {
        type: "delivery_site_requirement",
        description:
          "Delivery must occur at a center with ECMO, pediatric surgery, and NICU.",
      },
      {
        type: "neonatal_consideration",
        description:
          "Immediate intubation; avoid bag-mask ventilation. Gentle ventilation strategy " +
          "to minimize barotrauma. ECMO may be required.",
      },
    ],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "myelomeningocele_no_fetal_surgery",
    name: "Myelomeningocele (No Fetal Surgery)",
    category: "fetal_structural",
    tags: [
      "myelomeningocele",
      "spina bifida",
      "neural tube defect",
      "NTD",
      "open spina bifida",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("other", "Expert consensus")],
        timing: range(w(37), w(39, 6)),
        route: "cesarean_required",
        grade: grade("C"),
        notes:
          "37-39 weeks. Cesarean delivery to minimize trauma to exposed neural placode.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Without fetal surgery, the open neural placode is exposed and cesarean delivery " +
      "minimizes direct trauma. Postnatal surgical closure is performed within 24-72 hours.",
    specialConsiderations: [
      {
        type: "delivery_site_requirement",
        description:
          "Deliver at a center with pediatric neurosurgery and NICU.",
      },
      {
        type: "neonatal_consideration",
        description:
          "Protect exposed neural placode with moist sterile dressing. Surgical closure " +
          "within 24-72 hours. Assess for hydrocephalus and Chiari II malformation.",
      },
    ],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "myelomeningocele_post_moms",
    name: "Myelomeningocele (Post-Fetal Surgery, MOMS Trial)",
    category: "fetal_structural",
    tags: [
      "myelomeningocele",
      "spina bifida",
      "MOMS trial",
      "fetal surgery",
      "in utero repair",
      "neural tube defect",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("other", "MOMS Trial protocol", 2011)],
        timing: range(w(37), w(37)),
        route: "cesarean_required",
        grade: grade("A"),
        notes:
          "37w0d. Cesarean required due to prior hysterotomy for fetal repair.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "The MOMS trial demonstrated that prenatal myelomeningocele repair reduces the " +
      "need for ventriculoperitoneal shunting and improves motor outcomes. Cesarean delivery " +
      "at 37 weeks is required due to the prior uterine incision from fetal surgery.",
    specialConsiderations: [
      {
        type: "surgical_planning",
        description:
          "Cesarean required at 37 weeks due to prior hysterotomy. Risk of uterine " +
          "rupture is elevated; labor is contraindicated.",
      },
    ],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [
      {
        id: "moms-2011",
        name: "MOMS Trial (Management of Myelomeningocele Study)",
        year: 2011,
        journalCitation: "NEJM 2011;364:993-1004",
        sampleSize: 183,
        summary:
          "Prenatal repair of myelomeningocele reduced need for shunting (40% vs 82%) " +
          "and improved motor outcomes at 30 months compared with postnatal repair.",
        keyFindings: [
          "VP shunt placement: 40% prenatal vs 82% postnatal",
          "Improved composite motor/mental score at 30 months",
          "Increased risk of preterm delivery and uterine dehiscence with prenatal repair",
          "Cesarean delivery required for subsequent pregnancies",
        ],
      },
    ],
    interactions: [],
  },
  {
    id: "sct_small_stable",
    name: "Sacrococcygeal Teratoma (Small, Stable)",
    category: "fetal_structural",
    tags: [
      "SCT",
      "sacrococcygeal teratoma",
      "teratoma",
      "fetal tumor",
      "small SCT",
    ],
    guidelineRecommendations: [
      {
        citations: [
          cite("other", "UCSF Fetal Treatment Center"),
          cite("other", "Cincinnati Children's"),
        ],
        timing: range(w(39), w(41, 6)),
        route: "vaginal_preferred",
        grade: grade("C"),
        notes: "Term delivery. Vaginal acceptable for small, stable tumors.",
      },
    ],
    pastFortyWeeks: "yes",
    clinicalNotes:
      "Small, stable sacrococcygeal teratomas without significant vascularity or " +
      "high-output cardiac failure can be delivered vaginally at term. Serial monitoring " +
      "for tumor growth and hydrops is essential.",
    specialConsiderations: [
      {
        type: "monitoring_requirement",
        description:
          "Serial ultrasound to monitor tumor size, vascularity, and fetal cardiac function. " +
          "Watch for hydrops from high-output cardiac failure.",
      },
    ],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "sct_large",
    name: "Sacrococcygeal Teratoma (Large, >10 cm)",
    category: "fetal_structural",
    tags: [
      "SCT",
      "sacrococcygeal teratoma",
      "large SCT",
      "EXIT procedure",
      "fetal tumor",
      "high-output failure",
    ],
    guidelineRecommendations: [
      {
        citations: [
          cite("other", "UCSF Fetal Treatment Center"),
          cite("other", "Expert consensus"),
        ],
        timing: individualize(
          "Often after 32 weeks with antenatal corticosteroids",
          "Tumor growth causing hemodynamic compromise",
          "Hydrops or high-output cardiac failure",
          "Hemorrhage into tumor",
        ),
        route: "cesarean_required",
        grade: grade("C"),
        notes:
          "Individualize timing; often after 32 weeks. Cesarean required; may need EXIT procedure.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Large SCTs (>10 cm) carry significant risk of tumor hemorrhage, high-output " +
      "cardiac failure, and hydrops. Cesarean delivery is required, and an EXIT " +
      "(ex utero intrapartum treatment) procedure may be necessary for airway management " +
      "or tumor resection on placental support.",
    specialConsiderations: [
      {
        type: "surgical_planning",
        description:
          "EXIT procedure may be needed for large tumors. Multidisciplinary planning " +
          "with pediatric surgery, anesthesia, and neonatology is essential.",
      },
      {
        type: "delivery_site_requirement",
        description:
          "Deliver at a tertiary center with fetal surgery, pediatric surgery, and NICU.",
      },
    ],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "cpam_without_hydrops",
    name: "Congenital Pulmonary Airway Malformation (CPAM) without Hydrops",
    category: "fetal_structural",
    tags: [
      "CPAM",
      "CCAM",
      "congenital pulmonary airway malformation",
      "congenital cystic adenomatoid malformation",
      "lung lesion",
      "fetal lung mass",
    ],
    guidelineRecommendations: [
      {
        citations: [
          cite("other", "CHOP Fetal Diagnosis and Treatment Center"),
          cite("other", "Expert consensus"),
        ],
        timing: range(w(39), w(41, 6)),
        route: "either",
        grade: grade("C"),
        notes: "Term delivery when CPAM is without hydrops.",
      },
    ],
    pastFortyWeeks: "yes",
    clinicalNotes:
      "CPAM without hydrops can be delivered at term. Many lesions regress in the third " +
      "trimester. Postnatal CT and potential surgical resection are planned electively. " +
      "CPAM with hydrops requires individualized earlier intervention.",
    specialConsiderations: [
      {
        type: "monitoring_requirement",
        description:
          "Serial ultrasound to track CPAM volume ratio (CVR). CVR >1.6 is associated " +
          "with increased risk of hydrops. Most lesions plateau or regress after 28 weeks.",
      },
      {
        type: "neonatal_consideration",
        description:
          "Postnatal chest CT at 1-3 months. Elective surgical resection is typically " +
          "recommended even for asymptomatic lesions due to malignancy risk.",
      },
    ],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
];
