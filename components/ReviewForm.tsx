"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import type { Book, BookStatus } from "@/types";
import { StarRating } from "./StarRating";

const GENRE_OPTIONS = [
  "Fantasy", "Science Fiction", "Mystery", "Thriller", "Romance",
  "Historical Fiction", "Literary Fiction", "Horror", "Non-fiction",
  "Biography", "Self-Help", "Philosophy", "Poetry", "Graphic Novel",
  "Young Adult", "Children's", "Short Stories", "Classic",
];

interface ReviewFormProps {
  book: Book;
  onSave: (updated: Book) => void;
}

export function ReviewForm({ book, onSave }: ReviewFormProps) {
  const [status, setStatus] = useState<BookStatus>(book.status);
  const [rating, setRating] = useState<number | null>(book.rating);
  const [dateStarted, setDateStarted] = useState(book.date_started ?? "");
  const [dateFinished, setDateFinished] = useState(book.date_finished ?? "");
  const [reviewText, setReviewText] = useState(book.review_text ?? "");
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(book.would_recommend ?? null);
  const [genres, setGenres] = useState<string[]>(book.genres ?? []);
  const [saving, setSaving] = useState(false);

  function toggleGenre(g: string) {
    setGenres((prev) => prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/books/${book.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          rating,
          date_started: dateStarted || null,
          date_finished: dateFinished || null,
          review_text: reviewText || null,
          would_recommend: wouldRecommend,
          genres,
        }),
      });
      if (!res.ok) throw new Error();
      onSave(await res.json());
      toast.success("Review saved!");
    } catch {
      toast.error("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Status */}
      <div>
        <label className="block text-sm font-playfair font-semibold text-forest mb-2">
          Reading Status
        </label>
        <div className="flex flex-wrap gap-2">
          {(
            [["want_to_read","Want to Read"],["reading","Currently Reading"],["read","Read"]] as [BookStatus, string][]
          ).map(([val, label]) => (
            <button
              key={val} type="button" onClick={() => setStatus(val)}
              className={`text-sm px-4 py-2 rounded-full border font-lora transition-all ${
                status === val
                  ? "bg-sage text-cream border-sage"
                  : "bg-cream text-forest/70 border-sage/25 hover:border-sage"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm font-playfair font-semibold text-forest mb-2">
          Your Rating
        </label>
        <div className="flex items-center gap-3">
          <StarRating value={rating} onChange={setRating} size="lg" />
          {rating && (
            <button type="button" onClick={() => setRating(null)}
              className="text-xs text-forest/35 hover:text-warm-dark transition-colors">
              clear
            </button>
          )}
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-playfair font-semibold text-forest mb-1.5">
            Date Started
          </label>
          <input type="date" value={dateStarted} onChange={(e) => setDateStarted(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-parchment border border-sage/20 rounded-lg font-lora text-forest" />
        </div>
        <div>
          <label className="block text-xs font-playfair font-semibold text-forest mb-1.5">
            Date Finished
          </label>
          <input type="date" value={dateFinished} onChange={(e) => setDateFinished(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-parchment border border-sage/20 rounded-lg font-lora text-forest" />
        </div>
      </div>

      {/* Review */}
      <div>
        <label className="block text-sm font-playfair font-semibold text-forest mb-2">
          Your Review
        </label>
        <textarea
          value={reviewText} onChange={(e) => setReviewText(e.target.value)}
          rows={5} placeholder="Write your thoughts about this book…"
          className="w-full px-3 py-2.5 text-sm bg-parchment border border-sage/20 rounded-lg font-lora text-forest placeholder:text-forest/30 resize-y"
        />
      </div>

      {/* Recommend */}
      <div>
        <label className="block text-sm font-playfair font-semibold text-forest mb-2">
          Would You Recommend It?
        </label>
        <div className="flex gap-3">
          {([[true,"👍 Yes!"],[false,"👎 Not really"]] as [boolean,string][]).map(([val, label]) => (
            <button
              key={String(val)} type="button"
              onClick={() => setWouldRecommend(wouldRecommend === val ? null : val)}
              className={`text-sm px-4 py-2 rounded-full border font-lora transition-all ${
                wouldRecommend === val
                  ? val ? "bg-sage-dark text-cream border-sage-dark" : "bg-warm text-cream border-warm"
                  : "bg-cream text-forest/70 border-sage/25 hover:border-sage"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Genres */}
      <div>
        <label className="block text-sm font-playfair font-semibold text-forest mb-2">
          Genres
        </label>
        <div className="flex flex-wrap gap-2">
          {GENRE_OPTIONS.map((g) => (
            <button
              key={g} type="button" onClick={() => toggleGenre(g)}
              className={`text-xs px-3 py-1.5 rounded-full border font-lora transition-all ${
                genres.includes(g)
                  ? "bg-sage-pale text-sage-deep border-sage/40"
                  : "bg-cream text-forest/50 border-sage/15 hover:border-sage/40"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit" disabled={saving}
        className="w-full bg-sage text-cream font-lora font-medium py-3 rounded-xl hover:bg-sage-dark transition-colors disabled:opacity-50 shadow-sm"
      >
        {saving ? "Saving…" : "Save Review"}
      </button>
    </form>
  );
}
