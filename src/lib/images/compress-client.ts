/**
 * Client-side image compression using canvas.
 * Resizes to max 1600px and compresses to JPEG to stay under Vercel's 4.5MB body limit.
 */

const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.85;
const TARGET_SIZE_BYTES = 3.5 * 1024 * 1024; // 3.5MB target (leaves room for form overhead)

export async function compressImage(file: File): Promise<File> {
  // Skip if already small enough
  if (file.size <= TARGET_SIZE_BYTES) {
    return file;
  }

  const bitmap = await createImageBitmap(file);
  const { width, height } = bitmap;

  // Calculate new dimensions
  let newWidth = width;
  let newHeight = height;
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
    newWidth = Math.round(width * ratio);
    newHeight = Math.round(height * ratio);
  }

  const canvas = new OffscreenCanvas(newWidth, newHeight);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  ctx.drawImage(bitmap, 0, 0, newWidth, newHeight);
  bitmap.close();

  // Try progressively lower quality until under target
  let quality = JPEG_QUALITY;
  let blob: Blob;

  do {
    blob = await canvas.convertToBlob({ type: "image/jpeg", quality });
    if (blob.size <= TARGET_SIZE_BYTES || quality <= 0.4) break;
    quality -= 0.1;
  } while (blob.size > TARGET_SIZE_BYTES);

  return new File([blob], file.name.replace(/\.\w+$/, ".jpg"), {
    type: "image/jpeg",
  });
}
