export type UploadSlot = "headshot" | "halfbody" | "fullbody" | "scene";

export interface UploadedImage {
  id: string;
  slot: UploadSlot;
  previewUrl: string;
  storedPath: string;
  width: number;
  height: number;
  sizeKB: number;
}

export type SceneSelection =
  | { type: "preset"; presetId: string }
  | { type: "custom"; images: UploadedImage[]; description?: string };
