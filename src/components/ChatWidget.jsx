import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import api from '../api/axios';

export const ChatWidget = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasOpenedBefore, setHasOpenedBefore] = useState(true);
  const messagesEndRef = useRef(null);

  // Hidden on these paths
  const hiddenPaths = ['/login', '/register'];
  const isHidden = hiddenPaths.includes(location.pathname) || location.pathname.startsWith('/u/');

  useEffect(() => {
    const opened = localStorage.getItem('hasOpenedChat');
    if (!opened) {
      setHasOpenedBefore(false);
    }
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  if (isHidden) return null;

  const toggleOpen = () => {
    if (!isOpen && !hasOpenedBefore) {
      localStorage.setItem('hasOpenedChat', 'true');
      setHasOpenedBefore(true);
    }
    setIsOpen(!isOpen);
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const newMsg = { role: 'user', text: inputValue.trim() };
    const updatedMessages = [...messages, newMsg];
    
    setMessages(updatedMessages);
    setInputValue('');
    setIsTyping(true);

    try {
      const history = messages.slice(-6); // last 6 messages for context
      const { data } = await api.post('/api/chat', { 
        message: newMsg.text, 
        history 
      });

      setMessages([...updatedMessages, { role: 'assistant', text: data.reply }]);
    } catch (error) {
      setMessages([...updatedMessages, { role: 'assistant', text: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            style={{
              width: 'min(100vw - 2rem, 360px)',
              height: '480px',
              backgroundColor: 'var(--bg-color)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--border-radius)',
              marginBottom: '1rem',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
            }}
          >
            {/* Header */}
            <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>StudyBuddy</h3>
              </div>
              <button onClick={toggleOpen} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {messages.length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '2rem', fontSize: '0.9rem' }}>
                  <MessageCircle size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
                  <p>Hi! I'm StudyBuddy.</p>
                  <p>Ask me a question to get started.</p>
                </div>
              )}
              
              {messages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '85%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--border-radius)',
                    fontSize: '0.9rem',
                    lineHeight: 1.5,
                    ...(msg.role === 'user' ? {
                      backgroundColor: 'var(--primary)',
                      color: 'var(--bg-color)'
                    } : {
                      backgroundColor: 'var(--bg-color)',
                      color: 'var(--text-main)',
                      border: '1px solid var(--border-color)'
                    })
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--border-radius)',
                    backgroundColor: 'var(--bg-color)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    gap: '4px'
                  }}>
                    <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} style={{ width: '6px', height: '6px', backgroundColor: 'var(--text-muted)', borderRadius: '50%' }} />
                    <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} style={{ width: '6px', height: '6px', backgroundColor: 'var(--text-muted)', borderRadius: '50%' }} />
                    <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} style={{ width: '6px', height: '6px', backgroundColor: 'var(--text-muted)', borderRadius: '50%' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem', backgroundColor: 'var(--bg-soft)' }}>
              <input
                type="text"
                placeholder="Message StudyBuddy..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--border-radius)',
                  backgroundColor: 'var(--bg-color)',
                  color: 'var(--text-main)',
                  outline: 'none',
                  fontSize: '0.9rem'
                }}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                style={{
                  width: '42px',
                  height: '42px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: inputValue.trim() && !isTyping ? 'var(--primary)' : 'var(--bg-color)',
                  color: inputValue.trim() && !isTyping ? 'var(--bg-color)' : 'var(--text-muted)',
                  border: `1px solid ${inputValue.trim() && !isTyping ? 'var(--primary)' : 'var(--border-color)'}`,
                  borderRadius: 'var(--border-radius)',
                  cursor: inputValue.trim() && !isTyping ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease'
                }}
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={toggleOpen}
        animate={!hasOpenedBefore && !isOpen ? { scale: [1, 1.1, 1] } : {}}
        transition={{ repeat: Infinity, duration: 2 }}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--primary)',
          color: 'var(--bg-color)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 51
        }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>
    </div>
  );
};
