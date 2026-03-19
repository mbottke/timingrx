import type { ObstetricCondition } from "../types";
import { w, range, individualize, cite, grade } from "../helpers";

export const cardiacValvularConditions: ObstetricCondition[] = [
  {
    id: "mitral_stenosis_mild",
    name: "Mitral Stenosis, Mild (NYHA I-II)",
    category: "cardiac_valvular",
    tags: [
      "mitral stenosis",
      "MS",
      "valvular",
      "NYHA I",
      "NYHA II",
      "rheumatic heart disease",
      "mWHO II-III",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("ESC", "ESC CVD in Pregnancy", 2018), cite("ESC", "ESC CVD in Pregnancy Update", 2025)],
        timing: range(w(39), w(40, 6)),
        route: "vaginal_preferred",
        grade: grade("C"),
        notes:
          "Term delivery (>=39 wk). Vaginal delivery with early epidural and assisted " +
          "second stage to minimize tachycardia and hemodynamic swings.",
      },
    ],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "Mild mitral stenosis (valve area >1.5 cm2, NYHA I-II) is generally well tolerated " +
      "in pregnancy. The primary hemodynamic concern is the physiologic increase in heart " +
      "rate and blood volume that peaks at 28-34 weeks, which increases the transmitral " +
      "gradient and left atrial pressure.",
    physiologyExplanation:
      "Pregnancy increases cardiac output by 30-50% and heart rate by 15-20 bpm. In mitral " +
      "stenosis, the fixed valve orifice cannot accommodate the increased flow demand. " +
      "Tachycardia shortens diastolic filling time, further raising left atrial pressure. " +
      "Epidural analgesia blunts the sympathetic response to labor pain, preventing " +
      "tachycardia-driven decompensation. Assisted second stage reduces Valsalva-mediated " +
      "hemodynamic swings.",
    specialConsiderations: [
      {
        type: "anesthesia_consideration",
        description:
          "Early epidural analgesia is strongly recommended to prevent pain-driven tachycardia. " +
          "Avoid bolus IV fluids; use slow titration to prevent pulmonary edema.",
        citation: cite("ESC", "ESC CVD in Pregnancy", 2018),
      },
      {
        type: "monitoring_requirement",
        description:
          "Echocardiographic assessment each trimester. Serial monitoring of heart rate " +
          "and symptoms, especially during the third trimester volume peak (28-34 wk).",
      },
      {
        type: "medication_continuation",
        description:
          "Beta-blockers (metoprolol preferred) to control heart rate if resting HR >100 bpm " +
          "or with exertional symptoms. Diuretics for pulmonary congestion if needed.",
      },
    ],
    riskData: [
      {
        outcome: "pulmonary edema",
        statistic: { type: "incidence", valuePercent: 5.0 },
        populationDescription:
          "Pregnant women with mild-to-moderate mitral stenosis (MVA 1.0-1.5 cm², NYHA I-II); lower risk stratum",
        citation: cite("other", "Silversides et al., J Am Coll Cardiol 2009", 2009),
      },
      {
        outcome: "new-onset atrial fibrillation during pregnancy",
        statistic: { type: "incidence", valuePercent: 4.0 },
        populationDescription:
          "Women with mitral stenosis (any severity) followed prospectively during pregnancy",
        citation: cite("other", "Hameed et al., J Am Coll Cardiol 2001", 2001),
      },
    ],
    riskModifiers: [
      {
        factor: "disease_severity",
        effect:
          "Progression to NYHA III-IV or development of atrial fibrillation shifts management " +
          "to the severe category with earlier and potentially operative delivery.",
      },
    ],
    landmarkTrials: [
      {
        id: "esc-regitz-zagrosek-2018",
        name: "ESC Guidelines for the Management of Cardiovascular Diseases During Pregnancy (2018)",
        year: 2018,
        journalCitation: "Eur Heart J 2018;39:3165-3241",
        summary:
          "ESC guidelines classify mild mitral stenosis (NYHA I-II) as mWHO II-III and " +
          "recommend term vaginal delivery with early epidural analgesia and assisted second " +
          "stage to minimize tachycardia and hemodynamic swings.",
        keyFindings: [
          "Mild MS (MVA >1.5 cm², NYHA I-II): term delivery at ≥39 weeks, vaginal preferred",
          "Early epidural analgesia strongly recommended to prevent pain-driven tachycardia",
          "Beta-blockers for rate control if resting HR >100 bpm",
          "Echocardiography each trimester with close attention to third trimester volume peak",
        ],
      },
    ],
    interactions: [],
  },
  {
    id: "mitral_stenosis_severe",
    name: "Mitral Stenosis, Severe (NYHA III-IV)",
    category: "cardiac_valvular",
    tags: [
      "mitral stenosis",
      "MS",
      "severe",
      "NYHA III",
      "NYHA IV",
      "pulmonary hypertension",
      "PHT",
      "mWHO III-IV",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("ESC", "ESC CVD in Pregnancy", 2018), cite("AHA", "AHA Scientific Statement", 2020)],
        timing: individualize(
          "Hemodynamic decompensation refractory to medical therapy",
          "New or worsening pulmonary hypertension",
          "Atrial fibrillation with rapid ventricular response",
          "Progressive NYHA class despite optimization",
        ),
        route: "cesarean_preferred",
        grade: grade("C"),
        notes:
          "Individualized timing. Cesarean recommended if pulmonary hypertension is present " +
          "or if NYHA III-IV persists despite medical optimization. Vaginal delivery may " +
          "be considered in selected cases with close hemodynamic monitoring.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Severe mitral stenosis (valve area <1.0 cm2) with NYHA III-IV symptoms carries " +
      "significant risk of pulmonary edema and maternal mortality. Percutaneous mitral " +
      "balloon valvotomy (PMBV) can be performed during pregnancy if refractory to medical " +
      "therapy, ideally in the second trimester.",
    physiologyExplanation:
      "In severe MS, the markedly narrowed valve creates a critical bottleneck. The " +
      "pregnancy-associated volume expansion (up to 50%) overwhelms compensatory mechanisms, " +
      "causing left atrial hypertension, pulmonary venous congestion, and ultimately " +
      "pulmonary edema. Secondary pulmonary hypertension develops in a subset, dramatically " +
      "increasing right ventricular afterload and the risk of right heart failure.",
    specialConsiderations: [
      {
        type: "anesthesia_consideration",
        description:
          "If cesarean is planned, slow titration of epidural/spinal is preferred over general " +
          "anesthesia. Avoid rapid sympatholysis. Invasive arterial monitoring recommended.",
        citation: cite("ESC", "ESC CVD in Pregnancy", 2018),
      },
      {
        type: "delivery_site_requirement",
        description:
          "Delivery at a tertiary center with cardiac anesthesia, cardiology, and cardiac " +
          "surgery backup. Multidisciplinary cardio-obstetric team planning is essential.",
      },
      {
        type: "monitoring_requirement",
        description:
          "Consider inpatient admission in the third trimester for NYHA III-IV patients. " +
          "Continuous telemetry during labor and for 24-48 hours postpartum.",
      },
    ],
    riskData: [
      {
        outcome: "pulmonary edema",
        statistic: { type: "incidence", valuePercent: 38.0 },
        populationDescription:
          "Pregnant women with severe mitral stenosis (MVA <1.0 cm²) including NYHA III-IV; high decompensation rate",
        citation: cite("other", "Hameed et al., J Am Coll Cardiol 2001", 2001),
      },
      {
        outcome: "maternal mortality",
        statistic: { type: "mortality_rate", valuePercent: 3.0 },
        populationDescription:
          "Severe symptomatic MS in pregnancy, particularly with pulmonary hypertension; reported from South Asian and Middle Eastern cohorts",
        citation: cite("other", "Silversides et al., J Am Coll Cardiol 2009", 2009),
      },
      {
        outcome: "fetal growth restriction or preterm birth",
        statistic: { type: "incidence", valuePercent: 30.0 },
        populationDescription:
          "Pregnancies complicated by severe MS with NYHA III-IV symptoms and reduced uteroplacental perfusion",
        citation: cite("other", "Hameed et al., J Am Coll Cardiol 2001", 2001),
      },
    ],
    riskModifiers: [
      {
        factor: "disease_severity",
        effect:
          "Presence of pulmonary hypertension (PASP >50 mmHg) dramatically increases " +
          "maternal mortality risk and strongly favors cesarean delivery.",
      },
    ],
    landmarkTrials: [
      {
        id: "esc-regitz-zagrosek-2018",
        name: "ESC Guidelines for the Management of Cardiovascular Diseases During Pregnancy (2018)",
        year: 2018,
        journalCitation: "Eur Heart J 2018;39:3165-3241",
        summary:
          "ESC guidelines classify severe mitral stenosis with NYHA III-IV as mWHO III-IV " +
          "and recommend individualized delivery timing with cesarean preferred when pulmonary " +
          "hypertension is present. Percutaneous mitral balloon valvotomy can be considered " +
          "as a bridge in refractory cases.",
        keyFindings: [
          "Severe MS (MVA <1.0 cm², NYHA III-IV): individualized timing, cesarean preferred",
          "PMBV can be performed in the second trimester if refractory to medical therapy",
          "Delivery at tertiary center with cardiac anesthesia and cardiac surgery backup",
          "Pulmonary hypertension (PASP >50 mmHg) dramatically increases mortality and mandates cesarean",
        ],
      },
    ],
    interactions: [],
  },
  {
    id: "aortic_stenosis_asymptomatic",
    name: "Aortic Stenosis, Asymptomatic",
    category: "cardiac_valvular",
    tags: [
      "aortic stenosis",
      "AS",
      "asymptomatic",
      "bicuspid aortic valve",
      "BAV",
      "mWHO II-III",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("ESC", "ESC CVD in Pregnancy", 2018), cite("ACC", "ACC/AHA Valvular Heart Disease", 2020)],
        timing: range(w(39), w(40, 6)),
        route: "vaginal_preferred",
        grade: grade("C"),
        notes:
          "Term delivery. Vaginal with assisted second stage to reduce Valsalva and abrupt " +
          "afterload changes. Regional anesthesia used cautiously with slow titration.",
      },
    ],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "Asymptomatic aortic stenosis, even when moderate-to-severe by echocardiographic " +
      "criteria (AVA <1.0 cm2), is generally well tolerated in pregnancy if the patient " +
      "has normal exercise tolerance preconception. Pre-pregnancy exercise testing is key " +
      "to unmasking occult symptoms.",
    physiologyExplanation:
      "In aortic stenosis, the left ventricle faces a fixed outflow obstruction. Pregnancy " +
      "physiology (decreased SVR, increased CO) can paradoxically improve forward flow " +
      "in mild-moderate AS. However, the fixed obstruction limits the cardiac output " +
      "response to hemorrhage or epidural-induced vasodilation, making abrupt preload " +
      "and afterload changes dangerous. Slow titration of regional anesthesia avoids " +
      "precipitous drops in SVR.",
    specialConsiderations: [
      {
        type: "anesthesia_consideration",
        description:
          "Regional anesthesia acceptable but must be titrated slowly to avoid acute " +
          "hypotension. Maintain preload; avoid vasodilators. Phenylephrine preferred " +
          "vasopressor (maintains SVR).",
        citation: cite("ESC", "ESC CVD in Pregnancy", 2018),
      },
      {
        type: "monitoring_requirement",
        description:
          "Echocardiography each trimester to monitor gradient progression and LV function. " +
          "Intrapartum arterial line monitoring for severe AS.",
      },
    ],
    riskData: [
      {
        outcome: "cardiac event (pulmonary edema, arrhythmia, or cardiac arrest) during pregnancy",
        statistic: { type: "incidence", valuePercent: 10.0 },
        populationDescription:
          "Asymptomatic severe AS (AVA <1.0 cm²) with normal exercise tolerance; event rates from the CARPREG II registry",
        citation: cite("other", "Silversides et al., J Am Coll Cardiol 2018", 2018),
      },
      {
        outcome: "new symptom development during pregnancy (reclassification to symptomatic)",
        statistic: { type: "incidence", valuePercent: 25.0 },
        populationDescription:
          "Women with severe AS deemed asymptomatic pre-pregnancy; unmasked by pregnancy-associated hemodynamic increase",
        citation: cite("other", "Lesniak-Sobelga et al., Int J Cardiol 2004", 2004),
      },
    ],
    riskModifiers: [
      {
        factor: "disease_severity",
        effect:
          "Development of symptoms (syncope, angina, dyspnea) at any point shifts management " +
          "to the symptomatic severe category with individualized delivery and cesarean preference.",
      },
    ],
    landmarkTrials: [
      {
        id: "esc-regitz-zagrosek-2018",
        name: "ESC Guidelines for the Management of Cardiovascular Diseases During Pregnancy (2018)",
        year: 2018,
        journalCitation: "Eur Heart J 2018;39:3165-3241",
        summary:
          "ESC guidelines classify asymptomatic aortic stenosis as mWHO II-III and recommend " +
          "term vaginal delivery with assisted second stage, slow titration of regional anesthesia, " +
          "and echocardiographic surveillance each trimester.",
        keyFindings: [
          "Asymptomatic severe AS (AVA <1.0 cm²) with normal exercise tolerance: term delivery",
          "Vaginal delivery with assisted second stage; avoid abrupt afterload changes",
          "Regional anesthesia titrated slowly to avoid acute SVR drop",
          "Pre-pregnancy exercise testing key to unmasking occult symptoms before pregnancy",
        ],
      },
    ],
    interactions: [],
  },
  {
    id: "aortic_stenosis_severe_symptomatic",
    name: "Aortic Stenosis, Severe Symptomatic",
    category: "cardiac_valvular",
    tags: [
      "aortic stenosis",
      "AS",
      "severe",
      "symptomatic",
      "syncope",
      "heart failure",
      "mWHO III-IV",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("ESC", "ESC CVD in Pregnancy", 2018)],
        timing: individualize(
          "Refractory heart failure despite medical optimization",
          "Syncope or presyncope",
          "Progressive LV dysfunction (EF decline)",
          "Angina limiting activity",
        ),
        route: "cesarean_preferred",
        grade: grade("C"),
        notes:
          "Individualized timing based on hemodynamic status. Cesarean recommended to " +
          "avoid unpredictable hemodynamic shifts of labor. Balloon aortic valvuloplasty " +
          "can be considered as a bridge in refractory cases.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Severe symptomatic AS in pregnancy is high risk (mWHO III-IV). Percutaneous " +
      "balloon aortic valvuloplasty (BAV) can be performed as a palliative bridge to " +
      "delivery if symptoms are refractory to medical therapy, typically in the second " +
      "trimester. Surgical aortic valve replacement during pregnancy carries significant " +
      "fetal mortality (20-30%).",
    physiologyExplanation:
      "Symptomatic severe AS indicates that the left ventricle can no longer compensate " +
      "for the fixed obstruction. The added hemodynamic demands of pregnancy (increased " +
      "preload, decreased afterload, tachycardia) push the LV beyond its compensatory " +
      "reserve. The risk of sudden cardiac death is present with exertion, including " +
      "labor. Cesarean under controlled hemodynamic conditions is preferred.",
    specialConsiderations: [
      {
        type: "anesthesia_consideration",
        description:
          "General anesthesia or carefully titrated epidural with invasive hemodynamic " +
          "monitoring (arterial line, +/- PA catheter). Maintain sinus rhythm, SVR, and " +
          "preload. Avoid tachycardia and hypotension.",
        citation: cite("ESC", "ESC CVD in Pregnancy", 2018),
      },
      {
        type: "delivery_site_requirement",
        description:
          "Tertiary center with cardiac surgery capability on standby. Multidisciplinary " +
          "cardio-obstetric team mandatory.",
      },
    ],
    riskData: [
      {
        outcome: "maternal mortality",
        statistic: { type: "mortality_rate", valuePercent: 5.0 },
        populationDescription:
          "Symptomatic severe AS in pregnancy; mortality risk concentrated in those with heart failure or syncope",
        citation: cite("other", "Lesniak-Sobelga et al., Int J Cardiol 2004", 2004),
      },
      {
        outcome: "cardiac heart failure or pulmonary edema requiring urgent delivery",
        statistic: { type: "incidence", valuePercent: 40.0 },
        populationDescription:
          "Women with severe symptomatic AS (NYHA III-IV) during pregnancy requiring individualized management",
        citation: cite("other", "Silversides et al., J Am Coll Cardiol 2018", 2018),
      },
      {
        outcome: "fetal mortality with intrapartum cardiac surgery (aortic valve replacement)",
        statistic: { type: "mortality_rate", valuePercent: 25.0 },
        populationDescription:
          "On-pump cardiac surgery during pregnancy; fetal loss driven by hypothermia, non-pulsatile flow, and uteroplacental ischemia",
        citation: cite("other", "John et al., J Thorac Cardiovasc Surg 2011", 2011),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [
      {
        id: "esc-regitz-zagrosek-2018",
        name: "ESC Guidelines for the Management of Cardiovascular Diseases During Pregnancy (2018)",
        year: 2018,
        journalCitation: "Eur Heart J 2018;39:3165-3241",
        summary:
          "ESC guidelines classify symptomatic severe aortic stenosis as mWHO III-IV and " +
          "recommend individualized delivery timing with cesarean preferred to avoid unpredictable " +
          "hemodynamic shifts of labor. Balloon aortic valvuloplasty can be considered as a " +
          "bridge in refractory cases.",
        keyFindings: [
          "Symptomatic severe AS: individualized timing driven by hemodynamic status",
          "Cesarean recommended to avoid unpredictable hemodynamic shifts of labor",
          "Percutaneous BAV can be used as a palliative bridge if refractory to medical therapy",
          "Surgical AVR carries ~25% fetal mortality and is last resort during pregnancy",
        ],
      },
    ],
    interactions: [],
  },
  {
    id: "mechanical_heart_valve",
    name: "Mechanical Heart Valve",
    category: "cardiac_valvular",
    tags: [
      "mechanical valve",
      "prosthetic valve",
      "anticoagulation",
      "warfarin",
      "VKA",
      "LMWH",
      "bridging",
      "mWHO III",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("ESC", "ESC CVD in Pregnancy Update", 2025), cite("AHA", "AHA Scientific Statement", 2020)],
        timing: range(w(36), w(38)),
        route: "vaginal_preferred",
        grade: grade("C"),
        notes:
          "Planned delivery at 36-38 weeks driven by anticoagulation bridging logistics. " +
          "Vaginal delivery preferred if anticoagulation adequately bridged. Cesarean if " +
          "VKA (warfarin) within 2 weeks of delivery due to fetal anticoagulation and " +
          "risk of neonatal intracranial hemorrhage during vaginal birth.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Mechanical heart valves in pregnancy represent one of the highest-risk scenarios " +
      "in cardio-obstetrics due to the competing risks of valve thrombosis (if " +
      "underanticoagulated) and hemorrhage (if overanticoagulated). The 36-38 week " +
      "delivery window is driven entirely by anticoagulation bridging requirements, " +
      "not by cardiac hemodynamics per se.",
    physiologyExplanation:
      "Pregnancy is a hypercoagulable state with increases in factors VII, VIII, X, " +
      "fibrinogen, and von Willebrand factor, along with decreased protein S. This " +
      "markedly increases the risk of mechanical valve thrombosis — the most feared " +
      "complication, carrying up to 25% mortality. The physiologic hypercoagulability " +
      "peaks in the third trimester and early postpartum, precisely when anticoagulation " +
      "management is most complex.",
    specialConsiderations: [
      {
        type: "anticoagulation_bridging",
        description:
          "Anticoagulation bridging protocol: (1) Discontinue warfarin at least 7 days " +
          "before planned delivery (by 35-36 wk). (2) Bridge with therapeutic-dose LMWH " +
          "(enoxaparin 1 mg/kg q12h, adjusted to anti-Xa 0.8-1.2 U/mL 4-6h post-dose). " +
          "(3) Hold LMWH 24 hours before planned delivery. (4) Restart LMWH 4-6 hours " +
          "after vaginal delivery or 6-12 hours after cesarean (if hemostasis secured). " +
          "(5) Transition back to warfarin postpartum with LMWH overlap until INR " +
          "therapeutic for 48 hours. Warfarin is safe during breastfeeding.",
        timing: "Begin bridging protocol at 35-36 weeks; delivery at 36-38 weeks",
        citation: cite("ESC", "ESC CVD in Pregnancy Update", 2025),
      },
      {
        type: "anticoagulation_bridging",
        description:
          "If a patient presents in labor on warfarin, cesarean delivery is strongly " +
          "preferred to avoid fetal intracranial hemorrhage during passage through the " +
          "birth canal (the fetus is also anticoagulated by transplacental warfarin). " +
          "Administer vitamin K and FFP/PCC to the neonate if delivered while on VKA.",
        citation: cite("AHA", "AHA Scientific Statement", 2020),
      },
      {
        type: "medication_continuation",
        description:
          "Warfarin regimen during pregnancy varies by dose: low-dose warfarin (<=5 mg/day) " +
          "throughout pregnancy is ESC preferred (lowest valve thrombosis risk). " +
          "High-dose warfarin (>5 mg/day) — switch to LMWH in the first trimester " +
          "(weeks 6-12) to reduce embryopathy risk, then resume warfarin in the second " +
          "trimester. Warfarin embryopathy risk is dose-dependent: ~0.5% at <=5 mg vs " +
          "~6% at >5 mg.",
        citation: cite("ESC", "ESC CVD in Pregnancy Update", 2025),
      },
      {
        type: "monitoring_requirement",
        description:
          "Weekly anti-Xa levels when on LMWH (target peak 0.8-1.2 U/mL at 4-6h post-dose). " +
          "INR monitoring every 1-2 weeks when on warfarin. Echocardiography if any " +
          "symptoms suggestive of valve dysfunction or thrombosis.",
      },
      {
        type: "contraindication",
        description:
          "DOACs (dabigatran, rivarelbaban, apixaban, edoxaban) are contraindicated in pregnancy " +
          "AND with mechanical valves (RE-ALIGN trial: excess thrombosis with dabigatran " +
          "on mechanical valves). UFH is inferior to LMWH for bridging.",
        citation: cite("ESC", "ESC CVD in Pregnancy", 2018),
      },
    ],
    riskData: [
      {
        outcome: "valve thrombosis during pregnancy",
        statistic: { type: "incidence", valuePercent: 4.7 },
        populationDescription: "Women with mechanical valves on LMWH throughout pregnancy",
        citation: cite("ESC", "ESC CVD in Pregnancy", 2018),
      },
    ],
    riskModifiers: [
      {
        factor: "medication_control_status",
        effect:
          "Subtherapeutic anticoagulation at any point dramatically increases valve " +
          "thrombosis risk. Anti-Xa levels must be monitored weekly.",
      },
    ],
    landmarkTrials: [
      {
        id: "esc-regitz-zagrosek-2018",
        name: "ESC Guidelines for the Management of Cardiovascular Diseases During Pregnancy (2018)",
        year: 2018,
        journalCitation: "Eur Heart J 2018;39:3165-3241",
        summary:
          "ESC guidelines classify mechanical heart valves as mWHO III and provide the " +
          "primary framework for anticoagulation management in pregnancy, including low-dose " +
          "warfarin preference throughout pregnancy and planned delivery at 36-38 weeks " +
          "to allow anticoagulation bridging.",
        keyFindings: [
          "Low-dose warfarin (≤5 mg/day) throughout pregnancy preferred (lowest valve thrombosis risk)",
          "High-dose warfarin (>5 mg/day): switch to LMWH in weeks 6-12 to reduce embryopathy",
          "Planned delivery at 36-38 weeks driven by anticoagulation bridging logistics",
          "DOACs are absolutely contraindicated with mechanical valves in pregnancy",
        ],
      },
    ],
    interactions: [],
  },
  {
    id: "bicuspid_aortic_valve",
    name: "Bicuspid Aortic Valve (Aorta <45 mm)",
    category: "cardiac_valvular",
    tags: [
      "bicuspid aortic valve",
      "BAV",
      "aortopathy",
      "ascending aorta",
      "mWHO II",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("ACC", "ACC/AHA Aortic Disease", 2022)],
        timing: range(w(39), w(40, 6)),
        route: "vaginal_preferred",
        grade: grade("C"),
        notes:
          "Term delivery. Vaginal delivery appropriate when ascending aorta <45 mm " +
          "and no significant valvular dysfunction.",
      },
    ],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "Bicuspid aortic valve (BAV) is present in 1-2% of the population and is the most " +
      "common congenital heart defect. The primary pregnancy concerns are associated " +
      "aortopathy (ascending aortic dilation) and aortic valve dysfunction (stenosis " +
      "or regurgitation). When the aorta is <45 mm and valve function is preserved, " +
      "pregnancy outcomes are generally favorable.",
    physiologyExplanation:
      "BAV-associated aortopathy involves intrinsic medial degeneration of the ascending " +
      "aorta (cystic medial necrosis) independent of hemodynamic valve dysfunction. " +
      "Pregnancy-associated hormonal changes (increased estrogen, relaxin) further " +
      "weaken the aortic media, adding to the baseline connective tissue abnormality. " +
      "When the aorta is <45 mm, the dissection risk during pregnancy is low but not zero.",
    specialConsiderations: [
      {
        type: "imaging_surveillance",
        description:
          "Baseline echocardiogram with aortic root and ascending aorta measurements. " +
          "Repeat each trimester and at 6 weeks postpartum. Urgent imaging if new " +
          "chest/back pain develops.",
        citation: cite("ACC", "ACC/AHA Aortic Disease", 2022),
      },
      {
        type: "monitoring_requirement",
        description:
          "If ascending aorta approaches 45 mm or grows >5 mm during pregnancy, reclassify " +
          "to aortopathy protocol with earlier delivery consideration and cesarean.",
      },
    ],
    riskData: [
      {
        outcome: "aortic dissection during pregnancy",
        statistic: { type: "incidence", valuePercent: 0.3 },
        populationDescription:
          "BAV with ascending aorta <45 mm; low absolute risk but higher than general obstetric population",
        citation: cite("other", "Tzemos et al., JAMA 2008", 2008),
      },
      {
        outcome: "aortic root or ascending aorta growth ≥3 mm during pregnancy",
        statistic: { type: "incidence", valuePercent: 20.0 },
        populationDescription:
          "BAV patients with serial echocardiographic surveillance through gestation",
        citation: cite("other", "Kaplan et al., Am J Cardiol 2016", 2016),
      },
    ],
    riskModifiers: [
      {
        factor: "disease_severity",
        effect:
          "Aortic root >45 mm, rapid growth (>5 mm/pregnancy), or family history of " +
          "dissection shifts management to the Marfan/aortopathy pathway with earlier " +
          "delivery and cesarean.",
      },
    ],
    landmarkTrials: [
      {
        id: "esc-regitz-zagrosek-2018",
        name: "ESC Guidelines for the Management of Cardiovascular Diseases During Pregnancy (2018)",
        year: 2018,
        journalCitation: "Eur Heart J 2018;39:3165-3241",
        summary:
          "ESC guidelines (and ACC/AHA 2022 aortic disease guidelines) classify BAV with " +
          "ascending aorta <45 mm as mWHO II and recommend term vaginal delivery with " +
          "echocardiographic surveillance each trimester.",
        keyFindings: [
          "BAV with aorta <45 mm: term delivery (39-40+6 weeks), vaginal delivery appropriate",
          "Echocardiography each trimester with ascending aorta measurements",
          "Reclassify to aortopathy protocol if aorta approaches 45 mm or grows >5 mm",
          "Associated with intrinsic medial degeneration — monitor even when valve function is preserved",
        ],
      },
    ],
    interactions: [],
  },
];
