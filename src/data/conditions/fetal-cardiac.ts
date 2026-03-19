import type { ObstetricCondition } from "../types";
import { w, range, individualize, cite, grade } from "../helpers";

export const fetalCardiacConditions: ObstetricCondition[] = [
  {
    id: "fetal_chd_ductal_dependent",
    name: "Fetal CHD — Ductal-Dependent Lesions (HLHS, TGA, Critical PS/AS, TAPVR)",
    category: "fetal_cardiac",
    tags: [
      "CHD",
      "congenital heart disease",
      "HLHS",
      "hypoplastic left heart",
      "TGA",
      "transposition",
      "critical pulmonary stenosis",
      "critical aortic stenosis",
      "TAPVR",
      "total anomalous pulmonary venous return",
      "ductal-dependent",
      "fetal cardiac",
    ],
    guidelineRecommendations: [
      {
        citations: [
          cite("AHA", "Scientific Statement", 2017),
          cite("other", "UCfC SCAMP protocol"),
        ],
        timing: range(w(39), w(41, 6)),
        route: "vaginal_preferred",
        grade: grade("B"),
        notes:
          "Deliver at >=39w0d. UCfC SCAMP protocol: each additional week of gestation " +
          "decreases neonatal hospital length of stay by ~12%. No evidence that early " +
          "delivery improves outcomes for ductal-dependent lesions.",
      },
    ],
    pastFortyWeeks: "yes",
    clinicalNotes:
      "Most fetal congenital heart defects that are ductal-dependent (HLHS, TGA, critical " +
      "PS, critical AS, TAPVR) should be delivered at or after 39 weeks. There is no " +
      "evidence that early delivery improves outcomes. Delivery should occur at a center " +
      "with pediatric cardiology and cardiac surgery.",
    physiologyExplanation:
      "Ductal-dependent lesions rely on the ductus arteriosus for postnatal circulatory " +
      "support until surgical repair. Prostaglandin E1 maintains ductal patency after birth. " +
      "Additional weeks of gestation improve pulmonary maturity and overall neonatal " +
      "resilience, reducing hospital stay and complications after cardiac surgery.",
    specialConsiderations: [
      {
        type: "delivery_site_requirement",
        description:
          "Delivery must occur at a center with pediatric cardiology, cardiac surgery, " +
          "and neonatal ICU capability.",
      },
      {
        type: "neonatal_consideration",
        description:
          "Prostaglandin E1 infusion should be available immediately after birth for " +
          "ductal-dependent lesions. Echocardiography confirmation upon delivery.",
      },
    ],
    riskData: [
      {
        outcome: "neonatal mortality without surgical intervention",
        statistic: { type: "mortality_rate", valuePercent: 95 },
        populationDescription: "Untreated HLHS within first weeks of life",
        citation: cite("other", "Feinstein et al., Circulation 2012", 2012),
      },
      {
        outcome: "5-year survival after staged palliation (Norwood pathway)",
        statistic: { type: "incidence", valuePercent: 70 },
        populationDescription: "HLHS infants undergoing staged surgical palliation",
        citation: cite("other", "Ohye et al., NEJM 2010", 2010),
      },
      {
        outcome: "hospital length of stay reduction per additional week of gestation",
        statistic: { type: "incidence", valuePercent: 12 },
        populationDescription: "Ductal-dependent CHD neonates at tertiary cardiac centers",
        citation: cite("other", "UCfC SCAMP protocol"),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "fetal_complete_heart_block",
    name: "Fetal Complete Heart Block",
    category: "fetal_cardiac",
    tags: [
      "heart block",
      "complete heart block",
      "CHB",
      "third-degree",
      "bradycardia",
      "fetal arrhythmia",
      "neonatal lupus",
      "anti-SSA",
      "anti-Ro",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("other", "Expert consensus")],
        timing: individualize(
          "Ventricular rate <55 bpm",
          "Hydrops or declining fetal status",
          "Often delivered at 36-37 weeks if ventricular rate <55 bpm",
        ),
        route: "either",
        grade: grade("C"),
        notes:
          "Timing individualized based on ventricular rate and fetal status. " +
          "Coordinate with pediatric cardiology. Often 36-37 weeks if rate <55 bpm.",
      },
    ],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "Fetal complete heart block is most commonly associated with maternal anti-SSA/Ro " +
      "antibodies (neonatal lupus). Ventricular rate <55 bpm is associated with increased " +
      "risk of hydrops and fetal demise. Delivery timing is individualized in coordination " +
      "with pediatric cardiology.",
    specialConsiderations: [
      {
        type: "monitoring_requirement",
        description:
          "Serial fetal echocardiography to monitor ventricular rate, function, and hydrops. " +
          "Consider dexamethasone for incomplete block in anti-SSA-positive patients.",
      },
      {
        type: "neonatal_consideration",
        description:
          "Postnatal pacing may be required if ventricular rate remains critically low.",
      },
    ],
    riskData: [
      {
        outcome: "fetal/neonatal mortality (ventricular rate <55 bpm)",
        statistic: { type: "mortality_rate", valuePercent: 20 },
        populationDescription: "Fetal complete heart block with ventricular rate <55 bpm",
        citation: cite("other", "Jaeggi et al., JACC 2011", 2011),
      },
      {
        outcome: "hydrops development",
        statistic: { type: "incidence", valuePercent: 25 },
        populationDescription: "Fetuses with complete heart block and ventricular rate <55 bpm",
        citation: cite("other", "Jaeggi & Nii, Heart 2005", 2005),
      },
      {
        outcome: "anti-SSA/Ro antibody association",
        statistic: { type: "incidence", valuePercent: 85 },
        populationDescription: "Fetuses with isolated complete heart block",
        citation: cite("other", "Izmirly et al., Arthritis Rheum 2010", 2010),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "fetal_svt_controlled",
    name: "Fetal SVT (Controlled)",
    category: "fetal_cardiac",
    tags: [
      "SVT",
      "supraventricular tachycardia",
      "fetal tachycardia",
      "fetal arrhythmia",
      "flecainide",
      "digoxin",
      "sotalol",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("other", "Expert consensus")],
        timing: range(w(39), w(41, 6)),
        route: "either",
        grade: grade("C"),
        notes: "Term delivery when SVT is controlled with antiarrhythmic therapy.",
      },
    ],
    pastFortyWeeks: "yes",
    clinicalNotes:
      "Fetal SVT that is controlled with maternal antiarrhythmic therapy (digoxin, " +
      "flecainide, sotalol) can be delivered at term. Uncontrolled SVT with hydrops " +
      "requires individualized earlier delivery.",
    specialConsiderations: [
      {
        type: "monitoring_requirement",
        description:
          "Ongoing fetal heart rate monitoring to confirm continued SVT control. " +
          "Watch for recurrence or development of hydrops.",
      },
      {
        type: "medication_continuation",
        description:
          "Maternal antiarrhythmic therapy should continue through delivery. " +
          "Neonatal cardiology evaluation after birth.",
      },
    ],
    riskData: [
      {
        outcome: "progression to hydrops fetalis (uncontrolled SVT)",
        statistic: { type: "incidence", valuePercent: 40 },
        populationDescription: "Fetuses with SVT without treatment or in hydrops",
        citation: cite("other", "Krapp et al., Ultrasound Obstet Gynecol 2003", 2003),
      },
      {
        outcome: "conversion to sinus rhythm with transplacental therapy",
        statistic: { type: "incidence", valuePercent: 80 },
        populationDescription: "Non-hydropic fetal SVT treated with digoxin or flecainide",
        citation: cite("other", "Jaeggi et al., Circulation 2011", 2011),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
];
