import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, Clock, Eye } from 'lucide-react';

export default function TrendingStrip({ trendingPosts = [] }) {
  if (!trendingPosts || trendingPosts.length === 0) return null;

  return (
    <section className="trending-strip">
      <div className="container">
        <div className="trending-header">
          <Flame size={20} className="trending-flame-icon" />
          <span>Trending & Popular Research</span>
        </div>

        <div className="trending-list">
          {trendingPosts.slice(0, 4).map((post, idx) => (
            <Link
              key={post._id}
              to={`/blog/${post.slug}`}
              className="trending-item"
            >
              <span className="trending-number">0{idx + 1}</span>
              <div className="trending-item-content">
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: post.category?.accentColor || '#e42525',
                    display: 'block',
                    marginBottom: 4,
                  }}
                >
                  {post.category?.name || 'Research'}
                </span>
                <h4>{post.title}</h4>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    fontSize: '0.75rem',
                    color: '#94a3b8',
                    marginTop: 4,
                  }}
                >
                  <span>{post.readTime}</span>
                  {post.views > 0 && (
                    <>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Eye size={12} /> {post.views} views
                      </span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

