import dotenv from 'dotenv';
import { initDatabase } from './config/database.js';
import { sequelize, User } from './models/index.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await initDatabase();
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
    
    // Sync to ensure table exists
    await sequelize.sync();

    const email = 'demo@studyforge.com';
    const existingUser = await User.findOne({ where: { email } });
    
    if (existingUser) {
      console.log('Demo user already exists in the database.');
    } else {
      await User.create({
        name: 'Demo User',
        email: email,
        password: 'demo1234'
      });
      console.log('Successfully created demo user (demo@studyforge.com / demo1234).');
    }
  } catch (error) {
    console.error('Unable to connect to the database or create user:', error);
  } finally {
    await sequelize.close();
  }
};

seedDatabase();
