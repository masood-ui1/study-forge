import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const StudyPlan = sequelize.define('StudyPlan', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  subjects: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  days: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  planContent: {
    type: DataTypes.TEXT,
  },
}, {
  timestamps: true,
});

export default StudyPlan;
