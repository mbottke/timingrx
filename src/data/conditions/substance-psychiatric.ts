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
    riskData: [
      {
        outcome: "neonatal abstinence syndrome (NAS) in neonates exposed to methadone MAT",
        statistic: { type: "incidence", valuePercent: 60 },
        populationDescription: "Neonates born to mothers on methadone maintenance (pooled cohort data)",
        citation: cite("other", "Cleary et al., Drug Alcohol Depend 2010", 2010),
      },
      {
        outcome: "NAS requiring pharmacologic treatment in buprenorphine-exposed neonates",
        statistic: { type: "incidence", valuePercent: 43 },
        populationDescription: "Neonates born to mothers on buprenorphine MAT (MOTHER trial)",
        citation: cite("other", "Jones et al., NEJM 2010", 2010),
      },
      {
        outcome: "preterm birth in opioid use disorder on MAT vs no treatment",
        statistic: { type: "odds_ratio", value: 0.54, ci95: [0.35, 0.83] },
        populationDescription: "MAT (methadone or buprenorphine) vs untreated OUD in pregnancy; MAT reduces preterm risk",
        citation: cite("other", "Wiegand et al., Am J Obstet Gynecol 2015", 2015),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    keyEvidenceSources: [],
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
    riskData: [
      {
        outcome: "fetal alcohol spectrum disorder (FASD) with any alcohol use in pregnancy",
        statistic: { type: "incidence", valuePercent: 2 },
        populationDescription: "Children born to mothers with documented alcohol use during pregnancy (US population estimate)",
        citation: cite("other", "May et al., Alcohol Clin Exp Res 2018", 2018),
      },
      {
        outcome: "placental abruption with heavy alcohol use (>5 drinks/week)",
        statistic: { type: "odds_ratio", value: 1.72, ci95: [1.27, 2.32] },
        populationDescription: "Heavy alcohol use (>5 drinks/week) vs abstinent pregnant women",
        citation: cite("other", "Aliyu et al., J Obstet Gynaecol 2011", 2011),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    keyEvidenceSources: [],
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
    riskData: [
      {
        outcome: "fetal growth restriction with methamphetamine use in pregnancy",
        statistic: { type: "odds_ratio", value: 3.16, ci95: [1.34, 7.44] },
        populationDescription: "Methamphetamine-exposed pregnancies vs non-exposed controls (Infant Development, Environment and Lifestyle Study)",
        citation: cite("other", "Smith et al., Neurotoxicol Teratol 2006", 2006),
      },
      {
        outcome: "placental abruption with methamphetamine use",
        statistic: { type: "odds_ratio", value: 2.38, ci95: [1.09, 5.20] },
        populationDescription: "Methamphetamine-exposed vs non-exposed pregnancies (cohort data)",
        citation: cite("other", "Gorman et al., J Perinatol 2014", 2014),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    keyEvidenceSources: [],
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
    riskData: [
      {
        outcome: "fetal growth restriction (SGA <10th percentile) with active smoking",
        statistic: { type: "odds_ratio", value: 2.10, ci95: [1.90, 2.30] },
        populationDescription: "Pregnant smokers vs non-smokers (meta-analysis of cohort studies)",
        citation: cite("other", "Cnattingius, Prog Cardiovasc Dis 2004", 2004),
      },
      {
        outcome: "placental abruption with cigarette smoking in pregnancy",
        statistic: { type: "odds_ratio", value: 1.90, ci95: [1.60, 2.20] },
        populationDescription: "Smokers vs non-smokers in pregnancy (systematic review)",
        citation: cite("other", "Ananth et al., Obstet Gynecol 1999", 1999),
      },
      {
        outcome: "sudden infant death syndrome (SIDS) with maternal smoking",
        statistic: { type: "relative_risk", value: 2.27, ci95: [1.92, 2.68] },
        populationDescription: "Infants of mothers who smoked during pregnancy vs non-smokers (meta-analysis)",
        citation: cite("other", "Zhang & Wang, J Paediatr Child Health 2013", 2013),
      },
    ],
    riskModifiers: [
      {
        factor: "smoking",
        effect:
          "Smoking increases FGR risk (OR 2.0-2.5) and abruption risk (OR 1.5-2.5), " +
          "which may independently trigger earlier delivery.",
      },
    ],
    landmarkTrials: [],
    keyEvidenceSources: [],
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
    keyEvidenceSources: [],
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
    riskData: [
      {
        outcome: "preterm birth in women with schizophrenia or bipolar disorder",
        statistic: { type: "odds_ratio", value: 1.79, ci95: [1.59, 2.02] },
        populationDescription: "Women with severe mental illness (schizophrenia, bipolar disorder) vs general obstetric population (national registry)",
        citation: cite("other", "Vigod et al., BJOG 2014", 2014),
      },
      {
        outcome: "postpartum psychosis risk in women with bipolar disorder",
        statistic: { type: "incidence", valuePercent: 25 },
        populationDescription: "Women with bipolar disorder in the first 4 weeks postpartum (prospective cohort)",
        citation: cite("other", "Bergink et al., Am J Psychiatry 2012", 2012),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    keyEvidenceSources: [],
    interactions: [],
  },
];
