import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const CodeQuery = sequelize.define('CodeQuery', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  question: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  aiResponse: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  language: {
    type: DataTypes.STRING,
    defaultValue: 'English',
  },
}, {
  timestamps: true,
});

export default CodeQuery;
