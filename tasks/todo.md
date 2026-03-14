# Book Manager — Implementation Checklist

## Phase 1 — Project Setup
- [x] All project files created (package.json, tsconfig, tailwind, postcss)
- [x] Folder structure created per plan
- [x] .env.local.example created

## Phase 2 — Data Layer
- [x] `lib/supabase.ts` — full CRUD for books, genres, quotes
- [x] `lib/openLibrary.ts` — search + cover URL helper
- [x] `supabase/migration.sql` — complete schema with all 3 tables

## Phase 3 — API Routes
- [x] `app/api/search/route.ts` — Open Library proxy
- [x] `app/api/books/route.ts` — GET list, POST new
- [x] `app/api/books/[id]/route.ts` — GET, PATCH, DELETE
- [x] `app/api/books/[id]/quotes/route.ts` — GET, POST, DELETE

## Phase 4 — Components
- [x] `components/StatusBadge.tsx`
- [x] `components/StarRating.tsx`
- [x] `components/BookCard.tsx`
- [x] `components/BookShelf.tsx` — with filter bar
- [x] `components/QuoteCard.tsx`
- [x] `components/SearchBar.tsx` — debounced, dropdown
- [x] `components/ReviewForm.tsx` — full review + genres

## Phase 5 — Pages
- [x] `app/layout.tsx` — header, footer, toasts
- [x] `app/globals.css` — vintage styles, paper texture
- [x] `app/page.tsx` — bookshelf home
- [x] `app/books/add/page.tsx` — search + add flow
- [x] `app/books/[id]/page.tsx` — detail + review + quotes

## Phase 6 — Setup Required (User Actions)

### Install Node.js
1. Download from https://nodejs.org (LTS version)
2. Restart your terminal after installing

### Create Supabase Project
1. Go to https://supabase.com → New Project
2. Run `supabase/migration.sql` in the SQL Editor
3. Copy your Project URL + anon key

### Configure Environment
```
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials
```

### Run the App
```
npm install
npm run dev
# Open http://localhost:3000
```

### Deploy to Vercel
```
npm install -g vercel
vercel
# Follow prompts, add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY env vars
```

## Review
All code implemented. Pending user setup of Node.js + Supabase.
