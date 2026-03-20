import { conditionsByCategory, conditionGroups } from "@/data/conditions";
import { CATEGORY_DISPLAY_NAMES, type ConditionCategory } from "@/data/types";
import { ConditionCard } from "@/components/condition/condition-card";

export default function ConditionsPage() {
  const categories = conditionsByCategory();
  const categoryOrder: ConditionCategory[] = Object.keys(
    CATEGORY_DISPLAY_NAMES
  ) as ConditionCategory[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          Delivery Timing by Condition
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {conditionGroups.length} conditions across{" "}
          {categories.size} categories. Each with guideline-specific GA
          recommendations and evidence grades.
        </p>
      </div>

      <div className="space-y-10">
        {categoryOrder.map((cat) => {
          const conditions = categories.get(cat);
          if (!conditions || conditions.length === 0) return null;
          return (
            <section key={cat}>
              <h2 className="mb-4 text-lg font-semibold">
                {CATEGORY_DISPLAY_NAMES[cat]}
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({conditions.length})
                </span>
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {conditions.map((condition) => (
                  <ConditionCard
                    key={condition.id}
                    condition={condition}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
