"use client";

import { useCreationStore } from "@/stores/creation-store";
import { STYLE_PRESETS } from "@/lib/presets/styles";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import type { PhotoStyle } from "@/types/preset";

export function StylePicker() {
  const style = useCreationStore((s) => s.style);
  const setStyle = useCreationStore((s) => s.setStyle);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {STYLE_PRESETS.map((preset) => {
        const selected = style === preset.id;
        return (
          <Card
            key={preset.id}
            role="button"
            tabIndex={0}
            onClick={() => setStyle(preset.id as PhotoStyle)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                setStyle(preset.id as PhotoStyle);
            }}
            className={cn(
              "cursor-pointer py-4 transition-all hover:shadow-md",
              selected && "ring-2 ring-primary"
            )}
          >
            <CardContent className="flex flex-col gap-1 px-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold">{preset.labelZh}</p>
                  <p className="text-xs text-muted-foreground">
                    {preset.label}
                  </p>
                </div>
                {selected && (
                  <Check className="size-4 shrink-0 text-primary" />
                )}
              </div>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                {preset.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
