import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/study-plan', studyPlanRoutes);
app.use('/api/code-tutor', codeTutorRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/chat', chatRoutes);

// Serve Vite frontend
app.use(express.static(path.join(__dirname, 'dist')));

// For frontend routes, return Vite's index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
const startServer = async () => {
  try {
    await initDatabase();

    await sequelize.authenticate();

    await sequelize.sync({ alter: true });

    console.log('Database connection has been established successfully.');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  }
};

startServer();
