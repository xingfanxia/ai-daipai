import { NextRequest } from "next/server";
import crypto from "node:crypto";
import { generateSinglePhoto } from "@/lib/gemini/generate-photo";
import { analyzeInspirationImage } from "@/lib/gemini/client";
import { buildPrompt } from "@/lib/gemini/prompt-builder";
import { selectPoses } from "@/lib/presets/poses";
import { getScenePreset } from "@/lib/presets/scenes";
import { getOutfitPreset } from "@/lib/presets/outfits";
import { getMoodOption } from "@/lib/presets/moods";
import { generateRequestSchema } from "@/lib/schemas";
import { fetchImageBuffer } from "@/lib/images/storage";

// 8 photos × ~60s each = ~8 min max
export const maxDuration = 600;

function sseEvent(event: string, data: unknown): string {
  return `data: ${JSON.stringify({ event, data })}\n\n`;
}

/**
 * Fetch an image from blob URL and convert to base64 for Gemini API.
 */
async function blobToBase64(blobUrl: string): Promise<{ mimeType: string; data: string }> {
  const buffer = await fetchImageBuffer(blobUrl);
  return { mimeType: "image/jpeg", data: buffer.toString("base64") };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = generateRequestSchema.parse(body);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    // Fetch reference images from blob storage (full resolution)
    const refImages = await Promise.all(
      parsed.referenceImages.map((url) => blobToBase64(url)),
    );

    // Fetch scene images from blob storage
    const sceneImages = await Promise.all(
      (parsed.sceneImages ?? []).map((url) => blobToBase64(url)),
    );

    // Two-step inspiration flow: analyze image → text description
    // Inspiration image is NOT passed to generation API
    let inspirationStyleDescription: string | undefined;
    if (parsed.inspirationImage) {
      const inspirationB64 = await blobToBase64(parsed.inspirationImage);
      inspirationStyleDescription = await analyzeInspirationImage(
        inspirationB64.data,
        apiKey,
      );
    }

    // Resolve scene description
    let sceneDescription = "";
    if (parsed.sceneType === "preset" && parsed.scenePresetId) {
      const preset = getScenePreset(parsed.scenePresetId);
      sceneDescription = preset?.promptDescription || parsed.scenePresetId;
    } else if (parsed.sceneDescription) {
      sceneDescription = parsed.sceneDescription;
    }

    // Resolve outfit and mood text
    const outfitText = parsed.outfit
      ? (getOutfitPreset(parsed.outfit)?.promptDescription || parsed.outfit)
      : null;
    const moodText = parsed.mood
      ? (getMoodOption(parsed.mood)?.promptText || parsed.mood)
      : null;

    const sessionId = crypto.randomBytes(8).toString("hex");
    const poses = selectPoses(parsed.count);

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        const send = (event: string, data: unknown) => {
          controller.enqueue(encoder.encode(sseEvent(event, data)));
        };

        const modelsToRun: Array<'pro' | 'nb2'> = parsed.abTest
          ? ['pro', 'nb2']
          : [parsed.model];
        const totalPhotos = parsed.count * modelsToRun.length;

        send("started", { sessionId, totalPhotos });

        // Fire all generation requests in parallel
        const promises: Array<Promise<{ index: number; model: string; result: Awaited<ReturnType<typeof generateSinglePhoto>> }>> = [];
        for (const modelChoice of modelsToRun) {
          for (let i = 0; i < poses.length; i++) {
            const pose = poses[i];
            const prompt = buildPrompt({
              sceneDescription,
              hasCustomSceneImages: sceneImages.length > 0,
              inspirationStyleDescription,
              pose,
              style: parsed.style,
              outfit: outfitText,
              mood: moodText,
              refCount: refImages.length,
              refSlots: parsed.refSlots,
            });

            promises.push(
              generateSinglePhoto({
                apiKey,
                prompt,
                refImages,
                sceneImages: sceneImages.length > 0 ? sceneImages : undefined,
                index: i,
                model: modelChoice,
              }).then((result) => ({ index: i, model: modelChoice, result })),
            );
          }
        }

        // Stream results as they complete
        let successful = 0;
        let failed = 0;
        const pending = promises.map((p) =>
          p.then((res) => {
            const { index: i, model: modelUsed, result } = res;
            if ("error" in result) {
              failed++;
              send("photo_failed", { index: i, error: result.error, model: modelUsed });
            } else {
              const b64 = result.imageData.toString("base64");
              const dataUrl = `data:image/png;base64,${b64}`;
              successful++;
              send("photo_completed", {
                index: i,
                imageId: result.id,
                previewUrl: dataUrl,
                model: modelUsed,
              });
            }
          }),
        );

        await Promise.allSettled(pending);

        send("completed", { successful, failed, total: parsed.count });
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("[generate] error:", err);
    return new Response(JSON.stringify({ error: "Generation failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
