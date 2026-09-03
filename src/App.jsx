import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { StudyPlanner } from './pages/StudyPlanner';
import { CodeTutor } from './pages/CodeTutor';
import { Profile } from './pages/Profile';
import { PublicProfile } from './pages/PublicProfile';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ChatWidget } from './components/ChatWidget';

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/study-planner" element={<ProtectedRoute><StudyPlanner /></ProtectedRoute>} />
        <Route path="/code-tutor" element={<ProtectedRoute><CodeTutor /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/u/:username" element={<PublicProfile />} />
      </Routes>
      <ChatWidget />
    </BrowserRouter>
  );
};

export default App;
