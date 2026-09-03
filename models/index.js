import sequelize from '../config/database.js';
import User from './User.js';
import StudyPlan from './StudyPlan.js';
import CodeQuery from './CodeQuery.js';

// Setup associations
User.hasMany(StudyPlan, { foreignKey: 'userId', as: 'studyPlans' });
StudyPlan.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(CodeQuery, { foreignKey: 'userId', as: 'codeQueries' });
CodeQuery.belongsTo(User, { foreignKey: 'userId' });

export {
  sequelize,
  User,
  StudyPlan,
  CodeQuery
};
