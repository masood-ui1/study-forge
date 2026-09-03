import { initDatabase } from './config/database.js';
import { User, StudyPlan, CodeQuery, sequelize } from './models/index.js';

async function testDatabaseSaving() {
  console.log('--- Starting Database Save Test ---');
  let testUserId;
  try {
    // Ensure DB is initialized and synced
    await initDatabase();
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    
    console.log('1. Testing User saving...');
    const testUser = await User.create({
      name: 'Test User',
      email: `testuser_${Date.now()}@example.com`,
      password: 'password123'
    });
    console.log(`✅ User saved successfully with ID: ${testUser.id}`);
    testUserId = testUser.id;

    console.log('2. Testing StudyPlan saving...');
    const testPlan = await StudyPlan.create({
      userId: testUserId,
      subjects: 'Math, Science',
      days: 7,
      planContent: 'Day 1: Math...\nDay 2: Science...'
    });
    console.log(`✅ StudyPlan saved successfully with ID: ${testPlan.id}`);

    console.log('3. Testing CodeQuery saving...');
    const testQuery = await CodeQuery.create({
      userId: testUserId,
      question: 'How do I center a div?',
      aiResponse: 'You can use flexbox or grid...',
      language: 'English'
    });
    console.log(`✅ CodeQuery saved successfully with ID: ${testQuery.id}`);

    console.log('4. Verifying data retrieval...');
    const fetchedUser = await User.findByPk(testUserId, {
      include: [
        { model: StudyPlan, as: 'studyPlans' },
        { model: CodeQuery, as: 'codeQueries' }
      ]
    });

    if (fetchedUser && fetchedUser.studyPlans.length > 0 && fetchedUser.codeQueries.length > 0) {
      console.log('✅ All data retrieved successfully from the database!');
      console.log(`Fetched User: ${fetchedUser.name}, StudyPlans: ${fetchedUser.studyPlans.length}, CodeQueries: ${fetchedUser.codeQueries.length}`);
    } else {
      console.error('❌ Failed to retrieve some data from the database.');
    }

  } catch (error) {
    console.error('❌ Error during testing:', error);
  } finally {
    if (testUserId) {
      console.log('5. Cleaning up test data...');
      try {
        await CodeQuery.destroy({ where: { userId: testUserId } });
        await StudyPlan.destroy({ where: { userId: testUserId } });
        await User.destroy({ where: { id: testUserId } });
        console.log('✅ Cleanup successful.');
      } catch (cleanupError) {
        console.error('❌ Error during cleanup:', cleanupError);
      }
    }
    await sequelize.close();
    console.log('--- Database Save Test Finished ---');
  }
}

testDatabaseSaving();
