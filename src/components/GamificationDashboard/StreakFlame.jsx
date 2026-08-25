import React from 'react';
import { Flame } from 'lucide-react';
import './StreakFlame.css';

export default function StreakFlame({ streakDays, longestStreak }) {
  const isActive = streakDays > 0;
  const isHot = streakDays >= 3;
  
  return (
    <div className={`streak-flame-container ${isActive ? 'active' : ''} ${isHot ? 'hot' : ''}`}>
      <div className="streak-icon-wrapper">
        <Flame size={32} className="streak-icon" />
      </div>
      <div className="streak-stats">
        <span className="streak-count">{streakDays} Day Streak</span>
        <span className="longest-streak">Best: {longestStreak} Days</span>
      </div>
    </div>
  );
}
