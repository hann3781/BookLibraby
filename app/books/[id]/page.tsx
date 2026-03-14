"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import type { Book, FavoriteQuote } from "@/types";
import { StatusBadge } from "@/components/StatusBadge";
import { StarRating } from "@/components/StarRating";
import { ReviewForm } from "@/components/ReviewForm";
import { QuoteCard } from "@/components/QuoteCard";

interface SuggestedQuote {
  quote: string;
  attribution: string | null;
}

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [book, setBook] = useState<Book | null>(null);
  const [quotes, setQuotes] = useState<FavoriteQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [newQuote, setNewQuote] = useState("");
  const [newPage, setNewPage] = useState("");
  const [addingQuote, setAddingQuote] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestedQuote[]>([]);
  const [suggestionsSource, setSuggestionsSource] = useState<string | null>(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestionsLoaded, setSuggestionsLoaded] = useState(false);

  const fetchBook = useCallback(async () => {
    try {
      const [bookRes, quotesRes] = await Promise.all([
        fetch(`/api/books/${id}`),
        fetch(`/api/books/${id}/quotes`),
      ]);
      if (!bookRes.ok) throw new Error("Book not found");
      setBook(await bookRes.json());
      setQuotes(quotesRes.ok ? await quotesRes.json() : []);
    } catch {
      toast.error("Could not load book");
      router.push("/");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => { fetchBook(); }, [fetchBook]);

  async function handleAddQuote(e: React.FormEvent) {
    e.preventDefault();
    if (!newQuote.trim()) return;
    setAddingQuote(true);
    try {
      const res = await fetch(`/api/books/${id}/quotes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quote: newQuote.trim(), page: newPage ? Number(newPage) : null }),
      });
      if (!res.ok) throw new Error();
      const added = await res.json();
      setQuotes((prev) => [...prev, added]);
      setNewQuote(""); setNewPage("");
      toast.success("Quote saved!");
    } catch {
      toast.error("Failed to add quote");
    } finally {
      setAddingQuote(false);
    }
  }

  async function handleDeleteQuote(quoteId: string) {
    try {
      await fetch(`/api/books/${id}/quotes`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: quoteId }),
      });
      setQuotes((prev) => prev.filter((q) => q.id !== quoteId));
      toast.success("Quote removed");
    } catch {
      toast.error("Failed to remove quote");
    }
  }

  async function loadSuggestions() {
    setLoadingSuggestions(true);
    try {
      const res = await fetch(`/api/books/${id}/quotes/suggestions`);
      const data = await res.json();
      setSuggestions(data.quotes ?? []);
      setSuggestionsSource(data.source ?? null);
      setSuggestionsLoaded(true);
      if ((data.quotes ?? []).length === 0) toast("No quotes found on Wikiquote", { icon: "📭" });
    } catch {
      toast.error("Could not load suggestions");
    } finally {
      setLoadingSuggestions(false);
    }
  }

  async function saveSuggestion(q: SuggestedQuote) {
    try {
      const res = await fetch(`/api/books/${id}/quotes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quote: q.quote, page: null }),
      });
      if (!res.ok) throw new Error();
      const added = await res.json();
      setQuotes((prev) => [...prev, added]);
      setSuggestions((prev) => prev.filter((s) => s.quote !== q.quote));
      toast.success("Quote saved!");
    } catch {
      toast.error("Failed to save quote");
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await fetch(`/api/books/${id}`, { method: "DELETE" });
      toast.success(`"${book?.title}" removed from shelf`);
      router.push("/");
    } catch {
      toast.error("Failed to delete book");
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <span className="text-5xl mb-4 block animate-pulse">🌿</span>
          <p className="font-script text-2xl text-sage-dark/50">Opening the book…</p>
        </div>
      </div>
    );
  }

  if (!book) return null;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back */}
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-forest/45 hover:text-sage-dark transition-colors mb-7 font-lora">
        ← Back to Bookshelf
      </Link>

      {/* Book header */}
      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 mb-10">
        {/* Cover */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="relative w-44 md:w-full aspect-[2/3] bg-parchment-dark rounded-xl overflow-hidden book-card-shadow">
            {book.cover_url ? (
              <Image src={book.cover_url} alt={`Cover of ${book.title}`} fill className="object-cover" unoptimized />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-sage-pale to-parchment">
                <span className="text-5xl opacity-20">📖</span>
              </div>
            )}
          </div>
          <StatusBadge status={book.status} />
          {book.rating && (
            <div className="flex flex-col items-center md:items-start gap-1">
              <StarRating value={book.rating} readonly size="md" />
              <p className="text-xs text-forest/40 font-lora">{book.rating} / 5 stars</p>
            </div>
          )}
          {book.would_recommend !== null && (
            <p className="text-sm font-lora text-forest/55">
              {book.would_recommend ? "👍 Would recommend" : "👎 Wouldn't recommend"}
            </p>
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-forest mb-2 leading-tight">
            {book.title}
          </h1>
          {book.author && (
            <p className="font-lora italic text-forest/60 text-lg mb-5">by {book.author}</p>
          )}

          {/* Genres */}
          {book.genres && book.genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {book.genres.map((g) => (
                <span key={g} className="text-xs px-2.5 py-1 bg-sage-pale text-sage-deep border border-sage/25 rounded-full font-lora">
                  {g}
                </span>
              ))}
            </div>
          )}

          {/* Dates */}
          {(book.date_started || book.date_finished) && (
            <div className="flex gap-5 text-xs text-forest/40 font-lora italic mb-5">
              {book.date_started && <span>Started: {formatDate(book.date_started)}</span>}
              {book.date_finished && <span>Finished: {formatDate(book.date_finished)}</span>}
            </div>
          )}

          {/* Review preview */}
          {book.review_text && (
            <div className="bg-sage-pale border border-sage/20 rounded-xl p-5">
              <h3 className="font-script text-xl text-sage-dark mb-2">My Review</h3>
              <p className="font-lora text-sm text-forest/70 leading-relaxed italic whitespace-pre-wrap">
                {book.review_text}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="sage-divider mb-10" />

      {/* Review + Quotes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Review form */}
        <section>
          <h2 className="font-script text-4xl text-sage-dark mb-6">
            {book.review_text ? "Edit Review" : "Write a Review"}
          </h2>
          <ReviewForm book={book} onSave={setBook} />
        </section>

        {/* Quotes */}
        <section>
          <h2 className="font-script text-4xl text-sage-dark mb-6">Favourite Quotes</h2>

          {/* Add quote */}
          <form onSubmit={handleAddQuote}
            className="mb-5 bg-cream border border-sage/20 rounded-card p-4 paper-shadow">
            <textarea
              value={newQuote} onChange={(e) => setNewQuote(e.target.value)}
              rows={3} placeholder="Add a favourite quote…"
              className="w-full px-3 py-2 text-sm bg-parchment border border-sage/15 rounded-lg font-lora text-forest placeholder:text-forest/30 resize-none mb-3"
            />
            <div className="flex items-center gap-2">
              <input
                type="number" value={newPage} onChange={(e) => setNewPage(e.target.value)}
                placeholder="Page #" min={1}
                className="w-24 px-3 py-1.5 text-sm bg-parchment border border-sage/15 rounded-lg font-lora text-forest placeholder:text-forest/30"
              />
              <button
                type="submit" disabled={addingQuote || !newQuote.trim()}
                className="flex-1 py-1.5 bg-sage-dark text-cream text-sm font-lora rounded-lg hover:bg-sage-deep transition-colors disabled:opacity-50"
              >
                {addingQuote ? "Saving…" : "Save Quote"}
              </button>
            </div>
          </form>

          {/* Wikiquote suggestions */}
          <div className="mb-5">
            {!suggestionsLoaded ? (
              <button
                onClick={loadSuggestions}
                disabled={loadingSuggestions}
                className="w-full py-2 rounded-xl border border-sage/20 text-sm font-lora text-forest/50 hover:border-sage hover:text-sage-dark transition-colors disabled:opacity-50"
              >
                {loadingSuggestions ? "Searching Wikiquote…" : "✦ Load quotes from Wikiquote"}
              </button>
            ) : suggestions.length > 0 ? (
              <div className="space-y-3">
                <p className="text-xs font-lora text-forest/35 italic">
                  From Wikiquote · {suggestionsSource}
                </p>
                {suggestions.map((s, i) => (
                  <div key={i} className="bg-sage-pale border border-sage/15 rounded-xl p-4">
                    <p className="font-lora text-sm text-forest/80 italic leading-relaxed mb-2">
                      &ldquo;{s.quote}&rdquo;
                    </p>
                    {s.attribution && (
                      <p className="text-xs text-forest/35 font-lora mb-3">{s.attribution}</p>
                    )}
                    <button
                      onClick={() => saveSuggestion(s)}
                      className="text-xs px-3 py-1.5 bg-sage text-cream rounded-lg font-lora hover:bg-sage-dark transition-colors"
                    >
                      + Save to my quotes
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          {/* Quote list */}
          {quotes.length === 0 ? (
            <p className="font-lora italic text-sm text-forest/35 text-center py-8">
              No quotes saved yet
            </p>
          ) : (
            <div className="space-y-3">
              {quotes.map((q) => <QuoteCard key={q.id} quote={q} onDelete={handleDeleteQuote} />)}
            </div>
          )}
        </section>
      </div>

      {/* Delete */}
      <div className="mt-16 pt-6 border-t border-sage/10">
        {!showDeleteConfirm ? (
          <button onClick={() => setShowDeleteConfirm(true)}
            className="text-xs text-forest/25 hover:text-warm-dark transition-colors font-lora">
            Remove from shelf
          </button>
        ) : (
          <div className="flex items-center gap-4 bg-warm/8 border border-warm/20 rounded-xl px-4 py-3">
            <p className="text-sm font-lora text-forest/65 flex-1">
              Remove &ldquo;{book.title}&rdquo; from your shelf?
            </p>
            <button onClick={() => setShowDeleteConfirm(false)}
              className="text-xs text-forest/40 font-lora hover:text-sage-dark">Cancel</button>
            <button onClick={handleDelete} disabled={deleting}
              className="text-xs bg-warm text-cream px-3 py-1.5 rounded-lg font-lora hover:bg-warm-dark disabled:opacity-50">
              {deleting ? "Removing…" : "Yes, Remove"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
}
