import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");
  if (!query) return NextResponse.json({ articles: [] });

  // Placeholder — will be wired to PubMed MCP when available at runtime
  return NextResponse.json({
    articles: [],
    query,
    note: "PubMed MCP integration pending — will populate when MCP server is available at runtime",
  });
}
