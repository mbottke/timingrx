import type { ObstetricCondition } from "../types";
import { w, range, individualize, cite, grade } from "../helpers";
import { carpregII, ropac } from "../evidence-sources";

export const cardiacAortopathyConditions: ObstetricCondition[] = [
  {
    id: "marfan_syndrome",
    name: "Marfan Syndrome",
    category: "cardiac_aortopathy",
    tags: [
      "Marfan",
      "Marfan syndrome",
      "aortopathy",
      "aortic root",
      "FBN1",
      "connective tissue disorder",
      "aortic dissection",
    ],
    stratificationAxis: "aortic root diameter",
    guidelineRecommendations: [],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Marfan syndrome is an autosomal dominant connective tissue disorder (FBN1 mutation) " +
      "with a prevalence of 1:5,000. The primary pregnancy risk is aortic dissection, which " +
      "occurs most often in the third trimester or early postpartum when hemodynamic stress " +
      "is greatest. Risk is stratified by aortic root diameter, rate of growth, and family " +
      "history of dissection.",
    physiologyExplanation:
      "Fibrillin-1 deficiency leads to fragmentation of elastic fibers in the aortic media " +
      "(cystic medial degeneration), weakening the aortic wall. Pregnancy compounds this " +
      "through three mechanisms: (1) increased cardiac output and stroke volume raise " +
      "aortic wall stress, (2) estrogen-mediated inhibition of collagen and elastin " +
      "deposition in the aortic wall, and (3) relaxin-induced extracellular matrix " +
      "remodeling. The combination of intrinsic wall weakness and pregnancy-induced " +
      "hemodynamic/hormonal changes creates the substrate for dissection.",
    specialConsiderations: [
      {
        type: "medication_continuation",
        description:
          "Beta-blocker therapy (metoprolol or atenolol) should continue throughout pregnancy " +
          "and postpartum for all Marfan patients, targeting resting HR <100 bpm. " +
          "ACE inhibitors and ARBs are contraindicated in pregnancy.",
        citation: cite("ESC", "ESC CVD in Pregnancy", 2018),
      },
      {
        type: "imaging_surveillance",
        description:
          "Echocardiographic measurement of aortic root diameter every trimester (every 4-8 " +
          "weeks if root >40 mm or growing). Repeat at 6 weeks postpartum. MRI without " +
          "gadolinium can be used if echocardiographic windows are suboptimal.",
        citation: cite("ESC", "ESC CVD in Pregnancy", 2018),
      },
      {
        type: "postpartum_management",
        description:
          "The postpartum period carries continued dissection risk for 6-12 months. Maintain " +
          "beta-blocker therapy and echocardiographic surveillance. Resume ARB/losartan " +
          "postpartum if not breastfeeding.",
      },
    ],
    riskData: [
      {
        outcome: "aortic dissection during pregnancy or postpartum",
        statistic: { type: "incidence", valuePercent: 4.5 },
        populationDescription:
          "Women with Marfan syndrome (all aortic root sizes) across registry data",
        citation: cite("other", "Meijboom et al., JACC 2005", 2005),
      },
      {
        outcome: "maternal cardiac mortality",
        statistic: { type: "mortality_rate", valuePercent: 1.0 },
        populationDescription:
          "Pregnant women with Marfan syndrome in European observational cohorts",
        citation: cite("other", "Regitz-Zagrosek et al., Eur Heart J 2018", 2018),
      },
      {
        outcome: "preterm birth",
        statistic: { type: "incidence", valuePercent: 20.0 },
        populationDescription:
          "Pregnancies complicated by Marfan syndrome; elevated across all aortic root sizes",
        citation: cite("other", "Donnelly et al., Heart 2012", 2012),
      },
    ],
    riskModifiers: [
      {
        factor: "disease_severity",
        effect:
          "Family history of aortic dissection at <40 mm root diameter increases risk " +
          "regardless of current measurements and shifts management earlier.",
      },
      {
        factor: "other",
        effect:
          "Rapid aortic root growth (>5 mm during pregnancy or >3 mm/year pre-pregnancy) " +
          "is an independent risk factor for dissection, even if absolute diameter is <40 mm.",
      },
    ],
    landmarkTrials: [
      {
        id: "esc-regitz-zagrosek-2018",
        name: "ESC Guidelines for the Management of Cardiovascular Diseases During Pregnancy (2018)",
        year: 2018,
        journalCitation: "Eur Heart J 2018;39:3165-3241",
        summary:
          "Comprehensive ESC guidelines covering management of all cardiovascular conditions in " +
          "pregnancy, including risk classification using the modified WHO (mWHO) system. " +
          "Provides delivery timing and route recommendations for aortopathy including Marfan syndrome.",
        keyFindings: [
          "mWHO IV classification for aortic root >45 mm in Marfan syndrome — pregnancy contraindicated",
          "Recommends echocardiographic surveillance every trimester in Marfan syndrome",
          "Beta-blocker therapy throughout pregnancy and postpartum for all Marfan patients",
          "Pre-pregnancy aortic root repair recommended if >45 mm before conception",
        ],
      },
    ],
    keyEvidenceSources: [carpregII, ropac],
    interactions: [],
    subVariants: [
      {
        id: "marfan_root_lt40",
        name: "Marfan Syndrome, Aortic Root <40 mm",
        category: "cardiac_aortopathy",
        tags: ["Marfan", "aortic root", "<40 mm", "low risk", "mWHO II-III"],
        parentConditionId: "marfan_syndrome",
        guidelineRecommendations: [
          {
            citations: [
              cite("ESC", "ESC CVD in Pregnancy", 2018),
              cite("ACC", "ACC/AHA Aortic Disease", 2022),
            ],
            timing: range(w(39), w(40, 6)),
            route: "vaginal_preferred",
            grade: grade("C"),
            notes:
              "Term delivery. Vaginal with assisted second stage and regional anesthesia. " +
              "Avoid Valsalva to limit aortic wall stress peaks.",
          },
        ],
        pastFortyWeeks: "no",
        specialConsiderations: [],
        riskData: [
          {
            outcome: "aortic dissection during pregnancy",
            statistic: { type: "incidence", valuePercent: 1.0 },
            populationDescription:
              "Marfan syndrome with aortic root <40 mm; lower end of observed dissection risk",
            citation: cite("other", "Meijboom et al., JACC 2005", 2005),
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
              "ESC guidelines classify Marfan syndrome with aortic root <40 mm as mWHO II-III " +
              "and recommend term vaginal delivery with assisted second stage and regional anesthesia.",
            keyFindings: [
              "Aortic root <40 mm: term delivery (39-40+6 weeks), vaginal with assisted second stage",
              "Avoid Valsalva to limit aortic wall stress peaks",
              "Beta-blocker therapy and trimester echocardiographic surveillance throughout pregnancy",
            ],
          },
        ],
        keyEvidenceSources: [carpregII, ropac],
    interactions: [],
      },
      {
        id: "marfan_root_40_45",
        name: "Marfan Syndrome, Aortic Root 40-45 mm",
        category: "cardiac_aortopathy",
        tags: ["Marfan", "aortic root", "40-45 mm", "moderate risk", "mWHO III"],
        parentConditionId: "marfan_syndrome",
        guidelineRecommendations: [
          {
            citations: [
              cite("ESC", "ESC CVD in Pregnancy", 2018),
              cite("ACC", "ACC/AHA Aortic Disease", 2022),
            ],
            timing: range(w(39), w(40, 6)),
            route: "either",
            grade: grade("C"),
            notes:
              "Term delivery unless rapid aortic root growth (>5 mm during pregnancy) is " +
              "documented, in which case earlier delivery and cesarean are indicated. " +
              "Vaginal vs cesarean is individualized based on growth trajectory and " +
              "family history.",
          },
        ],
        pastFortyWeeks: "no",
        specialConsiderations: [
          {
            type: "imaging_surveillance",
            description:
              "Echocardiography every 4-6 weeks given proximity to the 45 mm threshold. " +
              "Any growth >3 mm in a single trimester warrants multidisciplinary reassessment " +
              "and consideration of earlier delivery.",
          },
        ],
        riskData: [
          {
            outcome: "aortic dissection during pregnancy or postpartum",
            statistic: { type: "incidence", valuePercent: 10.0 },
            populationDescription:
              "Marfan syndrome with aortic root 40-45 mm; markedly elevated dissection risk vs <40 mm",
            citation: cite("other", "Meijboom et al., JACC 2005", 2005),
          },
          {
            outcome: "rapid aortic root growth (>5 mm during pregnancy)",
            statistic: { type: "incidence", valuePercent: 20.0 },
            populationDescription:
              "Marfan pregnancies with pre-pregnancy root 40-45 mm requiring serial echocardiography",
            citation: cite("other", "Donnelly et al., Heart 2012", 2012),
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
              "ESC guidelines classify Marfan syndrome with aortic root 40-45 mm as mWHO III " +
              "and recommend individualized delivery timing with echocardiography every 4-6 weeks " +
              "and cesarean if rapid growth is documented.",
            keyFindings: [
              "Aortic root 40-45 mm: term delivery unless rapid growth (>5 mm during pregnancy)",
              "Rapid growth triggers earlier delivery and cesarean",
              "Echocardiography every 4-6 weeks given proximity to the 45 mm threshold",
            ],
          },
        ],
        keyEvidenceSources: [carpregII, ropac],
    interactions: [],
      },
      {
        id: "marfan_root_gt45",
        name: "Marfan Syndrome, Aortic Root >45 mm",
        category: "cardiac_aortopathy",
        tags: [
          "Marfan",
          "aortic root",
          ">45 mm",
          "high risk",
          "mWHO IV",
          "pregnancy contraindicated",
        ],
        parentConditionId: "marfan_syndrome",
        guidelineRecommendations: [
          {
            citations: [cite("ESC", "ESC CVD in Pregnancy", 2018)],
            timing: individualize(
              "Pregnancy is contraindicated (mWHO IV)",
              "If already pregnant, early planned delivery to minimize dissection risk",
              "Urgent delivery if aortic dissection occurs or root grows rapidly",
            ),
            route: "cesarean_required",
            grade: grade("C"),
            notes:
              "Pregnancy is contraindicated at aortic root >45 mm (mWHO IV). If pregnancy " +
              "occurs, early delivery by cesarean is recommended to minimize the duration " +
              "of exposure to pregnancy-associated hemodynamic and hormonal stress. " +
              "Pre-pregnancy aortic root replacement should be offered.",
          },
        ],
        pastFortyWeeks: "no",
        clinicalNotes:
          "Aortic root >45 mm in Marfan syndrome carries a high risk of Type A dissection " +
          "during pregnancy. Pre-pregnancy counseling should strongly recommend aortic root " +
          "replacement (David procedure or Bentall) before conception. If pregnancy is " +
          "discovered, multidisciplinary management with cardiothoracic surgery on standby " +
          "is mandatory.",
        specialConsiderations: [
          {
            type: "contraindication",
            description:
              "Pregnancy is contraindicated (mWHO IV classification). Pre-pregnancy aortic " +
              "root repair (David or Bentall procedure) should be offered before conception.",
            citation: cite("ESC", "ESC CVD in Pregnancy", 2018),
          },
          {
            type: "delivery_site_requirement",
            description:
              "Must deliver at a center with on-site cardiothoracic surgery capability " +
              "and a multidisciplinary aorta team. Operating room must be prepared for " +
              "emergency aortic repair.",
          },
        ],
        riskData: [
          {
            outcome: "aortic dissection during pregnancy or peripartum",
            statistic: { type: "incidence", valuePercent: 25.0 },
            populationDescription:
              "Marfan syndrome with aortic root >45 mm; pregnancy is contraindicated (mWHO IV)",
            citation: cite("other", "Meijboom et al., JACC 2005", 2005),
          },
          {
            outcome: "maternal mortality from Type A dissection",
            statistic: { type: "mortality_rate", valuePercent: 30.0 },
            populationDescription:
              "Acute Type A aortic dissection in pregnancy without emergent surgical repair",
            citation: cite("other", "Regitz-Zagrosek et al., Eur Heart J 2018", 2018),
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
              "ESC guidelines classify Marfan syndrome with aortic root >45 mm as mWHO IV " +
              "(pregnancy contraindicated) and recommend pre-pregnancy aortic root repair. " +
              "If pregnancy occurs, early planned cesarean delivery is indicated.",
            keyFindings: [
              "Aortic root >45 mm: pregnancy contraindicated (mWHO IV)",
              "Pre-pregnancy aortic root repair (David or Bentall procedure) recommended before conception",
              "If already pregnant: early planned cesarean delivery by a multidisciplinary team",
              "Mandatory delivery at a center with on-site cardiothoracic surgery",
            ],
          },
        ],
        keyEvidenceSources: [carpregII, ropac],
    interactions: [],
      },
    ],
  },
  {
    id: "aortic_dissection_chronic",
    name: "Aortic Dissection, Chronic Stable",
    category: "cardiac_aortopathy",
    tags: [
      "aortic dissection",
      "chronic dissection",
      "Type B dissection",
      "DeBakey",
      "Stanford",
      "mWHO III-IV",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("ESC", "ESC CVD in Pregnancy", 2018)],
        timing: individualize(
          "Often planned at 34-36 weeks to balance prematurity against dissection extension risk",
          "Hemodynamic instability or dissection propagation",
          "Development of malperfusion syndrome",
          "Uncontrollable hypertension despite maximal medical therapy",
        ),
        route: "cesarean_preferred",
        grade: grade("C"),
        notes:
          "Individualized timing, often 34-36 weeks. Cesarean delivery to avoid the " +
          "hemodynamic surges of labor (Valsalva, catecholamine release) that could " +
          "propagate the dissection.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Chronic stable aortic dissection in pregnancy is rare and extremely high risk. " +
      "Most cases are Type B (descending aorta) that were diagnosed before or early in " +
      "pregnancy. Strict blood pressure control (SBP <120 mmHg) and heart rate control " +
      "(HR <80 bpm) with beta-blockers are the cornerstone of management.",
    physiologyExplanation:
      "In chronic aortic dissection, the intimal flap creates a false lumen that can " +
      "propagate with increased aortic wall stress. Pregnancy increases wall stress via " +
      "higher cardiac output, blood volume, and heart rate. Additionally, pregnancy-associated " +
      "connective tissue changes (estrogen, relaxin) weaken the already compromised aortic " +
      "wall. The goal is to minimize the duration of pregnancy-associated hemodynamic " +
      "stress while achieving fetal viability.",
    specialConsiderations: [
      {
        type: "medication_continuation",
        description:
          "Aggressive beta-blocker therapy (target HR <80 bpm, SBP <120 mmHg) throughout " +
          "pregnancy. Labetalol is first-line. Add hydralazine or nifedipine if additional " +
          "BP control is needed. ACE inhibitors/ARBs are contraindicated.",
        citation: cite("ESC", "ESC CVD in Pregnancy", 2018),
      },
      {
        type: "imaging_surveillance",
        description:
          "MRI without gadolinium or echocardiography every 4 weeks to monitor false lumen " +
          "size, branch vessel involvement, and any propagation. CT angiography reserved " +
          "for acute concerns.",
      },
      {
        type: "delivery_site_requirement",
        description:
          "Delivery must occur at a center with cardiothoracic surgery and aortic surgery " +
          "expertise. Operating room must be prepared for emergency aortic intervention.",
      },
      {
        type: "anesthesia_consideration",
        description:
          "General anesthesia with controlled hemodynamics for cesarean delivery. Avoid " +
          "hypertensive surges during intubation (esmolol, remifentanil). Invasive " +
          "arterial monitoring mandatory.",
      },
    ],
    riskData: [
      {
        outcome: "dissection propagation or aortic complication during pregnancy",
        statistic: { type: "incidence", valuePercent: 15.0 },
        populationDescription:
          "Women with known chronic aortic dissection (predominantly Type B) managed through pregnancy; based on case series and registry reports",
        citation: cite("other", "Goland et al., Int J Cardiol 2009", 2009),
      },
      {
        outcome: "maternal mortality",
        statistic: { type: "mortality_rate", valuePercent: 5.0 },
        populationDescription:
          "Pregnancies complicated by chronic aortic dissection at tertiary centers",
        citation: cite("other", "Regitz-Zagrosek et al., Eur Heart J 2018", 2018),
      },
    ],
    riskModifiers: [
      {
        factor: "disease_severity",
        effect:
          "Type A dissection (involving ascending aorta) carries higher risk than Type B " +
          "and may necessitate earlier delivery or emergency aortic repair with concurrent " +
          "cesarean.",
      },
    ],
    landmarkTrials: [
      {
        id: "esc-regitz-zagrosek-2018",
        name: "ESC Guidelines for the Management of Cardiovascular Diseases During Pregnancy (2018)",
        year: 2018,
        journalCitation: "Eur Heart J 2018;39:3165-3241",
        summary:
          "ESC guidelines provide the primary evidence-based framework for managing aortic " +
          "dissection in pregnancy, recommending strict blood pressure and heart rate targets, " +
          "individualized delivery timing (often 34-36 weeks), and cesarean delivery to avoid " +
          "hemodynamic surges of labor.",
        keyFindings: [
          "Aggressive beta-blocker therapy (HR <80 bpm, SBP <120 mmHg) throughout pregnancy",
          "MRI without gadolinium recommended for serial surveillance of dissection extent",
          "Cesarean delivery preferred to minimize Valsalva and catecholamine surges",
          "Delivery at a center with cardiothoracic surgery capability is mandatory",
        ],
      },
    ],
    keyEvidenceSources: [carpregII, ropac],
    interactions: [],
  },
  {
    id: "coarctation_aorta_repaired",
    name: "Coarctation of Aorta, Repaired",
    category: "cardiac_aortopathy",
    tags: [
      "coarctation",
      "aortic coarctation",
      "CoA",
      "repaired",
      "congenital heart disease",
      "mWHO II",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("ESC", "ESC CVD in Pregnancy", 2018)],
        timing: range(w(39), w(40, 6)),
        route: "vaginal_preferred",
        grade: grade("C"),
        notes:
          "Term delivery. Vaginal delivery with blood pressure monitoring in the right arm " +
          "(proximal to repair site). Assisted second stage to avoid Valsalva and minimize " +
          "acute aortic wall stress.",
      },
    ],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "Repaired coarctation of the aorta without residual aneurysm or re-coarctation is " +
      "generally well tolerated in pregnancy (mWHO II). Key concerns include residual " +
      "hypertension (present in up to 30% even after successful repair), re-coarctation " +
      "at the repair site, and associated bicuspid aortic valve (present in 50-80% of CoA).",
    physiologyExplanation:
      "Coarctation creates a fixed aortic narrowing with proximal hypertension and distal " +
      "hypoperfusion. Even after repair, vascular remodeling may be incomplete with residual " +
      "proximal stiffness and endothelial dysfunction. Pregnancy-associated volume expansion " +
      "increases the hemodynamic burden on the proximal aorta. The Valsalva maneuver during " +
      "pushing generates acute spikes in aortic wall stress, creating risk at the repair " +
      "site or in a previously dilated proximal aorta.",
    specialConsiderations: [
      {
        type: "monitoring_requirement",
        description:
          "Blood pressure should be measured in the right arm (proximal to repair). " +
          "Four-limb BP assessment at baseline to assess gradient. Echocardiography each " +
          "trimester including assessment of repair site, ascending aorta, and bicuspid " +
          "valve if present.",
        citation: cite("ESC", "ESC CVD in Pregnancy", 2018),
      },
      {
        type: "anesthesia_consideration",
        description:
          "Regional anesthesia is preferred for vaginal delivery. Avoid Valsalva with " +
          "assisted second stage (vacuum or forceps). Maintain adequate preload.",
      },
      {
        type: "medication_continuation",
        description:
          "Continue antihypertensives if used pre-pregnancy. Target BP <140/90 mmHg. " +
          "Switch ACE inhibitors/ARBs to labetalol or nifedipine for pregnancy.",
      },
    ],
    riskData: [
      {
        outcome: "hypertensive disorder of pregnancy (gestational hypertension or preeclampsia)",
        statistic: { type: "incidence", valuePercent: 30.0 },
        populationDescription:
          "Women with repaired coarctation of the aorta; residual vascular stiffness drives elevated rates vs general obstetric population",
        citation: cite("other", "Beauchesne et al., J Am Coll Cardiol 2001", 2001),
      },
      {
        outcome: "re-coarctation or aneurysm at repair site requiring intervention",
        statistic: { type: "incidence", valuePercent: 5.0 },
        populationDescription:
          "Women with prior surgical or transcatheter coarctation repair followed through pregnancy",
        citation: cite("other", "Vriend et al., Eur Heart J 2005", 2005),
      },
    ],
    riskModifiers: [
      {
        factor: "disease_severity",
        effect:
          "Residual aneurysm at the repair site or ascending aortic dilation >45 mm " +
          "shifts management to higher-risk protocol with earlier delivery and cesarean " +
          "consideration.",
      },
    ],
    landmarkTrials: [
      {
        id: "esc-regitz-zagrosek-2018",
        name: "ESC Guidelines for the Management of Cardiovascular Diseases During Pregnancy (2018)",
        year: 2018,
        journalCitation: "Eur Heart J 2018;39:3165-3241",
        summary:
          "ESC guidelines classify repaired coarctation of the aorta as mWHO II (generally " +
          "well tolerated in pregnancy) and recommend vaginal delivery with assisted second " +
          "stage, blood pressure monitoring in the right arm, and echocardiographic " +
          "surveillance each trimester.",
        keyFindings: [
          "Repaired CoA without residual aneurysm classified as mWHO II",
          "Vaginal delivery with assisted second stage recommended to minimize aortic wall stress",
          "BP measurement in the right arm (proximal to repair) throughout pregnancy",
          "Echocardiography each trimester to assess repair site and associated BAV",
        ],
      },
    ],
    keyEvidenceSources: [carpregII, ropac],
    interactions: [],
  },
];
