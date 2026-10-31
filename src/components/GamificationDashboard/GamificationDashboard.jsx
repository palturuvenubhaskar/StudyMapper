import React, { useCallback, useEffect, useState } from 'react';
import { getGamificationProfile, getXPProgress, XP_RULES } from '../../core/gamification/xpEngine';
import { getOrCreateDailyQuests } from '../../core/gamification/dailyQuests';
import { getOrCreateWeeklyChallenges } from '../../core/gamification/weeklyChallenges';
import { db } from '../../data/db';
import LevelBadge from './LevelBadge';
import StreakFlame from './StreakFlame';
import {
  Target,
  Check,
  Trophy,
  Share2,
  Calendar,
  Sparkles,
  Timer,
  Flame,
  TerminalSquare,
  BookOpen,
  GraduationCap,
  FileText,
  Brain,
  Moon,
  Sun,
  Zap,
  Clock,
  Layers,
  PlusCircle,
  Code2,
} from 'lucide-react';
import { ACHIEVEMENTS } from '../../core/gamification/achievements';
import { useToast } from '../ToastProvider/ToastProvider';
import GeneratingState from '../GeneratingState/GeneratingState';
import './GamificationDashboard.css';

const TIER_COLORS = {
  bronze: '#c2703a',
  silver: '#7c8ba1',
  gold: '#d99a06',
  diamond: '#2aa8c9',
};

const ICON_MAP = {
  Timer, Flame, TerminalSquare, BookOpen, GraduationCap, FileText, Brain, Moon, Sun, Trophy,
};

const QUEST_ICONS = {
  generate_notes: FileText,
  pomodoro: Timer,
  pomodoro_long: Timer,
  study_minutes: Clock,
  study_topics: BookOpen,
  solve_code: Code2,
  review_flashcard: Layers,
  create_questions: PlusCircle,
};

const CHALLENGE_ICONS = {
  focus_minutes: Timer,
  sessions: Zap,
  quests: Target,
  notes: FileText,
  code: Code2,
  streak_maintain: Flame,
};

const getAchievementIcon = (iconName) => ICON_MAP[iconName] || Trophy;

const humanizeId = (id = '') =>
  id
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim() || 'Achievement';

/**
 * Older saves stored only the base achievement id (e.g. "question_collector")
 * and newer ones store "<id>_<tier>". Resolve both without showing raw ids.
 */
const hydrateAchievement = (record) => {
  const achievementId = record.achievement_id || '';
  const template = ACHIEVEMENTS.find((a) =>
    a.tiers.some((t) => `${a.id}_${t.tier}` === achievementId)
  );

  if (template) {
    const tier = template.tiers.find((t) => `${template.id}_${t.tier}` === achievementId);
    return {
      ...record,
      title: tier.suffix ? `${template.title}: ${tier.suffix}` : template.title,
      description: tier.description,
      icon_name: template.icon_name,
      tier: tier.tier,
      xp_reward: tier.xp_reward,
    };
  }

  const legacyTemplate = ACHIEVEMENTS.find(
    (a) => a.id === achievementId || achievementId.startsWith(`${a.id}_`)
  );

  if (legacyTemplate) {
    return {
      ...record,
      title: legacyTemplate.title,
      description: legacyTemplate.tiers[0]?.description || '',
      icon_name: legacyTemplate.icon_name,
      tier: null,
      xp_reward: null,
    };
  }

  return {
    ...record,
    title: humanizeId(achievementId),
    description: 'Unlocked',
    icon_name: 'Trophy',
    tier: null,
    xp_reward: null,
  };
};

function ProgressRow({ title, progress, target, xp, icon: Icon, completed, variant }) {
  const safeTarget = target || 1;
  const pct = Math.min(100, Math.round((progress / safeTarget) * 100));
  const remaining = Math.max(0, safeTarget - progress);

  return (
    <li className={`progress-row ${completed ? 'completed' : ''} ${variant || ''}`}>
      <span className="progress-row-status" aria-hidden="true">
        {completed ? <Check size={15} strokeWidth={3} /> : <Icon size={15} />}
      </span>
      <div className="progress-row-body">
        <div className="progress-row-head">
          <span className="progress-row-title">{title}</span>
          <span className="progress-row-count tabular-nums">{progress} / {safeTarget}</span>
        </div>
        <div
          className="progress-row-track"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={safeTarget}
          aria-label={title}
        >
          <div className="progress-row-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="progress-row-meta">
          <span className="progress-row-state">
            {completed ? 'Completed' : `${remaining} to go`}
          </span>
          {xp ? <span className="progress-row-xp">+{xp} XP</span> : null}
        </div>
      </div>
    </li>
  );
}

export default function GamificationDashboard({ userId = 'guest' }) {
  const [profile, setProfile] = useState(null);
  const [quests, setQuests] = useState([]);
  const [weeklyChallenges, setWeeklyChallenges] = useState([]);
  const [recentAchievements, setRecentAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    const p = await getGamificationProfile(userId);
    setProfile(p);

    const daily = await getOrCreateDailyQuests(userId);
    setQuests(daily.quests || []);

    try {
      const weekly = await getOrCreateWeeklyChallenges(userId);
      setWeeklyChallenges(weekly.challenges || []);
    } catch {
      setWeeklyChallenges([]);
    }

    const userAchievements = await db.achievements.where('user_id').equals(userId).toArray();
    const hydrated = userAchievements
      .sort((a, b) => new Date(b.unlocked_at || 0) - new Date(a.unlocked_at || 0))
      .slice(0, 5)
      .map(hydrateAchievement);
    setRecentAchievements(hydrated);

    setLoading(false);
  }, [userId]);

  useEffect(() => {
    loadData(true);

    // Refresh silently whenever XP changes (session/quest/achievement).
    let timer;
    const refresh = () => {
      clearTimeout(timer);
      timer = setTimeout(() => loadData(false), 120);
    };
    window.addEventListener('studymapper:xp', refresh);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('studymapper:xp', refresh);
    };
  }, [userId, loadData]);

  const toast = useToast();

  if (loading || !profile) {
    return (
      <div className="gamification-loading">
        <GeneratingState inline label="Loading your progress" />
      </div>
    );
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

  const questsDone = quests.filter((q) => q.completed).length;
  const allQuestsComplete = quests.length > 0 && questsDone === quests.length;
  const weeklyDone = weeklyChallenges.filter((c) => c.completed).length;
  const weeklyXpTotal = weeklyChallenges.reduce((sum, c) => sum + (c.xp_reward || 0), 0);

  return (
    <section className="gamification-dashboard" aria-label="Your progress">
      <div className="gamification-hero">
        <LevelBadge level={profile.current_level} percentage={progress.percentage} progress={progress} />
        <div className="gamification-hero-side">
          <StreakFlame
            streakDays={profile.streak_days}
            longestStreak={profile.longest_streak}
            freezesRemaining={profile.streak_freezes ?? 0}
          />
          <button
            type="button"
            className="gamification-share"
            onClick={handleShare}
            title="Share my progress"
          >
            <Share2 size={15} aria-hidden="true" />
            <span>Share</span>
          </button>
        </div>
      </div>

      <div className="gamification-panels">
        {/* Daily Quests */}
        <section className="gamification-panel quests-panel">
          <header className="gamification-panel-head">
            <span className="gamification-panel-icon" aria-hidden="true">
              <Target size={15} />
            </span>
            <h3>Daily quests</h3>
            <span className={`gamification-panel-meta ${allQuestsComplete ? 'is-complete' : ''}`}>
              {allQuestsComplete ? (
                <>
                  <Sparkles size={12} aria-hidden="true" /> All done
                </>
              ) : (
                `${questsDone} of ${quests.length} done`
              )}
            </span>
          </header>
          <ul className="quests-list">
            {quests.map((q) => (
              <ProgressRow
                key={q.id}
                title={q.title}
                progress={q.progress}
                target={q.target}
                xp={XP_RULES.dailyQuest}
                icon={QUEST_ICONS[q.type] || Target}
                completed={q.completed}
              />
            ))}
          </ul>
          <footer className="gamification-panel-foot">
            <span>{XP_RULES.dailyQuest} XP per quest</span>
            <span className="gamification-foot-bonus">+{XP_RULES.allQuestsCompleteBonus} XP for all</span>
          </footer>
        </section>

        {/* Weekly Challenges */}
        <section className="gamification-panel weekly-panel">
          <header className="gamification-panel-head">
            <span className="gamification-panel-icon" aria-hidden="true">
              <Calendar size={15} />
            </span>
            <h3>Weekly challenges</h3>
            <span className="gamification-panel-meta">{weeklyDone} of {weeklyChallenges.length} done</span>
          </header>
          {weeklyChallenges.length === 0 ? (
            <div className="panel-empty">
              <Calendar size={22} aria-hidden="true" />
              <p>New challenges drop on Monday.</p>
            </div>
          ) : (
            <ul className="quests-list">
              {weeklyChallenges.map((c) => (
                <ProgressRow
                  key={c.id}
                  title={c.title}
                  progress={c.progress}
                  target={c.target}
                  xp={c.xp_reward}
                  icon={CHALLENGE_ICONS[c.type] || Target}
                  completed={c.completed}
                  variant="weekly"
                />
              ))}
            </ul>
          )}
          <footer className="gamification-panel-foot">
            <span>{weeklyXpTotal} XP available</span>
            <span>Resets Monday</span>
          </footer>
        </section>

        {/* Recent Achievements */}
        <section className="gamification-panel achievements-panel">
          <header className="gamification-panel-head">
            <span className="gamification-panel-icon" aria-hidden="true">
              <Trophy size={15} />
            </span>
            <h3>Recent achievements</h3>
            {recentAchievements.length > 0 && (
              <span className="gamification-panel-meta">{recentAchievements.length}</span>
            )}
          </header>
          {recentAchievements.length === 0 ? (
            <div className="panel-empty">
              <Trophy size={22} aria-hidden="true" />
              <p>Study a topic to unlock your first badge.</p>
            </div>
          ) : (
            <ul className="achievements-list">
              {recentAchievements.map((ach) => {
                const IconComponent = getAchievementIcon(ach.icon_name);
                const tierColor = ach.tier ? TIER_COLORS[ach.tier] || TIER_COLORS.bronze : 'var(--accent-brand)';
                return (
                  <li key={ach.id} className="achievement-item">
                    <span
                      className="achievement-icon-wrapper"
                      style={{ background: ach.tier ? `${tierColor}1f` : 'var(--accent-brand-soft)', color: tierColor }}
                      aria-hidden="true"
                    >
                      <IconComponent size={18} />
                    </span>
                    <div className="achievement-info">
                      <span className="achievement-title">{ach.title}</span>
                      <span className="achievement-desc">
                        {ach.tier && (
                          <>
                            <span className="achievement-tier" style={{ color: tierColor }}>
                              {ach.tier}
                            </span>
                            {ach.description ? ' · ' : ''}
                          </>
                        )}
                        {ach.description}
                      </span>
                    </div>
                    {ach.xp_reward ? (
                      <span className="achievement-xp">+{ach.xp_reward} XP</span>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </section>
  );
}
