import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Save,
  ArrowLeft,
  Eye,
  Edit3,
  Calendar,
  Globe,
  Tag,
  CheckCircle,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import RichContentRenderer from '../components/RichContentRenderer';
import PlaceholderThumbnail from '../components/PlaceholderThumbnail';
import { api } from '../services/api';

export default function AdminEditor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('edit'); // 'edit' | 'preview'
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    author: 'Softrate Engineering',
    excerpt: '',
    content: '',
    coverImage: '',
    tags: '',
    readTime: '5 min read',
    status: 'published',
    isFeatured: false,
    isTrending: false,
    publishedAt: new Date().toISOString().split('T')[0],
    seoMetaTitle: '',
    seoMetaDescription: '',
  });

  // Verify auth
  useEffect(() => {
    const token = localStorage.getItem('softrate_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    const init = async () => {
      setLoading(true);
      try {
        const cats = await api.getCategories();
        setCategories(cats);

        if (id) {
          // Editing existing article - find by ID or get by slug
          const allData = await api.getPosts({ status: 'all', limit: 100 });
          const target = (allData.posts || []).find((p) => p._id === id);
          if (target) {
            setFormData({
              title: target.title || '',
              slug: target.slug || '',
              category: target.category?._id || target.category || '',
              author: target.author || 'Softrate Engineering',
              excerpt: target.excerpt || '',
              content: target.content || '',
              coverImage: target.coverImage || '',
              tags: Array.isArray(target.tags) ? target.tags.join(', ') : '',
              readTime: target.readTime || '5 min read',
              status: target.status || 'published',
              isFeatured: Boolean(target.isFeatured),
              isTrending: Boolean(target.isTrending),
              publishedAt: target.publishedAt ? new Date(target.publishedAt).toISOString().split('T')[0] : '',
              seoMetaTitle: target.seo?.metaTitle || '',
              seoMetaDescription: target.seo?.metaDescription || '',
            });
          }
        } else if (cats.length > 0) {
          // New post default category
          setFormData((prev) => ({ ...prev, category: cats[0]._id }));
        }
      } catch (err) {
        console.error('Editor loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [id, navigate]);

  // Auto-generate slug and read-time on title / content changes
  const handleTitleChange = (val) => {
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: prev.slug === '' || prev.slug === autoSlug.slice(0, -1) ? autoSlug : prev.slug,
      seoMetaTitle: prev.seoMetaTitle === '' ? `${val} | Softrate` : prev.seoMetaTitle,
    }));
  };

  const handleContentChange = (val) => {
    const words = val.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    setFormData((prev) => ({
      ...prev,
      content: val,
      readTime: `${minutes} min read`,
      excerpt: prev.excerpt === '' ? val.slice(0, 160).replace(/[#*`_]/g, '') : prev.excerpt,
      seoMetaDescription: prev.seoMetaDescription === '' ? val.slice(0, 155).replace(/[#*`_]/g, '') : prev.seoMetaDescription,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.category) {
      setMessage({ type: 'error', text: 'Title, category, and markdown content are required.' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = {
        title: formData.title,
        slug: formData.slug,
        category: formData.category,
        author: formData.author,
        excerpt: formData.excerpt,
        content: formData.content,
        coverImage: formData.coverImage,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        readTime: formData.readTime,
        status: formData.status,
        isFeatured: formData.isFeatured,
        isTrending: formData.isTrending,
        publishedAt: new Date(formData.publishedAt),
        seo: {
          metaTitle: formData.seoMetaTitle || formData.title,
          metaDescription: formData.seoMetaDescription || formData.excerpt,
        },
      };

      if (id) {
        await api.updatePost(id, payload);
        setMessage({ type: 'success', text: 'Article updated successfully!' });
      } else {
        const newPost = await api.createPost(payload);
        setMessage({ type: 'success', text: 'Article published successfully!' });
        setTimeout(() => navigate(`/admin`), 1200);
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to save article.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 24px', textAlign: 'center', color: '#64748b' }}>
        Loading article editor...
      </div>
    );
  }

  const selectedCatObj = categories.find((c) => c._id === formData.category);

  return (
    <div className="container" style={{ padding: '36px 24px 80px' }}>
      {/* Editor Header Navigation */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <Link
          to="/admin"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.88rem',
            color: '#64748b',
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        {/* Tab Switcher: Editor vs Live Preview */}
        <div style={{ display: 'flex', gap: 6, backgroundColor: '#e2e8f0', padding: 3, borderRadius: 6 }}>
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 4,
              fontSize: '0.84rem',
              fontWeight: 600,
              backgroundColor: activeTab === 'edit' ? '#ffffff' : 'transparent',
              color: activeTab === 'edit' ? '#0f172a' : '#64748b',
              boxShadow: activeTab === 'edit' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            <Edit3 size={14} /> Markdown Editor
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 4,
              fontSize: '0.84rem',
              fontWeight: 600,
              backgroundColor: activeTab === 'preview' ? '#ffffff' : 'transparent',
              color: activeTab === 'preview' ? '#0f172a' : '#64748b',
              boxShadow: activeTab === 'preview' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            <Eye size={14} /> Live Reader Preview
          </button>
        </div>
      </div>

      {message.text && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: 6,
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: '0.9rem',
            backgroundColor: message.type === 'error' ? '#fef2f2' : '#f0fdf4',
            border: `1px solid ${message.type === 'error' ? '#fecaca' : '#bbf7d0'}`,
            color: message.type === 'error' ? '#dc2626' : '#16a34a',
          }}
        >
          {message.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Form or Preview */}
      {activeTab === 'preview' ? (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 8,
            border: '1px solid #e2e8f0',
            padding: '48px',
            maxWidth: 860,
            margin: '0 auto',
          }}
        >
          <span
            className="category-badge"
            style={{
              backgroundColor: `${selectedCatObj?.accentColor || '#e42525'}14`,
              color: selectedCatObj?.accentColor || '#e42525',
              border: `1px solid ${selectedCatObj?.accentColor || '#e42525'}28`,
            }}
          >
            {selectedCatObj?.name || 'Category'}
          </span>
          <h1 style={{ fontSize: '2.4rem', color: '#0f172a', margin: '16px 0' }}>
            {formData.title || 'Untitled Article'}
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#475569', marginBottom: 24 }}>
            {formData.excerpt}
          </p>

          <div
            style={{
              height: 320,
              borderRadius: 8,
              overflow: 'hidden',
              marginBottom: 36,
              border: '1px solid #e2e8f0',
            }}
          >
            <PlaceholderThumbnail
              title={formData.title}
              categoryName={selectedCatObj?.name}
              accentColor={selectedCatObj?.accentColor}
              coverImage={formData.coverImage}
            />
          </div>

          <RichContentRenderer content={formData.content} />
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: 32 }}>
            {/* Left Main Column: Content, Title, Excerpt */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Title Input */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  padding: 24,
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                }}
              >
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    color: '#1e293b',
                    marginBottom: 8,
                  }}
                >
                  Article Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Towards a Theory of Software Development Expertise"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    fontSize: '1.15rem',
                    fontWeight: 600,
                    borderRadius: 4,
                    border: '1px solid #cbd5e1',
                    outline: 'none',
                  }}
                  required
                />

                {/* Slug Input */}
                <div style={{ marginTop: 14 }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#64748b',
                      marginBottom: 4,
                    }}
                  >
                    URL Slug
                  </label>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #cbd5e1',
                      borderRadius: 4,
                      padding: '6px 12px',
                      fontSize: '0.85rem',
                      color: '#64748b',
                    }}
                  >
                    <span>/blog/</span>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, slug: e.target.value }))
                      }
                      style={{
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                        width: '100%',
                        fontWeight: 600,
                        color: '#0f172a',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Markdown Content Area */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  padding: 24,
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}
                >
                  <label
                    style={{
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      color: '#1e293b',
                    }}
                  >
                    Article Body (Markdown) *
                  </label>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Calculated: <strong>{formData.readTime}</strong>
                  </span>
                </div>

                <textarea
                  rows={20}
                  value={formData.content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="## Introduction&#10;&#10;Write peer-reviewed insights using Markdown formatting..."
                  style={{
                    width: '100%',
                    padding: '14px',
                    fontFamily: 'JetBrains Mono, SFMono-Regular, monospace',
                    fontSize: '0.92rem',
                    lineHeight: 1.6,
                    borderRadius: 4,
                    border: '1px solid #cbd5e1',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                  required
                />
              </div>

              {/* Excerpt */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  padding: 24,
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                }}
              >
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    color: '#1e293b',
                    marginBottom: 6,
                  }}
                >
                  Executive Summary / Excerpt
                </label>
                <textarea
                  rows={3}
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
                  }
                  placeholder="Brief 1-2 sentence synopsis displayed on article cards..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    fontSize: '0.9rem',
                    borderRadius: 4,
                    border: '1px solid #cbd5e1',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Right Column: Metadata, Publishing, SEO, Cover Image */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Publishing Workflow Card */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  padding: 24,
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                }}
              >
                <h3 style={{ fontSize: '1.05rem', color: '#0f172a', marginBottom: 16 }}>
                  Publishing Settings
                </h3>

                <div style={{ marginBottom: 14 }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: '#475569',
                      marginBottom: 6,
                    }}
                  >
                    Workflow Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, status: e.target.value }))
                    }
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 4,
                      border: '1px solid #cbd5e1',
                      fontSize: '0.88rem',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <option value="published">Published (Live)</option>
                    <option value="draft">Draft (Private)</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: '#475569',
                      marginBottom: 6,
                    }}
                  >
                    Publication Date
                  </label>
                  <input
                    type="date"
                    value={formData.publishedAt}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, publishedAt: e.target.value }))
                    }
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 4,
                      border: '1px solid #cbd5e1',
                      fontSize: '0.88rem',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}>
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))
                      }
                    />
                    <span>Highlight in Hero Featured Section</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}>
                    <input
                      type="checkbox"
                      checked={formData.isTrending}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, isTrending: e.target.checked }))
                      }
                    />
                    <span>Feature in Trending Strip</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    width: '100%',
                    marginTop: 20,
                    padding: '12px',
                    backgroundColor: '#e42525',
                    color: '#ffffff',
                    fontWeight: 700,
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    fontSize: '0.95rem',
                    cursor: saving ? 'not-allowed' : 'pointer',
                  }}
                >
                  <Save size={16} /> {saving ? 'Saving...' : id ? 'Update Publication' : 'Publish Article'}
                </button>
              </div>

              {/* Category & Author Card */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  padding: 24,
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                }}
              >
                <div style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: '#475569',
                      marginBottom: 6,
                    }}
                  >
                    Primary Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, category: e.target.value }))
                    }
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 4,
                      border: '1px solid #cbd5e1',
                      fontSize: '0.88rem',
                      backgroundColor: '#ffffff',
                    }}
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: '#475569',
                      marginBottom: 6,
                    }}
                  >
                    Author(s) Attribution
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Jane Doe, Dr. Alex Smith"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, author: e.target.value }))
                    }
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 4,
                      border: '1px solid #cbd5e1',
                      fontSize: '0.88rem',
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: '#475569',
                      marginBottom: 6,
                    }}
                  >
                    Topic Tags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Cloud, Kubernetes, Microservices"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, tags: e.target.value }))
                    }
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 4,
                      border: '1px solid #cbd5e1',
                      fontSize: '0.88rem',
                    }}
                  />
                </div>
              </div>

              {/* Cover Image URL / Fallback Visualizer */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  padding: 24,
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                }}
              >
                <h4 style={{ fontSize: '0.95rem', color: '#0f172a', marginBottom: 12 }}>
                  Cover Image
                </h4>
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg (Optional)"
                  value={formData.coverImage}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, coverImage: e.target.value }))
                  }
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 4,
                    border: '1px solid #cbd5e1',
                    fontSize: '0.88rem',
                    marginBottom: 12,
                  }}
                />

                <span style={{ fontSize: '0.76rem', color: '#64748b', display: 'block', marginBottom: 12 }}>
                  * Leave empty to automatically use Softrate's minimalist geometric SVG pattern generator.
                </span>

                <div style={{ height: 140, borderRadius: 6, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                  <PlaceholderThumbnail
                    title={formData.title}
                    categoryName={selectedCatObj?.name}
                    accentColor={selectedCatObj?.accentColor}
                    coverImage={formData.coverImage}
                  />
                </div>
              </div>

              {/* SEO Meta & Google SERP Snippet Preview */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  padding: 24,
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
                  <Globe size={16} color="#0f62fe" />
                  <h4 style={{ fontSize: '0.95rem', color: '#0f172a' }}>
                    SEO Meta & Google Search Preview
                  </h4>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#64748b', marginBottom: 4 }}>
                    SEO Meta Title
                  </label>
                  <input
                    type="text"
                    value={formData.seoMetaTitle}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, seoMetaTitle: e.target.value }))
                    }
                    placeholder="Page title displayed in search engines"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 4,
                      border: '1px solid #cbd5e1',
                      fontSize: '0.84rem',
                    }}
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#64748b', marginBottom: 4 }}>
                    SEO Meta Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.seoMetaDescription}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, seoMetaDescription: e.target.value }))
                    }
                    placeholder="150-160 characters summary"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 4,
                      border: '1px solid #cbd5e1',
                      fontSize: '0.84rem',
                    }}
                  />
                </div>

                {/* Google SERP Snippet Preview Box */}
                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    padding: 14,
                    borderRadius: 6,
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div style={{ fontSize: '0.75rem', color: '#475569', marginBottom: 2 }}>
                    https://softrate.io › blog › {formData.slug || 'slug'}
                  </div>
                  <div
                    style={{
                      fontSize: '0.95rem',
                      color: '#1a0dab',
                      fontWeight: 600,
                      lineHeight: 1.3,
                      marginBottom: 4,
                    }}
                  >
                    {formData.seoMetaTitle || `${formData.title || 'Untitled Article'} | Softrate`}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#4d5156', lineHeight: 1.4 }}>
                    {formData.seoMetaDescription ||
                      formData.excerpt ||
                      'In-depth software engineering and corporate technology insights from Softrate.'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

