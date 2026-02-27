import sharp from "sharp";

export interface ProcessedImage {
  buffer: Buffer;
  mimeType: string;
  width: number;
  height: number;
  sizeKB: number;
}

/**
 * Preprocess an uploaded image: EXIF auto-rotate, convert to JPEG.
 * Preserves original resolution — only downsizes if truly huge (>4096px).
 * Quality kept high (95) since images go directly to Gemini for face matching.
 */
export async function preprocessImage(input: Buffer): Promise<ProcessedImage> {
  const image = sharp(input).rotate(); // auto-rotate from EXIF
  const resized = image.resize(4096, 4096, {
    fit: "inside",
    withoutEnlargement: true,
  });
  const output = await resized
    .jpeg({ quality: 95 })
    .toBuffer({ resolveWithObject: true });

  return {
    buffer: output.data,
    mimeType: "image/jpeg",
    width: output.info.width,
    height: output.info.height,
    sizeKB: Math.round(output.data.length / 1024),
  };
}

/**
 * Generate a small thumbnail for UI preview.
 */
export async function generateThumbnail(input: Buffer): Promise<string> {
  const thumb = await sharp(input)
    .rotate()
    .resize(400, 400, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 75 })
    .toBuffer();
  return `data:image/jpeg;base64,${thumb.toString("base64")}`;
}
