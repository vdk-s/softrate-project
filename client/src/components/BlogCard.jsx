import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Calendar, ArrowRight, User, Edit } from 'lucide-react';
import PlaceholderThumbnail from './PlaceholderThumbnail';

export default function BlogCard({ post }) {
  const navigate = useNavigate();
  const isAdmin = Boolean(localStorage.getItem('softrate_token'));

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
      <div className="blog-card-thumb" style={{ position: 'relative' }}>
        {isAdmin && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/editor/${post._id}`);
            }}
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              zIndex: 10,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '5px 10px',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              fontSize: '0.72rem',
              fontWeight: 600,
              borderRadius: 4,
              boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
              cursor: 'pointer',
            }}
            title="Edit Article (Admin Privilege)"
          >
            <Edit size={12} /> Edit
          </button>
        )}
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

