import { useState } from 'react';
import { Sparkles } from 'lucide-react';

export default function ProfileSetup({ onSubmit, loading, existingProfile }) {
  const [topic, setTopic] = useState(existingProfile?.career_goal || '');

  return (
    <div className="profile-setup glass-card">
      <div className="setup-header">
        <Sparkles size={32} color="var(--accent)" />
        <h2>Create a Custom Roadmap</h2>
        <p>Tell us what you want to learn. We will build a custom curriculum for you!</p>
      </div>

      <div className="setup-form">
        <div className="form-group">
          <textarea
            className="input"
            rows="4"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="e.g. I want to become a full stack web3 developer, or I want to master AI and Machine Learning..."
          />
        </div>

        <button 
          className="btn btn-primary btn-lg" 
          onClick={() => onSubmit({ career_goal: topic })} 
          disabled={!topic.trim() || loading}
        >
          {loading ? (
            <><div className="spinner" style={{ width: 18, height: 18 }}></div> Generating Roadmap...</>
          ) : (
            <><Sparkles size={18} /> Generate My Roadmap</>
          )}
        </button>
      </div>
    </div>
  );
}
