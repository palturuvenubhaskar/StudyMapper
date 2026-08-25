import React, { useState } from 'react';
import { generateQuestionVariant } from '../../core/api/aiService';
import * as repository from '../../data/repository';
import { CopyPlus, Loader2 } from 'lucide-react';
import './MockExam.css';

const QuestionVariantGenerator = ({ originalQuestion, onVariantGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const variant = await generateQuestionVariant(originalQuestion.text, originalQuestion.marks);
      
      if (variant && variant.text) {
        // Save to database
        const variantRecord = {
          original_question_id: originalQuestion.id,
          text: variant.text,
          marks: variant.marks || originalQuestion.marks,
          created_at: new Date().toISOString()
        };
        
        const id = await repository.db.question_variants.add(variantRecord);
        
        if (onVariantGenerated) {
          onVariantGenerated({ ...variantRecord, id });
        }
      } else {
        throw new Error("Invalid response format from AI");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to generate a variant. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="variant-generator">
      <button 
        className="btn btn-outline btn-sm variant-btn" 
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? <Loader2 size={16} className="spin-icon" /> : <CopyPlus size={16} />}
        {loading ? 'Generating...' : 'Generate Similar Question'}
      </button>
      {error && <span className="variant-error">{error}</span>}
    </div>
  );
};

export default QuestionVariantGenerator;
