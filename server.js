import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase } from './config/database.js';
import { sequelize } from './models/index.js';
import authRoutes from './routes/authRoutes.js';
import studyPlanRoutes from './routes/studyPlanRoutes.js';
import codeTutorRoutes from './routes/codeTutorRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('StudyForge Backend is running!');
});

app.use('/api/auth', authRoutes);
app.use('/api/study-plan', studyPlanRoutes);
app.use('/api/code-tutor', codeTutorRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/chat', chatRoutes);

// Sync database and start server
const startServer = async () => {
  try {
    // Temporarily disabled database connection
    await initDatabase();
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('Database connection has been established successfully.');
    // console.log('Database connection is temporarily disabled.');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Unable to connect to the database:', err);
  }
};

startServer();
