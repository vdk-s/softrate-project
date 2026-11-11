import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, CheckCircle, AlertCircle, Folder, Trash2 } from 'lucide-react';
import { api } from '../services/api';

export default function CategoryManagePage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [accentColor, setAccentColor] = useState('#e42525');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('softrate_token');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    loadCategories();
  }, [token, navigate]);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (val) => {
    setName(val);
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(autoSlug);
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      await api.createCategory({
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),
        accentColor,
      });

      setMessage({ type: 'success', text: `Category "${name}" created successfully!` });
      setName('');
      setSlug('');
      setDescription('');
      loadCategories();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to create category' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '36px 24px 80px' }}>
      <div style={{ marginBottom: 24 }}>
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
      </div>

      <div style={{ marginBottom: 32 }}>
        <span
          style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#e42525',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          Taxonomy Management
        </span>
        <h1 style={{ fontSize: '2rem', color: '#0f172a', margin: '4px 0' }}>
          Category & Topic Classifications
        </h1>
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

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 36 }}>
        {/* Existing Categories List */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 8,
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '18px 24px', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#0f172a' }}>
              Active Categories ({categories.length})
            </h3>
          </div>

          <div style={{ padding: '8px 0' }}>
            {categories.map((cat) => (
              <div
                key={cat._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 24px',
                  borderBottom: '1px solid #f8fafc',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: cat.accentColor || '#e42525',
                    }}
                  />
                  <div>
                    <h4 style={{ fontSize: '0.96rem', color: '#0f172a', fontWeight: 600 }}>
                      {cat.name}
                    </h4>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      slug: <code>{cat.slug}</code>
                    </span>
                    {cat.description && (
                      <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: 2 }}>
                        {cat.description}
                      </p>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: 12,
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      backgroundColor: '#f1f5f9',
                      color: '#475569',
                    }}
                  >
                    {cat.postCount || 0} articles
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add New Category Form */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 8,
            border: '1px solid #e2e8f0',
            padding: 24,
            height: 'fit-content',
          }}
        >
          <h3 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: 18 }}>
            Add New Category
          </h3>

          <form onSubmit={handleCreateCategory} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                Category Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Distributed Computing"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 4,
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                URL Slug
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 4,
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Brief editorial scope for this category..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 4,
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: 6 }}>
                Accent Color
              </label>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  style={{ width: 44, height: 36, border: 'none', cursor: 'pointer', background: 'none' }}
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 4,
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    width: 120,
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                marginTop: 8,
                padding: '12px',
                backgroundColor: '#e42525',
                color: '#ffffff',
                fontWeight: 600,
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                cursor: submitting ? 'not-allowed' : 'pointer',
              }}
            >
              <Plus size={16} /> {submitting ? 'Creating...' : 'Create Category'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

