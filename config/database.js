```js
import { Sequelize } from 'sequelize';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 22191),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
};

export const initDatabase = async () => {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      ssl: dbConfig.ssl,
    });

    // The database should normally already exist on Aiven.
    // We don't need to create it here.
    await connection.query(
      `SELECT 1`
    );

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

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 22191),
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
    logging: false,
  }
);

export default sequelize;
```
