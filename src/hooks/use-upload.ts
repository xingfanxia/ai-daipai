"use client";
import { useState, useCallback } from "react";
import type { UploadSlot, UploadedImage } from "@/types/upload";
import { useCreationStore } from "@/stores/creation-store";

export function useUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addReferenceImage = useCreationStore((s) => s.addReferenceImage);

  const uploadFile = useCallback(async (file: File, slot: UploadSlot): Promise<UploadedImage | null> => {
    setIsUploading(true);
    setError(null);

    try {
      // Validate client-side
      if (file.size > 10 * 1024 * 1024) {
        throw new Error("File too large (max 10MB)");
      }
      if (!file.type.startsWith("image/")) {
        throw new Error("Only image files are allowed");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("slot", slot);

      const response = await fetch("/api/upload", { method: "POST", body: formData });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Upload failed");
      }

      const data = await response.json();
      const image = data.image as UploadedImage;

      if (slot !== "scene") {
        addReferenceImage(slot, image);
      }

      return image;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setError(msg);
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [addReferenceImage]);

  return { uploadFile, isUploading, error, clearError: () => setError(null) };
}
