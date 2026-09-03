import { User, StudyPlan, CodeQuery } from '../models/index.js';

export const getStats = async (req, res) => {
  try {
    const userId = req.userId;
    
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const plans = await StudyPlan.findAll({ where: { userId } });
    const queries = await CodeQuery.findAll({ where: { userId } });

    const totalPlans = plans.length;
    const totalQueries = queries.length;

    let memberSince = user.createdAt;
    
    // Find most active day
    const dayCounts = {
      0: 0, // Sunday
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
    };
    const daysMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const allActivities = [...plans, ...queries];
    
    allActivities.forEach(item => {
      const date = new Date(item.createdAt);
      if (date < new Date(memberSince)) {
        memberSince = date;
      }
      dayCounts[date.getDay()]++;
    });

    let mostActiveDay = 'Not enough data';
    let maxCount = 0;
    
    for (const [day, count] of Object.entries(dayCounts)) {
      if (count > maxCount) {
        maxCount = count;
        mostActiveDay = daysMap[day];
      }
    }

    res.json({
      name: user.name,
      email: user.email,
      username: user.username,
      totalPlans,
      totalQueries,
      memberSince,
      mostActiveDay
    });
  } catch (error) {
    console.error('Error fetching profile stats:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const updateUsername = async (req, res) => {
  try {
    const userId = req.userId;
    const { username } = req.body;

    if (!username || username.trim() === '') {
      return res.status(400).json({ error: 'Username cannot be empty.' });
    }

    const cleanUsername = username.trim().toLowerCase();

    // Check uniqueness
    const existing = await User.findOne({ where: { username: cleanUsername } });
    if (existing && existing.id !== userId) {
      return res.status(400).json({ error: 'Username is already taken.' });
    }

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.username = cleanUsername;
    await user.save();

    res.json({
      name: user.name,
      email: user.email,
      username: user.username
    });
  } catch (error) {
    console.error('Error updating username:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

export const getPublicProfile = async (req, res) => {
  try {
    const { username } = req.params;
    
    const user = await User.findOne({ where: { username: username.toLowerCase() } });
    if (!user) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const plansCount = await StudyPlan.count({ where: { userId: user.id } });
    const queriesCount = await CodeQuery.count({ where: { userId: user.id } });

    res.json({
      name: user.name,
      username: user.username,
      memberSince: user.createdAt,
      totalPlans: plansCount,
      totalQueries: queriesCount
    });
  } catch (error) {
    console.error('Error fetching public profile:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
