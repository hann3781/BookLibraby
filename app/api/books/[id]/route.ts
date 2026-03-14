import { NextRequest, NextResponse } from "next/server";
import { getBook, updateBook, deleteBook } from "@/lib/supabase";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const book = await getBook(id);
    if (!book) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(book);
  } catch (err) {
    console.error("GET /api/books/[id] error:", err);
    return NextResponse.json({ error: "Failed to fetch book" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const { genres, ...updates } = body;
    const book = await updateBook(id, updates, genres);
    return NextResponse.json(book);
  } catch (err) {
    console.error("PATCH /api/books/[id] error:", err);
    return NextResponse.json({ error: "Failed to update book" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await deleteBook(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/books/[id] error:", err);
    return NextResponse.json({ error: "Failed to delete book" }, { status: 500 });
  }
}
