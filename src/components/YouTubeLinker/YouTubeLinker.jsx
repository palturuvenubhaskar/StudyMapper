import React from 'react';
import { ExternalLink, Play } from 'lucide-react';
import './YouTubeLinker.css';

export default function YouTubeLinker({ queries = [] }) {
  if (!queries || queries.length === 0) return null;

  const handleLinkClick = (query) => {
    const encodedQuery = encodeURIComponent(query);
    window.open(`https://www.youtube.com/results?search_query=${encodedQuery}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="ts-panel youtube-linker">
      <div className="linker-head">
        <span className="ts-eyebrow">Watch</span>
        <h2 className="linker-title">Recommended Video Searches</h2>
        <p className="linker-subtitle">Open YouTube with a ready-made search for this topic.</p>
      </div>

      <div className="video-grid">
        {queries.map((query, idx) => (
          <button
            key={idx}
            type="button"
            className="video-card"
            onClick={() => handleLinkClick(query)}
          >
            <span className="video-thumbnail-mock" aria-hidden="true">
              <span className="play-icon"><Play size={14} fill="currentColor" /></span>
            </span>
            <span className="video-info">
              <span className="video-title">"{query}"</span>
              <span className="video-action">
                Search <ExternalLink size={11} />
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
