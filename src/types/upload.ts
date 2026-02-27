export type UploadSlot = "headshot" | "headshot2" | "headshot3" | "halfbody" | "fullbody" | "scene" | "inspiration";

export interface UploadedImage {
  id: string;
  slot: UploadSlot;
  previewUrl: string;
  /** base64-encoded image data (JPEG) for sending to generation API */
  base64: string;
  width: number;
  height: number;
  sizeKB: number;
}

export type SceneSelection =
  | { type: "preset"; presetId: string }
  | { type: "custom"; images: UploadedImage[]; description?: string };
