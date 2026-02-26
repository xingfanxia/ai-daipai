import type { OutfitPreset } from "@/types/preset";

export const OUTFIT_PRESETS: OutfitPreset[] = [
  {
    id: "casual-chic",
    label: "Casual Chic",
    labelZh: "休闲时髦",
    promptDescription:
      "casual chic outfit — elegant basics, well-fitted jeans or trousers, quality top, minimal accessories, effortlessly stylish",
  },
  {
    id: "business",
    label: "Business",
    labelZh: "商务正装",
    promptDescription:
      "professional business attire — tailored blazer, crisp shirt, dress pants or pencil skirt, polished shoes, confident executive look",
  },
  {
    id: "streetwear",
    label: "Streetwear",
    labelZh: "街头潮牌",
    promptDescription:
      "trendy streetwear — oversized hoodie or graphic tee, cargo pants or joggers, sneakers, baseball cap, urban cool aesthetic",
  },
  {
    id: "evening",
    label: "Evening",
    labelZh: "晚礼服",
    promptDescription:
      "elegant evening wear — cocktail dress or formal suit, statement jewelry, heels, glamorous and sophisticated",
  },
  {
    id: "athletic",
    label: "Athletic",
    labelZh: "运动休闲",
    promptDescription:
      "athleisure outfit — matching workout set or leggings with crop top, clean sneakers, sporty and energetic",
  },
  {
    id: "bohemian",
    label: "Bohemian",
    labelZh: "波西米亚",
    promptDescription:
      "bohemian style — flowing maxi dress or layered textures, natural fabrics, earthy tones, free-spirited and artistic",
  },
  {
    id: "minimal",
    label: "Minimal",
    labelZh: "极简",
    promptDescription:
      "minimalist outfit — clean lines, neutral tones (white, beige, black), quality basics, no excessive accessories, understated elegance",
  },
];

export function getOutfitPreset(id: string): OutfitPreset | undefined {
  return OUTFIT_PRESETS.find((o) => o.id === id);
}
