"use client";

import { useCreationStore } from "@/stores/creation-store";
import { useGeneration } from "@/hooks/use-generation";
import { GenerationProgress } from "./generation-progress";
import { PhotoGrid } from "./photo-grid";
import { DownloadBar } from "./download-bar";
import { Button } from "@/components/ui/button";
import { Sparkles, RotateCcw, AlertCircle } from "lucide-react";
import type { GenerationConfig } from "@/types/generation";

export function GenerateStep() {
  const store = useCreationStore();
  const { startGeneration, error } = useGeneration();

  const handleGenerate = () => {
    const referenceImages = Object.values(store.referenceImages)
      .filter((img): img is NonNullable<typeof img> => !!img)
      .map((img) => img.base64);

    const config: GenerationConfig = {
      referenceImages,
      sceneType: store.scene?.type ?? "preset",
      scenePresetId:
        store.scene?.type === "preset" ? store.scene.presetId : undefined,
      sceneImages:
        store.scene?.type === "custom"
          ? store.scene.images.map((img) => img.base64)
          : undefined,
      sceneDescription:
        store.scene?.type === "custom" ? store.scene.description : undefined,
      style: store.style,
      outfit: store.outfit,
      mood: store.mood,
      count: store.photoCount,
    };

    startGeneration(config);
  };

  // Idle — just arrived at step 3
  if (store.generationStatus === "idle") {
    return (
      <div className="flex flex-col items-center gap-6 py-12">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Ready to Generate</h2>
          <p className="text-sm text-muted-foreground">
            {store.photoCount} photos will be generated with your settings
          </p>
        </div>
        <Button size="lg" onClick={handleGenerate} className="h-12 px-8">
          <Sparkles className="size-5" />
          Generate Photos
        </Button>
      </div>
    );
  }

  // Generating
  if (store.generationStatus === "generating") {
    return (
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold">生成中...</h2>
          <p className="text-sm text-muted-foreground">
            AI is creating your photos. This may take a moment.
          </p>
        </div>
        <GenerationProgress />
        <PhotoGrid />
      </div>
    );
  }

  // Completed
  if (store.generationStatus === "completed") {
    return (
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold">生成完成!</h2>
          <p className="text-sm text-muted-foreground">
            Your photos are ready. Download them below.
          </p>
        </div>
        <PhotoGrid />
        <DownloadBar />
      </div>
    );
  }

  // Error
  return (
    <div className="flex flex-col items-center gap-6 py-12">
      <AlertCircle className="size-12 text-destructive" />
      <div className="text-center">
        <h2 className="text-xl font-semibold">Generation Failed</h2>
        <p className="text-sm text-destructive">
          {error || "Something went wrong. Please try again."}
        </p>
      </div>
      <Button variant="outline" onClick={handleGenerate}>
        <RotateCcw className="size-4" />
        Retry
      </Button>
    </div>
  );
}
