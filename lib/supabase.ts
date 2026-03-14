import { createClient } from "@supabase/supabase-js";
import type { Book, FavoriteQuote } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Books ────────────────────────────────────────────────────────────────────

export async function getBooks(): Promise<Book[]> {
  const { data: books, error } = await supabase
    .from("books")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  const { data: genres } = await supabase.from("book_genres").select("*");

  return (books || []).map((book) => ({
    ...book,
    genres: (genres || [])
      .filter((g) => g.book_id === book.id)
      .map((g) => g.genre),
  }));
}

export async function getBook(id: string): Promise<Book | null> {
  const { data: book, error } = await supabase
    .from("books")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;

  const { data: genres } = await supabase
    .from("book_genres")
    .select("genre")
    .eq("book_id", id);

  return {
    ...book,
    genres: (genres || []).map((g) => g.genre),
  };
}

export async function createBook(
  book: Omit<Book, "id" | "created_at" | "genres">,
  genres: string[] = []
): Promise<Book> {
  const { data, error } = await supabase
    .from("books")
    .insert(book)
    .select()
    .single();

  if (error) throw error;

  if (genres.length > 0) {
    await supabase.from("book_genres").insert(
      genres.map((genre) => ({ book_id: data.id, genre }))
    );
  }

  return { ...data, genres };
}

export async function updateBook(
  id: string,
  updates: Partial<Omit<Book, "id" | "created_at" | "genres">>,
  genres?: string[]
): Promise<Book> {
  const { data, error } = await supabase
    .from("books")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  if (genres !== undefined) {
    await supabase.from("book_genres").delete().eq("book_id", id);
    if (genres.length > 0) {
      await supabase.from("book_genres").insert(
        genres.map((genre) => ({ book_id: id, genre }))
      );
    }
  }

  const { data: genreData } = await supabase
    .from("book_genres")
    .select("genre")
    .eq("book_id", id);

  return { ...data, genres: (genreData || []).map((g) => g.genre) };
}

export async function deleteBook(id: string): Promise<void> {
  const { error } = await supabase.from("books").delete().eq("id", id);
  if (error) throw error;
}

// ── Quotes ───────────────────────────────────────────────────────────────────

export async function getQuotes(bookId: string): Promise<FavoriteQuote[]> {
  const { data, error } = await supabase
    .from("favorite_quotes")
    .select("*")
    .eq("book_id", bookId)
    .order("page", { ascending: true, nullsFirst: false });

  if (error) throw error;
  return data || [];
}

export async function addQuote(
  quote: Omit<FavoriteQuote, "id">
): Promise<FavoriteQuote> {
  const { data, error } = await supabase
    .from("favorite_quotes")
    .insert(quote)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteQuote(id: string): Promise<void> {
  const { error } = await supabase
    .from("favorite_quotes")
    .delete()
    .eq("id", id);
  if (error) throw error;
}
