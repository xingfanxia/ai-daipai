const MODEL_MAP = {
  pro: 'gemini-3-pro-image-preview',
  nb2: 'gemini-3.1-flash-image-preview',
} as const;
type ModelChoice = keyof typeof MODEL_MAP;

const ANALYSIS_MODEL = "gemini-2.0-flash";
const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

export interface GeminiPart {
  text?: string;
  inlineData?: { mimeType: string; data: string };
}

export interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
        inlineData?: { mimeType: string; data: string };
      }>;
    };
    finishReason?: string;
    finishMessage?: string;
  }>;
}

export type { ModelChoice };

export async function callGemini(
  parts: GeminiPart[],
  apiKey: string,
  model: ModelChoice = 'nb2',
): Promise<GeminiResponse> {
  const url = `${API_BASE}/${MODEL_MAP[model]}:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: AbortSignal.timeout(120_000),
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: { responseModalities: ["IMAGE", "TEXT"] },
    }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Gemini API error ${response.status}: ${errorText.slice(0, 300)}`,
    );
  }
  return response.json() as Promise<GeminiResponse>;
}

/**
 * Analyze an inspiration image with Gemini Flash to extract style as text.
 * Two-step approach: prevents face bleed and watermark copying.
 */
export async function analyzeInspirationImage(
  imageBase64: string,
  apiKey: string,
): Promise<string> {
  const prompt = [
    "Analyze this photo and describe the following elements in detail for recreation.",
    "",
    "CRITICAL: Do NOT describe the person's face, facial features, identity, skin color,",
    "hair color, hair style, eye color, or any physical attributes of the person.",
    "Only describe the STYLE, ENVIRONMENT, and PHOTOGRAPHY elements.",
    "The output will be used to recreate this aesthetic with a COMPLETELY DIFFERENT person,",
    "so any person-specific descriptions will cause incorrect results.",
    "",
    "Describe ONLY these elements:",
    "1. COMPOSITION & FRAMING: Camera angle, distance, crop style, subject placement",
    "2. LIGHTING: Direction, quality, color temperature, shadows, highlights",
    "3. COLOR GRADING: Overall palette, warm/cool tones, contrast level, saturation",
    "4. POSE STYLE: Body language energy, hand placement, weight distribution (NOT face/body description)",
    "5. ATMOSPHERE & MOOD: Overall vibe, feeling, aesthetic",
    "6. SCENE/ENVIRONMENT: Location, setting, architectural elements, props",
    "7. OUTFIT STYLE: Clothing category, color, fit, style (generic description, NOT body-specific)",
    "8. PHOTOGRAPHY STYLE: Phone vs professional, filter style, editing approach",
    "",
    "Output as a structured description for recreating this aesthetic with a different person.",
  ].join("\n");

  const url = `${API_BASE}/${ANALYSIS_MODEL}:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: AbortSignal.timeout(60_000),
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: prompt },
          { inlineData: { mimeType: "image/jpeg", data: imageBase64 } },
        ],
      }],
      generationConfig: { responseModalities: ["TEXT"] },
    }),
  });

  if (!response.ok) {
    throw new Error(`Inspiration analysis failed: ${response.status}`);
  }

  const data = (await response.json()) as GeminiResponse;
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("Inspiration analysis returned no text.");
  }
  return text;
}
