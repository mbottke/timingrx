import { allTrials } from "@/data/trials";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function EvidencePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">Evidence Library</h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">
        {allTrials.length} landmark trials that define modern delivery timing practice.
      </p>
      <div className="space-y-4">
        {allTrials.map((trial) => (
          <Card key={trial.id}>
            <CardHeader>
              <div className="flex items-baseline gap-2">
                <CardTitle className="text-base">{trial.name}</CardTitle>
                <Badge variant="outline" className="text-xs">
                  {trial.year}
                </Badge>
                {trial.sampleSize && (
                  <span className="text-xs text-muted-foreground">
                    n={trial.sampleSize.toLocaleString()}
                  </span>
                )}
              </div>
              <CardDescription className="text-xs">
                {trial.journalCitation}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-3">{trial.summary}</p>
              <ul className="space-y-1">
                {trial.keyFindings.map((f, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex gap-1.5">
                    <span className="text-muted-foreground/50">•</span>
                    {f}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
