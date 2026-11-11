import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Calendar, ArrowRight, User } from 'lucide-react';
import PlaceholderThumbnail from './PlaceholderThumbnail';

export default function BlogCard({ post }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/blog/${post.slug}`);
  };

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  const categoryName = post.category?.name || 'Technology';
  const accentColor = post.category?.accentColor || '#e42525';

  return (
    <article className="blog-card" onClick={handleCardClick} role="button" tabIndex={0}>
      {/* Modern Visual Placeholder Thumbnail */}
      <div className="blog-card-thumb">
        <PlaceholderThumbnail
          title={post.title}
          categoryName={categoryName}
          accentColor={accentColor}
          coverImage={post.coverImage}
        />
      </div>

      <div className="blog-card-content">
        {/* Zoho Style Category & Read Time Header */}
        <div className="zoho-card-meta-top">
          <span className="zoho-card-category" style={{ color: accentColor }}>
            {categoryName}
          </span>
          <span className="zoho-card-readtime">
            <Clock size={12} />
            <span>{post.readTime || '5 min read'}</span>
          </span>
        </div>

        {/* Title matching Zoho Semi-bold Sans-serif */}
        <h3 className="blog-card-title" title={post.title}>
          {post.title}
        </h3>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="blog-card-excerpt">
            {post.excerpt}
          </p>
        )}

        {/* Zoho Author & Date Footer */}
        <div className="zoho-card-footer">
          <div className="zoho-author-line">
            By <span className="zoho-author-name">{post.author || 'Softrate Research'}</span>
          </div>
          {formattedDate && (
            <div className="zoho-date-line">
              <Calendar size={12} />
              <span>{formattedDate}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

