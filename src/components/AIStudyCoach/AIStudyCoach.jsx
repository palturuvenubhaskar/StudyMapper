import React, { useState, useEffect } from 'react';
import { generateMorningDigest } from '../../core/analytics/morningDigest';
import { GraduationCap, X, Sparkles, AlertCircle, MessageCircle, ChevronUp, ChevronDown } from 'lucide-react';
import './AIStudyCoach.css';

export default function AIStudyCoach({ userId = 'guest' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [digest, setDigest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const morningData = await generateMorningDigest(userId);
      if (morningData) {
        setDigest(morningData);
        setIsOpen(true); // Pop open if there's a morning digest
      }
      setLoading(false);
    })();
  }, [userId]);

  if (loading) return null;

  return (
    <div className={`ai-study-coach ${isOpen ? 'open' : 'closed'}`}>
      {/* Floating Toggle Button */}
      <button 
        className="coach-toggle-btn" 
        onClick={() => setIsOpen(!isOpen)}
        title="AI Study Coach"
      >
        <GraduationCap size={24} />
        {digest && !isOpen && <span className="coach-notification-dot"></span>}
      </button>

      {/* The Coach Panel */}
      <div className="coach-panel">
        <div className="coach-header">
          <div className="coach-title">
            <GraduationCap size={20} className="text-accent" />
            <span>Study Coach</span>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={() => setIsOpen(false)}>
            <X size={18} />
          </button>
        </div>
        
        <div className="coach-content">
          {digest ? (
            <div className="coach-message">
              <p className="coach-greeting">Good Morning! ☀️</p>
              <p>You are on a <strong>{digest.streakDays}-day streak!</strong> Let's keep it going.</p>
              
              {digest.weakTopics.length > 0 && (
                <div className="coach-alert">
                  <div className="coach-alert-header">
                    <AlertCircle size={16} />
                    <span>Focus Areas</span>
                  </div>
                  <p>Based on your recent analytics, you seem to be struggling with:</p>
                  <ul>
                    {digest.weakTopics.map((w, i) => (
                      <li key={i}>{w.title}</li>
                    ))}
                  </ul>
                  <button className="btn btn-primary btn-sm mt-2 w-full">Review Now</button>
                </div>
              )}

              {digest.incompleteQuests.length > 0 && (
                <div className="coach-quests">
                  <p><strong>Today's Priority Quest:</strong></p>
                  <p className="flex-center gap-2">
                    <Sparkles size={16} className="text-warning" />
                    {digest.incompleteQuests[0].title}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="coach-message">
              <p>Hi there! I'm your AI Study Coach.</p>
              <p>I analyze your learning patterns in the background to suggest what you should study next.</p>
              <div className="coach-suggestions mt-4">
                <button className="btn btn-secondary btn-sm w-full mb-2">
                  <MessageCircle size={14} className="mr-2" /> Ask a Question
                </button>
                <button className="btn btn-secondary btn-sm w-full">
                  <Sparkles size={14} className="mr-2" /> Generate Study Plan
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
