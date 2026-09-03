import { getGeminiModel } from '../config/gemini.js';

export const sendMessage = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Missing required field: message' });
    }

    const model = getGeminiModel();

    let historyContext = '';
    if (history && history.length > 0) {
      historyContext = history.map(h => `${h.role === 'user' ? 'User' : 'StudyBuddy'}: ${h.text}`).join('\n');
      historyContext = `\n\nRecent conversation history:\n${historyContext}\n\n`;
    }

    const prompt = `System Instructions: You are StudyBuddy, a friendly, encouraging AI assistant inside a study/coding app called StudyForge. Keep answers concise and helpful, focused on study tips, coding help, or motivation. If asked something unrelated, politely redirect to study/coding topics.${historyContext}User: ${message}\nStudyBuddy:`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    res.json({ reply });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Internal server error while processing chat.' });
  }
};
