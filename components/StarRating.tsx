"use client";

import { useState } from "react";

interface StarRatingProps {
  value: number | null;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

const SIZE_CLASSES = { sm: "text-base", md: "text-2xl", lg: "text-3xl" };

export function StarRating({ value, onChange, readonly = false, size = "md" }: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const active = hovered ?? value ?? 0;

  return (
    <div
      className={`flex gap-0.5 ${readonly ? "" : "cursor-pointer"}`}
      role={readonly ? "img" : "radiogroup"}
      aria-label={`Rating: ${value ?? 0} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          className={`${SIZE_CLASSES[size]} transition-all duration-100 ${
            readonly ? "cursor-default" : "hover:scale-110"
          } ${star <= active ? "text-gold drop-shadow-sm" : "text-forest/15"}`}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(null)}
          onClick={() => !readonly && onChange?.(star)}
          aria-label={`${star} star${star !== 1 ? "s" : ""}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
