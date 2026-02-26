import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";

// Vercel serverless: only /tmp is writable
const STORAGE_DIR = path.join(os.tmpdir(), "ai-daipai-images");

export async function ensureStorageDir(): Promise<void> {
  await fs.mkdir(STORAGE_DIR, { recursive: true });
}

export async function saveImage(
  buffer: Buffer,
  prefix: string = "img",
): Promise<string> {
  await ensureStorageDir();
  const id = `${prefix}-${crypto.randomBytes(8).toString("hex")}`;
  const filePath = path.join(STORAGE_DIR, `${id}.jpg`);
  await fs.writeFile(filePath, buffer);
  return id;
}

export async function saveGeneratedImage(
  buffer: Buffer,
  id: string,
): Promise<string> {
  await ensureStorageDir();
  const filePath = path.join(STORAGE_DIR, `${id}.png`);
  await fs.writeFile(filePath, buffer);
  return id;
}

export async function getImageBuffer(id: string): Promise<Buffer | null> {
  for (const ext of [".jpg", ".png"]) {
    const filePath = path.join(STORAGE_DIR, `${id}${ext}`);
    try {
      return await fs.readFile(filePath);
    } catch {
      /* not found */
    }
  }
  return null;
}

export function getImageUrl(id: string): string {
  return `/api/images/${id}`;
}
