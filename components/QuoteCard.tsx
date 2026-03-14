"use client";

import type { FavoriteQuote } from "@/types";

interface QuoteCardProps {
  quote: FavoriteQuote;
  onDelete?: (id: string) => void;
}

export function QuoteCard({ quote, onDelete }: QuoteCardProps) {
  return (
    <div className="relative bg-cream border border-sage/20 rounded-card p-5 paper-shadow group">
      {/* Decorative quotation mark */}
      <span className="font-script text-5xl text-sage/25 leading-none absolute top-2 left-3 select-none">
        &ldquo;
      </span>
      <blockquote className="font-lora italic text-forest/75 text-sm leading-relaxed pt-4 pl-2">
        {quote.quote}
      </blockquote>
      {quote.page && (
        <p className="mt-2 text-xs text-forest/35 font-lora pl-2">p. {quote.page}</p>
      )}
      {onDelete && (
        <button
          onClick={() => onDelete(quote.id)}
          className="absolute top-3 right-3 text-forest/20 hover:text-warm-dark transition-colors opacity-0 group-hover:opacity-100 text-sm"
          aria-label="Delete quote"
          type="button"
        >
          ✕
        </button>
      )}
    </div>
  );
}
