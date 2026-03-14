import type { OpenLibraryResult, SearchResult } from "@/types";

const BASE = "https://openlibrary.org";
const COVERS = "https://covers.openlibrary.org/b";

export function getCoverUrl(
  isbn?: string | null,
  coverId?: number | null,
  size: "S" | "M" | "L" = "L"
): string | null {
  if (isbn) return `${COVERS}/isbn/${isbn}-${size}.jpg`;
  if (coverId) return `${COVERS}/id/${coverId}-${size}.jpg`;
  return null;
}

export async function searchBooks(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  const params = new URLSearchParams({
    q: query,
    limit: "12",
    fields: "key,title,author_name,isbn,cover_i,cover_edition_key,first_publish_year",
  });

  const res = await fetch(`${BASE}/search.json?${params}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error("Open Library search failed");

  const data: { docs: OpenLibraryResult[] } = await res.json();

  return data.docs.map((doc) => {
    const isbn = doc.isbn?.[0] ?? null;
    return {
      key: doc.key,
      title: doc.title,
      author: doc.author_name?.[0] ?? "Unknown Author",
      isbn,
      cover_url: getCoverUrl(isbn, doc.cover_i),
      first_publish_year: doc.first_publish_year ?? null,
    };
  });
}
