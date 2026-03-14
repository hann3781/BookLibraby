import { getBooks } from "@/lib/supabase";
import { BookShelf } from "@/components/BookShelf";

export const revalidate = 0;

export default async function HomePage() {
  let books = [];
  let error = null;

  try {
    books = await getBooks();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load books.";
  }

  return (
    <div>
      {/* Hero */}
      <div className="mb-10">
        <h1 className="font-script text-6xl text-sage-dark mb-1 leading-tight">
          My Bookshelf
        </h1>
        <p className="font-lora italic text-forest/50 text-sm">
          {books.length > 0
            ? `${books.length} ${books.length === 1 ? "book" : "books"} in your collection`
            : "Begin your reading journey"}
        </p>
        <div className="sage-divider mt-4" />
      </div>

      {error ? (
        <div className="bg-warm/10 border border-warm/25 rounded-card p-6 text-center">
          <p className="font-playfair text-warm-dark font-semibold mb-1">
            Could not connect to your library
          </p>
          <p className="text-sm text-forest/60 font-lora">
            {error}
            <br />
            Make sure your Supabase credentials are set in{" "}
            <code className="bg-parchment-dark px-1 rounded text-xs">.env.local</code>
          </p>
        </div>
      ) : (
        <BookShelf books={books} />
      )}
    </div>
  );
}
