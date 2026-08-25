import '@testing-library/jest-dom';
import { vi } from 'vitest';
import 'fake-indexeddb/auto';

// Mock Web Speech API
global.speechSynthesis = {
  speak: vi.fn(),
  cancel: vi.fn(),
  pause: vi.fn(),
  resume: vi.fn(),
};

global.SpeechSynthesisUtterance = vi.fn().mockImplementation(() => ({
  onend: null,
}));

// Mock canvas-confetti
vi.mock('canvas-confetti', () => {
  return {
    default: vi.fn(),
  };
});
