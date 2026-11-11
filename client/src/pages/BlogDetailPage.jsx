import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Clock, Calendar, Eye, ChevronLeft, ChevronRight, User, Tag, ArrowLeft } from 'lucide-react';
import PlaceholderThumbnail from '../components/PlaceholderThumbnail';
import TOC from '../components/TOC';
import ShareButtons from '../components/ShareButtons';
import BlogCard from '../components/BlogCard';
import RichContentRenderer, { extractHeadings } from '../components/RichContentRenderer';
import { api } from '../services/api';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [prevPost, setPrevPost] = useState(null);
  const [nextPost, setNextPost] = useState(null);
  const [headings, setHeadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      setError(null);
      window.scrollTo(0, 0);

      try {
        const data = await api.getPostBySlug(slug);
        setPost(data.post);
        setRelatedPosts(data.relatedPosts || []);
        setPrevPost(data.prevPost || null);
        setNextPost(data.nextPost || null);

        // Extract headings for the sticky TOC
        if (data.post?.content) {
          const extracted = extractHeadings(data.post.content);
          setHeadings(extracted);
        }

        // Update Document Title, Open Graph and JSON-LD schema
        document.title = `${data.post.seo?.metaTitle || data.post.title} | Softrate`;

        // Inject Schema.org JSON-LD
        const scriptId = 'jsonld-blog-posting';
        let script = document.getElementById(scriptId);
        if (!script) {
          script = document.createElement('script');
          script.id = scriptId;
          script.type = 'application/ld+json';
          document.head.appendChild(script);
        }
        script.text = JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: data.post.title,
          description: data.post.excerpt,
          articleBody: data.post.content.slice(0, 500),
          author: {
            '@type': 'Person',
            name: data.post.author,
          },
          datePublished: data.post.publishedAt,
          dateModified: data.post.updatedAt || data.post.publishedAt,
          publisher: {
            '@type': 'Organization',
            name: 'Softrate',
            url: window.location.origin,
            logo: {
              '@type': 'ImageObject',
              url: `${window.location.origin}/assets/softrate-logo.png`,
            },
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': window.location.href,
          },
        });
      } catch (err) {
        console.error('Error loading article:', err);
        setError('Article not found or unavailable.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();

    return () => {
      const script = document.getElementById('jsonld-blog-posting');
      if (script) script.remove();
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '120px 24px', textAlign: 'center', color: '#64748b' }}>
        Loading publication...
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container" style={{ padding: '100px 24px', textAlign: 'center' }}>
        <h2 style={{ color: '#0f172a', marginBottom: 12 }}>Article Not Found</h2>
        <p style={{ color: '#64748b', marginBottom: 24 }}>The requested publication could not be found or has been moved.</p>
        <Link
          to="/blogs"
          style={{
            padding: '10px 20px',
            backgroundColor: '#e42525',
            color: '#ffffff',
            borderRadius: 4,
            fontWeight: 600,
          }}
        >
          Return to Blog Archive
        </Link>
      </div>
    );
  }

  const categoryName = post.category?.name || 'General';
  const accentColor = post.category?.accentColor || '#e42525';
  const formattedDate = new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="detail-page-container">
      <div className="container">
        {/* Back Link */}
        <div style={{ marginBottom: 20 }}>
          <Link
            to="/blogs"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.86rem',
              color: '#64748b',
              fontWeight: 500,
            }}
          >
            <ArrowLeft size={14} /> Back to all publications
          </Link>
        </div>

        {/* Article Header */}
        <header className="detail-header">
          <Link
            to={`/category/${post.category?.slug}`}
            className="category-badge"
            style={{
              backgroundColor: `${accentColor}14`,
              color: accentColor,
              border: `1px solid ${accentColor}28`,
            }}
          >
            {categoryName}
          </Link>

          <h1 className="detail-title">{post.title}</h1>

          <p style={{ fontSize: '1.2rem', color: '#475569', lineHeight: 1.6, marginBottom: 24 }}>
            {post.excerpt}
          </p>
        </header>

        {/* Metadata & Social Share Bar */}
        <div className="detail-meta-bar">
          <div className="author-block">
            <div className="author-avatar" style={{ backgroundColor: `${accentColor}20`, color: accentColor }}>
              {post.author ? post.author.charAt(0) : 'S'}
            </div>
            <div className="author-info">
              <h4>{post.author || 'Softrate Research Staff'}</h4>
              <span>
                {post.readTime} • Published on {formattedDate} • {post.views} views
              </span>
            </div>
          </div>

          <ShareButtons title={post.title} url={window.location.href} />
        </div>

        {/* Main Content Layout with Sticky TOC Sidebar */}
        <div className="post-layout-grid">
          {/* Rich Content Body */}
          <main>
            {/* Visual Cover Feature (Placeholder Thumbnail or Image) */}
            <div
              style={{
                borderRadius: 8,
                overflow: 'hidden',
                height: 380,
                marginBottom: 40,
                border: '1px solid #e2e8f0',
              }}
            >
              <PlaceholderThumbnail
                title={post.title}
                categoryName={categoryName}
                accentColor={accentColor}
                coverImage={post.coverImage}
                height="100%"
              />
            </div>

            {/* Markdown Body */}
            <RichContentRenderer content={post.content} />

            {/* Tags Cloud */}
            {post.tags && post.tags.length > 0 && (
              <div
                style={{
                  marginTop: 48,
                  paddingTop: 24,
                  borderTop: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: '0.84rem',
                    color: '#64748b',
                    fontWeight: 600,
                    marginRight: 6,
                  }}
                >
                  <Tag size={14} /> Topic Tags:
                </span>
                {post.tags.map((tag, idx) => (
                  <Link
                    key={idx}
                    to={`/blogs?search=${encodeURIComponent(tag)}`}
                    style={{
                      fontSize: '0.8rem',
                      color: '#334155',
                      backgroundColor: '#f1f5f9',
                      padding: '4px 10px',
                      borderRadius: 16,
                      fontWeight: 500,
                    }}
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Next / Prev Navigation Bar */}
            <nav className="post-pagination-bar" aria-label="Adjacent articles">
              {prevPost ? (
                <Link to={`/blog/${prevPost.slug}`} className="post-pag-card">
                  <div className="post-pag-label">
                    <ChevronLeft size={14} /> Previous Publication
                  </div>
                  <div className="post-pag-title">{prevPost.title}</div>
                </Link>
              ) : (
                <div />
              )}

              {nextPost ? (
                <Link
                  to={`/blog/${nextPost.slug}`}
                  className="post-pag-card"
                  style={{ textAlign: 'right' }}
                >
                  <div className="post-pag-label" style={{ justifyContent: 'flex-end' }}>
                    Next Publication <ChevronRight size={14} />
                  </div>
                  <div className="post-pag-title">{nextPost.title}</div>
                </Link>
              ) : (
                <div />
              )}
            </nav>
          </main>

          {/* Sticky Table of Contents Sidebar */}
          <div>
            <TOC headings={headings} />
          </div>
        </div>

        {/* Related Articles Section */}
        {relatedPosts.length > 0 && (
          <section style={{ marginTop: 64, paddingTop: 48, borderTop: '2px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#0f172a', marginBottom: 28 }}>
              Related Research & Publications
            </h3>
            <div className="articles-grid">
              {relatedPosts.map((rel) => (
                <BlogCard key={rel._id} post={rel} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}

