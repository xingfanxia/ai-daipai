import { NextRequest } from "next/server";
import crypto from "node:crypto";
import { generateSinglePhoto } from "@/lib/gemini/generate-photo";
import { buildPrompt } from "@/lib/gemini/prompt-builder";
import { selectPoses } from "@/lib/presets/poses";
import { getScenePreset } from "@/lib/presets/scenes";
import { getOutfitPreset } from "@/lib/presets/outfits";
import { getMoodOption } from "@/lib/presets/moods";
import { generateRequestSchema } from "@/lib/schemas";

// 8 photos × ~60s each = ~8 min max
export const maxDuration = 600;

function sseEvent(event: string, data: unknown): string {
  return `data: ${JSON.stringify({ event, data })}\n\n`;
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

    // Reference images arrive as base64 strings from the client
    const refImages = parsed.referenceImages.map((b64) => ({
      mimeType: "image/jpeg",
      data: b64,
    }));

    // Scene images for custom scenes
    const sceneImages = (parsed.sceneImages ?? []).map((b64) => ({
      mimeType: "image/jpeg",
      data: b64,
    }));

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

        send("started", { sessionId, totalPhotos: parsed.count });

        // Fire all generation requests in parallel
        const promises = poses.map((pose, i) => {
          const prompt = buildPrompt({
            sceneDescription,
            hasCustomSceneImages: sceneImages.length > 0,
            pose,
            style: parsed.style,
            outfit: outfitText,
            mood: moodText,
            refCount: refImages.length,
          });

          return generateSinglePhoto({
            apiKey,
            prompt,
            refImages,
            sceneImages: sceneImages.length > 0 ? sceneImages : undefined,
            index: i,
          }).then((result) => ({ index: i, result }));
        });

        // Stream results as they complete
        let successful = 0;
        let failed = 0;
        const pending = promises.map((p) =>
          p.then((res) => {
            const { index: i, result } = res;
            if ("error" in result) {
              failed++;
              send("photo_failed", { index: i, error: result.error });
            } else {
              const b64 = result.imageData.toString("base64");
              const dataUrl = `data:image/png;base64,${b64}`;
              successful++;
              send("photo_completed", {
                index: i,
                imageId: result.id,
                previewUrl: dataUrl,
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
