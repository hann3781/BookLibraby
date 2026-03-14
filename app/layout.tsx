import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Link from "next/link";

export const metadata: Metadata = {
  title: "My Book Library",
  description: "A personal book manager — track what you've read, loved, and want to read next.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-parchment text-forest font-lora">

        {/* ── Header ── */}
        <header className="border-b border-sage/20 bg-cream/90 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between">
            <Link href="/" className="group flex items-center gap-2.5">
              <span className="text-2xl" aria-hidden>🌿</span>
              <h1 className="font-script text-3xl text-sage-dark group-hover:text-sage transition-colors leading-none pt-1">
                My Library
              </h1>
            </Link>
            <nav className="flex items-center gap-5">
              <Link
                href="/"
                className="text-sm font-lora text-forest/60 hover:text-sage-dark transition-colors"
              >
                Bookshelf
              </Link>
              <Link
                href="/books/add"
                className="bg-sage text-cream text-sm font-lora font-medium px-4 py-2 rounded-full hover:bg-sage-dark transition-colors shadow-sm"
              >
                + Add Book
              </Link>
            </nav>
          </div>
        </header>

        {/* ── Main ── */}
        <main className="max-w-6xl mx-auto px-5 py-10">
          {children}
        </main>

        {/* ── Footer ── */}
        <footer className="border-t border-sage/15 mt-20 py-8 text-center">
          <p className="font-script text-2xl text-sage-dark/70 mb-1">
            &ldquo;A reader lives a thousand lives before he dies.&rdquo;
          </p>
          <p className="text-xs text-forest/40 font-lora">— George R.R. Martin</p>
        </footer>

        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#FAFDF8",
              color: "#243320",
              border: "1px solid rgba(122,158,126,0.25)",
              fontFamily: "var(--font-lora)",
              borderRadius: "12px",
            },
            success: { iconTheme: { primary: "#4A7050", secondary: "#FAFDF8" } },
            error:   { iconTheme: { primary: "#C4956A", secondary: "#FAFDF8" } },
          }}
        />
      </body>
    </html>
  );
}
