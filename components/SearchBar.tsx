"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import type { SearchResult } from "@/types";

interface SearchBarProps {
  onSelect: (result: SearchResult) => void;
}

function useDebounce<T extends (...args: Parameters<T>) => void>(fn: T, delay: number): T {
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = setTimeout(() => fn(...args), delay);
    }) as T,
    [fn, delay]
  );
}

export function SearchBar({ onSelect }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); setOpen(false); return; }
    setLoading(true); setError(null);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error();
      const data: SearchResult[] = await res.json();
      setResults(data); setOpen(true);
    } catch {
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedSearch = useDebounce(doSearch, 400);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setQuery(val);
    debouncedSearch(val);
  }

  function handleSelect(result: SearchResult) {
    onSelect(result);
    setQuery(""); setResults([]); setOpen(false);
  }

  return (
    <div className="relative">
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sage/60 text-sm">🔍</span>
        <input
          type="text" value={query} onChange={handleChange}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search by title or author…"
          className="w-full pl-10 pr-4 py-3 bg-cream border border-sage/25 rounded-xl font-lora text-sm text-forest placeholder:text-forest/35"
        />
        {loading && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-forest/35 animate-pulse">
            Searching…
          </span>
        )}
      </div>

      {error && <p className="mt-1 text-xs text-warm-dark font-lora">{error}</p>}

      {/* Dropdown */}
      {open && results.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-cream border border-sage/20 rounded-xl shadow-cozy max-h-96 overflow-y-auto">
          {results.map((r) => (
            <li key={r.key}>
              <button
                type="button" onClick={() => handleSelect(r)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-sage-pale transition-colors text-left border-b border-sage/10 last:border-0"
              >
                <div className="shrink-0 w-10 h-14 bg-parchment-dark rounded-lg overflow-hidden relative">
                  {r.cover_url ? (
                    <Image src={r.cover_url} alt={r.title} fill sizes="40px" className="object-cover" unoptimized />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-xl opacity-20">📖</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-playfair font-semibold text-sm text-forest truncate">{r.title}</p>
                  <p className="text-xs text-forest/55 font-lora italic truncate">
                    {r.author}{r.first_publish_year && ` · ${r.first_publish_year}`}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {open && !loading && results.length === 0 && query.trim() && (
        <div className="absolute z-50 w-full mt-1 bg-cream border border-sage/20 rounded-xl shadow-card p-4 text-center">
          <p className="text-sm text-forest/40 font-lora italic">
            No results found for &ldquo;{query}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}
