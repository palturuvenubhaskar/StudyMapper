import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import YouTubeLinker from './YouTubeLinker';

describe('YouTubeLinker Component', () => {
  it('does not render if queries array is empty or undefined', () => {
    const { container: containerEmpty } = render(<YouTubeLinker queries={[]} />);
    expect(containerEmpty.firstChild).toBeNull();

    const { container: containerUndefined } = render(<YouTubeLinker />);
    expect(containerUndefined.firstChild).toBeNull();
  });

  it('renders a grid of video cards based on queries', () => {
    const queries = ['React context tutorial', 'Redux for beginners'];
    render(<YouTubeLinker queries={queries} />);

    expect(screen.getByText('Recommended Video Searches')).toBeInTheDocument();
    
    // Check if the titles rendered correctly (including quotes)
    expect(screen.getByText(/"React context tutorial"/)).toBeInTheDocument();
    expect(screen.getByText(/"Redux for beginners"/)).toBeInTheDocument();
  });

  it('opens a new window with the correct YouTube search URL when a card is clicked', () => {
    // Mock window.open
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => {});

    const queries = ['Binary Search Tree visualization'];
    render(<YouTubeLinker queries={queries} />);

    const card = screen.getByText(/"Binary Search Tree visualization"/).closest('.video-card');
    fireEvent.click(card);

    expect(openSpy).toHaveBeenCalledWith(
      'https://www.youtube.com/results?search_query=Binary%20Search%20Tree%20visualization',
      '_blank',
      'noopener,noreferrer'
    );

    openSpy.mockRestore();
  });
});
