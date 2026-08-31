import React from 'react';
import { Flame } from 'lucide-react';
import './StreakFlame.css';

export default function StreakFlame({ streakDays, longestStreak }) {
  const isActive = streakDays > 0;
  const isHot = streakDays >= 3;
  
  return (
    <div className={`streak-flame-premium ${isActive ? 'active' : ''} ${isHot ? 'hot' : ''}`}>
      <div className="streak-flame-icon-box">
        <Flame size={28} className="flame-svg" fill={isActive ? 'currentColor' : 'none'} />
      </div>
      <div className="streak-flame-text-box">
        <span className="streak-flame-count">{streakDays} Day Streak</span>
        <span className="streak-flame-best">Best: {longestStreak} Days</span>
      </div>
    </div>
  );
}
