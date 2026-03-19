import type { EvidenceGrade } from "@/data/types";
import { Badge } from "@/components/ui/badge";

const gradeColors: Record<string, string> = {
  high: "bg-[var(--evidence-high)] text-white",
  moderate: "bg-[var(--evidence-moderate)] text-white",
  low: "bg-[var(--evidence-low)] text-black",
  very_low: "bg-muted text-muted-foreground",
  expert_consensus: "bg-muted text-muted-foreground",
};

export function EvidenceGradeBadge({ grade }: { grade: EvidenceGrade }) {
  return (
    <Badge className={`text-[10px] ${gradeColors[grade.strength] ?? ""}`}>
      Grade {grade.raw}
    </Badge>
  );
}
