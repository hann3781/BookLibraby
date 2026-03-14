import { NextRequest, NextResponse } from "next/server";
import { getQuotes, addQuote, deleteQuote } from "@/lib/supabase";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const quotes = await getQuotes(id);
    return NextResponse.json(quotes);
  } catch (err) {
    console.error("GET /api/books/[id]/quotes error:", err);
    return NextResponse.json({ error: "Failed to fetch quotes" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();

    if (!body.quote?.trim()) {
      return NextResponse.json({ error: "Quote text is required" }, { status: 400 });
    }

    const quote = await addQuote({
      book_id: id,
      quote: body.quote.trim(),
      page: body.page ? Number(body.page) : null,
    });

    return NextResponse.json(quote, { status: 201 });
  } catch (err) {
    console.error("POST /api/books/[id]/quotes error:", err);
    return NextResponse.json({ error: "Failed to add quote" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id: quoteId } = await req.json();
    await deleteQuote(quoteId);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/books/[id]/quotes error:", err);
    return NextResponse.json({ error: "Failed to delete quote" }, { status: 500 });
  }
}
