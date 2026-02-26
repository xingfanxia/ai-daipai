const MODEL = "gemini-3-pro-image-preview";
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

export async function callGemini(
  parts: GeminiPart[],
  apiKey: string,
): Promise<GeminiResponse> {
  const url = `${API_BASE}/${MODEL}:generateContent?key=${apiKey}`;
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
    "Do NOT describe the person's face or identity — only describe the style elements:",
    "",
    "1. COMPOSITION & FRAMING: Camera angle, distance, crop style, subject placement",
    "2. LIGHTING: Direction, quality, color temperature, shadows, highlights",
    "3. COLOR GRADING: Overall palette, warm/cool tones, contrast level, saturation",
    "4. POSE STYLE: Body language energy, hand placement, weight distribution",
    "5. ATMOSPHERE & MOOD: Overall vibe, feeling, aesthetic",
    "6. SCENE/ENVIRONMENT: Location, setting, architectural elements, props",
    "7. OUTFIT STYLE: Clothing category, color, fit, style",
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
