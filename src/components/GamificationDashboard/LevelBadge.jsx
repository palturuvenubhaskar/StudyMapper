import React from 'react';
import { getLevelTitle } from '../../core/gamification/xpEngine';
import './LevelBadge.css';

export default function LevelBadge({ level, percentage, progress }) {
  const title = getLevelTitle(level);
  
  return (
    <div className="level-badge-premium">
      <div className="level-orb">
        <svg viewBox="0 0 100 100" className="level-svg">
          <defs>
            <linearGradient id="orbGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="46" className="orb-bg" />
          <circle 
            cx="50" cy="50" r="46" 
            className="orb-progress" 
            style={{ strokeDasharray: `${percentage * 2.89} 289`, stroke: 'url(#orbGradient)' }} 
          />
        </svg>
        <div className="level-number-display">
          {level}
        </div>
      </div>
      <div className="level-info-display">
        <span className="level-label-text">Level {level}</span>
        <span className="level-title-text">{title}</span>
        
        {progress && (
          <div className="gamification-xp-inline">
             <div className="xp-bar-container-inline">
               <div className="xp-bar-fill-inline" style={{ width: `${progress.percentage}%` }}></div>
             </div>
             <span className="xp-text-inline">{progress.xpIntoCurrentLevel} / {progress.xpNeeded} XP to next level</span>
          </div>
        )}
      </div>
    </div>
  );
}
