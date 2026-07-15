import { NextRequest, NextResponse } from "next/server";
import { searchAll } from "@/ai/rag";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  if (!q) {
    return NextResponse.json({ results: [] });
  }

  const results = searchAll(q);
  return NextResponse.json({ results });
}
