import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { Calendar, FileText, MessageSquareText, BookOpen } from 'lucide-react';
import api from '../api/axios';
import { motion } from 'framer-motion';

export const PublicProfile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get(`/api/profile/public/${username}`);
        setProfile(data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (username) fetchProfile();
  }, [username]);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (isLoading) {
    return (
      <div className="auth-shell">
        <span className="spinner"></span>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="auth-shell">
        <motion.div initial="hidden" animate="show" variants={itemVariants}>
          <Card className="auth-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Profile not found</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>This user hasn't claimed a profile yet or doesn't exist.</p>
            <Link to="/" style={{ fontWeight: 600 }}>Return Home</Link>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="auth-shell">
      <motion.div 
        className="auth-bg-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ duration: 1 }}
      >
        {profile.username.toUpperCase()}
      </motion.div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={itemVariants}
        className="auth-card"
        style={{ width: 'min(100%, 500px)' }}
      >
        <Card style={{ padding: '3rem 2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{profile.name}</h1>
            <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.75rem' }}>
              @{profile.username}
            </p>
            <p className="flex items-center justify-center gap-2" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <Calendar size={16} /> Member since {new Date(profile.memberSince).toLocaleDateString()}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ padding: '1.5rem', background: 'var(--bg-soft)', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <FileText size={24} style={{ color: 'var(--text-muted)', margin: '0 auto 0.5rem' }} />
              <strong style={{ display: 'block', fontSize: '2rem', lineHeight: 1, marginBottom: '0.25rem' }}>{profile.totalPlans}</strong>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Study Plans</span>
            </div>
            
            <div style={{ padding: '1.5rem', background: 'var(--bg-soft)', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <MessageSquareText size={24} style={{ color: 'var(--text-muted)', margin: '0 auto 0.5rem' }} />
              <strong style={{ display: 'block', fontSize: '2rem', lineHeight: 1, marginBottom: '0.25rem' }}>{profile.totalQueries}</strong>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Code Queries</span>
            </div>
          </div>

          <div style={{ textAlign: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <Link to="/" className="flex items-center justify-center gap-2" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', transition: 'color 0.2s ease' }}>
              <BookOpen size={16} />
              Powered by StudyForge
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
