"use client";
import { useCallback, useRef, useState } from "react";
import { useCreationStore } from "@/stores/creation-store";
import type { GenerationConfig } from "@/types/generation";

export function useGeneration() {
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const store = useCreationStore();

  const startGeneration = useCallback(async (config: GenerationConfig) => {
    setError(null);
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...config,
          model: config.model ?? 'pro',
          abTest: config.abTest ?? false,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Generation failed");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const event = JSON.parse(line.slice(6));

              if (event.event === "started") {
                store.startGeneration(event.data.sessionId);
              } else if (event.event === "photo_started") {
                store.setCurrentPhotoIndex(event.data.index);
              } else if (event.event === "photo_completed") {
                store.addGeneratedPhoto({
                  status: "success",
                  imageId: event.data.imageId,
                  previewUrl: event.data.previewUrl,
                  index: event.data.index,
                });
              } else if (event.event === "photo_failed") {
                store.addGeneratedPhoto({
                  status: "failed",
                  error: event.data.error,
                  index: event.data.index,
                });
              } else if (event.event === "completed") {
                store.setGenerationStatus("completed");
              }
            } catch { /* skip malformed */ }
          }
        }
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        const msg = err instanceof Error ? err.message : "Generation failed";
        setError(msg);
        store.setGenerationStatus("error");
      }
    }
  }, [store]);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    store.setGenerationStatus("idle");
  }, [store]);

  return { startGeneration, cancel, error };
}
