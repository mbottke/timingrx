import type { ObstetricCondition } from "../types";
import { w, range, individualize, cite, grade } from "../helpers";

export const substancePsychiatricConditions: ObstetricCondition[] = [
  {
    id: "oud_mat",
    name: "Opioid Use Disorder on MAT (Methadone/Buprenorphine)",
    category: "substance_use_psychiatric",
    tags: ["opioid", "OUD", "MAT", "methadone", "buprenorphine", "Subutex", "Suboxone", "MOUD"],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "CO 711", 2017), cite("SAMHSA", "MAT guidelines", 2021)],
        timing: range(w(39), w(40, 6)),
        route: "either",
        grade: grade("C"),
        notes:
          "Term delivery. No specific early delivery indicated. MAT is not an indication for " +
          "cesarean. Continue MAT through delivery and postpartum.",
      },
    ],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "ACOG explicitly states that MAT (methadone or buprenorphine) should be continued " +
      "through delivery and the postpartum period. Delivery timing is not altered by MAT, " +
      "and MAT is not an indication for cesarean delivery. Neonatal abstinence syndrome (NAS) " +
      "monitoring is standard.",
    specialConsiderations: [
      {
        type: "medication_continuation",
        description:
          "Continue methadone or buprenorphine through labor and delivery at the usual dose. " +
          "Do not taper or discontinue peripartum. Provide adequate pain management; opioid " +
          "requirements may be higher due to tolerance.",
        citation: cite("ACOG", "CO 711", 2017),
      },
      {
        type: "neonatal_consideration",
        description:
          "Monitor neonate for neonatal abstinence syndrome (NAS) for at least 4-7 days. " +
          "Breastfeeding is encouraged if mother is stable on MAT and not using illicit substances.",
      },
    ],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "active_alcohol_use",
    name: "Active Alcohol Use Disorder",
    category: "substance_use_psychiatric",
    tags: ["alcohol", "alcohol use disorder", "AUD", "FASD", "fetal alcohol"],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "alcohol guidance", 2023)],
        timing: range(w(39), w(40, 6)),
        route: "either",
        grade: grade("C"),
        notes: "Term unless complications (FGR, preterm labor). No specific early delivery for alcohol use alone.",
      },
    ],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "Active alcohol use alone does not mandate early delivery. Delivery timing is altered " +
      "only if complications develop (FGR, placental abruption, preterm labor). Screening and " +
      "brief intervention should be offered throughout pregnancy.",
    specialConsiderations: [],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "methamphetamine_use",
    name: "Methamphetamine Use",
    category: "substance_use_psychiatric",
    tags: ["methamphetamine", "meth", "stimulant", "amphetamine"],
    guidelineRecommendations: [
      {
        citations: [cite("other", "Expert consensus", 2023)],
        timing: range(w(39), w(40, 6)),
        route: "either",
        grade: grade("C"),
        notes: "Term unless complications. Monitor for HTN, abruption, FGR.",
      },
    ],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "Methamphetamine use does not independently alter delivery timing. Complications " +
      "including hypertension, placental abruption, and FGR may necessitate earlier delivery " +
      "based on the specific complication.",
    specialConsiderations: [
      {
        type: "monitoring_requirement",
        description:
          "Serial growth ultrasound for FGR. Monitor for hypertension and placental abruption. " +
          "Urine drug screening as clinically indicated.",
      },
    ],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "tobacco_use",
    name: "Tobacco Use in Pregnancy",
    category: "substance_use_psychiatric",
    tags: ["tobacco", "smoking", "nicotine", "cigarette"],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "tobacco guidance", 2023)],
        timing: range(w(39), w(40, 6)),
        route: "either",
        grade: grade("C"),
        notes: "Term unless complications (FGR, abruption). Tobacco use alone is not an indication for early delivery.",
      },
    ],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "Tobacco use does not independently mandate early delivery. Complications associated " +
      "with smoking (FGR, placental abruption, preterm labor) may necessitate earlier delivery " +
      "based on the specific complication. Smoking cessation counseling and pharmacotherapy " +
      "(NRT) should be offered.",
    specialConsiderations: [
      {
        type: "monitoring_requirement",
        description:
          "Serial growth ultrasound from 28 weeks for FGR surveillance in heavy smokers. " +
          "Monitor for abruption symptoms.",
      },
    ],
    riskData: [],
    riskModifiers: [
      {
        factor: "smoking",
        effect:
          "Smoking increases FGR risk (OR 2.0-2.5) and abruption risk (OR 1.5-2.5), " +
          "which may independently trigger earlier delivery.",
      },
    ],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "on_lithium",
    name: "On Lithium",
    category: "substance_use_psychiatric",
    tags: ["lithium", "bipolar", "mood stabilizer", "psychiatric"],
    guidelineRecommendations: [
      {
        citations: [cite("RCPsych", "lithium guidance", 2023)],
        timing: range(w(39), w(40, 6)),
        route: "either",
        grade: grade("C"),
        notes:
          "Term delivery. Coordinate 30-50% dose reduction 24-48 hours before planned delivery " +
          "to minimize neonatal complications. Monitor lithium levels weekly from 34 weeks.",
      },
    ],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "No specific GA for delivery is mandated; timing follows standard obstetric indications. " +
      "Lithium management peripartum is critical: consider 30-50% dose reduction or brief " +
      "discontinuation 12-24 hours before planned delivery to minimize neonatal complications " +
      "(hypoglycemia, hypotonia, cardiac dysfunction). Monitor lithium levels weekly from " +
      "34 weeks. Restart immediately postpartum due to a 66% relapse risk without prophylaxis.",
    specialConsiderations: [
      {
        type: "medication_adjustment",
        description:
          "Reduce lithium dose by 30-50% or briefly discontinue 24-48 hours before planned " +
          "delivery to reduce neonatal toxicity risk. Resume full dose immediately postpartum. " +
          "Weekly lithium levels from 34 weeks; dose adjustments for fluid shifts at delivery.",
        citation: cite("RCPsych", "lithium guidance", 2023),
      },
      {
        type: "neonatal_consideration",
        description:
          "Monitor neonate for lithium toxicity: hypotonia, lethargy, poor feeding, cardiac " +
          "arrhythmias, nephrogenic diabetes insipidus. Neonatal lithium level at birth.",
      },
      {
        type: "postpartum_management",
        description:
          "Restart lithium at full pre-pregnancy dose immediately postpartum. 66% relapse risk " +
          "for bipolar disorder without prophylaxis. Close psychiatric follow-up in the early " +
          "postpartum period.",
      },
    ],
    riskData: [
      {
        outcome: "bipolar relapse without lithium prophylaxis postpartum",
        statistic: { type: "incidence", valuePercent: 66 },
        populationDescription: "Women with bipolar disorder discontinuing lithium postpartum",
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "severe_mental_illness_safety",
    name: "Severe Mental Illness with Safety Concerns",
    category: "substance_use_psychiatric",
    tags: ["psychiatric", "severe mental illness", "psychosis", "suicidality", "safety"],
    guidelineRecommendations: [
      {
        citations: [cite("other", "Expert consensus", 2023)],
        timing: individualize(
          "Active psychosis or severe safety concerns",
          "Inability to cooperate with prenatal care or monitoring",
          "Multidisciplinary team input including psychiatry",
        ),
        route: "either",
        grade: grade("C"),
        notes:
          "Individualize delivery timing based on maternal safety, psychiatric stability, " +
          "and ability to participate in care. Multidisciplinary coordination with psychiatry essential.",
      },
    ],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "Delivery timing is individualized based on the balance of maternal psychiatric " +
      "stability, safety, and obstetric considerations. Multidisciplinary coordination with " +
      "psychiatry, social work, and obstetrics is essential. No fixed GA target exists.",
    specialConsiderations: [
      {
        type: "other",
        description:
          "Ensure psychiatric medications are continued or appropriately adjusted through " +
          "delivery. Coordinate with psychiatry for peripartum medication management. " +
          "Establish postpartum safety plan before delivery.",
      },
    ],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
];
