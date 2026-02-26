import type { MoodOption } from "@/types/preset";

export const MOOD_OPTIONS: MoodOption[] = [
  {
    id: "dreamy",
    emoji: "✨",
    label: "Dreamy",
    labelZh: "梦幻",
    promptText: "dreamy, ethereal, soft and romantic, like lost in a beautiful daydream",
  },
  {
    id: "confident",
    emoji: "💪",
    label: "Confident",
    labelZh: "自信",
    promptText: "confident, empowered, strong gaze, self-assured and commanding presence",
  },
  {
    id: "playful",
    emoji: "😜",
    label: "Playful",
    labelZh: "俏皮",
    promptText: "playful, fun, mischievous smile, energetic and lighthearted",
  },
  {
    id: "elegant",
    emoji: "👑",
    label: "Elegant",
    labelZh: "优雅",
    promptText: "elegant, graceful, refined, sophisticated poise and timeless beauty",
  },
  {
    id: "casual",
    emoji: "😊",
    label: "Casual",
    labelZh: "随性",
    promptText: "casual, relaxed, natural and at ease, genuine comfortable smile",
  },
  {
    id: "mysterious",
    emoji: "🌙",
    label: "Mysterious",
    labelZh: "神秘",
    promptText: "mysterious, enigmatic, subtle expression, intriguing and captivating aura",
  },
  {
    id: "joyful",
    emoji: "🌸",
    label: "Joyful",
    labelZh: "喜悦",
    promptText: "joyful, radiantly happy, bright genuine smile, infectious positive energy",
  },
  {
    id: "cool",
    emoji: "😎",
    label: "Cool",
    labelZh: "酷飒",
    promptText: "cool, edgy, nonchalant attitude, effortlessly stylish with a hint of rebellion",
  },
];

export function getMoodOption(id: string): MoodOption | undefined {
  return MOOD_OPTIONS.find((m) => m.id === id);
}
