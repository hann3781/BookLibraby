-- Run this SQL in your Supabase SQL Editor to set up the database.
-- Dashboard → SQL Editor → New Query → paste this → Run

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ── Books table ──────────────────────────────────────────────────────────────
create table if not exists books (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  author text,
  isbn text,
  cover_url text,
  status text not null default 'want_to_read'
    check (status in ('want_to_read', 'reading', 'read')),
  rating integer check (rating >= 1 and rating <= 5),
  date_started date,
  date_finished date,
  review_text text,
  would_recommend boolean,
  created_at timestamptz not null default now()
);

-- ── Book genres (many-to-many via join table) ────────────────────────────────
create table if not exists book_genres (
  book_id uuid not null references books(id) on delete cascade,
  genre text not null,
  primary key (book_id, genre)
);

-- ── Favorite quotes ──────────────────────────────────────────────────────────
create table if not exists favorite_quotes (
  id uuid primary key default gen_random_uuid(),
  book_id uuid not null references books(id) on delete cascade,
  quote text not null,
  page integer
);

-- ── Row Level Security (optional — enable for multi-user; disable for single user) ──
-- For a personal app you can leave RLS disabled (default).
-- If you want to lock it down, uncomment the lines below and add auth policies.

-- alter table books enable row level security;
-- alter table book_genres enable row level security;
-- alter table favorite_quotes enable row level security;
