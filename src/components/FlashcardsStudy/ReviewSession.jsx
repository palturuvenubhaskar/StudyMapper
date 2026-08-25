import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import SwipeCard from './SwipeCard';
import MnemonicGenerator from './MnemonicGenerator';
import { calculateNextReview, mapRatingToSM2 } from '../../core/flashcards/srs';
import * as repository from '../../data/repository';

const ReviewSession = ({ deckId, onFinish }) => {
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reviewMessage, setReviewMessage] = useState('');

  useEffect(() => {
    const loadCards = async () => {
      try {
        const allCards = await repository.db.flashcards.where('deck_id').equals(deckId).toArray();
        
        const today = new Date().toISOString().split('T')[0];
        
        // Filter cards due today or earlier, or new cards (next_review_date is null/undefined)
        const dueCards = allCards.filter(c => {
          if (!c.next_review_date) return true;
          return c.next_review_date <= today;
        });

        // Shuffle cards
        dueCards.sort(() => 0.5 - Math.random());
        
        setCards(dueCards);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadCards();
  }, [deckId]);

  const handleSwipe = async (direction) => {
    // Map direction to 1-5 rating (simple for now: left = hard(2), right = good(4))
    const userRating = direction === 'left' ? 2 : 4;
    const sm2Rating = mapRatingToSM2(userRating);
    
    const card = cards[currentIndex];
    const { nextInterval, nextRepetitions, nextEF } = calculateNextReview(
      sm2Rating,
      card.interval || 0,
      card.repetitions || 0,
      card.easiness_factor || 2.5
    );

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + nextInterval);
    const nextDateStr = nextDate.toISOString().split('T')[0];

    // Update DB
    await repository.db.flashcards.update(card.id, {
      interval: nextInterval,
      repetitions: nextRepetitions,
      easiness_factor: nextEF,
      next_review_date: nextDateStr,
      last_review_date: new Date().toISOString()
    });

    setReviewMessage(`Next Review: ${nextInterval} day${nextInterval !== 1 ? 's' : ''}`);
    
    setTimeout(() => {
      setReviewMessage('');
      setCurrentIndex(prev => prev + 1);
    }, 1200);
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading your review queue...</div>;
  }

  if (currentIndex >= cards.length) {
    return (
      <div className="review-complete" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <CheckCircle2 size={64} style={{ color: '#10b981', margin: '0 auto 1.5rem auto' }} />
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#1f2937' }}>You're all caught up!</h2>
        <p style={{ color: '#6b7280', marginBottom: '2rem' }}>You've reviewed all {cards.length} cards due today.</p>
        <button className="btn btn-primary" onClick={onFinish}>
          <ArrowLeft size={18} /> Back to Deck Overview
        </button>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const progressPercent = (currentIndex / cards.length) * 100;

  return (
    <div className="review-session">
      <div className="review-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button className="btn btn-ghost btn-icon" onClick={onFinish} title="Exit Session">
          <ArrowLeft size={20} />
        </button>
        <div style={{ flex: 1, background: '#e5e7eb', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ background: '#4f46e5', height: '100%', width: `${progressPercent}%`, transition: 'width 0.3s' }}></div>
        </div>
        <span style={{ fontWeight: 600, color: '#4b5563' }}>{currentIndex + 1} / {cards.length}</span>
      </div>

      {reviewMessage ? (
        <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <CheckCircle2 size={48} style={{ color: '#10b981', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.5rem', color: '#10b981' }}>{reviewMessage}</h3>
        </div>
      ) : (
        <>
          <SwipeCard 
            key={currentCard.id} // Force re-render on card change
            flashcard={currentCard} 
            onSwipe={handleSwipe} 
          />
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem' }}>
            <button className="btn btn-outline" style={{ color: '#ef4444', borderColor: '#ef4444' }} onClick={() => handleSwipe('left')}>
              Don't Know (Left)
            </button>
            <button className="btn btn-outline" style={{ color: '#22c55e', borderColor: '#22c55e' }} onClick={() => handleSwipe('right')}>
              Know It (Right)
            </button>
          </div>
          <MnemonicGenerator flashcard={currentCard} />
        </>
      )}
    </div>
  );
};

export default ReviewSession;
