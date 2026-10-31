import React from 'react';
import { getLevelTitle } from '../../core/gamification/xpEngine';
import './LevelBadge.css';

export default function LevelBadge({ level, percentage, progress }) {
  const title = getLevelTitle(level);
  const remaining = progress ? Math.max(0, progress.xpNeeded - progress.xpIntoCurrentLevel) : 0;

  return (
    <div className="level-badge-premium">
      <div className="level-orb">
        <svg viewBox="0 0 100 100" className="level-svg" aria-hidden="true">
          <defs>
            <linearGradient id="orbGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="45" className="orb-bg" />
          <circle
            cx="50" cy="50" r="45"
            className="orb-progress"
            style={{ strokeDasharray: `${percentage * 2.83} 283`, stroke: 'url(#orbGradient)' }}
          />
        </svg>
        <span className="level-number-display" aria-label={`Level ${level}`}>{level}</span>
      </div>
      <div className="level-info-display">
        <span className="level-label-text">Level {level}</span>
        <span className="level-title-text">{title}</span>

        {progress && (
          <div className="gamification-xp-inline">
            <div
              className="xp-bar-container-inline"
              role="progressbar"
              aria-valuenow={progress.percentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Progress to level ${level + 1}`}
            >
              <div className="xp-bar-fill-inline" style={{ width: `${progress.percentage}%` }} />
            </div>
            <span className="xp-text-inline">
              <span className="tabular-nums">{progress.xpIntoCurrentLevel} / {progress.xpNeeded} XP</span>
              <span>{remaining} XP to level {level + 1}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
