```js
import { Sequelize } from 'sequelize';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbHost = process.env.DB_HOST;
const dbPort = Number(process.env.DB_PORT || 22191);
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

export const initDatabase = async () => {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    await connection.query('SELECT 1');

    console.log('Successfully connected to Aiven MySQL.');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
  logging: false,
});

export default sequelize;

// Render deployment check
