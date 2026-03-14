"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import type { SearchResult, BookStatus } from "@/types";
import { SearchBar } from "@/components/SearchBar";

export default function AddBookPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<SearchResult | null>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [status, setStatus] = useState<BookStatus>("want_to_read");
  const [saving, setSaving] = useState(false);

  function handleSelect(result: SearchResult) {
    setSelected(result);
    setTitle(result.title);
    setAuthor(result.author);
    setIsbn(result.isbn ?? "");
    setCoverUrl(result.cover_url ?? "");
  }

  function handleClear() {
    setSelected(null);
    setTitle(""); setAuthor(""); setIsbn(""); setCoverUrl("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          author: author.trim() || null,
          isbn: isbn.trim() || null,
          cover_url: coverUrl.trim() || null,
          status,
        }),
      });
      if (!res.ok) throw new Error();
      const book = await res.json();
      toast.success(`"${book.title}" added to your shelf!`);
      router.push(`/books/${book.id}`);
    } catch {
      toast.error("Could not save the book. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-script text-6xl text-sage-dark leading-tight mb-1">Add a Book</h1>
        <p className="font-lora italic text-forest/45 text-sm">
          Search for a book or enter details manually
        </p>
        <div className="sage-divider mt-4" />
      </div>

      {/* Search */}
      <section className="mb-8">
        <h2 className="font-playfair font-semibold text-forest mb-3 text-lg">
          Search Open Library
        </h2>
        <SearchBar onSelect={handleSelect} />
      </section>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-cream border border-sage/15 rounded-card p-6 paper-shadow space-y-5">
        <h2 className="font-script text-3xl text-sage-dark border-b border-sage/15 pb-3">
          Book Details
        </h2>

        {/* Cover preview */}
        {(coverUrl || selected) && (
          <div className="flex items-start gap-4 p-4 bg-sage-pale rounded-xl border border-sage/15">
            <div className="relative w-16 h-24 shrink-0 bg-parchment-dark rounded-lg overflow-hidden">
              {coverUrl ? (
                <Image src={coverUrl} alt="Book cover" fill className="object-cover" unoptimized />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center text-2xl opacity-20">📖</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-playfair font-semibold text-sm text-forest truncate">{title}</p>
              {author && <p className="font-lora italic text-xs text-forest/55">{author}</p>}
              {selected?.first_publish_year && (
                <p className="text-xs text-forest/35 mt-1">{selected.first_publish_year}</p>
              )}
            </div>
            <button type="button" onClick={handleClear}
              className="text-xs text-forest/35 hover:text-warm-dark shrink-0">
              ✕ Clear
            </button>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-xs font-playfair font-semibold text-forest mb-1.5">
            Title <span className="text-warm">*</span>
          </label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            required placeholder="Book title"
            className="w-full px-3 py-2.5 text-sm bg-parchment border border-sage/20 rounded-lg font-lora text-forest placeholder:text-forest/30"
          />
        </div>

        {/* Author */}
        <div>
          <label className="block text-xs font-playfair font-semibold text-forest mb-1.5">Author</label>
          <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)}
            placeholder="Author name"
            className="w-full px-3 py-2.5 text-sm bg-parchment border border-sage/20 rounded-lg font-lora text-forest placeholder:text-forest/30"
          />
        </div>

        {/* ISBN */}
        <div>
          <label className="block text-xs font-playfair font-semibold text-forest mb-1.5">ISBN</label>
          <input type="text" value={isbn} onChange={(e) => setIsbn(e.target.value)}
            placeholder="e.g. 9780747532699"
            className="w-full px-3 py-2.5 text-sm bg-parchment border border-sage/20 rounded-lg font-lora text-forest placeholder:text-forest/30"
          />
        </div>

        {/* Cover URL */}
        <div>
          <label className="block text-xs font-playfair font-semibold text-forest mb-1.5">
            Cover Image URL{" "}
            <span className="font-lora font-normal text-forest/35 italic">(auto-filled from search)</span>
          </label>
          <input type="url" value={coverUrl} onChange={(e) => setCoverUrl(e.target.value)}
            placeholder="https://…"
            className="w-full px-3 py-2.5 text-sm bg-parchment border border-sage/20 rounded-lg font-lora text-forest placeholder:text-forest/30"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-playfair font-semibold text-forest mb-2">
            Reading Status
          </label>
          <div className="flex flex-wrap gap-2">
            {(
              [["want_to_read","Want to Read"],["reading","Currently Reading"],["read","Read"]] as [BookStatus,string][]
            ).map(([val, label]) => (
              <button key={val} type="button" onClick={() => setStatus(val)}
                className={`text-sm px-4 py-2 rounded-full border font-lora transition-all ${
                  status === val
                    ? "bg-sage text-cream border-sage"
                    : "bg-parchment text-forest/65 border-sage/20 hover:border-sage"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => router.back()}
            className="flex-1 py-3 rounded-xl border border-sage/20 text-sm font-lora text-forest/65 hover:border-sage transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={saving || !title.trim()}
            className="flex-1 py-3 rounded-xl bg-sage text-cream text-sm font-lora font-medium hover:bg-sage-dark transition-colors disabled:opacity-50 shadow-sm">
            {saving ? "Adding…" : "Add to Shelf"}
          </button>
        </div>
      </form>
    </div>
  );
}
