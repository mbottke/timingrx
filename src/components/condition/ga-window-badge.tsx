import type { DeliveryTiming } from "@/data/types";
import { gaRangeToDisplay } from "@/lib/utils/ga-format";
import { Badge } from "@/components/ui/badge";

export function GAWindowBadge({ timing }: { timing: DeliveryTiming }) {
  if (timing.type === "range") {
    return (
      <Badge variant="outline" className="text-xs">
        {gaRangeToDisplay(timing.range.earliest, timing.range.latest)}
      </Badge>
    );
  }

  if (timing.type === "immediate") {
    return (
      <Badge className="bg-[var(--risk-high)] text-white text-xs">
        Immediate
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="text-xs">
      Individualize
    </Badge>
  );
}
