"use client";

import { useCreationStore } from "@/stores/creation-store";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function DownloadBar() {
  const generatedPhotos = useCreationStore((s) => s.generatedPhotos);

  const successfulPhotos = generatedPhotos.filter(
    (p) => p.status === "success"
  );
  const successCount = successfulPhotos.length;

  if (successCount === 0) return null;

  const imageIds = successfulPhotos
    .map((p) => (p.status === "success" ? p.imageId : null))
    .filter(Boolean)
    .join(",");

  return (
    <div className="flex items-center justify-between rounded-xl border bg-muted/30 px-4 py-3">
      <p className="text-sm text-muted-foreground">
        {successCount} photo{successCount !== 1 ? "s" : ""} ready
      </p>
      <Button asChild size="sm">
        <a href={`/api/download?ids=${imageIds}`} download>
          <Download className="size-4" />
          Download All
        </a>
      </Button>
    </div>
  );
}
