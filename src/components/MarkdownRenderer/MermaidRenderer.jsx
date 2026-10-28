import React, { useEffect, useRef, useState, useMemo } from 'react';
import mermaid from 'mermaid';
import { v4 as uuidv4 } from 'uuid';
import { useTheme } from '../../context/ThemeProvider';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { prepareMermaidSource } from './mermaidSource';

/**
 * Mermaid keeps global configuration and parser state, so renders must not
 * overlap. This queue serialises every diagram on the page.
 */
let renderQueue = Promise.resolve();
const enqueueRender = (task) => {
  const run = renderQueue.then(task, task);
  renderQueue = run.catch(() => {});
  return run;
};

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
  const themePreference = themeContext?.theme || document.documentElement.getAttribute('data-theme') || 'dark';
  const currentTheme = themePreference === 'system'
    ? (window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
    : themePreference;

  // Repair the AI output once per chart change.
  const chartSource = useMemo(() => prepareMermaidSource(chart), [chart]);

  useEffect(() => {
    if (!chartSource) {
      setLoading(false);
      setSvgContent('');
      return;
    }

    let isMounted = true;
    setLoading(true);
    setError(false);
    setSvgContent('');

    const buildConfig = () => {
      const config = {
        startOnLoad: false,
        theme: handDrawn ? 'base' : (currentTheme === 'light' ? 'default' : 'dark'),
        securityLevel: 'loose',
        suppressErrorRendering: true,
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
        config.themeVariables = {
          fontFamily: '"Geist", "Inter", sans-serif',
          background: 'transparent',
        };
      }

      return config;
    };

    const renderWith = (source) =>
      enqueueRender(async () => {
        const renderId = `mermaid-${uuidv4().replace(/-/g, '')}`;
        mermaid.initialize(buildConfig());
        try {
          return await mermaid.render(renderId, source);
        } finally {
          // Mermaid occasionally leaves its temporary container behind on errors.
          document.getElementById(`d${renderId}`)?.remove();
          document.getElementById(renderId)?.remove();
        }
      });

    const renderChart = async () => {
      try {
        let result;
        try {
          result = await renderWith(chartSource);
        } catch (firstError) {
          // Retry once with styling directives stripped — they are the most
          // common cause of a diagram that is otherwise valid.
          const fallback = prepareMermaidSource(chartSource, { aggressive: true });
          if (!fallback || fallback === chartSource) throw firstError;
          result = await renderWith(fallback);
        }

        if (!isMounted) return;

        let responsiveSvg = result.svg.replace(
          /max-width:\s*[\d.]+px;?/g,
          'max-width: 100%;'
        );
        if (!/width="100%"/.test(responsiveSvg)) {
          responsiveSvg = responsiveSvg.replace('<svg', '<svg width="100%"');
        }

        setSvgContent(responsiveSvg);
        setError(false);
      } catch (err) {
        console.error('Mermaid parsing error:', err);
        if (isMounted) {
          setSvgContent('');
          setError(true);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chartSource, handDrawn, currentTheme]);

  if (!chartSource) {
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
      <div
        className="mermaid-error"
        style={{
          margin: '1rem 0',
          padding: '1rem 1.25rem',
          background: 'var(--danger-soft, #fee2e2)',
          color: 'var(--danger, #991b1b)',
          borderRadius: '8px',
          border: '1px solid var(--danger, #f87171)',
        }}
      >
        <p style={{ margin: 0, fontWeight: 600 }}>This diagram could not be drawn.</p>
        <p style={{ margin: '4px 0 0', fontSize: '0.85rem', opacity: 0.8 }}>
          The generated diagram code is invalid. Regenerate the notes to get a new one.
        </p>
        <details style={{ marginTop: '10px' }}>
          <summary style={{ cursor: 'pointer', fontSize: '0.85rem' }}>Show diagram code</summary>
          <pre style={{ margin: '8px 0 0', padding: '10px', background: 'rgba(0,0,0,0.06)', borderRadius: '4px', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
            <code>{chart}</code>
          </pre>
        </details>
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
