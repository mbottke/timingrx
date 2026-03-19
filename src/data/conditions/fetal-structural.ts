import type { ObstetricCondition } from "../types";
import { w, range, individualize, cite, grade } from "../helpers";
import { momsTrial } from "../trials";
import { eurocat, cdcNbdps, chopFetal, ucssFetal } from "../evidence-sources";

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
    riskData: [
      {
        outcome: "stillbirth or neonatal death without surgical center delivery",
        statistic: { type: "incidence", valuePercent: 4 },
        populationDescription: "Gastroschisis — overall perinatal mortality (modern surgical centers)",
        citation: cite("other", "Lepigeon et al., BJOG 2014", 2014),
      },
      {
        outcome: "birth prevalence",
        statistic: { type: "absolute_risk", valuePer1000: 2.0 },
        populationDescription: "Gastroschisis — USA population-based estimate (CDC NBDPS)",
        citation: cite("other", "Kirby et al., Birth Defects Res A 2013", 2013),
      },
      {
        outcome: "intact survival to discharge",
        statistic: { type: "incidence", valuePercent: 90 },
        populationDescription: "Isolated gastroschisis at tertiary surgical centers",
        citation: cite("other", "Arnold et al., J Pediatr Surg 2010", 2010),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    keyEvidenceSources: [eurocat, cdcNbdps, chopFetal, ucssFetal],
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
    riskData: [
      {
        outcome: "associated chromosomal anomaly",
        statistic: { type: "incidence", valuePercent: 30 },
        populationDescription: "Omphalocele — predominantly trisomy 18, 13, and 21",
        citation: cite("other", "Stoll et al., EUROCAT 2008", 2008),
      },
      {
        outcome: "Beckwith-Wiedemann syndrome association",
        statistic: { type: "incidence", valuePercent: 10 },
        populationDescription: "Isolated omphalocele without chromosomal anomaly",
        citation: cite("other", "Debelenko et al., Am J Med Genet 2010", 2010),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    keyEvidenceSources: [eurocat, cdcNbdps, chopFetal, ucssFetal],
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
    riskData: [
      {
        outcome: "sac rupture risk during vaginal delivery",
        statistic: { type: "incidence", valuePercent: 15 },
        populationDescription: "Giant liver-containing omphalocele attempting vaginal delivery",
        citation: cite("other", "Bradnock et al., Arch Dis Child 2011", 2011),
      },
      {
        outcome: "pulmonary hypoplasia requiring prolonged ventilation",
        statistic: { type: "incidence", valuePercent: 30 },
        populationDescription: "Giant omphalocele (liver-containing, defect >5 cm)",
        citation: cite("other", "Biard et al., J Pediatr Surg 2004", 2004),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    keyEvidenceSources: [eurocat, cdcNbdps, chopFetal, ucssFetal],
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
    riskData: [
      {
        outcome: "overall survival (isolated CDH, liver-up)",
        statistic: { type: "incidence", valuePercent: 50 },
        populationDescription: "Isolated left CDH with liver herniation (o/e LHR <25%)",
        citation: cite("other", "Jani et al., Ultrasound Obstet Gynecol 2009", 2009),
      },
      {
        outcome: "overall survival (isolated CDH, liver-down)",
        statistic: { type: "incidence", valuePercent: 75 },
        populationDescription: "Isolated left CDH without liver herniation",
        citation: cite("other", "Jani et al., Ultrasound Obstet Gynecol 2009", 2009),
      },
      {
        outcome: "ECMO requirement",
        statistic: { type: "incidence", valuePercent: 30 },
        populationDescription: "CDH neonates at ECMO-capable centers",
        citation: cite("other", "Snoek et al., J Pediatr Surg 2016", 2016),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    keyEvidenceSources: [eurocat, cdcNbdps, chopFetal, ucssFetal],
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
    riskData: [
      {
        outcome: "VP shunt placement by 12 months (postnatal repair)",
        statistic: { type: "incidence", valuePercent: 82 },
        populationDescription: "Myelomeningocele repaired postnatally (MOMS trial control arm)",
        citation: cite("other", "Adzick et al., NEJM 2011", 2011),
      },
      {
        outcome: "ambulatory without orthosis at 30 months (postnatal repair)",
        statistic: { type: "incidence", valuePercent: 21 },
        populationDescription: "Postnatal myelomeningocele repair (MOMS trial control arm)",
        citation: cite("other", "Adzick et al., NEJM 2011", 2011),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [momsTrial],
    keyEvidenceSources: [eurocat, cdcNbdps, chopFetal, ucssFetal],
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
    riskData: [
      {
        outcome: "VP shunt placement by 12 months (prenatal repair)",
        statistic: { type: "incidence", valuePercent: 40 },
        populationDescription: "Myelomeningocele repaired prenatally (MOMS trial prenatal arm)",
        citation: cite("other", "Adzick et al., NEJM 2011", 2011),
      },
      {
        outcome: "preterm delivery <37 weeks",
        statistic: { type: "incidence", valuePercent: 79 },
        populationDescription: "Pregnancies undergoing open fetal MMC repair (MOMS trial)",
        citation: cite("other", "Adzick et al., NEJM 2011", 2011),
      },
      {
        outcome: "uterine dehiscence or rupture at delivery",
        statistic: { type: "incidence", valuePercent: 10 },
        populationDescription: "Post-open fetal MMC repair at time of cesarean delivery",
        citation: cite("other", "Adzick et al., NEJM 2011", 2011),
      },
    ],
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
    keyEvidenceSources: [eurocat, cdcNbdps, chopFetal, ucssFetal],
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
    riskData: [
      {
        outcome: "intact survival to hospital discharge",
        statistic: { type: "incidence", valuePercent: 85 },
        populationDescription: "Small isolated sacrococcygeal teratoma delivered at tertiary center",
        citation: cite("other", "Westerburg et al., J Pediatr Surg 2000", 2000),
      },
      {
        outcome: "hydrops development requiring early delivery",
        statistic: { type: "incidence", valuePercent: 5 },
        populationDescription: "Fetal SCT diagnosed prenatally, all sizes",
        citation: cite("other", "Hedrick et al., J Pediatr Surg 2004", 2004),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    keyEvidenceSources: [eurocat, cdcNbdps, chopFetal, ucssFetal],
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
    riskData: [
      {
        outcome: "perinatal mortality (large SCT with hydrops)",
        statistic: { type: "mortality_rate", valuePercent: 50 },
        populationDescription: "Fetal SCT >10 cm with hydrops fetalis",
        citation: cite("other", "Hedrick et al., J Pediatr Surg 2004", 2004),
      },
      {
        outcome: "tumor hemorrhage requiring emergent delivery",
        statistic: { type: "incidence", valuePercent: 10 },
        populationDescription: "Large fetal SCT managed expectantly",
        citation: cite("other", "Westerburg et al., J Pediatr Surg 2000", 2000),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    keyEvidenceSources: [eurocat, cdcNbdps, chopFetal, ucssFetal],
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
    riskData: [
      {
        outcome: "spontaneous regression by third trimester",
        statistic: { type: "incidence", valuePercent: 40 },
        populationDescription: "Prenatally diagnosed CPAM (all types)",
        citation: cite("other", "Cavoretto et al., Ultrasound Obstet Gynecol 2008", 2008),
      },
      {
        outcome: "hydrops development (CVR >1.6)",
        statistic: { type: "incidence", valuePercent: 80 },
        populationDescription: "CPAM with CVR >1.6 on second-trimester ultrasound",
        citation: cite("other", "Crombleholme et al., J Pediatr Surg 2002", 2002),
      },
      {
        outcome: "malignant transformation risk (pleuropulmonary blastoma)",
        statistic: { type: "incidence", valuePercent: 1 },
        populationDescription: "CPAM Type I/II lesions managed expectantly through childhood",
        citation: cite("other", "Stocker et al., Pediatr Dev Pathol 2002", 2002),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    keyEvidenceSources: [eurocat, cdcNbdps, chopFetal, ucssFetal],
    interactions: [],
  },
];
