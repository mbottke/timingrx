"use client";

import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { w } from "@/data/helpers";
import { gaToDisplay } from "@/lib/utils/ga-format";
import {
  calcFromLMP,
  calcFromCRL,
  calcFromBiometry,
  calcFromIVF,
  eddToLMP,
  gaToExpectedCRL,
  gaToExpectedBiometry,
  fmtDate,
  CRL_MIN,
  CRL_MAX,
  BIOMETRY,
  type BiometryType,
  type IVFDateType,
  type GAResult,
} from "@/lib/utils/ga-calculators";
import type { GestationalAgeDays } from "@/data/types";

// ── Method metadata ──────────────────────────────────────────────────

type GAMethod = "manual" | "lmp" | "ultrasound_crl" | "ultrasound_dating" | "ivf";

interface GAMethodInfo {
  id: GAMethod;
  label: string;
  accuracy: string;
  accuracyDetail: string;
  icon: string;
}

const GA_METHODS: GAMethodInfo[] = [
  {
    id: "manual",
    label: "Manual Entry",
    accuracy: "Depends on source",
    accuracyDetail:
      "Accuracy depends on which dating method was used to determine the GA. Most EMRs display the GA calculated from the best obstetric estimate (BOE), which should be established by 20 weeks using ACOG dating criteria.",
    icon: "✏️",
  },
  {
    id: "lmp",
    label: "Last Menstrual Period",
    accuracy: "± 5–7 days (if regular cycles)",
    accuracyDetail:
      "Naegele's rule: EDD = LMP + 280 days. Assumes 28-day cycles with ovulation on day 14. Accuracy decreases with irregular cycles, recent OCP use, or breastfeeding. ACOG recommends ultrasound confirmation. If US dating differs by >5 days (1st tri), >7 days (14–15w6d), >10 days (16–21w6d), >14 days (22–27w6d), or >21 days (≥28w), redating by US is recommended.",
    icon: "📅",
  },
  {
    id: "ultrasound_crl",
    label: "1st Trimester US (CRL)",
    accuracy: "± 3–5 days (most accurate US)",
    accuracyDetail:
      "Crown-rump length (CRL) measurement between 6w0d–13w6d is the single most accurate dating method. Uses the Hadlock 1992 regression formula to convert CRL (mm) to GA. This method supersedes LMP dating when discrepancy >5 days. First-trimester US dating is the gold standard per ACOG CO 700.",
    icon: "🔬",
  },
  {
    id: "ultrasound_dating",
    label: "2nd/3rd Trimester US",
    accuracy: "± 7–21 days (decreasing)",
    accuracyDetail:
      "Uses Hadlock biometric formulas (1984). Choose from Femur Length (FL), Biparietal Diameter (BPD), or Head Circumference (HC). Accuracy by GA at scan: 14–15w ±7d, 16–21w ±10d, 22–27w ±14d, ≥28w ±21d. Later scans reflect biological size variation more than true GA uncertainty.",
    icon: "📏",
  },
  {
    id: "ivf",
    label: "IVF / ART",
    accuracy: "± 1–3 days (most precise)",
    accuracyDetail:
      "The most precise dating method — fertilization date is known. GA is calculated from egg retrieval date (+14 days) or embryo transfer date (+14 + embryo age). IVF dates should NOT be adjusted by ultrasound per ACOG CO 700.",
    icon: "🧬",
  },
];

// ── Props ────────────────────────────────────────────────────────────

interface Props {
  currentGA: GestationalAgeDays;
  onGAChange: (ga: GestationalAgeDays) => void;
}

// ── Info bubble ──────────────────────────────────────────────────────

function InfoBubble({ info }: { info: GAMethodInfo }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-block">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className="inline-flex items-center justify-center rounded-full size-4 text-[9px] bg-muted hover:bg-muted-foreground/20 transition-colors"
        aria-label={`Info about ${info.label}`}
      >
        ?
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute z-50 left-0 top-6 w-72 rounded-md border bg-popover p-3 shadow-lg text-xs text-popover-foreground">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="font-medium">{info.label}</span>
              <Badge variant="outline" className="text-[9px] px-1">
                {info.accuracy}
              </Badge>
            </div>
            <p className="text-muted-foreground leading-relaxed">{info.accuracyDetail}</p>
          </div>
        </>
      )}
    </span>
  );
}

// ── Result display ───────────────────────────────────────────────────

function ResultPanel({
  result,
  label,
  showGAAtScan,
}: {
  result: GAResult;
  label: string;
  showGAAtScan?: boolean;
}) {
  return (
    <div className="rounded-md border border-[var(--brand-blue)]/30 bg-[var(--brand-blue)]/5 p-2.5 space-y-1">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
        {label}
      </p>
      {showGAAtScan && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">GA at scan</span>
          <span className="font-mono font-medium">
            {gaToDisplay(result.gaDaysAtScan as GestationalAgeDays)}
          </span>
        </div>
      )}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Current GA</span>
        <span className="font-mono font-bold kairos-gradient-text">
          {gaToDisplay(result.currentGADays as GestationalAgeDays)}
        </span>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">EDD</span>
        <span className="font-mono font-medium">{fmtDate(result.edd)}</span>
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────

export function GAEntry({ currentGA, onGAChange }: Props) {
  const [method, setMethod] = useState<GAMethod>("manual");

  // Manual
  const [manualWeeks, setManualWeeks] = useState(39);
  const [manualDays, setManualDays] = useState(0);

  // LMP
  const [lmpDate, setLmpDate] = useState("");
  const [cycleLength, setCycleLength] = useState(28);
  const [reverseLMP, setReverseLMP] = useState(false);
  const [reverseEDD, setReverseEDD] = useState("");

  // CRL
  const [crlMm, setCrlMm] = useState<number | "">(20);
  const [crlScanDate, setCrlScanDate] = useState("");
  const [reverseCRL, setReverseCRL] = useState(false);
  const [reverseGAWeeks, setReverseGAWeeks] = useState(8);
  const [reverseGADays, setReverseGADays] = useState(0);

  // 2nd/3rd tri
  const [bioType, setBioType] = useState<BiometryType>("fl");
  const [bioValueMm, setBioValueMm] = useState<number | "">(30);
  const [bioScanDate, setBioScanDate] = useState("");
  const [reverseBio, setReverseBio] = useState(false);
  const [reverseBioGAWeeks, setReverseBioGAWeeks] = useState(20);
  const [reverseBioGADays, setReverseBioGADays] = useState(0);

  // IVF
  const [ivfDateType, setIvfDateType] = useState<IVFDateType>("transfer");
  const [ivfDate, setIvfDate] = useState("");
  const [embryoAge, setEmbryoAge] = useState(5);

  // Calculated result (null until user clicks Calculate)
  const [calcResult, setCalcResult] = useState<GAResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const today = useMemo(() => new Date(), []);

  const selectedMethodInfo = GA_METHODS.find((m) => m.id === method)!;

  // ── Calculate handler ──────────────────────────────────────────────

  const handleCalculate = useCallback(() => {
    setCalcError(null);
    setCalcResult(null);

    try {
      let result: GAResult;

      switch (method) {
        case "manual": {
          const ga = w(manualWeeks) + manualDays;
          if (ga < w(20) || ga > w(43)) {
            setCalcError("GA must be between 20w0d and 43w0d for delivery timing.");
            return;
          }
          // For manual, create a synthetic result
          const edd = new Date(today.getTime() + (280 - ga) * 86_400_000);
          result = {
            gaWeeksAtScan: ga / 7,
            gaDaysAtScan: ga,
            currentGADays: ga,
            edd,
          };
          break;
        }

        case "lmp": {
          if (reverseLMP) {
            // Reverse mode: EDD → LMP
            if (!reverseEDD) {
              setCalcError("Enter an estimated due date.");
              return;
            }
            const edd = new Date(reverseEDD + "T00:00:00");
            const lmp = eddToLMP(edd, cycleLength);
            result = calcFromLMP(lmp, today, cycleLength);
            // Auto-fill the LMP field
            setLmpDate(lmp.toISOString().slice(0, 10));
            break;
          }
          if (!lmpDate) {
            setCalcError("Enter the first day of the last menstrual period.");
            return;
          }
          result = calcFromLMP(new Date(lmpDate + "T00:00:00"), today, cycleLength);
          if (result.currentGADays < 0) {
            setCalcError("LMP date is in the future.");
            return;
          }
          break;
        }

        case "ultrasound_crl": {
          if (reverseCRL) {
            // Reverse: GA → expected CRL
            const targetGA = reverseGAWeeks + reverseGADays / 7;
            const expectedCRL = gaToExpectedCRL(targetGA);
            if (expectedCRL === null) {
              setCalcError("GA is outside the valid CRL range (≈6w–14w).");
              return;
            }
            // Show as informational — no GA result to apply
            setCalcError(null);
            setCalcResult(null);
            // We'll display the reverse result directly, handled in the render
            setCrlMm(expectedCRL);
            return;
          }
          if (crlMm === "" || crlMm < CRL_MIN || crlMm > CRL_MAX) {
            setCalcError(`CRL must be between ${CRL_MIN} and ${CRL_MAX} mm.`);
            return;
          }
          if (!crlScanDate) {
            setCalcError("Enter the date the ultrasound was performed.");
            return;
          }
          result = calcFromCRL(crlMm, new Date(crlScanDate + "T00:00:00"), today);
          break;
        }

        case "ultrasound_dating": {
          if (reverseBio) {
            const targetGA = reverseBioGAWeeks + reverseBioGADays / 7;
            const expected = gaToExpectedBiometry(bioType, targetGA);
            if (expected === null) {
              setCalcError(`GA is outside the valid range for ${BIOMETRY[bioType].label}.`);
              return;
            }
            setBioValueMm(expected);
            setCalcError(null);
            setCalcResult(null);
            return;
          }
          if (bioValueMm === "") {
            setCalcError(`Enter a ${BIOMETRY[bioType].label} measurement.`);
            return;
          }
          const meta = BIOMETRY[bioType];
          if (bioValueMm < meta.minMm || bioValueMm > meta.maxMm) {
            setCalcError(`${meta.label} must be between ${meta.minMm} and ${meta.maxMm} mm.`);
            return;
          }
          if (!bioScanDate) {
            setCalcError("Enter the date the ultrasound was performed.");
            return;
          }
          result = calcFromBiometry(bioType, bioValueMm, new Date(bioScanDate + "T00:00:00"), today);
          break;
        }

        case "ivf": {
          if (!ivfDate) {
            setCalcError(
              ivfDateType === "transfer"
                ? "Enter the embryo transfer date."
                : "Enter the egg retrieval date.",
            );
            return;
          }
          result = calcFromIVF(
            ivfDateType,
            new Date(ivfDate + "T00:00:00"),
            embryoAge,
            today,
          );
          break;
        }

        default:
          return;
      }

      setCalcResult(result);
    } catch {
      setCalcError("Calculation error — check your inputs.");
    }
  }, [
    method, manualWeeks, manualDays, lmpDate, cycleLength, reverseLMP, reverseEDD,
    crlMm, crlScanDate, reverseCRL, reverseGAWeeks, reverseGADays,
    bioType, bioValueMm, bioScanDate, reverseBio, reverseBioGAWeeks, reverseBioGADays,
    ivfDateType, ivfDate, embryoAge, today,
  ]);

  // ── Apply calculated GA to the risk curve ──────────────────────────

  const canApply =
    calcResult !== null &&
    calcResult.currentGADays >= w(20) &&
    calcResult.currentGADays <= w(43);

  const applyGA = () => {
    if (canApply) {
      onGAChange(calcResult!.currentGADays as GestationalAgeDays);
    }
  };

  // ── Shared styles ──────────────────────────────────────────────────

  const inputClasses =
    "rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  const reverseToggle = (
    active: boolean,
    onToggle: () => void,
    forwardLabel: string,
    reverseLabel: string,
  ) => (
    <button
      onClick={() => { onToggle(); setCalcResult(null); setCalcError(null); }}
      className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
      title={active ? `Switch to: ${forwardLabel}` : `Switch to: ${reverseLabel}`}
    >
      <span className="font-mono">↔</span>
      <span>{active ? reverseLabel : forwardLabel}</span>
    </button>
  );

  // ── Render ─────────────────────────────────────────────────────────

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          Gestational Age
          <InfoBubble info={selectedMethodInfo} />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Current GA display */}
        <div className="text-center">
          <span className="text-2xl font-bold">{gaToDisplay(currentGA)}</span>
        </div>

        {/* Method selector */}
        <div className="flex flex-wrap gap-1">
          {GA_METHODS.map((m) => (
            <button
              key={m.id}
              onClick={() => { setMethod(m.id); setCalcResult(null); setCalcError(null); }}
              className={`flex items-center gap-1 rounded-md px-2 py-1 text-[11px] border transition-colors ${
                method === m.id
                  ? "border-[var(--brand-pink)] bg-[var(--brand-pink)]/10 text-[var(--brand-pink)] font-medium"
                  : "border-transparent hover:bg-accent/50 text-muted-foreground"
              }`}
            >
              <span>{m.icon}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>

        {/* ─── Method inputs ─────────────────────────────────────── */}
        <div className="space-y-2">

          {/* Manual */}
          {method === "manual" && (
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground">Weeks:</label>
              <input
                type="number"
                min={20}
                max={42}
                value={manualWeeks}
                onChange={(e) => setManualWeeks(Number(e.target.value))}
                className={`${inputClasses} w-16`}
              />
              <label className="text-xs text-muted-foreground">Days:</label>
              <input
                type="number"
                min={0}
                max={6}
                value={manualDays}
                onChange={(e) => setManualDays(Math.min(6, Math.max(0, Number(e.target.value))))}
                className={`${inputClasses} w-14`}
              />
            </div>
          )}

          {/* LMP */}
          {method === "lmp" && (
            <div className="space-y-2">
              <div className="flex justify-end">
                {reverseToggle(reverseLMP, () => setReverseLMP(!reverseLMP), "LMP → GA & EDD", "EDD → LMP")}
              </div>

              {!reverseLMP ? (
                <>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-muted-foreground whitespace-nowrap">
                      First day of LMP:
                    </label>
                    <input
                      type="date"
                      value={lmpDate}
                      onChange={(e) => setLmpDate(e.target.value)}
                      className={`${inputClasses} flex-1`}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-muted-foreground whitespace-nowrap">
                      Cycle length:
                    </label>
                    <input
                      type="number"
                      min={21}
                      max={40}
                      value={cycleLength}
                      onChange={(e) => setCycleLength(Number(e.target.value))}
                      className={`${inputClasses} w-16`}
                    />
                    <span className="text-[10px] text-muted-foreground">days (default 28)</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-muted-foreground whitespace-nowrap">
                      Enter EDD:
                    </label>
                    <input
                      type="date"
                      value={reverseEDD}
                      onChange={(e) => setReverseEDD(e.target.value)}
                      className={`${inputClasses} flex-1`}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-muted-foreground whitespace-nowrap">
                      Cycle length:
                    </label>
                    <input
                      type="number"
                      min={21}
                      max={40}
                      value={cycleLength}
                      onChange={(e) => setCycleLength(Number(e.target.value))}
                      className={`${inputClasses} w-16`}
                    />
                    <span className="text-[10px] text-muted-foreground">days</span>
                  </div>
                  {lmpDate && calcResult && (
                    <p className="text-[11px] text-muted-foreground">
                      Back-calculated LMP: <span className="font-mono font-medium">{lmpDate}</span>
                    </p>
                  )}
                </>
              )}
            </div>
          )}

          {/* CRL (1st Trimester) */}
          {method === "ultrasound_crl" && (
            <div className="space-y-2">
              <div className="flex justify-end">
                {reverseToggle(reverseCRL, () => setReverseCRL(!reverseCRL), "CRL → GA", "GA → CRL")}
              </div>

              {!reverseCRL ? (
                <>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-muted-foreground whitespace-nowrap">
                      CRL measurement:
                    </label>
                    <input
                      type="number"
                      min={CRL_MIN}
                      max={CRL_MAX}
                      step={0.1}
                      value={crlMm}
                      onChange={(e) => setCrlMm(e.target.value === "" ? "" : Number(e.target.value))}
                      className={`${inputClasses} w-20`}
                    />
                    <span className="text-xs text-muted-foreground">mm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-muted-foreground whitespace-nowrap">
                      Date of US:
                    </label>
                    <input
                      type="date"
                      value={crlScanDate}
                      onChange={(e) => setCrlScanDate(e.target.value)}
                      className={`${inputClasses} flex-1`}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground italic">
                    Valid range: {CRL_MIN}–{CRL_MAX} mm (≈6w0d–13w6d). Hadlock 1992 formula.
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-muted-foreground whitespace-nowrap">
                      Enter GA:
                    </label>
                    <input
                      type="number"
                      min={6}
                      max={13}
                      value={reverseGAWeeks}
                      onChange={(e) => setReverseGAWeeks(Number(e.target.value))}
                      className={`${inputClasses} w-14`}
                    />
                    <span className="text-xs text-muted-foreground">w</span>
                    <input
                      type="number"
                      min={0}
                      max={6}
                      value={reverseGADays}
                      onChange={(e) => setReverseGADays(Math.min(6, Math.max(0, Number(e.target.value))))}
                      className={`${inputClasses} w-14`}
                    />
                    <span className="text-xs text-muted-foreground">d</span>
                  </div>
                  {crlMm !== "" && (
                    <p className="text-xs text-muted-foreground">
                      Expected CRL:{" "}
                      <span className="font-mono font-medium">{crlMm} mm</span>
                    </p>
                  )}
                </>
              )}
            </div>
          )}

          {/* 2nd/3rd Trimester Biometry */}
          {method === "ultrasound_dating" && (
            <div className="space-y-2">
              <div className="flex justify-end">
                {reverseToggle(
                  reverseBio,
                  () => setReverseBio(!reverseBio),
                  "Measurement → GA",
                  "GA → Measurement",
                )}
              </div>

              {/* Biometry type selector */}
              <div className="flex gap-1">
                {(Object.keys(BIOMETRY) as BiometryType[]).map((bt) => (
                  <button
                    key={bt}
                    onClick={() => setBioType(bt)}
                    className={`rounded px-2 py-0.5 text-[10px] border transition-colors ${
                      bioType === bt
                        ? "border-[var(--brand-purple)] bg-[var(--brand-purple)]/10 text-[var(--brand-purple)] font-medium"
                        : "border-transparent hover:bg-accent/50 text-muted-foreground"
                    }`}
                  >
                    {bt.toUpperCase()}
                  </button>
                ))}
              </div>

              {!reverseBio ? (
                <>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-muted-foreground whitespace-nowrap">
                      {BIOMETRY[bioType].label}:
                    </label>
                    <input
                      type="number"
                      min={BIOMETRY[bioType].minMm}
                      max={BIOMETRY[bioType].maxMm}
                      step={1}
                      value={bioValueMm}
                      onChange={(e) => setBioValueMm(e.target.value === "" ? "" : Number(e.target.value))}
                      className={`${inputClasses} w-20`}
                    />
                    <span className="text-xs text-muted-foreground">mm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-muted-foreground whitespace-nowrap">
                      Date of US:
                    </label>
                    <input
                      type="date"
                      value={bioScanDate}
                      onChange={(e) => setBioScanDate(e.target.value)}
                      className={`${inputClasses} flex-1`}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground italic">
                    Hadlock 1984 formula. Range: {BIOMETRY[bioType].minMm}–{BIOMETRY[bioType].maxMm} mm.
                    Accuracy: ±7d (14–15w), ±10d (16–21w), ±14d (22–27w), ±21d (≥28w).
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-muted-foreground whitespace-nowrap">
                      Enter GA:
                    </label>
                    <input
                      type="number"
                      min={14}
                      max={40}
                      value={reverseBioGAWeeks}
                      onChange={(e) => setReverseBioGAWeeks(Number(e.target.value))}
                      className={`${inputClasses} w-14`}
                    />
                    <span className="text-xs text-muted-foreground">w</span>
                    <input
                      type="number"
                      min={0}
                      max={6}
                      value={reverseBioGADays}
                      onChange={(e) => setReverseBioGADays(Math.min(6, Math.max(0, Number(e.target.value))))}
                      className={`${inputClasses} w-14`}
                    />
                    <span className="text-xs text-muted-foreground">d</span>
                  </div>
                  {bioValueMm !== "" && (
                    <p className="text-xs text-muted-foreground">
                      Expected {BIOMETRY[bioType].label}:{" "}
                      <span className="font-mono font-medium">{bioValueMm} mm</span>
                    </p>
                  )}
                </>
              )}
            </div>
          )}

          {/* IVF / ART */}
          {method === "ivf" && (
            <div className="space-y-2">
              <div className="flex gap-1">
                <button
                  onClick={() => setIvfDateType("transfer")}
                  className={`rounded px-2 py-0.5 text-[10px] border transition-colors ${
                    ivfDateType === "transfer"
                      ? "border-[var(--brand-purple)] bg-[var(--brand-purple)]/10 text-[var(--brand-purple)] font-medium"
                      : "border-transparent hover:bg-accent/50 text-muted-foreground"
                  }`}
                >
                  Transfer Date
                </button>
                <button
                  onClick={() => setIvfDateType("retrieval")}
                  className={`rounded px-2 py-0.5 text-[10px] border transition-colors ${
                    ivfDateType === "retrieval"
                      ? "border-[var(--brand-purple)] bg-[var(--brand-purple)]/10 text-[var(--brand-purple)] font-medium"
                      : "border-transparent hover:bg-accent/50 text-muted-foreground"
                  }`}
                >
                  Egg Retrieval Date
                </button>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground whitespace-nowrap">
                  {ivfDateType === "transfer" ? "Transfer date:" : "Retrieval date:"}
                </label>
                <input
                  type="date"
                  value={ivfDate}
                  onChange={(e) => setIvfDate(e.target.value)}
                  className={`${inputClasses} flex-1`}
                />
              </div>

              {ivfDateType === "transfer" && (
                <div className="flex items-center gap-2">
                  <label className="text-xs text-muted-foreground whitespace-nowrap">
                    Embryo age at transfer:
                  </label>
                  <select
                    value={embryoAge}
                    onChange={(e) => setEmbryoAge(Number(e.target.value))}
                    className={`${inputClasses} flex-1`}
                  >
                    <option value={3}>Day 3 (cleavage)</option>
                    <option value={5}>Day 5 (blastocyst)</option>
                    <option value={6}>Day 6 (blastocyst)</option>
                  </select>
                </div>
              )}

              <p className="text-[10px] text-muted-foreground italic">
                {ivfDateType === "transfer"
                  ? `GA = days since transfer + ${14 + embryoAge} (2w${embryoAge}d). EDD = transfer + ${266 - embryoAge} days.`
                  : "GA = days since retrieval + 14 (2w0d). EDD = retrieval + 266 days."}
              </p>
            </div>
          )}
        </div>

        {/* ─── Calculate button ───────────────────────────────────── */}
        <button
          onClick={handleCalculate}
          className="w-full rounded-md px-3 py-2 text-sm font-medium text-white transition-all hover:shadow-md"
          style={{ background: "var(--kairos-gradient)" }}
        >
          Calculate
        </button>

        {/* Error message */}
        {calcError && (
          <p className="text-[11px] text-center text-[var(--brand-pink)]">{calcError}</p>
        )}

        {/* Results */}
        {calcResult && (
          <ResultPanel
            result={calcResult}
            label={`${selectedMethodInfo.label} result`}
            showGAAtScan={
              method === "ultrasound_crl" ||
              method === "ultrasound_dating"
            }
          />
        )}

        {/* Apply to risk curve */}
        {canApply && calcResult!.currentGADays !== currentGA && (
          <button
            onClick={applyGA}
            className="w-full rounded-md border border-[var(--brand-purple)] bg-[var(--brand-purple)]/10 text-[var(--brand-purple)] px-3 py-1.5 text-xs font-medium hover:bg-[var(--brand-purple)]/20 transition-colors"
          >
            Apply {gaToDisplay(calcResult!.currentGADays as GestationalAgeDays)} to Risk Curve
          </button>
        )}

        {canApply && calcResult!.currentGADays === currentGA && (
          <p className="text-[10px] text-center text-muted-foreground">
            ✓ Matches current GA
          </p>
        )}

        {calcResult && !canApply && (
          <p className="text-[11px] text-center text-muted-foreground">
            GA must be 20w0d–43w0d to use the risk curve.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
