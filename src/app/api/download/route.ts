import { NextRequest } from "next/server";
import archiver from "archiver";
import { Readable } from "node:stream";
import { fetchImageBuffer } from "@/lib/images/storage";

export async function GET(request: NextRequest) {
  const ids = request.nextUrl.searchParams.get("ids");
  if (!ids) {
    return new Response(JSON.stringify({ error: "No image IDs provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // IDs are now blob URLs
  const blobUrls = ids.split(",").filter(Boolean);
  if (blobUrls.length === 0) {
    return new Response(JSON.stringify({ error: "No valid image URLs" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Create archive
  const archive = archiver("zip", { zlib: { level: 5 } });

  // Add images to archive
  let added = 0;
  for (const url of blobUrls) {
    try {
      const buffer = await fetchImageBuffer(url);
      const ext = url.includes(".png") ? "png" : "jpg";
      archive.append(buffer, { name: `photo-${added + 1}.${ext}` });
      added++;
    } catch { /* skip failed fetches */ }
  }

  if (added === 0) {
    return new Response(JSON.stringify({ error: "No images found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  archive.finalize();

  // Convert Node stream to Web ReadableStream
  const nodeStream = Readable.from(archive);
  const webStream = new ReadableStream({
    start(controller) {
      nodeStream.on("data", (chunk: Buffer) => controller.enqueue(chunk));
      nodeStream.on("end", () => controller.close());
      nodeStream.on("error", (err) => controller.error(err));
    },
  });

  return new Response(webStream, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="ai-daipai-photos.zip"`,
      "Cache-Control": "no-cache",
    },
  });
}
