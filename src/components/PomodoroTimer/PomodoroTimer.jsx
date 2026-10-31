import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, Timer, Coffee } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../data/db';
import { calculatePomodoroXP, getLevelTitle } from '../../core/gamification/xpEngine';
import { completePomodoroSession, getTodayFocusStats } from '../../core/gamification/pomodoroSession';
import { useToast } from '../ToastProvider/ToastProvider';
import './PomodoroTimer.css';

const USER_ID = 'guest';
const FOCUS_PRESETS = [15, 25, 50];
const BREAK_MINUTES = 5;
const DEFAULT_FOCUS_MINUTES = 25;
const STORAGE_KEY = 'studymapper.pomodoro.v1';

const minutesToMs = (minutes) => minutes * 60 * 1000;

const formatTime = (ms) => {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const buildState = (mode, focusMinutes) => {
  const durationMinutes = mode === 'break' ? BREAK_MINUTES : focusMinutes;
  return {
    mode,
    durationMinutes,
    focusMinutes,
    status: 'idle',
    endsAt: null,
    remainingMs: minutesToMs(durationMinutes),
    sessionId: null,
    startedAt: null,
  };
};

const DEFAULT_STATE = buildState('focus', DEFAULT_FOCUS_MINUTES);

const readStoredState = () => {
  if (typeof window === 'undefined' || !window.localStorage) return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);

    const focusMinutes = FOCUS_PRESETS.includes(Number(parsed.focusMinutes))
      ? Number(parsed.focusMinutes)
      : DEFAULT_FOCUS_MINUTES;
    const mode = parsed.mode === 'break' ? 'break' : 'focus';
    const durationMinutes = mode === 'break'
      ? BREAK_MINUTES
      : (FOCUS_PRESETS.includes(Number(parsed.durationMinutes)) ? Number(parsed.durationMinutes) : focusMinutes);
    const status = ['idle', 'running', 'paused'].includes(parsed.status) ? parsed.status : 'idle';
    const maxMs = minutesToMs(durationMinutes);
    const storedRemaining = Number(parsed.remainingMs);
    const remainingMs = Number.isFinite(storedRemaining)
      ? Math.min(maxMs, Math.max(0, storedRemaining))
      : maxMs;

    // A running session without a deadline cannot be restored.
    if (status === 'running' && !Number.isFinite(Number(parsed.endsAt))) {
      return buildState(mode, focusMinutes);
    }

    return {
      mode,
      durationMinutes,
      focusMinutes,
      status,
      endsAt: status === 'running' ? Number(parsed.endsAt) : null,
      remainingMs,
      sessionId: parsed.sessionId || null,
      startedAt: parsed.startedAt || null,
    };
  } catch {
    return DEFAULT_STATE;
  }
};

const persistState = (state) => {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage can be unavailable (private mode / quota). The timer still runs.
  }
};

const playChime = () => {
  if (typeof window === 'undefined') return;
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtor) return;
  try {
    const ctx = new AudioCtor();
    const now = ctx.currentTime;
    [880, 1174].forEach((frequency, index) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, now + index * 0.18);
      gain.gain.exponentialRampToValueAtTime(0.18, now + index * 0.18 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.18 + 0.45);
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start(now + index * 0.18);
      oscillator.stop(now + index * 0.18 + 0.5);
    });
    window.setTimeout(() => ctx.close(), 1400);
  } catch {
    // Audio is a nice-to-have; never let it break completion.
  }
};

export default function PomodoroTimer({ topicId = null, userId = USER_ID }) {
  const toast = useToast();
  const [state, setState] = useState(readStoredState);
  const [now, setNow] = useState(() => Date.now());
  const finalizingRef = useRef(false);
  const baseTitleRef = useRef(typeof document !== 'undefined' ? document.title : '');

  const remainingMs = state.status === 'running'
    ? Math.max(0, state.endsAt - now)
    : state.remainingMs;

  const totalMs = Math.max(1, minutesToMs(state.durationMinutes));
  const remainingRatio = Math.min(1, Math.max(0, remainingMs / totalMs));
  const dashOffset = (1 - remainingRatio) * 2 * Math.PI * 46;

  const profile = useLiveQuery(
    () => db.gamification_profiles.where('user_id').equals(userId).first(),
    [userId]
  );
  const focusToday = useLiveQuery(() => getTodayFocusStats(userId), [userId]) || { sessions: 0, minutes: 0 };
  const streakDays = profile?.streak_days || 0;
  const xpPreview = state.mode === 'focus'
    ? calculatePomodoroXP(state.durationMinutes, streakDays)
    : 0;

  // Persist on every change so a refresh or a closed tab never eats a session.
  useEffect(() => {
    persistState(state);
  }, [state]);

  // Tick the wall clock; the remaining time is derived, never decremented, so
  // background-tab throttling cannot stretch a 25 minute session.
  useEffect(() => {
    if (state.status !== 'running') return undefined;
    const interval = window.setInterval(() => setNow(Date.now()), 250);
    const resync = () => setNow(Date.now());
    document.addEventListener('visibilitychange', resync);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', resync);
    };
  }, [state.status]);

  const announce = useCallback((result, minutes) => {
    if (!result || result.alreadyCompleted) return;

    const parts = [`+${result.xp} XP`];
    if (result.firstSessionBonusXP > 0) parts.push(`Includes First-of-Day Bonus (+${result.firstSessionBonusXP})`);
    if (result.comboBonus > 0) parts.push(`Combo (+${result.comboBonus})`);
    if (result.streakDays > 1) parts.push(`${result.streakDays}-day streak`);
    toast(`Focus session complete · ${minutes} min · ${parts.join(' · ')}`, 'success');

    if (result.freezeUsed) {
      window.setTimeout(() => {
        toast(`Streak freeze used! Your streak was saved (${result.freezesRemaining} remaining).`, 'info');
      }, 300);
    }

    if (result.allQuestsComplete) {
      window.setTimeout(() => {
        toast('All daily quests completed! +150 XP bonus earned!', 'success');
      }, 400);
    }

    if (result.leveledUp) {
      window.setTimeout(() => {
        toast(`Level ${result.level} unlocked — ${getLevelTitle(result.level)}!`, 'success');
      }, 500);
    }
    (result.questsCompleted || []).forEach((quest) => {
      toast(`Daily quest complete: ${quest.title} (+100 XP)`, 'success');
    });
    (result.achievements || []).forEach((achievement) => {
      toast(`Achievement unlocked: ${achievement.title} (+${achievement.xp_reward} XP)`, 'success');
    });
  }, [toast]);

  // Finalize exactly once when the deadline passes (including after a reload).
  useEffect(() => {
    if (state.status !== 'running' || remainingMs > 0) return undefined;

    const snapshot = state;
    let mounted = true;

    (async () => {
      if (finalizingRef.current) return;
      finalizingRef.current = true;
      try {
        if (snapshot.mode === 'focus') {
          let result = null;
          try {
            result = await completePomodoroSession({
              sessionId: snapshot.sessionId || uuidv4(),
              userId,
              topicId,
              durationMinutes: snapshot.durationMinutes,
              startedAt: snapshot.startedAt,
              endedAt: new Date().toISOString(),
            });
          } catch (error) {
            console.error('Failed to save focus session', error);
            if (mounted) toast('Session finished, but saving progress failed.', 'error');
          }
          if (!mounted) return;
          playChime();
          if (result) announce(result, snapshot.durationMinutes);
          setState(buildState('break', snapshot.focusMinutes));
          setNow(Date.now());
        } else {
          playChime();
          if (!mounted) return;
          toast('Break over — ready for another focus session.', 'success');
          setState(buildState('focus', snapshot.focusMinutes));
          setNow(Date.now());
        }
      } finally {
        finalizingRef.current = false;
      }
    })();

    return () => { mounted = false; };
  }, [state, remainingMs, userId, topicId, announce, toast]);

  // Countdown in the tab title while running.
  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    if (state.status === 'running') {
      const label = state.mode === 'focus' ? 'Focus' : 'Break';
      document.title = `${formatTime(remainingMs)} · ${label} — StudyMapper`;
    }
    return () => {
      document.title = baseTitleRef.current;
    };
  }, [state.status, state.mode, remainingMs]);

  const toggleTimer = () => {
    if (state.status === 'running') {
      setState((prev) => ({
        ...prev,
        status: 'paused',
        endsAt: null,
        remainingMs: Math.max(0, prev.endsAt - Date.now()),
      }));
      return;
    }

    if (remainingMs <= 0) return;

    const startingFresh = state.status === 'idle' || !state.sessionId;
    setState((prev) => ({
      ...prev,
      status: 'running',
      endsAt: Date.now() + Math.max(0, remainingMs),
      sessionId: startingFresh ? uuidv4() : prev.sessionId,
      startedAt: startingFresh ? new Date().toISOString() : prev.startedAt,
    }));
    setNow(Date.now());
  };

  const resetTimer = () => {
    setState((prev) => buildState(prev.mode, prev.focusMinutes));
    setNow(Date.now());
  };

  const selectPreset = (minutes) => {
    setState(buildState('focus', minutes));
    setNow(Date.now());
  };

  const isRunning = state.status === 'running';
  const isBreak = state.mode === 'break';
  const timeLabel = formatTime(remainingMs);

  return (
    <div
      className={`pomodoro-timer pomodoro-${state.mode} ${isRunning ? 'is-running' : ''}`}
      data-status={state.status}
    >
      <div className="pomodoro-header">
        {isBreak ? <Coffee size={16} aria-hidden="true" /> : <Timer size={16} aria-hidden="true" />}
        <span>{isBreak ? 'Break' : 'Focus Timer'}</span>
        {isRunning && <span className="pomodoro-live-dot" aria-hidden="true" />}
      </div>

      <div className="pomodoro-timer-body">
        <div className="pomodoro-display" role="timer" aria-label={`${isBreak ? 'Break' : 'Focus'} time remaining ${timeLabel}`}>
          {timeLabel}
        </div>
      </div>

      <div className="pomodoro-presets" role="group" aria-label="Focus session length">
        {FOCUS_PRESETS.map((minutes) => (
          <button
            key={minutes}
            type="button"
            className={`pomodoro-preset ${!isBreak && state.durationMinutes === minutes ? 'is-active' : ''}`}
            onClick={() => selectPreset(minutes)}
            disabled={isRunning && !isBreak}
            aria-pressed={!isBreak && state.durationMinutes === minutes}
          >
            {minutes}m
          </button>
        ))}
      </div>

      <div className="pomodoro-controls">
        <button
          type="button"
          onClick={toggleTimer}
          className="pomodoro-btn play-pause"
          aria-label={isRunning ? 'Pause timer' : 'Start timer'}
        >
          {isRunning ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button
          type="button"
          onClick={resetTimer}
          className="pomodoro-btn reset"
          aria-label="Reset timer"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      <div className="pomodoro-footer">
        <span className="pomodoro-today">
          {focusToday.sessions} {focusToday.sessions === 1 ? 'session' : 'sessions'} · {focusToday.minutes} min today
        </span>
        {isBreak ? (
          <span className="pomodoro-reward is-break">Recharge</span>
        ) : (
          <span className="pomodoro-reward">
            +{xpPreview} XP{streakDays >= 3 ? ` · ${streakDays}d streak` : ''}
          </span>
        )}
      </div>
    </div>
  );
}
