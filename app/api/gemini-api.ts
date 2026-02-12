import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});

export async function handlerLLMApi(message: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: message,
  });

  return response.text;
}

// export async function embeddingContent(contents: string | string[]) {
//   const response = await ai.models.embedContent({
//     model: 'gemini-embedding-001',
//     contents
//   });

//   return response.embeddings
// }