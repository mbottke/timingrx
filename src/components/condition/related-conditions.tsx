import Link from "next/link";
import {
  getRelatedConditions,
  type RelatedCondition,
} from "@/lib/utils/related-conditions";
import { GAWindowBadge } from "./ga-window-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const reasonLabels: Record<RelatedCondition["reason"], string> = {
  interaction: "Interacts",
  same_category: "Same category",
  similar_ga: "Similar GA",
};

const reasonVariant: Record<
  RelatedCondition["reason"],
  "default" | "secondary" | "outline"
> = {
  interaction: "default",
  same_category: "secondary",
  similar_ga: "outline",
};

export function RelatedConditions({
  conditionId,
}: {
  conditionId: string;
}) {
  const related = getRelatedConditions(conditionId);

  if (related.length === 0) return null;

  return (
    <Card className="border-l-4 border-l-muted-foreground/20">
      <CardHeader>
        <CardTitle className="text-base font-semibold tracking-tight">
          Related Conditions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {related.map(({ condition, reason }) => {
            const rec = condition.guidelineRecommendations[0];
            return (
              <Link
                key={condition.id}
                href={`/conditions/${condition.id}`}
                className="block rounded-lg border bg-muted/30 p-3 transition-colors hover:bg-muted/50 hover:border-[var(--brand-pink)]/40"
              >
                <p className="text-sm font-semibold leading-snug mb-1.5">
                  {condition.name}
                </p>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge
                    variant={reasonVariant[reason]}
                    className="text-[10px] px-1.5 py-0"
                  >
                    {reasonLabels[reason]}
                  </Badge>
                  {rec && <GAWindowBadge timing={rec.timing} />}
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
