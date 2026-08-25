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
import { ArrowLeft, ArrowRight, RotateCcw, Loader, Copy, Trash2, Play, BrainCircuit } from 'lucide-react';
import MarkdownRenderer from '../../components/MarkdownRenderer/MarkdownRenderer';
import remarkGfm from 'remark-gfm';
import ReviewSession from '../../components/FlashcardsStudy/ReviewSession';
import './FlashcardsStudy.css';

export default function FlashcardsStudy() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [topic, setTopic] = useState(null);
  const [deck, setDeck] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [isReviewing, setIsReviewing] = useState(false);

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
          
          // Initial SRS fields
          const cardsWithSRS = cardsArray.map(card => ({
            ...card,
            interval: 0,
            repetitions: 0,
            easiness_factor: 2.5,
            next_review_date: new Date().toISOString().split('T')[0] // due today
          }));

          const savedCards = await saveFlashcards(newDeck.id, cardsWithSRS);
          
          setDeck(newDeck);
          setFlashcards(savedCards);
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

  if (loading) {
    return <div className="loading-container"><div className="spinner spinner-lg"></div></div>;
  }

  if (isReviewing && deck) {
    return (
      <div className="flashcards-container" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '2rem' }}>
        <ReviewSession 
          deckId={deck.id} 
          onFinish={() => {
            setIsReviewing(false);
            loadData(); // reload stats
          }} 
        />
      </div>
    );
  }

  // Calculate deck stats
  const today = new Date().toISOString().split('T')[0];
  const dueCards = flashcards.filter(c => !c.next_review_date || c.next_review_date <= today);
  const masteredCards = flashcards.filter(c => c.interval >= 21); // consider mastered if interval >= 21 days
  const learningCards = flashcards.filter(c => c.interval > 0 && c.interval < 21);
  const newCards = flashcards.filter(c => c.interval === 0);

  const masteryPercentage = flashcards.length > 0 ? Math.round((masteredCards.length / flashcards.length) * 100) : 0;

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
            <button className="btn btn-secondary btn-sm" onClick={() => {
              if (window.confirm('Regenerating will lose all your learning progress for this topic. Are you sure?')) {
                handleGenerate();
              }
            }} disabled={isGenerating}>
              {isGenerating ? <Loader size={14} className="spin-icon" /> : <RotateCcw size={14} />}
              Regenerate All
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
        <div className="deck-overview">
          <div className="glass-card overview-card">
            <BrainCircuit size={48} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{deck.title}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Spaced Repetition Active Recall</p>

            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem', textAlign: 'center' }}>
              <div className="stat-box" style={{ padding: '1rem', background: 'var(--bg-hover)', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text)' }}>{flashcards.length}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Cards</div>
              </div>
              <div className="stat-box" style={{ padding: '1rem', background: '#e0e7ff', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#4f46e5' }}>{dueCards.length}</div>
                <div style={{ fontSize: '0.8rem', color: '#4338ca' }}>Due Today</div>
              </div>
              <div className="stat-box" style={{ padding: '1rem', background: '#dcfce7', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#16a34a' }}>{masteryPercentage}%</div>
                <div style={{ fontSize: '0.8rem', color: '#15803d' }}>Mastery</div>
              </div>
              <div className="stat-box" style={{ padding: '1rem', background: '#fef3c7', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#d97706' }}>{learningCards.length}</div>
                <div style={{ fontSize: '0.8rem', color: '#b45309' }}>Learning</div>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <span>Deck Mastery</span>
                <span>{masteryPercentage}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--bg-hover)', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                <div style={{ width: `${masteryPercentage}%`, background: '#22c55e' }}></div>
                <div style={{ width: `${(learningCards.length / flashcards.length) * 100}%`, background: '#f59e0b' }}></div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%' }}></span> Mastered</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', background: '#f59e0b', borderRadius: '50%' }}></span> Learning</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '8px', height: '8px', background: 'var(--bg-hover)', borderRadius: '50%' }}></span> New</div>
              </div>
            </div>

            <button 
              className="btn btn-primary btn-lg" 
              style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}
              onClick={() => setIsReviewing(true)}
              disabled={dueCards.length === 0}
            >
              <Play size={20} /> 
              {dueCards.length > 0 ? `Study ${dueCards.length} Cards` : 'No Cards Due Today'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
