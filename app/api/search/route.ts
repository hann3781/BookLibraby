import { NextRequest, NextResponse } from "next/server";
import { searchBooks } from "@/lib/openLibrary";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";

  if (!q.trim()) {
    return NextResponse.json([]);
  }

  try {
    const results = await searchBooks(q);
    return NextResponse.json(results);
  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json(
      { error: "Search failed. Please try again." },
      { status: 500 }
    );
  }
}
