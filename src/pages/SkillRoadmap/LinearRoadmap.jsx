import React, { useState } from 'react';
import { CheckCircle2, Circle, Clock, ChevronDown, ChevronRight, Link as LinkIcon } from 'lucide-react';
import './LinearRoadmap.css';

export default function LinearRoadmap({ roadmap, nodeProgress, onNodeClick, onLinkClick }) {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (id) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: prev[id] !== undefined ? !prev[id] : false
    }));
  };

  const getStatus = (id) => nodeProgress?.[id] || 'pending';
  const isDone = (id) => getStatus(id) === 'done';
  const isInProgress = (id) => getStatus(id) === 'in-progress';

  const renderStatusIcon = (id) => {
    if (isDone(id)) return <CheckCircle2 size={20} className="lr-icon-done" />;
    if (isInProgress(id)) return <Clock size={20} className="lr-icon-in-progress" />;
    return <Circle size={20} className="lr-icon-pending" />;
  };

  const renderItem = (item, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isSection = item.type === 'section';
    const isExpanded = expandedSections[item.id] !== false; // default true for first level

    if (isSection) {
      return (
        <div key={item.id} className={`lr-section level-${level}`}>
          <div className="lr-section-header" onClick={() => toggleSection(item.id)}>
            <div className="lr-section-title">
              {hasChildren ? (isExpanded ? <ChevronDown size={22} /> : <ChevronRight size={22} />) : <span className="lr-spacer" />}
              <h2>{item.title}</h2>
            </div>
          </div>
          {hasChildren && isExpanded && (
            <div className="lr-section-content">
              <div className="lr-children">
                {item.children.map(child => renderItem(child, level + 1))}
              </div>
            </div>
          )}
        </div>
      );
    }

    // For topics and subtopics
    const isClickable = item.type === 'topic' || item.type === 'subtopic';

    return (
      <div key={item.id} className={`lr-node-container level-${level}`}>
        <div className="lr-node-row">
          <div className="lr-node-icon-wrapper" onClick={() => isClickable && onNodeClick?.(item)}>
            {renderStatusIcon(item.id)}
          </div>
          <div 
            className={`lr-node-box type-${item.type} ${isDone(item.id) ? 'done' : ''} ${isInProgress(item.id) ? 'in-progress' : ''} ${isClickable ? 'clickable' : ''}`}
            onClick={() => isClickable && onNodeClick?.(item)}
          >
            <div className="lr-node-content">
              <h3>{item.title}</h3>
              {item.description && <p className="lr-node-desc">{item.description}</p>}
              {item.link && (
                <div 
                  className="lr-node-link"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onLinkClick) onLinkClick(item.link.id);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <LinkIcon size={14} /> <span>{item.link.title}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {hasChildren && (
          <div className="lr-subchildren">
            {item.children.map(child => renderItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="lr-container">
      {roadmap.items?.map(item => renderItem(item))}
    </div>
  );
}
