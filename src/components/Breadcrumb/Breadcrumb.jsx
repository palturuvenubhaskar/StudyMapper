import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumb = ({ items, separator = '>' }) => {
  return (
    <nav aria-label="breadcrumb" style={{ marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid var(--border-light)' }}>
      <ol style={{ display: 'flex', gap: '8px', margin: 0, padding: 0, listStyle: 'none' }}>
        {items.map((item, idx) => (
          <li key={idx} style={{ flex: 1 }}>
            {idx > 0 && <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{separator}</span>}
            {item.link ? (
              <Link 
                to={item.link} 
                style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500 }}
              >
                {item.label}
              </Link>
            ) : (
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;

export const useBreadcrumb = (title, links = []) => {
  const location = window.location.pathname;
  return { Breadcrumb, location };
};