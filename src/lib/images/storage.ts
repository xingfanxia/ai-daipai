import crypto from "node:crypto";
import { put, del } from "@vercel/blob";

/**
 * Save an image to Vercel Blob Storage.
 * Returns the blob URL (publicly accessible via Vercel CDN).
 */
export async function saveImage(
  buffer: Buffer,
  prefix: string = "img",
): Promise<{ id: string; blobUrl: string }> {
  const id = `${prefix}-${crypto.randomBytes(8).toString("hex")}`;
  const pathname = `uploads/${id}.jpg`;

  const blob = await put(pathname, buffer, {
    access: "public",
    contentType: "image/jpeg",
    addRandomSuffix: false,
  });

  return { id, blobUrl: blob.url };
}

/**
 * Save a generated image to Vercel Blob Storage.
 */
export async function saveGeneratedImage(
  buffer: Buffer,
  id: string,
): Promise<string> {
  const pathname = `generated/${id}.png`;

  const blob = await put(pathname, buffer, {
    access: "public",
    contentType: "image/png",
    addRandomSuffix: false,
  });

  return blob.url;
}

/**
 * Fetch image buffer from a blob URL.
 */
export async function fetchImageBuffer(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image from blob: ${response.status}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Delete an image from Vercel Blob Storage.
 */
export async function deleteImage(blobUrl: string): Promise<void> {
  await del(blobUrl);
}
