export type BookStatus = "want_to_read" | "reading" | "read";

export interface Book {
  id: string;
  title: string;
  author: string | null;
  isbn: string | null;
  cover_url: string | null;
  status: BookStatus;
  rating: number | null;
  date_started: string | null;
  date_finished: string | null;
  review_text: string | null;
  would_recommend: boolean | null;
  created_at: string;
  genres?: string[];
}

export interface BookGenre {
  book_id: string;
  genre: string;
}

export interface FavoriteQuote {
  id: string;
  book_id: string;
  quote: string;
  page: number | null;
}

export interface OpenLibraryResult {
  key: string;
  title: string;
  author_name?: string[];
  isbn?: string[];
  cover_i?: number;
  cover_edition_key?: string;
  first_publish_year?: number;
}

export interface SearchResult {
  key: string;
  title: string;
  author: string;
  isbn: string | null;
  cover_url: string | null;
  first_publish_year: number | null;
}
