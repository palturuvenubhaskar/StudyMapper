import { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles } from 'lucide-react';
import { NODE_TYPES } from './data/roadmapData';

// Compute a path between two nodes (right-angle connectors like roadmap.sh)
function computePath(fromNode, toNode) {
  const fromCx = fromNode.x + (fromNode.w || 120) / 2;
  const fromCy = fromNode.y + (fromNode.h || 44) / 2;
  const fromBottom = fromNode.y + (fromNode.h || 44);
  const fromRight = fromNode.x + (fromNode.w || 120);

  const toCx = toNode.x + (toNode.w || 120) / 2;
  const toCy = toNode.y + (toNode.h || 44) / 2;
  const toTop = toNode.y;
  const toLeft = toNode.x;

  const dy = toCy - fromCy;
  const dx = toCx - fromCx;

  // If the target is mostly below, connect bottom→top
  if (Math.abs(dy) > 20 && dy > 0) {
    const midY = fromBottom + (toTop - fromBottom) / 2;
    return `M${fromCx},${fromBottom} L${fromCx},${midY} L${toCx},${midY} L${toCx},${toTop}`;
  }

  // If the target is to the right (same row)
  if (Math.abs(dy) <= 20 && dx > 0) {
    return `M${fromRight},${fromCy} L${toLeft},${toCy}`;
  }

  // If the target is to the left (same row)
  if (Math.abs(dy) <= 20 && dx < 0) {
    return `M${fromNode.x},${fromCy} L${fromRight},${toCy}`;
  }

  // Default: L-shaped path
  return `M${fromCx},${fromBottom} L${fromCx},${toCy} L${toLeft},${toCy}`;
}

const NODE_COLORS = {
  [NODE_TYPES.TOPIC]: { bg: '#ffff00', text: '#000000', border: '#000000', hoverBg: '#e6e600' },
  [NODE_TYPES.CHECKPOINT]: { bg: '#3b38d6', text: '#ffffff', border: '#3b38d6', hoverBg: '#2d2add' },
  [NODE_TYPES.SECTION]: { bg: 'transparent', text: '#000000', border: 'none', hoverBg: 'transparent' },
  [NODE_TYPES.ANNOTATION]: { bg: '#ffffff', text: '#000000', border: '#000000', hoverBg: '#f8f8f8' },
  [NODE_TYPES.SUBTOPIC]: { bg: '#ffe599', text: '#000000', border: '#000000', hoverBg: '#ffdb70' },
};

const DONE_OVERLAY = { bg: 'var(--success-soft)', border: 'var(--success)' };

export default function RoadmapFlowchart({ roadmap, nodeProgress, onNodeClick, onLinkClick }) {
  const containerRef = useRef(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState(null);

  const { nodes, connections } = roadmap;

  // Compute SVG dimensions from node positions
  const svgWidth = Math.max(950, ...nodes.map(n => n.x + (n.w || 120) + 80));
  const svgHeight = Math.max(600, ...nodes.map(n => n.y + (n.h || 44) + 120));

  // Build node lookup
  const nodeMap = {};
  for (const n of nodes) nodeMap[n.id] = n;

  // Pan handlers
  const handleMouseDown = useCallback((e) => {
    if (e.target.closest('.fc-node')) return;
    setIsPanning(true);
    setPanStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  }, [transform]);

  const handleMouseMove = useCallback((e) => {
    if (!isPanning) return;
    setTransform(prev => ({
      ...prev,
      x: e.clientX - panStart.x,
      y: e.clientY - panStart.y,
    }));
  }, [isPanning, panStart]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);


  const getNodeStatus = (nodeId) => nodeProgress?.[nodeId] || 'pending';

  const renderNode = (node) => {
    const colors = NODE_COLORS[node.type] || NODE_COLORS[NODE_TYPES.TOPIC];
    const status = getNodeStatus(node.id);
    const isDone = status === 'done';
    const isInProgress = status === 'in-progress';
    const isHovered = hoveredNode === node.id;
    const isClickable = node.type === NODE_TYPES.TOPIC || node.type === NODE_TYPES.CHECKPOINT || node.type === NODE_TYPES.SUBTOPIC;

    const w = node.w || 120;
    const h = node.h || 44;
    const rx = node.type === NODE_TYPES.CHECKPOINT ? 22 : 6;

    // Section labels are plain text with a vertical line
    if (node.type === NODE_TYPES.SECTION) {
      return (
        <g key={node.id} className="fc-node fc-section">
          <text
            x={node.x}
            y={node.y + 24}
            fill={colors.text}
            fontSize="18"
            fontWeight="700"
            letterSpacing="-0.02em"
          >
            {node.label}
          </text>
          <line
            x1={node.x + 8}
            y1={node.y + 34}
            x2={node.x + 8}
            y2={node.y + h + 30}
            stroke="#000000"
            strokeWidth="2"
          />
        </g>
      );
    }

    // Label labels are plain text without a vertical line and support multi-line
    if (node.type === 'label') {
      return (
        <g key={node.id} className="fc-node fc-label">
          <foreignObject x={node.x} y={node.y} width={w} height={h} style={{ pointerEvents: 'none', overflow: 'visible' }}>
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              color: '#000000',
              fontSize: '16px',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              whiteSpace: 'pre-wrap',
              lineHeight: '1.2'
            }}>
              {node.label}
            </div>
          </foreignObject>
        </g>
      );
    }

    // Annotation boxes
    if (node.type === NODE_TYPES.ANNOTATION) {
      // Special: "Continue Learning" box
      if (node.id === 'continue') {
        return (
          <g key={node.id} className="fc-node fc-annotation">
            <rect
              x={node.x}
              y={node.y}
              width={w}
              height={h}
              rx={4}
              fill="#ffffff"
              stroke="#000000"
              strokeWidth="2"
            />
            <text
              x={node.x + w / 2}
              y={node.y + 24}
              textAnchor="middle"
              fill="#000000"
              fontSize="13"
              fontWeight="500"
            >
              Continue Learning with following relevant tracks
            </text>
            {/* Related track buttons */}
            {roadmap.relatedTracks?.map((track, i) => (
              <g 
                key={track}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onLinkClick) onLinkClick(track);
                }}
                style={{ cursor: 'pointer' }}
              >
                <rect
                  x={node.x + 40 + i * 100}
                  y={node.y + 48}
                  width={90}
                  height={32}
                  rx={6}
                  fill="#6366f1"
                  className="fc-related-btn"
                />
                <text
                  x={node.x + 85 + i * 100}
                  y={node.y + 68}
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="12"
                  fontWeight="500"
                  style={{ pointerEvents: 'none' }}
                >
                  {track.charAt(0).toUpperCase() + track.slice(1).replace(/-/g, ' ')}
                </text>
              </g>
            ))}
          </g>
        );
      }

      return (
        <g key={node.id} className="fc-node fc-annotation">
          <rect
            x={node.x}
            y={node.y}
            width={w}
            height={h}
            rx={4}
            fill={colors.bg}
            stroke={colors.border}
            strokeWidth="2"
          />
          <foreignObject x={node.x} y={node.y} width={w} height={h} style={{ pointerEvents: 'none' }}>
            <div style={{
              width: '100%',
              height: '100%',
              padding: '12px',
              boxSizing: 'border-box',
              color: colors.text,
              fontSize: '12px',
              whiteSpace: 'pre-wrap',
              lineHeight: '1.4'
            }}>
              {node.label}
            </div>
          </foreignObject>
        </g>
      );
    }

    // Topic / Checkpoint / Subtopic nodes
    return (
      <g
        key={node.id}
        className={`fc-node ${isClickable ? 'fc-clickable' : ''}`}
        onClick={() => isClickable && onNodeClick?.(node)}
        onMouseEnter={() => setHoveredNode(node.id)}
        onMouseLeave={() => setHoveredNode(null)}
        style={{ cursor: isClickable ? 'pointer' : 'default' }}
      >
        <rect
          x={node.x}
          y={node.y}
          width={w}
          height={h}
          rx={4}
          fill={isHovered ? colors.hoverBg : colors.bg}
          stroke={isDone ? DONE_OVERLAY.border : colors.border}
          strokeWidth="2"
          style={{ transition: 'all 0.15s ease' }}
        />
        {/* Done overlay */}
        {isDone && (
          <rect
            x={node.x}
            y={node.y}
            width={w}
            height={h}
            rx={rx}
            fill={DONE_OVERLAY.bg}
          />
        )}
        {/* In-progress indicator */}
        {isInProgress && (
          <rect
            x={node.x}
            y={node.y + h - 3}
            width={w}
            height={3}
            rx={1}
            fill="#f59e0b"
          />
        )}
        {/* Label */}
        <foreignObject x={node.x} y={node.y} width={w} height={h} style={{ pointerEvents: 'none' }}>
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            color: isDone ? '#10b981' : colors.text,
            fontSize: node.type === NODE_TYPES.SUBTOPIC ? '13px' : '14px',
            fontWeight: 600,
            padding: '0 8px',
            boxSizing: 'border-box',
            lineHeight: '1.2'
          }}>
            {node.label}
          </div>
        </foreignObject>
        {/* Done checkmark */}
        {isDone && (
          <g transform={`translate(${node.x + w - 18}, ${node.y + 4})`}>
            <circle cx="7" cy="7" r="7" fill="#10b981" />
            <path d="M4 7l2 2 4-4" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}
      </g>
    );
  };

  const renderConnection = (conn, idx) => {
    const fromNode = nodeMap[conn.from];
    const toNode = nodeMap[conn.to];
    if (!fromNode || !toNode) return null;

    const pathD = computePath(fromNode, toNode);
    const isDashed = conn.type === 'dashed';
    const fromDone = getNodeStatus(conn.from) === 'done';
    const toDone = getNodeStatus(conn.to) === 'done';
    const bothDone = fromDone && toDone;

    return (
      <path
        key={`conn-${idx}`}
        d={pathD}
        fill="none"
        stroke={bothDone ? '#10b981' : '#3b82f6'}
        strokeWidth="3"
        strokeDasharray={isDashed ? '6 6' : 'none'}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={bothDone ? 0.6 : 1}
        style={{ transition: 'all 0.2s ease' }}
      />
    );
  };

  return (
    <div
      className="fc-container"
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >

      <svg
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="fc-svg"
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: '0 0',
          cursor: isPanning ? 'grabbing' : 'grab',
        }}
      >
        {/* Render connections first (behind nodes) */}
        <g className="fc-connections">
          {connections.map((conn, idx) => renderConnection(conn, idx))}
        </g>
        {/* Render nodes on top */}
        <g className="fc-nodes">
          {nodes.map(renderNode)}
        </g>
      </svg>

      {/* Embedded Legend */}
      <div className="fc-embedded-legend">
        <div className="fc-legend-item">
          <span className="fc-legend-color" style={{ background: '#ffff00', border: '1px solid #000' }} />
          <span>Key topics to learn</span>
        </div>
        <div className="fc-legend-item">
          <span className="fc-legend-color" style={{ background: '#ffffff', border: '1px solid #000' }} />
          <span style={{ color: '#000000' }}>Concepts / Details</span>
        </div>
      </div>

      {/* Floating AI Tutor Bar */}
      <div className="fc-floating-tutor">
        <button className="fc-tutor-btn" onClick={() => {
          // Open custom AI dialog or tab
          const event = new CustomEvent('open-ai-tutor');
          window.dispatchEvent(event);
        }}>
          <Sparkles size={16} className="text-yellow" />
          <span className="font-semibold text-yellow">AI Tutor</span>
          <span className="text-gray-300">Have a question? Type here</span>
        </button>
      </div>
    </div>
  );
}
