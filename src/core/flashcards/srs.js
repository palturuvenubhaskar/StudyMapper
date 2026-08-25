/**
 * Calculates the next interval and easiness factor (EF) for a flashcard using the SM-2 algorithm.
 * 
 * @param {number} rating - User's rating for the card (0-5)
 *                          0 = Complete blackout
 *                          1 = Incorrect, but remembered the answer upon seeing it
 *                          2 = Incorrect, but it seemed easy to remember
 *                          3 = Correct, but required significant effort
 *                          4 = Correct, after a hesitation
 *                          5 = Perfect response
 * @param {number} currentInterval - The current interval in days (0 for new cards)
 * @param {number} currentRepetitions - Number of times this card has been successfully recalled in a row
 * @param {number} currentEF - Current Easiness Factor (default 2.5)
 * @returns {Object} { nextInterval, nextRepetitions, nextEF }
 */
export const calculateNextReview = (rating, currentInterval = 0, currentRepetitions = 0, currentEF = 2.5) => {
  let nextInterval = 0;
  let nextRepetitions = currentRepetitions;
  let nextEF = currentEF;

  if (rating >= 3) {
    // Correct response
    if (currentRepetitions === 0) {
      nextInterval = 1;
    } else if (currentRepetitions === 1) {
      nextInterval = 6;
    } else {
      nextInterval = Math.round(currentInterval * currentEF);
    }
    nextRepetitions += 1;
  } else {
    // Incorrect response
    nextRepetitions = 0;
    nextInterval = 1;
  }

  // Update Easiness Factor (EF)
  nextEF = currentEF + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));
  
  // EF cannot fall below 1.3
  if (nextEF < 1.3) {
    nextEF = 1.3;
  }

  return {
    nextInterval,
    nextRepetitions,
    nextEF
  };
};

/**
 * Normalizes a 1-5 rating (common UI) to 0-5 (SM-2 standard) if needed,
 * but generally mapping:
 * 1 (Again) -> 0 or 1
 * 2 (Hard) -> 3
 * 3 (Good) -> 4
 * 4 (Easy) -> 5
 */
export const mapRatingToSM2 = (userRating) => {
  switch (userRating) {
    case 1: return 1; // Again
    case 2: return 3; // Hard
    case 3: return 4; // Good
    case 4: return 5; // Easy
    default: return 4;
  }
};
