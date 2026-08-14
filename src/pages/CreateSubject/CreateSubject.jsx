import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { extractTextFromImage } from '../../core/ocr/ocrService';
import { extractSyllabusFromText } from '../../core/api/aiService';
import { saveSyllabus } from '../../data/repository';
import { useToast } from '../../components/ToastProvider/ToastProvider';
import { v4 as uuidv4 } from 'uuid';
import { Upload, Type, ArrowLeft, Loader, Plus, Trash2, GripVertical, Check, Edit3 } from 'lucide-react';
import './CreateSubject.css';

export default function CreateSubject() {
  const navigate = useNavigate();
  const toast = useToast();

  // Steps: 'choose' | 'ocr_processing' | 'manual_input' | 'review'
  const [step, setStep] = useState('choose');
  const [ocrProgress, setOcrProgress] = useState(0);
  const [aiProcessing, setAiProcessing] = useState(false);

  // Extracted/manual data
  const [subjectTitle, setSubjectTitle] = useState('');
  const [units, setUnits] = useState([]); // [{ id, title, topics: [{ id, title }] }]

  // Manual input state
  const [manualSubject, setManualSubject] = useState('');

  // ---- IMAGE UPLOAD ----
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setStep('ocr_processing');
      setOcrProgress(0);

      // Step 1: OCR
      const text = await extractTextFromImage(file, (p) => setOcrProgress(p));
      if (!text || text.trim().length === 0) {
        toast('Could not extract text from image. Try a clearer image.', 'error');
        setStep('choose');
        return;
      }

      // Step 2: AI extraction
      setAiProcessing(true);
      setStep('review'); // Show progressive parsing

      const result = await extractSyllabusFromText(text, (partialData) => {
        if (partialData.subject) setSubjectTitle(partialData.subject);
        if (partialData.units) {
          setUnits(partialData.units.map((u, i) => ({
            id: `stream-u-${i}`,
            title: u.title || `Unit ${i + 1}`,
            topics: (u.topics || []).map((t, j) => ({ id: `stream-t-${i}-${j}`, title: t })),
          })));
        }
      });
      
      setAiProcessing(false);

      if (!result || !result.units || result.units.length === 0) {
        toast('AI could not parse the syllabus structure. Try manual input.', 'error');
        setStep('choose');
        return;
      }

      // Map final results to UUIDs for editing safety
      setSubjectTitle(result.subject || 'New Subject');
      setUnits(result.units.map((u, i) => ({
        id: uuidv4(),
        title: u.title || `Unit ${i + 1}`,
        topics: (u.topics || []).map(t => ({ id: uuidv4(), title: t })),
      })));
    } catch (err) {
      console.error(err);
      toast(err.message || 'Something went wrong during extraction.', 'error');
      setStep('choose');
    }
  };

  // ---- MANUAL INPUT ----
  const startManualInput = () => {
    setStep('manual_input');
  };

  const handleManualNext = () => {
    if (!manualSubject.trim()) {
      toast('Please enter a subject name.', 'error');
      return;
    }
    setSubjectTitle(manualSubject.trim());
    setUnits([{ id: uuidv4(), title: 'Unit 1', topics: [] }]);
    setStep('review');
  };

  // ---- REVIEW EDITING ----
  const addUnit = () => {
    setUnits([...units, { id: uuidv4(), title: `Unit ${units.length + 1}`, topics: [] }]);
  };

  const updateUnitTitle = (unitId, newTitle) => {
    setUnits(units.map(u => u.id === unitId ? { ...u, title: newTitle } : u));
  };

  const deleteUnit = (unitId) => {
    setUnits(units.filter(u => u.id !== unitId));
  };

  const addTopic = (unitId) => {
    setUnits(units.map(u => u.id === unitId ? {
      ...u,
      topics: [...u.topics, { id: uuidv4(), title: '' }],
    } : u));
  };

  const updateTopicTitle = (unitId, topicId, newTitle) => {
    setUnits(units.map(u => u.id === unitId ? {
      ...u,
      topics: u.topics.map(t => t.id === topicId ? { ...t, title: newTitle } : t),
    } : u));
  };

  const deleteTopic = (unitId, topicId) => {
    setUnits(units.map(u => u.id === unitId ? {
      ...u,
      topics: u.topics.filter(t => t.id !== topicId),
    } : u));
  };

  const moveUnit = (index, direction) => {
    const newUnits = [...units];
    const target = index + direction;
    if (target < 0 || target >= newUnits.length) return;
    [newUnits[index], newUnits[target]] = [newUnits[target], newUnits[index]];
    setUnits(newUnits);
  };

  const moveTopic = (unitId, topicIndex, direction) => {
    setUnits(units.map(u => {
      if (u.id !== unitId) return u;
      const newTopics = [...u.topics];
      const target = topicIndex + direction;
      if (target < 0 || target >= newTopics.length) return u;
      [newTopics[topicIndex], newTopics[target]] = [newTopics[target], newTopics[topicIndex]];
      return { ...u, topics: newTopics };
    }));
  };

  // ---- SAVE ----
  const handleSave = async () => {
    if (!subjectTitle.trim()) {
      toast('Subject name cannot be empty.', 'error');
      return;
    }
    // Filter out empty topics
    const cleanUnits = units.filter(u => u.title.trim());
    if (cleanUnits.length === 0) {
      toast('Add at least one unit.', 'error');
      return;
    }

    const subjectId = uuidv4();
    const subject = {
      id: subjectId,
      title: subjectTitle.trim(),
      created_at: new Date().toISOString(),
      progress_percentage: 0,
    };

    const dbUnits = cleanUnits.map((u, i) => ({
      id: u.id,
      subject_id: subjectId,
      title: u.title.trim(),
      order_index: i,
    }));

    const dbTopics = [];
    cleanUnits.forEach(u => {
      u.topics.filter(t => t.title.trim()).forEach((t, j) => {
        dbTopics.push({
          id: t.id,
          unit_id: u.id,
          title: t.title.trim(),
          order_index: j,
          has_content: 0,
        });
      });
    });

    try {
      await saveSyllabus(subject, dbUnits, dbTopics);
      toast('Subject saved!', 'success');
      navigate('/');
    } catch (err) {
      console.error(err);
      toast('Failed to save subject.', 'error');
    }
  };

  // ---- RENDERS ----
  if (step === 'choose') {
    return (
      <div className="create-page">

        <div className="create-hero">
          <h1>Create a New Subject</h1>
          <p>Upload a syllabus image for AI extraction, or type your syllabus manually.</p>
        </div>
        <div className="create-options">
          <label className="glass-card create-option" htmlFor="image-upload">
            <Upload size={40} />
            <h3>Upload Syllabus Image</h3>
            <p>Photo of a syllabus, textbook index, or handwritten notes</p>
            <input type="file" id="image-upload" accept="image/*" hidden onChange={handleImageUpload} />
          </label>
          <div className="glass-card create-option" onClick={startManualInput}>
            <Type size={40} />
            <h3>Type Manually</h3>
            <p>Add subject, units, and topics one by one</p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'ocr_processing') {
    return (
      <div className="create-page">
        <div className="loading-container">
          <div className="spinner spinner-lg"></div>
          {!aiProcessing ? (
            <>
              <h3>Extracting text from image...</h3>
              <div className="progress-bar" style={{ width: '300px' }}>
                <div className="progress-bar-fill" style={{ width: `${ocrProgress}%` }}></div>
              </div>
              <p>{ocrProgress}% complete</p>
            </>
          ) : (
            <>
              <h3>AI is parsing your syllabus...</h3>
              <p>Identifying subjects, units, and topics</p>
            </>
          )}
        </div>
      </div>
    );
  }

  if (step === 'manual_input') {
    return (
      <div className="create-page">
        <button className="btn btn-ghost back-btn" onClick={() => setStep('choose')}>
          <ArrowLeft size={18} /> Back
        </button>
        <div className="create-hero">
          <h1>Enter Subject Name</h1>
          <p>You can add units and topics in the next step.</p>
        </div>
        <div className="manual-form glass-card">
          <input
            className="input"
            placeholder="e.g. Operating Systems, Data Structures..."
            value={manualSubject}
            onChange={(e) => setManualSubject(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleManualNext()}
            autoFocus
          />
          <button className="btn btn-primary btn-lg" onClick={handleManualNext}>
            Continue to Structure <ArrowLeft size={16} style={{ transform: 'rotate(180deg)' }} />
          </button>
        </div>
      </div>
    );
  }

  // step === 'review'
  return (
    <div className="create-page">
      <button className="btn btn-ghost back-btn" onClick={() => setStep('choose')}>
        <ArrowLeft size={18} /> Start Over
      </button>

      <div className="review-header">
        <div className="review-subject-edit">
          <label>Subject Name</label>
          <input
            className="input subject-name-input"
            value={subjectTitle}
            onChange={(e) => setSubjectTitle(e.target.value)}
          />
        </div>
        <div className="review-actions">
          <button className="btn btn-secondary" onClick={addUnit}>
            <Plus size={16} /> Add Unit
          </button>
          <button className="btn btn-primary btn-lg" onClick={handleSave}>
            <Check size={16} /> Save Subject
          </button>
        </div>
      </div>

      <div className="review-units">
        {units.map((unit, ui) => (
          <div key={unit.id} className="glass-card review-unit">
            <div className="unit-header">
              <div className="unit-reorder">
                <button className="btn btn-ghost btn-icon" onClick={() => moveUnit(ui, -1)} disabled={ui === 0}>▲</button>
                <button className="btn btn-ghost btn-icon" onClick={() => moveUnit(ui, 1)} disabled={ui === units.length - 1}>▼</button>
              </div>
              <input
                className="input unit-title-input"
                value={unit.title}
                onChange={(e) => updateUnitTitle(unit.id, e.target.value)}
                placeholder="Unit title"
              />
              <button className="btn btn-danger btn-sm" onClick={() => deleteUnit(unit.id)}>
                <Trash2 size={14} />
              </button>
            </div>

            <div className="unit-topics">
              {unit.topics.map((topic, ti) => (
                <div key={topic.id} className="topic-row">
                  <div className="topic-reorder">
                    <button className="btn btn-ghost btn-icon" onClick={() => moveTopic(unit.id, ti, -1)} disabled={ti === 0}>▲</button>
                    <button className="btn btn-ghost btn-icon" onClick={() => moveTopic(unit.id, ti, 1)} disabled={ti === unit.topics.length - 1}>▼</button>
                  </div>
                  <input
                    className="input topic-input"
                    value={topic.title}
                    onChange={(e) => updateTopicTitle(unit.id, topic.id, e.target.value)}
                    placeholder="Topic title"
                  />
                  <button className="btn btn-ghost btn-icon" onClick={() => deleteTopic(unit.id, topic.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button className="btn btn-secondary btn-sm add-topic-btn" onClick={() => addTopic(unit.id)}>
                <Plus size={14} /> Add Topic
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
