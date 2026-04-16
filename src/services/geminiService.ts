import { GoogleGenAI, Type } from "@google/genai";
import { OCRResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function extractQuestionFromImage(base64Image: string, mimeType: string): Promise<OCRResult> {
  const prompt = `
    Extract the question from this image. 
    Clean the text: remove unwanted symbols, fix spacing, and format it properly.
    Detect the question type: 'MCQ' (Multiple Choice), 'Short' (Short Answer), or 'Long' (Long Answer).
    If it's an MCQ, extract the options (A, B, C, D etc.).
    Return the result in JSON format.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              data: base64Image.split(',')[1],
              mimeType: mimeType,
            },
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING, description: "The cleaned question text" },
          type: { 
            type: Type.STRING, 
            enum: ["MCQ", "Short", "Long"],
            description: "The type of question" 
          },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Options for MCQ if applicable"
          }
        },
        required: ["text", "type"]
      }
    }
  });

  const result = JSON.parse(response.text || '{}');
  return result as OCRResult;
}
