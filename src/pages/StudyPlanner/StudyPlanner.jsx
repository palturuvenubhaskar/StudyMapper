import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStudentProfile, saveStudentProfile, getAllSubjects, getStudyPlan } from '../../data/repository';
import { db } from '../../data/db';
import { generateAdaptivePlan, triggerPanicMode } from '../../core/planner/adaptivePlanner';
import { downloadIcsFile } from '../../core/planner/icalExport';
import {
  Calendar,
  RefreshCw,
  Loader,
  AlertTriangle,
  Download,
  BookOpen,
  Clock,
  Hourglass,
} from 'lucide-react';
import { useToast } from '../../components/ToastProvider/ToastProvider';
import GeneratingState from '../../components/GeneratingState/GeneratingState';
import './StudyPlanner.css';

const DAY_MS = 1000 * 60 * 60 * 24;
const SUBJECT_COLORS = ['#4f46e5', '#0ea5e9', '#8b5cf6', '#059669', '#d97706', '#db2777'];

const startOfDay = (value) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const addDays = (date, amount) => {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
};

const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const toDateInput = (date) => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
};

const formatDuration = (minutes = 0) => {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest}m`;
  return rest === 0 ? `${hours}h` : `${hours}h ${rest}m`;
};

const formatDate = (value, options) =>
  value ? new Date(value).toLocaleDateString(undefined, options) : '';

const formatExamDate = (value) =>
  value ? formatDate(`${value}T00:00:00`, { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not set';

export default function StudyPlanner() {
  const [profile, setProfile] = useState(null);
  const [plan, setPlan] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [examDate, setExamDate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [goal, setGoal] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lookups, setLookups] = useState({ topics: new Map(), units: new Map(), subjectById: new Map() });
  const [topicCounts, setTopicCounts] = useState({});
  const toast = useToast();

  useEffect(() => {
    loadProfileAndData();
  }, []);

  const loadProfileAndData = async () => {
    const [prof, subs, units, topics] = await Promise.all([
      getStudentProfile(),
      getAllSubjects(),
      db.units.toArray(),
      db.topics.toArray(),
    ]);

    const topicMap = new Map(topics.map((topic) => [topic.id, topic]));
    const unitMap = new Map(units.map((unit) => [unit.id, unit]));
    const subjectMap = new Map(subs.map((subject) => [subject.id, subject]));

    const counts = {};
    const topicsPerUnit = new Map();
    topics.forEach((topic) => {
      topicsPerUnit.set(topic.unit_id, (topicsPerUnit.get(topic.unit_id) || 0) + 1);
    });
    units.forEach((unit) => {
      counts[unit.subject_id] = (counts[unit.subject_id] || 0) + (topicsPerUnit.get(unit.id) || 0);
    });

    setProfile(prof);
    setSubjects(subs);
    setTopicCounts(counts);
    setLookups({ topics: topicMap, units: unitMap, subjectById: subjectMap });

    if (prof) {
      const existingPlan = await getStudyPlan(prof.id);
      if (existingPlan && existingPlan.plan_json) {
        const parsed = JSON.parse(existingPlan.plan_json);
        setPlan(existingPlan);
        setSchedule(parsed);
        setExamDate(existingPlan.exam_date || '');

        const plannedSubjectIds = new Set();
        Object.values(parsed).flat().forEach((task) => {
          const topic = topicMap.get(task.topic_id);
          const unit = topic ? unitMap.get(topic.unit_id) : null;
          if (unit) plannedSubjectIds.add(unit.subject_id);
        });
        if (plannedSubjectIds.size > 0) {
          setSelectedSubjects((current) => (current.length > 0 ? current : [...plannedSubjectIds]));
        }
      }
    }

    setIsLoading(false);
  };

  const handleSubjectToggle = (id) => {
    setSelectedSubjects((prev) =>
      prev.includes(id) ? prev.filter((subjectId) => subjectId !== id) : [...prev, id]
    );
  };

  const generatePlan = async () => {
    if (!examDate) {
      toast('Please select an exam date', 'error');
      return;
    }
    if (selectedSubjects.length === 0) {
      toast('Please select at least one subject', 'error');
      return;
    }

    setIsGenerating(true);
    try {
      const newPlan = await generateAdaptivePlan(profile.id, examDate, selectedSubjects);
      setPlan(newPlan);
      setSchedule(JSON.parse(newPlan.plan_json));
      toast('Adaptive study plan generated successfully!', 'success');
    } catch (err) {
      console.error(err);
      toast('Failed to generate plan: ' + err.message, 'error');
    }
    setIsGenerating(false);
  };

  const handlePanicMode = async () => {
    if (!plan) return;
    if (window.confirm('Panic Mode will forcefully compress your remaining tasks into the days left, potentially dropping low-priority tasks. Continue?')) {
      setIsGenerating(true);
      try {
        const updatedPlan = await triggerPanicMode(plan.id, []); // pass completed topic IDs here if we were tracking them in state
        setPlan(updatedPlan);
        setSchedule(JSON.parse(updatedPlan.plan_json));
        toast('Panic mode activated. Schedule compressed.', 'warning');
      } catch (err) {
        console.error(err);
        toast('Failed to activate panic mode.', 'error');
      }
      setIsGenerating(false);
    }
  };

  const handleExport = () => {
    if (!schedule) return;
    downloadIcsFile(schedule);
    toast('Calendar file downloaded!', 'success');
  };

  const handleSaveProfile = async (event) => {
    event?.preventDefault();
    if (!goal.trim()) return;
    setIsSaving(true);
    try {
      await saveStudentProfile({ career_goal: goal.trim() });
      await loadProfileAndData();
      toast('Profile created successfully!', 'success');
    } catch {
      toast('Failed to save profile.', 'error');
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="study-planner-container">
        <div className="sp-loading" aria-busy="true">
          <div className="skeleton" style={{ height: '52px', width: '46%' }} />
          <div className="skeleton" style={{ height: '18px', width: '32%' }} />
          <div className="sp-loading-grid">
            <div className="skeleton" style={{ height: '420px' }} />
            <div className="skeleton" style={{ height: '420px' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="study-planner-container">
        <div className="sp-gate">
          <span className="sp-gate-icon">
            <BookOpen size={22} aria-hidden="true" />
          </span>
          <h1>Set up your planner</h1>
          <p>
            Tell us what you're working toward. It gives your plan a goal to schedule around.
          </p>
          <form className="sp-gate-form" onSubmit={handleSaveProfile}>
            <label htmlFor="planner-goal">Primary learning or career goal</label>
            <input
              id="planner-goal"
              type="text"
              className="input"
              placeholder="e.g. Master React and Node.js"
              value={goal}
              onChange={(event) => setGoal(event.target.value)}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!goal.trim() || isSaving}
            >
              {isSaving ? 'Saving…' : 'Create my planner'}
            </button>
          </form>
          <p className="sp-gate-hint">You can change this later in Settings.</p>
        </div>
      </div>
    );
  }

  const today = startOfDay(new Date());
  const planStart = plan?.updated_at ? startOfDay(plan.updated_at) : today;

  const subjectColor = new Map(
    subjects.map((subject, index) => [subject.id, SUBJECT_COLORS[index % SUBJECT_COLORS.length]])
  );

  const getTaskSubject = (task) => {
    const topic = lookups.topics.get(task.topic_id);
    const unit = topic ? lookups.units.get(topic.unit_id) : null;
    return unit ? lookups.subjectById.get(unit.subject_id) : null;
  };

  const days = schedule
    ? Object.entries(schedule)
        .map(([rawIndex, tasks]) => {
          const index = Number(rawIndex);
          return { index, date: addDays(planStart, index), tasks };
        })
        .sort((a, b) => a.index - b.index)
    : [];

  const allTasks = days.flatMap((day) => day.tasks);
  const totalMinutes = allTasks.reduce((sum, task) => sum + (task.durationMinutes || 0), 0);
  const uniqueTopicCount = new Set(allTasks.map((task) => task.topic_id)).size;
  const activeDayCount = days.filter((day) => day.tasks.length > 0).length;

  const plannedSubjectIds = new Set();
  allTasks.forEach((task) => {
    const subject = getTaskSubject(task);
    if (subject) plannedSubjectIds.add(subject.id);
  });
  const plannedSubjects = subjects.filter((subject) => plannedSubjectIds.has(subject.id));

  const weeks = [];
  days.forEach((day) => {
    const weekIndex = Math.floor(day.index / 7);
    let week = weeks.find((entry) => entry.index === weekIndex);
    if (!week) {
      week = { index: weekIndex, days: [] };
      weeks.push(week);
    }
    week.days.push(day);
  });
  const activeWeeks = weeks.filter((week) => week.days.some((day) => day.tasks.length > 0));

  const examDay = examDate ? startOfDay(`${examDate}T00:00:00`) : null;
  const daysToExam = examDay ? Math.round((examDay - today) / DAY_MS) : null;
  const countdownCopy =
    daysToExam === null
      ? 'Set an exam date'
      : daysToExam > 1
        ? `${daysToExam} days from today`
        : daysToExam === 1
          ? '1 day from today'
          : daysToExam === 0
            ? 'Your exam is today'
            : 'This date has already passed';

  const canGenerate =
    Boolean(examDate) &&
    daysToExam !== null &&
    daysToExam > 0 &&
    selectedSubjects.length > 0 &&
    !isGenerating;

  return (
    <div className="study-planner-container">
      <header className="sp-head">
        <div>
          <h1 className="sp-title">Study planner</h1>
          <p className="sp-subtitle">
            An adaptive schedule built from topic difficulty and the time you have left.
          </p>
        </div>
        {schedule && (
          <div className="sp-head-actions">
            <button type="button" className="btn btn-secondary" onClick={handleExport}>
              <Download size={16} aria-hidden="true" />
              Export to calendar
            </button>
          </div>
        )}
      </header>

      <section className="sp-status" aria-label="Plan overview">
        <div className="sp-status-item">
          <Calendar size={16} aria-hidden="true" />
          <span>Exam</span>
          <strong>{formatExamDate(examDate)}</strong>
        </div>
        <span className="sp-status-divider" aria-hidden="true" />
        <div className="sp-status-item">
          <Hourglass size={16} aria-hidden="true" />
          <span>Time left</span>
          <strong>
            {daysToExam === null
              ? 'Not set'
              : daysToExam > 1
                ? `${daysToExam} days`
                : daysToExam === 1
                  ? '1 day'
                  : daysToExam === 0
                    ? 'Today'
                    : 'Passed'}
          </strong>
        </div>
        <span className="sp-status-divider" aria-hidden="true" />
        <div className="sp-status-item">
          <Clock size={16} aria-hidden="true" />
          <span>Planned</span>
          <strong>
            {schedule
              ? `${uniqueTopicCount} topics · ${formatDuration(totalMinutes)}`
              : 'No plan yet'}
          </strong>
        </div>
      </section>

      <div className={`sp-layout ${schedule ? '' : 'sp-layout--empty'}`}>
        <main className="sp-main">
          {isGenerating ? (
            <section className="sp-panel sp-generating">
              <GeneratingState
                label="Building your adaptive plan"
                hint="Balancing difficulty, deadlines, and your available study days."
              />
            </section>
          ) : schedule ? (
            <section className="sp-panel sp-schedule" aria-labelledby="sp-schedule-title">
              <div className="sp-panel-head">
                <div>
                  <h2 id="sp-schedule-title">Day-by-day schedule</h2>
                  <p className="sp-panel-sub">
                    {activeDayCount} study {activeDayCount === 1 ? 'day' : 'days'} across{' '}
                    {activeWeeks.length} {activeWeeks.length === 1 ? 'week' : 'weeks'}
                    {' · '}
                    {formatDuration(totalMinutes)} total
                  </p>
                </div>
              </div>

              {plannedSubjects.length > 0 && (
                <ul className="sp-legend" aria-label="Subjects in this plan">
                  {plannedSubjects.map((subject) => (
                    <li key={subject.id}>
                      <span
                        className="sp-legend-dot"
                        style={{ background: subjectColor.get(subject.id) }}
                        aria-hidden="true"
                      />
                      {subject.title}
                    </li>
                  ))}
                </ul>
              )}

              {allTasks.length === 0 ? (
                <div className="sp-plan-empty">
                  <p>
                    The selected subjects don't have any topics yet. Add topics to a subject, then
                    regenerate the plan.
                  </p>
                </div>
              ) : (
                <div className="sp-weeks">
                  {activeWeeks.map((week) => {
                  const firstDay = week.days[0].date;
                  const lastDay = week.days[week.days.length - 1].date;
                  const weekTaskCount = week.days.reduce((sum, day) => sum + day.tasks.length, 0);
                  const weekMinutes = week.days.reduce(
                    (sum, day) =>
                      sum + day.tasks.reduce((daySum, task) => daySum + (task.durationMinutes || 0), 0),
                    0
                  );
                  const restDays = week.days.filter((day) => day.tasks.length === 0);

                  return (
                    <section key={week.index} className="sp-week" aria-label={`Week ${week.index + 1}`}>
                      <header className="sp-week-head">
                        <h3>Week {week.index + 1}</h3>
                        <span className="sp-week-range">
                          {formatDate(firstDay, { month: 'short', day: 'numeric' })} –{' '}
                          {formatDate(lastDay, { month: 'short', day: 'numeric' })}
                        </span>
                        <span className="sp-week-meta">
                          {weekTaskCount} {weekTaskCount === 1 ? 'task' : 'tasks'} ·{' '}
                          {formatDuration(weekMinutes)}
                        </span>
                      </header>

                      <div className="sp-days">
                        {week.days
                          .filter((day) => day.tasks.length > 0)
                          .map((day) => {
                            const isToday = isSameDay(day.date, today);
                            const dayMinutes = day.tasks.reduce(
                              (sum, task) => sum + (task.durationMinutes || 0),
                              0
                            );

                            return (
                              <article
                                key={day.index}
                                className={`sp-day ${isToday ? 'sp-day--today' : ''}`}
                              >
                                <div className="sp-day-head">
                                  <div className="sp-day-labels">
                                    <span className="sp-day-number">Day {day.index + 1}</span>
                                    <span className="sp-day-date">
                                      {formatDate(day.date, { weekday: 'short', month: 'short', day: 'numeric' })}
                                    </span>
                                  </div>
                                  <div className="sp-day-meta">
                                    {isToday && <span className="sp-today">Today</span>}
                                    <span>
                                      {day.tasks.length} {day.tasks.length === 1 ? 'task' : 'tasks'} ·{' '}
                                      {formatDuration(dayMinutes)}
                                    </span>
                                  </div>
                                </div>

                                <ul className="sp-tasks">
                                  {day.tasks.map((task, index) => {
                                    const subject = getTaskSubject(task);
                                    return (
                                      <li key={`${task.topic_id}-${index}`}>
                                        <Link
                                          to={`/topic/${task.topic_id}`}
                                          className="sp-task"
                                          title={task.title}
                                        >
                                          <span
                                            className="sp-task-dot"
                                            style={{
                                              background: subject
                                                ? subjectColor.get(subject.id)
                                                : 'var(--text-muted)',
                                            }}
                                            aria-hidden="true"
                                          />
                                          <span className="sp-task-title">{task.title}</span>
                                          <span className="sp-task-duration tabular-nums">
                                            {formatDuration(task.durationMinutes || 25)}
                                          </span>
                                        </Link>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </article>
                            );
                          })}

                        {restDays.length > 0 && (
                          <p className="sp-rest">
                            Rest days ·{' '}
                            {restDays
                              .slice(0, 3)
                              .map((day) =>
                                formatDate(day.date, { weekday: 'short', month: 'short', day: 'numeric' })
                              )
                              .join(', ')}
                            {restDays.length > 3 ? ` +${restDays.length - 3} more` : ''}
                          </p>
                        )}
                      </div>
                    </section>
                  );
                  })}
                </div>
              )}
            </section>
          ) : (
            <section className="sp-panel sp-empty">
              <span className="sp-empty-icon">
                <Calendar size={22} aria-hidden="true" />
              </span>
              <h2>No schedule yet</h2>
              {subjects.length === 0 ? (
                <>
                  <p>Your plan needs at least one subject. Create a subject, then come back to set an exam date.</p>
                  <Link className="btn btn-primary" to="/create">Create a subject</Link>
                </>
              ) : (
                <p>Set an exam date and pick the subjects you want to cover, then generate your plan.</p>
              )}
            </section>
          )}
        </main>

        <aside className="sp-setup sp-panel" aria-labelledby="sp-setup-title">
          <div className="sp-panel-head">
            <h2 id="sp-setup-title">Plan setup</h2>
          </div>

          <div className="sp-field">
            <label htmlFor="sp-exam-date">Exam date</label>
            <input
              id="sp-exam-date"
              type="date"
              className="input"
              value={examDate}
              onChange={(event) => setExamDate(event.target.value)}
              min={toDateInput(today)}
            />
            <p className="sp-helper">{countdownCopy}</p>
          </div>

          <div className="sp-field">
            <div className="sp-field-label">
              <span>Subjects</span>
              <span className="sp-field-count">
                {selectedSubjects.length} of {subjects.length} selected
              </span>
            </div>

            {subjects.length === 0 ? (
              <p className="sp-helper">
                No subjects yet. <Link to="/create">Create your first subject</Link>.
              </p>
            ) : (
              <div className="sp-subjects">
                {subjects.map((subject) => {
                  const count = topicCounts[subject.id] || 0;
                  return (
                    <label key={subject.id} className="sp-subject">
                      <input
                        type="checkbox"
                        checked={selectedSubjects.includes(subject.id)}
                        onChange={() => handleSubjectToggle(subject.id)}
                      />
                      <span className="sp-check" aria-hidden="true" />
                      <span
                        className="sp-subject-swatch"
                        style={{ background: subjectColor.get(subject.id) }}
                        aria-hidden="true"
                      />
                      <span className="sp-subject-copy">
                        <span className="sp-subject-name">{subject.title}</span>
                        <span className="sp-subject-count">
                          {count} {count === 1 ? 'topic' : 'topics'}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          <button
            type="button"
            className="btn btn-primary sp-generate"
            onClick={generatePlan}
            disabled={!canGenerate}
          >
            {isGenerating ? (
              <Loader className="spin-icon" size={16} aria-hidden="true" />
            ) : (
              <RefreshCw size={16} aria-hidden="true" />
            )}
            {plan ? 'Regenerate plan' : 'Generate plan'}
          </button>

          {!canGenerate && !isGenerating && (
            <p className="sp-helper sp-helper--center">
              {!examDate || (daysToExam !== null && daysToExam <= 0)
                ? 'Choose a future exam date to continue.'
                : 'Select at least one subject to continue.'}
            </p>
          )}

          {plan && (
            <div className="sp-cram">
              <h3>
                <AlertTriangle size={16} aria-hidden="true" />
                Panic mode
              </h3>
              <p>
                Squeeze what's left into the days you have. If it gets too tight, lower-priority
                topics are dropped.
              </p>
              <button
                type="button"
                className="btn sp-cram-btn"
                onClick={handlePanicMode}
                disabled={isGenerating}
              >
                Compress my schedule
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
