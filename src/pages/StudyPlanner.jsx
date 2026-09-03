import React, { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { CalendarDays, CheckCircle2, Clock, History, Sparkles } from 'lucide-react';
import api from '../api/axios';
import { motion } from 'framer-motion';

const normalizePlanContent = (planContent) => {
  if (Array.isArray(planContent)) return planContent;

  try {
    return JSON.parse(planContent || '[]');
  } catch {
    return [];
  }
};

export const StudyPlanner = () => {
  const [subjects, setSubjects] = useState('');
  const [days, setDays] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [planData, setPlanData] = useState(null);
  const [pastPlans, setPastPlans] = useState([]);
  const [expandedPlanId, setExpandedPlanId] = useState(null);

  const fetchPastPlans = async () => {
    try {
      setIsLoadingPlans(true);
      const { data } = await api.get('/api/study-plan');
      setPastPlans(data);
    } catch (error) {
      alert(`Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsLoadingPlans(false);
    }
  };

  useEffect(() => {
    fetchPastPlans();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const { data } = await api.post('/api/study-plan', {
        subjects,
        days: Number(days),
        hoursPerDay: Number(hoursPerDay),
      });

      setPlanData(data.plan.planContent);
      setSubjects('');
      setDays('');
      setHoursPerDay('');
      await fetchPastPlans();
    } catch (error) {
      alert(`Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderPlanCards = (items, embedded = false) => (
    <div className={embedded ? 'embedded-plan-list' : 'result-list'}>
      {items.map((dayPlan, index) => (
        <motion.div 
          key={`${dayPlan.day}-${index}`} 
          className={embedded ? 'embedded-plan-item' : 'plan-card card'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <div className="plan-card-header">
            <div className="mini-icon">
              <CalendarDays size={18} />
            </div>
            <h3>Day {dayPlan.day || index + 1}</h3>
          </div>
          <div className="plan-row">
            <CheckCircle2 size={17} />
            <div>
              <strong>Topics</strong>
              <p>{dayPlan.topics}</p>
            </div>
          </div>
          <div className="plan-row">
            <CheckCircle2 size={17} />
            <div>
              <strong>Focus Areas</strong>
              <p>{dayPlan.focusAreas}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <motion.section 
          className="page-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <p className="eyebrow">AI study operations</p>
            <h1>Study Planner</h1>
            <p>Generate a focused day-by-day plan, then revisit past plans as your schedule evolves.</p>
          </div>
          <div className="header-stat">
            <Clock size={18} />
            <span>{pastPlans.length} saved plans</span>
          </div>
        </motion.section>

        <div className="workspace-grid">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="panel-card">
              <div className="section-title">
                <Sparkles size={20} />
                <h2>Configuration</h2>
              </div>
              <form onSubmit={handleGenerate}>
                <Input
                  label="Subjects / Topics to Learn"
                  id="subjects"
                  placeholder="e.g. React, Node.js, System Design"
                  required
                  value={subjects}
                  onChange={(e) => setSubjects(e.target.value)}
                />
                <Input
                  label="Number of Days"
                  id="days"
                  type="number"
                  min="1"
                  max="90"
                  placeholder="7"
                  required
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                />
                <Input
                  label="Hours per Day"
                  id="hours"
                  type="number"
                  min="1"
                  max="24"
                  placeholder="3"
                  required
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(e.target.value)}
                />

                <Button type="submit" className="btn-full mt-4 btn-primary" disabled={isGenerating}>
                  {isGenerating && <span className="spinner" />}
                  {isGenerating ? 'Generating Plan...' : 'Generate Plan'}
                </Button>
              </form>
            </Card>
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="section-title">
              <CalendarDays size={20} />
              <h2>Your Study Plan</h2>
            </div>
            {planData ? (
              renderPlanCards(planData)
            ) : (
              <Card className="empty-state">
                <Sparkles size={24} />
                <p>Your generated plan will appear here.</p>
              </Card>
            )}
          </motion.section>
        </div>

        <motion.section 
          className="history-section"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <div className="section-title">
            <History size={20} />
            <h2>Past Plans</h2>
          </div>
          {isLoadingPlans ? (
            <Card className="empty-state">
              <span className="spinner" />
              <p>Loading past plans...</p>
            </Card>
          ) : pastPlans.length > 0 ? (
            <div className="history-list">
              {pastPlans.map((plan) => {
                const isExpanded = expandedPlanId === plan.id;
                const content = normalizePlanContent(plan.planContent);

                return (
                  <Card
                    key={plan.id}
                    className="history-card clickable"
                    onClick={() => setExpandedPlanId(isExpanded ? null : plan.id)}
                  >
                    <div className="history-card-top">
                      <div>
                        <h3>{plan.subjects}</h3>
                        <p>{plan.days} days - {new Date(plan.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span>{isExpanded ? 'Hide' : 'Expand'}</span>
                    </div>
                    {isExpanded && renderPlanCards(content, true)}
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="empty-state">
              <p>No previous plans yet.</p>
            </Card>
          )}
        </motion.section>
      </main>
    </div>
  );
};
