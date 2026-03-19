import type { KeyEvidenceSource } from "./types";

// ═══════════════════════════════════════════════════════════════════════════════
// KEY EVIDENCE SOURCES — Registries, Cohorts, Surveillance, and Protocols
// ═══════════════════════════════════════════════════════════════════════════════

// ── Fetal & Neonatal Registries ─────────────────────────────────────────────

export const eurocat: KeyEvidenceSource = {
  id: "eurocat",
  name: "EUROCAT (European Surveillance of Congenital Anomalies)",
  type: "registry",
  description:
    "Population-based network of registries across 23 European countries tracking " +
    "congenital anomaly prevalence, trends, and outcomes. Primary source for " +
    "European birth defect epidemiology.",
  yearStarted: 1979,
  region: "Europe (23 countries)",
  url: "https://eu-rd-platform.jrc.ec.europa.eu/eurocat",
};

export const cdcNbdps: KeyEvidenceSource = {
  id: "cdc-nbdps",
  name: "CDC National Birth Defects Prevention Study (NBDPS)",
  type: "registry",
  description:
    "US population-based case-control study of birth defects covering ~10% of US births. " +
    "Primary source for American birth defect prevalence and risk factor data.",
  yearStarted: 1997,
  yearPublished: 2013,
  region: "United States (10 states)",
  url: "https://www.cdc.gov/birth-defects/data-research/",
};

export const ucssFetal: KeyEvidenceSource = {
  id: "ucsf-fetal",
  name: "UCSF Fetal Treatment Center",
  type: "protocol",
  description:
    "Pioneering center for fetal intervention establishing protocols for EXIT procedures, " +
    "fetal surgery for CDH/CPAM/SCT, and prenatal counseling frameworks. Major contributor " +
    "to fetal surgical outcome data.",
  yearStarted: 1981,
  region: "United States",
  url: "https://fetus.ucsf.edu/",
};

export const chopFetal: KeyEvidenceSource = {
  id: "chop-fetal",
  name: "Children's Hospital of Philadelphia Center for Fetal Diagnosis and Treatment",
  type: "protocol",
  description:
    "Leading fetal diagnosis and treatment center. Developed the CVPR (Congenital Volume " +
    "Ratio) for CDH prognosis, established EXIT procedure protocols, and led the MOMS trial " +
    "for prenatal myelomeningocele repair.",
  yearStarted: 1995,
  region: "United States",
  url: "https://fetalsurgery.chop.edu/",
};

// ── Cardiac Registries ──────────────────────────────────────────────────────

export const carpregII: KeyEvidenceSource = {
  id: "carpreg-ii",
  name: "CARPREG II (Cardiac Disease in Pregnancy Study)",
  type: "cohort",
  description:
    "Prospective multicenter study developing the CARPREG II risk score for cardiac " +
    "events during pregnancy. Validated 10 predictors of adverse cardiac outcomes " +
    "across 1938 pregnancies in women with heart disease.",
  yearStarted: 1994,
  yearPublished: 2018,
  region: "Canada (multicenter)",
};

export const ropac: KeyEvidenceSource = {
  id: "ropac",
  name: "ROPAC (Registry of Pregnancy and Cardiac Disease)",
  type: "registry",
  description:
    "ESC-affiliated global registry enrolling pregnant women with structural heart disease. " +
    "Largest worldwide dataset on cardiac disease in pregnancy with >5000 pregnancies.",
  yearStarted: 2007,
  region: "Global (60+ countries)",
  url: "https://www.escardio.org/Research/Registries-Surveys/ropac",
};

export const cincinnatiScamp: KeyEvidenceSource = {
  id: "cincinnati-scamp",
  name: "Cincinnati Children's SCAMP Protocols (Single Ventricle)",
  type: "protocol",
  description:
    "Standardized clinical assessment and management plans for single ventricle patients " +
    "including pre-Fontan surveillance, Fontan monitoring, and pregnancy counseling protocols.",
  yearStarted: 2006,
  region: "United States",
};

export const anzFontanRegistry: KeyEvidenceSource = {
  id: "anz-fontan",
  name: "ANZ Fontan Registry",
  type: "registry",
  description:
    "Australia and New Zealand Fontan Registry tracking long-term outcomes of Fontan " +
    "palliation including pregnancy outcomes in women with Fontan circulation.",
  yearStarted: 2008,
  region: "Australia & New Zealand",
};

// ── Obstetric Surveillance ──────────────────────────────────────────────────

export const ukoss: KeyEvidenceSource = {
  id: "ukoss",
  name: "UKOSS (UK Obstetric Surveillance System)",
  type: "surveillance",
  description:
    "National system studying rare disorders of pregnancy in the UK. Provides incidence " +
    "data and outcomes for conditions too rare for conventional study designs: AFE, " +
    "peripartum cardiomyopathy, eclampsia, placenta accreta.",
  yearStarted: 2005,
  region: "United Kingdom",
  url: "https://www.npeu.ox.ac.uk/ukoss",
};

export const mbrrace: KeyEvidenceSource = {
  id: "mbrrace-surveillance",
  name: "MBRRACE-UK (Mothers and Babies: Reducing Risk through Audits and Confidential Enquiries)",
  type: "surveillance",
  description:
    "UK national program for surveillance of maternal deaths, stillbirths, and infant " +
    "deaths. Produces the triennial 'Saving Lives, Improving Mothers' Care' reports " +
    "identifying systemic failures and racial disparities.",
  yearStarted: 2013,
  region: "United Kingdom",
  url: "https://www.npeu.ox.ac.uk/mbrrace-uk",
};

export const smfmConsortium: KeyEvidenceSource = {
  id: "smfm-consortium",
  name: "SMFM/MFMU Network",
  type: "cohort",
  description:
    "NICHD Maternal-Fetal Medicine Units Network conducting multicenter obstetric trials " +
    "and observational studies. Source of foundational evidence for preterm birth prevention, " +
    "GDM treatment, MgSO4 neuroprotection, and progesterone therapy.",
  yearStarted: 1986,
  region: "United States (multicenter)",
  url: "https://www.bsc.gwu.edu/mfmu",
};

// ── Infectious Disease Registries ───────────────────────────────────────────

export const witsCohort: KeyEvidenceSource = {
  id: "wits",
  name: "WITS (Women and Infants Transmission Study)",
  type: "cohort",
  description:
    "Prospective multicenter cohort study of HIV-1-infected pregnant women and their " +
    "infants in the US. Established vertical transmission rates by viral load, CD4 count, " +
    "and delivery mode. Foundation for current PMTCT protocols.",
  yearStarted: 1989,
  yearPublished: 2002,
  region: "United States",
};

export const pactg: KeyEvidenceSource = {
  id: "pactg",
  name: "PACTG/IMPAACT (Pediatric AIDS Clinical Trials Group)",
  type: "cohort",
  description:
    "NIH-funded network conducting trials and observational studies on HIV in pregnant " +
    "women and children. PACTG 076 established AZT for PMTCT; PACTG 316 demonstrated " +
    "nevirapine addition. Now IMPAACT network.",
  yearStarted: 1991,
  region: "United States & international",
};

export const priorityCohort: KeyEvidenceSource = {
  id: "priority",
  name: "PRIORITY (Pregnancy Coronavirus Outcomes Registry)",
  type: "registry",
  description:
    "UCSF-led prospective cohort study of COVID-19 in pregnancy, enrolling >10,000 " +
    "pregnant individuals. Established infection rates, vaccine safety data, and outcomes " +
    "including preterm birth and preeclampsia associations.",
  yearStarted: 2020,
  region: "United States",
};

// ── Stillbirth & Perinatal ──────────────────────────────────────────────────

export const scrnNetwork: KeyEvidenceSource = {
  id: "scrn",
  name: "SCRN (Stillbirth Collaborative Research Network)",
  type: "cohort",
  description:
    "NICHD-funded multicenter population-based case-control study of stillbirth causes " +
    "and risk factors. Identified placental disease as leading cause; quantified racial " +
    "disparities and recurrence risk (RR 4.6).",
  yearStarted: 2006,
  yearPublished: 2011,
  region: "United States (5 sites)",
};

// ── Autoimmune & Rheumatologic ──────────────────────────────────────────────

export const promisse: KeyEvidenceSource = {
  id: "promisse",
  name: "PROMISSE (Predictors of Pregnancy Outcome: Biomarkers in APS and SLE)",
  type: "cohort",
  description:
    "NIH-funded prospective multicenter observational study of pregnant women with SLE " +
    "and/or antiphospholipid antibodies. Identified complement activation, anti-angiogenic " +
    "factors, and specific antibody profiles as predictors of adverse outcomes.",
  yearStarted: 2003,
  yearPublished: 2015,
  region: "United States (multicenter)",
};

// ── Transplant ──────────────────────────────────────────────────────────────

export const ntpr: KeyEvidenceSource = {
  id: "ntpr",
  name: "NTPR (National Transplantation Pregnancy Registry)",
  type: "registry",
  description:
    "Voluntary registry tracking pregnancy outcomes in solid organ transplant recipients " +
    "in the US. Largest dataset on pregnancy after transplant with >5000 pregnancies, " +
    "establishing safety profiles for immunosuppressive medications.",
  yearStarted: 1991,
  region: "United States",
};

// ── Hematologic ─────────────────────────────────────────────────────────────

export const isth: KeyEvidenceSource = {
  id: "isth",
  name: "ISTH (International Society on Thrombosis and Haemostasis) Registry",
  type: "registry",
  description:
    "International registry and evidence synthesis for thrombotic and bleeding disorders " +
    "in pregnancy. Source for VTE recurrence rates, anticoagulation protocols, and " +
    "factor replacement guidelines during pregnancy and delivery.",
  yearStarted: 1969,
  region: "Global",
};

// ── Preterm Birth Surveillance ──────────────────────────────────────────────

export const nrnNetwork: KeyEvidenceSource = {
  id: "nichd-nrn",
  name: "NICHD Neonatal Research Network (NRN)",
  type: "registry",
  description:
    "NIH-funded multicenter network providing GA-specific neonatal outcome data used " +
    "for prenatal counseling. Publishes survival and morbidity rates by gestational age " +
    "updated annually — the foundation for periviability counseling.",
  yearStarted: 1986,
  region: "United States (multicenter)",
  url: "https://neonatal.rti.org/",
};

// ── Registry of all sources ─────────────────────────────────────────────────

export const allEvidenceSources: KeyEvidenceSource[] = [
  // Fetal & Neonatal
  eurocat,
  cdcNbdps,
  ucssFetal,
  chopFetal,
  // Cardiac
  carpregII,
  ropac,
  cincinnatiScamp,
  anzFontanRegistry,
  // Obstetric surveillance
  ukoss,
  mbrrace,
  smfmConsortium,
  // Infectious disease
  witsCohort,
  pactg,
  priorityCohort,
  // Stillbirth & perinatal
  scrnNetwork,
  // Autoimmune
  promisse,
  // Transplant
  ntpr,
  // Hematologic
  isth,
  // Preterm
  nrnNetwork,
];

export const evidenceSourceById = new Map(
  allEvidenceSources.map((s) => [s.id, s])
);
