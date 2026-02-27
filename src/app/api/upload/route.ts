import { NextRequest, NextResponse } from "next/server";
import { preprocessImage } from "@/lib/images/preprocessing";
import { saveImage, getImageUrl } from "@/lib/images/storage";

// Vercel serverless body size limit (App Router)
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const slot = formData.get("slot") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (
      !slot ||
      !["headshot", "halfbody", "fullbody", "scene", "inspiration"].includes(slot)
    ) {
      return NextResponse.json({ error: "Invalid slot" }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large (max 10MB)" },
        { status: 400 },
      );
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only images allowed" },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const processed = await preprocessImage(buffer);
    const id = await saveImage(processed.buffer, slot);

    // Return base64 directly (serverless instances don't share /tmp)
    const base64 = processed.buffer.toString("base64");
    const dataUrl = `data:${processed.mimeType};base64,${base64}`;

    return NextResponse.json({
      image: {
        id,
        slot,
        previewUrl: dataUrl,
        base64,
        width: processed.width,
        height: processed.height,
        sizeKB: processed.sizeKB,
      },
    });
  } catch (err) {
    console.error("[upload] error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
