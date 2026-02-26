"use client";

import { useCreationStore } from "@/stores/creation-store";
import { MOOD_OPTIONS } from "@/lib/presets/moods";
import { Badge } from "@/components/ui/badge";

export function MoodPicker() {
  const mood = useCreationStore((s) => s.mood);
  const setMood = useCreationStore((s) => s.setMood);

  return (
    <div className="flex flex-wrap gap-2">
      {MOOD_OPTIONS.map((option) => {
        const selected = mood === option.id;
        return (
          <Badge
            key={option.id}
            variant={selected ? "default" : "outline"}
            className="cursor-pointer px-3 py-1.5 text-sm transition-colors"
            onClick={() => setMood(selected ? null : option.id)}
          >
            {option.emoji} {option.labelZh}
          </Badge>
        );
      })}
    </div>
  );
}
