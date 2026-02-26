const MODEL = "gemini-3-pro-image-preview";
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
