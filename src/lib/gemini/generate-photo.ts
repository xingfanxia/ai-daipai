import crypto from "node:crypto";

import { callGemini } from "@/lib/gemini/client";

interface RefImage {
  mimeType: string;
  data: string;
}

export async function generateSinglePhoto(opts: {
  apiKey: string;
  prompt: string;
  refImages: RefImage[];
  sceneImages?: RefImage[];
  index: number;
}): Promise<{ imageData: Buffer; id: string } | { error: string }> {
  const parts = [
    { text: opts.prompt },
    ...opts.refImages.map((img) => ({
      inlineData: { mimeType: img.mimeType, data: img.data },
    })),
    ...(opts.sceneImages ?? []).map((img) => ({
      inlineData: { mimeType: img.mimeType, data: img.data },
    })),
  ];

  try {
    const data = await callGemini(parts, opts.apiKey);
    const candidate = data.candidates?.[0];
    const imagePart = candidate?.content?.parts?.find((p) => p.inlineData);

    if (!imagePart?.inlineData) {
      const reason =
        candidate?.finishMessage || candidate?.finishReason || "unknown";
      return { error: `Photo ${opts.index + 1} was blocked (${reason}).` };
    }

    const imageData = Buffer.from(imagePart.inlineData.data, "base64");
    const id = crypto.randomBytes(8).toString("hex");
    return { imageData, id };
  } catch (err) {
    return {
      error: `Photo ${opts.index + 1}: ${err instanceof Error ? err.message : "failed"}`,
    };
  }
}
