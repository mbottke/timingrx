import { foundationalPrinciples } from "@/data/guidelines/foundational-principles";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-6 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight kairos-heading">
          Methodology & Disclaimers
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          How Kairos works, its data sources, and important limitations.
        </p>
      </div>

      <Card className="glass-card border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="text-base">
            ACOG CO 831 Foundational Principles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            {foundationalPrinciples.map((p, i) => (
              <li key={i} className="leading-relaxed">
                {p}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card className="glass-card border-l-4 border-l-[var(--brand-teal)]">
        <CardHeader>
          <CardTitle className="text-base">Risk Calculator Methodology</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-3">
          <p>
            The risk calculator uses a multiplicative relative risk model. The
            baseline stillbirth risk curve comes from Muglu et al. 2019 (PLOS
            Medicine, n=15 million pregnancies), the highest-quality meta-analysis
            available for gestational-age-specific stillbirth risk.
          </p>
          <p>
            Each risk factor applies a published adjusted odds ratio (aOR) or
            relative risk (RR) as a multiplier to the baseline curve. The
            rare-disease assumption (OR {"\u2248"} RR when prevalence {"<"}1%) holds for
            stillbirth at baseline, but is monitored and corrected using the
            Zhang & Yu (1998) formula when combined risk exceeds this threshold.
          </p>
          <p>
            The confidence score uses a 5-component multiplicative formula (EQ
            {" \u00d7 "}MV{" \u00d7 "}IP{" \u00d7 "}MP{" \u00d7 "}RP) that accounts for evidence
            quality, model validity, interaction uncertainty, magnitude
            plausibility, and rare-disease assumption validity.
          </p>
        </CardContent>
      </Card>

      <Card className="glass-card border-l-4 border-l-destructive border-destructive/30">
        <CardHeader>
          <CardTitle className="text-base text-destructive">
            Important Disclaimers
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>
            Kairos is a clinical decision support tool for educational
            purposes. It is NOT a substitute for clinical judgment, institutional
            protocols, or individualized patient assessment.
          </p>
          <p>
            The composite risk calculator has not been prospectively validated.
            Individual risk factor multipliers are from published studies, but
            their multiplicative combination is an extrapolation.
          </p>
          <p>
            Always verify management decisions against current institutional
            protocols and the clinical context of each patient.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
