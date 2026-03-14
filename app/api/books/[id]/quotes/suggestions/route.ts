import { NextRequest, NextResponse } from "next/server";
import { getBook } from "@/lib/supabase";

function cleanWikitext(text: string): string {
  return text
    .replace(/\[\[(?:[^\]|]+\|)?([^\]]+)\]\]/g, "$1") // [[link|label]] → label
    .replace(/'{2,3}/g, "")                             // '''bold''' / ''italic''
    .replace(/<[^>]+>/g, "")                            // <ref>...</ref> etc.
    .replace(/\{\{[^}]+\}\}/g, "")                      // {{templates}}
    .trim();
}

function parseQuotes(wikitext: string): { quote: string; attribution: string | null }[] {
  const lines = wikitext.split("\n");
  const results: { quote: string; attribution: string | null }[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.startsWith("* ") || line.startsWith("** ")) continue;

    const quote = cleanWikitext(line.slice(2));
    if (quote.length < 15 || quote.length > 600) continue;

    // Look ahead for attribution on next line
    const nextLine = lines[i + 1] ?? "";
    const attribution = nextLine.startsWith("** ")
      ? cleanWikitext(nextLine.slice(3))
      : null;

    results.push({ quote, attribution });
  }

  return results;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const book = await getBook(id);
  if (!book) return NextResponse.json({ error: "Book not found" }, { status: 404 });

  const searchTerm = book.author ?? book.title;

  try {
    // 1. Search Wikiquote for the author/title
    const searchRes = await fetch(
      `https://en.wikiquote.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchTerm)}&srnamespace=0&format=json`,
      { next: { revalidate: 86400 } } // cache for 24h
    );
    const searchData = await searchRes.json();
    const hits: { title: string }[] = searchData?.query?.search ?? [];

    if (hits.length === 0) {
      return NextResponse.json({ quotes: [], source: null });
    }

    // 2. Fetch wikitext for best match
    const pageTitle = hits[0].title;
    const parseRes = await fetch(
      `https://en.wikiquote.org/w/api.php?action=parse&page=${encodeURIComponent(pageTitle)}&prop=wikitext&format=json`,
      { next: { revalidate: 86400 } }
    );
    const parseData = await parseRes.json();
    const wikitext: string = parseData?.parse?.wikitext?.["*"] ?? "";

    // Handle redirects (wikitext starts with #redirect)
    if (wikitext.toLowerCase().startsWith("#redirect")) {
      const match = wikitext.match(/\[\[(.+?)\]\]/);
      if (match) {
        const redirectRes = await fetch(
          `https://en.wikiquote.org/w/api.php?action=parse&page=${encodeURIComponent(match[1])}&prop=wikitext&format=json`,
          { next: { revalidate: 86400 } }
        );
        const redirectData = await redirectRes.json();
        const redirectWikitext: string = redirectData?.parse?.wikitext?.["*"] ?? "";
        const quotes = parseQuotes(redirectWikitext).slice(0, 10);
        return NextResponse.json({ quotes, source: match[1] });
      }
    }

    const quotes = parseQuotes(wikitext).slice(0, 10);
    return NextResponse.json({ quotes, source: pageTitle });
  } catch (err) {
    console.error("Wikiquote fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch suggestions" }, { status: 500 });
  }
}
