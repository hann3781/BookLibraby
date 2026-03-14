import Image from "next/image";
import Link from "next/link";
import type { Book } from "@/types";
import { StatusBadge, getSpineColor } from "./StatusBadge";
import { StarRating } from "./StarRating";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const spineColor = getSpineColor(book.status);

  return (
    <Link href={`/books/${book.id}`} className="block group">
      <article className="book-card relative bg-cream rounded-book overflow-hidden paper-shadow border border-sage/10 h-full flex">
        {/* Status spine */}
        <div className={`w-2 shrink-0 ${spineColor} opacity-70`} />

        <div className="flex flex-col flex-1">
          {/* Cover */}
          <div className="relative w-full aspect-[2/3] bg-parchment-dark overflow-hidden">
            {book.cover_url ? (
              <Image
                src={book.cover_url}
                alt={`Cover of ${book.title}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-3 bg-gradient-to-br from-sage-pale to-parchment">
                <span className="text-3xl mb-1 opacity-25">📖</span>
                <p className="text-center text-xs font-playfair italic text-forest/40 leading-tight line-clamp-3">
                  {book.title}
                </p>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-3 flex flex-col gap-1.5 flex-1">
            <h2 className="font-playfair font-semibold text-sm leading-tight text-forest line-clamp-2 group-hover:text-sage-dark transition-colors">
              {book.title}
            </h2>
            {book.author && (
              <p className="text-xs text-forest/55 line-clamp-1 font-lora italic">
                {book.author}
              </p>
            )}
            <div className="flex items-center justify-between mt-auto pt-1 flex-wrap gap-1">
              <StatusBadge status={book.status} size="sm" />
              {book.rating && <StarRating value={book.rating} readonly size="sm" />}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
