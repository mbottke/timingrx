import { notFound } from "next/navigation";
import { allConditions, conditionById } from "@/data/conditions";
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
    title: `${condition.name} — TimingRx`,
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
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-6">
      <ConditionDetail condition={condition} />
    </div>
  );
}
