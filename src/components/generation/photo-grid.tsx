"use client";

import { useCreationStore } from "@/stores/creation-store";
import { PhotoCard } from "./photo-card";

export function PhotoGrid() {
  const photoCount = useCreationStore((s) => s.photoCount);
  const generatedPhotos = useCreationStore((s) => s.generatedPhotos);

  // Build a sparse array: show results where available, skeletons elsewhere
  const slots = Array.from({ length: photoCount }, (_, i) => {
    return generatedPhotos.find((p) => p.index === i);
  });

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {slots.map((result, i) => (
        <PhotoCard key={i} result={result} index={i} />
      ))}
    </div>
  );
}
