import { GoogleGenerativeAI } from '@google/generative-ai';

export const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash';

export const getGeminiModel = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return genAI.getGenerativeModel({ model: GEMINI_MODEL });
};
