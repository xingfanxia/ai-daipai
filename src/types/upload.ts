export type UploadSlot = "headshot" | "headshot2" | "headshot3" | "halfbody" | "fullbody" | "scene" | "inspiration";

export interface UploadedImage {
  id: string;
  slot: UploadSlot;
  /** Blob storage URL for the full-resolution image */
  blobUrl: string;
  /** Small preview URL for UI thumbnails */
  previewUrl: string;
  width: number;
  height: number;
  sizeKB: number;
}

export type SceneSelection =
  | { type: "preset"; presetId: string }
  | { type: "custom"; images: UploadedImage[]; description?: string };
