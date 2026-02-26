import { getStylePreset } from "@/lib/presets/styles";

export interface PromptOptions {
  sceneDescription: string;
  hasCustomSceneImages: boolean;
  pose: string;
  style: string;
  outfit: string | null;
  mood: string | null;
  refCount: number;
}

export function buildPrompt(opts: PromptOptions): string {
  const lines: string[] = [];

  // Face preservation preamble
  lines.push(
    `I'm providing ${opts.refCount} reference photo(s) of a person.`,
    "Study these reference photos carefully and preserve their EXACT facial features:",
    "- Eyes (shape, size, spacing, double/single eyelid)",
    "- Nose (bridge height, tip shape, nostril width)",
    "- Lips (thickness, shape, cupid's bow)",
    "- Face shape (jawline, cheekbones, chin)",
    "- Skin tone and skin quality",
    "- Hair (color, texture, length, style)",
    "",
  );

  // Body consistency
  lines.push(
    "Body consistency:",
    "- Match the body type, build, and proportions visible in the reference photos",
    "- Maintain consistent body shape throughout",
    "",
  );

  // Identity lock
  lines.push(
    "IDENTITY LOCK: This must be the SAME person as in the reference photos.",
    "No identity drift — facial features must match exactly.",
    "",
  );

  // Style notes
  const stylePreset = getStylePreset(opts.style);
  if (stylePreset) {
    lines.push(...stylePreset.promptLines, "");
  }

  // Scene section
  if (opts.hasCustomSceneImages) {
    lines.push(
      "Scene: Use the uploaded scene reference photo(s) as the exact background and environment.",
      "Place this person naturally in that scene.",
      "Match the lighting, color temperature, and atmosphere of the scene photo.",
    );
    if (opts.sceneDescription) {
      lines.push(`Additional scene context: ${opts.sceneDescription}`);
    }
  } else {
    lines.push(`Location/scene: ${opts.sceneDescription}`);
  }
  lines.push("");

  // Pose
  lines.push(`Pose: ${opts.pose}`);

  // Outfit
  if (opts.outfit) {
    lines.push(`Outfit: ${opts.outfit}`);
  }

  // Mood
  if (opts.mood) {
    lines.push(`Mood/expression: ${opts.mood}`);
  }

  lines.push("");

  // Realism footer
  lines.push(
    "IMPORTANT: Generate ONE photorealistic image of this person in the described scene.",
    "This must look like a real photograph, not AI-generated art.",
    "Preserve the person's identity perfectly — they must be recognizable as the same individual from the reference photos.",
  );

  return lines.join("\n");
}
