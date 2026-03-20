import Link from "next/link";
import { notFound } from "next/navigation";
import { allConditions, conditionById } from "@/data/conditions";
import { CATEGORY_DISPLAY_NAMES } from "@/data/types";
import { ConditionDetail } from "@/components/condition/condition-detail";

export async function generateStaticParams() {
  return allConditions.map((c) => ({ slug: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const condition = conditionById.get(slug);
  if (!condition) return { title: "Condition Not Found" };
  return {
    title: `${condition.name} — Kairos`,
    description: condition.clinicalNotes ?? `Delivery timing for ${condition.name}`,
  };
}

export default async function ConditionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const condition = conditionById.get(slug);
  if (!condition) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link href="/conditions" className="hover:text-foreground transition-colors">
              Conditions
            </Link>
          </li>
          <li aria-hidden="true" className="text-muted-foreground/40">/</li>
          <li>
            <Link href="/conditions" className="hover:text-foreground transition-colors">
              {CATEGORY_DISPLAY_NAMES[condition.category]}
            </Link>
          </li>
          <li aria-hidden="true" className="text-muted-foreground/40">/</li>
          <li className="text-foreground font-medium truncate">
            {condition.name}
          </li>
        </ol>
      </nav>

      <ConditionDetail condition={condition} />
    </div>
  );
}
