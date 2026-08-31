import React, { useEffect, useState } from 'react';
import { getGamificationProfile, getXPProgress } from '../../core/gamification/xpEngine';
import { getOrCreateDailyQuests } from '../../core/gamification/dailyQuests';
import { db } from '../../data/db';
import LevelBadge from './LevelBadge';
import StreakFlame from './StreakFlame';
import { Target, CheckCircle2, Circle, Trophy, Share2 } from 'lucide-react';
import { ACHIEVEMENTS } from '../../core/gamification/achievements';
import { useToast } from '../ToastProvider/ToastProvider';
import './GamificationDashboard.css';

export default function GamificationDashboard({ userId = 'guest' }) {
  const [profile, setProfile] = useState(null);
  const [quests, setQuests] = useState([]);
  const [recentAchievements, setRecentAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    setLoading(true);
    const p = await getGamificationProfile(userId);
    setProfile(p);
    
    const daily = await getOrCreateDailyQuests(userId);
    setQuests(daily.quests || []);

    const userAchievements = await db.achievements.where('user_id').equals(userId).reverse().limit(3).toArray();
    const hydrated = userAchievements.map(ua => {
      const template = ACHIEVEMENTS.find(a => a.id === ua.achievement_id);
      return { ...ua, ...template };
    });
    setRecentAchievements(hydrated);
    
    setLoading(false);
  };

  const toast = useToast();

  if (loading || !profile) {
    return <div className="gamification-loading"><div className="spinner"></div></div>;
  }

  const progress = getXPProgress(profile.total_xp, profile.current_level);

  const handleShare = async () => {
    const text = `I'm on a 🔥 ${profile.streak_days}-day study streak on StudyMapper with ${profile.total_xp} XP! Can you beat me?`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My StudyMapper Progress',
          text: text,
        });
      } catch (err) {
        console.error('Error sharing', err);
      }
    } else {
      navigator.clipboard.writeText(text);
      toast('Progress copied to clipboard!', 'success');
    }
  };

  return (
    <div className="gamification-dashboard">
      <div className="gamification-header premium-card">
        <div className="gamification-header-content">
          <div className="gamification-level-section">
            <LevelBadge level={profile.current_level} percentage={progress.percentage} progress={progress} />
          </div>
          
          <div className="gamification-streak-section">
            <StreakFlame streakDays={profile.streak_days} longestStreak={profile.longest_streak} />
            <button className="btn btn-ghost btn-icon share-btn" onClick={handleShare} title="Share My Progress">
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="gamification-panels">
        {/* Daily Quests */}
        <div className="gamification-panel quests-panel">
          <h3><Target size={18} /> Daily Quests</h3>
          <div className="quests-list">
            {quests.map((q, idx) => (
              <div key={idx} className={`premium-quest-card ${q.completed ? 'completed' : ''}`}>
                <div className="quest-header">
                  <div className="quest-icon-wrapper">
                    {q.completed ? <CheckCircle2 size={20} className="quest-icon completed-icon" /> : <Circle size={20} className="quest-icon pending-icon" />}
                  </div>
                  <div className="quest-header-text">
                    <span className="quest-title">{q.title}</span>
                    <span className="quest-progress-text">{q.progress} / {q.target}</span>
                  </div>
                </div>
                <div className="quest-progress-container">
                  <div className="quest-progress-fill" style={{ width: `${(q.progress / q.target) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="gamification-panel achievements-panel">
          <h3><Trophy size={18} /> Recent Achievements</h3>
          {recentAchievements.length === 0 ? (
            <p className="no-achievements">No achievements yet. Keep studying!</p>
          ) : (
            <div className="achievements-list">
              {recentAchievements.map(ach => (
                <div key={ach.id} className="achievement-item">
                  <div className="achievement-icon-wrapper">
                    <Trophy size={24} className="text-accent" />
                  </div>
                  <div className="achievement-info">
                    <span className="achievement-title">{ach.title}</span>
                    <span className="achievement-desc">{ach.description}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
