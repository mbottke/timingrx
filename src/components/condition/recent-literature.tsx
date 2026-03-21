"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Article {
  title: string;
  journal: string;
  year: number;
}

interface PubMedResponse {
  articles: Article[];
  query: string;
  note?: string;
}

export function RecentLiterature({ conditionName }: { conditionName: string }) {
  const [data, setData] = useState<PubMedResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = `/api/pubmed?q=${encodeURIComponent(conditionName + " delivery timing")}`;
    fetch(url)
      .then((res) => res.json())
      .then((json: PubMedResponse) => setData(json))
      .catch(() => setData({ articles: [], query: conditionName }))
      .finally(() => setLoading(false));
  }, [conditionName]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold tracking-tight">
          PubMed Literature Search
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
              </div>
            ))}
          </div>
        ) : data && data.articles.length > 0 ? (
          <ul className="space-y-3">
            {data.articles.map((article, i) => (
              <li
                key={i}
                className="rounded-lg border bg-muted/20 p-3 space-y-1"
              >
                <p className="text-sm font-medium leading-snug">
                  {article.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {article.journal} ({article.year})
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            No recent articles found.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
