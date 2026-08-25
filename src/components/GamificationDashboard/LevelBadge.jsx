import React from 'react';
import { getLevelTitle } from '../../core/gamification/xpEngine';
import './LevelBadge.css';

export default function LevelBadge({ level, percentage }) {
  const title = getLevelTitle(level);
  
  return (
    <div className="level-badge">
      <div className="level-ring">
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" className="ring-bg" />
          <circle 
            cx="50" cy="50" r="45" 
            className="ring-progress" 
            style={{ strokeDasharray: `${percentage * 2.83} 283` }} 
          />
        </svg>
        <div className="level-number">
          {level}
        </div>
      </div>
      <div className="level-info">
        <span className="level-label">Level {level}</span>
        <span className="level-title">{title}</span>
      </div>
    </div>
  );
}
