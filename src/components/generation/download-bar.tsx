"use client";

import { useCreationStore } from "@/stores/creation-store";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
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
          downloadDataUrl(photo.previewUrl, `ai-daipai-${i + 1}.png`);
        }, i * 300);
      }
    });
  };

  return (
    <div className="flex items-center justify-between rounded-xl border bg-muted/30 px-4 py-3">
      <p className="text-sm text-muted-foreground">
        {successCount} photo{successCount !== 1 ? "s" : ""} ready
      </p>
      <Button size="sm" onClick={handleDownloadAll}>
        <Download className="size-4" />
        Download All
      </Button>
    </div>
  );
}
