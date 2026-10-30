import React, { useState, useEffect, useRef } from 'react';
import './SwipeCard.css';

// Smaller type as the card text grows, so long definitions still fit nicely.
const getDensity = (text = '') => {
  const length = String(text).length;
  if (length <= 70) return 'xl';
  if (length <= 150) return 'lg';
  if (length <= 300) return 'md';
  return 'sm';
};

const CardFace = ({ text, tag, side, variant, hint, overlay }) => {
  const bodyRef = useRef(null);
  const textRef = useRef(null);
  const [fade, setFade] = useState('none');

  // Fade the text where it is cut off, so it is obvious there is more to read.
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;

    const update = () => {
      const overflow = el.scrollHeight - el.clientHeight > 4;
      if (!overflow) {
        setFade('none');
        return;
      }
      const atTop = el.scrollTop <= 2;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
      setFade(atTop ? 'bottom' : atBottom ? 'top' : 'both');
    };

    update();
    el.addEventListener('scroll', update, { passive: true });

    // Re-check on resize (rotation, window resize) and when the text reflows.
    const observer = new ResizeObserver(update);
    observer.observe(el);
    if (textRef.current) observer.observe(textRef.current);

    return () => {
      el.removeEventListener('scroll', update);
      observer.disconnect();
    };
  }, [text]);

  return (
    <div className={`sc-face sc-face-${variant}`}>
      <div className="sc-head">
        <span className="sc-tag">{tag || 'General'}</span>
        <span className="sc-side">{side}</span>
      </div>

      <div ref={bodyRef} className="sc-body" data-fade={fade}>
        <p ref={textRef} className={`sc-text sc-text-${getDensity(text)}`}>
          {text}
        </p>
      </div>

      {hint && <div className="sc-foot">{hint}</div>}
      {overlay}
    </div>
  );
};

const SwipeCard = ({ flashcard, onSwipe, frontOnly = false }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // State for dragging
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const draggedRef = useRef(false);

  // Reset state when flashcard changes
  useEffect(() => {
    setIsFlipped(false);
    setCurrentX(0);
    setIsDragging(false);
    draggedRef.current = false;
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
    draggedRef.current = false;
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || frontOnly) return;
    const x = e.touches[0].clientX - startX;
    if (Math.abs(x) > 8) draggedRef.current = true;
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

  const handleClick = () => {
    if (frontOnly) return;
    // A click that ends a drag should not flip the card.
    if (draggedRef.current) {
      draggedRef.current = false;
      return;
    }
    setIsFlipped(true);
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

  const swipeBadge = isDragging && (
    <>
      {currentX > 20 && <div className="sc-swipe sc-swipe-right">KNOW IT</div>}
      {currentX < -20 && <div className="sc-swipe sc-swipe-left">DON'T KNOW</div>}
    </>
  );

  return (
    <div className="swipe-card-container">
      <div
        className={`swipe-card ${isFlipped ? 'flipped' : ''} ${isDragging ? 'dragging' : ''}`}
        style={cardStyle}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="swipe-card-inner">
          <CardFace
            variant="front"
            side={frontOnly ? 'Card' : 'Prompt'}
            tag={flashcard.tag}
            text={flashcard.front}
            hint={!frontOnly ? 'Tap or press Space to reveal' : null}
            overlay={swipeBadge}
          />

          <CardFace
            variant="back"
            side="Answer"
            tag={flashcard.tag}
            text={flashcard.back}
          />
        </div>
      </div>
    </div>
  );
};

export default SwipeCard;
