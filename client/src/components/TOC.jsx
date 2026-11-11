import React, { useState, useEffect } from 'react';
import { List } from 'lucide-react';

export default function TOC({ headings = [] }) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (!headings.length) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      for (let i = headings.length - 1; i >= 0; i--) {
        const el = document.getElementById(headings[i].id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveId(headings[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  if (!headings || headings.length === 0) return null;

  const scrollToHeading = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const topOffset = el.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
      setActiveId(id);
    }
  };

  return (
    <aside className="toc-sidebar" aria-label="Table of Contents">
      <div className="toc-title">
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <List size={14} /> Contents
        </span>
      </div>

      <nav>
        <ul className="toc-list">
          {headings.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => scrollToHeading(e, item.id)}
                className={`toc-link ${item.level === 3 ? 'h3' : 'h2'} ${
                  activeId === item.id ? 'active' : ''
                }`}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

