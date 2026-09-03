import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { User, Calendar, FileText, MessageSquareText, Activity, Copy, Check } from 'lucide-react';
import api from '../api/axios';
import { motion } from 'framer-motion';

export const Profile = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [usernameInput, setUsernameInput] = useState('');
  const [isClaiming, setIsClaiming] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/api/profile/stats');
      setStats(data);
    } catch (error) {
      alert(`Error fetching profile stats: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleClaimUsername = async (e) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;
    
    setIsClaiming(true);
    try {
      await api.put('/api/profile/username', { username: usernameInput });
      await fetchStats();
      setUsernameInput('');
    } catch (error) {
      alert(`Error claiming username: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsClaiming(false);
    }
  };

  const copyPublicLink = () => {
    const url = `${window.location.origin}/u/${stats.username}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  if (isLoading) {
    return (
      <div className="app-container">
        <Navbar />
        <main className="main-content flex justify-center items-center">
          <span className="spinner"></span>
        </main>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <motion.section 
          className="page-header"
          initial="hidden"
          animate="show"
          variants={itemVariants}
        >
          <div>
            <p className="eyebrow">Your StudyForge Identity</p>
            <h1>{stats.name}</h1>
            <p className="flex items-center gap-2 mt-2" style={{ color: 'var(--text-muted)' }}>
              <User size={16} /> {stats.email}
            </p>
            <p className="flex items-center gap-2 mt-1" style={{ color: 'var(--text-muted)' }}>
              <Calendar size={16} /> Member since {new Date(stats.memberSince).toLocaleDateString()}
            </p>
          </div>
        </motion.section>

        <div className="workspace-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <motion.div variants={containerVariants} initial="hidden" animate="show">
            <motion.div variants={itemVariants} style={{ height: '100%' }}>
              <Card style={{ height: '100%' }}>
                <div className="section-title">
                  <Activity size={20} />
                  <h2>Activity Stats</h2>
                </div>
                
                <div style={{ display: 'grid', gap: '1.5rem', marginTop: '1.5rem' }}>
                  <div className="plan-row" style={{ padding: '1rem' }}>
                    <FileText size={20} />
                    <div>
                      <strong style={{ fontSize: '1.25rem' }}>{stats.totalPlans}</strong>
                      <p>Total Study Plans</p>
                    </div>
                  </div>
                  
                  <div className="plan-row" style={{ padding: '1rem' }}>
                    <MessageSquareText size={20} />
                    <div>
                      <strong style={{ fontSize: '1.25rem' }}>{stats.totalQueries}</strong>
                      <p>Total Code Questions</p>
                    </div>
                  </div>

                  <div className="plan-row" style={{ padding: '1rem' }}>
                    <Activity size={20} />
                    <div>
                      <strong style={{ fontSize: '1.25rem' }}>{stats.mostActiveDay}</strong>
                      <p>Most Active Day</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>

          <motion.div variants={containerVariants} initial="hidden" animate="show">
            <motion.div variants={itemVariants} style={{ height: '100%' }}>
              <Card style={{ height: '100%' }}>
                <div className="section-title">
                  <User size={20} />
                  <h2>Public Profile</h2>
                </div>

                <div style={{ marginTop: '1.5rem' }}>
                  {stats.username ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ padding: '1.5rem', background: 'var(--bg-soft)', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Your public link</p>
                        <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>studyforge.com/u/{stats.username}</strong>
                      </div>
                      <Button onClick={copyPublicLink} className="btn-full flex items-center justify-center gap-2">
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                        {copied ? 'Copied!' : 'Copy public link'}
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleClaimUsername}>
                      <p style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>Claim a unique username to share your learning stats publicly.</p>
                      <Input
                        label="Choose a Username"
                        id="username"
                        placeholder="e.g. johndoe"
                        required
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase())}
                      />
                      <Button type="submit" className="btn-full mt-4 btn-primary" disabled={isClaiming}>
                        {isClaiming ? <span className="spinner" /> : 'Claim Username'}
                      </Button>
                    </form>
                  )}
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};
