import { NextRequest, NextResponse } from "next/server";
import { getBooks, createBook } from "@/lib/supabase";

export async function GET() {
  try {
    const books = await getBooks();
    return NextResponse.json(books);
  } catch (err) {
    console.error("GET /api/books error:", err);
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { genres, ...bookData } = body;

    if (!bookData.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const book = await createBook(bookData, genres ?? []);
    return NextResponse.json(book, { status: 201 });
  } catch (err) {
    console.error("POST /api/books error:", err);
    return NextResponse.json({ error: "Failed to create book" }, { status: 500 });
  }
}
