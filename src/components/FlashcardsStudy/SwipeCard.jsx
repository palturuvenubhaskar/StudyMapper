import React, { useState, useEffect } from 'react';
import './SwipeCard.css';

const SwipeCard = ({ flashcard, onSwipe, frontOnly = false }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  // State for dragging
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Reset state when flashcard changes
  useEffect(() => {
    setIsFlipped(false);
    setCurrentX(0);
    setIsDragging(false);
  }, [flashcard]);

  useEffect(() => {
    // Keyboard controls for desktop
    const handleKeyDown = (e) => {
      if (frontOnly) return;
      if (e.key === ' ' || e.key === 'Enter') {
        setIsFlipped(true);
        e.preventDefault();
      } else if (isFlipped) {
        if (e.key === 'ArrowLeft') {
          onSwipe('left');
          e.preventDefault();
        } else if (e.key === 'ArrowRight') {
          onSwipe('right');
          e.preventDefault();
        } else if (e.key === 'ArrowUp') {
          onSwipe('up');
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, onSwipe, frontOnly]);

  const handleTouchStart = (e) => {
    if (frontOnly) return;
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || frontOnly) return;
    const x = e.touches[0].clientX - startX;
    setCurrentX(x);
  };

  const handleTouchEnd = () => {
    if (frontOnly) return;
    setIsDragging(false);
    
    // Threshold for swipe
    if (currentX > 100) {
      onSwipe('right'); // Easy / Know it
    } else if (currentX < -100) {
      onSwipe('left'); // Hard / Don't know
    } else {
      // Snap back if not swiped far enough
      setCurrentX(0);
    }
  };

  // Card transform based on drag
  const rotation = currentX * 0.05;
  const opacity = Math.max(0, 1 - Math.abs(currentX) / 500);

  const cardStyle = {
    transform: isDragging 
      ? `translateX(${currentX}px) rotate(${rotation}deg)` 
      : 'translateX(0) rotate(0)',
    opacity: isDragging ? opacity : 1,
    transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
  };

  return (
    <div className="swipe-card-container">
      <div 
        className={`swipe-card ${isFlipped ? 'flipped' : ''} ${isDragging ? 'dragging' : ''}`}
        style={cardStyle}
        onClick={() => !frontOnly && setIsFlipped(true)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="swipe-card-inner">
          <div className="swipe-card-front">
            <div className="card-tag badge badge-primary">{flashcard.tag || 'General'}</div>
            <div className="card-content">{flashcard.front}</div>
            {!isFlipped && !frontOnly && (
              <div className="card-hint">Tap or press Space to reveal</div>
            )}
          </div>
          <div className="swipe-card-back">
            <div className="card-tag badge badge-primary">{flashcard.tag || 'General'}</div>
            <div className="card-content">{flashcard.back}</div>
            
            {/* Action hints overlay when dragging */}
            {isDragging && currentX > 20 && (
              <div className="swipe-overlay right-overlay">KNOW IT</div>
            )}
            {isDragging && currentX < -20 && (
              <div className="swipe-overlay left-overlay">DON'T KNOW</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwipeCard;
