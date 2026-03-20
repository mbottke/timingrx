"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { w } from "@/data/helpers";
import { gaToDisplay } from "@/lib/utils/ga-format";
import type { GestationalAgeDays } from "@/data/types";

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
    accuracy: "± 3–5 days (most accurate)",
    accuracyDetail:
      "Crown-rump length (CRL) measurement between 6w0d–13w6d is the single most accurate dating method. The Hadlock or Robinson formula converts CRL to GA. Accuracy: ±5 days (95% CI) for CRL at 7–10 weeks, ±7 days at 11–14 weeks. This method supersedes LMP dating when discrepancy >5 days. First-trimester US dating is the gold standard per ACOG CO 700 (2017).",
    icon: "🔬",
  },
  {
    id: "ultrasound_dating",
    label: "2nd/3rd Trimester US",
    accuracy: "± 7–21 days (decreasing accuracy)",
    accuracyDetail:
      "Uses biometric parameters: BPD, HC, AC, FL. Accuracy by GA at time of scan: 14w0d–15w6d: ±7 days; 16w0d–21w6d: ±10 days; 22w0d–27w6d: ±14 days; ≥28w0d: ±21 days. Later scans reflect biological variation in fetal size more than true GA uncertainty. Never redate in the 3rd trimester unless no prior dating is available. ACOG CO 700.",
    icon: "📏",
  },
  {
    id: "ivf",
    label: "IVF / ART",
    accuracy: "± 1–3 days (most precise)",
    accuracyDetail:
      "For IVF pregnancies, GA is calculated from the known transfer date: EDD = transfer date + 266 days − embryo age (e.g., −5 for day-5 blastocyst, −3 for day-3 embryo). This is the most precise dating method available because the date of fertilization is known. No redating by US is needed. ACOG CO 700.",
    icon: "🧬",
  },
];

interface Props {
  currentGA: GestationalAgeDays;
  onGAChange: (ga: GestationalAgeDays) => void;
}

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

export function GAEntry({ currentGA, onGAChange }: Props) {
  const [method, setMethod] = useState<GAMethod>("manual");
  const [manualWeeks, setManualWeeks] = useState(39);
  const [manualDays, setManualDays] = useState(0);
  const [lmpDate, setLmpDate] = useState("");
  const [usGA, setUsGA] = useState({ weeks: 8, days: 0 });
  const [usDatePerformed, setUsDatePerformed] = useState("");
  const [ivfTransferDate, setIvfTransferDate] = useState("");
  const [embryoAge, setEmbryoAge] = useState(5); // day-5 blastocyst default

  const today = useMemo(() => new Date(), []);

  // Compute GA from each method
  const computedGA = useMemo<GestationalAgeDays | null>(() => {
    switch (method) {
      case "manual": {
        const ga = w(manualWeeks) + manualDays;
        return ga >= w(20) && ga <= w(43) ? (ga as GestationalAgeDays) : null;
      }
      case "lmp": {
        if (!lmpDate) return null;
        const lmp = new Date(lmpDate + "T00:00:00");
        const diffMs = today.getTime() - lmp.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        return diffDays >= w(20) && diffDays <= w(43)
          ? (diffDays as GestationalAgeDays)
          : null;
      }
      case "ultrasound_crl":
      case "ultrasound_dating": {
        if (!usDatePerformed) return null;
        const scanDate = new Date(usDatePerformed + "T00:00:00");
        const gaAtScanDays = w(usGA.weeks) + usGA.days;
        const daysSinceScan = Math.floor(
          (today.getTime() - scanDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        const currentGADays = gaAtScanDays + daysSinceScan;
        return currentGADays >= w(20) && currentGADays <= w(43)
          ? (currentGADays as GestationalAgeDays)
          : null;
      }
      case "ivf": {
        if (!ivfTransferDate) return null;
        const transfer = new Date(ivfTransferDate + "T00:00:00");
        const daysSinceTransfer = Math.floor(
          (today.getTime() - transfer.getTime()) / (1000 * 60 * 60 * 24)
        );
        // GA = days since transfer + 14 (2 weeks for conceptual age to GA offset) + embryo age at transfer
        const gaIVF = daysSinceTransfer + 14 + embryoAge;
        return gaIVF >= w(20) && gaIVF <= w(43)
          ? (gaIVF as GestationalAgeDays)
          : null;
      }
      default:
        return null;
    }
  }, [method, manualWeeks, manualDays, lmpDate, usGA, usDatePerformed, ivfTransferDate, embryoAge, today]);

  const selectedMethodInfo = GA_METHODS.find((m) => m.id === method)!;

  const applyGA = () => {
    if (computedGA !== null) {
      onGAChange(computedGA);
    }
  };

  const inputClasses =
    "rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

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
          <span className="text-2xl font-bold">
            {gaToDisplay(currentGA)}
          </span>
          {computedGA !== null && computedGA !== currentGA && (
            <span className="text-xs text-muted-foreground ml-2">
              → {gaToDisplay(computedGA)}
            </span>
          )}
        </div>

        {/* Method selector */}
        <div className="flex flex-wrap gap-1">
          {GA_METHODS.map((m) => (
            <button
              key={m.id}
              onClick={() => setMethod(m.id)}
              className={`flex items-center gap-1 rounded-md px-2 py-1 text-[11px] border transition-colors ${
                method === m.id
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-transparent hover:bg-accent/50 text-muted-foreground"
              }`}
            >
              <span>{m.icon}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>

        {/* Method-specific inputs */}
        <div className="space-y-2">
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

          {method === "lmp" && (
            <div className="space-y-2">
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
              {lmpDate && computedGA !== null && (
                <p className="text-[11px] text-muted-foreground">
                  EDD (Naegele&apos;s): {(() => {
                    const lmp = new Date(lmpDate + "T00:00:00");
                    const edd = new Date(lmp.getTime() + 280 * 24 * 60 * 60 * 1000);
                    return edd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                  })()}
                </p>
              )}
            </div>
          )}

          {(method === "ultrasound_crl" || method === "ultrasound_dating") && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground whitespace-nowrap">
                  Date of US:
                </label>
                <input
                  type="date"
                  value={usDatePerformed}
                  onChange={(e) => setUsDatePerformed(e.target.value)}
                  className={`${inputClasses} flex-1`}
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground whitespace-nowrap">
                  GA at US:
                </label>
                <input
                  type="number"
                  min={method === "ultrasound_crl" ? 6 : 14}
                  max={method === "ultrasound_crl" ? 13 : 40}
                  value={usGA.weeks}
                  onChange={(e) => setUsGA((s) => ({ ...s, weeks: Number(e.target.value) }))}
                  className={`${inputClasses} w-14`}
                />
                <span className="text-xs text-muted-foreground">w</span>
                <input
                  type="number"
                  min={0}
                  max={6}
                  value={usGA.days}
                  onChange={(e) => setUsGA((s) => ({ ...s, days: Math.min(6, Math.max(0, Number(e.target.value))) }))}
                  className={`${inputClasses} w-14`}
                />
                <span className="text-xs text-muted-foreground">d</span>
              </div>
              {method === "ultrasound_crl" && (
                <p className="text-[11px] text-muted-foreground italic">
                  CRL dating (6w0d–13w6d) is the most accurate biometric dating method.
                </p>
              )}
              {method === "ultrasound_dating" && (
                <p className="text-[11px] text-muted-foreground italic">
                  Accuracy decreases with later scans: ±7d at 14–15w, ±10d at 16–21w, ±14d at 22–27w, ±21d at ≥28w.
                </p>
              )}
            </div>
          )}

          {method === "ivf" && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground whitespace-nowrap">
                  Transfer date:
                </label>
                <input
                  type="date"
                  value={ivfTransferDate}
                  onChange={(e) => setIvfTransferDate(e.target.value)}
                  className={`${inputClasses} flex-1`}
                />
              </div>
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
              <p className="text-[11px] text-muted-foreground italic">
                IVF dating is the most precise method — fertilization date is known exactly.
              </p>
            </div>
          )}
        </div>

        {/* Apply button */}
        {computedGA !== null && computedGA !== currentGA && (
          <button
            onClick={applyGA}
            className="w-full rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium hover:bg-primary/90 transition-colors"
          >
            Apply: {gaToDisplay(computedGA)}
          </button>
        )}

        {computedGA === null && method !== "manual" && (
          <p className="text-[11px] text-center text-muted-foreground">
            Enter dates above to calculate GA
          </p>
        )}
      </CardContent>
    </Card>
  );
}
