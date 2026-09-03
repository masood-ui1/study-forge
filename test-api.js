import dotenv from 'dotenv';

dotenv.config();

const API_BASE_URL = (
  process.env.API_BASE_URL ||
  process.env.VITE_API_BASE_URL ||
  `http://localhost:${process.env.PORT || 5000}`
).replace(/\/$/, '');

const test = async () => {
  try {
    const loginRes = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'demo@studyforge.com', password: 'demo1234' })
    });
    const loginData = await loginRes.json();
    console.log('Login Response:', loginRes.status, loginData);

    if (loginData.token) {
      const planRes = await fetch(`${API_BASE_URL}/api/study-plan`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loginData.token}`
        },
        body: JSON.stringify({ subjects: 'React', days: 2, hoursPerDay: 2 })
      });
      const planData = await planRes.json();
      console.log('Plan Response:', planRes.status, planData);
    }
  } catch (err) {
    console.error(err);
  }
};
test();
