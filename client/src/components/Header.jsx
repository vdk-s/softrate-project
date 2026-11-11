import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Shield, LogOut, LayoutDashboard, Plus, ChevronRight } from 'lucide-react';
import SoftrateLogo from './SoftrateLogo';
import SearchModal from './SearchModal';
import { api } from '../services/api';

const DEFAULT_CATEGORIES = [
  { _id: 'cat-soft-dev', name: 'Software Development', slug: 'software-development' },
  { _id: 'cat-aiml', name: 'Artificial Intelligence & Machine Learning', slug: 'artificial-intelligence-machine-learning' },
  { _id: 'cat-web-mobile', name: 'Web and Mobile App Development', slug: 'web-mobile-app-development' },
  { _id: 'cat-tech-inno', name: 'Technology & Innovation', slug: 'technology-innovation' },
  { _id: 'cat-cyber', name: 'Cybersecurity', slug: 'cybersecurity' },
  { _id: 'cat-cloud', name: 'Cloud Computing', slug: 'cloud-computing' },
  { _id: 'cat-industry', name: 'Industry Insights', slug: 'industry-insights' },
];

export default function Header() {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Load categories and check auth token
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await api.getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    loadCategories();

    // Check auth
    const token = localStorage.getItem('softrate_token');
    const userStr = localStorage.getItem('softrate_user');
    if (token && userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (e) {
        localStorage.removeItem('softrate_token');
      }
    }
  }, [location.pathname]);

  // Global Ctrl+K / Cmd+K search listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('softrate_token');
    localStorage.removeItem('softrate_user');
    setCurrentUser(null);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className="site-header">
        <div className="container">
          <div className="header-top">
            <Link to="/" className="brand-logo-link" title="Softrate Blog">
              <SoftrateLogo height={34} />
              <span className="brand-blog-text">Blog</span>
            </Link>

            <div className="header-actions">
              {/* Live Search Trigger Button */}
              <button
                className="search-trigger-btn"
                onClick={() => setIsSearchOpen(true)}
                title="Search articles (Ctrl+K)"
              >
                <Search size={16} />
                <span>Search articles...</span>
                <span className="search-shortcut-badge">⌘K</span>
              </button>

              {/* Admin Portal Shortcuts */}
              {currentUser ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Link
                    to="/admin"
                    className="admin-nav-btn"
                    style={{ backgroundColor: '#0f172a' }}
                    title="CMS Dashboard"
                  >
                    <LayoutDashboard size={14} />
                    <span>CMS</span>
                  </Link>

                  <Link
                    to="/admin/editor"
                    className="admin-nav-btn"
                    style={{ backgroundColor: '#e42525' }}
                    title="Create new article"
                  >
                    <Plus size={14} />
                    <span>New Post</span>
                  </Link>

                  <Link
                    to="/admin/categories"
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: '#475569',
                      padding: '6px 8px',
                      textDecoration: 'none',
                    }}
                  >
                    Categories
                  </Link>

                  <Link
                    to="/admin/authors"
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: '#475569',
                      padding: '6px 8px',
                      textDecoration: 'none',
                    }}
                  >
                    Authors
                  </Link>

                  <button
                    onClick={handleLogout}
                    title="Sign Out"
                    style={{
                      padding: '6px 8px',
                      color: '#94a3b8',
                      borderRadius: 4,
                      display: 'flex',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <Link to="/admin/login" className="admin-nav-btn">
                  <Shield size={14} />
                  <span>Admin Login</span>
                </Link>
              )}
            </div>
          </div>

          {/* Clean Horizontal Category Navigation */}
          <nav className="category-nav-bar" aria-label="Blog categories">
            <Link
              to="/"
              className={`cat-nav-item ${isActive('/') ? 'active' : ''}`}
            >
              Home
            </Link>

            <Link
              to="/blogs"
              className={`cat-nav-item ${isActive('/blogs') ? 'active' : ''}`}
            >
              All Articles
            </Link>

            {categories.map((cat) => {
              const catPath = `/category/${cat.slug}`;
              const active = isActive(catPath);
              return (
                <Link
                  key={cat._id}
                  to={catPath}
                  className={`cat-nav-item ${active ? 'active' : ''}`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Instant Live Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

