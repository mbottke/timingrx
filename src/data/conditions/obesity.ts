import type { ObstetricCondition } from "../types";
import { w, range, individualize, cite, grade } from "../helpers";
import { arriveTrial, flenadyMeta } from "../trials";

export const obesityConditions: ObstetricCondition[] = [
  {
    id: "obesity",
    name: "Obesity in Pregnancy",
    category: "obesity",
    tags: ["obesity", "BMI", "overweight", "morbid obesity", "class III", "bariatric"],
    stratificationAxis: "BMI class (I, II, III, super morbid)",
    guidelineRecommendations: [],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "ACOG Practice Bulletin 230 (2021) explicitly states: 'Maternal obesity alone is not an " +
      "indication for induction of labor.' However, BMI >=40 carries approximately a 3-fold " +
      "increased stillbirth risk versus normal BMI, particularly after 39 weeks. The ARRIVE " +
      "trial included obese women and found induction at 39 weeks reduced cesarean rates, " +
      "supporting discussion of 39-week induction for Class III obesity.",
    physiologyExplanation:
      "Obesity in pregnancy is associated with chronic low-grade inflammation, insulin " +
      "resistance, and endothelial dysfunction that impair placental function. Increased " +
      "adiposity elevates circulating inflammatory cytokines (TNF-alpha, IL-6) and reduces " +
      "adiponectin, contributing to placental vascular insufficiency. The mechanism underlying " +
      "increased stillbirth risk at term is incompletely understood but may relate to " +
      "subclinical placental dysfunction and difficulty detecting fetal compromise with " +
      "increased abdominal adiposity.",
    specialConsiderations: [
      {
        type: "anesthesia_consideration",
        description:
          "Early anesthesia consultation for BMI >=40. Epidural placement may be technically " +
          "difficult; consider early placement. Increased risk of failed intubation with general " +
          "anesthesia.",
      },
      {
        type: "surgical_planning",
        description:
          "For BMI >=50 undergoing cesarean, consider vertical skin incision, additional " +
          "surgical assistance, and specialized equipment (extended instruments, appropriate " +
          "OR table weight capacity).",
      },
    ],
    riskData: [
      {
        outcome: "stillbirth (BMI >=40 vs normal BMI)",
        statistic: { type: "relative_risk", value: 3.0 },
        populationDescription: "Women with BMI >=40 compared to normal BMI, particularly after 39 weeks",
        citation: cite("ACOG", "PB 230", 2021),
      },
    ],
    riskModifiers: [
      {
        factor: "bmi",
        effect:
          "Risk of stillbirth, preeclampsia, GDM, and cesarean increases progressively with " +
          "BMI class. Class III (>=40) carries highest absolute risk.",
      },
    ],
    landmarkTrials: [
      {
        id: "arrive-2018",
        name: "ARRIVE Trial",
        year: 2018,
        journalCitation: "NEJM 2018;379:513-523",
        sampleSize: 6106,
        summary:
          "Induction of labor at 39 weeks in low-risk nulliparous women (including obese women) " +
          "reduced cesarean delivery rate compared to expectant management, without increasing " +
          "adverse perinatal outcomes.",
        keyFindings: [
          "Cesarean rate: 18.6% (induction) vs 22.2% (expectant), RR 0.84 (95% CI 0.76-0.93)",
          "No increase in composite adverse perinatal outcome",
          "Included obese women, supporting discussion of 39w induction for Class III obesity",
          "Hypertensive disorders: 9.1% vs 14.1% (P<0.001)",
        ],
      },
    ],
    interactions: [],
    subVariants: [
      {
        id: "obesity_class_i",
        name: "BMI 30-34.9 (Class I Obesity)",
        category: "obesity",
        tags: ["obesity", "BMI 30", "class I", "mild obesity"],
        parentConditionId: "obesity",
        guidelineRecommendations: [
          {
            citations: [cite("ACOG", "PB 230", 2021)],
            timing: range(w(39), w(41)),
            route: "either",
            grade: grade("C"),
            notes: "No altered timing. Standard obstetric management.",
          },
        ],
        pastFortyWeeks: "yes",
        clinicalNotes: "Class I obesity alone does not alter delivery timing.",
        specialConsiderations: [],
        riskData: [
          {
            outcome: "gestational diabetes mellitus with BMI 30-34.9",
            statistic: { type: "odds_ratio", value: 2.14, ci95: [1.82, 2.53] },
            populationDescription: "Class I obesity (BMI 30-34.9) vs normal BMI women in pregnancy (systematic review)",
            citation: cite("other", "Chu et al., Diabetes Care 2007", 2007),
          },
          {
            outcome: "cesarean delivery with Class I obesity",
            statistic: { type: "odds_ratio", value: 1.46, ci95: [1.34, 1.60] },
            populationDescription: "BMI 30-34.9 vs normal BMI at delivery (meta-analysis)",
            citation: cite("other", "Chu et al., PLoS Med 2007", 2007),
          },
        ],
        riskModifiers: [],
        landmarkTrials: [],
        interactions: [],
      },
      {
        id: "obesity_class_ii",
        name: "BMI 35-39.9 (Class II Obesity)",
        category: "obesity",
        tags: ["obesity", "BMI 35", "class II"],
        parentConditionId: "obesity",
        guidelineRecommendations: [
          {
            citations: [cite("ACOG", "PB 230", 2021)],
            timing: range(w(39), w(41)),
            route: "either",
            grade: grade("C"),
            notes:
              "No altered timing. Antenatal surveillance may begin at 37 weeks based on " +
              "institutional protocol.",
          },
        ],
        pastFortyWeeks: "case_by_case",
        clinicalNotes:
          "Class II obesity alone does not mandate early delivery. Some institutions begin " +
          "antenatal surveillance at 37 weeks.",
        specialConsiderations: [
          {
            type: "monitoring_requirement",
            description: "Antenatal surveillance may begin at 37 weeks per institutional protocol.",
          },
        ],
        riskData: [
          {
            outcome: "preeclampsia with BMI 35-39.9",
            statistic: { type: "odds_ratio", value: 3.10, ci95: [2.24, 4.28] },
            populationDescription: "Class II obesity (BMI 35-39.9) vs normal BMI in pregnancy (meta-analysis)",
            citation: cite("other", "O'Brien et al., Epidemiology 2003", 2003),
          },
          {
            outcome: "gestational hypertension with BMI 35-39.9",
            statistic: { type: "odds_ratio", value: 2.60, ci95: [2.03, 3.34] },
            populationDescription: "Class II obesity vs normal BMI in pregnancy (meta-analysis)",
            citation: cite("other", "O'Brien et al., Epidemiology 2003", 2003),
          },
        ],
        riskModifiers: [],
        landmarkTrials: [],
        interactions: [],
      },
      {
        id: "obesity_class_iii",
        name: "BMI >=40 (Class III Obesity)",
        category: "obesity",
        tags: ["obesity", "BMI 40", "class III", "morbid obesity"],
        parentConditionId: "obesity",
        guidelineRecommendations: [
          {
            citations: [cite("ACOG", "PB 230", 2021)],
            timing: range(w(39), w(39, 6)),
            route: "either",
            grade: grade("C"),
            notes:
              "No formal recommendation for early delivery. ACOG PB 230: 'not an indication for " +
              "induction alone.' However, some institutions offer 39-week induction given ~3-fold " +
              "increased stillbirth risk after 39 weeks. ARRIVE trial data supports discussion " +
              "of 39-week induction.",
          },
        ],
        pastFortyWeeks: "borderline",
        clinicalNotes:
          "ACOG PB 230 states obesity is 'not an indication for induction alone,' but the " +
          "approximately 3-fold increased stillbirth risk at BMI >=40, particularly after 39 weeks, " +
          "leads many institutions to offer 39-week induction. The ARRIVE trial included obese " +
          "women and demonstrated reduced cesarean rates with 39-week induction, supporting this " +
          "discussion for Class III obesity.",
        specialConsiderations: [
          {
            type: "monitoring_requirement",
            description:
              "Weekly antenatal surveillance may be considered starting at 34 weeks for BMI >=40.",
          },
          {
            type: "anesthesia_consideration",
            description: "Early anesthesia consultation recommended. Consider early epidural placement.",
          },
        ],
        riskData: [
          {
            outcome: "stillbirth with BMI >=40 vs normal BMI",
            statistic: { type: "relative_risk", value: 3.0 },
            populationDescription: "Class III obesity (BMI >=40) vs normal BMI, particularly after 39 weeks",
            citation: cite("ACOG", "PB 230", 2021),
          },
          {
            outcome: "cesarean delivery with BMI >=40",
            statistic: { type: "odds_ratio", value: 2.89, ci95: [2.06, 4.05] },
            populationDescription: "Class III obesity (BMI >=40) vs normal BMI at delivery (meta-analysis)",
            citation: cite("other", "Chu et al., PLoS Med 2007", 2007),
          },
          {
            outcome: "maternal ICU admission with Class III obesity",
            statistic: { type: "odds_ratio", value: 1.87, ci95: [1.34, 2.60] },
            populationDescription: "BMI >=40 vs normal BMI at delivery (population-based cohort)",
            citation: cite("other", "Mhyre et al., Anesthesiology 2011", 2011),
          },
        ],
        riskModifiers: [],
        landmarkTrials: [arriveTrial, flenadyMeta],
        interactions: [],
      },
      {
        id: "obesity_super_morbid",
        name: "BMI >=50 (Super Morbid Obesity)",
        category: "obesity",
        tags: ["obesity", "BMI 50", "super morbid", "super obese"],
        parentConditionId: "obesity",
        guidelineRecommendations: [
          {
            citations: [cite("other", "Expert consensus", 2023)],
            timing: individualize(
              "Shared decision-making regarding 39-week induction",
              "Anesthesia and surgical planning considerations",
              "Multidisciplinary team coordination",
            ),
            route: "either",
            grade: grade("C"),
            notes:
              "Individualize with shared decision-making. Many experts favor 39-week induction " +
              "given compounded stillbirth risk. Requires multidisciplinary planning for delivery.",
          },
        ],
        pastFortyWeeks: "no",
        clinicalNotes:
          "Super morbid obesity (BMI >=50) requires individualized delivery planning with " +
          "shared decision-making. The stillbirth risk is further elevated compared to Class III " +
          "obesity. Multidisciplinary coordination including anesthesia, nursing, and surgical " +
          "planning is essential.",
        specialConsiderations: [
          {
            type: "anesthesia_consideration",
            description:
              "Mandatory early anesthesia consultation. May require ultrasound-guided epidural " +
              "placement. Higher risk of failed regional and general anesthesia.",
          },
          {
            type: "surgical_planning",
            description:
              "If cesarean is needed: consider vertical skin incision, extended surgical " +
              "instruments, appropriate OR table (weight capacity), additional surgical assistance, " +
              "and VTE prophylaxis with weight-based dosing.",
          },
          {
            type: "monitoring_requirement",
            description:
              "External fetal monitoring may be technically limited. Consider internal monitoring " +
              "if labor. Weekly antenatal surveillance from 34 weeks.",
          },
        ],
        riskData: [
          {
            outcome: "wound complication (dehiscence or infection) after cesarean with BMI >=50",
            statistic: { type: "incidence", valuePercent: 25 },
            populationDescription: "Super morbid obesity (BMI >=50) undergoing cesarean delivery (case series)",
            citation: cite("other", "Wolfe et al., Am J Obstet Gynecol 2011", 2011),
          },
          {
            outcome: "venous thromboembolism (VTE) with BMI >=50 in pregnancy",
            statistic: { type: "odds_ratio", value: 4.65, ci95: [2.31, 9.36] },
            populationDescription: "BMI >=50 vs normal BMI in pregnancy (population-based case-control study)",
            citation: cite("other", "Larsen et al., Thromb Haemost 2007", 2007),
          },
        ],
        riskModifiers: [],
        landmarkTrials: [arriveTrial, flenadyMeta],
        interactions: [],
      },
    ],
  },
];
