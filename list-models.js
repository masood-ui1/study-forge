import dotenv from 'dotenv';
dotenv.config();

async function listModels() {
  try {
    // There is no explicit listModels method in some versions of the SDK, 
    // but let's try using REST API directly with the key
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  }
}

listModels();
