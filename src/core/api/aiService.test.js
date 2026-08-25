import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { callOpenRouter } from './aiService';

// Mock fetch
const originalFetch = global.fetch;

describe('AI Service Fallback Tests', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
    // clear environment variables or set dummy keys if needed
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('falls back to the next model if the first one fails', async () => {
    // Mock the first fetch to fail (500 Error)
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => 'Internal Server Error'
    });

    // Mock the second fetch to succeed
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: 'Success from second model' } }]
      })
    });

    const response = await callOpenRouter([{ role: 'user', content: 'test' }]);
    
    // It should succeed and return the text from the second model
    expect(response).toBe('Success from second model');
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('throws an error if all models fail', async () => {
    // Mock all fetches to fail
    global.fetch.mockImplementation(() => Promise.resolve({
      ok: false,
      status: 500,
      text: async () => 'Internal Server Error'
    }));

    // Expect the promise to reject since we mocked all models to fail
    await expect(callOpenRouter([{ role: 'user', content: 'test' }])).rejects.toThrow(/All AI models failed/);
  });
});
