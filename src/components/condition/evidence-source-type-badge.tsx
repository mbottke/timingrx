import type { EvidenceSourceType } from "@/data/types";
import { Badge } from "@/components/ui/badge";
import {
  evidenceSourceColorClass,
  evidenceSourceLabel,
} from "@/lib/utils/evidence-source-colors";

export function EvidenceSourceTypeBadge({ type }: { type: EvidenceSourceType }) {
  return (
    <Badge
      className={`text-[9px] uppercase tracking-wider font-semibold ${evidenceSourceColorClass(type)}`}
    >
      {evidenceSourceLabel(type)}
    </Badge>
  );
}
