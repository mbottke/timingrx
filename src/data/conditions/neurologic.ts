import type { ObstetricCondition } from "../types";
import { w, range, individualize, cite, grade } from "../helpers";

export const neurologicConditions: ObstetricCondition[] = [
  {
    id: "epilepsy_well_controlled",
    name: "Epilepsy, well-controlled on AEDs",
    category: "neurologic",
    tags: ["epilepsy", "seizure", "AED", "antiepileptic", "antiseizure", "well-controlled"],
    guidelineRecommendations: [
      {
        citations: [
          cite("RCOG", "GTG 68"),
          cite("AAN", "AAN/AES/SMFM 2024 guideline", 2024),
        ],
        timing: range(w(39), w(40, 6)),
        route: "either",
        grade: grade("B"),
        notes:
          "Epilepsy is NOT an indication for cesarean delivery. Seizure risk during labor " +
          "is only 1-2%. Continue antiseizure medications during labor; use parenteral " +
          "alternatives if oral is not tolerated.",
      },
    ],
    pastFortyWeeks: "yes",
    clinicalNotes:
      "The 2024 AAN/AES/SMFM collaborative guideline focuses on antiseizure medication " +
      "selection but does not alter delivery timing. Epilepsy alone is not an indication " +
      "for early delivery or cesarean section. Seizure risk during labor is only 1-2%.",
    specialConsiderations: [
      {
        type: "medication_continuation",
        description:
          "Continue antiseizure medications throughout labor and delivery. If oral intake " +
          "is not possible, use parenteral alternatives (e.g., IV levetiracetam, IV phenytoin). " +
          "Monitor drug levels — pregnancy-related pharmacokinetic changes may require " +
          "dose adjustments.",
      },
      {
        type: "neonatal_consideration",
        description:
          "Some AEDs (valproate, carbamazepine, phenobarbital) carry teratogenic risk. " +
          "Vitamin K supplementation for the neonate if mother is on enzyme-inducing AEDs.",
      },
    ],
    riskData: [
      {
        outcome: "seizure frequency unchanged during pregnancy",
        statistic: { type: "incidence", valuePercent: 58 },
        populationDescription: "Women with epilepsy on AEDs",
        citation: cite("AAN", "AAN/AES/SMFM 2024 guideline", 2024),
      },
      {
        outcome: "major fetal malformation with AED exposure",
        statistic: { type: "incidence", valuePercent: 6 },
        populationDescription: "Fetuses exposed to antiepileptic drugs in utero (range 4-8% vs 2-3% baseline)",
        citation: cite("AAN", "AAN/AES/SMFM 2024 guideline", 2024),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    keyEvidenceSources: [],
    interactions: [],
  },
  {
    id: "intracranial_aneurysm_small",
    name: "Intracranial Aneurysm, unruptured <5 mm",
    category: "neurologic",
    tags: ["aneurysm", "intracranial", "cerebral aneurysm", "unruptured", "small"],
    guidelineRecommendations: [
      {
        citations: [cite("other", "Expert consensus")],
        timing: range(w(39), w(40, 6)),
        route: "vaginal_preferred",
        grade: grade("C"),
        notes: "Vaginal delivery with assisted second stage and BP control to minimize Valsalva.",
      },
    ],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "Small unruptured aneurysms (<5 mm) have low rupture risk during pregnancy. " +
      "Vaginal delivery is acceptable with assisted second stage to minimize " +
      "hemodynamic stress. Strict blood pressure control is essential.",
    specialConsiderations: [
      {
        type: "anesthesia_consideration",
        description:
          "Regional anesthesia preferred to blunt hemodynamic response. Assisted second " +
          "stage to minimize Valsalva. Strict BP control intrapartum.",
      },
    ],
    riskData: [
      {
        outcome: "aneurysmal rupture during pregnancy (all sizes)",
        statistic: { type: "absolute_risk", valuePer1000: 0.05 },
        populationDescription: "Incidental unruptured intracranial aneurysms in pregnancy; risk highest in third trimester",
        citation: cite("other", "Expert consensus"),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    keyEvidenceSources: [],
    interactions: [],
  },
  {
    id: "intracranial_aneurysm_large",
    name: "Intracranial Aneurysm ≥10 mm",
    category: "neurologic",
    tags: ["aneurysm", "intracranial", "cerebral aneurysm", "large", "giant"],
    guidelineRecommendations: [
      {
        citations: [cite("other", "Expert consensus")],
        timing: individualize(
          "Aneurysm size ≥10 mm with concern for rupture",
          "Symptomatic aneurysm (headache, cranial nerve palsy)",
          "Growth on serial imaging",
          "History of prior subarachnoid hemorrhage",
        ),
        route: "cesarean_preferred",
        grade: grade("C"),
        notes: "Cesarean strongly recommended to avoid hemodynamic stress of labor and Valsalva.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Large intracranial aneurysms (≥10 mm) carry significant rupture risk. Cesarean " +
      "delivery is strongly recommended to avoid the hemodynamic fluctuations and " +
      "increased intracranial pressure associated with labor and Valsalva maneuvers.",
    specialConsiderations: [
      {
        type: "anesthesia_consideration",
        description:
          "General anesthesia with controlled hemodynamics for cesarean. Avoid " +
          "hypertensive surges during intubation. Neurosurgery on standby.",
      },
      {
        type: "delivery_site_requirement",
        description: "Deliver at a center with neurosurgical and interventional neuroradiology capability.",
      },
    ],
    riskData: [
      {
        outcome: "rupture of large intracranial aneurysm during pregnancy",
        statistic: { type: "incidence", valuePercent: 3.5 },
        populationDescription: "Unruptured aneurysms ≥10 mm; risk elevated vs. non-pregnant state",
        citation: cite("other", "Expert consensus"),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    keyEvidenceSources: [],
    interactions: [],
  },
  {
    id: "avm_untreated",
    name: "AVM, untreated/inoperable",
    category: "neurologic",
    tags: ["AVM", "arteriovenous malformation", "cerebral", "vascular malformation"],
    guidelineRecommendations: [
      {
        citations: [cite("other", "Expert consensus")],
        timing: individualize(
          "Prior rupture (may deliver 32-35 wk)",
          "Symptomatic AVM with hemorrhage risk",
          "AVM size and location",
          "Neurologic deterioration",
        ),
        route: "cesarean_preferred",
        grade: grade("C"),
        notes: "Cesarean preferred for untreated AVMs. If ruptured, delivery often 32-35 weeks.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Untreated cerebral AVMs carry a hemorrhage risk that may be exacerbated by the " +
      "hemodynamic changes of pregnancy. If the AVM has ruptured during pregnancy, " +
      "delivery is often planned at 32-35 weeks after antenatal corticosteroids. " +
      "Cesarean is preferred to avoid labor-associated hemodynamic stress.",
    specialConsiderations: [
      {
        type: "delivery_site_requirement",
        description: "Deliver at a center with neurosurgical and interventional neuroradiology capability.",
      },
      {
        type: "anesthesia_consideration",
        description:
          "Avoid hemodynamic fluctuations. Regional anesthesia is generally acceptable " +
          "for cesarean; general anesthesia if emergent. Strict BP control.",
      },
    ],
    riskData: [
      {
        outcome: "intracranial hemorrhage from AVM during pregnancy",
        statistic: { type: "incidence", valuePercent: 5 },
        populationDescription: "Unruptured cerebral AVMs in pregnancy; annual rupture risk ~2-4%, higher during pregnancy",
        citation: cite("other", "Expert consensus"),
      },
      {
        outcome: "perinatal mortality with AVM rupture during pregnancy",
        statistic: { type: "mortality_rate", valuePercent: 28 },
        populationDescription: "Pregnancies complicated by intracranial AVM hemorrhage",
        citation: cite("other", "Expert consensus"),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    keyEvidenceSources: [],
    interactions: [],
  },
  {
    id: "brain_tumor_symptomatic",
    name: "Brain Tumor, symptomatic/high-grade",
    category: "neurologic",
    tags: ["brain tumor", "glioma", "CNS tumor", "high-grade", "symptomatic", "intracranial neoplasm"],
    guidelineRecommendations: [
      {
        citations: [cite("other", "MDPI review 2025")],
        timing: individualize(
          "Rapidly progressive neurologic symptoms",
          "Increasing intracranial pressure unresponsive to medical management",
          "Need for urgent oncologic treatment (radiation, surgery, chemotherapy)",
          "May deliver 27-32 wk for maternal treatment",
        ),
        route: "cesarean_preferred",
        grade: grade("C"),
        notes:
          "Delivery may be indicated as early as 27-32 weeks to allow definitive " +
          "oncologic treatment. Decision requires multidisciplinary input.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Symptomatic or high-grade brain tumors in pregnancy require balancing fetal " +
      "maturity against maternal neurologic deterioration and need for definitive " +
      "treatment. Delivery may be required as early as 27-32 weeks. Dexamethasone " +
      "for vasogenic edema is compatible with pregnancy and provides fetal lung " +
      "maturation benefit.",
    specialConsiderations: [
      {
        type: "delivery_site_requirement",
        description: "Deliver at a tertiary center with neurosurgery, neuro-oncology, and NICU.",
      },
      {
        type: "anesthesia_consideration",
        description:
          "Increased ICP is a relative contraindication to neuraxial anesthesia. " +
          "General anesthesia may be required. Coordinate with neuroanesthesia.",
      },
    ],
    riskData: [
      {
        outcome: "preterm delivery due to maternal neurologic deterioration",
        statistic: { type: "incidence", valuePercent: 45 },
        populationDescription: "Pregnancies with high-grade primary brain tumors requiring early delivery for oncologic treatment",
        citation: cite("other", "MDPI review 2025"),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    keyEvidenceSources: [],
    interactions: [],
  },
  {
    id: "brain_tumor_low_grade",
    name: "Brain Tumor, low-grade asymptomatic",
    category: "neurologic",
    tags: ["brain tumor", "low-grade", "asymptomatic", "meningioma", "CNS tumor"],
    guidelineRecommendations: [
      {
        citations: [cite("other", "Expert consensus")],
        timing: range(w(39), w(40, 6)),
        route: "either",
        grade: grade("C"),
        notes: "Term delivery; individualize mode based on ICP considerations and tumor location.",
      },
    ],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "Low-grade, asymptomatic brain tumors (e.g., incidental meningiomas, low-grade gliomas) " +
      "generally do not require alteration of delivery timing. Serial neurologic assessment " +
      "and imaging surveillance during pregnancy are recommended.",
    specialConsiderations: [
      {
        type: "monitoring_requirement",
        description:
          "Serial neurologic exams. MRI without gadolinium if imaging needed during pregnancy. " +
          "Assess for new symptoms that could indicate tumor growth or edema.",
      },
    ],
    riskData: [
      {
        outcome: "new or worsening neurologic symptoms during pregnancy",
        statistic: { type: "incidence", valuePercent: 12 },
        populationDescription: "Women with incidental low-grade CNS tumors (e.g., meningiomas) in pregnancy; physiologic fluid shifts may cause transient symptoms",
        citation: cite("other", "Expert consensus"),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    keyEvidenceSources: [],
    interactions: [],
  },
  {
    id: "chiari_malformation_type_i",
    name: "Chiari Malformation Type I",
    category: "neurologic",
    tags: ["Chiari", "Chiari malformation", "Arnold-Chiari", "hindbrain herniation"],
    guidelineRecommendations: [
      {
        citations: [cite("other", "Expert consensus")],
        timing: range(w(39), w(40, 6)),
        route: "individualize",
        grade: grade("C"),
        notes:
          "Term delivery. Mode individualized — cesarean if symptomatic or concern for " +
          "raised ICP. Valsalva may be contraindicated in some cases.",
      },
    ],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "Chiari malformation type I involves cerebellar tonsillar herniation through the " +
      "foramen magnum. Asymptomatic patients can deliver vaginally. Symptomatic patients " +
      "or those with syringomyelia or raised ICP may benefit from cesarean to avoid " +
      "Valsalva-related pressure changes.",
    specialConsiderations: [
      {
        type: "anesthesia_consideration",
        description:
          "Neuraxial anesthesia is generally safe in Chiari I but requires careful " +
          "assessment. CSF leak from dural puncture may worsen symptoms. Spinal " +
          "anesthesia may be relatively contraindicated if significant syringomyelia present.",
      },
    ],
    riskData: [
      {
        outcome: "symptomatic progression of Chiari I during pregnancy",
        statistic: { type: "incidence", valuePercent: 15 },
        populationDescription: "Women with known Chiari I malformation during pregnancy; headache and worsening symptoms are the most common presentations",
        citation: cite("other", "Expert consensus"),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    keyEvidenceSources: [],
    interactions: [],
  },
  {
    id: "spinal_cord_injury_high",
    name: "Spinal Cord Injury (lesion ≥T6)",
    category: "neurologic",
    tags: [
      "spinal cord injury", "SCI", "paraplegia", "quadriplegia", "tetraplegia",
      "autonomic dysreflexia",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("other", "Expert consensus")],
        timing: range(w(36), w(38, 6)),
        route: "either",
        grade: grade("C"),
        notes:
          "May plan delivery at 36-38 weeks to avoid unattended labor with autonomic " +
          "dysreflexia. Epidural strongly recommended to prevent dysreflexia.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Patients with spinal cord injury at or above T6 face significant risk of autonomic " +
      "dysreflexia during labor — a potentially life-threatening hypertensive crisis " +
      "triggered by visceral stimulation below the level of injury. Patients may not " +
      "perceive labor contractions. Some centers plan delivery at 36-38 weeks to avoid " +
      "unattended labor.",
    specialConsiderations: [
      {
        type: "anesthesia_consideration",
        description:
          "Epidural anesthesia is the most effective prevention of autonomic dysreflexia. " +
          "Place early in labor. Arterial line monitoring recommended. If dysreflexia " +
          "occurs: sit patient upright, remove stimulating source, treat with rapid-onset " +
          "antihypertensives (nifedipine, nitropaste).",
      },
      {
        type: "monitoring_requirement",
        description:
          "Patients may not perceive contractions — home uterine monitoring or frequent " +
          "cervical checks from 28-32 weeks. Educate patient on signs of preterm labor " +
          "they may detect (abdominal tightness, spasticity changes, autonomic symptoms).",
      },
      {
        type: "other",
        description:
          "Higher risk of pressure injuries, DVT, and UTI during labor and postpartum. " +
          "DVT prophylaxis, position changes, and urinary catheter management are essential.",
      },
    ],
    riskData: [
      {
        outcome: "autonomic dysreflexia during labor",
        statistic: { type: "incidence", valuePercent: 85 },
        populationDescription: "Women with SCI at or above T6 during labor (without epidural anesthesia)",
        citation: cite("other", "Expert consensus"),
      },
      {
        outcome: "preterm birth",
        statistic: { type: "incidence", valuePercent: 25 },
        populationDescription: "Pregnancies in women with spinal cord injury",
        citation: cite("other", "Expert consensus"),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    keyEvidenceSources: [],
    interactions: [],
  },
  {
    id: "history_of_stroke",
    name: "History of Stroke",
    category: "neurologic",
    tags: ["stroke", "CVA", "cerebrovascular accident", "TIA", "ischemic stroke", "hemorrhagic stroke"],
    guidelineRecommendations: [
      {
        citations: [cite("other", "Expert consensus")],
        timing: range(w(39), w(40, 6)),
        route: "either",
        grade: grade("C"),
        notes: "Term delivery unless ongoing vascular risk necessitates earlier timing.",
      },
    ],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "A history of stroke does not independently mandate early delivery or cesarean. " +
      "Management depends on the underlying etiology (e.g., APS, carotid dissection, " +
      "cardiac source, moyamoya). Anticoagulation or antiplatelet therapy decisions " +
      "should be individualized based on stroke etiology.",
    specialConsiderations: [
      {
        type: "monitoring_requirement",
        description:
          "Evaluate and manage underlying stroke etiology. Blood pressure control is " +
          "essential. Consider neurology and MFM co-management.",
      },
    ],
    riskData: [
      {
        outcome: "recurrent stroke during pregnancy",
        statistic: { type: "absolute_risk", valuePer1000: 8 },
        populationDescription: "Women with prior ischemic stroke in pregnancy; risk is highest if etiology is ongoing (APS, atrial fibrillation, arterial dissection)",
        citation: cite("other", "Expert consensus"),
      },
      {
        outcome: "preeclampsia",
        statistic: { type: "relative_risk", value: 2.1 },
        populationDescription: "Women with prior stroke vs. no prior stroke (shared vascular risk factors)",
        citation: cite("other", "Expert consensus"),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    keyEvidenceSources: [],
    interactions: [],
  },
  {
    id: "multiple_sclerosis_neuro",
    name: "Multiple Sclerosis",
    category: "neurologic",
    tags: ["multiple sclerosis", "MS", "demyelinating", "neurologic"],
    guidelineRecommendations: [
      {
        citations: [cite("AAN", "Practice guideline", 2019)],
        timing: range(w(39), w(40, 6)),
        route: "either",
        grade: grade("C"),
        notes:
          "MS does not influence delivery timing or mode. Relapse rate decreases in " +
          "pregnancy (especially 3rd trimester) but increases postpartum.",
      },
    ],
    pastFortyWeeks: "yes",
    clinicalNotes:
      "MS does not alter delivery timing or mode. Relapse rate decreases during pregnancy " +
      "but increases in the first 3-6 months postpartum. Disease-modifying therapies " +
      "should be reviewed preconception. Epidural and spinal anesthesia are safe in MS.",
    specialConsiderations: [
      {
        type: "anesthesia_consideration",
        description:
          "Epidural and spinal anesthesia are safe in MS. Historical concerns about " +
          "neuraxial anesthesia worsening MS are unfounded.",
      },
      {
        type: "postpartum_management",
        description:
          "Postpartum relapse risk is increased (20-40% in first 3 months). Plan " +
          "resumption of disease-modifying therapy. Discuss breastfeeding compatibility.",
      },
    ],
    riskData: [
      {
        outcome: "relapse rate reduction in third trimester",
        statistic: { type: "relative_risk", value: 0.3 },
        populationDescription: "Women with MS in third trimester vs pre-pregnancy rate (70% reduction)",
        citation: cite("AAN", "Practice guideline", 2019),
      },
      {
        outcome: "postpartum relapse in first 3 months",
        statistic: { type: "incidence", valuePercent: 30 },
        populationDescription: "Women with MS in first 3 months postpartum (range 20-40%)",
        citation: cite("AAN", "Practice guideline", 2019),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    keyEvidenceSources: [],
    interactions: [],
  },
];
