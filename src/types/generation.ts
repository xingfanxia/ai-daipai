export type GenerationStatus = "idle" | "generating" | "completed" | "error";

export interface GenerationConfig {
  referenceImageIds: string[];
  sceneImageIds?: string[];
  sceneType: "preset" | "custom";
  scenePresetId?: string;
  sceneDescription?: string;
  style: string;
  outfit: string | null;
  mood: string | null;
  count: number;
}

export type GenerationResult =
  | { status: "success"; imageId: string; previewUrl: string; index: number }
  | { status: "failed"; error: string; index: number };

export type SSEEvent =
  | { event: "started"; data: { sessionId: string; totalPhotos: number } }
  | { event: "photo_started"; data: { index: number } }
  | {
      event: "photo_completed";
      data: { index: number; imageId: string; previewUrl: string };
    }
  | { event: "photo_failed"; data: { index: number; error: string } }
  | {
      event: "completed";
      data: { successful: number; failed: number; total: number };
    };
