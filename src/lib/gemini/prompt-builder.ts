import { getStylePreset } from "@/lib/presets/styles";

export interface PromptOptions {
  sceneDescription: string;
  hasCustomSceneImages: boolean;
  inspirationStyleDescription?: string;
  pose: string;
  style: string;
  outfit: string | null;
  mood: string | null;
  refCount: number;
}

/**
 * Build the generation prompt.
 * Inspiration images are pre-analyzed into text descriptions (two-step flow)
 * to prevent face bleed and watermark copying.
 */
export function buildPrompt(opts: PromptOptions): string {
  const face = [
    `IMAGE ORDER: The first ${opts.refCount} image(s) after this text are PERSON REFERENCE photos.`,
    "",
    `These ${opts.refCount} person reference photo(s) show the ONLY person to generate — preserve their exact facial features,`,
    "eyes, nose, lips, face shape, skin tone, and hair.",
    "Skin quality should look well-maintained and clear from consistent skincare: natural texture is fine,",
    "but avoid obvious acne clusters, inflamed red breakouts, or prominent irritation patches on the face.",
    "",
    "BODY: match the person's body type, build, and proportions as visible in the reference photos.",
    "Do NOT idealize, exaggerate, or change their body shape. Keep it realistic to the reference.",
  ];

  // Inspiration style description (抄作业 — analyzed as text, image NOT passed)
  const inspirationLines: string[] = [];
  if (opts.inspirationStyleDescription) {
    inspirationLines.push(
      "STYLE RECREATION (analyzed from inspiration reference):",
      opts.inspirationStyleDescription,
    );
  }

  // Style notes from preset (skip if inspiration description provides the style)
  const stylePreset = getStylePreset(opts.style);
  const styleLines = opts.inspirationStyleDescription
    ? []
    : (stylePreset?.promptLines ?? []);

  // Scene section
  const sceneLines: string[] = [];
  if (opts.hasCustomSceneImages) {
    sceneLines.push(
      "Scene: Use the uploaded scene reference photo(s) as the exact background and environment.",
      "Place this person naturally in that scene.",
      "Match the lighting, color temperature, and atmosphere of the scene photo.",
    );
    if (opts.sceneDescription) {
      sceneLines.push(`Additional scene context: ${opts.sceneDescription}`);
    }
  } else {
    sceneLines.push(`Location/scene: ${opts.sceneDescription}`);
  }

  // Outfit and mood
  const outfitLine = opts.outfit
    ? `Outfit: ${opts.outfit}`
    : "Outfit: stylish, flattering, appropriate for the location and style.";

  const moodLine = opts.mood
    ? `Mood/vibe: ${opts.mood}`
    : "Mood/vibe: confident, natural, photogenic.";

  return [
    ...face,
    "",
    ...(inspirationLines.length > 0 ? [...inspirationLines, ""] : []),
    ...(styleLines.length > 0 ? [...styleLines, ""] : []),
    ...sceneLines,
    `Pose: ${opts.pose}`,
    outfitLine,
    moodLine,
    "",
    "IMPORTANT: Generate ONE photorealistic image of this person in this exact scene.",
    "The photo should look like a real photograph, not AI art.",
    "Do NOT include any watermarks, logos, text overlays, or social media handles in the generated image.",
    "",
    "IDENTITY LOCK (HIGHEST PRIORITY):",
    `The generated face MUST match the first ${opts.refCount} reference photo(s) EXACTLY.`,
    "Same eyes, same nose, same lips, same face shape, same skin tone.",
    "Do NOT blend, average, or mix facial features from ANY other source.",
    "If there is ANY conflict between style and identity, ALWAYS prioritize identity.",
  ].join("\n");
}
