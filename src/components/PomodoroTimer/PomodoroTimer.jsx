import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';
import { db } from '../../data/db';
import { v4 as uuidv4 } from 'uuid';
import { awardXP } from '../../core/gamification/xpEngine';
import { updateQuestProgress } from '../../core/gamification/dailyQuests';
import { checkAchievements } from '../../core/gamification/achievementChecker';
import { logEvent } from '../../core/analytics/tracker';
import './PomodoroTimer.css';

const DEFAULT_TIME = 25 * 60; // 25 minutes

export default function PomodoroTimer({ topicId }) {
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      // Log session
      if (topicId) {
        db.study_sessions.add({
          id: uuidv4(),
          topic_id: topicId,
          duration_minutes: 25,
          created_at: new Date().toISOString()
        }).then(async () => {
          await awardXP('guest', 30, 'pomodoro');
          await updateQuestProgress('guest', 'pomodoro', 1);
          await checkAchievements('guest');
          await logEvent('guest', topicId, 'pomodoro_complete', 25 * 60, null);
        }).catch(console.error);
      }
      // Play sound or show toast here
      alert("Pomodoro session complete!");
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, topicId]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(DEFAULT_TIME);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="pomodoro-timer">
      <div className="pomodoro-header">
        <Timer size={16} />
        <span>Focus Timer</span>
      </div>
      <div className="pomodoro-display">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      <div className="pomodoro-controls">
        <button onClick={toggleTimer} className="pomodoro-btn play-pause">
          {isActive ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <button onClick={resetTimer} className="pomodoro-btn reset">
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  );
}
