import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash';

async function testGemini() {
  try {
    console.log('Testing Gemini API key...');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    const prompt = `Create a day-by-day study plan for the following subjects: React.
The plan should span 2 days, studying approximately 2 hours per day.
Return the result STRICTLY as a JSON array where each object has this format:
{
  "day": <number>,
  "topics": "<string>",
  "focusAreas": "<string>"
}
Do not include any Markdown formatting like \`\`\`json or \`\`\`, just return the raw JSON array.`;

    const result = await model.generateContent(prompt);
    let text = result.response.text();
    
    // Strip markdown code fences if present
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    const planData = JSON.parse(text);
    console.log('✅ Gemini API is working! Received valid JSON:');
    console.log(JSON.stringify(planData, null, 2));
  } catch (error) {
    console.error('❌ Failed to connect to Gemini API or parse JSON:', error.message);
  }
}

testGemini();
