import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, BookOpen, Layers } from 'lucide-react';
import FeaturedHero from '../components/FeaturedHero';
import TrendingStrip from '../components/TrendingStrip';
import BlogCard from '../components/BlogCard';
import NewsletterBar from '../components/NewsletterBar';
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

export default function HomePage() {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [feat, trend, cats, latest] = await Promise.all([
          api.getFeaturedPosts(),
          api.getTrendingPosts(),
          api.getCategories(),
          api.getPosts({ limit: 6, status: 'published' }),
        ]);

        setFeaturedPosts(feat);
        setTrendingPosts(trend);
        setCategories(cats);
        setLatestPosts(latest.posts || []);
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter latest articles by category pill
  const handleCategoryFilter = async (slug) => {
    setSelectedCategory(slug);
    try {
      const data = await api.getPosts({
        category: slug === 'all' ? undefined : slug,
        limit: 6,
        status: 'published',
      });
      setLatestPosts(data.posts || []);
    } catch (err) {
      console.error('Filter error:', err);
    }
  };

  return (
    <main>
      <div className="container">
        {/* Featured Hero (Asymmetrical 1 main + 2 secondary stack) */}
        <FeaturedHero featuredPosts={featuredPosts} />
      </div>

      {/* Trending / Popular Strip */}
      <TrendingStrip trendingPosts={trendingPosts} />

      {/* Latest Articles Section */}
      <section className="articles-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Latest Perspectives & Research</h2>
              <p style={{ color: '#64748b', fontSize: '0.92rem', marginTop: 8 }}>
                Peer-reviewed analysis, technical guides, and thought leadership from the Softrate engineering collective.
              </p>
            </div>
            <Link to="/blogs" className="section-view-all">
              <span>Explore all articles</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Category Quick Filter Pills */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              overflowX: 'auto',
              paddingBottom: 16,
              marginBottom: 24,
            }}
          >
            <button
              onClick={() => handleCategoryFilter('all')}
              style={{
                padding: '6px 16px',
                borderRadius: 20,
                fontSize: '0.84rem',
                fontWeight: 600,
                backgroundColor: selectedCategory === 'all' ? '#0f172a' : '#f1f5f9',
                color: selectedCategory === 'all' ? '#ffffff' : '#475569',
                transition: 'all 0.2s',
              }}
            >
              All Research
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => handleCategoryFilter(cat.slug)}
                style={{
                  padding: '6px 16px',
                  borderRadius: 20,
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  backgroundColor:
                    selectedCategory === cat.slug ? '#e42525' : '#f1f5f9',
                  color: selectedCategory === cat.slug ? '#ffffff' : '#475569',
                  transition: 'all 0.2s',
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* 3-Column Latest Articles Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
              Loading Softrate publications...
            </div>
          ) : latestPosts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#64748b' }}>
              No articles currently published in this category.
            </div>
          ) : (
            <div className="articles-grid">
              {latestPosts.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>
          )}

          {/* View All Button */}
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link
              to="/blogs"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 28px',
                border: '1px solid #0f172a',
                borderRadius: 4,
                color: '#0f172a',
                fontWeight: 600,
                fontSize: '0.92rem',
                backgroundColor: '#ffffff',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#0f172a';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.color = '#0f172a';
              }}
            >
              <span>Browse Complete Publication Archive</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Corporate Newsletter Bar */}
      <NewsletterBar />
    </main>
  );
}

