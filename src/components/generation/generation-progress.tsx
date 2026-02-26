"use client";

import { useCreationStore } from "@/stores/creation-store";
import { Progress } from "@/components/ui/progress";

export function GenerationProgress() {
  const photoCount = useCreationStore((s) => s.photoCount);
  const generatedPhotos = useCreationStore((s) => s.generatedPhotos);
  const currentPhotoIndex = useCreationStore((s) => s.currentPhotoIndex);

  const completedCount = generatedPhotos.length;
  const progressPercent = (completedCount / photoCount) * 100;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          Generating photo {Math.min(currentPhotoIndex + 1, photoCount)} of{" "}
          {photoCount}...
        </span>
        <span className="font-medium tabular-nums">
          {completedCount}/{photoCount}
        </span>
      </div>
      <Progress value={progressPercent} className="h-2" />
    </div>
  );
}
