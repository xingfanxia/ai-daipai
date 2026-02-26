import { z } from "zod/v4";

export const uploadSlotSchema = z.enum([
  "headshot",
  "halfbody",
  "fullbody",
  "scene",
  "inspiration",
]);

export const photoStyleSchema = z.enum([
  "natural",
  "influencer",
  "editorial",
  "xiaohongshu",
  "cinematic",
  "retro",
]);

export const generateRequestSchema = z.object({
  referenceImages: z.array(z.string()).min(1).max(5),
  sceneImages: z.array(z.string()).max(3).optional(),
  inspirationImages: z.array(z.string()).max(3).optional(),
  sceneType: z.enum(["preset", "custom"]),
  scenePresetId: z.string().optional(),
  sceneDescription: z.string().max(500).optional(),
  style: photoStyleSchema,
  outfit: z.string().max(200).nullable(),
  mood: z.string().max(200).nullable(),
  count: z.number().int().min(1).max(8),
});

export type GenerateRequest = z.infer<typeof generateRequestSchema>;
