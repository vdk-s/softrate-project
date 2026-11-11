import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Calendar, User, ArrowRight } from 'lucide-react';
import PlaceholderThumbnail from './PlaceholderThumbnail';

export default function FeaturedHero({ featuredPosts = [] }) {
  const navigate = useNavigate();

  if (!featuredPosts || featuredPosts.length === 0) return null;

  const mainPost = featuredPosts[0];
  const secondaryPosts = featuredPosts.slice(1, 3);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <section className="hero-section">
      <div className="hero-grid">
        {/* Main Prominent Featured Article (Left Column) */}
        {mainPost && (
          <article
            className="main-featured-card"
            onClick={() => navigate(`/blog/${mainPost.slug}`)}
            role="button"
            tabIndex={0}
          >
            <div className="main-featured-thumb">
              <PlaceholderThumbnail
                title={mainPost.title}
                categoryName={mainPost.category?.name || 'Featured'}
                accentColor={mainPost.category?.accentColor || '#e42525'}
                coverImage={mainPost.coverImage}
              />
            </div>

            <div className="main-featured-content">
              {/* Category & Read Time Row */}
              <div className="zoho-card-meta-top">
                <span
                  className="zoho-card-category"
                  style={{ color: mainPost.category?.accentColor || '#e11d48' }}
                >
                  {mainPost.category?.name || 'Featured'}
                </span>
                <span className="zoho-card-readtime">
                  <Clock size={12} />
                  <span>{mainPost.readTime}</span>
                </span>
              </div>

              {/* Hero Main Title */}
              <h2 className="main-featured-title">
                {mainPost.title}
              </h2>

              {/* Description Text */}
              <p className="main-featured-excerpt">
                {mainPost.excerpt}
              </p>

              {/* Minimalist Author & Date Footer */}
              <div className="zoho-card-footer" style={{ marginTop: 'auto', paddingTop: 16 }}>
                <div className="zoho-author-line">
                  By <span className="zoho-author-name">{mainPost.author}</span>
                </div>
                {mainPost.publishedAt && (
                  <div className="zoho-date-line">
                    <Calendar size={12} />
                    <span>{formatDate(mainPost.publishedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </article>
        )}

        {/* Secondary Highlighted Articles (Right Column Stack) */}
        <div className="secondary-featured-stack">
          {secondaryPosts.map((post) => (
            <article
              key={post._id}
              className="secondary-featured-card"
              onClick={() => navigate(`/blog/${post.slug}`)}
              role="button"
              tabIndex={0}
            >
              <div className="secondary-featured-thumb">
                <PlaceholderThumbnail
                  title={post.title}
                  categoryName={post.category?.name || 'Perspective'}
                  accentColor={post.category?.accentColor || '#0f62fe'}
                  coverImage={post.coverImage}
                />
              </div>

              <div className="secondary-featured-content">
                {/* Category & Read Time Row */}
                <div className="zoho-card-meta-top">
                  <span
                    className="zoho-card-category"
                    style={{ color: post.category?.accentColor || '#0072c3' }}
                  >
                    {post.category?.name || 'Perspective'}
                  </span>
                  <span className="zoho-card-readtime">
                    <Clock size={12} />
                    <span>{post.readTime}</span>
                  </span>
                </div>

                {/* Secondary Title */}
                <h3 className="secondary-featured-title">
                  {post.title}
                </h3>

                {/* Secondary Excerpt */}
                <p className="secondary-featured-excerpt">
                  {post.excerpt}
                </p>

                {/* Minimalist Author & Date Footer */}
                <div className="zoho-card-footer" style={{ marginTop: 'auto', paddingTop: 10 }}>
                  <div className="zoho-author-line">
                    By <span className="zoho-author-name">{post.author}</span>
                  </div>
                  {post.publishedAt && (
                    <div className="zoho-date-line">
                      <Calendar size={12} />
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
