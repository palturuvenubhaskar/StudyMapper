import React, { useState, useEffect } from 'react';
import { getStudentProfile, getAllSubjects, getStudyPlan } from '../../data/repository';
import { generateAdaptivePlan, triggerPanicMode } from '../../core/planner/adaptivePlanner';
import { downloadIcsFile } from '../../core/planner/icalExport';
import { Calendar, RefreshCw, Loader, AlertTriangle, Download, BookOpen } from 'lucide-react';
import { useToast } from '../../components/ToastProvider/ToastProvider';
import './StudyPlanner.css';

export default function StudyPlanner() {
  const [profile, setProfile] = useState(null);
  const [plan, setPlan] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [examDate, setExamDate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const toast = useToast();

  useEffect(() => {
    loadProfileAndData();
  }, []);

  const loadProfileAndData = async () => {
    const prof = await getStudentProfile();
    setProfile(prof);
    const subs = await getAllSubjects();
    setSubjects(subs);
    if (prof) {
      const existingPlan = await getStudyPlan(prof.id);
      if (existingPlan && existingPlan.plan_json) {
        setPlan(existingPlan);
        setSchedule(JSON.parse(existingPlan.plan_json));
        setExamDate(existingPlan.exam_date || '');
      }
    }
  };

  const handleSubjectToggle = (id) => {
    setSelectedSubjects(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const generatePlan = async () => {
    if (!examDate) {
      toast("Please select an exam date", "error");
      return;
    }
    if (selectedSubjects.length === 0) {
      toast("Please select at least one subject", "error");
      return;
    }

    setIsGenerating(true);
    try {
      const newPlan = await generateAdaptivePlan(profile.id, examDate, selectedSubjects);
      setPlan(newPlan);
      setSchedule(JSON.parse(newPlan.plan_json));
      toast("Adaptive study plan generated successfully!", "success");
    } catch (err) {
      console.error(err);
      toast("Failed to generate plan: " + err.message, "error");
    }
    setIsGenerating(false);
  };

  const handlePanicMode = async () => {
    if (!plan) return;
    if (window.confirm("Panic Mode will forcefully compress your remaining tasks into the days left, potentially dropping low-priority tasks. Continue?")) {
      setIsGenerating(true);
      try {
        const updatedPlan = await triggerPanicMode(plan.id, []); // pass completed topic IDs here if we were tracking them in state
        setPlan(updatedPlan);
        setSchedule(JSON.parse(updatedPlan.plan_json));
        toast("Panic mode activated. Schedule compressed.", "warning");
      } catch (err) {
        console.error(err);
        toast("Failed to activate panic mode.", "error");
      }
      setIsGenerating(false);
    }
  };

  const handleExport = () => {
    if (!schedule) return;
    downloadIcsFile(schedule);
    toast("Calendar file downloaded!", "success");
  };

  if (!profile) {
    return (
      <div className="empty-state" style={{ background: 'transparent', border: 'none', height: '100%', flex: 1, marginTop: 0 }}>
        <BookOpen size={48} className="empty-icon" />
        <h3>Profile Required</h3>
        <p>Please complete your profile first.</p>
      </div>
    );
  }

  return (
    <div className="study-planner-container">
      <div className="planner-hero">
        <div className="hero-glow-planner"></div>
        <div className="planner-hero-content">
          <h1 className="planner-title">Smart <span>Planner 2.0</span></h1>
          <p className="subtitle" style={{ color: 'var(--text-secondary)' }}>Adaptive schedule based on topic difficulty and exam date.</p>
        </div>
      </div>

      <div className="planner-content">
        <div className="planner-sidebar" style={{ minWidth: '300px' }}>
          <div className="premium-planner-card">
            <h2 className="card-title-premium"><Calendar size={20} color="#10b981" /> Configuration</h2>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Target Exam Date</label>
              <input 
                type="date" 
                className="input-field w-full" 
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Target Subjects</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {subjects.map(s => (
                  <label key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={selectedSubjects.includes(s.id)}
                      onChange={() => handleSubjectToggle(s.id)}
                    />
                    {s.title}
                  </label>
                ))}
              </div>
            </div>

            <button 
              className="btn-premium-primary w-full" 
              onClick={generatePlan}
              disabled={isGenerating}
              style={{ marginTop: '16px', justifyContent: 'center' }}
            >
              {isGenerating ? <Loader className="spin-icon" size={18} /> : <RefreshCw size={18} />}
              {plan ? 'Regenerate Plan' : 'Generate Adaptive Plan'}
            </button>
          </div>

          {plan && (
            <div className="premium-planner-card" style={{ marginTop: '16px' }}>
              <h2 className="card-title-premium">Actions</h2>
              <button className="btn-premium-secondary w-full" onClick={handleExport} style={{ marginBottom: '12px', justifyContent: 'center' }}>
                <Download size={18} /> Export to Calendar
              </button>
              <button className="btn w-full" onClick={handlePanicMode} style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', justifyContent: 'center' }}>
                <AlertTriangle size={18} /> PANIC MODE
              </button>
            </div>
          )}
        </div>

        <div className="planner-main">
          {isGenerating ? (
             <div className="empty-state" style={{ marginTop: '40px' }}>
                <Loader size={48} className="spin-icon empty-icon" />
                <h3>Generating your adaptive plan...</h3>
             </div>
          ) : schedule ? (
            <div className="premium-planner-card">
              <h2 className="card-title-premium">Day-by-Day Schedule</h2>
              <div className="weekly-schedule">
                {Object.entries(schedule).map(([dayIdx, tasks]) => (
                  <div key={dayIdx} className="premium-day-card" style={{ marginBottom: '16px' }}>
                    <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '8px' }}>Day {parseInt(dayIdx) + 1}</h3>
                    {tasks.length === 0 ? (
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Rest day / No tasks scheduled</p>
                    ) : (
                      <ul className="day-tasks" style={{ paddingLeft: '20px', margin: 0 }}>
                        {tasks.map((task, i) => (
                          <li key={i} style={{ padding: '4px 0' }}>
                            <strong>{task.title}</strong> <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>({task.durationMinutes}m)</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-state" style={{ marginTop: '40px' }}>
              <Calendar size={48} className="empty-icon" />
              <h3>No Adaptive Plan Yet</h3>
              <p>Select your exam date and subjects on the left to generate an intelligent study schedule.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
