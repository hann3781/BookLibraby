"use client";

import { useState, useMemo } from "react";
import type { Book, BookStatus } from "@/types";
import { BookCard } from "./BookCard";

interface BookShelfProps {
  books: Book[];
}

const STATUS_FILTERS: { label: string; value: BookStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Want to Read", value: "want_to_read" },
  { label: "Reading", value: "reading" },
  { label: "Read", value: "read" },
];

const SORT_OPTIONS = [
  { label: "Recently Added", value: "recent" },
  { label: "Title A–Z", value: "title_asc" },
  { label: "Highest Rated", value: "rating_desc" },
  { label: "Author A–Z", value: "author_asc" },
];

export function BookShelf({ books }: BookShelfProps) {
  const [statusFilter, setStatusFilter] = useState<BookStatus | "all">("all");
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [genreFilter, setGenreFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("recent");

  const allGenres = useMemo(() => {
    const genres = new Set<string>();
    books.forEach((b) => b.genres?.forEach((g) => genres.add(g)));
    return Array.from(genres).sort();
  }, [books]);

  const filtered = useMemo(() => {
    let result = [...books];
    if (statusFilter !== "all") result = result.filter((b) => b.status === statusFilter);
    if (ratingFilter > 0) result = result.filter((b) => (b.rating ?? 0) >= ratingFilter);
    if (genreFilter) result = result.filter((b) => b.genres?.includes(genreFilter));

    switch (sortBy) {
      case "title_asc":   result.sort((a, b) => a.title.localeCompare(b.title)); break;
      case "rating_desc": result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)); break;
      case "author_asc":  result.sort((a, b) => (a.author ?? "").localeCompare(b.author ?? "")); break;
      default: result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    return result;
  }, [books, statusFilter, ratingFilter, genreFilter, sortBy]);

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 mb-8 items-center">
        {/* Status tabs */}
        <div className="flex bg-cream border border-sage/20 rounded-full p-1 gap-1 shadow-sm">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`text-xs px-3 py-1.5 rounded-full font-lora font-medium transition-all ${
                statusFilter === f.value
                  ? "bg-sage text-cream shadow-sm"
                  : "text-forest/60 hover:text-sage-dark"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Rating filter */}
        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(Number(e.target.value))}
          className="text-xs px-3 py-2 rounded-full border border-sage/20 bg-cream text-forest font-lora shadow-sm"
        >
          <option value={0}>Any Rating</option>
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>{r}★ & up</option>
          ))}
        </select>

        {/* Genre filter */}
        {allGenres.length > 0 && (
          <select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className="text-xs px-3 py-2 rounded-full border border-sage/20 bg-cream text-forest font-lora shadow-sm"
          >
            <option value="">All Genres</option>
            {allGenres.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        )}

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="text-xs px-3 py-2 rounded-full border border-sage/20 bg-cream text-forest font-lora shadow-sm ml-auto"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Count */}
      <p className="text-xs text-forest/45 font-lora italic mb-5">
        {filtered.length} {filtered.length === 1 ? "book" : "books"}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState hasBooks={books.length > 0} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map((book) => <BookCard key={book.id} book={book} />)}
        </div>
      )}
    </div>
  );
}

function EmptyState({ hasBooks }: { hasBooks: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-28 text-center">
      <span className="text-6xl mb-5 opacity-25">🌿</span>
      <h2 className="font-script text-4xl text-sage-dark/60 mb-2">
        {hasBooks ? "No books match your filters" : "Your shelf is empty"}
      </h2>
      <p className="text-sm text-forest/40 font-lora italic max-w-xs">
        {hasBooks
          ? "Try adjusting your filters to find your books."
          : "Start by searching for a book to add to your collection."}
      </p>
      {!hasBooks && (
        <a
          href="/books/add"
          className="mt-7 bg-sage text-cream text-sm font-lora font-medium px-6 py-2.5 rounded-full hover:bg-sage-dark transition-colors shadow-sm"
        >
          Add Your First Book
        </a>
      )}
    </div>
  );
}
