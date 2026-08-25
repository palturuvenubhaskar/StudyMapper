import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import MockExamSetup from './MockExamSetup';
import { repository } from '../../data/repository';

// Mock dependencies
vi.mock('../../data/repository', () => ({
  repository: {
    getQuestionBanks: vi.fn(),
    getQuestions: vi.fn(),
    db: {
      question_variants: { add: vi.fn() },
      mock_exams: { add: vi.fn(), update: vi.fn() }
    }
  }
}));

describe('MockExamSetup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    repository.getQuestionBanks.mockResolvedValue([]);
    render(
      <MemoryRouter initialEntries={['/mock-exam/setup/1']}>
        <Routes>
          <Route path="/mock-exam/setup/:bankId" element={<MockExamSetup />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/Loading configuration/i)).toBeInTheDocument();
  });

  it('renders error state if question bank not found', async () => {
    repository.getQuestionBanks.mockResolvedValue([]);
    render(
      <MemoryRouter initialEntries={['/mock-exam/setup/1']}>
        <Routes>
          <Route path="/mock-exam/setup/:bankId" element={<MockExamSetup />} />
        </Routes>
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/Question Bank Not Found/i)).toBeInTheDocument();
    });
  });

  it('renders empty state if no questions available', async () => {
    repository.getQuestionBanks.mockResolvedValue([{ id: 1, title: 'Test Bank' }]);
    repository.getQuestions.mockResolvedValue([]);
    
    render(
      <MemoryRouter initialEntries={['/mock-exam/setup/1']}>
        <Routes>
          <Route path="/mock-exam/setup/:bankId" element={<MockExamSetup />} />
        </Routes>
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/No Questions Available/i)).toBeInTheDocument();
    });
  });

  it('renders setup form when data is loaded', async () => {
    repository.getQuestionBanks.mockResolvedValue([{ id: 1, title: 'Test Bank' }]);
    repository.getQuestions.mockResolvedValue([
      { id: 1, text: 'Q1', marks: 5 },
      { id: 2, text: 'Q2', marks: 10 }
    ]);
    
    render(
      <MemoryRouter initialEntries={['/mock-exam/setup/1']}>
        <Routes>
          <Route path="/mock-exam/setup/:bankId" element={<MockExamSetup />} />
        </Routes>
      </MemoryRouter>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/Configure Mock Exam/i)).toBeInTheDocument();
      expect(screen.getByText(/Test Bank/i)).toBeInTheDocument();
    });
  });
});
