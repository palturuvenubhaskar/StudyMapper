import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { v4 as uuidv4 } from 'uuid';
import { useTheme } from '../../context/ThemeProvider';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

/**
 * Renders a Mermaid diagram.
 * Supports a `handDrawn` look to match handwritten PDF exports.
 */
export default function MermaidRenderer({ chart, handDrawn = false }) {
  const containerRef = useRef(null);
  const [svgContent, setSvgContent] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(100);
  const zoomIntervalRef = useRef(null);

  const startZooming = (direction) => {
    // Initial click step
    setScale(s => {
      const step = direction === 'in' ? 15 : -15;
      return Math.min(300, Math.max(10, s + step));
    });

    // Continuous zoom on hold
    zoomIntervalRef.current = setInterval(() => {
      setScale(s => {
        const step = direction === 'in' ? 5 : -5; 
        return Math.min(300, Math.max(10, s + step));
      });
    }, 50); 
  };

  const stopZooming = () => {
    if (zoomIntervalRef.current) {
      clearInterval(zoomIntervalRef.current);
      zoomIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => stopZooming();
  }, []);
  
  const themeContext = useTheme();
  const currentTheme = themeContext?.theme || (document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

  // Use a unique ID for each mermaid diagram instance to avoid DOM conflicts
  const id = useRef(`mermaid-${uuidv4().replace(/-/g, '')}`);

  useEffect(() => {
    if (!chart) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    // Initialize mermaid with specific config based on style
    const config = {
      startOnLoad: false,
      theme: handDrawn ? 'base' : (currentTheme === 'light' ? 'default' : 'dark'),
      securityLevel: 'loose',
      fontFamily: handDrawn ? '"Caveat", cursive' : '"Geist", "Inter", sans-serif',
    };

    if (handDrawn) {
      config.look = 'handDrawn';
      config.themeVariables = {
        fontFamily: '"Caveat", cursive',
        primaryColor: '#ffffff',
        primaryTextColor: '#0f0f8a',
        primaryBorderColor: '#0f0f8a',
        lineColor: '#0f0f8a',
        secondaryColor: '#f8f8f8',
        tertiaryColor: '#f8f8f8',
      };
    } else {
      config.look = 'classic';
      // Enhance the dark theme readability
      config.themeVariables = {
        fontFamily: '"Geist", "Inter", sans-serif',
        background: 'transparent',
      };
    }

    mermaid.initialize(config);

    const renderChart = async () => {
      try {
        setError(false);
        // Add a small delay to prevent React 18 strict mode double-render race conditions
        await new Promise(resolve => setTimeout(resolve, 50));
        if (!isMounted) return;

        const { svg } = await mermaid.render(id.current, chart);
        
        if (isMounted) {
          // Post-process the SVG string to ensure it's responsive and removes hardcoded max-widths
          let responsiveSvg = svg.replace(/max-width:\s*\d+(\.\d+)?px;/g, 'max-width: 100%; height: auto;');
          // Ensure width is 100% so it grows nicely
          if (!responsiveSvg.includes('width="100%"')) {
            responsiveSvg = responsiveSvg.replace(/<svg/, '<svg width="100%" height="100%"');
          }
          setSvgContent(responsiveSvg);
          setLoading(false);
        }
      } catch (err) {
        console.error("Mermaid parsing error:", err);
        if (isMounted) {
          setError(true);
          setLoading(false);
        }
      }
    };

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart, handDrawn, currentTheme]);

  if (!chart) {
    return null;
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0', color: '#6b7280' }}>
        <div className="spinner spinner-sm" style={{ marginRight: '10px' }}></div>
        <span>Drawing diagram...</span>
      </div>
    );
  }

  if (error || !svgContent) {
    return (
      <div className="mermaid-error" style={{ margin: '1rem 0', padding: '1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', border: '1px solid #f87171' }}>
        <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>Diagram failed to render. Raw diagram code:</p>
        <pre style={{ margin: 0, padding: '10px', background: '#f8717122', borderRadius: '4px', overflowX: 'auto' }}>
          <code>{chart}</code>
        </pre>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', margin: '1.5rem 0' }} className="mermaid-outer-container">
      {/* Zoom Controls */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        display: 'flex',
        gap: '4px',
        background: 'var(--bg-panel)',
        padding: '4px',
        borderRadius: '8px',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        zIndex: 10
      }}>
        <button 
          className="btn btn-ghost btn-icon btn-sm" 
          onMouseDown={() => startZooming('out')}
          onMouseUp={stopZooming}
          onMouseLeave={stopZooming}
          onTouchStart={(e) => { e.preventDefault(); startZooming('out'); }}
          onTouchEnd={(e) => { e.preventDefault(); stopZooming(); }}
          title="Zoom Out"
        >
          <ZoomOut size={16} />
        </button>
        <button 
          className="btn btn-ghost btn-icon btn-sm" 
          onClick={() => setScale(100)}
          title="Reset Zoom"
        >
          <RotateCcw size={16} />
        </button>
        <button 
          className="btn btn-ghost btn-icon btn-sm" 
          onMouseDown={() => startZooming('in')}
          onMouseUp={stopZooming}
          onMouseLeave={stopZooming}
          onTouchStart={(e) => { e.preventDefault(); startZooming('in'); }}
          onTouchEnd={(e) => { e.preventDefault(); stopZooming(); }}
          title="Zoom In"
        >
          <ZoomIn size={16} />
        </button>
      </div>

      <div 
        style={{
          display: 'flex',
          justifyContent: scale > 100 ? 'flex-start' : 'center', // Align left when zoomed in so it scrolls properly
          width: '100%',
          overflowX: 'auto',
          overflowY: 'hidden',
          background: handDrawn ? 'transparent' : 'rgba(255,255,255,0.03)',
          borderRadius: '12px',
          padding: '2.5rem 1.5rem 1.5rem 1.5rem', // Extra top padding for controls
          border: handDrawn ? 'none' : '1px solid var(--border-light)'
        }}
      >
        <div 
          className="mermaid-wrapper" 
          ref={containerRef}
          dangerouslySetInnerHTML={{ __html: svgContent }} 
          style={{
            width: `${scale}%`,
            minWidth: `${scale}%`,
            transition: 'width 0.2s ease-out, min-width 0.2s ease-out',
          }}
        />
      </div>
    </div>
  );
}
