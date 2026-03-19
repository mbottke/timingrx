import type { LandmarkTrial } from "../types";
import { cite } from "../helpers";

// ═══════════════════════════════════════════════════════════════════════════════
// LANDMARK RCTS — Induction vs Expectant Management
// ═══════════════════════════════════════════════════════════════════════════════

export const hannahTrial: LandmarkTrial = {
  id: "hannah-1992",
  name: "Hannah Post-Term Induction Trial",
  year: 1992,
  journalCitation: "NEJM 1992;326:1587-1592",
  sampleSize: 3407,
  summary:
    "First major RCT comparing induction vs expectant management at \u226541w. " +
    "Demonstrated lower cesarean rate with induction. Pre-prostaglandin era " +
    "(oxytocin only), single-country (Canada).",
  keyFindings: [
    "Cesarean: 21.2% (induction) vs 24.5% (expectant), P=0.03",
    "0 vs 2 perinatal deaths (underpowered for mortality)",
    "Meconium aspiration: 0.6% vs 1.8% (P=0.008)",
    "Fetal distress requiring intervention: 6.2% vs 8.5%",
    "Pre-prostaglandin era ripening; single country (Canada)",
  ],
  relevantRiskData: [
    {
      outcome: "cesarean delivery",
      statistic: { type: "relative_risk", value: 0.87, ci95: [0.76, 0.99] },
      populationDescription: "Induction at \u226541w vs serial antenatal monitoring",
      citation: cite("other", "Hannah et al., NEJM 1992", 1992),
    },
    {
      outcome: "meconium aspiration syndrome",
      statistic: { type: "absolute_risk", valuePer1000: 6 },
      populationDescription: "Induction arm",
    },
    {
      outcome: "meconium aspiration syndrome",
      statistic: { type: "absolute_risk", valuePer1000: 18 },
      populationDescription: "Expectant management arm",
    },
    {
      outcome: "fetal distress requiring intervention",
      statistic: { type: "incidence", valuePercent: 6.2 },
      populationDescription: "Induction arm",
    },
  ],
};

export const arriveTrial: LandmarkTrial = {
  id: "arrive-2018",
  name: "ARRIVE (A Randomized Trial of Induction Versus Expectant Management)",
  year: 2018,
  journalCitation: "NEJM 2018;379:513-523",
  sampleSize: 6106,
  summary:
    "Multicenter RCT: elective induction at 39w vs expectant in low-risk nulliparous. " +
    "Reduced cesarean rate (NNT 28) and gestational HTN, no neonatal difference. " +
    "27% enrollment rate; 41 academic medical centers.",
  keyFindings: [
    "Cesarean: 18.6% vs 22.2%, RR 0.84, P=0.002, NNT 28",
    "Gestational HTN/preeclampsia: 9.1% vs 14.1%, RR 0.64",
    "Perinatal death: 0 vs 0 (not powered for mortality)",
    "Composite perinatal outcome: 4.3% vs 5.4%, RR 0.80 (P=0.049)",
    "NICU admission: 3.2% vs 3.3% (no difference)",
    "Operative vaginal delivery: 6.6% vs 6.4% (no difference)",
    "27% enrollment rate; academic centers only; limited generalizability",
  ],
  relevantRiskData: [
    {
      outcome: "cesarean delivery",
      statistic: { type: "relative_risk", value: 0.84, ci95: [0.76, 0.93] },
      populationDescription: "Low-risk nulliparous, 39w induction vs expectant",
      citation: cite("other", "Grobman et al., NEJM 2018", 2018),
    },
    {
      outcome: "gestational hypertension or preeclampsia",
      statistic: { type: "relative_risk", value: 0.64, ci95: [0.56, 0.74] },
      populationDescription: "Low-risk nulliparous, 39w induction vs expectant",
    },
    {
      outcome: "composite perinatal adverse outcome",
      statistic: { type: "relative_risk", value: 0.80, ci95: [0.64, 1.00] },
      populationDescription: "Low-risk nulliparous, 39w induction vs expectant",
    },
    {
      outcome: "NICU admission",
      statistic: { type: "incidence", valuePercent: 3.2 },
      populationDescription: "Induction arm (vs 3.3% expectant)",
    },
    {
      outcome: "preeclampsia",
      statistic: { type: "relative_risk", value: 0.66, ci95: [0.49, 0.89] },
      populationDescription: "Low-risk nulliparous, 39w induction vs expectant",
    },
  ],
};

export const swepisTrial: LandmarkTrial = {
  id: "swepis-2019",
  name: "SWEPIS (Swedish Post-term Induction Study)",
  year: 2019,
  journalCitation: "BMJ 2019;367:l6131",
  sampleSize: 2760,
  summary:
    "Swedish multicenter RCT: induction at 41w0d vs expectant to 42w0d. " +
    "Stopped early by DSMB after 6 perinatal deaths in expectant group vs 0 " +
    "in induction group. 14 hospitals.",
  keyFindings: [
    "Perinatal death: 0/1381 (induction) vs 6/1379 (expectant), P=0.03",
    "NNT 230 to prevent 1 perinatal death",
    "Cesarean: 10.8% vs 10.9% (no difference), RR 0.99",
    "NICU admission: 6.7% vs 7.2% (no difference)",
    "Composite perinatal morbidity: 2.4% vs 2.2% (no difference)",
    "Stopped early at 27% enrollment; possible overestimated mortality effect",
  ],
  relevantRiskData: [
    {
      outcome: "perinatal death",
      statistic: { type: "absolute_risk", valuePer1000: 0 },
      populationDescription: "Induction at 41w0d",
      citation: cite("other", "Wennerholm et al., BMJ 2019", 2019),
    },
    {
      outcome: "perinatal death",
      statistic: { type: "absolute_risk", valuePer1000: 4.3 },
      populationDescription: "Expectant management to 42w0d",
    },
    {
      outcome: "cesarean delivery",
      statistic: { type: "relative_risk", value: 0.99, ci95: [0.80, 1.23] },
      populationDescription: "41w induction vs expectant to 42w",
    },
    {
      outcome: "NICU admission",
      statistic: { type: "incidence", valuePercent: 6.7 },
      populationDescription: "Induction arm (vs 7.2% expectant)",
    },
    {
      outcome: "composite perinatal morbidity",
      statistic: { type: "incidence", valuePercent: 2.4 },
      populationDescription: "Induction arm (vs 2.2% expectant; no difference)",
    },
  ],
};

export const indexTrial: LandmarkTrial = {
  id: "index-2019",
  name: "INDEX (INDuction of labour versus EXpectant management)",
  year: 2019,
  journalCitation: "BMJ 2019;364:l344",
  sampleSize: 1801,
  summary:
    "Dutch non-inferiority RCT: induction at 41w0d vs expectant to 42w0d. " +
    "Failed to demonstrate non-inferiority of expectant management for the " +
    "composite adverse perinatal outcome.",
  keyFindings: [
    "Composite adverse perinatal outcome: 1.7% (induction) vs 3.1% (expectant)",
    "Perinatal death: 1/900 (0.11%) vs 2/901 (0.22%)",
    "Cesarean: 11.5% vs 13.8%",
    "Meconium aspiration syndrome: 0.3% vs 1.2%",
    "Non-inferiority design; margin 2 percentage points",
  ],
  relevantRiskData: [
    {
      outcome: "composite adverse perinatal outcome",
      statistic: { type: "relative_risk", value: 0.54, ci95: [0.27, 1.08] },
      populationDescription: "41w induction vs expectant to 42w",
      citation: cite("other", "Keulen et al., BMJ 2019", 2019),
    },
    {
      outcome: "cesarean delivery",
      statistic: { type: "incidence", valuePercent: 11.5 },
      populationDescription: "Induction arm (vs 13.8% expectant)",
    },
    {
      outcome: "meconium aspiration syndrome",
      statistic: { type: "absolute_risk", valuePer1000: 3 },
      populationDescription: "Induction arm (vs 12/1000 expectant)",
    },
    {
      outcome: "NICU admission \u22657 days",
      statistic: { type: "incidence", valuePercent: 0.8 },
      populationDescription: "Induction arm (vs 1.3% expectant)",
    },
  ],
};

export const alkmarkMeta: LandmarkTrial = {
  id: "alkmark-2020",
  name: "Alkmark IPD Meta-analysis",
  year: 2020,
  journalCitation: "Acta Obstet Gynecol Scand 2020;99:609-617",
  sampleSize: 5161,
  summary:
    "Individual patient data meta-analysis pooling INDEX + SWEPIS + Gelisen 2005. " +
    "Demonstrated reduction in perinatal mortality with 41w induction, with " +
    "benefit concentrated in nulliparous women.",
  keyFindings: [
    "Perinatal death: 1/2587 (induction) vs 8/2574 (expectant), OR 0.14 (0.03-0.70)",
    "NNT 326 overall to prevent 1 perinatal death",
    "Severe composite (death + morbidity): NNT 175",
    "Nulliparous subgroup: NNT 79 to prevent 1 adverse event",
    "Multiparous subgroup: no significant benefit detected",
    "Dominated by SWEPIS early stop; limited multiparous data",
  ],
  relevantRiskData: [
    {
      outcome: "perinatal death",
      statistic: { type: "odds_ratio", value: 0.14, ci95: [0.03, 0.70] },
      populationDescription:
        "41w induction vs expectant to 42w (pooled INDEX + SWEPIS + Gelisen)",
      citation: cite("other", "Alkmark et al., Acta Obstet Gynecol Scand 2020", 2020),
    },
    {
      outcome: "severe composite adverse perinatal outcome",
      statistic: { type: "odds_ratio", value: 0.40, ci95: [0.21, 0.76] },
      populationDescription: "Pooled 41w induction vs expectant",
    },
    {
      outcome: "severe composite (nulliparous subgroup)",
      statistic: { type: "odds_ratio", value: 0.26, ci95: [0.10, 0.64] },
      populationDescription: "Nulliparous women, 41w induction vs expectant",
    },
    {
      outcome: "cesarean delivery",
      statistic: { type: "odds_ratio", value: 0.86, ci95: [0.71, 1.05] },
      populationDescription: "Pooled 41w induction vs expectant (not significant)",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// LANDMARK RCTS — Condition-Specific Delivery Timing
// ═══════════════════════════════════════════════════════════════════════════════

export const chapTrial: LandmarkTrial = {
  id: "chap-2022",
  name: "CHAP (Chronic Hypertension and Pregnancy)",
  year: 2022,
  journalCitation: "NEJM 2022;386:1781-1792",
  sampleSize: 2408,
  summary:
    "Treatment of mild chronic HTN to target <140/90 vs standard care (<160/105) " +
    "reduced preeclampsia and composite perinatal outcome without increasing SGA. " +
    "Changed ACOG practice: now treat mild chronic HTN in pregnancy.",
  keyFindings: [
    "Primary composite: 30.2% vs 37.0% (aRR 0.82, 95% CI 0.74-0.92)",
    "Preeclampsia with severe features: 23.3% vs 29.1% (aRR 0.80, 95% CI 0.70-0.92)",
    "Preterm birth <37w: 27.5% vs 31.4% (aRR 0.87, 95% CI 0.77-0.99)",
    "SGA <10th percentile: 11.2% vs 10.4% (no significant difference)",
    "Placental abruption: 0.2% vs 0.5%",
  ],
  relevantRiskData: [
    {
      outcome: "primary composite (preeclampsia + preterm + placental abruption + fetal/neonatal death)",
      statistic: { type: "relative_risk", value: 0.82, ci95: [0.74, 0.92] },
      populationDescription:
        "Chronic HTN treated to <140/90 vs standard care",
      citation: cite("other", "Tita et al., NEJM 2022", 2022),
    },
    {
      outcome: "preeclampsia with severe features",
      statistic: { type: "relative_risk", value: 0.80, ci95: [0.70, 0.92] },
      populationDescription: "Treatment vs standard care",
    },
    {
      outcome: "preterm birth <37 weeks",
      statistic: { type: "relative_risk", value: 0.87, ci95: [0.77, 0.99] },
      populationDescription: "Treatment vs standard care",
    },
    {
      outcome: "SGA <10th percentile",
      statistic: { type: "incidence", valuePercent: 11.2 },
      populationDescription: "Treatment arm (vs 10.4% standard; no significant difference)",
    },
  ],
};

export const hypitatTrial: LandmarkTrial = {
  id: "hypitat-2009",
  name: "HYPITAT (Hypertension and Preeclampsia Intervention Trial At Term)",
  year: 2009,
  journalCitation: "Lancet 2009;374:979-988",
  sampleSize: 756,
  summary:
    "Dutch multicenter RCT: induction at 36-41w for gestational HTN or mild " +
    "preeclampsia vs expectant monitoring. Induction reduced progression to " +
    "severe disease (NNT ~12) without increasing cesarean.",
  keyFindings: [
    "Progression to severe HTN/preeclampsia: 31% vs 44% (RR 0.71, 95% CI 0.59-0.86)",
    "HELLP syndrome: 0.8% vs 3.2%",
    "Cesarean: 14% vs 14% (no difference)",
    "Composite neonatal: 7.1% vs 6.1% (no significant difference)",
    "NNT 12 to prevent progression to severe disease",
  ],
  relevantRiskData: [
    {
      outcome: "progression to severe hypertension or preeclampsia",
      statistic: { type: "relative_risk", value: 0.71, ci95: [0.59, 0.86] },
      populationDescription:
        "Gestational HTN/mild preeclampsia at 36-41w, induction vs expectant",
      citation: cite("other", "Koopmans et al., Lancet 2009", 2009),
    },
    {
      outcome: "HELLP syndrome",
      statistic: { type: "incidence", valuePercent: 0.8 },
      populationDescription: "Induction arm (vs 3.2% expectant)",
    },
    {
      outcome: "cesarean delivery",
      statistic: { type: "relative_risk", value: 1.01, ci95: [0.72, 1.41] },
      populationDescription: "Induction vs expectant (no difference)",
    },
  ],
};

export const phoenixTrial: LandmarkTrial = {
  id: "phoenix-2019",
  name: "PHOENIX (Planned Early Delivery or Expectant Management for Late Preterm Pre-eclampsia)",
  year: 2019,
  journalCitation: "Lancet 2019;394:1181-1190",
  sampleSize: 901,
  summary:
    "UK multicenter RCT: planned delivery within 48h vs expectant management " +
    "for late preterm preeclampsia (34w0d-36w6d). Planned delivery reduced " +
    "maternal morbidity but increased neonatal unit admission.",
  keyFindings: [
    "Composite maternal: 289 per 1000 (delivery) vs 330 per 1000 (expectant), aRR 0.86 (0.74-0.99)",
    "Neonatal unit admission: 42% vs 34% (higher with planned delivery)",
    "Eclampsia: 0 vs 0.9%",
    "HELLP: 1.3% vs 3.5%",
    "Severe HTN: 25.7% vs 36.9%",
  ],
  relevantRiskData: [
    {
      outcome: "composite maternal adverse outcome",
      statistic: { type: "relative_risk", value: 0.86, ci95: [0.74, 0.99] },
      populationDescription:
        "Late preterm preeclampsia (34-36w), planned delivery vs expectant",
      citation: cite("other", "Chappell et al., Lancet 2019", 2019),
    },
    {
      outcome: "neonatal unit admission",
      statistic: { type: "incidence", valuePercent: 42 },
      populationDescription: "Planned delivery arm (vs 34% expectant)",
    },
    {
      outcome: "severe hypertension (systolic \u2265160)",
      statistic: { type: "incidence", valuePercent: 25.7 },
      populationDescription: "Planned delivery arm (vs 36.9% expectant)",
    },
  ],
};

export const digitatTrial: LandmarkTrial = {
  id: "digitat-2010",
  name: "DIGITAT (Disproportionate Intrauterine Growth Intervention Trial At Term)",
  year: 2010,
  journalCitation: "BMJ 2010;341:c7087",
  sampleSize: 650,
  summary:
    "Dutch multicenter RCT: induction vs expectant management for suspected FGR " +
    "at 36-41w. No difference in composite neonatal outcome. Expectant management " +
    "did not increase adverse outcomes.",
  keyFindings: [
    "Composite neonatal adverse: 5.3% (induction) vs 6.1% (expectant) — no difference",
    "Birthweight: 2208g vs 2326g (expectant gained ~118g)",
    "Cesarean: 14% vs 14% (no difference)",
    "Preeclampsia: 3.7% vs 7.9% (favored induction, P=0.03)",
    "Mean 10 fewer days in utero for induction arm",
  ],
  relevantRiskData: [
    {
      outcome: "composite neonatal adverse outcome",
      statistic: { type: "relative_risk", value: 0.87, ci95: [0.50, 1.52] },
      populationDescription:
        "Suspected FGR at 36-41w, induction vs expectant",
      citation: cite("other", "Boers et al., BMJ 2010", 2010),
    },
    {
      outcome: "preeclampsia",
      statistic: { type: "incidence", valuePercent: 3.7 },
      populationDescription: "Induction arm (vs 7.9% expectant, P=0.03)",
    },
    {
      outcome: "cesarean delivery",
      statistic: { type: "incidence", valuePercent: 14 },
      populationDescription: "No difference between arms",
    },
  ],
};

export const truffleTrial: LandmarkTrial = {
  id: "truffle-2015",
  name: "TRUFFLE (Trial of Umbilical and Fetal Flow in Europe)",
  year: 2015,
  journalCitation: "Ultrasound Obstet Gynecol 2015;46:258-264 (2-year follow-up); BMC Pregnancy Childbirth 2011",
  sampleSize: 503,
  summary:
    "European multicenter RCT for early-onset FGR (26-32w) with abnormal umbilical " +
    "artery Doppler. Compared 3 delivery triggers: reduced fetal heart rate " +
    "variation (cCTG), early DV changes, or late DV changes. DV-based timing " +
    "improved 2-year neurodevelopmental outcomes.",
  keyFindings: [
    "Survival without neurodevelopmental impairment at 2y: 85% (late DV) vs 77% (cCTG) vs 78% (early DV)",
    "Perinatal survival: 92% overall",
    "Median GA at delivery: 30.8w (cCTG) vs 31.4w (late DV)",
    "DV-guided timing extended pregnancy by ~4 days without worsening outcomes",
  ],
  relevantRiskData: [
    {
      outcome: "survival without neurodevelopmental impairment at 2 years",
      statistic: { type: "incidence", valuePercent: 85 },
      populationDescription: "Late ductus venosus changes trigger group",
      citation: cite("other", "Lees et al., Ultrasound Obstet Gynecol 2015", 2015),
    },
    {
      outcome: "survival without neurodevelopmental impairment at 2 years",
      statistic: { type: "incidence", valuePercent: 77 },
      populationDescription: "Computerized CTG trigger group",
    },
    {
      outcome: "perinatal survival",
      statistic: { type: "incidence", valuePercent: 92 },
      populationDescription: "All arms combined",
    },
  ],
};

export const gritTrial: LandmarkTrial = {
  id: "grit-2004",
  name: "GRIT (Growth Restriction Intervention Trial)",
  year: 2004,
  journalCitation: "Lancet 2004;364:513-520 (2-year follow-up); Am J Obstet Gynecol 2003 (initial)",
  sampleSize: 588,
  summary:
    "International multicenter RCT: immediate delivery vs delayed delivery for " +
    "compromised FGR (24-36w) with abnormal umbilical Doppler. No significant " +
    "difference in 2-year death or disability. Immediate delivery group had " +
    "earlier GA at birth (~1.5w) and more RDS.",
  keyFindings: [
    "Death or severe disability at 2y: 19% (immediate) vs 16% (delayed), NS",
    "Mean GA at delivery: 31.1w (immediate) vs 32.5w (delayed)",
    "Neonatal death: 10% (immediate) vs 9% (delayed), NS",
    "Immediate delivery gained no clear advantage; delayed delivery not harmful",
    "Equipoise remained between 24-36w; clinical judgment still needed",
  ],
  relevantRiskData: [
    {
      outcome: "death or severe disability at 2 years",
      statistic: { type: "incidence", valuePercent: 19 },
      populationDescription: "Immediate delivery group (vs 16% delayed)",
      citation: cite("other", "GRIT Study Group, Lancet 2004", 2004),
    },
    {
      outcome: "neonatal death",
      statistic: { type: "incidence", valuePercent: 10 },
      populationDescription: "Immediate delivery (vs 9% delayed; NS)",
    },
  ],
};

export const termBreechTrial: LandmarkTrial = {
  id: "term-breech-2000",
  name: "Term Breech Trial",
  year: 2000,
  journalCitation: "Lancet 2000;356:1375-1383",
  sampleSize: 2088,
  summary:
    "International RCT: planned cesarean vs planned vaginal delivery for term " +
    "singleton breech. Planned cesarean significantly reduced perinatal " +
    "mortality and serious neonatal morbidity. Changed global practice.",
  keyFindings: [
    "Perinatal/neonatal death or serious morbidity: 1.6% (CS) vs 5.0% (vaginal), P<0.0001",
    "Perinatal/neonatal death: 0.3% (CS) vs 1.3% (vaginal)",
    "Serious maternal morbidity: No significant difference",
    "RR for primary outcome: 0.33 (0.19-0.56)",
    "121 centers in 26 countries; practice-changing globally",
  ],
  relevantRiskData: [
    {
      outcome: "perinatal/neonatal death or serious morbidity",
      statistic: { type: "relative_risk", value: 0.33, ci95: [0.19, 0.56] },
      populationDescription: "Planned cesarean vs planned vaginal for term breech",
      citation: cite("other", "Hannah et al., Lancet 2000", 2000),
    },
    {
      outcome: "perinatal/neonatal death",
      statistic: { type: "absolute_risk", valuePer1000: 3 },
      populationDescription: "Planned cesarean arm",
    },
    {
      outcome: "perinatal/neonatal death",
      statistic: { type: "absolute_risk", valuePer1000: 13 },
      populationDescription: "Planned vaginal delivery arm",
    },
  ],
};

export const twinBirthStudy: LandmarkTrial = {
  id: "twin-birth-2013",
  name: "Twin Birth Study",
  year: 2013,
  journalCitation: "NEJM 2013;369:1295-1305",
  sampleSize: 2804,
  summary:
    "International RCT: planned cesarean vs planned vaginal delivery for twin " +
    "pregnancies 32w0d-38w6d with first twin cephalic. No significant difference " +
    "in composite fetal/neonatal outcome.",
  keyFindings: [
    "Composite fetal/neonatal death or serious morbidity: 2.2% (CS) vs 1.9% (vaginal), NS",
    "OR 1.16 (95% CI 0.77-1.74)",
    "Fetal/neonatal death: 0.9% vs 0.6% (NS)",
    "Maternal death or serious morbidity: 7.3% vs 8.5% (NS)",
    "Planned vaginal delivery safe for cephalic-presenting first twin at \u226532w",
  ],
  relevantRiskData: [
    {
      outcome: "composite fetal/neonatal death or serious morbidity",
      statistic: { type: "odds_ratio", value: 1.16, ci95: [0.77, 1.74] },
      populationDescription:
        "Twins \u226532w with cephalic first twin, planned CS vs planned vaginal",
      citation: cite("other", "Barrett et al., NEJM 2013", 2013),
    },
    {
      outcome: "maternal death or serious morbidity",
      statistic: { type: "incidence", valuePercent: 7.3 },
      populationDescription: "Planned cesarean arm (vs 8.5% planned vaginal; NS)",
    },
  ],
};

export const momsTrial: LandmarkTrial = {
  id: "moms-2011",
  name: "MOMS (Management of Myelomeningocele Study)",
  year: 2011,
  journalCitation: "NEJM 2011;364:993-1004",
  sampleSize: 183,
  summary:
    "RCT comparing prenatal vs postnatal myelomeningocele repair. Prenatal " +
    "repair reduced need for shunting and improved motor function but " +
    "increased preterm delivery and uterine dehiscence. Mandates cesarean " +
    "delivery by 37w0d for prenatal repair recipients.",
  keyFindings: [
    "VP shunt by 12 months: 40% (prenatal) vs 82% (postnatal), RR 0.48",
    "Independent walking at 30 months: 42% vs 21%",
    "Delivery before 30w: 13% (prenatal) vs 0% (postnatal)",
    "Uterine dehiscence at delivery: 35% (prenatal) vs 1% (postnatal)",
    "Mean GA at delivery: 34.1w (prenatal) vs 37.3w (postnatal)",
  ],
  relevantRiskData: [
    {
      outcome: "VP shunt placement by 12 months",
      statistic: { type: "relative_risk", value: 0.48, ci95: [0.36, 0.64] },
      populationDescription: "Prenatal repair vs postnatal repair",
      citation: cite("other", "Adzick et al., NEJM 2011", 2011),
    },
    {
      outcome: "uterine dehiscence at delivery",
      statistic: { type: "incidence", valuePercent: 35 },
      populationDescription: "Prenatal repair (vs 1% postnatal)",
    },
    {
      outcome: "preterm delivery <30 weeks",
      statistic: { type: "incidence", valuePercent: 13 },
      populationDescription: "Prenatal repair (vs 0% postnatal)",
    },
  ],
};

export const magpieTrial: LandmarkTrial = {
  id: "magpie-2002",
  name: "Magpie Trial (Magnesium Sulphate for Prevention of Eclampsia)",
  year: 2002,
  journalCitation: "Lancet 2002;359:1877-1890",
  sampleSize: 10141,
  summary:
    "Massive international RCT demonstrating MgSO4 halves eclampsia risk in " +
    "preeclampsia. 175 hospitals in 33 countries. Established MgSO4 as the " +
    "standard of care for eclampsia prophylaxis.",
  keyFindings: [
    "Eclampsia: 0.8% (MgSO4) vs 1.9% (placebo), RR 0.42 (0.29-0.60)",
    "Maternal death: 0.4% vs 0.5% (NS, but trial not powered for mortality)",
    "Placental abruption: 3.1% vs 2.6% (NS)",
    "NNT 91 to prevent 1 case of eclampsia",
    "Side effects (flushing, nausea): 24% vs 5%",
  ],
  relevantRiskData: [
    {
      outcome: "eclampsia",
      statistic: { type: "relative_risk", value: 0.42, ci95: [0.29, 0.60] },
      populationDescription: "MgSO4 vs placebo in women with preeclampsia",
      citation: cite("other", "Magpie Trial Collaborative Group, Lancet 2002", 2002),
    },
    {
      outcome: "maternal death",
      statistic: { type: "incidence", valuePercent: 0.4 },
      populationDescription: "MgSO4 arm (vs 0.5% placebo; NS)",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// META-ANALYSES & SYSTEMATIC REVIEWS
// ═══════════════════════════════════════════════════════════════════════════════

export const ovadiaTrial: LandmarkTrial = {
  id: "ovadia-2019",
  name: "Ovadia IPD Meta-analysis (ICP)",
  year: 2019,
  journalCitation: "Lancet 2019;393:899-909",
  sampleSize: 5269,
  summary:
    "IPD meta-analysis establishing bile-acid-stratified stillbirth risk " +
    "that now drives ICP delivery timing worldwide. Combined data from 27 studies.",
  keyFindings: [
    "Stillbirth 0.13% at bile acids <40 \u00b5mol/L (not elevated above background)",
    "Stillbirth 0.28% at bile acids 40\u201399 \u00b5mol/L",
    "Stillbirth 3.44% at bile acids \u2265100 \u00b5mol/L (markedly elevated)",
    "No significant risk increase below 100 after adjusting for confounders",
    "Changed practice: SMFM now recommends delivery at 36w only if bile acids \u2265100",
  ],
  relevantRiskData: [
    {
      outcome: "stillbirth",
      statistic: { type: "absolute_risk", valuePer1000: 1.3 },
      populationDescription: "Bile acids <40 \u00b5mol/L",
      citation: cite("other", "Ovadia et al., Lancet 2019", 2019),
    },
    {
      outcome: "stillbirth",
      statistic: { type: "absolute_risk", valuePer1000: 2.8 },
      populationDescription: "Bile acids 40\u201399 \u00b5mol/L",
    },
    {
      outcome: "stillbirth",
      statistic: { type: "absolute_risk", valuePer1000: 34.4 },
      populationDescription: "Bile acids \u2265100 \u00b5mol/L",
    },
    {
      outcome: "stillbirth (adjusted)",
      statistic: { type: "odds_ratio", value: 5.78, ci95: [2.12, 15.78] },
      populationDescription: "Bile acids \u2265100 vs <40 \u00b5mol/L, adjusted for confounders",
    },
  ],
};

export const cochraneMiddleton: LandmarkTrial = {
  id: "cochrane-middleton-2020",
  name: "Cochrane: Induction of Labour at or Beyond 37 Weeks",
  year: 2020,
  journalCitation: "Cochrane Database Syst Rev 2020;7:CD004945",
  sampleSize: undefined,
  summary:
    "Systematic review of 34 RCTs (>21,000 women). Induction at \u226537w reduces " +
    "perinatal death (RR 0.31, HIGH certainty), cesarean (RR 0.90), and NICU " +
    "admission. The strongest meta-analytic evidence available for IOL timing.",
  keyFindings: [
    "Perinatal death: RR 0.31 (95% CI 0.15-0.64), HIGH certainty, NNT 544",
    "Cesarean: RR 0.90 (95% CI 0.85-0.95), NNT ~50",
    "NICU admission: RR 0.89 (95% CI 0.80-0.99)",
    "Operative vaginal delivery: RR 1.07 (95% CI 0.99-1.16) — trend toward more",
    "Subgroup: benefit driven by induction at \u226541w",
    "34 RCTs across multiple countries; strongest available evidence",
  ],
  relevantRiskData: [
    {
      outcome: "perinatal death",
      statistic: { type: "relative_risk", value: 0.31, ci95: [0.15, 0.64] },
      populationDescription: "Induction \u226537w vs expectant management (34 RCTs)",
      citation: cite("Cochrane", "CD004945", 2020),
    },
    {
      outcome: "cesarean delivery",
      statistic: { type: "relative_risk", value: 0.90, ci95: [0.85, 0.95] },
      populationDescription: "Induction \u226537w vs expectant management",
    },
    {
      outcome: "NICU admission",
      statistic: { type: "relative_risk", value: 0.89, ci95: [0.80, 0.99] },
      populationDescription: "Induction \u226537w vs expectant management",
    },
    {
      outcome: "operative vaginal delivery",
      statistic: { type: "relative_risk", value: 1.07, ci95: [0.99, 1.16] },
      populationDescription: "Induction \u226537w vs expectant (trend, NS)",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// FOUNDATIONAL EPIDEMIOLOGIC STUDIES — Sources for Risk Factor Multipliers
// ═══════════════════════════════════════════════════════════════════════════════

export const flenadyMeta: LandmarkTrial = {
  id: "flenady-2011",
  name: "Flenady Stillbirth Risk Factor Meta-analysis",
  year: 2011,
  journalCitation: "Lancet 2011;377:1331-1340",
  sampleSize: undefined,
  summary:
    "Systematic review identifying the 5 major modifiable risk factors for " +
    "stillbirth in high-income countries. Source of multipliers for BMI, " +
    "diabetes, chronic HTN, SGA, and smoking in the TimingRx risk calculator.",
  keyFindings: [
    "Overweight/obese: population-attributable risk (PAR) 8-18% of stillbirths",
    "BMI 25-30: aOR 1.23 (1.09-1.38); BMI \u226530: aOR 1.63 (1.35-1.95)",
    "Pre-existing diabetes: aOR 2.90 (2.05-4.10); PAR 3-5%",
    "Chronic hypertension: aOR 2.40 (1.70-3.40); PAR 5-10%",
    "SGA <10th percentile: aOR 3.50 (2.60-4.80); strongest single factor",
    "Smoking: aOR 1.36-1.86 (varies by study); PAR 4-7%",
    "AMA \u226535: aOR 1.32 (1.22-1.43); \u226540: aOR 1.88 (1.64-2.16)",
  ],
  relevantRiskData: [
    {
      outcome: "stillbirth (BMI 30-34.9)",
      statistic: { type: "odds_ratio", value: 1.63, ci95: [1.35, 1.95] },
      populationDescription: "BMI 30-34.9 vs normal BMI, high-income countries",
      citation: cite("other", "Flenady et al., Lancet 2011", 2011),
    },
    {
      outcome: "stillbirth (pre-existing diabetes)",
      statistic: { type: "odds_ratio", value: 2.90, ci95: [2.05, 4.10] },
      populationDescription: "Pregestational DM vs no diabetes",
    },
    {
      outcome: "stillbirth (chronic hypertension)",
      statistic: { type: "odds_ratio", value: 2.40, ci95: [1.70, 3.40] },
      populationDescription: "Chronic HTN vs normotensive",
    },
    {
      outcome: "stillbirth (SGA <10th percentile)",
      statistic: { type: "odds_ratio", value: 3.50, ci95: [2.60, 4.80] },
      populationDescription: "SGA vs AGA fetus",
    },
    {
      outcome: "stillbirth (smoking)",
      statistic: { type: "odds_ratio", value: 1.60, ci95: [1.40, 1.90] },
      populationDescription: "Current smoker vs non-smoker",
    },
    {
      outcome: "stillbirth (maternal age \u226535)",
      statistic: { type: "odds_ratio", value: 1.32, ci95: [1.22, 1.43] },
      populationDescription: "Age 35-39 vs <35",
    },
    {
      outcome: "stillbirth (maternal age \u226540)",
      statistic: { type: "odds_ratio", value: 1.88, ci95: [1.64, 2.16] },
      populationDescription: "Age \u226540 vs <35",
    },
  ],
};

export const reddyStudy: LandmarkTrial = {
  id: "reddy-2006",
  name: "Reddy Stillbirth-by-Age Cohort Study",
  year: 2006,
  journalCitation: "Obstet Gynecol 2006;107:1195-1200",
  sampleSize: 5458735,
  summary:
    "Massive US cohort study (n=5.4M live births) establishing GA-specific " +
    "stillbirth risk by maternal age. Demonstrated that women \u226540 at 39w " +
    "have stillbirth risk equivalent to women <35 at 42w.",
  keyFindings: [
    "Stillbirth risk at 37w: 1.0 (ref <35) vs 1.32 (35-39) vs 1.88 (\u226540) per 1,000",
    "At 39w in \u226540yo women: risk \u2248 <35yo at 42w",
    "Risk acceleration steeper after 39w in older mothers",
    "Supports earlier delivery consideration for AMA",
    "Source data for ACOG AMA counseling recommendations",
  ],
  relevantRiskData: [
    {
      outcome: "stillbirth (age 35-39 vs <35)",
      statistic: { type: "relative_risk", value: 1.32, ci95: [1.22, 1.43] },
      populationDescription: "US cohort, GA-specific rates",
      citation: cite("other", "Reddy et al., Obstet Gynecol 2006", 2006),
    },
    {
      outcome: "stillbirth (age \u226540 vs <35)",
      statistic: { type: "relative_risk", value: 1.88, ci95: [1.64, 2.16] },
      populationDescription: "US cohort, GA-specific rates",
    },
    {
      outcome: "stillbirth (age \u226545 vs <35)",
      statistic: { type: "relative_risk", value: 2.75, ci95: [2.00, 3.50] },
      populationDescription: "US cohort, extrapolated from limited data",
    },
  ],
};

export const smithFetalRisk: LandmarkTrial = {
  id: "smith-2001",
  name: "Smith Fetuses-at-Risk Methodology",
  year: 2001,
  journalCitation: "AJOG 2001;184:489-496",
  sampleSize: 364506,
  summary:
    "Established the 'fetuses-at-risk' denominator approach for calculating " +
    "GA-specific stillbirth risk. Prior studies using births as denominator " +
    "paradoxically showed LOWER risk at late term. This paper corrected that " +
    "by using ongoing pregnancies as the denominator — the basis for Muglu 2019.",
  keyFindings: [
    "Demonstrated that birth-based denominators underestimate post-term risk",
    "Ongoing-pregnancy denominator reveals true exponential risk increase",
    "Nulliparity aOR 1.3 (1.1-1.5) for stillbirth",
    "Framework adopted by all subsequent meta-analyses (including Muglu 2019)",
    "Conceptual foundation for the TimingRx risk model",
  ],
  relevantRiskData: [
    {
      outcome: "stillbirth (nulliparity)",
      statistic: { type: "odds_ratio", value: 1.3, ci95: [1.1, 1.5] },
      populationDescription: "Nulliparous vs multiparous, fetuses-at-risk denominator",
      citation: cite("other", "Smith, AJOG 2001", 2001),
    },
  ],
};

export const scrnStudy: LandmarkTrial = {
  id: "scrn-2014",
  name: "SCRN (Stillbirth Collaborative Research Network) Case-Control Study",
  year: 2014,
  journalCitation: "JAMA 2011;306:2459-2468; multiple publications 2011-2014",
  sampleSize: 953,
  summary:
    "Large US population-based case-control study of stillbirth. Identified " +
    "major risk factors including prior stillbirth, racial disparities, " +
    "and multiple social determinants. Key source for prior stillbirth recurrence.",
  keyFindings: [
    "Prior stillbirth: aOR 3.0 (2.0-5.0) for recurrence",
    "Black race: aOR 2.2 (1.8-2.7) reflecting structural disparities",
    "Low education: aOR 1.6 (1.2-2.1)",
    "Diabetes: aOR 2.6 (1.7-3.8)",
    "Hypertension: aOR 2.7 (1.9-3.8)",
    "Most stillbirths occur in the absence of recognized risk factors",
  ],
  relevantRiskData: [
    {
      outcome: "stillbirth recurrence (prior stillbirth)",
      statistic: { type: "odds_ratio", value: 3.0, ci95: [2.0, 5.0] },
      populationDescription: "Women with prior stillbirth vs no prior stillbirth",
      citation: cite("other", "SCRN, JAMA 2011", 2011),
    },
    {
      outcome: "stillbirth (Black race/ethnicity)",
      statistic: { type: "odds_ratio", value: 2.2, ci95: [1.8, 2.7] },
      populationDescription: "Black vs White women, US population-based",
    },
  ],
};

export const mbrrace: LandmarkTrial = {
  id: "mbrrace-2021",
  name: "MBRRACE-UK Perinatal Mortality Surveillance Report",
  year: 2021,
  journalCitation: "MBRRACE-UK 2021 (annual UK surveillance report)",
  sampleSize: undefined,
  summary:
    "UK national perinatal mortality surveillance documenting racial and " +
    "socioeconomic disparities in stillbirth. Source of Black race/ethnicity " +
    "multiplier reflecting structural health disparities.",
  keyFindings: [
    "Black women: 2.3\u00d7 stillbirth rate vs White women (UK data)",
    "Asian women: 1.7\u00d7 stillbirth rate vs White women",
    "Most deprived quintile: 1.7\u00d7 vs least deprived",
    "Disparities persistent across time, not explained by known medical risk factors",
    "Represents structural inequities, not biological determinism",
  ],
  relevantRiskData: [
    {
      outcome: "stillbirth (Black vs White women)",
      statistic: { type: "relative_risk", value: 2.3 },
      populationDescription: "UK national surveillance data",
      citation: cite("other", "MBRRACE-UK 2021", 2021),
    },
    {
      outcome: "stillbirth (most vs least deprived quintile)",
      statistic: { type: "relative_risk", value: 1.7 },
      populationDescription: "UK deprivation-stratified data",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// PREECLAMPSIA PREVENTION & HYPERTENSION
// ═══════════════════════════════════════════════════════════════════════════════

export const aspreTrial: LandmarkTrial = {
  id: "aspre-2017",
  name: "ASPRE Trial (Combined Screening for Preterm Preeclampsia)",
  year: 2017,
  journalCitation: "NEJM 2017;377:613-622",
  sampleSize: 1776,
  summary:
    "First-trimester combined screening plus high-dose aspirin (150 mg) at " +
    "11\u201314w reduced preterm preeclampsia by 62% in a high-risk screen-positive " +
    "population. Established first-trimester screening + prophylactic aspirin as " +
    "the standard of care for preterm preeclampsia prevention.",
  keyFindings: [
    "Preterm preeclampsia (<37w): 1.6% (aspirin) vs 4.3% (placebo), RR 0.38 (95% CI 0.20\u20130.74)",
    "Term preeclampsia (\u226537w): 15.5% vs 17.2% (no significant difference)",
    "Preterm birth <37w: 6.8% vs 5.4% (NS)",
    "Aspirin 150 mg nightly from 11\u201314w to 36w; n=1776 screen-positive",
    "First-trimester screen: MAP, uterine artery PI, PAPP-A, PlGF",
  ],
  relevantRiskData: [
    {
      outcome: "preterm preeclampsia (<37 weeks)",
      statistic: { type: "relative_risk", value: 0.38, ci95: [0.20, 0.74] },
      populationDescription:
        "Screen-positive high-risk women, aspirin 150 mg vs placebo from 11\u201314w",
      citation: cite("other", "Rolnik et al., NEJM 2017", 2017),
    },
    {
      outcome: "preterm preeclampsia (<37 weeks) — absolute risk aspirin arm",
      statistic: { type: "incidence", valuePercent: 1.6 },
      populationDescription: "Aspirin arm (vs 4.3% placebo)",
    },
    {
      outcome: "term preeclampsia (\u226537 weeks)",
      statistic: { type: "relative_risk", value: 0.90, ci95: [0.73, 1.12] },
      populationDescription: "Aspirin vs placebo, screen-positive women (NS)",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// GESTATIONAL DIABETES
// ═══════════════════════════════════════════════════════════════════════════════

export const hapoStudy: LandmarkTrial = {
  id: "hapo-2008",
  name: "HAPO Study (Hyperglycemia and Adverse Pregnancy Outcomes)",
  year: 2008,
  journalCitation: "NEJM 2008;358:1991-2002",
  sampleSize: 23316,
  summary:
    "Landmark international observational study establishing a continuous, " +
    "graded relationship between maternal glucose levels and adverse perinatal " +
    "outcomes. Provided the epidemiologic foundation for IADPSG diagnostic " +
    "thresholds for gestational diabetes.",
  keyFindings: [
    "Continuous, graded association between glucose and outcomes — no threshold effect",
    "Macrosomia (birth weight >90th percentile): OR 5.01 at highest glucose quartile",
    "Primary cesarean: OR 2.35 at highest glucose quartile",
    "Neonatal hypoglycemia: OR 5.60 at highest glucose quartile",
    "C-peptide >90th percentile (fetal hyperinsulinism): OR 9.75 at highest glucose quartile",
    "25 centers in 9 countries; blinded glucose results; no treatment intervention",
  ],
  relevantRiskData: [
    {
      outcome: "birth weight >90th percentile (macrosomia)",
      statistic: { type: "odds_ratio", value: 5.01, ci95: [3.94, 6.37] },
      populationDescription:
        "Highest vs lowest fasting glucose quartile (2-hour OGTT cohort)",
      citation: cite("other", "HAPO Study Cooperative Research Group, NEJM 2008", 2008),
    },
    {
      outcome: "primary cesarean delivery",
      statistic: { type: "odds_ratio", value: 2.35, ci95: [2.03, 2.72] },
      populationDescription: "Highest vs lowest fasting glucose quartile",
    },
    {
      outcome: "neonatal hypoglycemia",
      statistic: { type: "odds_ratio", value: 5.60, ci95: [3.43, 9.15] },
      populationDescription: "Highest vs lowest 2-hour glucose quartile",
    },
    {
      outcome: "cord C-peptide >90th percentile (fetal hyperinsulinism)",
      statistic: { type: "odds_ratio", value: 9.75, ci95: [7.79, 12.20] },
      populationDescription: "Highest vs lowest fasting glucose quartile",
    },
  ],
};

export const landonMfmuGdm: LandmarkTrial = {
  id: "landon-mfmu-2009",
  name: "Landon/MFMU Mild GDM Treatment Trial",
  year: 2009,
  journalCitation: "NEJM 2009;361:1339-1348",
  sampleSize: 958,
  summary:
    "MFMU Network RCT demonstrating that treatment of mild gestational diabetes " +
    "(diagnosed by OGTT but with fasting glucose <95 mg/dL) significantly reduces " +
    "macrosomia, shoulder dystocia, and preeclampsia, while halving the primary " +
    "cesarean rate. Expanded the indication for GDM treatment.",
  keyFindings: [
    "Birth weight >4000 g: 5.9% (treatment) vs 14.3% (control), RR 0.41",
    "Shoulder dystocia: 1.5% vs 4.0%, RR 0.37",
    "Preeclampsia: 8.6% vs 13.6%, RR 0.56",
    "Primary cesarean: 26.9% vs 33.8%, RR 0.87 (P=0.02)",
    "Neonatal composite: 32.4% vs 37.0%, RR 0.87 (P=0.14; NS)",
    "Neonatal fat mass reduced by 41 g in treatment group",
  ],
  relevantRiskData: [
    {
      outcome: "macrosomia (birth weight >4000 g)",
      statistic: { type: "relative_risk", value: 0.41, ci95: [0.26, 0.66] },
      populationDescription:
        "Mild GDM (fasting glucose <95 mg/dL), treatment vs no treatment",
      citation: cite("other", "Landon et al., NEJM 2009", 2009),
    },
    {
      outcome: "shoulder dystocia",
      statistic: { type: "relative_risk", value: 0.37, ci95: [0.14, 0.97] },
      populationDescription: "Mild GDM, treatment vs no treatment",
    },
    {
      outcome: "preeclampsia",
      statistic: { type: "relative_risk", value: 0.56, ci95: [0.37, 0.86] },
      populationDescription: "Mild GDM, treatment vs no treatment",
    },
    {
      outcome: "primary cesarean delivery",
      statistic: { type: "relative_risk", value: 0.87, ci95: [0.75, 0.99] },
      populationDescription: "Mild GDM, treatment vs no treatment",
    },
  ],
};

export const achoisTrial: LandmarkTrial = {
  id: "achois-2005",
  name: "ACHOIS (Australian Carbohydrate Intolerance Study in Pregnant Women)",
  year: 2005,
  journalCitation: "NEJM 2005;352:2477-2486",
  sampleSize: 1000,
  summary:
    "First large RCT demonstrating that treatment of gestational diabetes " +
    "(screen-positive by 75g OGTT at 24\u201334w) reduces serious perinatal " +
    "complications. Changed obstetric practice by proving GDM treatment is " +
    "beneficial, not merely theoretical.",
  keyFindings: [
    "Serious perinatal complications: 1% (treatment) vs 4% (routine care), RR 0.33 (0.14\u20130.75)",
    "Composite includes perinatal death, shoulder dystocia, bone fracture, nerve palsy",
    "Macrosomia (birth weight \u22654000 g): 10% vs 21%",
    "Induction of labour: 39% vs 29% (more in treatment arm)",
    "Maternal depression and health status improved in treatment arm",
  ],
  relevantRiskData: [
    {
      outcome: "serious perinatal composite (death, shoulder dystocia, bone fracture, nerve palsy)",
      statistic: { type: "relative_risk", value: 0.33, ci95: [0.14, 0.75] },
      populationDescription:
        "Screen-positive GDM (75g OGTT at 24\u201334w), treatment vs routine care",
      citation: cite("other", "Crowther et al. (ACHOIS), NEJM 2005", 2005),
    },
    {
      outcome: "macrosomia (birth weight \u22654000 g)",
      statistic: { type: "incidence", valuePercent: 10 },
      populationDescription: "Treatment arm (vs 21% routine care)",
    },
    {
      outcome: "induction of labour",
      statistic: { type: "incidence", valuePercent: 39 },
      populationDescription: "Treatment arm (vs 29% routine care; more frequent with treatment)",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// PRETERM BIRTH PREVENTION & NEUROPROTECTION
// ═══════════════════════════════════════════════════════════════════════════════

export const beamTrial: LandmarkTrial = {
  id: "beam-2008",
  name: "BEAM Trial (Beneficial Effects of Antenatal Magnesium Sulfate)",
  year: 2008,
  journalCitation: "NEJM 2008;359:895-905",
  sampleSize: 2241,
  summary:
    "MFMU Network RCT demonstrating MgSO4 administered before anticipated " +
    "preterm birth at 24\u201331+6 weeks reduces the risk of moderate/severe " +
    "cerebral palsy. Established MgSO4 as standard neuroprotection for " +
    "preterm birth <32 weeks.",
  keyFindings: [
    "Moderate/severe cerebral palsy: 1.9% (MgSO4) vs 3.5% (placebo), RR 0.55 (0.32\u20130.95)",
    "Cerebral palsy or death: 11.3% vs 11.3% (no difference in combined outcome)",
    "Death: 9.5% (MgSO4) vs 8.5% (placebo) — non-significant trend",
    "Gross motor dysfunction: 3.4% vs 6.6%, RR 0.51 (0.31\u20130.83)",
    "No significant safety concerns; flushing most common side effect",
  ],
  relevantRiskData: [
    {
      outcome: "moderate or severe cerebral palsy",
      statistic: { type: "relative_risk", value: 0.55, ci95: [0.32, 0.95] },
      populationDescription:
        "Anticipated preterm birth at 24\u201331+6w, MgSO4 vs placebo",
      citation: cite("other", "Rouse et al. (BEAM), NEJM 2008", 2008),
    },
    {
      outcome: "gross motor dysfunction",
      statistic: { type: "relative_risk", value: 0.51, ci95: [0.31, 0.83] },
      populationDescription: "MgSO4 vs placebo, preterm birth 24\u201331+6w",
    },
    {
      outcome: "cerebral palsy or death (combined outcome)",
      statistic: { type: "incidence", valuePercent: 11.3 },
      populationDescription: "No difference between arms (11.3% MgSO4 vs 11.3% placebo)",
    },
  ],
};

export const meisMfmu17ohpc: LandmarkTrial = {
  id: "meis-mfmu-2003",
  name: "MFMU 17-OHPC Trial (Meis et al.)",
  year: 2003,
  journalCitation: "NEJM 2003;348:2379-2385",
  sampleSize: 463,
  summary:
    "MFMU Network RCT demonstrating that weekly intramuscular 17-alpha-hydroxyprogesterone " +
    "caproate (17-OHPC) reduces recurrent spontaneous preterm birth in women with " +
    "prior spontaneous preterm birth. Established progesterone as a key prevention " +
    "strategy (later updated by subsequent meta-analyses for efficacy limitations).",
  keyFindings: [
    "Delivery <37w: 36.3% (17-OHPC) vs 54.9% (placebo), RR 0.66 (95% CI 0.54\u20130.81)",
    "Delivery <35w: 20.6% vs 30.7%, RR 0.67 (0.48\u20130.93)",
    "Delivery <32w: 11.4% vs 19.6%, RR 0.58 (0.37\u20130.91)",
    "Neonatal composite (NEC, IVH, death): reduced with 17-OHPC",
    "Treatment 16\u201320w to 36w; singleton with prior spontaneous PTB",
  ],
  relevantRiskData: [
    {
      outcome: "delivery before 37 weeks",
      statistic: { type: "relative_risk", value: 0.66, ci95: [0.54, 0.81] },
      populationDescription:
        "Prior spontaneous preterm birth, 17-OHPC vs placebo from 16\u201320w",
      citation: cite("other", "Meis et al. (MFMU), NEJM 2003", 2003),
    },
    {
      outcome: "delivery before 35 weeks",
      statistic: { type: "relative_risk", value: 0.67, ci95: [0.48, 0.93] },
      populationDescription: "17-OHPC vs placebo, prior spontaneous PTB",
    },
    {
      outcome: "delivery before 32 weeks",
      statistic: { type: "relative_risk", value: 0.58, ci95: [0.37, 0.91] },
      populationDescription: "17-OHPC vs placebo, prior spontaneous PTB",
    },
    {
      outcome: "delivery <37w — absolute risk 17-OHPC arm",
      statistic: { type: "incidence", valuePercent: 36.3 },
      populationDescription: "17-OHPC arm (vs 54.9% placebo)",
    },
  ],
};

export const epppicMeta: LandmarkTrial = {
  id: "epppic-2021",
  name: "EPPPIC (Evaluating Progestogens for Preventing Preterm birth International Collaborative)",
  year: 2021,
  journalCitation: "Lancet 2021;397:571-583",
  sampleSize: undefined,
  summary:
    "Individual patient data meta-analysis of 31 RCTs evaluating progesterone " +
    "for preterm birth prevention. Found vaginal progesterone reduces birth " +
    "before 34 weeks in women with short cervix; 17-OHPC benefit less certain " +
    "in updated analyses. Informed subsequent FDA and ACOG guidance revisions.",
  keyFindings: [
    "Vaginal progesterone vs placebo: birth <34w RR 0.78 (0.68\u20130.90) in short cervix",
    "17-OHPC vs placebo (prior PTB): birth <34w RR 0.83 (0.66\u20131.04) — not significant in IPD",
    "Vaginal progesterone: neonatal composite RR 0.84 (0.73\u20130.97)",
    "No significant increase in fetal/neonatal harm with either progestogen",
    "Results contributed to FDA withdrawal of 17-OHPC (Makena) approval in 2023",
  ],
  relevantRiskData: [
    {
      outcome: "birth before 34 weeks (short cervix)",
      statistic: { type: "relative_risk", value: 0.78, ci95: [0.68, 0.90] },
      populationDescription:
        "Vaginal progesterone vs placebo, short cervical length subgroup (31 RCTs IPD)",
      citation: cite("other", "EPPPIC Group, Lancet 2021", 2021),
    },
    {
      outcome: "neonatal composite adverse outcome (vaginal progesterone)",
      statistic: { type: "relative_risk", value: 0.84, ci95: [0.73, 0.97] },
      populationDescription: "Vaginal progesterone vs placebo",
    },
    {
      outcome: "birth before 34 weeks (17-OHPC, prior PTB)",
      statistic: { type: "relative_risk", value: 0.83, ci95: [0.66, 1.04] },
      populationDescription: "17-OHPC vs placebo, prior spontaneous PTB (IPD; NS)",
    },
  ],
};

export const oracleITrial: LandmarkTrial = {
  id: "oracle-i-2001",
  name: "ORACLE I (Erythromycin in PPROM)",
  year: 2001,
  journalCitation: "Lancet 2001;357:979-988",
  sampleSize: 4826,
  summary:
    "UK multicenter RCT evaluating antibiotics in preterm prelabour rupture of " +
    "membranes (PPROM). Erythromycin prolonged pregnancy, reduced oxygen " +
    "therapy, and improved composite neonatal outcomes. Co-amoxiclav (amoxicillin\u2013" +
    "clavulanate) increased necrotising enterocolitis and is now contraindicated.",
  keyFindings: [
    "Erythromycin vs placebo: delivery within 48h RR 0.79 (0.66\u20130.95), median +5 days",
    "Use of neonatal O2 therapy: reduced with erythromycin (RR 0.88)",
    "Composite neonatal morbidity: erythromycin RR 0.86 (0.74\u20131.00)",
    "Co-amoxiclav: necrotising enterocolitis increased 4.6% vs 2.9% (P=0.004)",
    "Co-amoxiclav now contraindicated in PPROM; erythromycin remains standard",
  ],
  relevantRiskData: [
    {
      outcome: "delivery within 48 hours of randomisation",
      statistic: { type: "relative_risk", value: 0.79, ci95: [0.66, 0.95] },
      populationDescription:
        "PPROM, erythromycin vs placebo",
      citation: cite("other", "Kenyon et al. (ORACLE I), Lancet 2001", 2001),
    },
    {
      outcome: "neonatal oxygen therapy requirement",
      statistic: { type: "relative_risk", value: 0.88, ci95: [0.79, 0.99] },
      populationDescription: "PPROM, erythromycin vs placebo",
    },
    {
      outcome: "necrotising enterocolitis (co-amoxiclav arm)",
      statistic: { type: "incidence", valuePercent: 4.6 },
      populationDescription: "Co-amoxiclav arm (vs 2.9% placebo; P=0.004) — harm signal",
    },
    {
      outcome: "composite neonatal morbidity (erythromycin)",
      statistic: { type: "relative_risk", value: 0.86, ci95: [0.74, 1.00] },
      populationDescription: "PPROM, erythromycin vs placebo",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// POSTPARTUM HEMORRHAGE
// ═══════════════════════════════════════════════════════════════════════════════

export const womanTrial: LandmarkTrial = {
  id: "woman-2017",
  name: "WOMAN Trial (World Maternal Antifibrinolytic Trial)",
  year: 2017,
  journalCitation: "Lancet 2017;389:2105-2116",
  sampleSize: 20060,
  summary:
    "Massive international RCT (40 countries) demonstrating that tranexamic acid " +
    "(TXA) within 3 hours of postpartum hemorrhage onset reduces death from " +
    "bleeding without increasing thromboembolic events. Established TXA as " +
    "standard care for PPH worldwide.",
  keyFindings: [
    "Death from bleeding: 1.5% (TXA) vs 1.9% (placebo), RR 0.81 (0.65\u20131.00)",
    "Death from bleeding if given within 3h: RR 0.74 (0.59\u20130.93) — significant",
    "Death from bleeding if given >3h: RR 1.07 (0.76\u20131.51) — no benefit",
    "Hysterectomy: 3.5% vs 3.6% (no difference)",
    "Thromboembolic events: 0.4% vs 0.4% (no increase)",
    "Time to treatment critical — earlier is better; no benefit after 3h",
  ],
  relevantRiskData: [
    {
      outcome: "death from postpartum bleeding",
      statistic: { type: "relative_risk", value: 0.81, ci95: [0.65, 1.00] },
      populationDescription:
        "PPH (any cause), TXA 1 g IV vs placebo, 40 countries",
      citation: cite("other", "WOMAN Trial Collaborators, Lancet 2017", 2017),
    },
    {
      outcome: "death from bleeding — TXA within 3 hours",
      statistic: { type: "relative_risk", value: 0.74, ci95: [0.59, 0.93] },
      populationDescription: "TXA given within 3h of PPH onset (significant subgroup)",
    },
    {
      outcome: "thromboembolic events",
      statistic: { type: "incidence", valuePercent: 0.4 },
      populationDescription: "TXA arm (vs 0.4% placebo; no increase in thromboembolism)",
    },
    {
      outcome: "hysterectomy",
      statistic: { type: "relative_risk", value: 0.97, ci95: [0.82, 1.14] },
      populationDescription: "TXA vs placebo (no difference)",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// ANTENATAL CORTICOSTEROIDS
// ═══════════════════════════════════════════════════════════════════════════════

export const robertsDalzielCochrane: LandmarkTrial = {
  id: "roberts-dalziel-2006",
  name: "Roberts & Dalziel Cochrane Review (Antenatal Corticosteroids)",
  year: 2006,
  journalCitation: "Cochrane Database Syst Rev 2006;3:CD004454",
  sampleSize: undefined,
  summary:
    "Definitive systematic review of 18 RCTs establishing antenatal corticosteroids " +
    "(betamethasone or dexamethasone) as standard care before anticipated preterm " +
    "birth. Demonstrated dramatic reductions in RDS, IVH, NEC, and neonatal death " +
    "with a single course of ACS.",
  keyFindings: [
    "Respiratory distress syndrome: RR 0.66 (0.59\u20130.73), HIGH certainty",
    "Intraventricular hemorrhage: RR 0.54 (0.43\u20130.69)",
    "Necrotising enterocolitis: RR 0.46 (0.29\u20130.74)",
    "Neonatal death: RR 0.69 (0.58\u20130.81)",
    "Benefit across 24\u201334+6 weeks; greatest impact 24h\u20137d after first dose",
    "18 RCTs; foundation of standard preterm birth care worldwide",
  ],
  relevantRiskData: [
    {
      outcome: "respiratory distress syndrome",
      statistic: { type: "relative_risk", value: 0.66, ci95: [0.59, 0.73] },
      populationDescription:
        "Anticipated preterm birth, antenatal corticosteroids vs placebo (18 RCTs)",
      citation: cite("other", "Roberts & Dalziel, Cochrane 2006", 2006),
    },
    {
      outcome: "intraventricular hemorrhage",
      statistic: { type: "relative_risk", value: 0.54, ci95: [0.43, 0.69] },
      populationDescription: "ACS vs placebo, preterm birth",
    },
    {
      outcome: "necrotising enterocolitis",
      statistic: { type: "relative_risk", value: 0.46, ci95: [0.29, 0.74] },
      populationDescription: "ACS vs placebo, preterm birth",
    },
    {
      outcome: "neonatal death",
      statistic: { type: "relative_risk", value: 0.69, ci95: [0.58, 0.81] },
      populationDescription: "ACS vs placebo, preterm birth",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// GUIDELINES
// ═══════════════════════════════════════════════════════════════════════════════

export const niceNg207: LandmarkTrial = {
  id: "nice-ng207-2021",
  name: "NICE NG207 (Inducing Labour Guideline)",
  year: 2021,
  journalCitation: "NICE Guideline NG207, 2021",
  sampleSize: undefined,
  summary:
    "UK National Institute for Health and Care Excellence guideline on inducing " +
    "labour. Updated recommendation to offer IOL from 41+0 weeks rather than " +
    "42+0 weeks, based on accumulated evidence from SWEPIS, INDEX, and Cochrane " +
    "meta-analyses showing benefit of earlier induction.",
  keyFindings: [
    "Offer IOL between 41+0 and 42+0 (not after 42+0 as previously recommended)",
    "Timing change driven by SWEPIS perinatal mortality data and Cochrane evidence",
    "Membrane sweeping offered from 39+0 weeks",
    "Bishop score alone should not determine method of cervical ripening",
    "Expectant management beyond 42+0 should be discouraged",
  ],
  relevantRiskData: [
    {
      outcome: "guideline-recommended IOL threshold (weeks)",
      statistic: { type: "incidence", valuePercent: 41.0 },
      populationDescription:
        "NICE NG207 2021: IOL offered from 41+0 (previously 42+0)",
      citation: cite("other", "NICE NG207, 2021", 2021),
    },
    {
      outcome: "perinatal death (induction 41w vs expectant — supporting evidence)",
      statistic: { type: "relative_risk", value: 0.31, ci95: [0.15, 0.64] },
      populationDescription: "Cochrane 2020 meta-analysis underpinning NG207 (34 RCTs)",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// CONGENITAL HEART DISEASE & CARDIAC DISEASE IN PREGNANCY
// ═══════════════════════════════════════════════════════════════════════════════

export const ohyeSvrTrial: LandmarkTrial = {
  id: "ohye-svr-2010",
  name: "SVR Trial (Single Ventricle Reconstruction — Ohye et al.)",
  year: 2010,
  journalCitation: "NEJM 2010;362:1980-1992",
  sampleSize: 549,
  summary:
    "NHLBI-funded multicenter RCT comparing modified Blalock-Taussig (mBT) shunt " +
    "vs right-ventricle-to-pulmonary-artery (RV-PA) shunt during the Norwood " +
    "procedure for hypoplastic left heart syndrome. RV-PA shunt improved " +
    "12-month transplant-free survival; long-term RV function differences persist.",
  keyFindings: [
    "12-month transplant-free survival: 74% (RV-PA) vs 64% (mBT shunt), P=0.01",
    "Unintended interventions: more frequent in RV-PA group during first year",
    "Right ventricular ejection fraction at 14 months: no significant difference",
    "3-year survival: 65% (RV-PA) vs 59% (mBT; P=0.06 — trending)",
    "Neurodevelopmental outcomes similar at 14 months",
  ],
  relevantRiskData: [
    {
      outcome: "12-month transplant-free survival",
      statistic: { type: "incidence", valuePercent: 74 },
      populationDescription:
        "HLHS Norwood with RV-PA shunt (vs 64% modified BT shunt; P=0.01)",
      citation: cite("other", "Ohye et al. (SVR Trial), NEJM 2010", 2010),
    },
    {
      outcome: "12-month transplant-free survival (mBT shunt arm)",
      statistic: { type: "incidence", valuePercent: 64 },
      populationDescription: "HLHS Norwood with modified Blalock-Taussig shunt",
    },
    {
      outcome: "12-month transplant-free survival — RV-PA vs mBT",
      statistic: { type: "relative_risk", value: 1.16, ci95: [1.02, 1.32] },
      populationDescription: "RV-PA shunt vs modified BT shunt for HLHS Norwood",
    },
  ],
};

export const escRegitzZagrosek2018: LandmarkTrial = {
  id: "esc-regitz-zagrosek-2018",
  name: "ESC Guidelines on Cardiovascular Disease During Pregnancy (Regitz-Zagrosek et al.)",
  year: 2018,
  journalCitation: "Eur Heart J 2018;39:3165-3241",
  sampleSize: undefined,
  summary:
    "European Society of Cardiology guidelines establishing the WHO risk " +
    "classification (I\u2013IV) for maternal cardiovascular risk in pregnancy. " +
    "Provides structured risk stratification and delivery planning recommendations " +
    "for women with cardiac disease, including timing and mode of delivery.",
  keyFindings: [
    "WHO class I: maternal mortality ~0.1%; vaginal delivery recommended",
    "WHO class II: mortality 0.4%; individualized delivery planning",
    "WHO class III: mortality 1\u20135%; tertiary centre delivery; consider early IOL",
    "WHO class IV: mortality >15%; pregnancy contraindicated or highest-level MDT care",
    "Specific cardiac diagnoses mapped to WHO class with management recommendations",
    "Anticoagulation, cardiac medication, and delivery timing addressed by class",
  ],
  relevantRiskData: [
    {
      outcome: "maternal mortality — WHO class I cardiac disease",
      statistic: { type: "incidence", valuePercent: 0.1 },
      populationDescription:
        "WHO class I (e.g., mild PS, PDA, MVP); vaginal delivery recommended",
      citation: cite("other", "Regitz-Zagrosek et al. (ESC), Eur Heart J 2018", 2018),
    },
    {
      outcome: "maternal mortality — WHO class III cardiac disease",
      statistic: { type: "incidence", valuePercent: 3.0 },
      populationDescription:
        "WHO class III (e.g., moderate LV impairment, Marfan aorta 40\u201345 mm); range 1\u20135%",
    },
    {
      outcome: "maternal mortality — WHO class IV cardiac disease",
      statistic: { type: "incidence", valuePercent: 15.0 },
      populationDescription:
        "WHO class IV (e.g., PAH, severe LV dysfunction EF <30%); >15% mortality, pregnancy contraindicated",
    },
    {
      outcome: "maternal mortality — WHO class II cardiac disease",
      statistic: { type: "incidence", valuePercent: 0.4 },
      populationDescription:
        "WHO class II (e.g., repaired TOF, uncomplicated coarctation); range 0.4\u20130.5%",
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// REGISTRY & EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export const allTrials: LandmarkTrial[] = [
  // Induction vs Expectant Management RCTs
  hannahTrial,
  arriveTrial,
  swepisTrial,
  indexTrial,
  alkmarkMeta,
  cochraneMiddleton,

  // Condition-Specific RCTs
  chapTrial,
  hypitatTrial,
  phoenixTrial,
  digitatTrial,
  truffleTrial,
  gritTrial,
  termBreechTrial,
  twinBirthStudy,
  momsTrial,
  magpieTrial,

  // Meta-analyses & Systematic Reviews
  ovadiaTrial,

  // Foundational Epidemiologic Studies (sources for risk calculator multipliers)
  flenadyMeta,
  reddyStudy,
  smithFetalRisk,
  scrnStudy,
  mbrrace,

  // Preeclampsia Prevention
  aspreTrial,

  // Gestational Diabetes
  hapoStudy,
  landonMfmuGdm,
  achoisTrial,

  // Preterm Birth Prevention & Neuroprotection
  beamTrial,
  meisMfmu17ohpc,
  epppicMeta,
  oracleITrial,

  // Postpartum Hemorrhage
  womanTrial,

  // Antenatal Corticosteroids
  robertsDalzielCochrane,

  // Guidelines
  niceNg207,

  // Congenital Heart Disease & Cardiac Disease in Pregnancy
  ohyeSvrTrial,
  escRegitzZagrosek2018,
];

export const trialById = new Map(allTrials.map((t) => [t.id, t]));
