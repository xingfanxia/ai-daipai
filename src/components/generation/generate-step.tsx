"use client";

import { useEffect, useRef } from "react";
import { useCreationStore } from "@/stores/creation-store";
import { useGeneration } from "@/hooks/use-generation";
import { GenerationProgress } from "./generation-progress";
import { PhotoGrid } from "./photo-grid";
import { DownloadBar } from "./download-bar";
import { Button } from "@/components/ui/button";
import { RotateCcw, AlertCircle, Loader2 } from "lucide-react";
import type { GenerationConfig } from "@/types/generation";

export function GenerateStep() {
  const store = useCreationStore();
  const { startGeneration, error } = useGeneration();
  const autoStarted = useRef(false);

  const handleGenerate = () => {
    const refEntries = Object.entries(store.referenceImages)
      .filter((entry): entry is [string, NonNullable<(typeof entry)[1]>] => !!entry[1]);

    const referenceImages = refEntries.map(([, img]) => img.blobUrl);
    const refSlots = refEntries.map(([slot]) => slot);

    const config: GenerationConfig = {
      referenceImages,
      refSlots,
      sceneType: store.scene?.type ?? "preset",
      scenePresetId:
        store.scene?.type === "preset" ? store.scene.presetId : undefined,
      sceneImages:
        store.scene?.type === "custom"
          ? store.scene.images.map((img) => img.blobUrl)
          : undefined,
      inspirationImage: store.inspirationImage?.blobUrl,
      sceneDescription:
        store.scene?.type === "custom" ? store.scene.description : undefined,
      style: store.style,
      outfit: store.outfit,
      mood: store.mood,
      count: store.photoCount,
      model: store.model,
      abTest: store.abTest,
    };

    startGeneration(config);
  };

  // Auto-start generation when entering step 3
  useEffect(() => {
    if (store.generationStatus === "idle" && !autoStarted.current) {
      autoStarted.current = true;
      handleGenerate();
    }
  }); // eslint-disable-line react-hooks/exhaustive-deps

  // Idle / starting — show loading immediately
  if (store.generationStatus === "idle") {
    return (
      <div className="flex flex-col items-center gap-6 py-12">
        <Loader2 className="size-10 animate-spin text-primary" />
        <div className="text-center">
          <h2 className="text-xl font-semibold">准备生成中...</h2>
          <p className="text-sm text-muted-foreground">
            正在初始化，请稍候
          </p>
        </div>
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
            AI 正在创作你的写真，请耐心等待
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
            写真已生成完毕，点击下方下载
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
        <h2 className="text-xl font-semibold">生成失败</h2>
        <p className="text-sm text-destructive">
          {error || "出了点问题，请重试"}
        </p>
      </div>
      <Button variant="outline" onClick={handleGenerate}>
        <RotateCcw className="size-4" />
        重试
      </Button>
    </div>
  );
}
