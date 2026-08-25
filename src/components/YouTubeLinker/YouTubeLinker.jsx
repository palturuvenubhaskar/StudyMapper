import React from 'react';
import { Video, ExternalLink, Play } from 'lucide-react';
import './YouTubeLinker.css';

export default function YouTubeLinker({ queries = [] }) {
  if (!queries || queries.length === 0) return null;

  const handleLinkClick = (query) => {
    const encodedQuery = encodeURIComponent(query);
    window.open(`https://www.youtube.com/results?search_query=${encodedQuery}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="youtube-linker">
      <div className="linker-header">
        <Video color="#ff0000" size={24} />
        <h2>Recommended Video Searches</h2>
      </div>
      <p className="linker-subtitle">Click to search YouTube for related tutorials and visualizations.</p>
      
      <div className="video-grid">
        {queries.map((query, idx) => (
          <div key={idx} className="video-card" onClick={() => handleLinkClick(query)}>
            <div className="video-thumbnail-mock">
              <Play size={32} color="white" className="play-icon" />
            </div>
            <div className="video-info">
              <h4 className="video-title">"{query}"</h4>
              <span className="video-action">
                Search <ExternalLink size={12} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
