import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { extractTextFromFile } from '../../core/ocr/fileParserService';
import { extractQuestionsFromText } from '../../core/api/aiService';
import { createQuestionBank } from '../../data/repository';
import { useToast } from '../../components/ToastProvider/ToastProvider';
import { ArrowLeft, Upload, FileText, Check, Loader, Plus, Trash2, Edit2 } from 'lucide-react';
import './CreateQuestionBank.css';

export default function CreateQuestionBank() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [step, setStep] = useState(1);
  const [bankTitle, setBankTitle] = useState('Question Bank ' + new Date().toLocaleDateString());
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [questions, setQuestions] = useState([]);
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const processFile = async () => {
    if (!file) return;
    setProcessing(true);
    toast('Extracting text from file...', 'info');

    try {
      const text = await extractTextFromFile(file);
      toast('Text extracted. Parsing questions via AI...', 'info');
      
      setStep(2); // Show the UI progressively
      const extractedQs = await extractQuestionsFromText(text, (partialQs) => {
        setQuestions(partialQs);
      });
      
      if (extractedQs && extractedQs.length > 0) {
        setQuestions(extractedQs);
        toast('Questions extracted successfully!', 'success');
      } else {
        toast('Could not find any questions in the file.', 'error');
        setStep(1);
      }
    } catch (err) {
      console.error(err);
      toast('Failed to process file: ' + err.message, 'error');
      setStep(1);
    }
    
    setProcessing(false);
  };

  const handleSave = async () => {
    if (!bankTitle.trim() || questions.length === 0) return;
    setProcessing(true);
    try {
      const bankId = await createQuestionBank(subjectId, bankTitle, questions);
      toast('Question Bank saved!', 'success');
      if (subjectId) {
        navigate(`/subject/${subjectId}`);
      } else {
        navigate(`/qb/${bankId}`);
      }
    } catch (err) {
      console.error(err);
      toast('Failed to save', 'error');
    }
    setProcessing(false);
  };

  return (
    <div className="create-qb-page">
      {subjectId && (
        <button className="btn btn-ghost back-btn" onClick={() => navigate(`/subject/${subjectId}`)}>
          <ArrowLeft size={18} /> Back to Subject
        </button>
      )}
      
      <h1>Upload Question Bank</h1>
      
      {step === 1 && (
        <div className="glass-card upload-section">
          <div className="form-group">
            <label>Question Bank Title</label>
            <input 
              className="input" 
              value={bankTitle} 
              onChange={(e) => setBankTitle(e.target.value)} 
              placeholder="e.g. Midterm 2023 Questions" 
            />
          </div>
          
          <div className="file-upload-box">
            <Upload size={32} />
            <p>Select a PDF, DOCX, or Image (PNG/JPG)</p>
            <input type="file" accept=".pdf,.docx,.doc,image/*" onChange={handleFileChange} />
            {file && <span className="badge badge-accent"><FileText size={12}/> {file.name}</span>}
          </div>
          
          <button 
            className="btn btn-primary btn-lg mt-4" 
            onClick={processFile} 
            disabled={!file || !bankTitle.trim() || processing}
          >
            {processing ? <><Loader size={18} className="spin-icon" /> Processing...</> : 'Extract Questions'}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="review-section">
          <div className="review-header">
            <h3>Review Extracted Questions ({questions.length})</h3>
            <button className="btn btn-primary" onClick={handleSave} disabled={processing}>
              {processing ? <Loader size={16} className="spin-icon" /> : <Check size={16} />} Save Question Bank
            </button>
          </div>
          
          <div className="questions-list">
            {questions.map((q, idx) => (
              <div key={idx} className="glass-card question-item">
                <div className="q-content">
                  <div className="q-header">
                    <span className="badge badge-accent">Q{idx + 1}</span>
                    <input 
                      className="input marks-input" 
                      value={q.marks} 
                      onChange={(e) => {
                        const newQs = [...questions];
                        newQs[idx].marks = e.target.value;
                        setQuestions(newQs);
                      }} 
                      placeholder="Marks"
                    />
                  </div>
                  <textarea 
                    className="textarea q-text" 
                    value={q.text} 
                    onChange={(e) => {
                      const newQs = [...questions];
                      newQs[idx].text = e.target.value;
                      setQuestions(newQs);
                    }}
                    rows={2}
                  />
                </div>
                <button 
                  className="btn btn-ghost btn-icon" 
                  onClick={() => setQuestions(questions.filter((_, i) => i !== idx))}
                >
                  <Trash2 size={16} color="var(--danger)" />
                </button>
              </div>
            ))}
            
            <button 
              className="btn btn-secondary dashed-btn" 
              onClick={() => setQuestions([...questions, { text: '', marks: 'Unknown' }])}
            >
              <Plus size={16} /> Add Question Manually
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
