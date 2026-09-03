import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ArrowRight, Calendar, Code2, Flame, ShieldCheck, Sparkles } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

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
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <div className="app-container" ref={containerRef} style={{ position: 'relative', overflow: 'hidden' }}>
      <motion.div 
        style={{ y, position: 'absolute', top: '10%', right: '-5%', fontSize: '30vw', fontWeight: 900, color: '#F5F5F5', zIndex: -1, pointerEvents: 'none', letterSpacing: '-0.05em', whiteSpace: 'nowrap' }}
      >
        FORGE
      </motion.div>

      <Navbar />
      <main className="main-content">
        <motion.section 
          className="dashboard-hero"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemVariants}>
            <p className="eyebrow">StudyForge command center</p>
            <h1>Build the next focused study session{user?.name ? `, ${user.name.split(' ')[0]}` : ''}.</h1>
            <p>Generate plans, debug concepts, and keep your learning history in one clean AI workspace.</p>
          </motion.div>
          <motion.div className="hero-actions" variants={itemVariants}>
            <Button onClick={() => navigate('/study-planner')}>
              Plan Study Time
              <ArrowRight size={18} />
            </Button>
            <Button variant="secondary" onClick={() => navigate('/code-tutor')}>
              Ask Code Tutor
            </Button>
          </motion.div>
        </motion.section>

        <motion.section 
          className="metric-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={itemVariants}>
            <Card className="metric-card">
              <Sparkles size={20} />
              <span>AI-assisted</span>
              <strong>Plans and explanations</strong>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card className="metric-card">
              <ShieldCheck size={20} />
              <span>Private workspace</span>
              <strong>Token-protected routes</strong>
            </Card>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card className="metric-card">
              <Flame size={20} />
              <span>Daily momentum</span>
              <strong>History that compounds</strong>
            </Card>
          </motion.div>
        </motion.section>

        <motion.section 
          className="feature-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={itemVariants} style={{ height: '100%' }}>
            <Card onClick={() => navigate('/study-planner')} className="feature-card clickable">
              <div className="feature-icon">
                <Calendar size={30} />
              </div>
              <div>
                <h2>Study Planner</h2>
                <p>Turn a broad goal into a clear day-by-day schedule with topics and focus areas.</p>
              </div>
              <ArrowRight size={24} />
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} style={{ height: '100%' }}>
            <Card onClick={() => navigate('/code-tutor')} className="feature-card clickable">
              <div className="feature-icon">
                <Code2 size={30} />
              </div>
              <div>
                <h2>Code Tutor</h2>
                <p>Paste code or ask a programming question and get a readable AI explanation.</p>
              </div>
              <ArrowRight size={24} />
            </Card>
          </motion.div>
        </motion.section>
      </main>
    </div>
  );
};
