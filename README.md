# StudyForge 📚

StudyForge is an AI-powered study companion that helps learners plan their study schedule and get instant, beginner-friendly coding help. Built with a Node.js/Express backend and a sleek React frontend, it uses Google's Gemini AI to generate personalized study plans and explain code in plain language.

## 🚀 Features

- **AI Study Planner:** Enter your subjects, available days, and hours per day — Gemini generates a day-by-day study schedule tailored to you.
- **AI Code Tutor:** Paste code or ask a question, get a clear, beginner-friendly explanation — with **voice input** and **multi-language support** (English, Hindi, Kannada).
- **Personal History:** Every study plan and code query is saved to your account, so you can revisit past sessions anytime.
- **Achievement Badges:** Unlock badges (First Steps, Study Master, Code Wizard, and more) as you use the app — visible on your profile.
- **Public Shareable Profile:** Claim a username and share a public profile page (`/u/username`) showcasing your stats and earned badges.
- **AI Study Buddy Chat Widget:** A floating AI assistant available on every page for quick study or coding help.
- **Premium UI:** A sharp, minimal black-and-white editorial design system with subtle parallax and scroll animations, built in React with Framer Motion.

## 🛠️ Technology Stack

- **Frontend:** React, Vite, React Router DOM, Axios, Framer Motion, React Hot Toast, lucide-react
- **Backend:** Node.js, Express.js
- **Database:** MySQL, Sequelize ORM
- **Authentication:** JSON Web Tokens (JWT), bcrypt
- **AI Integration:** `@google/generative-ai` (Gemini 1.5 Flash)

## 📁 Project Structure

```text
studyforge/
├── client/                 # React Frontend Application
│   ├── src/
│   │   ├── api/            # Axios instance and interceptors
│   │   ├── pages/          # React route components (Dashboard, Login, Profile, etc.)
│   │   ├── components/     # Reusable UI (Navbar, ChatWidget, BadgeCard, etc.)
│   │   ├── App.jsx         # Main router and layout
│   │   └── index.css       # Design system CSS variables
│   └── package.json
├── config/                 # Backend Database Configuration
│   └── database.js         # Sequelize instance and DB creation logic
├── controllers/             # Backend Business Logic
│   ├── authController.js    # Registration and Login logic
│   ├── studyPlanController.js # AI study plan generation
│   ├── codeTutorController.js # AI code explanations
│   ├── chatController.js    # Study Buddy chat widget
│   └── profileController.js # Stats, badges, public profile
├── middleware/               # Express Middleware
│   └── verifyToken.js       # JWT validator
├── models/                   # Sequelize Database Models
│   ├── User.js
│   ├── StudyPlan.js
│   ├── CodeQuery.js
│   └── index.js              # Model Associations
├── routes/                   # Express API Routes
├── .env                      # Environment Variables
├── seed.js                   # Database seeding script for demo user
└── server.js                 # Main Express entry point
```

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v18+)
- MySQL Server (running locally)

### 1. Backend Setup

1. Navigate to the root directory (`/studyforge`).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your environment variables in `.env`:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD="your_mysql_password"
   DB_NAME=studyforge_db
   JWT_SECRET=your_jwt_secret_here
   PORT=5000
   GEMINI_API_KEY=your_google_gemini_api_key
   ```
4. Seed the database (auto-creates the database, syncs tables, and creates a demo user):
   ```bash
   node seed.js
   ```
5. Start the backend server:
   ```bash
   node server.js
   ```
   *The backend will run on `http://localhost:5000`.*

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173`.*

## 🧪 Demo Credentials

If you ran the `seed.js` script, you can log in with:

- **Demo User:** `demo@studyforge.com` / `demo1234`

## 📝 Notes

- Voice input for the Code Tutor works best in Chrome or Edge (uses the browser's built-in Web Speech API).
- Chat history in the Study Buddy widget is session-only and resets on page refresh.
