"use client";

import { useCreationStore } from "@/stores/creation-store";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

/**
 * Convert a data URL to a Blob URL for reliable downloads.
 * Browsers often block programmatic downloads of large data URLs.
 */
function dataUrlToBlob(dataUrl: string): string {
  const [header, b64] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] ?? "image/png";
  const bytes = atob(b64);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    arr[i] = bytes.charCodeAt(i);
  }
  const blob = new Blob([arr], { type: mime });
  return URL.createObjectURL(blob);
}

function downloadUrl(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function DownloadBar() {
  const generatedPhotos = useCreationStore((s) => s.generatedPhotos);

  const successfulPhotos = generatedPhotos.filter(
    (p) => p.status === "success",
  );
  const successCount = successfulPhotos.length;

  if (successCount === 0) return null;

  const handleDownloadAll = () => {
    successfulPhotos.forEach((photo, i) => {
      if (photo.status === "success") {
        // Stagger downloads slightly to avoid browser blocking
        setTimeout(() => {
          const blobUrl = dataUrlToBlob(photo.previewUrl);
          downloadUrl(blobUrl, `ai-daipai-${i + 1}.png`);
          // Revoke after a short delay to allow download to start
          setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
        }, i * 500);
      }
    });
  };

  return (
    <div className="flex items-center justify-between rounded-xl border bg-muted/30 px-4 py-3">
      <p className="text-sm text-muted-foreground">
        {successCount} 张写真已就绪
      </p>
      <Button size="sm" onClick={handleDownloadAll}>
        <Download className="size-4" />
        全部下载
      </Button>
    </div>
  );
}
