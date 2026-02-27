import { z } from "zod/v4";

export const uploadSlotSchema = z.enum([
  "headshot",
  "headshot2",
  "headshot3",
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
  inspirationImage: z.string().optional(),
  sceneType: z.enum(["preset", "custom"]),
  scenePresetId: z.string().optional(),
  sceneDescription: z.string().max(500).optional(),
  style: photoStyleSchema,
  outfit: z.string().max(200).nullable(),
  mood: z.string().max(200).nullable(),
  count: z.number().int().min(1).max(8),
  model: z.enum(['pro', 'nb2']).default('nb2'),
  abTest: z.boolean().default(false),
  refSlots: z.array(z.string()).optional(),
});

export type GenerateRequest = z.infer<typeof generateRequestSchema>;
