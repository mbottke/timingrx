import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");
  if (!query) return NextResponse.json({ trials: [] });

  return NextResponse.json({
    trials: [],
    query,
    note: "ClinicalTrials.gov MCP integration pending",
  });
}
