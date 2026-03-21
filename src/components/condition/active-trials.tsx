"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Trial {
  nctId: string;
  title: string;
  status: string;
  phase: string;
}

interface TrialsResponse {
  trials: Trial[];
  query: string;
  note?: string;
}

export function ActiveTrials({ conditionName }: { conditionName: string }) {
  const [data, setData] = useState<TrialsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = `/api/trials?q=${encodeURIComponent(conditionName)}`;
    fetch(url)
      .then((res) => res.json())
      .then((json: TrialsResponse) => setData(json))
      .catch(() => setData({ trials: [], query: conditionName }))
      .finally(() => setLoading(false));
  }, [conditionName]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold tracking-tight">
          Active Clinical Trials
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                <div className="h-3 w-1/3 rounded bg-muted animate-pulse" />
              </div>
            ))}
          </div>
        ) : data && data.trials.length > 0 ? (
          <ul className="space-y-3">
            {data.trials.map((trial, i) => (
              <li
                key={i}
                className="rounded-lg border bg-muted/20 p-3 space-y-1"
              >
                <p className="text-sm font-medium leading-snug">
                  {trial.title}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-mono">{trial.nctId}</span>
                  <span>{trial.phase}</span>
                  <span>{trial.status}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            No active trials found.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
