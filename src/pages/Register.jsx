import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import api from '../api/axios';
import { motion } from 'framer-motion';

export const Register = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
      const { data } = await api.post('/api/auth/register', { name, email, password });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (error) {
      alert(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className="auth-shell">
      <motion.div 
        className="auth-bg-text"
        animate={{ 
          x: `calc(-50% + ${mousePosition.x}px)`, 
          y: `calc(-50% + ${mousePosition.y}px)` 
        }}
        transition={{ type: "spring", damping: 50, stiffness: 400 }}
      >
        STUDY SMARTER
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="auth-card"
      >
        <Card className="w-full">
          <div className="flex flex-col items-center mb-4">
            <h1 className="text-center" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Create Account</h1>
            <p style={{ color: 'var(--text-muted)' }}>Join StudyForge today</p>
          </div>
          
          <form onSubmit={handleRegister}>
            <Input label="Full Name" id="name" type="text" placeholder="John Doe" required />
            <Input label="Email Address" id="email" type="email" placeholder="you@example.com" required />
            <Input label="Password" id="password" type="password" placeholder="••••••••" required />
            
            <div className="mt-4">
              <Button type="submit" className="btn-full btn-primary">Register</Button>
            </div>
          </form>
          
          <div className="text-center mt-4" style={{ fontSize: '0.875rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Already have an account? </span>
            <Link to="/login" style={{ fontWeight: 600 }}>Login here</Link>
          </div>
          
          <div className="demo-note">
            Demo: demo@studyforge.com / demo1234
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
