import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock, Calendar, ArrowRight, FileText } from 'lucide-react';
import { api } from '../services/api';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await api.getPosts({ search: query, limit: 6 });
        setResults(data.posts || []);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectPost = (slug) => {
    onClose();
    navigate(`/blog/${slug}`);
  };

  if (!isOpen) return null;

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="search-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal-header">
          <Search size={22} color="#64748b" />
          <input
            ref={inputRef}
            type="text"
            className="search-modal-input"
            placeholder="Search articles by title, keywords, authors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={onClose} style={{ padding: 4, color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>

        <div className="search-results-list">
          {loading && (
            <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
              Searching publications...
            </div>
          )}

          {!loading && query.trim() && results.length === 0 && (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: '#64748b' }}>
              <FileText size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
              <p style={{ fontWeight: 600 }}>No publications found matching "{query}"</p>
              <p style={{ fontSize: '0.85rem', marginTop: 4 }}>
                Try searching for broader terms like "Cloud", "Cybersecurity", or "Architecture".
              </p>
            </div>
          )}

          {!loading && results.map((post) => (
            <div
              key={post._id}
              className="search-result-item"
              onClick={() => handleSelectPost(post.slug)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem' }}>
                <span
                  style={{
                    color: post.category?.accentColor || '#e42525',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  {post.category?.name || 'General'}
                </span>
                <span style={{ color: '#cbd5e1' }}>•</span>
                <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={12} /> {post.readTime}
                </span>
              </div>
              <h4 style={{ color: '#0f172a', fontSize: '1rem', fontWeight: 600 }}>
                {post.title}
              </h4>
              <p
                style={{
                  fontSize: '0.85rem',
                  color: '#64748b',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {post.excerpt}
              </p>
            </div>
          ))}

          {!query.trim() && (
            <div style={{ padding: '20px 16px', fontSize: '0.84rem', color: '#64748b' }}>
              <span style={{ fontWeight: 600, color: '#0f172a' }}>Popular Searches:</span>
              <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                {['Digital Transformation', 'Kubernetes', 'Malware', 'ESG Innovation', 'Data Quality'].map(
                  (topic) => (
                    <button
                      key={topic}
                      onClick={() => setQuery(topic)}
                      style={{
                        padding: '4px 10px',
                        background: '#f1f5f9',
                        borderRadius: 16,
                        fontSize: '0.78rem',
                        color: '#334155',
                      }}
                    >
                      {topic}
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

