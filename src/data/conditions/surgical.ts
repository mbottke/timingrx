import type { ObstetricCondition } from "../types";
import { w, range, individualize, cite, grade } from "../helpers";

export const surgicalConditions: ObstetricCondition[] = [
  {
    id: "post_bariatric_surgery",
    name: "Post-Bariatric Surgery",
    category: "surgical",
    tags: [
      "bariatric", "gastric bypass", "sleeve gastrectomy", "Roux-en-Y",
      "lap band", "weight loss surgery",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "PB 105")],
        timing: range(w(39), w(40, 6)),
        route: "either",
        grade: grade("C"),
        notes: "Term delivery. Bariatric surgery is NOT an indication for cesarean.",
      },
    ],
    pastFortyWeeks: "yes",
    clinicalNotes:
      "Post-bariatric surgery does not alter delivery timing or mandate cesarean. " +
      "ACOG recommends waiting 12-24 months after surgery before conceiving. " +
      "Alternative gestational diabetes testing (avoiding glucose load) should " +
      "be considered for malabsorptive procedures. Nutritional deficiency screening " +
      "(iron, B12, folate, vitamin D, calcium) is essential at start of pregnancy.",
    specialConsiderations: [
      {
        type: "monitoring_requirement",
        description:
          "Nutritional deficiency screening (iron, B12, folate, vitamin D, calcium) " +
          "at start of pregnancy and each trimester.",
      },
      {
        type: "other",
        description:
          "Alternative GDM screening may be needed for malabsorptive procedures " +
          "(avoid standard glucose load test due to dumping syndrome risk).",
      },
    ],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "cervical_cancer_in_pregnancy",
    name: "Cervical Cancer in Pregnancy",
    category: "surgical",
    tags: ["cervical cancer", "cervical carcinoma", "cancer in pregnancy", "gynecologic cancer"],
    guidelineRecommendations: [
      {
        citations: [cite("other", "Expert consensus")],
        timing: individualize(
          "Stage of disease at diagnosis",
          "Gestational age at diagnosis",
          "Tumor progression during pregnancy",
          "Patient goals regarding pregnancy continuation",
        ),
        route: "cesarean_preferred",
        grade: grade("C"),
        notes:
          "Individualize by stage and GA at diagnosis. Often cesarean " +
          "(classical incision if bulky tumor).",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Cervical cancer management in pregnancy depends on stage, GA at diagnosis, " +
      "and tumor progression. Early-stage disease may allow pregnancy continuation " +
      "to near-term. Cesarean delivery is often preferred, with classical incision " +
      "for bulky cervical tumors.",
    specialConsiderations: [
      {
        type: "surgical_planning",
        description:
          "Multidisciplinary team: MFM, gynecologic oncology. Classical cesarean " +
          "incision may be needed for bulky cervical tumors.",
      },
    ],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "breast_cancer_on_chemo",
    name: "Breast Cancer on Chemotherapy",
    category: "surgical",
    tags: ["breast cancer", "chemotherapy", "cancer in pregnancy", "oncology"],
    guidelineRecommendations: [
      {
        citations: [cite("NCCN", "Breast cancer guidelines"), cite("other", "Expert consensus")],
        timing: individualize(
          "Delivery >=3 weeks after last chemotherapy cycle",
          "Allow bone marrow recovery before delivery",
          "Coordinate with oncology team",
        ),
        route: "either",
        grade: grade("C"),
        notes:
          "Delivery at least 3 weeks after last chemotherapy cycle to allow " +
          "bone marrow recovery and reduce neonatal/maternal myelosuppression risk.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Delivery should be timed at least 3 weeks after the last chemotherapy cycle " +
      "to allow maternal and fetal bone marrow recovery. Chemotherapy is generally " +
      "avoided after 35 weeks to allow adequate recovery time before delivery.",
    specialConsiderations: [
      {
        type: "medication_adjustment",
        description:
          "Last chemotherapy cycle should be completed by ~35 weeks to allow " +
          ">=3 weeks of marrow recovery before delivery.",
      },
      {
        type: "neonatal_consideration",
        description:
          "Neonatal CBC at delivery to assess for myelosuppression if chemotherapy " +
          "was administered within 3-4 weeks of delivery.",
      },
    ],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "post_appendectomy_in_pregnancy",
    name: "Post-Appendectomy during Pregnancy",
    category: "surgical",
    tags: ["appendectomy", "appendicitis", "surgical abdomen", "post-operative"],
    guidelineRecommendations: [
      {
        citations: [cite("other", "Expert consensus")],
        timing: range(w(39), w(40, 6)),
        route: "either",
        grade: grade("C"),
        notes: "Standard timing. Appendectomy during pregnancy does not alter delivery planning.",
      },
    ],
    pastFortyWeeks: "yes",
    clinicalNotes:
      "Appendectomy during pregnancy does not alter subsequent delivery timing. " +
      "Standard obstetric management applies after recovery from surgery.",
    specialConsiderations: [],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
];
