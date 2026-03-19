import type { ObstetricCondition } from "../types";
import { w, range, individualize, cite, grade } from "../helpers";
import { carpregII, ropac, cincinnatiScamp, anzFontanRegistry } from "../evidence-sources";

export const cardiacComplexConditions: ObstetricCondition[] = [
  {
    id: "ppcm",
    name: "Peripartum Cardiomyopathy (PPCM)",
    category: "cardiac_cardiomyopathy",
    tags: [
      "peripartum cardiomyopathy",
      "PPCM",
      "cardiomyopathy",
      "heart failure",
      "EF",
      "ejection fraction",
      "mWHO III-IV",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("ESC", "ESC HFA Position Statement on PPCM", 2019)],
        timing: individualize(
          "Deliver after maternal hemodynamic stabilization",
          "No fixed GA target — timing driven by cardiac status",
          "Persistent decompensated heart failure despite optimization",
          "Cardiogenic shock requiring mechanical circulatory support",
          "Severe LV dysfunction (EF <20%) not improving with medical therapy",
        ),
        route: "either",
        grade: grade("C"),
        notes:
          "Vaginal delivery preferred if hemodynamically stable. Cesarean for hemodynamic " +
          "instability, cardiogenic shock, or need for mechanical circulatory support. " +
          "No fixed gestational age target — delivery is driven by maternal cardiac status.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "PPCM is defined as new heart failure with EF <45% occurring in the last month of " +
      "pregnancy or within 5 months postpartum, in the absence of other causes. Incidence " +
      "is approximately 1:1,000-1:4,000 pregnancies. When PPCM is diagnosed antepartum, " +
      "delivery decisions hinge entirely on whether the mother can be hemodynamically " +
      "stabilized with medical therapy.",
    physiologyExplanation:
      "PPCM pathophysiology involves a combination of angiogenic imbalance (excess 16-kDa " +
      "prolactin fragment, elevated sFlt-1), inflammatory activation, and oxidative stress " +
      "that damages cardiac myocytes. The hemodynamic burden of pregnancy (increased preload, " +
      "heart rate, and cardiac output) exacerbates the failing ventricle. Delivery removes " +
      "the ongoing hemodynamic stress but the immediate postpartum autotransfusion " +
      "(300-500 mL blood return from uterine contraction) can acutely worsen heart " +
      "failure, making the first 24-48 hours postpartum a high-risk period.",
    specialConsiderations: [
      {
        type: "medication_adjustment",
        description:
          "Antepartum: hydralazine + nitrates (instead of ACE inhibitors), beta-blockers " +
          "(if tolerated hemodynamically), diuretics for volume overload. Bromocriptine " +
          "(2.5 mg BID x2 weeks, then 2.5 mg daily x6 weeks) may be considered to inhibit " +
          "pathologic prolactin cleavage (ESC recommendation, limited trial data). " +
          "Postpartum: transition to ACE inhibitor/ARB + beta-blocker + MRA.",
        citation: cite("ESC", "ESC HFA Position Statement on PPCM", 2019),
      },
      {
        type: "anesthesia_consideration",
        description:
          "Regional anesthesia preferred (avoids myocardial depression from general " +
          "anesthesia). Slow epidural titration. Avoid fluid boluses. Invasive " +
          "hemodynamic monitoring (arterial line, consider PA catheter if EF <30%).",
      },
      {
        type: "postpartum_management",
        description:
          "ICU monitoring for 24-48 hours minimum. Autotransfusion from uterine involution " +
          "can acutely decompensate a fragile ventricle. Initiate guideline-directed " +
          "medical therapy (ACEi/ARB, beta-blocker, MRA, SGLT2i) as soon as postpartum. " +
          "LVAD or transplant evaluation if refractory.",
      },
      {
        type: "contraindication",
        description:
          "Subsequent pregnancy carries 30-50% recurrence risk of PPCM. If EF does not " +
          "recover to >50%, future pregnancy is contraindicated. Even with recovered EF, " +
          "contractile reserve may be limited — stress echocardiography recommended " +
          "before future pregnancy planning.",
        citation: cite("ESC", "ESC HFA Position Statement on PPCM", 2019),
      },
    ],
    riskData: [
      {
        outcome: "maternal mortality from PPCM",
        statistic: { type: "mortality_rate", valuePercent: 6 },
        populationDescription: "Contemporary series, developed countries",
        citation: cite("ESC", "ESC HFA Position Statement on PPCM", 2019),
      },
    ],
    riskModifiers: [
      {
        factor: "disease_severity",
        effect:
          "EF <30% at diagnosis is associated with worse outcomes and lower recovery rates. " +
          "EF <20% may necessitate mechanical circulatory support.",
      },
    ],
    landmarkTrials: [
      {
        id: "esc-regitz-zagrosek-2018",
        name: "ESC Guidelines for the Management of Cardiovascular Diseases During Pregnancy (2018)",
        year: 2018,
        journalCitation: "Eur Heart J 2018;39:3165-3241",
        summary:
          "ESC guidelines classify PPCM as mWHO III-IV and provide the primary framework " +
          "for antepartum and postpartum management, including bromocriptine consideration, " +
          "anticoagulation, and contraindication of subsequent pregnancy if EF does not " +
          "recover to >50%.",
        keyFindings: [
          "PPCM classified mWHO III-IV; delivery driven by cardiac status, no fixed GA target",
          "Bromocriptine may be considered to inhibit pathologic prolactin cleavage",
          "Subsequent pregnancy contraindicated if EF does not recover to >50%",
          "Guideline-directed medical therapy (ACEi/ARB, beta-blocker, MRA) initiated postpartum",
        ],
      },
    ],
    keyEvidenceSources: [carpregII, ropac, cincinnatiScamp, anzFontanRegistry],
    interactions: [],
  },
  {
    id: "repaired_tof",
    name: "Repaired Tetralogy of Fallot",
    category: "cardiac_complex",
    tags: [
      "Tetralogy of Fallot",
      "TOF",
      "repaired",
      "congenital heart disease",
      "RVOT",
      "pulmonary regurgitation",
      "mWHO II",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("ESC", "ESC CVD in Pregnancy", 2018)],
        timing: range(w(38), w(38, 6)),
        route: "vaginal_preferred",
        grade: grade("C"),
        notes:
          "Near-term delivery (~38 weeks). Vaginal delivery preferred. Timing is " +
          "driven by the degree of residual hemodynamic burden (pulmonary regurgitation, " +
          "RV dilation, arrhythmias) rather than a fixed GA.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Repaired Tetralogy of Fallot is the most common complex congenital heart disease " +
      "encountered in pregnancy. Most women with repaired TOF tolerate pregnancy well " +
      "(mWHO II) if RV function is preserved. Key residual lesions include pulmonary " +
      "regurgitation (nearly universal after transannular patch repair), RV dilation, " +
      "RVOT obstruction, and ventricular arrhythmias.",
    physiologyExplanation:
      "After TOF repair, the right ventricle faces chronic volume overload from pulmonary " +
      "regurgitation. Pregnancy increases blood volume by 40-50%, further loading the " +
      "already dilated RV. The volume-overloaded RV may not accommodate the additional " +
      "pregnancy-associated preload, leading to right heart failure. Additionally, " +
      "atrial and ventricular arrhythmias can be triggered by the increased atrial " +
      "stretch and sympathetic tone of pregnancy.",
    specialConsiderations: [
      {
        type: "monitoring_requirement",
        description:
          "Baseline echocardiography and cardiac MRI (if not recently done) to quantify " +
          "RV size and function, pulmonary regurgitation severity, and RVOT gradient. " +
          "Echocardiography each trimester. Holter monitoring if arrhythmia symptoms develop.",
        citation: cite("ESC", "ESC CVD in Pregnancy", 2018),
      },
      {
        type: "anesthesia_consideration",
        description:
          "Regional anesthesia preferred. Maintain preload — RV preload dependent. " +
          "Avoid increases in pulmonary vascular resistance (hypoxia, hypercarbia, " +
          "acidosis). Slow position changes.",
      },
      {
        type: "delivery_site_requirement",
        description:
          "Delivery at a center with adult congenital heart disease (ACHD) expertise. " +
          "Cardiology consultation for delivery planning.",
      },
    ],
    riskData: [
      {
        outcome: "sustained ventricular arrhythmia during pregnancy",
        statistic: { type: "incidence", valuePercent: 5 },
        populationDescription: "Repaired TOF patients in pregnancy; incidence higher with RVEDV >150 mL/m² or RVEF <40%",
        citation: cite("ESC", "ESC CVD in Pregnancy", 2018),
      },
      {
        outcome: "maternal cardiac event (arrhythmia, heart failure, or intervention)",
        statistic: { type: "incidence", valuePercent: 12 },
        populationDescription: "Repaired TOF pregnancies with residual hemodynamic lesions (PR, RVOTO, or RV dilation)",
        citation: cite("ESC", "ESC CVD in Pregnancy", 2018),
      },
    ],
    riskModifiers: [
      {
        factor: "disease_severity",
        effect:
          "Severe pulmonary regurgitation with RV dilation (RVEDV >150 mL/m2), " +
          "RV dysfunction (RVEF <40%), or sustained ventricular tachycardia shifts " +
          "to higher risk and may require earlier delivery.",
      },
    ],
    landmarkTrials: [
      {
        id: "esc-regitz-zagrosek-2018",
        name: "ESC Guidelines for the Management of Cardiovascular Diseases During Pregnancy (2018)",
        year: 2018,
        journalCitation: "Eur Heart J 2018;39:3165-3241",
        summary:
          "ESC guidelines classify repaired TOF as mWHO II (well tolerated in most) and " +
          "recommend near-term delivery (~38 weeks) at a center with ACHD expertise, vaginal " +
          "delivery preferred with maintenance of RV preload.",
        keyFindings: [
          "Repaired TOF: mWHO II classification when RV function is preserved",
          "Near-term delivery (~38 weeks), vaginal delivery preferred",
          "Baseline cardiac MRI to quantify RV size, function, and pulmonary regurgitation severity",
          "Maintain RV preload; avoid increases in pulmonary vascular resistance",
        ],
      },
    ],
    keyEvidenceSources: [carpregII, ropac, cincinnatiScamp, anzFontanRegistry],
    interactions: [],
  },
  {
    id: "fontan_circulation",
    name: "Fontan Circulation",
    category: "cardiac_complex",
    tags: [
      "Fontan",
      "single ventricle",
      "univentricular",
      "TCPC",
      "congenital heart disease",
      "FGR",
      "mWHO III-IV",
    ],
    guidelineRecommendations: [
      {
        citations: [
          cite("ESC", "ESC CVD in Pregnancy Update", 2025),
          cite("other", "ANZ Fontan Registry", 2020),
        ],
        timing: range(w(34), w(37)),
        route: "either",
        grade: grade("C"),
        notes:
          "Planned delivery at 34-37 weeks if stable. Many Fontan pregnancies deliver " +
          "earlier (31-34 wk) due to FGR, atrial arrhythmias, or heart failure. " +
          "Spontaneous ventilation preferred (avoid positive pressure ventilation). " +
          "Route individualized.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Fontan circulation (total cavopulmonary connection) is the palliative pathway " +
      "for single-ventricle physiology. Pregnancy in Fontan patients is increasingly " +
      "reported but carries high risk: ~50% miscarriage rate, high preterm delivery " +
      "rate, and significant FGR. The Fontan circulation is preload-dependent and " +
      "operates at chronically elevated central venous pressure with limited cardiac " +
      "output reserve.",
    physiologyExplanation:
      "In Fontan physiology, systemic venous return reaches the pulmonary arteries " +
      "passively (no subpulmonary ventricle). Pulmonary blood flow depends entirely on " +
      "the transpulmonary gradient (CVP minus LA pressure). Pregnancy-associated " +
      "vasodilation and venous pooling reduce the CVP driving pressure, while " +
      "increased blood volume raises LA pressure — both narrowing the transpulmonary " +
      "gradient and reducing cardiac output. The resulting low-output state causes " +
      "uteroplacental insufficiency and FGR. Atrial arrhythmias (common in Fontan " +
      "patients) are exacerbated by pregnancy and can precipitate acute decompensation.",
    specialConsiderations: [
      {
        type: "monitoring_requirement",
        description:
          "Close surveillance for FGR (growth ultrasound every 2-3 weeks from 24 wk). " +
          "Serial echocardiography. Thromboprophylaxis with LMWH throughout pregnancy " +
          "(Fontan circuit is prothrombotic). Holter monitoring for arrhythmias.",
        citation: cite("ESC", "ESC CVD in Pregnancy Update", 2025),
      },
      {
        type: "anesthesia_consideration",
        description:
          "Avoid positive-pressure ventilation if possible (impedes passive pulmonary " +
          "blood flow). Regional anesthesia with slow titration preferred. Maintain " +
          "preload (Fontan circuit is exquisitely preload-dependent). Lateral " +
          "positioning to avoid aortocaval compression.",
      },
      {
        type: "delivery_site_requirement",
        description:
          "Delivery must occur at a center with adult congenital heart disease (ACHD) " +
          "expertise, NICU (due to expected prematurity and FGR), and cardiac anesthesia.",
      },
      {
        type: "neonatal_consideration",
        description:
          "High rate of FGR and preterm birth. Neonates should be evaluated for " +
          "congenital heart disease (50% inheritance risk if autosomal dominant etiology). " +
          "Low birth weight is the norm rather than the exception.",
      },
    ],
    riskData: [
      {
        outcome: "preterm delivery",
        statistic: { type: "incidence", valuePercent: 65 },
        populationDescription: "Women with Fontan circulation completing pregnancy",
        citation: cite("other", "ANZ Fontan Registry", 2020),
      },
      {
        outcome: "fetal growth restriction",
        statistic: { type: "incidence", valuePercent: 40 },
        populationDescription: "Women with Fontan circulation completing pregnancy",
      },
      {
        outcome: "miscarriage",
        statistic: { type: "incidence", valuePercent: 50 },
        populationDescription: "All Fontan pregnancies (including first trimester losses)",
      },
    ],
    riskModifiers: [
      {
        factor: "disease_severity",
        effect:
          "Fontan patients with protein-losing enteropathy, plastic bronchitis, or " +
          "severe ventricular dysfunction should be counseled against pregnancy.",
      },
    ],
    landmarkTrials: [
      {
        id: "esc-regitz-zagrosek-2018",
        name: "ESC Guidelines for the Management of Cardiovascular Diseases During Pregnancy (2018)",
        year: 2018,
        journalCitation: "Eur Heart J 2018;39:3165-3241",
        summary:
          "ESC guidelines classify Fontan circulation as mWHO III-IV and provide guidance on " +
          "delivery timing (planned 34-37 weeks), thromboprophylaxis, FGR surveillance, and " +
          "the importance of delivering at a center with ACHD expertise and NICU capability.",
        keyFindings: [
          "Fontan circulation: mWHO III-IV; planned delivery at 34-37 weeks",
          "High rates of miscarriage (~50%), preterm birth (~65%), and FGR (~40%)",
          "Thromboprophylaxis with LMWH throughout pregnancy (Fontan circuit is prothrombotic)",
          "Avoid positive-pressure ventilation; maintain preload; lateral positioning",
        ],
      },
    ],
    keyEvidenceSources: [carpregII, ropac, cincinnatiScamp, anzFontanRegistry],
    interactions: [],
  },
  {
    id: "pulmonary_hypertension_pah",
    name: "Pulmonary Hypertension (WHO Group 1 PAH)",
    category: "cardiac_complex",
    tags: [
      "pulmonary hypertension",
      "PAH",
      "pulmonary arterial hypertension",
      "WHO Group 1",
      "mWHO IV",
      "high mortality",
    ],
    guidelineRecommendations: [
      {
        citations: [
          cite("ESC", "ESC CVD in Pregnancy", 2018),
          cite("ESC", "ESC/ERS Pulmonary Hypertension", 2022),
          cite("ERS", "ERS Guidelines on PH", 2022),
        ],
        timing: range(w(34), w(36)),
        route: "cesarean_preferred",
        grade: grade("C"),
        notes:
          "Planned delivery at 34-36 weeks. Cesarean preferred under regional anesthesia " +
          "(general anesthesia associated with 4x higher mortality). Postpartum ICU " +
          "monitoring for at least 2 weeks is recommended.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Pulmonary arterial hypertension (WHO Group 1) remains one of the highest-mortality " +
      "conditions in pregnancy, classified as mWHO IV (pregnancy contraindicated). " +
      "Despite modern therapies, maternal mortality remains 10-33%. The postpartum " +
      "period carries the highest risk, with most deaths occurring in the first 2 weeks " +
      "after delivery. Pregnancy counseling should strongly recommend against conception.",
    physiologyExplanation:
      "In PAH, the pulmonary vascular bed is remodeled with fixed elevation of pulmonary " +
      "vascular resistance (PVR). The right ventricle operates near its maximum capacity " +
      "at baseline. Pregnancy increases blood volume by 40-50% and cardiac output by " +
      "30-50%, overwhelming the fixed, high-resistance pulmonary circuit. The RV cannot " +
      "augment output sufficiently, leading to progressive right heart failure. The most " +
      "dangerous period is the immediate postpartum: autotransfusion from uterine " +
      "involution (300-500 mL), loss of the low-resistance placental circuit, and " +
      "catecholamine surges acutely increase RV afterload, precipitating RV failure " +
      "and cardiovascular collapse.",
    specialConsiderations: [
      {
        type: "contraindication",
        description:
          "Pregnancy is contraindicated in WHO Group 1 PAH (mWHO IV). Effective " +
          "contraception is essential. If pregnancy occurs, early termination should be " +
          "discussed given the 10-33% maternal mortality.",
        citation: cite("ESC", "ESC CVD in Pregnancy", 2018),
      },
      {
        type: "medication_continuation",
        description:
          "IV prostacyclin (epoprostenol or treprostinil) should be initiated at least " +
          "8 weeks before planned delivery and continued throughout delivery and the " +
          "postpartum period. PDE5 inhibitors (sildenafil) are continued. Endothelin " +
          "receptor antagonists (bosentan, ambrisentan) are teratogenic and must be " +
          "switched to alternatives before or immediately upon pregnancy recognition.",
        citation: cite("ERS", "ERS Guidelines on PH", 2022),
      },
      {
        type: "anesthesia_consideration",
        description:
          "Regional anesthesia strongly preferred over general (GA associated with 4x higher " +
          "mortality). Slow epidural titration to avoid acute SVR drop. Maintain RV preload. " +
          "Avoid hypoxia, hypercarbia, and acidosis (all increase PVR). Inhaled nitric " +
          "oxide should be available.",
        citation: cite("ESC", "ESC CVD in Pregnancy", 2018),
      },
      {
        type: "postpartum_management",
        description:
          "ICU monitoring for at least 2 weeks postpartum. Most maternal deaths occur in " +
          "the first 14 days after delivery. Careful fluid management — avoid both " +
          "overload and depletion. Continue pulmonary vasodilators. Anticoagulation " +
          "resumed when hemostasis is secured.",
      },
      {
        type: "delivery_site_requirement",
        description:
          "Delivery at a pulmonary hypertension center of excellence with ECMO capability. " +
          "Multidisciplinary team: PH cardiologist, cardiac anesthesia, MFM, ICU.",
      },
    ],
    riskData: [
      {
        outcome: "maternal mortality",
        statistic: { type: "mortality_rate", valuePercent: 16 },
        populationDescription: "PAH patients with modern targeted therapy, meta-analysis",
        citation: cite("ESC", "ESC/ERS Pulmonary Hypertension", 2022),
      },
      {
        outcome: "maternal mortality range in literature",
        statistic: { type: "mortality_rate", valuePercent: 33 },
        populationDescription: "Upper bound of reported maternal mortality in PAH (historical series)",
        citation: cite("ESC", "ESC CVD in Pregnancy", 2018),
      },
    ],
    riskModifiers: [
      {
        factor: "disease_severity",
        effect:
          "Higher PVR, lower cardiac index, and WHO FC III-IV at baseline predict worse " +
          "outcomes. REVEAL risk score can be applied.",
      },
      {
        factor: "medication_control_status",
        effect:
          "Patients already on IV prostacyclin before pregnancy have better outcomes " +
          "than those initiated during pregnancy.",
      },
    ],
    landmarkTrials: [
      {
        id: "esc-regitz-zagrosek-2018",
        name: "ESC Guidelines for the Management of Cardiovascular Diseases During Pregnancy (2018)",
        year: 2018,
        journalCitation: "Eur Heart J 2018;39:3165-3241",
        summary:
          "ESC guidelines classify WHO Group 1 PAH as mWHO IV (pregnancy contraindicated) " +
          "with reported maternal mortality of 10-33%. Guidelines recommend planned delivery " +
          "at 34-36 weeks by cesarean at a PH center of excellence with ICU monitoring for " +
          "at least 2 weeks postpartum.",
        keyFindings: [
          "PAH: mWHO IV — pregnancy contraindicated; maternal mortality 10-33%",
          "Regional anesthesia strongly preferred (general anesthesia associated with 4x higher mortality)",
          "IV prostacyclin to be initiated at least 8 weeks before planned delivery",
          "ICU monitoring for at least 2 weeks postpartum — most deaths occur in the first 14 days",
        ],
      },
    ],
    keyEvidenceSources: [carpregII, ropac, cincinnatiScamp, anzFontanRegistry],
    interactions: [],
  },
  {
    id: "eisenmenger_syndrome",
    name: "Eisenmenger Syndrome",
    category: "cardiac_complex",
    tags: [
      "Eisenmenger",
      "Eisenmenger syndrome",
      "shunt reversal",
      "cyanosis",
      "pulmonary hypertension",
      "VSD",
      "ASD",
      "PDA",
      "mWHO IV",
      "pregnancy contraindicated",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("ESC", "ESC CVD in Pregnancy", 2018)],
        timing: range(w(34), w(36)),
        route: "cesarean_preferred",
        grade: grade("C"),
        notes:
          "Pregnancy is contraindicated (mWHO IV). If pregnant, planned delivery at " +
          "34-36 weeks by cesarean is recommended. Historical maternal mortality is " +
          "30-56%, making this one of the highest-mortality conditions in obstetrics.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Eisenmenger syndrome represents end-stage pulmonary hypertension secondary to a " +
      "congenital cardiac shunt (VSD, ASD, PDA, or complex lesion) with reversal of " +
      "shunt flow to right-to-left (cyanosis). Pregnancy is strongly contraindicated " +
      "with mWHO IV classification and historical maternal mortality of 30-56%. " +
      "Even with modern management, outcomes remain poor.",
    physiologyExplanation:
      "In Eisenmenger syndrome, chronic left-to-right shunting produces irreversible " +
      "pulmonary vascular remodeling (plexiform lesions). When pulmonary vascular " +
      "resistance exceeds systemic resistance, the shunt reverses to right-to-left, " +
      "causing cyanosis. During pregnancy, systemic vasodilation (decreased SVR) " +
      "worsens the right-to-left shunt, deepening cyanosis and hypoxemia. The fixed, " +
      "elevated PVR prevents the RV from augmenting output in response to pregnancy " +
      "demands. The most lethal period is postpartum: acute increases in venous return " +
      "(autotransfusion) and blood loss-mediated hypotension can precipitate acute " +
      "right-to-left shunting, refractory hypoxemia, and cardiovascular collapse.",
    specialConsiderations: [
      {
        type: "contraindication",
        description:
          "Pregnancy is absolutely contraindicated (mWHO IV, 30-56% maternal mortality). " +
          "If pregnancy occurs, early termination should be strongly counseled. " +
          "Effective contraception (long-acting progesterone or surgical sterilization) " +
          "is essential. Combined estrogen-containing contraceptives are contraindicated " +
          "due to thrombotic risk.",
        citation: cite("ESC", "ESC CVD in Pregnancy", 2018),
      },
      {
        type: "monitoring_requirement",
        description:
          "If pregnancy continues: serial oxygen saturations, echocardiography, " +
          "and hematocrit monitoring. Hospitalization in the third trimester is typically " +
          "recommended. Continuous pulse oximetry during delivery and postpartum.",
      },
      {
        type: "anesthesia_consideration",
        description:
          "Regional anesthesia preferred if cesarean, titrated slowly to avoid acute SVR " +
          "drops that worsen right-to-left shunting. Avoid air in IV lines (paradoxical " +
          "embolism risk). Supplemental oxygen. Avoid agents that increase PVR.",
      },
      {
        type: "postpartum_management",
        description:
          "Prolonged ICU monitoring (at least 2 weeks). Most deaths occur in the first " +
          "7-14 days postpartum. Avoid blood loss (even small volumes are poorly tolerated). " +
          "Anticoagulation controversial (balance thrombosis vs hemorrhage).",
      },
    ],
    riskData: [
      {
        outcome: "maternal mortality",
        statistic: { type: "mortality_rate", valuePercent: 36 },
        populationDescription:
          "Pooled estimate from historical and contemporary case series of Eisenmenger syndrome in pregnancy",
        citation: cite("ESC", "ESC CVD in Pregnancy", 2018),
      },
    ],
    riskModifiers: [
      {
        factor: "disease_severity",
        effect:
          "Baseline SpO2 <85%, hematocrit >65%, syncope, and WHO FC III-IV predict " +
          "highest mortality.",
      },
    ],
    landmarkTrials: [
      {
        id: "esc-regitz-zagrosek-2018",
        name: "ESC Guidelines for the Management of Cardiovascular Diseases During Pregnancy (2018)",
        year: 2018,
        journalCitation: "Eur Heart J 2018;39:3165-3241",
        summary:
          "ESC guidelines classify Eisenmenger syndrome as mWHO IV (pregnancy contraindicated) " +
          "with historical maternal mortality of 30-56%. Guidelines recommend planned delivery " +
          "at 34-36 weeks by cesarean, prolonged ICU monitoring, and early termination counseling " +
          "if pregnancy occurs.",
        keyFindings: [
          "Eisenmenger syndrome: mWHO IV — pregnancy contraindicated; maternal mortality 30-56%",
          "Pregnancy is strongly contraindicated; early termination should be strongly counseled",
          "Planned delivery at 34-36 weeks by cesarean if pregnancy continues",
          "Most lethal period is postpartum — ICU monitoring for at least 2 weeks",
        ],
      },
    ],
    keyEvidenceSources: [carpregII, ropac, cincinnatiScamp, anzFontanRegistry],
    interactions: [],
  },
  {
    id: "heart_transplant",
    name: "Heart Transplant Recipients",
    category: "cardiac_complex",
    tags: [
      "heart transplant",
      "cardiac transplant",
      "immunosuppression",
      "rejection",
      "mWHO II-III",
    ],
    guidelineRecommendations: [
      {
        citations: [
          cite("ISHLT", "ISHLT Consensus Statement", 2022),
          cite("SMFM", "Consult Series #66", 2023),
        ],
        timing: range(w(37), w(39, 6)),
        route: "vaginal_preferred",
        grade: grade("2B"),
        notes:
          "Term delivery (37-39w6d) unless complications develop. Vaginal delivery " +
          "preferred. Cesarean for standard obstetric indications. The denervated " +
          "heart limits cardiac output augmentation but tolerates pregnancy in " +
          "selected patients.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Pregnancy after cardiac transplantation is feasible when graft function is " +
      "excellent and immunosuppression is stable for at least 1-2 years post-transplant. " +
      "Key risks include rejection (10-20% during pregnancy), hypertension (40-55%), " +
      "preeclampsia (20-30%), infection, and preterm delivery (30-40%).",
    physiologyExplanation:
      "The transplanted heart is denervated, lacking direct sympathetic and " +
      "parasympathetic innervation. Heart rate response to stress is mediated by " +
      "circulating catecholamines (delayed response). The denervated heart has " +
      "limited capacity to increase cardiac output acutely, which is normally " +
      "required during labor. Despite this limitation, the Frank-Starling mechanism " +
      "remains intact, allowing preload-dependent increases in output. Pregnancy-associated " +
      "immunomodulation may increase or decrease rejection risk — close surveillance " +
      "is essential.",
    specialConsiderations: [
      {
        type: "medication_continuation",
        description:
          "Continue immunosuppression throughout pregnancy. Calcineurin inhibitors " +
          "(cyclosporine, tacrolimus) are generally safe with dose adjustments for " +
          "increased volume of distribution. Azathioprine is compatible. " +
          "Mycophenolate mofetil is teratogenic and must be stopped >=6 weeks before " +
          "conception. mTOR inhibitors (sirolimus, everolimus) are contraindicated " +
          "in pregnancy.",
        citation: cite("ISHLT", "ISHLT Consensus Statement", 2022),
      },
      {
        type: "monitoring_requirement",
        description:
          "Endomyocardial biopsy or noninvasive rejection monitoring each trimester " +
          "and if rejection is suspected. Drug levels (tacrolimus, cyclosporine) monthly — " +
          "dose adjustments frequently needed due to changing pharmacokinetics. Renal " +
          "function monitoring (calcineurin inhibitor nephrotoxicity + pregnancy changes).",
        citation: cite("ISHLT", "ISHLT Consensus Statement", 2022),
      },
      {
        type: "postpartum_management",
        description:
          "Rejection risk may increase postpartum as immune modulation reverses. Close " +
          "monitoring for rejection and graft dysfunction in the first 6 months postpartum. " +
          "Resume mycophenolate if needed (not compatible with breastfeeding).",
      },
    ],
    riskData: [
      {
        outcome: "rejection during pregnancy",
        statistic: { type: "incidence", valuePercent: 15 },
        populationDescription: "Heart transplant recipients completing pregnancy",
        citation: cite("ISHLT", "ISHLT Consensus Statement", 2022),
      },
      {
        outcome: "preeclampsia",
        statistic: { type: "incidence", valuePercent: 25 },
        populationDescription: "Heart transplant recipients completing pregnancy",
      },
    ],
    riskModifiers: [
      {
        factor: "disease_severity",
        effect:
          "Graft dysfunction (EF <45%), history of rejection within the past year, " +
          "or cardiac allograft vasculopathy significantly increases risk and may " +
          "shift timing earlier.",
      },
      {
        factor: "medication_control_status",
        effect:
          "Subtherapeutic immunosuppression levels increase rejection risk. " +
          "Supratherapeutic levels increase infection and nephrotoxicity risk.",
      },
    ],
    landmarkTrials: [
      {
        id: "esc-regitz-zagrosek-2018",
        name: "ESC Guidelines for the Management of Cardiovascular Diseases During Pregnancy (2018)",
        year: 2018,
        journalCitation: "Eur Heart J 2018;39:3165-3241",
        summary:
          "ESC guidelines address pregnancy after cardiac transplantation as part of the " +
          "cardiovascular disease in pregnancy framework, classifying most stable transplant " +
          "recipients as mWHO II-III and recommending term delivery with vaginal preferred " +
          "and close immunosuppression monitoring.",
        keyFindings: [
          "Stable heart transplant recipients: mWHO II-III; term delivery (37-39+6 weeks)",
          "Vaginal delivery preferred; cesarean for standard obstetric indications",
          "Mycophenolate mofetil is teratogenic — must be stopped ≥6 weeks before conception",
          "mTOR inhibitors (sirolimus, everolimus) are contraindicated during pregnancy",
        ],
      },
    ],
    keyEvidenceSources: [carpregII, ropac, cincinnatiScamp, anzFontanRegistry],
    interactions: [],
  },
];
