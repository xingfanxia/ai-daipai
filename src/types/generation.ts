export type GenerationStatus = "idle" | "generating" | "completed" | "error";

export interface GenerationConfig {
  /** Blob URLs for reference photos (fetched server-side) */
  referenceImages: string[];
  /** Blob URLs for custom scene photos */
  sceneImages?: string[];
  /** Blob URL for ONE inspiration/style reference photo (抄作业) */
  inspirationImage?: string;
  sceneType: "preset" | "custom";
  scenePresetId?: string;
  sceneDescription?: string;
  style: string;
  outfit: string | null;
  mood: string | null;
  count: number;
  /** Ordered list of slot names matching the reference images */
  refSlots?: string[];
  /** Which generation model to use */
  model?: 'pro' | 'nb2';
  /** When true, each photo is generated with BOTH models for A/B comparison */
  abTest?: boolean;
}

export type GenerationResult =
  | { status: "success"; imageId: string; previewUrl: string; index: number }
  | { status: "failed"; error: string; index: number };

export type SSEEvent =
  | { event: "started"; data: { sessionId: string; totalPhotos: number } }
  | { event: "photo_started"; data: { index: number } }
  | {
      event: "photo_completed";
      data: { index: number; imageId: string; previewUrl: string; model?: string };
    }
  | { event: "photo_failed"; data: { index: number; error: string } }
  | {
      event: "completed";
      data: { successful: number; failed: number; total: number };
    };
