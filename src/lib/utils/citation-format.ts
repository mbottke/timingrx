import type { Citation } from "@/data/types";

export function formatCitation(citation: Citation): string {
  const bodyPrefix = citation.documentId.startsWith(citation.body)
    ? ""
    : `${citation.body} `;
  const yearSuffix = citation.year ? ` (${citation.year})` : "";
  return `${bodyPrefix}${citation.documentId}${yearSuffix}`;
}

export function formatCitations(citations: Citation[]): string {
  return citations.map(formatCitation).join("; ");
}
