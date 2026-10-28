/**
 * The AI coach is lazily loaded, so a page can ask it to open before its
 * listener is attached. Keep the request pending until the coach mounts.
 */
let pendingOpenRequest = false;

export const openAICoach = () => {
  pendingOpenRequest = true;
  window.dispatchEvent(new Event('open-ai-coach'));
};

export const consumeAICoachRequest = () => {
  const wasPending = pendingOpenRequest;
  pendingOpenRequest = false;
  return wasPending;
};
