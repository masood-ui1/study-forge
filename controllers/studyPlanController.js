import { StudyPlan } from '../models/index.js';
import { getGeminiModel } from '../config/gemini.js';

const parsePlanJson = (text) => {
  const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf('[');
    const end = cleaned.lastIndexOf(']');

    if (start === -1 || end === -1 || end <= start) {
      throw new Error('Gemini response did not include a JSON array');
    }

    return JSON.parse(cleaned.slice(start, end + 1));
  }
};

export const generatePlan = async (req, res) => {
  try {
    const { subjects, days, hoursPerDay } = req.body;
    const userId = req.userId;

    if (!subjects || !days || !hoursPerDay) {
      return res.status(400).json({ error: 'Missing required fields: subjects, days, hoursPerDay' });
    }

    const model = getGeminiModel();

    const prompt = `Create a day-by-day study plan for the following subjects: ${subjects}.
The plan should span ${days} days, studying approximately ${hoursPerDay} hours per day.
Return the result STRICTLY as a JSON array where each object has this format:
{
  "day": <number>,
  "topics": "<string>",
  "focusAreas": "<string>"
}
Do not include any Markdown formatting like \`\`\`json or \`\`\`, just return the raw JSON array.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    let planData;

    try {
      planData = parsePlanJson(text);
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', parseError.message, text);
      return res.status(500).json({ error: 'Failed to generate a valid study plan format from AI.' });
    }

    const newPlan = await StudyPlan.create({
      userId,
      subjects,
      days,
      planContent: JSON.stringify(planData)
    });

    res.status(201).json({
      plan: {
        id: newPlan.id,
        userId: newPlan.userId,
        subjects: newPlan.subjects,
        days: newPlan.days,
        planContent: planData,
        createdAt: newPlan.createdAt
      }
    });
  } catch (error) {
    console.error('Generate plan error:', error);
    res.status(500).json({ error: 'Internal server error while generating study plan.' });
  }
};

export const getPlans = async (req, res) => {
  try {
    const userId = req.userId;
    const plans = await StudyPlan.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });

    const parsedPlans = plans.map(plan => ({
      id: plan.id,
      userId: plan.userId,
      subjects: plan.subjects,
      days: plan.days,
      planContent: plan.planContent ? JSON.parse(plan.planContent) : null,
      createdAt: plan.createdAt
    }));

    res.json(parsedPlans);
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ error: 'Internal server error while fetching study plans.' });
  }
};
