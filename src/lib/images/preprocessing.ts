import sharp from "sharp";

export interface ProcessedImage {
  buffer: Buffer;
  mimeType: string;
  width: number;
  height: number;
  sizeKB: number;
}

export async function preprocessImage(input: Buffer): Promise<ProcessedImage> {
  const image = sharp(input).rotate(); // auto-rotate from EXIF
  const resized = image.resize(1024, 1024, {
    fit: "inside",
    withoutEnlargement: true,
  });
  const output = await resized
    .jpeg({ quality: 85 })
    .toBuffer({ resolveWithObject: true });

  return {
    buffer: output.data,
    mimeType: "image/jpeg",
    width: output.info.width,
    height: output.info.height,
    sizeKB: Math.round(output.data.length / 1024),
  };
}

export function imageToBase64(buffer: Buffer): {
  mimeType: string;
  data: string;
} {
  return { mimeType: "image/jpeg", data: buffer.toString("base64") };
}
