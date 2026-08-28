import { useEffect, useRef, useState } from 'react';
import { Printer, ArrowUp } from 'lucide-react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

export function LegalLayout({ title, children, lastUpdated }) {
  useDocumentTitle(title);
  const [activeSection, setActiveSection] = useState('');
  const contentRef = useRef(null);

  useEffect(() => {
    const headings = contentRef.current?.querySelectorAll('h2[id]');
    if (!headings) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, []);

  const handlePrint = () => window.print();
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const extractHeadings = () => {
    const headings = contentRef.current?.querySelectorAll('h2[id]');
    if (!headings) return [];
    return Array.from(headings).map(h => ({
      id: h.id,
      text: h.textContent,
    }));
  };

  const [tocItems, setTocItems] = useState([]);

  useEffect(() => {
    if (contentRef.current) {
      setTocItems(extractHeadings());
    }
  }, [children]);

  return (
    <div className="legal-page">
      <aside className="legal-sidebar">
        <nav className="legal-toc">
          <h3>Contents</h3>
          <ul>
            {tocItems.map((h) => (
              <li key={h.id}>
                <a
                  href={`#${h.id}`}
                  className={activeSection === h.id ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  {h.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className="legal-content" ref={contentRef}>
        <div className="legal-meta">
          <span className="legal-badge">Legal</span>
          <span className="legal-date">Last Updated: {lastUpdated}</span>
          <button onClick={handlePrint} className="legal-print" aria-label="Print this page">
            <Printer size={16} />
          </button>
        </div>

        <h1>{title}</h1>
        {children}

        <button onClick={scrollToTop} className="legal-back-to-top">
          <ArrowUp size={16} />
          Back to top
        </button>
      </main>
    </div>
  );
}
