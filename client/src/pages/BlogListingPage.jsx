import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Filter, BookOpen, ChevronLeft, ChevronRight, X } from 'lucide-react';
import BlogCard from '../components/BlogCard';
import { api } from '../services/api';

const DEFAULT_CATEGORIES = [
  { _id: 'cat-soft-dev', name: 'Software Development', slug: 'software-development', accentColor: '#0f62fe' },
  { _id: 'cat-aiml', name: 'Artificial Intelligence & Machine Learning', slug: 'artificial-intelligence-machine-learning', accentColor: '#8a3ffc' },
  { _id: 'cat-web-mobile', name: 'Web and Mobile App Development', slug: 'web-mobile-app-development', accentColor: '#0072c3' },
  { _id: 'cat-tech-inno', name: 'Technology & Innovation', slug: 'technology-innovation', accentColor: '#ff832b' },
  { _id: 'cat-cyber', name: 'Cybersecurity', slug: 'cybersecurity', accentColor: '#da1e28' },
  { _id: 'cat-cloud', name: 'Cloud Computing', slug: 'cloud-computing', accentColor: '#1192e8' },
  { _id: 'cat-industry', name: 'Industry Insights', slug: 'industry-insights', accentColor: '#198038' },
];

export default function BlogListingPage() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [posts, setPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [activeCategoryDoc, setActiveCategoryDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load Categories
  useEffect(() => {
    api.getCategories().then(setCategories).catch(console.error);
  }, []);

  // Fetch Posts based on Category slug, Search query, and Page
  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      try {
        const queryParams = {
          page: currentPage,
          limit: 9,
          status: 'published',
        };

        if (slug) {
          queryParams.category = slug;
        }

        if (searchQuery.trim()) {
          queryParams.search = searchQuery.trim();
        }

        const data = await api.getPosts(queryParams);
        setPosts(data.posts || []);
        setTotalPosts(data.totalPosts || 0);
        setTotalPages(data.totalPages || 1);

        // Find active category document for description
        if (slug && categories.length > 0) {
          const matched = categories.find((c) => c.slug === slug);
          setActiveCategoryDoc(matched || null);
        } else {
          setActiveCategoryDoc(null);
        }
      } catch (err) {
        console.error('Failed to load posts:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [slug, currentPage, searchQuery, categories]);

  // Handle Category selection
  const handleSelectCategory = (catSlug) => {
    setCurrentPage(1);
    if (!catSlug || catSlug === 'all') {
      navigate('/blogs');
    } else {
      navigate(`/category/${catSlug}`);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  return (
    <div className="container" style={{ padding: '40px 24px 80px' }}>
      {/* Category Header */}
      <div
        style={{
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '28px',
          marginBottom: '32px',
        }}
      >
        <span
          style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            color: activeCategoryDoc?.accentColor || '#e42525',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          {activeCategoryDoc ? 'Category Focus' : 'All Publications'}
        </span>

        <h1
          style={{
            fontSize: '2.4rem',
            color: '#0f172a',
            margin: '8px 0 12px',
          }}
        >
          {activeCategoryDoc ? activeCategoryDoc.name : 'Research & Technology Insights'}
        </h1>

        <p style={{ color: '#475569', maxWidth: 780, fontSize: '1.05rem', lineHeight: 1.6 }}>
          {activeCategoryDoc
            ? activeCategoryDoc.description
            : 'Explore Softrate’s complete catalogue of architectural research, benchmark evaluations, software engineering theories, and technical whitepapers.'}
        </p>
      </div>

      {/* Filter and Search Bar Controls */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 32,
        }}
      >
        {/* Category Pill Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            overflowX: 'auto',
            paddingBottom: 8,
            maxWidth: '100%',
          }}
        >
          <button
            onClick={() => handleSelectCategory('all')}
            style={{
              padding: '6px 14px',
              borderRadius: 20,
              fontSize: '0.84rem',
              fontWeight: 600,
              backgroundColor: !slug ? '#0f172a' : '#f1f5f9',
              color: !slug ? '#ffffff' : '#475569',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}
          >
            All Articles
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleSelectCategory(cat.slug)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                fontSize: '0.84rem',
                fontWeight: 600,
                backgroundColor: slug === cat.slug ? '#e42525' : '#f1f5f9',
                color: slug === cat.slug ? '#ffffff' : '#475569',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}
            >
              {cat.name} {cat.postCount ? `(${cat.postCount})` : ''}
            </button>
          ))}
        </div>

        {/* Keyword Search Input */}
        <form
          onSubmit={handleSearchSubmit}
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: 20,
            padding: '6px 14px',
            width: 280,
          }}
        >
          <Search size={16} color="#64748b" style={{ marginRight: 8 }} />
          <input
            type="text"
            placeholder="Search within articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              outline: 'none',
              fontSize: '0.88rem',
              width: '100%',
              background: 'transparent',
            }}
          />
          {searchQuery && (
            <button type="button" onClick={clearSearch} style={{ color: '#94a3b8' }}>
              <X size={15} />
            </button>
          )}
        </form>
      </div>

      {/* Articles Count Feedback */}
      <div style={{ marginBottom: 24, fontSize: '0.88rem', color: '#64748b' }}>
        Showing <strong>{posts.length}</strong> of <strong>{totalPosts}</strong> publications
        {searchQuery && <span> matching "<strong>{searchQuery}</strong>"</span>}
      </div>

      {/* Grid of Blog Posts */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#64748b' }}>
          Loading publications...
        </div>
      ) : posts.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '80px 20px',
            backgroundColor: '#ffffff',
            borderRadius: 8,
            border: '1px solid #e2e8f0',
          }}
        >
          <BookOpen size={40} style={{ margin: '0 auto 16px', color: '#94a3b8' }} />
          <h3 style={{ color: '#0f172a', marginBottom: 8 }}>No articles found</h3>
          <p style={{ color: '#64748b', fontSize: '0.92rem', maxWidth: 400, margin: '0 auto 20px' }}>
            We could not find any publications matching your current filter criteria.
          </p>
          <button
            onClick={() => {
              navigate('/blogs');
              setSearchQuery('');
            }}
            style={{
              padding: '8px 20px',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              borderRadius: 4,
              fontSize: '0.88rem',
              fontWeight: 600,
            }}
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="articles-grid">
          {posts.map((post) => (
            <BlogCard key={post._id} post={post} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 12,
            marginTop: 56,
          }}
        >
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '8px 16px',
              border: '1px solid #cbd5e1',
              borderRadius: 4,
              backgroundColor: '#ffffff',
              color: currentPage === 1 ? '#cbd5e1' : '#1e293b',
              fontWeight: 600,
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            }}
          >
            <ChevronLeft size={16} /> Previous
          </button>

          <span style={{ fontSize: '0.9rem', color: '#475569' }}>
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '8px 16px',
              border: '1px solid #cbd5e1',
              borderRadius: 4,
              backgroundColor: '#ffffff',
              color: currentPage === totalPages ? '#cbd5e1' : '#1e293b',
              fontWeight: 600,
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            }}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

