import { describe, it, expect } from 'vitest';
import { calculateNextReview, mapRatingToSM2 } from './srs';

describe('SM-2 SRS Algorithm', () => {
  it('correctly schedules a new card with a correct response (rating 4)', () => {
    const { nextInterval, nextRepetitions, nextEF } = calculateNextReview(4, 0, 0, 2.5);
    
    expect(nextInterval).toBe(1);
    expect(nextRepetitions).toBe(1);
    // EF should not change for rating 4
    expect(nextEF).toBeCloseTo(2.5);
  });

  it('correctly schedules a card on its second successful review (rating 4)', () => {
    const { nextInterval, nextRepetitions, nextEF } = calculateNextReview(4, 1, 1, 2.5);
    
    expect(nextInterval).toBe(6);
    expect(nextRepetitions).toBe(2);
    expect(nextEF).toBeCloseTo(2.5);
  });

  it('correctly scales the interval for subsequent successful reviews', () => {
    const { nextInterval, nextRepetitions, nextEF } = calculateNextReview(4, 6, 2, 2.5);
    
    expect(nextInterval).toBe(15); // Math.round(6 * 2.5)
    expect(nextRepetitions).toBe(3);
    expect(nextEF).toBeCloseTo(2.5);
  });

  it('increases EF for perfect responses (rating 5)', () => {
    const { nextInterval, nextRepetitions, nextEF } = calculateNextReview(5, 6, 2, 2.5);
    
    expect(nextEF).toBeGreaterThan(2.5);
    expect(nextEF).toBeCloseTo(2.6);
  });

  it('decreases EF for hard responses (rating 3)', () => {
    const { nextInterval, nextRepetitions, nextEF } = calculateNextReview(3, 6, 2, 2.5);
    
    expect(nextEF).toBeLessThan(2.5);
    expect(nextEF).toBeCloseTo(2.36);
  });

  it('resets repetitions and interval for incorrect responses (rating < 3)', () => {
    const { nextInterval, nextRepetitions, nextEF } = calculateNextReview(2, 6, 2, 2.5);
    
    expect(nextInterval).toBe(1);
    expect(nextRepetitions).toBe(0);
    expect(nextEF).toBeLessThan(2.5); // EF should drop
  });

  it('never drops EF below 1.3', () => {
    let ef = 1.35;
    const { nextEF } = calculateNextReview(1, 1, 0, ef); // Very bad response
    expect(nextEF).toBe(1.3);
  });

  it('maps UI ratings to SM2 ratings correctly', () => {
    expect(mapRatingToSM2(1)).toBe(1);
    expect(mapRatingToSM2(2)).toBe(3);
    expect(mapRatingToSM2(3)).toBe(4);
    expect(mapRatingToSM2(4)).toBe(5);
  });
});
