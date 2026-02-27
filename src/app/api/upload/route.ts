import { NextRequest, NextResponse } from "next/server";
import { preprocessImage, generateThumbnail } from "@/lib/images/preprocessing";
import { saveImage } from "@/lib/images/storage";

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
      !["headshot", "headshot2", "headshot3", "halfbody", "fullbody", "scene", "inspiration"].includes(slot)
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

    // Preprocess: EXIF rotate + JPEG convert (preserves resolution)
    const processed = await preprocessImage(buffer);

    // Save full-res image to Vercel Blob
    const { id, blobUrl } = await saveImage(processed.buffer, slot);

    // Generate small thumbnail for instant UI preview
    const previewUrl = await generateThumbnail(buffer);

    return NextResponse.json({
      image: {
        id,
        slot,
        blobUrl,
        previewUrl,
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
