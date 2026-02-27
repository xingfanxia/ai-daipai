import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // This route is kept for backwards compatibility but images are now served
  // directly from Vercel Blob URLs. If an ID-based request comes in, return 404.
  return NextResponse.json({ error: "Use blob URLs directly" }, { status: 404 });
}
