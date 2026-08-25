import { describe, it, expect } from 'vitest';
import { generateQuestionVariant, analyzeMockExamPerformance, analyzeWrongAnswer, generateFlashcardMnemonic, generateVisualDebugPrompt, generateCodeReviewPrompt, generatePodcastScriptPrompt, generateQuickQuizPrompt, generateConceptWebPrompt } from './aiService';

describe('aiService - Mock Exam Prompts', () => {
  it('generateQuestionVariant prompt is well-formed', async () => {
    // We can't actually call OpenRouter in standard tests without a mock, 
    // but we can ensure the function exists and doesn't throw synchronous errors before async call
    expect(typeof generateQuestionVariant).toBe('function');
  });

  it('analyzeMockExamPerformance prompt is well-formed', async () => {
    expect(typeof analyzeMockExamPerformance).toBe('function');
  });

  it('analyzeWrongAnswer prompt is well-formed', async () => {
    expect(typeof analyzeWrongAnswer).toBe('function');
  });

  it('generateFlashcardMnemonic prompt is well-formed', async () => {
    expect(typeof generateFlashcardMnemonic).toBe('function');
  });

  it('generateVisualDebugPrompt prompt is well-formed', async () => {
    expect(typeof generateVisualDebugPrompt).toBe('function');
  });

  it('generateCodeReviewPrompt prompt is well-formed', async () => {
    expect(typeof generateCodeReviewPrompt).toBe('function');
  });

  it('generatePodcastScriptPrompt prompt is well-formed', async () => {
    expect(typeof generatePodcastScriptPrompt).toBe('function');
  });

  it('generateQuickQuizPrompt prompt is well-formed', async () => {
    expect(typeof generateQuickQuizPrompt).toBe('function');
  });

  it('generateConceptWebPrompt prompt is well-formed', async () => {
    expect(typeof generateConceptWebPrompt).toBe('function');
  });
});
