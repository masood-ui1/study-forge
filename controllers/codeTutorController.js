import { CodeQuery } from '../models/index.js';
import { getGeminiModel } from '../config/gemini.js';

export const askQuestion = async (req, res) => {
  try {
    const { question, language = 'English' } = req.body;
    const userId = req.userId;

    if (!question) {
      return res.status(400).json({ error: 'Missing required field: question' });
    }

    const model = getGeminiModel();

    const prompt = `Act as a friendly, beginner-focused coding tutor. 
Please explain the following code or answer the question in simple, clear language. 
Please write your entire explanation and response in ${language}.
Use short paragraphs or bullet points, and if it's code, explain it in a logical step-by-step way.
Question: ${question}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const newQuery = await CodeQuery.create({
      userId,
      question,
      aiResponse: text,
      language
    });

    res.status(201).json({
      query: {
        id: newQuery.id,
        userId: newQuery.userId,
        question: newQuery.question,
        aiResponse: newQuery.aiResponse,
        language: newQuery.language,
        createdAt: newQuery.createdAt
      }
    });
  } catch (error) {
    console.error('Ask question error:', error);
    res.status(500).json({ error: 'Internal server error while asking code tutor.' });
  }
};

export const getHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const queries = await CodeQuery.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });

    res.json(queries);
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ error: 'Internal server error while fetching code tutor history.' });
  }
};
