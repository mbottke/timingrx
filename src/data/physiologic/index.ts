import { w } from "../helpers";

/**
 * Week-by-week physiologic data from 37-42 weeks.
 * Sources: Muglu 2019 (stillbirth), Brace/Wolf 1989 (fluid),
 * Rossi 2020 AJOG (meconium), ACOG PB 216 (macrosomia).
 */

export interface PhysiologicDataPoint {
  ga: number;
  label: string;
}

export interface ConvergenceDataPoint {
  ga: number;
  amnioticFluidPercentPeak: number;
  meconiumStainedFluidPercent: number;
  macrosomiaOver4000gPercent: number;
  stillbirthPer1000x10: number;
}

export const convergenceData: ConvergenceDataPoint[] = [
  { ga: w(37), amnioticFluidPercentPeak: 92, meconiumStainedFluidPercent: 5, macrosomiaOver4000gPercent: 8, stillbirthPer1000x10: 1.1 },
  { ga: w(38), amnioticFluidPercentPeak: 85, meconiumStainedFluidPercent: 8, macrosomiaOver4000gPercent: 10, stillbirthPer1000x10: 2.1 },
  { ga: w(39), amnioticFluidPercentPeak: 78, meconiumStainedFluidPercent: 12, macrosomiaOver4000gPercent: 12, stillbirthPer1000x10: 4.0 },
  { ga: w(40), amnioticFluidPercentPeak: 68, meconiumStainedFluidPercent: 18, macrosomiaOver4000gPercent: 15, stillbirthPer1000x10: 6.9 },
  { ga: w(41), amnioticFluidPercentPeak: 52, meconiumStainedFluidPercent: 30, macrosomiaOver4000gPercent: 20, stillbirthPer1000x10: 13.0 },
  { ga: w(42), amnioticFluidPercentPeak: 36, meconiumStainedFluidPercent: 44, macrosomiaOver4000gPercent: 26, stillbirthPer1000x10: 31.8 },
];

export const weekByWeekPhysiology = [
  {
    ga: w(39),
    placenta: "Healthy function. Early syncytial knot formation. Adequate gas exchange.",
    amnioticFluid: "~780 mL (78% peak). AFI typically 12-15 cm.",
    meconium: "MSAF rate ~12%. MAS rare.",
    fetalGrowth: "+150-200 g/week. EFW 3200-3500g. Macrosomia rate 12%.",
    hormonal: "Placental CRH rising exponentially. Myometrial oxytocin receptors near peak (100-200x baseline).",
  },
  {
    ga: w(40),
    placenta: "Calcification begins. Fibrin deposition in intervillous spaces. Syncytial knots increase.",
    amnioticFluid: "~680 mL (68% peak). AFI 10-13 cm. Decline accelerating.",
    meconium: "MSAF rate ~18%. Increasing fetal vagal tone.",
    fetalGrowth: "Continued growth. Macrosomia rate 15%. Shoulder dystocia risk rising.",
    hormonal: "Functional progesterone withdrawal progressing (PR-A:PR-B shift). Estrogen:progesterone ratio favoring labor.",
  },
  {
    ga: w(41),
    placenta: "Significant calcification. Villous infarction evident. Distal villous hypoplasia progressing.",
    amnioticFluid: "~520 mL (52% peak). AFI 8-10 cm. 12% oligo rate. Cord compression risk rising.",
    meconium: "MSAF rate ~30%. MAS risk 2-3%. Meconium more concentrated in reduced fluid.",
    fetalGrowth: "Macrosomia rate 20%. Shoulder dystocia + operative delivery risk elevated.",
    hormonal: "Gap junctions between myocytes fully formed. Cervical ripening biology active.",
  },
  {
    ga: w(42),
    placenta: "Extensive calcification. Reduced functional villous surface. Clinically silent failure risk high.",
    amnioticFluid: "~360 mL (36% peak). AFI often <8. Oligohydramnios increasingly common.",
    meconium: "MSAF rate 40-52%. MAS risk 4.8%. 5-12% MAS mortality.",
    fetalGrowth: "Macrosomia rate 26%. Postmaturity syndrome possible (dry skin, wasting).",
    hormonal: "Hormonal milieu maximally labor-ready. Failure to initiate labor reflects individual variation.",
  },
];
