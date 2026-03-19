import type { ObstetricCondition } from "../types";
import { w, range, immediate, individualize, cite, grade } from "../helpers";

export const hepaticConditions: ObstetricCondition[] = [
  {
    id: "icp",
    name: "Intrahepatic Cholestasis of Pregnancy (ICP)",
    category: "hepatic",
    tags: ["ICP", "cholestasis", "bile acids", "pruritus", "ursodiol", "UDCA", "itching"],
    stratificationAxis: "bile acid level",
    guidelineRecommendations: [],
    pastFortyWeeks: "no",
    clinicalNotes:
      "ICP is diagnosed by pruritus (typically palms and soles, worse at night) with elevated " +
      "bile acids >=10 umol/L. The highest bile acid level measured during pregnancy guides " +
      "delivery timing stratification. Ursodeoxycholic acid (UDCA) 10-15 mg/kg/day is standard " +
      "treatment for symptom relief, though its effect on perinatal outcomes remains uncertain. " +
      "Serial bile acid monitoring (weekly to biweekly) is recommended as levels can fluctuate.",
    physiologyExplanation:
      "Pregnancy hormones (estrogen, progesterone) impair bile acid transport across hepatocyte " +
      "canalicular membranes, leading to bile acid accumulation in maternal serum. Elevated bile " +
      "acids cross the placenta and accumulate in the fetal compartment, where they can cause " +
      "fetal cardiac arrhythmias and acute vasospasm of placental chorionic veins — the proposed " +
      "mechanism for sudden fetal demise in ICP.",
    specialConsiderations: [
      {
        type: "monitoring_requirement",
        description:
          "Weekly to biweekly total bile acid levels. Liver function tests at diagnosis and " +
          "serially. Antenatal surveillance (NST/BPP) from 32-34 wk, though fetal testing " +
          "has NOT been shown to predict or prevent stillbirth in ICP.",
        citation: cite("SMFM", "#53", 2021),
      },
      {
        type: "medication_adjustment",
        description:
          "Ursodeoxycholic acid (UDCA) 10-15 mg/kg/day divided BID-TID for symptom relief. " +
          "Cholestyramine as second-line. Vitamin K supplementation if coagulopathy develops.",
      },
      {
        type: "neonatal_consideration",
        description:
          "Meconium-stained amniotic fluid is more common. Neonatal RDS risk increased with " +
          "delivery before 37 wk. Late-preterm corticosteroids per standard protocol.",
      },
    ],
    riskData: [
      {
        outcome: "stillbirth (bile acids <40)",
        statistic: { type: "absolute_risk", valuePer1000: 1.3 },
        populationDescription: "ICP with bile acids <40 umol/L",
        citation: cite("other", "Ovadia et al. Lancet 2019", 2019),
      },
      {
        outcome: "stillbirth (bile acids 40-99)",
        statistic: { type: "absolute_risk", valuePer1000: 2.8 },
        populationDescription: "ICP with bile acids 40-99 umol/L",
        citation: cite("other", "Ovadia et al. Lancet 2019", 2019),
      },
      {
        outcome: "stillbirth (bile acids >=100)",
        statistic: { type: "absolute_risk", valuePer1000: 34.4 },
        populationDescription: "ICP with bile acids >=100 umol/L",
        citation: cite("other", "Ovadia et al. Lancet 2019", 2019),
      },
    ],
    riskModifiers: [
      {
        factor: "disease_severity",
        effect:
          "Bile acid level is the primary risk stratifier. Levels >=100 umol/L carry a 3.44% " +
          "stillbirth risk — an order of magnitude higher than <40 umol/L (0.13%).",
      },
    ],
    landmarkTrials: [
      {
        id: "ovadia-2019",
        name: "Ovadia et al. Lancet Meta-analysis",
        year: 2019,
        journalCitation: "Lancet 2019;393:899-909",
        sampleSize: 5269,
        summary:
          "Individual patient data meta-analysis of 5,269 ICP cases establishing bile acid " +
          "thresholds for stillbirth risk stratification. Demonstrated that stillbirth risk " +
          "increases exponentially above 100 umol/L, while risk at levels <40 umol/L is " +
          "comparable to the general population.",
        keyFindings: [
          "Bile acids <40 umol/L: stillbirth 0.13% (comparable to background rate)",
          "Bile acids 40-99 umol/L: stillbirth 0.28%",
          "Bile acids >=100 umol/L: stillbirth 3.44% (OR 30.50 compared to <40)",
          "Transformed ICP management from uniform 36-37 wk delivery to risk-stratified approach",
          "Spontaneous preterm birth increased with higher bile acid levels",
        ],
      },
    ],
    interactions: [],
    subVariants: [
      {
        id: "icp_mild",
        name: "ICP, bile acids <40 umol/L",
        category: "hepatic",
        tags: ["ICP", "cholestasis", "bile acids", "mild", "low risk"],
        parentConditionId: "icp",
        guidelineRecommendations: [
          {
            citations: [cite("SMFM", "#53", 2021), cite("ACOG", "CO 831", 2021)],
            timing: range(w(36), w(39), { preferLaterEnd: true }),
            route: "either",
            grade: grade("1B"),
            notes:
              "Toward the later end of the 36-39 wk range. Stillbirth risk at this level " +
              "(0.13%) is comparable to the general population, supporting expectant management " +
              "closer to 39 wk.",
          },
        ],
        pastFortyWeeks: "no",
        specialConsiderations: [],
        riskData: [],
        riskModifiers: [],
        landmarkTrials: [],
        interactions: [],
      },
      {
        id: "icp_moderate",
        name: "ICP, bile acids 40-99 umol/L",
        category: "hepatic",
        tags: ["ICP", "cholestasis", "bile acids", "moderate"],
        parentConditionId: "icp",
        guidelineRecommendations: [
          {
            citations: [cite("SMFM", "#53", 2021)],
            timing: range(w(36), w(39), { preferEarlierEnd: true }),
            route: "either",
            grade: grade("1B"),
            notes:
              "Toward the earlier end of the 36-39 wk range. The doubling of stillbirth risk " +
              "compared to <40 umol/L supports earlier delivery within the window.",
          },
        ],
        pastFortyWeeks: "no",
        specialConsiderations: [],
        riskData: [],
        riskModifiers: [],
        landmarkTrials: [],
        interactions: [],
      },
      {
        id: "icp_severe",
        name: "ICP, bile acids >=100 umol/L",
        category: "hepatic",
        tags: ["ICP", "cholestasis", "bile acids", "severe", "high risk"],
        parentConditionId: "icp",
        guidelineRecommendations: [
          {
            citations: [cite("SMFM", "#53", 2021), cite("ACOG", "CO 831", 2021)],
            timing: range(w(36), w(36)),
            route: "either",
            grade: grade("1B"),
            notes:
              "Delivery at 36w0d. The 3.44% stillbirth rate at bile acids >=100 umol/L justifies " +
              "early-term delivery. Delivery before 36 wk may be considered with unremitting " +
              "symptoms, prior ICP-related stillbirth <36 wk, or worsening hepatic function.",
          },
        ],
        pastFortyWeeks: "no",
        specialConsiderations: [],
        riskData: [],
        riskModifiers: [],
        landmarkTrials: [],
        interactions: [],
      },
    ],
  },
  {
    id: "aflp",
    name: "Acute Fatty Liver of Pregnancy (AFLP)",
    category: "hepatic",
    tags: ["AFLP", "acute fatty liver", "liver failure", "coagulopathy", "hepatic emergency"],
    guidelineRecommendations: [
      {
        citations: [cite("ACOG", "Expert consensus", 2021)],
        timing: immediate(
          "Obstetric emergency. Delivery is the definitive treatment regardless of gestational " +
          "age. No role for expectant management. Stabilize coagulopathy and deliver expeditiously.",
        ),
        route: "either",
        grade: grade("C"),
        notes:
          "Delivery should not be delayed. The key diagnostic challenge is distinguishing " +
          "AFLP from HELLP syndrome.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "AFLP is an obstetric emergency characterized by microvesicular fatty infiltration of " +
      "hepatocytes leading to acute liver failure. Incidence is ~1 in 7,000-20,000 pregnancies. " +
      "Presentation includes nausea/vomiting, abdominal pain, jaundice, hypoglycemia, and " +
      "coagulopathy (DIC). Swansea criteria aid diagnosis. Maternal mortality is 1-12% with " +
      "prompt recognition and delivery.",
    physiologyExplanation:
      "AFLP is associated with deficiency of long-chain 3-hydroxyacyl-CoA dehydrogenase (LCHAD) " +
      "in the fetus. Fetal fatty acid metabolites accumulate and are toxic to maternal hepatocytes. " +
      "Progressive hepatocellular dysfunction leads to coagulopathy, hypoglycemia (impaired " +
      "gluconeogenesis), and multi-organ failure if delivery is not performed.",
    specialConsiderations: [
      {
        type: "monitoring_requirement",
        description:
          "Continuous maternal monitoring including glucose (q1-2h), coagulation studies (PT/INR, " +
          "fibrinogen, platelets), renal function, and ammonia levels.",
      },
      {
        type: "delivery_site_requirement",
        description:
          "Delivery at a center with ICU, blood bank (massive transfusion protocol capability), " +
          "and hepatology consultation. Liver transplant capability may be needed in rare cases.",
      },
      {
        type: "neonatal_consideration",
        description:
          "Neonatal LCHAD testing recommended. Affected neonates require dietary fat restriction " +
          "with MCT oil supplementation.",
      },
    ],
    riskData: [
      {
        outcome: "maternal mortality",
        statistic: { type: "mortality_rate", valuePercent: 7 },
        populationDescription: "AFLP with modern management",
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "chronic_hep_b",
    name: "Chronic Hepatitis B (high viral load)",
    category: "hepatic",
    tags: ["hepatitis B", "HBV", "HBsAg", "viral hepatitis", "tenofovir"],
    guidelineRecommendations: [
      {
        citations: [cite("AASLD", "HBV Guidelines", 2023), cite("ACOG", "HBV in Pregnancy", 2023)],
        timing: range(w(39), w(40, 6)),
        route: "either",
        grade: grade("1B"),
        notes:
          "Term delivery; no altered timing for HBV. Cesarean is NOT recommended solely " +
          "for hepatitis B.",
      },
    ],
    pastFortyWeeks: "yes",
    clinicalNotes:
      "Chronic HBV does not alter delivery timing. Tenofovir disoproxil fumarate (TDF) from " +
      "28 weeks is recommended for women with high viral load (HBV DNA >200,000 IU/mL) to " +
      "reduce vertical transmission. Neonatal HBV immunoglobulin (HBIG) + vaccine within 12 " +
      "hours of birth remains the cornerstone of prevention.",
    specialConsiderations: [
      {
        type: "medication_continuation",
        description:
          "Continue tenofovir through delivery if started for viral load reduction. " +
          "Breastfeeding is not contraindicated with HBV (with or without TDF).",
        citation: cite("AASLD", "HBV Guidelines", 2023),
      },
      {
        type: "neonatal_consideration",
        description:
          "HBIG + HBV vaccine within 12 hours of birth. Complete vaccine series at 0, 1, " +
          "and 6 months. Post-vaccination serology at 9-12 months.",
      },
    ],
    riskData: [
      {
        outcome: "vertical transmission without prophylaxis",
        statistic: { type: "incidence", valuePercent: 90 },
        populationDescription: "HBeAg-positive mothers with high viral load, no neonatal prophylaxis",
        citation: cite("CDC", "Hepatitis B in Pregnancy", 2023),
      },
      {
        outcome: "vertical transmission with HBIG + vaccine",
        statistic: { type: "incidence", valuePercent: 3 },
        populationDescription: "Neonates receiving HBIG + HBV vaccine series within 12 hours of birth (range <5%)",
        citation: cite("CDC", "Hepatitis B in Pregnancy", 2023),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "chronic_hep_c",
    name: "Chronic Hepatitis C",
    category: "hepatic",
    tags: ["hepatitis C", "HCV", "viral hepatitis"],
    guidelineRecommendations: [
      {
        citations: [cite("SMFM", "#56", 2024), cite("ACOG", "HCV Guidance", 2023)],
        timing: range(w(39), w(40, 6)),
        route: "either",
        grade: grade("1B"),
        notes:
          "Term delivery; no altered timing for HCV. Cesarean is NOT recommended solely " +
          "for hepatitis C.",
      },
    ],
    pastFortyWeeks: "yes",
    clinicalNotes:
      "Chronic HCV does not alter delivery timing or route. Vertical transmission rate is " +
      "5-8% (higher with HIV co-infection). Direct-acting antivirals (DAAs) are not currently " +
      "recommended during pregnancy, though studies are ongoing. Avoid prolonged rupture of " +
      "membranes and invasive fetal monitoring when possible to reduce transmission risk.",
    specialConsiderations: [
      {
        type: "neonatal_consideration",
        description:
          "Test infant for HCV RNA at 2-6 months or anti-HCV antibody at >=18 months. " +
          "Early testing preferred for linkage to care. Breastfeeding is not contraindicated " +
          "unless nipples are cracked and bleeding.",
        citation: cite("SMFM", "#56", 2024),
      },
    ],
    riskData: [
      {
        outcome: "vertical (perinatal) transmission of HCV",
        statistic: { type: "incidence", valuePercent: 6 },
        populationDescription: "HCV RNA-positive mothers without HIV co-infection (range 5-8%)",
        citation: cite("SMFM", "#56", 2024),
      },
    ],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "liver_transplant",
    name: "Liver transplant recipient",
    category: "hepatic",
    tags: ["liver transplant", "transplant", "hepatic transplant", "immunosuppression"],
    guidelineRecommendations: [
      {
        citations: [cite("SMFM", "#66", 2023)],
        timing: range(w(37), w(39, 6)),
        route: "either",
        grade: grade("2B"),
        notes:
          "Same guidance as solid organ transplant recipients. Delivery timing driven by " +
          "graft function and pregnancy complications.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Liver transplant recipients can have successful pregnancies when graft function is stable " +
      "and immunosuppression is optimized. Pregnancy is generally recommended >=1-2 years " +
      "post-transplant with stable graft function. Preeclampsia risk is elevated. " +
      "Mycophenolate must be discontinued and switched to azathioprine before conception.",
    specialConsiderations: [
      {
        type: "medication_continuation",
        description:
          "Continue tacrolimus or cyclosporine with monthly trough level monitoring. " +
          "Continue azathioprine and prednisone. Mycophenolate and mTOR inhibitors are " +
          "contraindicated in pregnancy.",
        citation: cite("SMFM", "#66", 2023),
      },
      {
        type: "monitoring_requirement",
        description:
          "Monthly liver function tests, immunosuppressant levels, and graft function assessment. " +
          "Growth ultrasound every 4 weeks from 24 wk. Antenatal surveillance from 32 wk.",
      },
    ],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "autoimmune_hepatitis",
    name: "Autoimmune hepatitis",
    category: "hepatic",
    tags: ["autoimmune hepatitis", "AIH", "autoimmune liver disease"],
    guidelineRecommendations: [
      {
        citations: [cite("other", "Expert consensus", 2023)],
        timing: individualize(
          "Disease flare during pregnancy",
          "Worsening liver function despite treatment",
          "Development of portal hypertension",
          "Superimposed preeclampsia",
        ),
        route: "either",
        grade: grade("C"),
        notes: "Term delivery if quiescent. Earlier delivery if active disease or complications.",
      },
    ],
    pastFortyWeeks: "case_by_case",
    clinicalNotes:
      "Autoimmune hepatitis may flare during pregnancy (particularly in the second trimester) " +
      "or postpartum. Azathioprine and prednisone are safe and should be continued. Disease " +
      "remission for >=1 year before conception is recommended. Flare rates are 7-11% during " +
      "pregnancy and up to 25-50% postpartum.",
    specialConsiderations: [
      {
        type: "medication_continuation",
        description:
          "Continue azathioprine and prednisone at lowest effective dose. Mycophenolate must " +
          "be switched to azathioprine preconception.",
      },
      {
        type: "monitoring_requirement",
        description:
          "Monthly liver function tests. Watch for flare signs: rising transaminases, " +
          "increasing IgG levels. Postpartum monitoring is critical due to high flare risk.",
      },
    ],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
  {
    id: "portal_htn_varices",
    name: "Portal hypertension / esophageal varices",
    category: "hepatic",
    tags: ["portal hypertension", "varices", "esophageal varices", "cirrhosis", "portal HTN"],
    guidelineRecommendations: [
      {
        citations: [cite("other", "Expert consensus", 2023)],
        timing: individualize(
          "Variceal bleeding episode",
          "Worsening hepatic decompensation (ascites, encephalopathy)",
          "Progressive thrombocytopenia from splenic sequestration",
          "Fetal growth restriction",
        ),
        route: "individualize",
        grade: grade("C"),
        notes:
          "Avoid Valsalva during second stage; assisted delivery recommended. Cesarean for " +
          "obstetric indications or large varices at high bleeding risk.",
      },
    ],
    pastFortyWeeks: "no",
    clinicalNotes:
      "Portal hypertension in pregnancy carries significant hemorrhagic risk, particularly " +
      "from variceal bleeding (risk increases in the second and third trimesters due to " +
      "increased blood volume and caval compression). EGD screening in the second trimester " +
      "is recommended for known cirrhotics. Nonselective beta-blockers (propranolol, nadolol) " +
      "can be continued for variceal prophylaxis.",
    specialConsiderations: [
      {
        type: "anesthesia_consideration",
        description:
          "Thrombocytopenia from hypersplenism may preclude neuraxial anesthesia. Coagulopathy " +
          "from hepatic synthetic dysfunction requires correction before procedures.",
      },
      {
        type: "surgical_planning",
        description:
          "Assisted second stage (vacuum or forceps) to minimize Valsalva and reduce variceal " +
          "bleeding risk. Early epidural recommended to reduce bearing-down reflex.",
      },
    ],
    riskData: [],
    riskModifiers: [],
    landmarkTrials: [],
    interactions: [],
  },
];
