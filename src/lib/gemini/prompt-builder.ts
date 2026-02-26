import { getStylePreset } from "@/lib/presets/styles";

export interface PromptOptions {
  sceneDescription: string;
  hasCustomSceneImages: boolean;
  hasInspirationImages: boolean;
  pose: string;
  style: string;
  outfit: string | null;
  mood: string | null;
  refCount: number;
}

/**
 * Build the generation prompt.
 * Ported verbatim from openclaw extensions/photoshoot/index.ts buildPrompt().
 */
export function buildPrompt(opts: PromptOptions): string {
  // Face preservation preamble — exact wording from extension
  const face = [
    `These ${opts.refCount} reference photo(s) show the person — preserve their exact facial features,`,
    "eyes, nose, lips, face shape, skin tone, and hair.",
    "Skin quality should look well-maintained and clear from consistent skincare: natural texture is fine,",
    "but avoid obvious acne clusters, inflamed red breakouts, or prominent irritation patches on the face.",
    "",
    "BODY: match the person's body type, build, and proportions as visible in the reference photos.",
    "Do NOT idealize, exaggerate, or change their body shape. Keep it realistic to the reference.",
    "",
    "IDENTITY LOCK: this is always the same person from the reference photos.",
    "Do not drift identity, age, ethnicity, body type, or core proportions between generations.",
  ];

  // Inspiration reference (抄作业)
  const inspirationLines: string[] = [];
  if (opts.hasInspirationImages) {
    inspirationLines.push(
      "STYLE REFERENCE (灵感图/抄作业):",
      "The inspiration photo(s) show the TARGET LOOK you must recreate.",
      "Match these elements from the inspiration:",
      "- Composition & framing (camera angle, distance, crop style)",
      "- Lighting direction, quality, and mood",
      "- Color grading & filter style (warm/cool, contrast, saturation)",
      "- Pose style and body language (similar energy, not exact copy)",
      "- Overall atmosphere and aesthetic vibe",
      "- Clothing style (similar category/vibe unless outfit is specified separately)",
      "",
      "DO NOT copy the face/identity from the inspiration photo.",
      "The person must be from the reference photos ONLY.",
      "The inspiration photo is ONLY for style, composition, and mood reference.",
    );
  }

  // Style notes from preset (skip if inspiration images provide the style)
  const stylePreset = getStylePreset(opts.style);
  const styleLines = opts.hasInspirationImages ? [] : (stylePreset?.promptLines ?? []);

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

  // Outfit and mood — match extension format
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
    "Preserve the person's identity perfectly from the reference images.",
  ].join("\n");
}
