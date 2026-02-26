import { NextRequest, NextResponse } from "next/server";
import { getImageBuffer } from "@/lib/images/storage";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const buffer = await getImageBuffer(id);
  if (!buffer) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  // Determine content type from the id prefix or default
  const contentType = id.startsWith("gen-") ? "image/png" : "image/jpeg";

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}
