import type { ObstetricCondition } from "../types";
import { w, range, immediate, individualize, cite, grade } from "../helpers";

export const hematologicConditions: ObstetricCondition[] = [
  {
    id: "scd_uncomplicated",
    name: "Sickle Cell Disease, uncomplicated (HbSS)",
    category: "hematologic",
    tags: ["sickle cell", "SCD", "HbSS", "sickle", "hemoglobinopathy", "Sβ0-thalassemia"],
    guidelineRecommendations: [
      {
        citations: [cite("SMFM", "#68", 2024), cite("ACOG", "CO 831", 2021)],
        timing: range(w(39), w(39, 6)),
        route: "either",
        grade: grade("B"),
        notes:
          "39w0d-39w6d for uncomplicated HbSS represents a significant update from older practice " +
          "patterns that delivered at 37 weeks. Some centers still deliver HbSS and Sβ0-thalassemia " +
          "at 37 weeks and reserve 39 weeks for milder genotypes (HbSC, Sβ+-thal).",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "The 2024 SMFM Consult Series #68 provides the most current guidance for SCD in pregnancy. " +
      "The shift from 37 to 39 weeks for uncomplicated disease reflects accumulating evidence that " +
      "the neonatal risks of early-term delivery outweigh the modest maternal benefits. Antenatal " +
      "surveillance begins at 32-34 weeks with weekly or twice-weekly NST/BPP.",
    physiologyExplanation:
      "Sickle hemoglobin (HbS) polymerizes under low oxygen tension, deforming red blood cells " +
      "into rigid sickle shapes that obstruct microvasculature. Pregnancy exacerbates sickling " +
      "through increased oxygen demand, relative dehydration, venous stasis, and the hypercoagulable " +
      "state. Placental infarction from sickling contributes to FGR and stillbirth risk.",
    specialConsiderations: [
      {
        type: "monitoring_requirement",
        description:
          "Antenatal surveillance from 32-34 wk with weekly or twice-weekly NST/BPP. " +
          "Growth ultrasound every 4 weeks from 24 wk. Monthly CBC with reticulocyte count. " +
          "Screen for alloantibodies given frequent transfusion history.",
        citation: cite("SMFM", "#68", 2024),
      },
      {
        type: "medication_continuation",
        description:
          "Hydroxyurea is generally discontinued in pregnancy (limited safety data), though " +
          "some centers continue on a case-by-case basis. Folic acid 4 mg daily. Prophylactic " +
          "transfusion is not routinely recommended but considered for severe anemia or frequent crises.",
      },
      {
        type: "anesthesia_consideration",
        description:
          "Early epidural recommended to reduce pain-triggered sickling crises during labor. " +
          "Maintain hydration, oxygenation, and normothermia throughout labor and delivery.",
      },
    ],
    riskData: [],
    riskModifiers: [
      {
        factor: "disease_severity",
        effect:
          "Complications (frequent crises, ACS, prior stroke) shift to individualized earlier timing.",
      },
    ],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "scd_complicated",
    name: "Sickle Cell Disease with complications",
    category: "hematologic",
    tags: [
      "sickle cell", "SCD", "complicated", "acute chest", "ACS", "stroke", "priapism",
      "vaso-occlusive", "crisis", "pulmonary hypertension",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("SMFM", "#68", 2024)],
        timing: individualize(
          "Recurrent vaso-occlusive crises despite management",
          "Acute chest syndrome in current pregnancy",
          "Progressive pulmonary hypertension",
          "Severe anemia unresponsive to transfusion",
          "Worsening end-organ damage (renal, hepatic)",
          "Fetal growth restriction or abnormal surveillance",
        ),
        route: "either",
        grade: grade("C"),
        notes: "Complications may necessitate delivery well before 39 weeks.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "SCD complications including acute chest syndrome, frequent vaso-occlusive crises, prior " +
      "stroke, pulmonary hypertension, or progressive end-organ damage may necessitate earlier " +
      "delivery. Exchange transfusion may be needed for acute chest syndrome or severe anemia " +
      "(Hb <7 g/dL). Multidisciplinary management with hematology is essential.",
    specialConsiderations: [
      {
        type: "monitoring_requirement",
        description:
          "Intensified surveillance: twice-weekly NST from 28-32 wk. Growth ultrasound " +
          "every 3 weeks. Echocardiography if pulmonary hypertension suspected.",
        citation: cite("SMFM", "#68", 2024),
      },
    ],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "itp",
    name: "Immune Thrombocytopenia (ITP)",
    category: "hematologic",
    tags: ["ITP", "immune thrombocytopenia", "thrombocytopenia", "platelets", "autoimmune"],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "PB 207", 2019), cite("other", "ASH Guidelines", 2019)],
        timing: range(w(39), w(40, 6)),
        route: "either",
        grade: grade("C"),
        notes:
          "No specific early delivery. Timing based on obstetric indications. ITP is NOT " +
          "an indication for cesarean delivery.",
      },
    ],
    pastFortyWeeks: "yes",
    clinicalNotes:
      "Platelet thresholds for ITP: >=50,000/uL for vaginal or cesarean delivery, >=70,000-80,000/uL " +
      "for neuraxial anesthesia. Treatment is indicated when platelets fall below 30,000/uL or " +
      "with symptomatic bleeding. First-line treatment: corticosteroids (prednisone 1 mg/kg) or " +
      "IVIG (1 g/kg x 1-2 doses). Delivery mode is determined by obstetric indications, not " +
      "platelet count.",
    physiologyExplanation:
      "ITP results from autoantibodies (anti-GPIIb/IIIa) that target platelet surface glycoproteins, " +
      "leading to accelerated platelet destruction in the spleen. These IgG antibodies cross the " +
      "placenta and can cause neonatal thrombocytopenia (10-20% of neonates), though severe " +
      "neonatal hemorrhage is rare (<1%).",
    specialConsiderations: [
      {
        type: "anesthesia_consideration",
        description:
          "Neuraxial anesthesia requires platelets >=70,000-80,000/uL. Plan platelet count " +
          "check on admission. IVIG (response in 24-72h) or platelet transfusion may be " +
          "needed if counts are borderline.",
      },
      {
        type: "neonatal_consideration",
        description:
          "Neonatal platelet count at birth. Nadir typically at day 2-5 of life. " +
          "Neonatal intracranial hemorrhage is rare; mode of delivery does not affect neonatal " +
          "bleeding risk. Fetal scalp electrode and operative vaginal delivery are acceptable.",
      },
    ],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "gestational_thrombocytopenia",
    name: "Gestational thrombocytopenia",
    category: "hematologic",
    tags: ["gestational thrombocytopenia", "incidental thrombocytopenia", "platelets", "benign"],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "PB 207", 2019)],
        timing: range(w(39), w(40, 6)),
        route: "either",
        grade: grade("C"),
        notes: "Standard term delivery. No altered timing for gestational thrombocytopenia.",
      },
    ],
    pastFortyWeeks: "yes",
    clinicalNotes:
      "Gestational thrombocytopenia is the most common cause of thrombocytopenia in pregnancy " +
      "(70-80% of cases). Platelets are typically 100,000-150,000/uL, rarely below 70,000/uL. " +
      "It is a diagnosis of exclusion: no prior history of thrombocytopenia, onset in mid-to-late " +
      "pregnancy, and spontaneous resolution postpartum. No treatment is needed.",
    specialConsiderations: [
      {
        type: "anesthesia_consideration",
        description:
          "Neuraxial anesthesia is generally safe with platelets >=70,000/uL. Repeat platelet " +
          "count on admission to labor and delivery.",
      },
    ],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "ttp_hus",
    name: "TTP/HUS in pregnancy",
    category: "hematologic",
    tags: [
      "TTP", "thrombotic thrombocytopenic purpura", "HUS", "hemolytic uremic syndrome",
      "ADAMTS13", "microangiopathic", "MAHA",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("other", "Expert consensus", 2023)],
        timing: immediate(
          "Immediate delivery if post-viability and refractory to treatment (plasma exchange). " +
          "If responding to treatment, delivery may be deferred to optimize gestational age.",
        ),
        route: "either",
        grade: grade("C"),
        notes:
          "Distinguish from HELLP syndrome and preeclampsia. ADAMTS13 activity <10% confirms TTP. " +
          "Plasma exchange is the primary treatment and should not be delayed for delivery.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "TTP in pregnancy presents with microangiopathic hemolytic anemia, thrombocytopenia, and " +
      "end-organ damage (renal, neurologic). ADAMTS13 activity <10% distinguishes TTP from HELLP " +
      "and aHUS. Plasma exchange (PEX) is first-line treatment and should be initiated emergently. " +
      "Caplacizumab (anti-VWF nanobody) has limited pregnancy data but has been used in refractory cases.",
    specialConsiderations: [
      {
        type: "monitoring_requirement",
        description:
          "ADAMTS13 activity level at diagnosis and serially. Daily CBC, LDH, haptoglobin, " +
          "reticulocyte count, and renal function during acute episode.",
      },
      {
        type: "delivery_site_requirement",
        description:
          "Delivery at center with apheresis capability. Blood bank support for large-volume " +
          "plasma exchange.",
      },
    ],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "antiphospholipid_syndrome_hematologic",
    name: "Antiphospholipid syndrome (thrombotic management)",
    category: "hematologic",
    tags: [
      "antiphospholipid", "APS", "APLS", "lupus anticoagulant", "anticardiolipin",
      "beta-2 glycoprotein", "thrombophilia", "acquired",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("ACR", "APS Guidelines", 2020), cite("ACOG", "PB 118", 2011)],
        timing: individualize(
          "History of thrombotic events",
          "Development of preeclampsia",
          "Fetal growth restriction",
          "Abnormal antenatal surveillance",
          "Placental insufficiency",
        ),
        route: "either",
        grade: grade("C"),
        notes:
          "Surveillance from 32 wk. Delivery timing individualized based on complications. " +
          "Triple-positive APS (LA + aCL + anti-β2GPI) carries highest risk.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Antiphospholipid syndrome requires treatment with low-dose aspirin (started at 12 wk) " +
      "and prophylactic heparin. Obstetric APS (recurrent pregnancy loss, prior preeclampsia " +
      "<34 wk, or prior placental insufficiency) and thrombotic APS (prior VTE/arterial " +
      "thrombosis) are treated differently. Surveillance from 32 weeks with weekly NST/BPP. " +
      "Growth ultrasound every 4 weeks from 24 wk.",
    specialConsiderations: [
      {
        type: "anticoagulation_bridging",
        description:
          "Prophylactic LMWH (enoxaparin 40 mg daily) for obstetric APS; therapeutic LMWH " +
          "for thrombotic APS. Bridging protocol: hold therapeutic LMWH 24h before delivery, " +
          "prophylactic 12h before. Restart 4-6h post-vaginal, 6-12h post-cesarean.",
        citation: cite("ACOG", "PB 196", 2018),
      },
      {
        type: "imaging_surveillance",
        description:
          "Growth ultrasound every 4 weeks from 24 wk. Uterine artery Dopplers at 20-24 wk " +
          "may identify high-risk pregnancies. Weekly NST/BPP from 32 wk.",
      },
    ],
    riskData: [],
    riskModifiers: [
      {
        factor: "disease_severity",
        effect:
          "Triple-positive APS (all three antibodies) carries highest thrombotic and obstetric risk. " +
          "Prior thrombosis shifts toward earlier and more intensive surveillance.",
      },
    ],
    landmarkTrials: [],
    interactions: [
      {
        interactingConditionId: "lupus_nephritis_active",
        interactionType: "additive_risk",
        description:
          "APS with concomitant SLE dramatically increases risk of preeclampsia, FGR, and " +
          "pregnancy loss. Combined management with rheumatology and MFM is essential.",
      },
    ],
  },
  {
    id: "vte_on_anticoagulation",
    name: "VTE on anticoagulation",
    category: "hematologic",
    tags: [
      "VTE", "venous thromboembolism", "DVT", "deep vein thrombosis", "PE",
      "pulmonary embolism", "anticoagulation", "LMWH", "heparin",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "PB 196", 2018)],
        timing: range(w(39), w(39, 6)),
        route: "either",
        grade: grade("B"),
        notes:
          "Planned delivery to coordinate anticoagulation bridging. No specific early delivery " +
          "for VTE alone, but planned timing ensures safe anticoagulation management.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "VTE in the current pregnancy requires therapeutic anticoagulation (adjusted-dose LMWH " +
      "or UFH) for the remainder of pregnancy and >=6 weeks postpartum (minimum 3 months total). " +
      "Planned delivery at 39 weeks allows coordination of anticoagulation bridging: " +
      "adjusted-dose LMWH held 24 hours before, prophylactic LMWH held 12 hours before. " +
      "Restart 4-6 hours post-vaginal or 6-12 hours post-cesarean.",
    specialConsiderations: [
      {
        type: "anticoagulation_bridging",
        description:
          "Adjusted-dose LMWH: hold 24h before planned delivery. Prophylactic LMWH: hold 12h " +
          "before. If on UFH, hold 4-6h before and check aPTT. Restart LMWH 4-6h post-vaginal " +
          "or 6-12h post-cesarean. IVC filter may be considered if VTE within 2-4 weeks of delivery.",
        citation: cite("ACOG", "PB 196", 2018),
      },
      {
        type: "anesthesia_consideration",
        description:
          "Neuraxial anesthesia: wait 24h after therapeutic LMWH dose, 12h after prophylactic " +
          "dose. Catheter removal: wait >=4h before next LMWH dose.",
      },
      {
        type: "postpartum_management",
        description:
          "Transition to warfarin postpartum if desired (safe with breastfeeding). Target INR " +
          "2.0-3.0. Continue for >=6 weeks postpartum (minimum 3 months total anticoagulation). " +
          "DOACs are an alternative but have limited breastfeeding data.",
      },
    ],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "von_willebrand_disease",
    name: "Von Willebrand disease",
    category: "hematologic",
    tags: ["von Willebrand", "VWD", "VWF", "bleeding disorder", "factor VIII"],
    guidelineRecommendations: [
      {
        citations: [cite("other", "ASH 2020 VWD Guidelines", 2020)],
        timing: range(w(39), w(40, 6)),
        route: "vaginal_preferred",
        grade: grade("C"),
        notes:
          "No specific early delivery. VWF and FVIII levels >=50 IU/dL at delivery. " +
          "Avoid operative vaginal delivery (vacuum/forceps) when possible.",
      },
    ],
    pastFortyWeeks: "yes",
    clinicalNotes:
      "VWF and FVIII levels typically rise during pregnancy (physiologic increase), often " +
      "normalizing by the third trimester in type 1 VWD. Check levels at 34-36 wk to plan " +
      "for delivery. If VWF/FVIII remain <50 IU/dL, desmopressin (DDAVP) or VWF concentrate " +
      "is given at delivery onset. Type 2B VWD is a special case: DDAVP is contraindicated " +
      "(worsens thrombocytopenia). Type 3 VWD requires VWF/FVIII concentrate replacement.",
    specialConsiderations: [
      {
        type: "anesthesia_consideration",
        description:
          "Neuraxial anesthesia requires VWF and FVIII >=50 IU/dL. Check levels at 34-36 wk. " +
          "If borderline, DDAVP or VWF concentrate before epidural placement.",
        citation: cite("other", "ASH 2020 VWD Guidelines", 2020),
      },
      {
        type: "neonatal_consideration",
        description:
          "Cord blood VWF/FVIII levels for affected neonates. Avoid fetal scalp electrodes " +
          "and vacuum delivery if fetal VWD status unknown. Circumcision should be deferred " +
          "until VWD status is determined.",
      },
      {
        type: "postpartum_management",
        description:
          "VWF/FVIII levels drop rapidly postpartum (within 7-21 days). Delayed postpartum " +
          "hemorrhage risk is significant. Tranexamic acid and/or VWF replacement may be " +
          "needed for 1-2 weeks postpartum.",
      },
    ],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "hemophilia_carriers",
    name: "Hemophilia carriers",
    category: "hematologic",
    tags: ["hemophilia", "carrier", "factor VIII", "factor IX", "bleeding disorder", "X-linked"],
    guidelineRecommendations: [
      {
        citations: [cite("MASAC", "#265", 2021), cite("other", "ASH 2020 Hemophilia Guidelines", 2020)],
        timing: range(w(39), w(40, 6)),
        route: "individualize",
        grade: grade("C"),
        notes:
          "No specific early delivery. Delivery mode individualized: avoid instrumental delivery. " +
          "Cesarean may be discussed for affected male fetus to reduce neonatal intracranial " +
          "hemorrhage risk.",
      },
    ],
    pastFortyWeeks: "yes",
    clinicalNotes:
      "Hemophilia carriers may have reduced factor levels (30-60% of normal for carrier status). " +
      "Factor VIII levels typically rise in pregnancy (may normalize), while factor IX does not " +
      "increase. Check factor levels at 34-36 wk. Target factor level >=50 IU/dL at delivery. " +
      "If below threshold, factor replacement or DDAVP (for hemophilia A carriers only) at delivery.",
    specialConsiderations: [
      {
        type: "anesthesia_consideration",
        description:
          "Neuraxial anesthesia requires factor level >=50 IU/dL. Factor VIII carriers often " +
          "normalize by third trimester. Factor IX carriers may need replacement.",
        citation: cite("MASAC", "#265", 2021),
      },
      {
        type: "neonatal_consideration",
        description:
          "Cord blood factor levels for male neonates. Avoid fetal scalp electrodes, vacuum " +
          "extraction, and circumcision until hemophilia status confirmed. Cranial ultrasound " +
          "for affected neonates.",
        citation: cite("other", "ASH 2020 Hemophilia Guidelines", 2020),
      },
    ],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "factor_v_leiden_thrombophilias",
    name: "Factor V Leiden / inherited thrombophilias",
    category: "hematologic",
    tags: [
      "Factor V Leiden", "FVL", "thrombophilia", "prothrombin gene mutation",
      "protein C deficiency", "protein S deficiency", "antithrombin deficiency",
      "MTHFR", "inherited",
    ],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "PB 197", 2018)],
        timing: range(w(39), w(40, 6)),
        route: "either",
        grade: grade("C"),
        notes:
          "No specific early delivery for inherited thrombophilias alone. Anticoagulation " +
          "decisions based on personal and family history of VTE, not thrombophilia status alone.",
      },
    ],
    pastFortyWeeks: "yes",
    clinicalNotes:
      "Inherited thrombophilias (Factor V Leiden, prothrombin G20210A, protein C/S deficiency, " +
      "antithrombin deficiency) do not independently mandate altered delivery timing. " +
      "Anticoagulation is recommended for personal history of VTE or antithrombin deficiency " +
      "regardless of VTE history. Heterozygous FVL without personal VTE history requires only " +
      "postpartum prophylaxis. Routine thrombophilia screening is not recommended (ACOG PB 197).",
    specialConsiderations: [
      {
        type: "anticoagulation_bridging",
        description:
          "If on anticoagulation (prophylactic or therapeutic), coordinate planned delivery " +
          "for safe bridging. Prophylactic LMWH: hold 12h before delivery. Therapeutic: hold 24h.",
        citation: cite("ACOG", "PB 197", 2018),
      },
      {
        type: "postpartum_management",
        description:
          "Postpartum anticoagulation for 6 weeks is recommended for most thrombophilias with " +
          "additional risk factors. Antithrombin deficiency warrants both antepartum and " +
          "postpartum prophylaxis regardless of VTE history.",
      },
    ],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
];
