import type { ScenePreset } from "@/types/preset";

export const SCENE_PRESETS: ScenePreset[] = [
  // outdoor-nature
  {
    id: "cherry-blossom",
    label: "Cherry Blossom Garden",
    labelZh: "樱花园",
    category: "outdoor-nature",
    promptDescription:
      "a beautiful cherry blossom garden in full bloom, soft pink petals falling, gentle sunlight filtering through branches, spring atmosphere",
  },
  {
    id: "lavender-field",
    label: "Lavender Field",
    labelZh: "薰衣草花田",
    category: "outdoor-nature",
    promptDescription:
      "endless lavender field stretching to the horizon, purple flowers, warm golden hour sunlight, Provence-style atmosphere",
  },
  {
    id: "forest-trail",
    label: "Forest Trail",
    labelZh: "林间小道",
    category: "outdoor-nature",
    promptDescription:
      "a dappled forest trail with tall trees, sunbeams through canopy, mossy ground, peaceful and serene",
  },
  {
    id: "autumn-maple",
    label: "Autumn Maple Path",
    labelZh: "秋日枫叶道",
    category: "outdoor-nature",
    promptDescription:
      "a path lined with vibrant red and orange maple trees, fallen leaves, warm autumn light, romantic atmosphere",
  },

  // urban
  {
    id: "rooftop-dusk",
    label: "Rooftop at Dusk",
    labelZh: "天台黄昏",
    category: "urban",
    promptDescription:
      "urban rooftop at golden hour/dusk, city skyline in background, warm sunset light, modern and trendy",
  },
  {
    id: "neon-street",
    label: "Neon City Street",
    labelZh: "霓虹街头",
    category: "urban",
    promptDescription:
      "vibrant neon-lit city street at night, colorful signs, rain-slicked pavement reflecting lights, cinematic urban atmosphere",
  },
  {
    id: "vintage-bookstore",
    label: "Vintage Bookstore",
    labelZh: "复古书店",
    category: "urban",
    promptDescription:
      "cozy vintage bookstore interior, warm lighting, wooden shelves filled with books, intellectual atmosphere",
  },
  {
    id: "modern-plaza",
    label: "Modern Plaza",
    labelZh: "现代广场",
    category: "urban",
    promptDescription:
      "sleek modern architectural plaza with clean lines, glass and steel, minimalist design, daytime with clear sky",
  },

  // indoor
  {
    id: "sunlit-cafe",
    label: "Sunlit Cafe",
    labelZh: "阳光咖啡馆",
    category: "indoor",
    promptDescription:
      "bright sunlit cafe with large windows, warm natural light streaming in, coffee cups on marble table, cozy and aesthetic",
  },
  {
    id: "cozy-library",
    label: "Cozy Library",
    labelZh: "温馨图书馆",
    category: "indoor",
    promptDescription:
      "warm cozy library with floor-to-ceiling bookshelves, soft reading lamp light, leather chairs, academic aesthetic",
  },
  {
    id: "minimal-apartment",
    label: "Minimalist Apartment",
    labelZh: "极简公寓",
    category: "indoor",
    promptDescription:
      "clean minimalist apartment with white walls, natural light from large windows, indoor plants, modern Scandinavian design",
  },
  {
    id: "flower-shop",
    label: "Flower Shop",
    labelZh: "花店",
    category: "indoor",
    promptDescription:
      "charming flower shop filled with colorful bouquets, hanging dried flowers, warm ambient lighting, romantic atmosphere",
  },

  // studio
  {
    id: "white-studio",
    label: "White Cyclorama",
    labelZh: "白色影棚",
    category: "studio",
    promptDescription:
      "clean white cyclorama photography studio, professional lighting, seamless white background, high-fashion feel",
  },
  {
    id: "golden-backdrop",
    label: "Warm Golden Backdrop",
    labelZh: "暖金色背景",
    category: "studio",
    promptDescription:
      "studio with warm golden/amber backdrop, soft diffused lighting, luxurious and warm atmosphere",
  },
  {
    id: "window-light",
    label: "Natural Window Light",
    labelZh: "自然窗光",
    category: "studio",
    promptDescription:
      "studio with large window providing natural directional light, white curtains, soft shadows, ethereal and dreamy",
  },

  // travel
  {
    id: "santorini",
    label: "Santorini",
    labelZh: "圣托里尼",
    category: "travel",
    promptDescription:
      "Santorini Greece, white-washed buildings with blue domes, overlooking the Aegean Sea, bright Mediterranean sunlight",
  },
  {
    id: "kyoto-temple",
    label: "Kyoto Temple",
    labelZh: "京都寺庙",
    category: "travel",
    promptDescription:
      "traditional Kyoto temple courtyard, red torii gates, zen garden, autumn foliage, serene Japanese atmosphere",
  },
  {
    id: "paris-cafe",
    label: "Paris Cafe Terrace",
    labelZh: "巴黎露天咖啡馆",
    category: "travel",
    promptDescription:
      "charming Parisian sidewalk cafe with wicker chairs, Haussmann building facades, morning light, French romantic atmosphere",
  },
  {
    id: "bali-rice",
    label: "Bali Rice Terrace",
    labelZh: "巴厘岛梯田",
    category: "travel",
    promptDescription:
      "lush green Bali rice terraces, tropical palm trees, golden hour light, exotic and peaceful atmosphere",
  },
];

export function getScenePreset(id: string): ScenePreset | undefined {
  return SCENE_PRESETS.find((s) => s.id === id);
}

export const SCENE_CATEGORIES: {
  id: string;
  label: string;
  labelZh: string;
}[] = [
  { id: "outdoor-nature", label: "Nature", labelZh: "户外自然" },
  { id: "urban", label: "Urban", labelZh: "城市" },
  { id: "indoor", label: "Indoor", labelZh: "室内" },
  { id: "studio", label: "Studio", labelZh: "影棚" },
  { id: "travel", label: "Travel", labelZh: "旅行" },
];
