import React from 'react';
import { Flame, Shield } from 'lucide-react';
import './StreakFlame.css';

export default function StreakFlame({ streakDays, longestStreak, freezesRemaining = 0 }) {
  const isActive = streakDays > 0;
  const isHot = streakDays >= 3;

  return (
    <div className={`streak-flame-premium ${isActive ? 'active' : ''} ${isHot ? 'hot' : ''}`}>
      <span className="streak-flame-icon-box" aria-hidden="true">
        <Flame size={20} className="flame-svg" fill={isActive ? 'currentColor' : 'none'} />
      </span>
      <div className="streak-flame-text-box">
        <div className="streak-flame-top-row">
          <span className="streak-flame-count">{streakDays} day streak</span>
          {freezesRemaining > 0 && (
            <span
              className="streak-freeze-tag"
              title="Streak freeze protects your streak for one missed day"
            >
              <Shield size={10} aria-hidden="true" /> {freezesRemaining}
            </span>
          )}
        </div>
        <span className="streak-flame-best">Best {longestStreak} days</span>
      </div>
    </div>
  );
}
