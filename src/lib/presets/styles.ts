import type { StylePreset } from "@/types/preset";

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: "natural",
    label: "Natural",
    labelZh: "自然风",
    description: "Authentic photography, like a friend took this photo",
    promptLines: [
      "STYLE: natural, authentic photography",
      "- Shot on iPhone, high quality but not professional camera",
      "- Minimal editing, natural skin texture, real lighting",
      "- Candid and relaxed, not overly posed",
      "- Natural color tones, no heavy filters",
      "- Should feel like a friend took this photo",
    ],
  },
  {
    id: "influencer",
    label: "Influencer",
    labelZh: "网红风",
    description: "Polished influencer aesthetic, warm tones",
    promptLines: [
      "STYLE: Chinese social media influencer (网红) aesthetic",
      "- Shot on iPhone, high quality but not professional camera",
      "- Subtle beauty filter — skin is smooth and luminous but not plastic",
      "- Warm color grading, slightly lifted shadows, soft contrast (like VSCO or Ulike filter)",
      "- NOT overly edited or AI-looking — real but polished",
      "- Composition feels intentionally casual (摆拍) — 'effortlessly pretty'",
      "- 小红书/抖音 Chinese internet aesthetic",
      "- The person is photogenic and knows their angles",
    ],
  },
  {
    id: "editorial",
    label: "Editorial",
    labelZh: "杂志风",
    description: "Fashion magazine quality, dramatic and cinematic",
    promptLines: [
      "STYLE: editorial/fashion photography",
      "- Professional lighting and composition",
      "- Fashion magazine quality, cinematic color grading",
      "- Dramatic poses and angles",
      "- High-end, polished, aspirational look",
      "- Think Vogue China or ELLE editorial spread",
    ],
  },
  {
    id: "xiaohongshu",
    label: "Xiaohongshu",
    labelZh: "小红书风",
    description: "Phone-shot aesthetic with beauty filter, casual but pretty",
    promptLines: [
      "STYLE: 小红书网感 (Xiaohongshu phone-shot aesthetic)",
      "- This must look like it was shot on a phone (iPhone/Huawei), NOT a professional camera",
      "- Phone-quality image: phone-typical depth of field (not DSLR bokeh), natural phone lighting",
      "- Beauty filter on SKIN ONLY: smooth luminous skin, rosy undertone — like 美图/轻颜/Ulike",
      "- Do NOT alter face shape, bone structure, or facial proportions — beauty filter applies to skin texture and tone only",
      "- Color grading: warm peachy/milky tones, soft glow, slightly lifted shadows — 小红书调色",
      "- Framing feels casual but intentional (摆拍 but not stiff) — 随手一拍就很好看",
      "- Framing adapts to the scene: close-up/half-body for indoor/intimate scenes, full-body with scenery for travel/outdoor",
      "- NOT studio lighting, NOT professional composition — this is phone photography that just happens to look amazing",
      "- 小红书/抖音 Chinese social media aesthetic, the kind of photo that gets 收藏+点赞",
    ],
  },
  {
    id: "cinematic",
    label: "Cinematic",
    labelZh: "电影感",
    description: "Film color grading, dramatic lighting, Wong Kar-wai vibes",
    promptLines: [
      "STYLE: cinematic film photography",
      "- Inspired by Wong Kar-wai / Zhang Yimou color palette",
      "- Rich, saturated color grading with teal and orange tones",
      "- Dramatic lighting — strong shadows, volumetric light, lens flares",
      "- Shallow depth of field, anamorphic lens feel",
      "- Film grain texture, slightly desaturated highlights",
      "- Moody atmosphere, every frame tells a story",
      "- Aspect ratio feels wider, cinematic framing with negative space",
    ],
  },
  {
    id: "retro",
    label: "Retro Film",
    labelZh: "复古胶片",
    description: "Film grain, muted warm tones, Kodak Portra look",
    promptLines: [
      "STYLE: retro analog film photography",
      "- Shot on Kodak Portra 400 or Fuji Superia film stock look",
      "- Warm muted tones, slightly faded blacks, lifted shadows",
      "- Visible film grain and subtle light leaks",
      "- Soft, dreamy color palette — warm yellows, desaturated greens, rosy skin tones",
      "- Vintage composition style — centered or rule-of-thirds, slightly off-kilter framing",
      "- Nostalgic feel, like a photo from the 90s or early 2000s",
      "- Natural imperfections: slight overexposure, soft focus edges",
    ],
  },
];

export function getStylePreset(id: string): StylePreset | undefined {
  return STYLE_PRESETS.find((s) => s.id === id);
}
