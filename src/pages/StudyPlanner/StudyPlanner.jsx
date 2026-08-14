import React, { useState, useEffect, useRef } from 'react';
import { 
  getStudentProfile, 
  getAllSubjects, 
  getStudyPlan, 
  saveStudyPlan,
  getAllQuestionBanks
} from '../../data/repository';
import { db } from '../../data/db';
import { callOpenRouter, callOpenRouterVision, generateStudyPlanPrompt, generatePlanFromTimetablePrompt, extractJson } from '../../core/api/aiService';
import { Calendar, RefreshCw, Loader, CheckCircle, Target, BookOpen, Upload, FileImage } from 'lucide-react';
import { useToast } from '../../components/ToastProvider/ToastProvider';
import './StudyPlanner.css';

export default function StudyPlanner() {
  const [profile, setProfile] = useState(null);
  const [plan, setPlan] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('internal'); // 'internal' | 'timetable'
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const toast = useToast();

  useEffect(() => {
    loadProfileAndPlan();
  }, []);

  const loadProfileAndPlan = async () => {
    const prof = await getStudentProfile();
    setProfile(prof);
    if (prof) {
      const existingPlan = await getStudyPlan(prof.id);
      if (existingPlan && existingPlan.plan_data) {
        setPlan(existingPlan.plan_data);
      }
    }
  };

  const generatePlan = async () => {
    if (!profile) {
      toast("Please complete your profile first in the Dashboard.", "error");
      return;
    }

    setIsGenerating(true);
    try {
      const subjects = await getAllSubjects();
      const topics = await db.topics.toArray();
      const stats = await db.study_stats.toArray();
      const questionBanks = await getAllQuestionBanks();

      const messages = generateStudyPlanPrompt(profile, subjects, topics, stats, questionBanks);
      
      const responseText = await callOpenRouter(messages);
      const planData = extractJson(responseText);
      
      if (planData && planData.weekly_schedule) {
        await saveStudyPlan(profile.id, planData);
        setPlan(planData);
        toast("Study plan updated successfully!", "success");
      } else {
        throw new Error("Invalid response format from AI.");
      }
    } catch (err) {
      console.error(err);
      toast("Failed to generate study plan. Please try again.", "error");
    }
    setIsGenerating(false);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setSelectedImage(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = null;
  };

  const generatePlanFromTimetable = async () => {
    if (!selectedImage) {
      toast("Please select an image first.", "error");
      return;
    }
    setIsGenerating(true);
    try {
      const prompt = generatePlanFromTimetablePrompt();
      const responseText = await callOpenRouterVision(selectedImage, prompt);
      const planData = extractJson(responseText);
      
      if (planData && planData.weekly_schedule) {
        await saveStudyPlan(profile.id, planData);
        setPlan(planData);
        toast("Study plan generated from timetable!", "success");
        setSelectedImage(null);
        setActiveTab('internal'); // Switch back to view the plan
      } else {
        throw new Error("Invalid response format from AI.");
      }
    } catch (err) {
      console.error(err);
      toast("Failed to parse timetable. Try a clearer image.", "error");
    }
    setIsGenerating(false);
  };

  if (!profile) {
    return (
      <div className="empty-state">
        <BookOpen size={48} className="empty-icon" />
        <h3>Profile Required</h3>
        <p>Please complete your profile on the Dashboard to use the Study Planner.</p>
      </div>
    );
  }

  return (
    <div className="study-planner-container">
      <div className="planner-hero">
        <div className="hero-glow-planner"></div>
        <div className="planner-hero-content">
          <h1 className="planner-title">AI <span>Study Planner</span></h1>
          <p className="subtitle" style={{ color: 'var(--text-secondary)' }}>Optimize your learning schedule based on your performance.</p>
        </div>
        <div className="planner-controls">
          <div className="premium-tabs">
            <button 
              className={`premium-tab ${activeTab === 'internal' ? 'active' : ''}`}
              onClick={() => setActiveTab('internal')}
            >
              My Data Plan
            </button>
            <button 
              className={`premium-tab ${activeTab === 'timetable' ? 'active' : ''}`}
              onClick={() => setActiveTab('timetable')}
            >
              Upload Timetable
            </button>
          </div>
        </div>
      </div>

      {isGenerating && (
        <div className="empty-state" style={{ marginTop: '40px' }}>
          <Loader size={48} className="spin-icon empty-icon" />
          <h3>Generating your personalized plan...</h3>
          <p>This may take a few seconds as the AI analyzes your data.</p>
        </div>
      )}

      {!isGenerating && activeTab === 'timetable' && (
        <div className="timetable-upload-section">
          <FileImage size={48} color="#10b981" style={{ marginBottom: '16px' }} />
          <h3 style={{ color: 'var(--text-primary)', fontSize: '1.4rem', marginBottom: '8px' }}>Generate Plan from Timetable</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>
            Upload a clear image of your college timetable, exam schedule, or syllabus outline. The AI will extract it and build a structured study plan for you.
          </p>
          
          <input 
            type="file" 
            accept="image/*" 
            style={{ display: 'none' }} 
            ref={fileInputRef}
            onChange={handleImageSelect}
          />
          
          {selectedImage ? (
            <div style={{ marginBottom: '24px' }}>
              <img src={selectedImage} alt="Timetable Preview" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', objectFit: 'contain' }} />
              <div style={{ marginTop: '24px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
                <button className="btn-premium-secondary" onClick={() => setSelectedImage(null)}>Clear</button>
                <button className="btn-premium-primary" onClick={generatePlanFromTimetable}>
                  <Upload size={18} /> Generate Plan
                </button>
              </div>
            </div>
          ) : (
            <button className="btn-premium-primary" style={{ margin: '0 auto' }} onClick={() => fileInputRef.current.click()}>
              <FileImage size={18} /> Select Image
            </button>
          )}
        </div>
      )}

      {!isGenerating && activeTab === 'internal' && !plan && (
        <div className="empty-state" style={{ marginTop: '40px' }}>
          <Calendar size={48} className="empty-icon" />
          <h3>No Study Plan Yet</h3>
          <p>Click below to let the AI create a personalized schedule based on your subjects, topics, and question banks.</p>
          <button className="btn-premium-primary" onClick={generatePlan} style={{ marginTop: '24px' }}>
            <RefreshCw size={18} /> Generate Plan from My Data
          </button>
        </div>
      )}

      {!isGenerating && activeTab === 'internal' && plan && (
        <div style={{ marginTop: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
            <button className="btn-premium-secondary" onClick={generatePlan}>
              <RefreshCw size={16} /> Update Plan
            </button>
          </div>
          <div className="planner-content">
            <div className="planner-main">
              <div className="premium-planner-card">
                <h2 className="card-title-premium"><Calendar size={24} color="#10b981" /> Weekly Schedule</h2>
                <div className="weekly-schedule">
                  {plan.weekly_schedule?.map((day, idx) => (
                    <div key={idx} className="premium-day-card">
                      <h3>{day.day}</h3>
                      <div className="day-focus">Focus: {day.focus}</div>
                      <ul className="day-tasks">
                        {day.tasks.map((task, i) => (
                          <li key={i}>{task}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="planner-sidebar">
              <div className="premium-planner-card">
                <h2 className="card-title-premium"><Target size={24} color="#3b82f6" /> Daily Tasks</h2>
                <ul className="premium-list">
                  {plan.daily_plan?.map((task, i) => (
                    <li key={i}><CheckCircle size={18} color="#10b981" style={{ flexShrink: 0 }} /> <span>{task}</span></li>
                  ))}
                </ul>
              </div>

              <div className="premium-planner-card">
                <h2 className="card-title-premium"><BookOpen size={24} color="#f59e0b" /> Priority Topics</h2>
                <ul className="premium-list">
                  {plan.priority_topics?.map((topic, i) => (
                    <li key={i}><span>{topic}</span></li>
                  ))}
                </ul>
              </div>

              <div className="premium-planner-card">
                <h2 className="card-title-premium"><RefreshCw size={24} color="#8b5cf6" /> Revision Tasks</h2>
                <ul className="premium-list">
                  {plan.revision_tasks?.map((task, i) => (
                    <li key={i}><span>{task}</span></li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
