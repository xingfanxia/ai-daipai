"use client";

import { useCreationStore } from "@/stores/creation-store";
import { OUTFIT_PRESETS } from "@/lib/presets/outfits";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export function OutfitPicker() {
  const outfit = useCreationStore((s) => s.outfit);
  const setOutfit = useCreationStore((s) => s.setOutfit);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {OUTFIT_PRESETS.map((preset) => {
        const selected = outfit === preset.id;
        return (
          <Card
            key={preset.id}
            role="button"
            tabIndex={0}
            onClick={() => setOutfit(selected ? null : preset.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ")
                setOutfit(selected ? null : preset.id);
            }}
            className={cn(
              "cursor-pointer py-3 transition-all hover:shadow-md",
              selected && "ring-2 ring-primary"
            )}
          >
            <CardContent className="flex items-start justify-between gap-2 px-3">
              <div>
                <p className="text-sm font-medium">{preset.labelZh}</p>
                <p className="text-[10px] text-muted-foreground">
                  {preset.label}
                </p>
              </div>
              {selected && (
                <Check className="size-4 shrink-0 text-primary" />
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
