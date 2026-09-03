import React, { useEffect, useState, useRef } from 'react';
import { Navbar } from '../components/Navbar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Code2, History, MessageSquareText, Sparkles, Terminal, Mic } from 'lucide-react';
import api from '../api/axios';
import { motion } from 'framer-motion';

const FormattedAnswer = ({ text }) => {
  const parts = String(text || '').split(/```/g);

  return (
    <div className="ai-response">
      {parts.map((part, index) => {
        if (index % 2 === 1) {
          const code = part.replace(/^[a-zA-Z0-9_-]+\n/, '');

          return (
            <pre key={index} className="code-block">
              <code>{code.trim()}</code>
            </pre>
          );
        }

        return (
          <p key={index} className="answer-text">
            {part.trim()}
          </p>
        );
      })}
    </div>
  );
};

export const CodeTutor = () => {
  const [question, setQuestion] = useState('');
  const [language, setLanguage] = useState('English');
  const [isAsking, setIsAsking] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [response, setResponse] = useState(null);
  const [history, setHistory] = useState([]);
  const [expandedQueryId, setExpandedQueryId] = useState(null);
  
  // Speech Recognition state
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check for speech recognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + ' ';
          }
        }
        if (finalTranscript) {
          setQuestion((prev) => prev + (prev.endsWith(' ') || prev === '' ? '' : ' ') + finalTranscript.trim());
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (!speechSupported || !recognitionRef.current) return;
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error("Could not start speech recognition:", e);
      }
    }
  };

  const fetchHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const { data } = await api.get('/api/code-tutor');
      setHistory(data);
    } catch (error) {
      alert(`Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleAsk = async () => {
    if (!question.trim()) return;
    
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setIsAsking(true);

    try {
      const { data } = await api.post('/api/code-tutor', { question, language });

      setResponse(data.query.aiResponse);
      setQuestion('');
      await fetchHistory();
    } catch (error) {
      alert(`Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsAsking(false);
    }
  };

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
            <p className="eyebrow">AI coding support</p>
            <h1>Code Tutor</h1>
            <p>Ask a programming question, paste a snippet, and get a clear explanation from your tutor.</p>
          </div>
          <div className="header-stat">
            <MessageSquareText size={18} />
            <span>{history.length} saved questions</span>
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
                <Terminal size={20} />
                <h2>Your Code / Question</h2>
              </div>

              <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <textarea
                  className="code-input"
                  style={{ marginBottom: 0 }}
                  placeholder="Paste code or ask: Why does this React state update not show immediately?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
                
                {speechSupported && (
                  <button 
                    onClick={toggleListening}
                    style={{
                      position: 'absolute',
                      bottom: '1rem',
                      right: '1rem',
                      background: isListening ? '#fca5a5' : 'var(--bg-soft)',
                      color: isListening ? '#ef4444' : 'var(--text-muted)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isListening ? '0 0 0 4px rgba(239, 68, 68, 0.2)' : 'none'
                    }}
                    title={isListening ? "Stop listening" : "Start speaking"}
                  >
                    {isListening ? (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <Mic size={18} />
                      </motion.div>
                    ) : (
                      <Mic size={18} />
                    )}
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--border-radius)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: 'var(--bg-color)',
                    color: 'var(--text-main)',
                    fontSize: '0.95rem',
                    outline: 'none',
                    minWidth: '120px',
                    fontFamily: 'inherit',
                    cursor: 'pointer'
                  }}
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Kannada">Kannada</option>
                </select>

                <Button className="w-full flex items-center justify-center gap-2 btn-primary" onClick={handleAsk} disabled={isAsking || !question.trim()}>
                  {isAsking ? <span className="spinner" /> : <Sparkles size={18} />}
                  {isAsking ? 'Analyzing...' : 'Ask AI Tutor'}
                </Button>
              </div>
            </Card>
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="section-title">
              <Code2 size={20} />
              <h2>AI Explanation</h2>
            </div>
            {response ? (
              <Card className="response-card">
                <FormattedAnswer text={response} />
              </Card>
            ) : (
              <Card className="empty-state">
                <Sparkles size={24} />
                <p>Your tutor response will appear here.</p>
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
            <h2>History</h2>
          </div>
          {isLoadingHistory ? (
            <Card className="empty-state">
              <span className="spinner" />
              <p>Loading history...</p>
            </Card>
          ) : history.length > 0 ? (
            <div className="history-list">
              {history.map((item) => {
                const isExpanded = expandedQueryId === item.id;

                return (
                  <Card
                    key={item.id}
                    className="history-card clickable"
                    onClick={() => setExpandedQueryId(isExpanded ? null : item.id)}
                  >
                    <div className="history-card-top">
                      <div>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                          {item.question}
                          {item.language && item.language !== 'English' && (
                            <span style={{ 
                              fontSize: '0.7rem', 
                              padding: '2px 6px', 
                              background: 'var(--border-color)', 
                              borderRadius: '4px',
                              textTransform: 'uppercase',
                              fontWeight: 600,
                              letterSpacing: '0.05em'
                            }}>
                              {item.language}
                            </span>
                          )}
                        </h3>
                        <p>{new Date(item.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span>{isExpanded ? 'Hide' : 'Expand'}</span>
                    </div>
                    {isExpanded && <FormattedAnswer text={item.aiResponse} />}
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="empty-state">
              <p>No previous questions yet.</p>
            </Card>
          )}
        </motion.section>
      </main>
    </div>
  );
};
