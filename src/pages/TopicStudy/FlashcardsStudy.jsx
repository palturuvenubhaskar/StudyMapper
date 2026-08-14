import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../data/db';
import { 
  getLatestTopicContent, 
  getFlashcardDeckForTopic, 
  createFlashcardDeck, 
  saveFlashcards, 
  getFlashcardsForDeck,
  deleteFlashcardDeck
} from '../../data/repository';
import { callOpenRouter, generateFlashcardsPrompt } from '../../core/api/aiService';
import { useToast } from '../../components/ToastProvider/ToastProvider';
import { ArrowLeft, ArrowRight, RotateCcw, Loader, Copy, Trash2 } from 'lucide-react';
import MarkdownRenderer from '../../components/MarkdownRenderer/MarkdownRenderer';
import remarkGfm from 'remark-gfm';
import './FlashcardsStudy.css';

export default function FlashcardsStudy() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [topic, setTopic] = useState(null);
  const [deck, setDeck] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [topicId]);

  const loadData = async () => {
    setLoading(true);
    const t = await db.topics.get(topicId);
    if (!t) {
      navigate('/');
      return;
    }
    setTopic(t);

    const existingDeck = await getFlashcardDeckForTopic(topicId);
    if (existingDeck) {
      setDeck(existingDeck);
      const cards = await getFlashcardsForDeck(existingDeck.id);
      setFlashcards(cards);
    }
    setLoading(false);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const existingContent = await getLatestTopicContent(topicId);
      const contentString = existingContent ? existingContent.generated_json : topic.title;

      const messages = generateFlashcardsPrompt(topic.title, contentString);
      const responseText = await callOpenRouter(messages);

      // Extract JSON array
      const jsonStart = responseText.indexOf('[');
      const jsonEnd = responseText.lastIndexOf(']');
      
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const cardsArray = JSON.parse(responseText.substring(jsonStart, jsonEnd + 1));
        
        if (cardsArray && cardsArray.length > 0) {
          // If we had an old deck, delete it
          if (deck) {
            await deleteFlashcardDeck(deck.id);
          }
          
          const newDeck = await createFlashcardDeck(topicId, `${topic.title} Flashcards`);
          const savedCards = await saveFlashcards(newDeck.id, cardsArray);
          
          setDeck(newDeck);
          setFlashcards(savedCards);
          setCurrentIndex(0);
          setIsFlipped(false);
          toast("Flashcards generated successfully!", "success");
        } else {
          throw new Error("No flashcards returned.");
        }
      } else {
        throw new Error("Invalid response format from AI.");
      }
    } catch (err) {
      console.error(err);
      toast("Failed to generate flashcards. Please try again.", "error");
    }
    setIsGenerating(false);
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev + 1), 150); // slight delay for unflip
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev - 1), 150);
    }
  };

  if (loading) {
    return <div className="loading-container"><div className="spinner spinner-lg"></div></div>;
  }

  return (
    <div className="flashcards-container">
      <div className="flashcards-header">
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Back
        </button>
        <div className="flashcards-title">
          <h1>Flashcards</h1>
          <p>{topic?.title}</p>
        </div>
        <div>
          {deck && (
            <button className="btn btn-secondary btn-sm" onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? <Loader size={14} className="spin-icon" /> : <RotateCcw size={14} />}
              Regenerate
            </button>
          )}
        </div>
      </div>

      {!deck && !isGenerating && (
        <div className="empty-state">
          <Copy size={64} className="empty-icon" />
          <h2>No Flashcards Yet</h2>
          <p>Generate AI-powered interactive flashcards specifically tailored to this topic.</p>
          <button className="btn btn-primary btn-lg" onClick={handleGenerate}>
            Generate Flashcards
          </button>
        </div>
      )}

      {isGenerating && (
        <div className="empty-state">
          <Loader size={64} className="spin-icon empty-icon" />
          <h2>Generating Flashcards...</h2>
          <p>Extracting high-yield concepts from the topic. This takes a few seconds.</p>
        </div>
      )}

      {deck && flashcards.length > 0 && !isGenerating && (
        <>
          <div className="card-viewport" onClick={() => setIsFlipped(!isFlipped)}>
            <div className={`flashcard ${isFlipped ? 'flipped' : ''}`}>
              {/* Front */}
              <div className="card-face front">
                {flashcards[currentIndex].tag && (
                  <div className="card-tag">{flashcards[currentIndex].tag}</div>
                )}
                <div className="card-content">
                  <MarkdownRenderer remarkPlugins={[remarkGfm]} components={{ p: 'span' }}>{flashcards[currentIndex].front}</MarkdownRenderer>
                </div>
                <div className="card-hint">
                  <RotateCcw size={14} /> Click to flip
                </div>
              </div>

              {/* Back */}
              <div className="card-face back">
                {flashcards[currentIndex].tag && (
                  <div className="card-tag">{flashcards[currentIndex].tag}</div>
                )}
                <div className="card-content">
                  <MarkdownRenderer remarkPlugins={[remarkGfm]} components={{ p: 'span' }}>{flashcards[currentIndex].back}</MarkdownRenderer>
                </div>
              </div>
            </div>
          </div>

          <div className="flashcards-controls">
            <button 
              className="btn btn-secondary btn-lg btn-icon" 
              onClick={handlePrev} 
              disabled={currentIndex === 0}
            >
              <ArrowLeft size={24} />
            </button>
            <span className="progress-text">
              {currentIndex + 1} / {flashcards.length}
            </span>
            <button 
              className="btn btn-secondary btn-lg btn-icon" 
              onClick={handleNext} 
              disabled={currentIndex === flashcards.length - 1}
            >
              <ArrowRight size={24} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
