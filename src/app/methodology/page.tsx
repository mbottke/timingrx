import { MethodologyProvider } from "@/components/methodology/methodology-provider";
import { MethodologyPageContent } from "@/components/methodology/methodology-page-content";

export const metadata = {
  title: "Methodology — Kairos",
  description:
    "Interactive visualization of how Kairos calculates stillbirth risk, " +
    "propagates uncertainty, and scores confidence.",
};

export default function MethodologyPage() {
  return (
    <MethodologyProvider>
      <MethodologyPageContent />
    </MethodologyProvider>
  );
}
