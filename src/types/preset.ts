export type PhotoStyle =
  | "natural"
  | "influencer"
  | "editorial"
  | "xiaohongshu"
  | "cinematic"
  | "retro";

export type SceneCategory =
  | "outdoor-nature"
  | "urban"
  | "indoor"
  | "studio"
  | "travel";

export interface ScenePreset {
  id: string;
  label: string;
  labelZh: string;
  category: SceneCategory;
  promptDescription: string;
}

export interface StylePreset {
  id: PhotoStyle;
  label: string;
  labelZh: string;
  description: string;
  promptLines: string[];
}

export interface OutfitPreset {
  id: string;
  label: string;
  labelZh: string;
  promptDescription: string;
}

export interface MoodOption {
  id: string;
  emoji: string;
  label: string;
  labelZh: string;
  promptText: string;
}

export interface PoseOption {
  id: string;
  promptDescription: string;
}

export interface PresetPackage {
  id: string;
  label: string;
  labelZh: string;
  description: string;
  sceneId: string;
  styleId: PhotoStyle;
  outfitId: string;
  moodId: string;
}
